import { create } from 'zustand';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

const ADMIN_ROLES: User['role'][] = ['admin', 'super_admin'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;

  loadUser: () => Promise<void>;

  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isStudent: () => boolean;
  isInstructor: () => boolean;
  hasBackendAccess: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),

  /**
   * Load the signed-in user's profile from the public.users table.
   * Called once on app mount and whenever the Supabase session changes.
   */
  loadUser: async () => {
    set({ isLoading: true });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const supabaseUser = session.user;

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Could not load user profile:', error.message);
      }

      if (profile) {
        set({
          user: {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name || profile.name || supabaseUser.user_metadata?.full_name,
            role: (profile.role || supabaseUser.user_metadata?.role || 'student') as User['role'],
            avatarUrl: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
            createdAt: profile.created_at,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Profile not created yet (trigger may not have fired) — use session metadata
        set({
          user: {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
            role: (supabaseUser.user_metadata?.role || 'student') as User['role'],
            avatarUrl: supabaseUser.user_metadata?.avatar_url,
            createdAt: supabaseUser.created_at,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  isAdmin: () => ADMIN_ROLES.includes(get().user?.role as User['role']),
  isSuperAdmin: () => get().user?.role === 'super_admin',
  isStudent: () => get().user?.role === 'student',
  isInstructor: () => get().user?.role === 'instructor',
  hasBackendAccess: () =>
    [...ADMIN_ROLES, 'instructor'].includes(get().user?.role as User['role']),
}));
