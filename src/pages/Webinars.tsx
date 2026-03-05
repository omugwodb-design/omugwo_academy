import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Calendar, Clock, Users, ArrowRight, Bell, 
  CheckCircle, Star, Video, Mic
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';

const upcomingWebinars = [
  {
    id: 'free-masterclass',
    title: "Free Masterclass: The Modern Omugwo Framework",
    description: "Discover how to blend traditional postnatal wisdom with modern medical care. Learn the 5 pillars of successful postpartum recovery.",
    host: {
      name: "Dr. Megor Ikuenobe",
      title: "Founder & Lead Educator",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    },
    date: "2025-02-25",
    time: "3:00 PM WAT",
    duration: 60,
    attendees: 1250,
    maxAttendees: 2000,
    isFree: true,
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    topics: [
      "The 5 pillars of postpartum recovery",
      "Common mistakes new mothers make",
      "How to build your support system",
      "Q&A session with Dr. Megor"
    ]
  },
  {
    id: 'breastfeeding-workshop',
    title: "Breastfeeding Success Workshop",
    description: "A comprehensive workshop covering latching techniques, common challenges, and how to maintain milk supply.",
    host: {
      name: "Nurse Tolani Adewale",
      title: "Lactation Consultant",
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200"
    },
    date: "2025-03-01",
    time: "10:00 AM WAT",
    duration: 90,
    attendees: 456,
    maxAttendees: 500,
    isFree: false,
    price: 5000,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800",
    topics: [
      "Proper latching techniques",
      "Solving common breastfeeding problems",
      "Pumping and milk storage",
      "Live demonstrations"
    ]
  },
  {
    id: 'mental-health-qa',
    title: "Live Q&A: Postpartum Mental Health",
    description: "An open discussion about postpartum mental health with our clinical psychologist. Ask your questions live.",
    host: {
      name: "Dr. Amara Obi",
      title: "Clinical Psychologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=200"
    },
    date: "2025-03-05",
    time: "5:00 PM WAT",
    duration: 60,
    attendees: 320,
    maxAttendees: 1000,
    isFree: true,
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=800",
    topics: [
      "Recognizing postpartum depression",
      "Coping strategies",
      "When to seek help",
      "Supporting a partner with PPD"
    ]
  },
];

const pastWebinars = [
  {
    id: 'past-1',
    title: "Newborn Sleep Patterns Explained",
    host: "Dr. Kofi Mensah",
    date: "Jan 15, 2025",
    duration: 75,
    views: 2340,
    image: "https://images.unsplash.com/photo-1505576121720-9551e39fbbaf?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 'past-2',
    title: "Traditional vs Modern Baby Care",
    host: "Dr. Megor Ikuenobe",
    date: "Jan 8, 2025",
    duration: 60,
    views: 3120,
    image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 'past-3',
    title: "Partner Support During Postpartum",
    host: "Dr. Amara Obi",
    date: "Dec 20, 2024",
    duration: 55,
    views: 1890,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400",
  },
];

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 min-w-[60px]">
            <span className="text-2xl font-black">{value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-white/60 uppercase mt-1 block">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export const Webinars: React.FC = () => {
  const [email, setEmail] = useState('');
  const featuredWebinar = upcomingWebinars[0];

  return (
    <div className="pt-20">
      {/* Featured Webinar Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src={featuredWebinar.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/95 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-4 bg-green-500/20 text-green-300">Free Masterclass</Badge>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                {featuredWebinar.title}
              </h1>
              <p className="text-lg text-primary-100 mb-6">
                {featuredWebinar.description}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <Avatar src={featuredWebinar.host.avatar} name={featuredWebinar.host.name} size="lg" />
                <div>
                  <p className="font-semibold">{featuredWebinar.host.name}</p>
                  <p className="text-sm text-primary-200">{featuredWebinar.host.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-primary-200 mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(featuredWebinar.date).toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredWebinar.time} ({featuredWebinar.duration} mins)
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {featuredWebinar.attendees.toLocaleString()} registered
                </span>
              </div>

              <div className="mb-8">
                <p className="text-sm text-primary-200 mb-3">Starts in:</p>
                <CountdownTimer targetDate={featuredWebinar.date} />
              </div>

              <form className="flex gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button variant="secondary">
                  Register Free
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                <h3 className="font-bold text-lg mb-4">What You'll Learn:</h3>
                <ul className="space-y-3">
                  {featuredWebinar.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-primary-100">{topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-200">Spots remaining:</span>
                    <span className="font-bold text-green-400">
                      {(featuredWebinar.maxAttendees - featuredWebinar.attendees).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(featuredWebinar.attendees / featuredWebinar.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900">Upcoming Webinars</h2>
            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Calendar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWebinars.slice(1).map((webinar, idx) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover padding="none" className="h-full flex flex-col">
                  <div className="relative">
                    <img
                      src={webinar.image}
                      alt={webinar.title}
                      className="w-full h-40 object-cover"
                    />
                    <Badge 
                      className="absolute top-3 left-3"
                      variant={webinar.isFree ? 'success' : 'default'}
                    >
                      {webinar.isFree ? 'Free' : `₦${webinar.price?.toLocaleString()}`}
                    </Badge>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(webinar.date).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric' 
                      })} • {webinar.time}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{webinar.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">{webinar.description}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar src={webinar.host.avatar} name={webinar.host.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{webinar.host.name}</p>
                        <p className="text-xs text-gray-500">{webinar.host.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {webinar.attendees} registered
                      </span>
                      <Button size="sm">Register</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Webinars / Replays */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900">Watch Replays</h2>
            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastWebinars.map((webinar, idx) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover padding="none" className="group cursor-pointer">
                  <div className="relative">
                    <img
                      src={webinar.image}
                      alt={webinar.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-black/50 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {webinar.duration} min
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {webinar.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{webinar.host}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{webinar.date}</span>
                      <span>{webinar.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black mb-4">Never Miss a Webinar</h2>
          <p className="text-primary-100 mb-8">
            Subscribe to get notified about upcoming live sessions, workshops, and Q&As.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button variant="secondary" leftIcon={<Bell className="w-4 h-4" />}>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
