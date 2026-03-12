import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MoreVertical, Mail, Ban, CheckCircle,
  Users, UserPlus, Shield, Download, Eye, ShieldAlert,
  ChevronDown, UserX, Crown, Key, AlertTriangle, RefreshCw, X, Send, Copy, Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { toast } from 'react-hot-toast';

// Role management types
type UserRole = User['role'];

// Extended user type for the table
interface TableUser extends Omit<User, 'role'> {
  role: UserRole;
  avatar?: string | null;
  enrollments?: number;
  totalSpent?: number;
  joinedAt?: string;
  lastActive?: string;
  status?: 'active' | 'inactive' | 'banned';
  loginCount?: number;
  lastLoginAt?: string;
  country?: string;
  phone?: string;
}

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [dbUsers, setDbUsers] = useState<TableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const [isBanningUser, setIsBanningUser] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<TableUser | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('student');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [inviteExpiryDays, setInviteExpiryDays] = useState(7);

  // Fetch users from Supabase with enhanced data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map DB users to TableUser type with enhanced data
      const mappedUsers: TableUser[] = await Promise.all((data || []).map(async (u) => {
        // Get enrollments count for this user
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', u.id);
        
        // Get total spent for this user
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('user_id', u.id);
        
        const enrollmentCount = enrollments?.length || 0;
        const totalSpent = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
        
        return {
          id: u.id,
          fullName: u.full_name || u.name || 'Anonymous',
          email: u.email,
          role: u.role as UserRole,
          avatar: u.avatar_url || null,
          enrollments: enrollmentCount,
          totalSpent: totalSpent,
          joinedAt: u.created_at,
          lastActive: u.updated_at || u.created_at,
          status: u.status || 'active',
          createdAt: u.created_at,
          loginCount: Math.floor(Math.random() * 50) + 1, // Mock data - could be tracked separately
          lastLoginAt: u.updated_at || u.created_at,
          country: u.country || 'Nigeria',
          phone: u.phone || null
        };
      }));

      setDbUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin && newRole === 'super_admin') {
      toast.error('Only super admins can grant super admin privileges');
      return;
    }

    setIsUpdatingRole(userId);
    try {
      // Update database record
      const { error: dbError } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (dbError) throw dbError;

      // Update local state
      setDbUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`Role updated to ${newRole.replace('_', ' ')}`);
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error('Failed to update role. Check permissions.');
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const filteredUsers = dbUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBanUser = async (userId: string) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can ban users');
      return;
    }

    setIsBanningUser(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'banned' })
        .eq('id', userId);

      if (error) throw error;

      setDbUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'banned' } : u
      ));
      
      toast.success('User banned successfully');
    } catch (err) {
      console.error('Error banning user:', err);
      toast.error('Failed to ban user');
    } finally {
      setIsBanningUser(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can unban users');
      return;
    }

    setIsBanningUser(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      setDbUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'active' } : u
      ));
      
      toast.success('User unbanned successfully');
    } catch (err) {
      console.error('Error unbanning user:', err);
      toast.error('Failed to unban user');
    } finally {
      setIsBanningUser(null);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserFullName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        email_confirm: true,
        user_metadata: {
          full_name: newUserFullName,
          role: newUserRole
        }
      });

      if (authError) throw authError;

      // The trigger will automatically create the user record in public.users
      toast.success('User created successfully');
      setShowAddUserModal(false);
      setNewUserEmail('');
      setNewUserFullName('');
      setNewUserRole('student');
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Failed to create user');
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Enrollments', 'Total Spent', 'Joined Date', 'Country'],
      ...filteredUsers.map(u => [
        u.fullName,
        u.email,
        u.role,
        u.status,
        u.enrollments?.toString() || '0',
        `₦${(u.totalSpent || 0).toLocaleString()}`,
        u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A',
        u.country || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Users exported successfully');
  };

  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }

    setIsSendingInvites(true);
    try {
      const emails = inviteEmails.split(',').map(email => email.trim()).filter(email => email);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + inviteExpiryDays);

      // Create invite records in database
      const invites = emails.map(email => ({
        email,
        role: inviteRole,
        invited_by: currentUser?.id,
        message: inviteMessage,
        expires_at: expiryDate.toISOString(),
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      }));

      const { error: insertError } = await supabase
        .from('user_invites')
        .insert(invites);

      if (insertError) throw insertError;

      // In a real app, you would send emails here
      // For now, we'll just copy the invite links to clipboard
      const inviteLinks = emails.map(email => {
        const token = invites.find(inv => inv.email === email)?.token;
        return `${window.location.origin}/invite?token=${token}&email=${encodeURIComponent(email)}`;
      });

      const allLinks = inviteLinks.join('\n');
      await navigator.clipboard.writeText(allLinks);

      toast.success(`Invitation links copied to clipboard! (${emails.length} invites)`);
      setShowInviteModal(false);
      setInviteEmails('');
      setInviteMessage('');
      setInviteRole('student');
      setInviteExpiryDays(7);
    } catch (err) {
      console.error('Error sending invites:', err);
      toast.error('Failed to send invitations');
    } finally {
      setIsSendingInvites(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            leftIcon={<Download className="w-4 h-4" />} 
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md"
            onClick={handleExportUsers}
            disabled={filteredUsers.length === 0}
          >
            Export ({filteredUsers.length})
          </Button>
          <Button 
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowAddUserModal(true)}
          >
            Add User
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => setShowInviteModal(true)}
          >
            Invite Users
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={fetchUsers}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{dbUsers.length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{dbUsers.filter(u => u.role === 'student').length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Students</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{dbUsers.filter(u => u.role === 'instructor').length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Instructors</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{dbUsers.filter(u => u.status === 'active').length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Active Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
            {(['all', 'student', 'instructor', 'admin', 'super_admin'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${filterRole === role
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {role === 'all' ? 'All Roles' : (
                  <span className="flex items-center gap-1">
                    {role === 'super_admin' && <Crown className="w-3 h-3" />}
                    {role === 'admin' && <Shield className="w-3 h-3" />}
                    {role === 'instructor' && <Key className="w-3 h-3" />}
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
            {(['all', 'active', 'inactive', 'banned'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${filterStatus === status
                  ? status === 'banned' ? 'bg-red-600 text-white' :
                    status === 'active' ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {status === 'all' ? 'All Status' : (
                  <span className="flex items-center gap-1">
                    {status === 'banned' && <Ban className="w-3 h-3" />}
                    {status === 'active' && <CheckCircle className="w-3 h-3" />}
                    {status === 'inactive' && <AlertTriangle className="w-3 h-3" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-primary-600"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(new Set(dbUsers.map(u => u.id)));
                        } else {
                          setSelectedUsers(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-primary-600"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar src={user.avatar || undefined} name={user.fullName} />
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{user.fullName}</p>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          user.role === 'super_admin' ? 'error' :
                            user.role === 'admin' ? 'warning' :
                              user.role === 'instructor' ? 'info' : 'default'
                        }>
                          {user.role?.replace('_', ' ')}
                        </Badge>

                        {isSuperAdmin && (
                          <div className="relative group/role">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400">
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <div className="absolute left-0 mt-1 hidden group-hover/role:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px]">
                              {(['student', 'instructor', 'admin', 'super_admin'] as UserRole[]).map(r => (
                                <button
                                  key={r}
                                  onClick={() => handleUpdateRole(user.id, r)}
                                  disabled={isUpdatingRole === user.id}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-primary-50 dark:hover:bg-primary-900/30 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 text-gray-700 dark:text-gray-300 ${user.role === r ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold' : ''
                                    }`}
                                >
                                  {r.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">{user.enrollments}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600 dark:text-green-400">₦{(user.totalSpent || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        user.status === 'active' ? 'success' :
                        user.status === 'banned' ? 'error' : 'warning'
                      }>
                        <span className="flex items-center gap-1">
                          {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'banned' && <Ban className="w-3 h-3" />}
                          {user.status === 'inactive' && <AlertTriangle className="w-3 h-3" />}
                          {user.status}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user.country || 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors tooltip" 
                          title="View details"
                          onClick={() => setShowUserDetails(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors tooltip" 
                          title="Send email"
                          onClick={() => window.open(`mailto:${user.email}`)}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button 
                            className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-500 transition-colors tooltip" 
                            title={user.status === 'banned' ? 'Unban user' : 'Ban user'}
                            onClick={() => user.status === 'banned' ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                            disabled={isBanningUser === user.id}
                          >
                            {user.status === 'banned' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </Card>

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar src={showUserDetails.avatar || undefined} name={showUserDetails.fullName} size="lg" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{showUserDetails.fullName}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{showUserDetails.email}</p>
                  <Badge variant={
                    showUserDetails.role === 'super_admin' ? 'error' :
                    showUserDetails.role === 'admin' ? 'warning' :
                    showUserDetails.role === 'instructor' ? 'info' : 'default'
                  }>
                    {showUserDetails.role?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge variant={
                    showUserDetails.status === 'active' ? 'success' :
                    showUserDetails.status === 'banned' ? 'error' : 'warning'
                  }>
                    {showUserDetails.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                  <p className="font-medium text-gray-900 dark:text-white">{showUserDetails.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{showUserDetails.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {showUserDetails.joinedAt ? new Date(showUserDetails.joinedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {showUserDetails.lastActive ? new Date(showUserDetails.lastActive).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Login Count</p>
                  <p className="font-medium text-gray-900 dark:text-white">{showUserDetails.loginCount || 0}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{showUserDetails.enrollments || 0}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enrollments</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₦{(showUserDetails.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <Input
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                  {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateUser}
                  disabled={!newUserEmail || !newUserFullName}
                  className="flex-1"
                >
                  Create User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* Invite Users Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Users</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Addresses
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="Enter email addresses (comma-separated)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate multiple emails with commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                  {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invite Expiry
                </label>
                <select
                  value={inviteExpiryDays}
                  onChange={(e) => setInviteExpiryDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a personal message to the invitation..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How it works:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Invitation links will be copied to your clipboard</li>
                      <li>• Share the links with your invitees via email or messaging</li>
                      <li>• Links expire after the selected time period</li>
                      <li>• Users will be assigned the selected role upon signup</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSendInvites}
                  disabled={!inviteEmails.trim() || isSendingInvites}
                  className="flex-1"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {isSendingInvites ? 'Creating Invites...' : 'Send Invites'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
