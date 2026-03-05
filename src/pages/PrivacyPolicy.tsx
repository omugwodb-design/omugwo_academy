import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-500 mb-12">Last updated: February 19, 2026</p>

                    <div className="prose prose-primary max-w-none space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Our Commitment</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                At Omugwo Academy, your privacy is our priority. This policy outlines how we collect, use, and protect your personal information when you use our platform.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                            </div>
                            <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                <li>Account information (Name, Email, Password)</li>
                                <li>Profile details (Avatar, Bio)</li>
                                <li>Usage data (Course progress, Community posts)</li>
                                <li>Payment records (Securely handled by Paystack/Stripe)</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Data Protection</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                We use industry-standard encryption and security protocols to ensure your data remains confidential and protected from unauthorized access.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Data</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Your information is used purely to provide and improve our services, communicate important updates, and personalize your learning experience.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
