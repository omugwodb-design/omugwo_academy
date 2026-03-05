import { supabase } from "../../lib/supabase";

// â”€â”€â”€ Webinars â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getWebinars = async (filters?: {
  type?: string;
  status?: string;
  limit?: number;
}) => {
  let query = supabase
    .from("webinars")
    .select("*, speakers:webinar_speakers(*), registrations:webinar_registrations(count)")
    .order("date", { ascending: true });

  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((w: any) => ({
    ...w,
    registered: w.registrations?.[0]?.count || 0,
    speakers: w.speakers || [],
  }));
};

export const getWebinar = async (webinarId: string) => {
  const { data, error } = await supabase
    .from("webinars")
    .select("*, speakers:webinar_speakers(*), agenda:webinar_agenda(*), registrations:webinar_registrations(count)")
    .eq("id", webinarId)
    .single();
  if (error) throw error;
  return {
    ...data,
    registered: data.registrations?.[0]?.count || 0,
    speakers: data.speakers || [],
    agenda: (data.agenda || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)),
  };
};

export const createWebinar = async (webinar: {
  title: string;
  description?: string;
  type: string;
  date: string;
  time: string;
  duration_minutes?: number;
  capacity?: number;
  banner_url?: string;
  price?: number;
  created_by: string;
}) => {
  const { data, error } = await supabase
    .from("webinars")
    .insert({ ...webinar, status: "upcoming" })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateWebinar = async (webinarId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("webinars")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", webinarId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteWebinar = async (webinarId: string) => {
  const { error } = await supabase.from("webinars").delete().eq("id", webinarId);
  if (error) throw error;
};

// â”€â”€â”€ Registration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const registerForWebinar = async (webinarId: string, userId: string) => {
  const { data: existing } = await supabase
    .from("webinar_registrations")
    .select("id")
    .eq("webinar_id", webinarId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("webinar_registrations")
    .insert({
      webinar_id: webinarId,
      user_id: userId,
      registered_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const unregisterFromWebinar = async (webinarId: string, userId: string) => {
  const { error } = await supabase
    .from("webinar_registrations")
    .delete()
    .eq("webinar_id", webinarId)
    .eq("user_id", userId);
  if (error) throw error;
};

export const getRegistrations = async (webinarId: string) => {
  const { data, error } = await supabase
    .from("webinar_registrations")
    .select("*, user:profiles(id, full_name, avatar_url, email)")
    .eq("webinar_id", webinarId)
    .order("registered_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const isRegistered = async (webinarId: string, userId: string) => {
  const { data } = await supabase
    .from("webinar_registrations")
    .select("id")
    .eq("webinar_id", webinarId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
};

// â”€â”€â”€ Speakers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const addSpeaker = async (webinarId: string, speaker: {
  name: string;
  title?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  const { data, error } = await supabase
    .from("webinar_speakers")
    .insert({ webinar_id: webinarId, ...speaker })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeSpeaker = async (speakerId: string) => {
  const { error } = await supabase.from("webinar_speakers").delete().eq("id", speakerId);
  if (error) throw error;
};

// â”€â”€â”€ Agenda â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const addAgendaItem = async (webinarId: string, item: {
  time: string;
  title: string;
  description?: string;
  order_index: number;
}) => {
  const { data, error } = await supabase
    .from("webinar_agenda")
    .insert({ webinar_id: webinarId, ...item })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAgendaItem = async (itemId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("webinar_agenda")
    .update(updates)
    .eq("id", itemId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAgendaItem = async (itemId: string) => {
  const { error } = await supabase.from("webinar_agenda").delete().eq("id", itemId);
  if (error) throw error;
};

// â”€â”€â”€ Live Chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getChatMessages = async (webinarId: string, limit: number = 100) => {
  const { data, error } = await supabase
    .from("webinar_chat")
    .select("*, user:profiles(id, full_name, avatar_url)")
    .eq("webinar_id", webinarId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const sendChatMessage = async (webinarId: string, userId: string, message: string) => {
  const { data, error } = await supabase
    .from("webinar_chat")
    .insert({
      webinar_id: webinarId,
      user_id: userId,
      message,
      created_at: new Date().toISOString(),
    })
    .select("*, user:profiles(id, full_name, avatar_url)")
    .single();
  if (error) throw error;
  return data;
};

// â”€â”€â”€ Polls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getPolls = async (webinarId: string) => {
  const { data, error } = await supabase
    .from("webinar_polls")
    .select("*, votes:webinar_poll_votes(count)")
    .eq("webinar_id", webinarId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((p: any) => ({
    ...p,
    totalVotes: p.votes?.[0]?.count || 0,
  }));
};

export const createPoll = async (webinarId: string, poll: {
  question: string;
  options: { label: string; }[];
  created_by: string;
}) => {
  const { data, error } = await supabase
    .from("webinar_polls")
    .insert({
      webinar_id: webinarId,
      question: poll.question,
      options: poll.options,
      is_active: true,
      created_by: poll.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const votePoll = async (pollId: string, userId: string, optionIndex: number) => {
  // Check if already voted
  const { data: existing } = await supabase
    .from("webinar_poll_votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    // Update vote
    const { data, error } = await supabase
      .from("webinar_poll_votes")
      .update({ option_index: optionIndex })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("webinar_poll_votes")
      .insert({
        poll_id: pollId,
        user_id: userId,
        option_index: optionIndex,
        voted_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const closePoll = async (pollId: string) => {
  const { data, error } = await supabase
    .from("webinar_polls")
    .update({ is_active: false })
    .eq("id", pollId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// â”€â”€â”€ Email Reminders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const scheduleReminder = async (webinarId: string, reminder: {
  type: string;
  send_at: string;
  subject: string;
  body: string;
}) => {
  const { data, error } = await supabase
    .from("webinar_email_reminders")
    .insert({ webinar_id: webinarId, ...reminder, status: "scheduled" })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// â”€â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getWebinarAnalytics = async (webinarId: string) => {
  const [regs, chats, polls] = await Promise.all([
    supabase.from("webinar_registrations").select("id, attended").eq("webinar_id", webinarId),
    supabase.from("webinar_chat").select("id").eq("webinar_id", webinarId),
    supabase.from("webinar_polls").select("id, votes:webinar_poll_votes(count)").eq("webinar_id", webinarId),
  ]);

  const totalRegistered = regs.data?.length || 0;
  const totalAttended = regs.data?.filter((r: any) => r.attended).length || 0;
  const chatMessages = chats.data?.length || 0;
  const totalPolls = polls.data?.length || 0;
  const totalPollVotes = (polls.data || []).reduce((s: number, p: any) => s + (p.votes?.[0]?.count || 0), 0);

  return {
    totalRegistered,
    totalAttended,
    attendanceRate: totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0,
    chatMessages,
    totalPolls,
    totalPollVotes,
  };
};

// ─── Real-time Subscriptions ─────────────────────────────────────────────────

export type RealtimeCallback<T> = (payload: { new: T; old?: T; eventType: 'INSERT' | 'UPDATE' | 'DELETE' }) => void;

/**
 * Subscribe to real-time chat messages for a webinar
 */
export const subscribeToWebinarChat = (
  webinarId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`webinar-chat-${webinarId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'webinar_chat',
        filter: `webinar_id=eq.${webinarId}`,
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
 * Subscribe to real-time poll updates for a webinar
 */
export const subscribeToWebinarPolls = (
  webinarId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`webinar-polls-${webinarId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'webinar_polls',
        filter: `webinar_id=eq.${webinarId}`,
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
 * Subscribe to real-time poll votes
 */
export const subscribeToWebinarPollVotes = (
  pollId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`poll-votes-${pollId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'webinar_poll_votes',
        filter: `poll_id=eq.${pollId}`,
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
 * Subscribe to webinar status changes (for live/ended transitions)
 */
export const subscribeToWebinarStatus = (
  webinarId: string,
  callback: RealtimeCallback<any>
) => {
  const channel = supabase
    .channel(`webinar-status-${webinarId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'webinars',
        filter: `id=eq.${webinarId}`,
      },
      (payload) => {
        callback({
          new: payload.new as any,
          old: payload.old as any,
          eventType: 'UPDATE',
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
