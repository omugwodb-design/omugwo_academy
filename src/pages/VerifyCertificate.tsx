import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, User, BookOpen, Download, AlertCircle, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock data â€“ in production this would fetch from Supabase
const mockVerifyCertificate = (certNumber: string) => {
    if (certNumber.startsWith('CERT-')) {
        return {
            id: '1',
            certificateNumber: certNumber,
            studentName: 'Testimony Adegoke',
            courseName: 'Postnatal Care Excellence',
            issuedAt: '2026-02-15',
            instructorName: 'Dr. Sarah Johnson',
            verified: true
        };
    }
    return null;
};

export const VerifyCertificate: React.FC = () => {
    const { certificateNumber } = useParams<{ certificateNumber: string }>();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            if (certificateNumber) {
                setData(mockVerifyCertificate(certificateNumber));
            }
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [certificateNumber]);

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
            <Link to="/" className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                    Omugwo<span className="text-primary-600">Academy</span>
                </span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
            >
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-gray-500 font-medium">Verifying Certificate Authenticity...</p>
                    </div>
                ) : data ? (
                    <div>
                        <div className="bg-primary-600 p-12 text-center text-white relative">
                            <div className="absolute top-8 right-8">
                                <ShieldCheck className="w-16 h-16 text-white/20" />
                            </div>
                            <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-black mb-2">Verified Certificate</h1>
                            <p className="text-primary-100 uppercase tracking-widest text-sm font-bold">
                                Officially Issued by Omugwo Academy
                            </p>
                        </div>

                        <div className="p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Certificate Number</label>
                                        <p className="text-2xl font-mono font-bold text-gray-900">{data.certificateNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Student Name</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{data.studentName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Course Completed</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{data.courseName}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Issue Date</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{data.issuedAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                <Button className="flex-1" leftIcon={<Download className="w-5 h-5" />}>
                                    Download Copy
                                </Button>
                                <Link to="/courses" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Explore Our Courses
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">Invalid Certificate</h1>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                            We couldn't verify this certificate number. It may be incorrect or haven't been issued yet.
                        </p>
                        <Link to="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                    </div>
                )}
            </motion.div>

            <p className="mt-8 text-gray-500 text-sm">
                Omugwo Academy Certificates are secure digital credentials. For support, contact <a href="mailto:support@omugwo.academy" className="text-primary-600 hover:underline">support@omugwo.academy</a>
            </p>
        </div>
    );
};
