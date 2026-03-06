import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, ArrowRight, Heart, Baby, Users, BookOpen, Star,
  CheckCircle, Mic, Calendar, Quote, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const courses = [
  {
    id: 'moms-course',
    title: "The Omugwo Masterclass for Moms",
    description: "Complete postnatal guide covering body recovery, mental health, cultural balance, marriage & intimacy, and infant care.",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    duration: "12 Hours",
    lessons: 48,
    price: 49000,
    badge: "Most Popular",
    icon: Heart,
  },
  {
    id: 'dads-course',
    title: "Partner Support Training",
    description: "Essential knowledge for fathers and partners to provide meaningful support during the postnatal period.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800",
    duration: "6 Hours",
    lessons: 24,
    price: 29000,
    icon: Users,
  },
  {
    id: 'essential',
    title: "Essential Postnatal Care",
    description: "Core fundamentals every parent needs to know for a healthy postpartum journey.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    duration: "8 Hours",
    lessons: 32,
    price: 39000,
    icon: BookOpen,
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "First-time Mom, Lagos",
    content: "Omugwo Academy changed everything for me. The blend of traditional wisdom with modern medical advice gave me confidence I never knew I needed.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    name: "Chukwuemeka Eze",
    role: "New Dad, Abuja",
    content: "As a father, I felt lost during my wife's postpartum period. The Dads Course equipped me with practical skills to support her meaningfully.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    name: "Folake Adeyemi",
    role: "Mom of 3, Ibadan",
    content: "Even after three children, I learned so much. The community support is incredible - it truly feels like having a village again.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
];

const journeyStages = [
  {
    stage: "01",
    title: "Labour & Delivery",
    description: "Discover the wonders of childbirth and make informed decisions about your birth plan, pain management, and medical support.",
    icon: Baby,
  },
  {
    stage: "02",
    title: "Post-Delivery Care",
    description: "Your comprehensive guide to a smooth and supportive transition to parenthood, focusing on recovery and emotional wellbeing.",
    icon: Heart,
  },
  {
    stage: "03",
    title: "Baby's First Year",
    description: "Navigate the beautiful challenges of your baby's growth, from breastfeeding and sleep patterns to developmental milestones.",
    icon: Users,
  },
];

const faqs = [
  {
    question: "What is Omugwo?",
    answer: "Omugwo is a time-honored Nigerian postnatal care practice where a mother or mother-in-law comes to help care for a new mother and baby. At Omugwo Academy, we've modernized this tradition into comprehensive digital education that blends cultural wisdom with evidence-based medical guidance."
  },
  {
    question: "Who are the courses designed for?",
    answer: "Our courses are designed for expecting mothers, new mothers, fathers/partners, grandmothers, and anyone involved in postnatal care. We have specific courses tailored for each role in the support system."
  },
  {
    question: "Is the content medically verified?",
    answer: "Yes, all our content is developed and reviewed by Dr. Megor Ikuenobe and a team of medical professionals including pediatricians, OB-GYNs, mental health specialists, and certified lactation consultants."
  },
  {
    question: "How long do I have access to the courses?",
    answer: "Once enrolled, you have lifetime access to the course content, including all future updates. You can learn at your own pace and revisit materials whenever needed."
  },
  {
    question: "Is there a community I can join?",
    answer: "Yes! Every course enrollment includes access to our private community where you can connect with other parents, share experiences, ask questions, and receive support from peers and experts."
  },
];

import { supabase } from '../lib/supabase';
import { SiteRenderer } from '../core/sitebuilder/renderer';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [dynamicPage, setDynamicPage] = React.useState<any>(null);
  const [siteConfig, setSiteConfig] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data: config } = await supabase.from('site_config').select('*').single();
        const { data: page } = await supabase
          .from('site_pages')
          .select('*')
          .eq('is_home_page', true)
          .eq('status', 'PUBLISHED')
          .maybeSingle();

        if (config) setSiteConfig(config);
        if (page) setDynamicPage(page);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();

    const channel = supabase
      .channel('home_live_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_pages' },
        (payload) => {
          const row: any = payload.new || payload.old;
          if (!row) return;
          if (row.is_home_page && row.status === 'PUBLISHED') {
            setDynamicPage(row);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config' },
        (payload) => {
          const row: any = payload.new || payload.old;
          if (!row) return;
          setSiteConfig(row);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (dynamicPage && dynamicPage.published_blocks && dynamicPage.published_blocks.length > 0) {
    return (
      <SiteRenderer
        blocks={dynamicPage.published_blocks}
        globalStyles={siteConfig?.global_styles}
      />
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1920"
            alt="Mother and baby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">
          <motion.div
            className="max-w-2xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6">
                <Heart className="w-3 h-3 fill-current" />
                Omugwo Academy
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-gray-900 tracking-tight"
            >
              Modern Postnatal Education for{' '}
              <span className="text-primary-600">African Families</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Bridging tradition and science for a healthier motherhood journey.
              Expert-led courses, supportive community, and culturally relevant guidance.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Learning
                </Button>
              </Link>
              <Link to="/webinars/free-masterclass">
                <Button variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5 fill-primary-600 text-primary-600" />}>
                  Watch Free Masterclass
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">15,000+</span> families supported
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="warning" className="mb-6">The Challenge</Badge>
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 leading-tight">
                Why Postnatal Care in Africa Needs Modernization
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The traditional "Omugwo" practice—where experienced mothers guide new parents—is
                  fading as families become more nuclear and geographically dispersed.
                </p>
                <p>
                  New mothers are left navigating postpartum challenges alone, often without access
                  to reliable information that respects their cultural context while meeting modern
                  medical standards.
                </p>
                <p className="font-semibold text-gray-900">
                  We're rebuilding the village—digitally.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] rotate-3 opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=800"
                alt="African mother with baby"
                className="relative rounded-[2.5rem] shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
              Motherhood is a Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              And we're here to guide you through every stage with expert knowledge and compassionate support.
            </p>
          </motion.div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 hide-scrollbar">
            {journeyStages.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="snap-center shrink-0 w-[85vw] md:w-auto"
              >
                <Card hover className="h-full p-8 text-left rounded-[2rem] border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0"></div>
                  <div className="relative z-10">
                    <Badge size="sm" className="mb-8 bg-gray-100 text-gray-600">Stage {stage.stage}</Badge>
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                      <stage.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{stage.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{stage.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-20 md:py-32 bg-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4">Our Courses</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
              Expert-Led Learning Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses designed by medical professionals, tailored for African families.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/courses/${course.id}`} className="block">
                  <Card hover padding="none" className="h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {course.badge && (
                        <Badge className="absolute top-4 left-4" variant="success">
                          {course.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {course.duration}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {course.lessons} Lessons
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-1">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-primary-600">
                          ₦{course.price.toLocaleString()}
                        </span>
                        <Button size="sm">Learn More</Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] -rotate-3 opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Dr. Megor Ikuenobe"
                className="relative rounded-[2.5rem] shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-primary-600 text-white p-8 rounded-3xl shadow-xl max-w-xs">
                <Quote className="w-8 h-8 mb-4 opacity-50" />
                <p className="font-semibold italic">
                  "Every child deserves a promising start, and every mother deserves support."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-6">Meet the Founder</Badge>
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 leading-tight">
                A Personal Journey, A Global Mission
              </h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <p>
                  <strong className="text-gray-900">Dr. Megor Ikuenobe</strong> is a distinguished
                  medical professional and early childhood development specialist on a mission to
                  provide every child in Africa with a promising start.
                </p>
                <p>
                  As the founder of Lead Oak Women and Children Foundation, she has been a relentless
                  advocate for education, healthcare, and empowerment in communities across Nigeria.
                </p>
                <p>
                  Omugwo Academy was born from her vision to digitize the traditional support system,
                  making expert postnatal guidance accessible to every African family.
                </p>
              </div>
              <Link to="/about">
                <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Read Our Story
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* My Omugwo Story Section */}
      <section className="py-20 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <Badge className="mb-6 bg-primary-100 text-primary-700 hover:bg-primary-200">
                Featured Campaign
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 leading-tight">
                My <span className="text-primary-300">Omugwo</span> Story
              </h2>
              <div className="space-y-6 text-gray-600 mb-10 text-lg leading-relaxed">
                <p>
                  The "My Omugwo Story" campaign aims to highlight the transformative power of omugwo care by sharing real-life experiences of new moms, new dads, and close relatives who have benefited from this tradition. Through storytelling, we will showcase the diverse perspectives and profound impact of Omugwo on families worldwide.
                </p>
                <p>
                  Whether your journey was filled with challenges, triumphs, or a combination of both, we want to hear your story, the good, the bad and the ugly. We encourage you to embrace the opportunity to share your omugwo story and inspire others on their parenting journeys. Together we can celebrate the transformative power of Omugwo care.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-primary-700 text-xl mb-6">How to Share Your Omugwo Story:</h3>
                <p className="text-gray-600 mb-6">We offer three convenient ways to share your omugwo story:</p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Video Submission / walk in video recording",
                    "Podcast Feature",
                    "Written Article",
                    "Live videos"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="rounded-full px-8 bg-primary-300 hover:bg-primary-400 text-white border-0">
                  SHARE YOUR STORY
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2 bg-primary-50 rounded-[2.5rem] p-4"
            >
              <div className="grid grid-cols-2 gap-4 h-full aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400"
                  alt="Mother in hospital with baby"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400"
                  alt="Mother resting with baby"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
                  alt="Mother holding baby"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400"
                  alt="Tired mother resting"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="info" className="mb-4 bg-white/10 text-white">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Trusted by Thousands of Families
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real stories from real parents who transformed their postnatal experience with Omugwo Academy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar src={testimonial.avatar} name={testimonial.name} size="lg" />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800"
                alt="Podcast Microphone"
                className="w-full h-auto aspect-square object-cover rounded-[2.5rem] shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-transparent border border-gray-900 text-gray-900 px-4 py-1 uppercase tracking-widest text-xs font-bold rounded-full">
                -PODCAST-
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 leading-tight">
                Beyond Birth with Dr. Megor
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-8">
                <p>
                  Join Dr. Megor as she delves into the depths of parenthood, exploring the joys, challenges, and transformative experiences that come with raising children. Each episode features insightful conversations with leading experts, experienced parents, and Dr. Megor herself, covering a wide range of topics relevant to new moms, new dads, and families. From navigating the first few weeks with a newborn to fostering a healthy and supportive family environment, Beyond Birth with Dr. Megor offers a wealth of knowledge, practical tips, and personal anecdotes to empower parents on their unique parenting paths.
                </p>
                <p>
                  Embrace the extraordinary journey of parenthood with Beyond Birth with Dr. Megor. Subscribe and Listen Today!
                </p>
              </div>
              <Button size="lg" className="rounded-full px-8 bg-[#b366ff] hover:bg-[#9933ff] text-white border-0 font-bold tracking-wider text-sm shadow-lg shadow-purple-500/30">
                VIEW MORE
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">
              Commonly Asked Questions
            </h2>
            <div className="w-24 h-1.5 bg-primary-600 rounded-full"></div>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`bg-white rounded-[2rem] border transition-colors ${openFaq === index ? 'border-primary-100 shadow-sm' : 'border-gray-100'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <span className="font-bold text-gray-900 pr-4 text-lg">{faq.question}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === index ? 'bg-primary-600 text-white' : 'bg-white border border-gray-100 text-primary-300 shadow-sm'}`}>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 md:px-8 pb-8 pt-0 text-gray-500 text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Transform Your Postnatal Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join thousands of African families who have discovered the power of informed,
              supported, and culturally relevant postnatal care.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explore Courses
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                  leftIcon={<Calendar className="w-5 h-5" />}
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
