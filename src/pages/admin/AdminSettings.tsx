import React from 'react';
import { Settings, User, Bell, Shield, CreditCard, Globe, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const AdminSettings: React.FC = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your academy configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1 space-y-1">
                    {[
                        { id: 'general', label: 'General', icon: Settings, active: true },
                        { id: 'profile', label: 'Admin Profile', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'billing', label: 'Billing', icon: CreditCard },
                        { id: 'custom-domain', label: 'Custom Domain', icon: Globe },
                        { id: 'email', label: 'Email Setup', icon: Mail },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${item.active
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </aside>

                <div className="lg:col-span-3 space-y-6">
                    <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">General Settings</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Academy Name</label>
                                    <Input placeholder="Omugwo Academy" defaultValue="Omugwo Academy" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Support Email</label>
                                    <Input placeholder="support@omugwo.com" defaultValue="support@omugwo.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Academy Description</label>
                                <textarea
                                    className="w-full h-32 p-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                    placeholder="Tell us about your academy..."
                                    defaultValue="Omugwo Academy is the premier destination for postnatal care education."
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-red-50/30 dark:bg-red-500/5 backdrop-blur-xl border border-red-100 dark:border-red-500/20 shadow-sm mt-6">
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2 tracking-tight">Danger Zone</h3>
                        <p className="text-sm text-red-600 dark:text-red-300/80 mb-6 font-medium">Irreversible actions that affect your entire academy.</p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button variant="outline" className="border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors bg-transparent">
                                Maintenance Mode
                            </Button>
                            <Button variant="outline" className="border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors bg-transparent">
                                Reset Academy Data
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
