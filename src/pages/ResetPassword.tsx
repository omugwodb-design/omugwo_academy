import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValidSession, setIsValidSession] = useState(false);

    // Supabase sends the user to this page with a recovery token in the URL hash.
    // The auth listener picks it up and creates a session automatically.
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const hash = window.location.hash;
                const search = location.search;

                console.log('Current URL hash:', hash);
                console.log('Full URL:', window.location.href);

                // 1) Preferred: if you customize the email template to redirect directly to
                // /reset-password?token_hash=...&type=recovery
                const searchParams = new URLSearchParams(search);
                const tokenHash = searchParams.get('token_hash');
                const token = searchParams.get('token');
                const type = searchParams.get('type');
                if (type === 'recovery') {
                    if (tokenHash) {
                        const { error: otpError } = await supabase.auth.verifyOtp({
                            token_hash: tokenHash,
                            type: 'recovery',
                        });
                        if (otpError) throw otpError;
                    } else if (token) {
                        console.warn('Recovery link contains `token` but not `token_hash`. Update Supabase Reset Password email template to use token_hash.');
                    }
                }

                // 2) Support PKCE/code flow if present
                const code = searchParams.get('code');
                if (code && supabase.auth.exchangeCodeForSession) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;
                }

                // 3) Support implicit hash flow (#access_token=...&type=recovery)
                const hasRecoveryToken = hash.includes('access_token') && hash.includes('type=recovery');
                if (hasRecoveryToken) {
                    const params = new URLSearchParams(hash.substring(1));
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');
                    if (accessToken && refreshToken) {
                        const { error: setErr } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });
                        if (setErr) throw setErr;
                    }
                }

                const { data: { session } } = await supabase.auth.getSession();
                if (!cancelled && session) setIsValidSession(true);

                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session2) => {
                    console.log('Auth state change:', event, session2);
                    if (event === 'PASSWORD_RECOVERY') setIsValidSession(true);
                    if (event === 'SIGNED_IN' && session2) setIsValidSession(true);
                });

                return () => subscription.unsubscribe();
            } catch (err: any) {
                console.error('Reset password init error:', err);
                if (!cancelled) setIsValidSession(false);
            }
        };

        const cleanupPromise = init();

        return () => {
            cancelled = true;
            void cleanupPromise;
        };
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) throw updateError;

            toast.success('Password reset successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.message || 'Failed to reset password';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Omugwo<span className="text-primary-600">Academy</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Create New Password</h1>
                    <p className="text-gray-600 mb-8">
                        {isValidSession
                            ? 'Choose a strong new password for your account.'
                            : 'This link may have expired. Please request a new reset link.'}
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {isValidSession ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="Repeat new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Reset Password
                            </Button>
                        </form>
                    ) : (
                        <Link to="/forgot-password">
                            <Button className="w-full" size="lg">Request New Reset Link</Button>
                        </Link>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
