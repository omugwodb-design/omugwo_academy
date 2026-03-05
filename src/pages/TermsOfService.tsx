import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Book, CreditCard, UserCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
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
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-500 mb-12">Last updated: February 19, 2026</p>

                    <div className="prose prose-primary max-w-none space-y-12">
                        <p className="text-xl text-gray-600 leading-relaxed font-medium">
                            Welcome to Omugwo Academy. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.
                        </p>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Eligibility</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                You must be at least 18 years old or possess legal parental or guardian consent to use this platform and purchase courses.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <Book className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Intellectual Property</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                All content, including videos, texts, and resources provided within the courses are the exclusive property of Omugwo Academy and are for your personal use only.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Payments & Refunds</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Payments are processed via secure portals. Please refer to our Refund Policy for information regarding cancellations and returns.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Governing Law</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                These terms are governed by the laws of the Federal Republic of Nigeria.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
