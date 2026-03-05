import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertCircle, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RefundPolicy: React.FC = () => {
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
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Refund Policy</h1>
                    <p className="text-gray-500 mb-12">Last updated: February 19, 2026</p>

                    <div className="prose prose-primary max-w-none space-y-12">
                        <section className="bg-primary-50 p-8 rounded-[32px] border border-primary-100 mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
                                    <RotateCcw className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">30-Day Money-Back Guarantee</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                We believe in the quality of our education. If you're not satisfied with a course, you can request a full refund within 30 days of purchase.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Eligibility for Refund</h2>
                            </div>
                            <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                <li>Request must be submitted within 30 days of the purchase date.</li>
                                <li>Course progress must be less than 25% of total content.</li>
                                <li>Digital downloads or resources included in the course must not have been excessively accessed.</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">How to Request</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Contact our support team at <a href="mailto:refunds@omugwoacademy.com" className="text-primary-600 font-bold hover:underline">refunds@omugwoacademy.com</a> with your order details and reason for the request.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0">Processing Time</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Once approved, refunds are processed back to your original payment method within 5-10 business days.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
