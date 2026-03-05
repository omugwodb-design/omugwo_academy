import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Award, Globe, ArrowRight, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const stats = [
  { value: '15,000+', label: 'Families Supported', icon: Users },
  { value: '200+', label: 'Expert Lessons', icon: BookOpen },
  { value: '12', label: 'Countries Reached', icon: Globe },
  { value: '98%', label: 'Satisfaction Rate', icon: Award },
];

const team = [
  {
    name: 'Dr. Megor Ikuenobe',
    role: 'Founder & Lead Educator',
    bio: 'ECD Specialist with over 15 years of experience in maternal and child health across Africa.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Nurse Tolani Adewale',
    role: 'Postnatal Care Coordinator',
    bio: 'Certified midwife with 20+ years of omugwo experience and lactation consulting.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Kofi Mensah',
    role: 'Pediatric Consultant',
    bio: 'Neonatal care expert specializing in infant development during the first 100 days.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Amara Obi',
    role: 'Mental Health Specialist',
    bio: 'Clinical psychologist focused on postpartum mental health and family wellness.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=400',
  },
];

const values = [
  {
    title: 'Cultural Relevance',
    description: 'We honor African traditions while integrating modern medical knowledge.',
    icon: Heart,
  },
  {
    title: 'Evidence-Based',
    description: 'All content is developed and reviewed by qualified medical professionals.',
    icon: BookOpen,
  },
  {
    title: 'Community First',
    description: 'We believe in the power of shared experiences and collective support.',
    icon: Users,
  },
  {
    title: 'Accessibility',
    description: 'Quality postnatal education should be available to every family.',
    icon: Globe,
  },
];

export const About: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-6">About Omugwo Academy</Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 leading-tight">
                Our Heritage,<br />
                <span className="text-primary-600">Your Future</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We bridge the gap between traditional African postnatal wisdom and modern 
                medical care, creating a comprehensive support system for new families.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Explore Courses
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                  Watch Our Story
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary-200 rounded-[3rem] rotate-3 opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                alt="African mother and baby"
                className="relative rounded-[2.5rem] shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=400"
                  alt="Mother and baby"
                  className="rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400"
                  alt="Family"
                  className="rounded-2xl shadow-lg mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1505576121720-9551e39fbbaf?auto=format&fit=crop&q=80&w=400"
                  alt="Community"
                  className="rounded-2xl shadow-lg -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=400"
                  alt="Support"
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-6">Our Story</Badge>
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
                What is Omugwo?
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Omugwo</strong> is a beautiful Igbo tradition 
                  where a new mother's mother or mother-in-law comes to stay and provide support 
                  during the postpartum period.
                </p>
                <p>
                  This practice represents the essence of African communal care—the belief that 
                  it takes a village to raise a child. The "Omugwo" caregiver helps with cooking 
                  nutritious meals, caring for the newborn, and guiding the new mother through 
                  recovery.
                </p>
                <p>
                  As modern life has scattered families across cities and continents, many new 
                  mothers find themselves without this crucial support system. 
                  <strong className="text-primary-600"> Omugwo Academy was created to fill this gap.</strong>
                </p>
                <p>
                  We've digitized the wisdom of generations, combining traditional knowledge with 
                  evidence-based medical guidance to create a comprehensive postnatal education 
                  platform accessible to African families everywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
              Meet the Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team of medical professionals and educators are dedicated to transforming 
              postnatal care across Africa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover padding="none" className="h-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-primary-600 text-sm font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Together, we can ensure every African family has access to the support and 
              knowledge they need for a healthy postnatal journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses">
                <Button variant="secondary" size="lg">
                  Start Learning
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Partner With Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
