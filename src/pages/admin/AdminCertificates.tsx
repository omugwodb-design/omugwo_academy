// Omugwo Admin - Certificates Management
import React, { useState, useEffect } from 'react';
import { Award, Search, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const AdminCertificates: React.FC = () => {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('certificates')
                .select(`
          *,
          user:users!user_id(name, email),
          course:courses(title)
        `)
                .order('issued_at', { ascending: false });

            if (error) throw error;
            setCertificates(data || []);
        } catch (err) {
            console.error('Error fetching admin certificates:', err);
            toast.error('Failed to load certificates');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCerts = certificates.filter(c =>
        c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Certificates</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and manage issued certificates</p>
                </div>
                <Button leftIcon={<Award className="w-4 h-4" />}>
                    Issue Certificate
                </Button>
            </div>

            <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by name or number..."
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
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cert #</th>
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
                                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredCerts.map((cert) => (
                                <tr key={cert.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold ring-2 ring-white dark:ring-gray-900">
                                                {cert.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{cert.user?.name}</p>
                                                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{cert.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{cert.course?.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-[11px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{cert.certificate_number}</code>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {format(new Date(cert.issued_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors tooltip" title="View">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-500 transition-colors tooltip" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
