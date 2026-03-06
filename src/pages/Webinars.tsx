import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Play, Calendar, Clock, Users, ArrowRight, Bell,
  CheckCircle, Star, Video, Mic
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { useWebinarData } from './webinars/useWebinarData';

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
  const { webinars, isLoading, register, unregister, user, checkRegistration } = useWebinarData();
  const [email, setEmail] = useState('');
  const [registeredWebinars, setRegisteredWebinars] = useState<Set<string>>(new Set());

  // Categorize webinars
  const upcomingWebinars = webinars.filter(w => w.status !== 'completed' && w.status !== 'ended' && w.status !== 'past');
  const pastWebinars = webinars.filter(w => w.status === 'completed' || w.status === 'ended' || w.status === 'past');
  const featuredWebinar = upcomingWebinars[0] || pastWebinars[0]; // fallback to past if no upcoming

  // Resolve registrations
  useEffect(() => {
    if (!user) return;
    const resolveRegistrations = async () => {
      const registeredIds = new Set<string>();
      for (const w of webinars) {
        const isReg = await checkRegistration(w.id);
        if (isReg) registeredIds.add(w.id);
      }
      setRegisteredWebinars(registeredIds);
    };
    resolveRegistrations();
  }, [webinars, user, checkRegistration]);

  const handleRegister = async (webinarId: string) => {
    if (!user) {
      toast.error('Please login to register for webinars.');
      return;
    }

    try {
      if (registeredWebinars.has(webinarId)) {
        await unregister(webinarId);
        setRegisteredWebinars(prev => {
          const next = new Set(prev);
          next.delete(webinarId);
          return next;
        });
        toast.success("Successfully unregistered.");
      } else {
        await register(webinarId);
        setRegisteredWebinars(prev => {
          const next = new Set(prev);
          next.add(webinarId);
          return next;
        });
        toast.success("Successfully registered!");
      }
    } catch (err) {
      toast.error("An error occurred during registration.");
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 flex justify-center py-20">
        <div className="text-gray-500">Loading webinars...</div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Featured Webinar Hero */}
      {featuredWebinar && (
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src={featuredWebinar.banner_url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800"}
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
                <Badge className="mb-4 bg-green-500/20 text-green-300">
                  {featuredWebinar.price > 0 ? `Premium Webinar (₦${featuredWebinar.price.toLocaleString()})` : 'Free Masterclass'}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                  {featuredWebinar.title}
                </h1>
                <p className="text-lg text-primary-100 mb-6 line-clamp-3">
                  {featuredWebinar.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  {featuredWebinar.speakers && featuredWebinar.speakers.length > 0 ? (
                    featuredWebinar.speakers.slice(0, 1).map((host: any) => (
                      <React.Fragment key={host.id}>
                        <Avatar src={host.avatar_url} name={host.name} size="lg" />
                        <div>
                          <p className="font-semibold">{host.name}</p>
                          <p className="text-sm text-primary-200">{host.title || 'Speaker'}</p>
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <div>
                      <p className="font-semibold">Instructor or Speaker</p>
                    </div>
                  )}
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
                    {featuredWebinar.time} ({featuredWebinar.duration_minutes || 60} mins)
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {(featuredWebinar.registered || 0).toLocaleString()} registered
                  </span>
                </div>

                {featuredWebinar.status !== 'completed' && featuredWebinar.status !== 'past' && featuredWebinar.status !== 'ended' && (
                  <div className="mb-8">
                    <p className="text-sm text-primary-200 mb-3">Starts in:</p>
                    <CountdownTimer targetDate={`${featuredWebinar.date}T${featuredWebinar.time}`} />
                  </div>
                )}

                <div className="flex gap-3 max-w-md">
                  <Button
                    variant={registeredWebinars.has(featuredWebinar.id) ? 'outline' : 'secondary'}
                    onClick={() => handleRegister(featuredWebinar.id)}
                    className={registeredWebinars.has(featuredWebinar.id) ? 'bg-transparent text-white border-white/40' : ''}
                  >
                    {registeredWebinars.has(featuredWebinar.id) ? 'Unregister' : 'Register Now'}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block"
              >
                <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                  <h3 className="font-bold text-lg mb-4">Agenda & Details:</h3>
                  <ul className="space-y-3">
                    {featuredWebinar.agenda && featuredWebinar.agenda.length > 0 ? (
                      featuredWebinar.agenda.slice(0, 4).map((topic: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-primary-100">{topic.title} - {topic.time}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-primary-100 line-clamp-5">
                          {featuredWebinar.description || "Join us for this special event to learn powerful insights and skills."}
                        </span>
                      </li>
                    )}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-200">Capacity:</span>
                      <span className="font-bold text-green-400">
                        {featuredWebinar.max_attendees || 'Unlimited'}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Webinars */}
      {upcomingWebinars.length > 1 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900">More Upcoming Webinars</h2>
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
                        src={webinar.banner_url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400"}
                        alt={webinar.title}
                        className="w-full h-40 object-cover"
                      />
                      <Badge
                        className="absolute top-3 left-3"
                        variant={!webinar.price || webinar.price === 0 ? 'success' : 'default'}
                      >
                        {!webinar.price || webinar.price === 0 ? 'Free' : `₦${webinar.price?.toLocaleString()}`}
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
                      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{webinar.description}</p>

                      <div className="flex items-center gap-3 mb-4">
                        {webinar.speakers && webinar.speakers.length > 0 && (
                          <React.Fragment>
                            <Avatar src={webinar.speakers[0].avatar_url} name={webinar.speakers[0].name} size="sm" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{webinar.speakers[0].name}</p>
                              <p className="text-xs text-gray-500">{webinar.speakers[0].title || 'Speaker'}</p>
                            </div>
                          </React.Fragment>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          <Users className="w-4 h-4 inline mr-1" />
                          {(webinar.registered || 0).toLocaleString()} registered
                        </span>
                        <Button
                          size="sm"
                          variant={registeredWebinars.has(webinar.id) ? 'outline' : 'primary'}
                          onClick={() => handleRegister(webinar.id)}
                        >
                          {registeredWebinars.has(webinar.id) ? 'Unregister' : 'Register'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Webinars / Replays */}
      {pastWebinars.length > 0 && (
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
                        src={webinar.banner_url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400"}
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
                        {webinar.duration_minutes || 60} min
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {webinar.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {webinar.speakers && webinar.speakers.length > 0 ? webinar.speakers[0].name : "Omugwo Academy"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(webinar.date).toLocaleDateString()}</span>
                        <span>{(webinar.registered * 3 || 120).toLocaleString()} views</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black mb-4">Never Miss a Webinar</h2>
          <p className="text-primary-100 mb-8">
            Subscribe to get notified about upcoming live sessions, workshops, and Q&As.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); setEmail(''); }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
            <Button type="submit" variant="secondary" leftIcon={<Bell className="w-4 h-4" />}>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
