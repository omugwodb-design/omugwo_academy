import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, ArrowLeft, Heart, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const jobs = [
    {
        title: 'Postnatal Educator',
        department: 'Education',
        location: 'Remote / Lagos',
        type: 'Full-time',
        description: 'We are looking for certified midwives or postnatal specialists to join our faculty and create world-class content.'
    },
    {
        title: 'Community Manager',
        department: 'Marketing',
        location: 'Remote',
        type: 'Part-time',
        description: 'Help us cultivate a supportive and engaging community for thousands of African mothers.'
    },
    {
        title: 'Senior Software Engineer (Full Stack)',
        department: 'Technology',
        location: 'Remote / Hybrid (Lagos)',
        type: 'Full-time',
        description: 'Help us scale our learning platform and community features as we expand across Africa.'
    }
];

export const Careers: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                <Link to="/about" className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Back to About
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center"
                >
                    <h1 className="text-5xl font-black text-gray-900 mb-6">Build the Future of <br /> <span className="text-primary-600">African Parenting</span></h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Join a passionate team dedicated to bridging tradition and science for a healthier, more informed motherhood journey across the continent.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-primary-50 p-8 rounded-[40px] border border-primary-100">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission First</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Every role at Omugwo Academy is driven by the goal of improving postnatal outcomes and supporting families through one of life's most challenging transitions.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth & Learning</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We empower our team with the same spirit of education we give our students. You'll have the resources and autonomy to grow your skills.
                        </p>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-8">Open Positions</h2>
                <div className="space-y-4">
                    {jobs.map((job, idx) => (
                        <motion.div
                            key={job.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm max-w-2xl">{job.description}</p>
                                </div>
                                <Button variant="outline" className="group-hover:bg-primary-600 group-hover:text-white transition-all whitespace-nowrap" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    Apply Now
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center text-gray-500">
                    <p>Don't see a perfect fit? We're always open to hearing from talented individuals.</p>
                    <a href="mailto:careers@omugwoacademy.com" className="text-primary-600 font-bold hover:underline">careers@omugwoacademy.com</a>
                </div>
            </div>
        </div>
    );
};
