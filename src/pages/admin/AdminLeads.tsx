import React, { useState, useEffect } from 'react';
import { Mail, Search, Download, Filter, User, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            // Using webinar registrations as leads
            const { data, error } = await supabase
                .from('webinar_registrations')
                .select(`
          *,
          webinar:webinars (title)
        `)
                .order('registered_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (err) {
            console.error('Error fetching admin leads:', err);
            toast.error('Failed to load leads');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.webinar?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Leads & Funnels</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track registrations and potential customers</p>
                </div>
                <Button leftIcon={<Download className="w-4 h-4" />} variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
                    Export CSV
                </Button>
            </div>

            <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search leads by email or webinar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source (Webinar)</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs uppercase shadow-sm">
                                                {lead.email.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{lead.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1">{lead.webinar?.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={lead.attended ? 'success' : 'info'} className="uppercase text-[10px] tracking-widest font-bold px-2 py-1">
                                            {lead.attended ? 'Attended' : 'Registered'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500 dark:text-gray-400">
                                        {format(new Date(lead.registered_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filteredLeads.length === 0 && (
                    <div className="py-20 text-center">
                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No leads found</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
