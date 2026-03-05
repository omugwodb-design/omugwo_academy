import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  getWebinars, getWebinar, registerForWebinar, unregisterFromWebinar,
  isRegistered, getChatMessages, sendChatMessage, getPolls, votePoll,
} from '../../core/webinar/webinar-service';

export function useWebinarData() {
  const { user } = useAuthStore();
  const [webinars, setWebinars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWebinars = useCallback(async (filters?: { type?: string; status?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWebinars(filters);
      setWebinars(data);
    } catch (err: any) {
      console.error('Webinar load error:', err);
      setError(err.message || 'Failed to load webinars');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadWebinars(); }, [loadWebinars]);

  const loadWebinar = useCallback(async (id: string) => {
    try {
      return await getWebinar(id);
    } catch {
      return null;
    }
  }, []);

  const register = useCallback(async (webinarId: string) => {
    if (!user) throw new Error('Must be logged in');
    const reg = await registerForWebinar(webinarId, user.id);
    setWebinars(prev => prev.map(w =>
      w.id === webinarId ? { ...w, registered: (w.registered || 0) + 1 } : w
    ));
    return reg;
  }, [user]);

  const unregister = useCallback(async (webinarId: string) => {
    if (!user) throw new Error('Must be logged in');
    await unregisterFromWebinar(webinarId, user.id);
    setWebinars(prev => prev.map(w =>
      w.id === webinarId ? { ...w, registered: Math.max(0, (w.registered || 0) - 1) } : w
    ));
  }, [user]);

  const checkRegistration = useCallback(async (webinarId: string) => {
    if (!user) return false;
    return await isRegistered(webinarId, user.id);
  }, [user]);

  const loadChat = useCallback(async (webinarId: string) => {
    try {
      return await getChatMessages(webinarId);
    } catch {
      return [];
    }
  }, []);

  const sendChat = useCallback(async (webinarId: string, message: string) => {
    if (!user) throw new Error('Must be logged in');
    return await sendChatMessage(webinarId, user.id, message);
  }, [user]);

  const loadPolls = useCallback(async (webinarId: string) => {
    try {
      return await getPolls(webinarId);
    } catch {
      return [];
    }
  }, []);

  const submitVote = useCallback(async (pollId: string, optionIndex: number) => {
    if (!user) throw new Error('Must be logged in');
    return await votePoll(pollId, user.id, optionIndex);
  }, [user]);

  return {
    webinars,
    isLoading,
    error,
    user,
    refresh: loadWebinars,
    loadWebinar,
    register,
    unregister,
    checkRegistration,
    loadChat,
    sendChat,
    loadPolls,
    submitVote,
  };
}
