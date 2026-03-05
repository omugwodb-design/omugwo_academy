import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Award, ArrowLeft, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const team = [
    {
        name: 'Dr. Megor Ikuenobe',
        role: 'Founder & Lead Educator',
        bio: 'Dedicated to revolutionizing postnatal care in Africa through science-backed education.',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
        social: { twitter: '#', linkedin: '#', instagram: '#' }
    },
    {
        name: 'Dr. Sarah Johnson',
        role: 'Postnatal Wellness Specialist',
        bio: 'Expert in pediatric nutrition and maternal mental health with over 15 years experience.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        social: { twitter: '#', linkedin: '#', instagram: '#' }
    },
    {
        name: 'Aisha Bello',
        role: 'Community Experience Lead',
        bio: 'Passionate about building supportive spaces for new parents to share and grow together.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        social: { twitter: '#', linkedin: '#', instagram: '#' }
    }
];

export const Team: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <span className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4 inline-block">Our Team</span>
                    <h1 className="text-5xl font-black text-gray-900 mb-6">Meet the Minds Behind <br /> <span className="text-primary-600">Omugwo Academy</span></h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We're a diverse team of doctors, educators, and parents committed to providing the highest quality postnatal support for African families.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {team.map((member, idx) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="relative mb-6">
                                <div className="aspect-[4/5] rounded-[40px] overflow-hidden">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] flex items-end justify-center p-8">
                                    <div className="flex gap-4">
                                        <a href={member.social.instagram} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                        <a href={member.social.twitter} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all">
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                        <a href={member.social.linkedin} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-4">{member.role}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32 p-12 bg-gray-50 rounded-[48px] border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-left">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">Want to join us?</h3>
                            <p className="text-gray-600 font-medium italic">We're always looking for passionate people to help us grow.</p>
                        </div>
                        <Link to="/careers">
                            <Button size="lg" leftIcon={<Users className="w-5 h-5" />}>View Careers</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
