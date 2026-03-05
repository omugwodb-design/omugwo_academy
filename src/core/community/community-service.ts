import { supabase } from "../../lib/supabase";

// â”€â”€â”€ Spaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getSpaces = async () => {
  const { data, error } = await supabase
    .from("community_spaces")
    .select("*, members:community_space_members(count), posts:community_posts(count)")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((s: any) => ({
    ...s,
    memberCount: s.members?.[0]?.count || 0,
    postCount: s.posts?.[0]?.count || 0,
  }));
};

export const getSpace = async (spaceId: string) => {
  const { data, error } = await supabase
    .from("community_spaces")
    .select("*")
    .eq("id", spaceId)
    .single();
  if (error) throw error;
  return data;
};

export const joinSpace = async (spaceId: string, userId: string) => {
  const { error } = await supabase
    .from("community_space_members")
    .upsert({ space_id: spaceId, user_id: userId, joined_at: new Date().toISOString() }, { onConflict: "space_id,user_id" });
  if (error) throw error;
};

export const leaveSpace = async (spaceId: string, userId: string) => {
  const { error } = await supabase
    .from("community_space_members")
    .delete()
    .eq("space_id", spaceId)
    .eq("user_id", userId);
  if (error) throw error;
};

// â”€â”€â”€ Posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getPosts = async (filters?: {
  spaceId?: string;
  search?: string;
  sortBy?: "recent" | "popular" | "trending";
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from("community_posts")
    .select("*, author:profiles(id, full_name, avatar_url, role), space:community_spaces(id, name, icon, color), likes:community_likes(count), comments:community_comments(count)")
    .order("created_at", { ascending: false });

  if (filters?.spaceId) query = query.eq("space_id", filters.spaceId);
  if (filters?.search) query = query.ilike("content", `%${filters.search}%`);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((p: any) => ({
    ...p,
    likesCount: p.likes?.[0]?.count || 0,
    commentsCount: p.comments?.[0]?.count || 0,
  }));
};

export const getPost = async (postId: string) => {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*, author:profiles(id, full_name, avatar_url, role), comments:community_comments(*, author:profiles(id, full_name, avatar_url, role))")
    .eq("id", postId)
    .single();
  if (error) throw error;
  return data;
};

export const createPost = async (post: {
  space_id: string;
  user_id: string;
  content: string;
  images?: string[];
  tags?: string[];
  is_anonymous?: boolean;
}) => {
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      ...post,
      created_at: new Date().toISOString(),
    })
    .select("*, author:profiles(id, full_name, avatar_url, role)")
    .single();
  if (error) throw error;

  // Award points for posting
  if (post.user_id) {
    await awardPoints(post.user_id, 5, "Created a post");
  }

  return data;
};

export const updatePost = async (postId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("community_posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePost = async (postId: string) => {
  const { error } = await supabase.from("community_posts").delete().eq("id", postId);
  if (error) throw error;
};

export const pinPost = async (postId: string, isPinned: boolean) => {
  return updatePost(postId, { is_pinned: isPinned });
};

// â”€â”€â”€ Comments / Replies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getComments = async (postId: string) => {
  const { data, error } = await supabase
    .from("community_comments")
    .select("*, author:profiles(id, full_name, avatar_url, role), likes:community_likes(count)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((c: any) => ({
    ...c,
    likesCount: c.likes?.[0]?.count || 0,
  }));
};

export const createComment = async (comment: {
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
}) => {
  const { data, error } = await supabase
    .from("community_comments")
    .insert({ ...comment, created_at: new Date().toISOString() })
    .select("*, author:profiles(id, full_name, avatar_url, role)")
    .single();
  if (error) throw error;

  // Award points for replying
  if (comment.user_id) {
    await awardPoints(comment.user_id, 3, "Replied to a post");
  }

  return data;
};

export const markBestAnswer = async (commentId: string, postId: string) => {
  // Unmark any existing best answer
  await supabase
    .from("community_comments")
    .update({ is_best_answer: false })
    .eq("post_id", postId);

  // Mark new best answer
  const { data, error } = await supabase
    .from("community_comments")
    .update({ is_best_answer: true })
    .eq("id", commentId)
    .select()
    .single();
  if (error) throw error;

  // Award points to the commenter
  if (data?.user_id) {
    await awardPoints(data.user_id, 10, "Best answer selected");
  }

  return data;
};

// â”€â”€â”€ Likes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const toggleLike = async (userId: string, targetType: "post" | "comment", targetId: string) => {
  const column = targetType === "post" ? "post_id" : "comment_id";

  // Check if already liked
  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", userId)
    .eq(column, targetId)
    .maybeSingle();

  if (existing) {
    // Unlike
    await supabase.from("community_likes").delete().eq("id", existing.id);
    return false;
  } else {
    // Like
    await supabase.from("community_likes").insert({
      user_id: userId,
      [column]: targetId,
      created_at: new Date().toISOString(),
    });
    return true;
  }
};

export const getUserLikes = async (userId: string) => {
  const { data, error } = await supabase
    .from("community_likes")
    .select("post_id, comment_id")
    .eq("user_id", userId);
  if (error) throw error;
  return {
    postIds: (data || []).filter((l: any) => l.post_id).map((l: any) => l.post_id),
    commentIds: (data || []).filter((l: any) => l.comment_id).map((l: any) => l.comment_id),
  };
};

// â”€â”€â”€ Reports / Moderation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const reportPost = async (report: {
  post_id: string;
  reported_by: string;
  reason: string;
  details?: string;
}) => {
  const { data, error } = await supabase
    .from("community_reports")
    .insert({ ...report, status: "pending", created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getReports = async (status?: string) => {
  let query = supabase
    .from("community_reports")
    .select("*, post:community_posts(id, content, author:users(full_name)), reporter:users!reporter_id(full_name)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const resolveReport = async (reportId: string, resolution: "approved" | "rejected" | "hidden") => {
  const { data, error } = await supabase
    .from("community_reports")
    .update({ status: resolution, resolved_at: new Date().toISOString() })
    .eq("id", reportId)
    .select()
    .single();
  if (error) throw error;

  // If hidden, hide the post
  if (resolution === "hidden" && data?.post_id) {
    await supabase.from("community_posts").update({ is_hidden: true }).eq("id", data.post_id);
  }

  return data;
};

// â”€â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getEvents = async () => {
  const { data, error } = await supabase
    .from("community_events")
    .select("*, rsvps:community_event_rsvps(count)")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true });
  if (error) throw error;
  return (data || []).map((e: any) => ({
    ...e,
    attendees: e.rsvps?.[0]?.count || 0,
  }));
};

export const createEvent = async (event: {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  created_by: string;
}) => {
  const { data, error } = await supabase
    .from("community_events")
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const toggleRsvp = async (eventId: string, userId: string) => {
  const { data: existing } = await supabase
    .from("community_event_rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("community_event_rsvps").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase.from("community_event_rsvps").insert({
      event_id: eventId,
      user_id: userId,
      rsvped_at: new Date().toISOString(),
    });
    return true;
  }
};

// â”€â”€â”€ Gamification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const awardPoints = async (userId: string, points: number, reason: string) => {
  // Get current points
  const { data: existing } = await supabase
    .from("user_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_points")
      .update({ total_points: existing.total_points + points, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } else {
    await supabase
      .from("user_points")
      .insert({ user_id: userId, total_points: points, updated_at: new Date().toISOString() });
  }

  // Log the point award (silently fail if table doesn't exist)
  try {
    await supabase.from("point_history").insert({
      user_id: userId,
      points,
      reason,
      created_at: new Date().toISOString(),
    });
  } catch {
    // table may not exist yet
  }
};

export const getLeaderboard = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from("user_points")
    .select("*, user:profiles(id, full_name, avatar_url)")
    .order("total_points", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const getUserBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const checkAndAwardBadges = async (userId: string) => {
  const { data: points } = await supabase
    .from("user_points")
    .select("total_points")
    .eq("user_id", userId)
    .maybeSingle();

  const totalPoints = points?.total_points || 0;

  const badgeThresholds = [
    { name: "New Member", icon: "👶", description: "Joined the community", threshold: 0 },
    { name: "Active Contributor", icon: "💪", description: "Earned 100+ points", threshold: 100 },
    { name: "Community Star", icon: "⭐", description: "Earned 500+ points", threshold: 500 },
    { name: "Top Contributor", icon: "🏆", description: "Earned 1000+ points", threshold: 1000 },
    { name: "Legend", icon: "👑", description: "Earned 5000+ points", threshold: 5000 },
  ];

  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("name")
    .eq("user_id", userId);

  const existingNames = new Set((existingBadges || []).map((b: any) => b.name));

  for (const badge of badgeThresholds) {
    if (totalPoints >= badge.threshold && !existingNames.has(badge.name)) {
      await supabase.from("user_badges").insert({
        user_id: userId,
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        earned_at: new Date().toISOString(),
      });
    }
  }
};

// ─── Real-time Subscriptions ─────────────────────────────────────────────────

export type RealtimeCallback<T> = (payload: { new: T; old?: T; eventType: 'INSERT' | 'UPDATE' | 'DELETE' }) => void;

/**
 * Subscribe to real-time posts in a space
 */
export const subscribeToSpacePosts = (
  spaceId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`space-posts-${spaceId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_posts',
        filter: `space_id=eq.${spaceId}`,
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to real-time comments on a post
 */
export const subscribeToPostComments = (
  postId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`post-comments-${postId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_comments',
        filter: `post_id=eq.${postId}`,
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to all community posts (global feed)
 */
export const subscribeToAllPosts = (callback: RealtimeCallback<any>) => {
  const channel = supabase
    .channel('all-community-posts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_posts',
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to likes on a specific post
 */
export const subscribeToPostLikes = (
  postId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`post-likes-${postId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_likes',
        filter: `post_id=eq.${postId}`,
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to community events
 */
export const subscribeToEvents = (callback: RealtimeCallback<any>) => {
  const channel = supabase
    .channel('community-events')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_events',
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
