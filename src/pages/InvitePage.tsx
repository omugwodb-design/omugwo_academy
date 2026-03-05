import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mail, CheckCircle, AlertCircle, Crown, Shield, Key, Users,
  ArrowRight, Eye, EyeOff, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface InviteData {
  email: string;
  role: string;
  message: string;
  invited_by: string;
  expires_at: string;
}

export const InvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid invitation link');
      navigate('/');
      return;
    }

    validateInvite();
  }, [token, email]);

  const validateInvite = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Invitation not found');
        navigate('/');
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setIsExpired(true);
        return;
      }

      // Check if already accepted
      if (data.accepted_at) {
        setIsAccepted(true);
        return;
      }

      setInviteData({
        email: data.email,
        role: data.role,
        message: data.message || '',
        invited_by: data.invited_by || '',
        expires_at: data.expires_at
      });
    } catch (err) {
      console.error('Error validating invite:', err);
      toast.error('Invalid invitation link');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!formData.fullName || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteData!.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: inviteData!.role
          }
        }
      });

      if (authError) throw authError;

      // Mark invite as accepted
      const { error: updateError } = await supabase
        .from('user_invites')
        .update({ accepted_at: new Date().toISOString() })
        .eq('token', token);

      if (updateError) throw updateError;

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Error accepting invite:', err);
      toast.error('Failed to create account. Please try again.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-5 h-5" />;
      case 'admin': return <Shield className="w-5 h-5" />;
      case 'instructor': return <Key className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      case 'admin': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'instructor': return 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400';
      default: return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invitation Expired</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This invitation link has expired. Please contact the person who invited you for a new invitation.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Already Accepted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This invitation has already been accepted. You can now log in to your account.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You're Invited!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Omugwo Academy and start your learning journey
            </p>
          </div>

          {inviteData && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{inviteData.email}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(inviteData.role)}`}>
                  {getRoleIcon(inviteData.role)}
                  {inviteData.role.replace('_', ' ')}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Expires:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(inviteData.expires_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {inviteData?.message && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Personal message:</strong> {inviteData.message}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <Button
            onClick={handleAcceptInvite}
            className="w-full mt-6"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Accept Invitation & Create Account
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            By accepting this invitation, you agree to our Terms of Service and Privacy Policy.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
