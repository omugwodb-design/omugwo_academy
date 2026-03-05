import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Download, DollarSign, TrendingUp, CreditCard,
  CheckCircle, XCircle, Clock, Eye, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

type PaymentRow = {
  id: string;
  user: { name: string; email: string; avatar: string | null };
  course: string;
  amount: number;
  provider: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  createdAt: string;
};

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            status,
            provider,
            provider_reference,
            created_at,
            user:users (name, email),
            course:courses (title)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: PaymentRow[] = (data || []).map((p: any) => ({
          id: p.id,
          user: {
            name: p.user?.name || 'Customer',
            email: p.user?.email || '',
            avatar: null,
          },
          course: p.course?.title || 'Course',
          amount: Number(p.amount) || 0,
          provider: p.provider || 'provider',
          status: (p.status || 'pending') as PaymentRow['status'],
          reference: p.provider_reference || '-',
          createdAt: p.created_at,
        }));

        setPayments(mapped);
      } catch (err) {
        console.error('Error loading payments:', err);
        toast.error('Failed to load payments');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const filteredPayments = useMemo(() => payments.filter(payment => {
    const matchesSearch = payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  }), [payments, searchQuery, filterStatus]);

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage all transactions</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">₦{totalRevenue.toLocaleString()}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Revenue</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">₦{pendingAmount.toLocaleString()}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{payments.length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Transactions</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {((payments.filter(p => p.status === 'completed').length / (payments.length || 1)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Success Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
            {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${filterStatus === status
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 px-2 py-1 rounded inline-block mb-1">{payment.id}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{payment.reference}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={payment.user.avatar || undefined} name={payment.user.name} size="sm" />
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{payment.user.name}</p>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{payment.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{payment.course}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-white">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <Badge variant={payment.provider === 'paystack' ? 'info' : 'default'} className="uppercase text-[10px] tracking-widest font-bold px-2 py-1">
                        {payment.provider}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        payment.status === 'completed' ? 'success' :
                          payment.status === 'pending' ? 'warning' : 'error'
                      } className="uppercase text-[10px] tracking-widest font-bold px-2 py-1">
                        {payment.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-500 dark:text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors tooltip" title="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {payment.status === 'pending' && (
                          <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 transition-colors tooltip" title="Re-check status">
                            <RefreshCw className="w-4 h-4" />
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </Card>
    </div>
  );
};
