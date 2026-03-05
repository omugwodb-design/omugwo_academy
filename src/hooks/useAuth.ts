import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, setIsAuthenticated, logout } = useAuthStore();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: { fullName?: string; avatarUrl?: string }) => {
    if (!user?.id) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        fullName: updates.fullName || user.fullName,
        avatarUrl: updates.avatarUrl || user.avatarUrl,
      });

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    isAuthenticated,
    signOut,
    updateProfile,
  };
}

export function useRequireAuth(redirectTo = '/login') {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(redirectTo);
    }
  }, [user, isLoading, navigate, redirectTo]);

  return { user, isLoading };
}
