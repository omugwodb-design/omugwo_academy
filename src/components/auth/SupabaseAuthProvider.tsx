import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

/**
 * SupabaseAuthProvider
 * Listens to Supabase auth state changes and keeps the authStore in sync.
 * Replace <ClerkProvider> / <ClerkSupabaseSync> with this component in App.tsx.
 */
export const SupabaseAuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { loadUser, logout } = useAuthStore();

    useEffect(() => {
        // Load user on mount
        loadUser();

        // Listen for sign in / sign out events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                logout();
            } else {
                // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, etc.
                loadUser();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return <>{children}</>;
};
