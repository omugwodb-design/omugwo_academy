import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  getSpaces, getPosts, getComments, getEvents, getLeaderboard,
  getUserBadges, getUserLikes, createPost as createPostService,
  createComment as createCommentService, toggleLike as toggleLikeService,
  toggleRsvp as toggleRsvpService, reportPost as reportPostService,
  markBestAnswer as markBestAnswerService,
  subscribeToAllPosts, subscribeToSpacePosts, subscribeToEvents,
  getUserRsvpedEventIds, getUserJoinedSpaceIds,
  joinSpace as joinSpaceService, leaveSpace as leaveSpaceService,
} from '../../core/community/community-service';

export function useCommunityData() {
  const { user } = useAuthStore();
  const [spaces, setSpaces] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [userLikes, setUserLikes] = useState<{ postIds: string[]; commentIds: string[] }>({ postIds: [], commentIds: [] });
  const [userRsvps, setUserRsvps] = useState<{ eventIds: string[] }>({ eventIds: [] });
  const [userSpaces, setUserSpaces] = useState<{ spaceIds: string[] }>({ spaceIds: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [spacesData, postsData, eventsData, leaderboardData] = await Promise.all([
        getSpaces().catch(() => []),
        getPosts({ limit: 50 }).catch(() => []),
        getEvents().catch(() => []),
        getLeaderboard(10).catch(() => []),
      ]);

      setSpaces(spacesData);
      setPosts(postsData);
      setEvents(eventsData);
      setLeaderboard(leaderboardData);

      if (user) {
        const [likesData, badgesData, rsvpsData, spacesData] = await Promise.all([
          getUserLikes(user.id).catch(() => ({ postIds: [], commentIds: [] })),
          getUserBadges(user.id).catch(() => []),
          getUserRsvpedEventIds(user.id).catch(() => []),
          getUserJoinedSpaceIds(user.id).catch(() => []),
        ]);
        setUserLikes(likesData);
        setBadges(badgesData);
        setUserRsvps({ eventIds: rsvpsData });
        setUserSpaces({ spaceIds: spacesData });
      }
    } catch (err: any) {
      console.error('Community data load error:', err);
      setError(err.message || 'Failed to load community data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Real-time subscriptions for live updates
  useEffect(() => {
    // Subscribe to all posts for real-time feed updates
    const unsubscribePosts = subscribeToAllPosts((payload) => {
      if (payload.eventType === 'INSERT') {
        // Fetch full post data with author info
        getPosts({ limit: 1 }).then(([newPost]) => {
          if (newPost && newPost.id === payload.new.id) {
            setPosts(prev => [newPost, ...prev.filter(p => p.id !== newPost.id)]);
          }
        }).catch(() => {});
      } else if (payload.eventType === 'UPDATE') {
        setPosts(prev => prev.map(p => 
          p.id === payload.new.id ? { ...p, ...payload.new } : p
        ));
      } else if (payload.eventType === 'DELETE') {
        setPosts(prev => prev.filter(p => p.id !== payload.old?.id));
      }
    });

    // Subscribe to events for real-time updates
    const unsubscribeEvents = subscribeToEvents((payload) => {
      if (payload.eventType === 'INSERT') {
        setEvents(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setEvents(prev => prev.map(e => 
          e.id === payload.new.id ? { ...e, ...payload.new } : e
        ));
      } else if (payload.eventType === 'DELETE') {
        setEvents(prev => prev.filter(e => e.id !== payload.old?.id));
      }
    });

    return () => {
      unsubscribePosts();
      unsubscribeEvents();
    };
  }, []);

  const loadPostsBySpace = useCallback(async (spaceId?: string) => {
    try {
      const data = await getPosts({ spaceId, limit: 50 });
      setPosts(data);
    } catch {
      // keep existing posts
    }
  }, []);

  const loadPostComments = useCallback(async (postId: string) => {
    try {
      return await getComments(postId);
    } catch {
      return [];
    }
  }, []);

  const submitPost = useCallback(async (spaceId: string, content: string) => {
    if (!user) throw new Error('Must be logged in');
    if (!(userSpaces.spaceIds || []).includes(spaceId)) {
      throw new Error('Join this space before posting');
    }
    const post = await createPostService({
      space_id: spaceId,
      user_id: user.id,
      content,
      is_anonymous: false,
    });
    setPosts(prev => [post, ...prev]);
    return post;
  }, [user, userSpaces.spaceIds]);

  const submitComment = useCallback(async (postId: string, content: string) => {
    if (!user) throw new Error('Must be logged in');
    const comment = await createCommentService({
      post_id: postId,
      user_id: user.id,
      content,
    });
    return comment;
  }, [user]);

  const togglePostLike = useCallback(async (postId: string) => {
    if (!user) return;
    const liked = await toggleLikeService(user.id, 'post', postId);
    setUserLikes(prev => ({
      ...prev,
      postIds: liked
        ? [...prev.postIds, postId]
        : prev.postIds.filter(id => id !== postId),
    }));
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likesCount: p.likesCount + (liked ? 1 : -1) }
        : p
    ));
  }, [user]);

  const toggleEventRsvp = useCallback(async (eventId: string) => {
    if (!user) return;
    const rsvped = await toggleRsvpService(eventId, user.id);
    setUserRsvps(prev => ({
      eventIds: rsvped
        ? Array.from(new Set([...prev.eventIds, eventId]))
        : prev.eventIds.filter(id => id !== eventId),
    }));
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, attendees: e.attendees + (rsvped ? 1 : -1), isRsvped: rsvped }
        : e
    ));
  }, [user]);

  const reportPost = useCallback(async (postId: string, reason: string) => {
    if (!user) return;
    await reportPostService({ post_id: postId, reported_by: user.id, reason });
  }, [user]);

  const joinSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('Must be logged in');
    await joinSpaceService(spaceId, user.id);
    setUserSpaces(prev => ({
      spaceIds: Array.from(new Set([...(prev.spaceIds || []), spaceId])),
    }));
  }, [user]);

  const leaveSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('Must be logged in');
    await leaveSpaceService(spaceId, user.id);
    setUserSpaces(prev => ({
      spaceIds: (prev.spaceIds || []).filter(id => id !== spaceId),
    }));
  }, [user]);

  const selectBestAnswer = useCallback(async (commentId: string, postId: string) => {
    await markBestAnswerService(commentId, postId);
  }, []);

  return {
    spaces,
    posts,
    events,
    leaderboard,
    badges,
    userLikes,
    userRsvps,
    userSpaces,
    isLoading,
    error,
    user,
    refresh: loadAll,
    loadPostsBySpace,
    loadPostComments,
    submitPost,
    submitComment,
    togglePostLike,
    toggleEventRsvp,
    reportPost,
    selectBestAnswer,
    joinSpace,
    leaveSpace,
  };
}
