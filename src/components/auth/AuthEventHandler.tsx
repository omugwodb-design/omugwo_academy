import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthEventHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // When a user clicks a reset password link, Supabase signs them in 
            // and fires the PASSWORD_RECOVERY event. We catch it here and route them to the reset page.
            if (event === 'PASSWORD_RECOVERY') {
                navigate('/reset-password', { replace: true });
            }
        });

        // Check if we landed on a URL with type=recovery in the hash
        if (window.location.hash.includes('type=recovery')) {
            navigate('/reset-password', { replace: true });
        }

        return () => subscription.unsubscribe();
    }, [navigate]);

    return null;
};
