import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { useWebinarData } from './useWebinarData';
import {
  Video, Calendar, Clock, Users, Play, Pause, MessageSquare, ThumbsUp,
  Hand, Download, BarChart3, Send, ChevronRight, Star, CheckCircle,
  Mic, MicOff, Volume2, VolumeX, Maximize, Share2, Gift, Timer,
  ArrowRight, Eye, TrendingUp, AlertCircle, Settings, Filter
} from 'lucide-react';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type WebinarType = 'free' | 'paid' | 'members_only' | 'cohort';
type WebinarStatus = 'upcoming' | 'live' | 'replay' | 'ended';

interface Webinar {
  id: string;
  title: string;
  description: string;
  type: WebinarType;
  status: WebinarStatus;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  registered: number;
  attended?: number;
  speakers: Speaker[];
  banner: string;
  price?: number;
  replayUrl?: string;
  replayExpiry?: string;
  courseUpsell?: { id: string; title: string; price: string; discount: string; };
  agenda: AgendaItem[];
  tags: string[];
}

interface Speaker {
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  isHost: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: { label: string; votes: number; }[];
  isActive: boolean;
}

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WEBINARS: Webinar[] = [
  {
    id: '1',
    title: 'The 4th Trimester Blueprint: 5 Pillars of Postpartum Recovery',
    description: 'Discover the evidence-based framework that has helped 8,000+ mothers navigate their postpartum journey with confidence.',
    type: 'free',
    status: 'upcoming',
    date: 'March 15, 2025',
    time: '7:00 PM WAT',
    duration: '90 min',
    capacity: 500,
    registered: 347,
    speakers: [
      { name: 'Dr. Megor Ikuenobe', title: 'Founder, Omugwo Academy', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', bio: 'Maternal health expert with 15+ years of experience.' },
    ],
    banner: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200',
    courseUpsell: { id: 'masterclass', title: 'Omugwo Masterclass', price: '₦49,000', discount: '35% off for attendees' },
    agenda: [
      { time: '0:00', title: 'Welcome & Introduction', description: 'Meet your host and what to expect' },
      { time: '0:10', title: 'Pillar 1: Physical Recovery', description: 'Understanding your body\'s healing timeline' },
      { time: '0:25', title: 'Pillar 2: Emotional Wellness', description: 'Navigating the emotional rollercoaster' },
      { time: '0:40', title: 'Pillar 3: Nutrition & Nourishment', description: 'Traditional wisdom meets modern nutrition' },
      { time: '0:55', title: 'Pillar 4: Support Systems', description: 'Building your village in the modern world' },
      { time: '1:10', title: 'Pillar 5: Baby Bonding', description: 'Deepening your connection with your newborn' },
      { time: '1:20', title: 'Q&A + Special Offer', description: 'Live questions and exclusive course discount' },
    ],
    tags: ['postpartum', 'recovery', 'free'],
  },
  {
    id: '2',
    title: 'Breastfeeding Masterclass: From Latch to Liberation',
    description: 'A comprehensive workshop on breastfeeding techniques, troubleshooting, and building confidence.',
    type: 'paid',
    status: 'upcoming',
    date: 'March 22, 2025',
    time: '2:00 PM WAT',
    duration: '120 min',
    capacity: 200,
    registered: 89,
    price: 5000,
    speakers: [
      { name: 'Nurse Amaka O.', title: 'Certified Lactation Consultant', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', bio: 'IBCLC with 10+ years helping mothers breastfeed successfully.' },
    ],
    banner: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=1200',
    agenda: [
      { time: '0:00', title: 'Welcome', description: 'Introduction and ground rules' },
      { time: '0:15', title: 'The Science of Lactation', description: 'How milk production works' },
      { time: '0:45', title: 'Latch Techniques', description: 'Hands-on demonstration' },
      { time: '1:15', title: 'Troubleshooting', description: 'Common challenges and solutions' },
      { time: '1:45', title: 'Q&A', description: 'Your questions answered live' },
    ],
    tags: ['breastfeeding', 'workshop', 'paid'],
  },
  {
    id: '3',
    title: 'Partner Support: How Dads Can Show Up',
    description: 'Replay of our popular session on how partners can provide meaningful support during the postpartum period.',
    type: 'free',
    status: 'replay',
    date: 'February 28, 2025',
    time: '7:00 PM WAT',
    duration: '75 min',
    capacity: 500,
    registered: 412,
    attended: 289,
    replayUrl: '#',
    replayExpiry: 'March 5, 2025',
    speakers: [
      { name: 'Coach Emeka C.', title: 'Family Relationship Coach', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', bio: 'Helping families thrive through the transition to parenthood.' },
    ],
    banner: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
    agenda: [],
    tags: ['dads', 'partner', 'replay'],
  },
];

// â”€â”€â”€ Webinar System Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const WebinarSystem: React.FC = () => {
  const webinarData = useWebinarData();
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'live' | 'admin'>('list');
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [filterType, setFilterType] = useState<'all' | WebinarType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | WebinarStatus>('all');

  // Use Supabase data if available, fall back to mock data
  const liveWebinars: Webinar[] = webinarData.webinars.length > 0
    ? webinarData.webinars.map((w: any) => ({
        id: w.id,
        title: w.title,
        description: w.description || '',
        type: w.type || 'free',
        status: w.status || 'upcoming',
        date: w.date ? new Date(w.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
        time: w.time || '',
        duration: w.duration_minutes ? `${w.duration_minutes} min` : '60 min',
        capacity: w.capacity || 500,
        registered: w.registered || 0,
        attended: w.attended || 0,
        speakers: (w.speakers || []).map((s: any) => ({ name: s.name, title: s.title || '', avatar: s.avatar_url || '', bio: s.bio || '' })),
        banner: w.banner_url || 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200',
        price: w.price,
        replayUrl: w.replay_url,
        replayExpiry: w.replay_expiry,
        courseUpsell: w.course_upsell,
        agenda: (w.agenda || []).map((a: any) => ({ time: a.time || '', title: a.title || '', description: a.description || '' })),
        tags: w.tags || [],
      }))
    : WEBINARS;

  const filteredWebinars = liveWebinars.filter(w => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (filterStatus !== 'all' && w.status !== filterStatus) return false;
    return true;
  });

  const handleRegister = async (webinarId: string) => {
    try {
      await webinarData.register(webinarId);
      toast.success('Registered successfully!');
    } catch {
      toast.error('Please sign in to register');
    }
  };

  const openWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setActiveView(webinar.status === 'live' ? 'live' : 'detail');
  };

  if (activeView === 'live' && selectedWebinar) {
    return <LiveWebinarView webinar={selectedWebinar} onBack={() => setActiveView('list')} />;
  }

  if (activeView === 'detail' && selectedWebinar) {
    return <WebinarDetailView webinar={selectedWebinar} onBack={() => setActiveView('list')} onGoLive={() => setActiveView('live')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Webinars & Live Events</h1>
              <p className="text-gray-500 mt-1">Learn live from experts and access replays</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700">
              <Video className="w-4 h-4" />Create Webinar
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'free' as const, label: 'Free' },
              { id: 'paid' as const, label: 'Paid' },
              { id: 'members_only' as const, label: 'Members Only' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-colors", filterType === f.id ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              >
                {f.label}
              </button>
            ))}
            <div className="w-px h-8 bg-gray-200 mx-2 self-center" />
            {[
              { id: 'all' as const, label: 'All Status' },
              { id: 'upcoming' as const, label: 'Upcoming' },
              { id: 'live' as const, label: '🔴 Live' },
              { id: 'replay' as const, label: 'Replays' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-colors", filterStatus === f.id ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Webinar List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebinars.map(webinar => (
            <motion.div
              key={webinar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => openWebinar(webinar)}
            >
              <div className="relative">
                <img src={webinar.banner} alt={webinar.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={cn("px-3 py-1 text-xs font-bold rounded-full", webinar.status === 'live' ? "bg-red-500 text-white animate-pulse" : webinar.status === 'replay' ? "bg-purple-500 text-white" : "bg-green-500 text-white")}>
                    {webinar.status === 'live' ? '🔴 LIVE' : webinar.status === 'replay' ? '▶ Replay' : 'Upcoming'}
                  </span>
                  {webinar.type === 'free' && <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">FREE</span>}
                  {webinar.type === 'paid' && <span className="px-3 py-1 bg-white text-gray-700 text-xs font-bold rounded-full">₦{webinar.price?.toLocaleString()}</span>}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{webinar.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{webinar.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{webinar.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{webinar.time}</span>
                  <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{webinar.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={webinar.speakers[0]?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{webinar.speakers[0]?.name}</p>
                      <p className="text-[10px] text-gray-400">{webinar.speakers[0]?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {webinar.registered}/{webinar.capacity}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Webinar Detail View â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WebinarDetailView: React.FC<{ webinar: Webinar; onBack: () => void; onGoLive: () => void; }> = ({ webinar, onBack, onGoLive }) => {
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, mins: 45, secs: 30 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-[400px]">
        <img src={webinar.banner} alt={webinar.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-white/70 text-sm mb-4 hover:text-white">← Back to Webinars</button>
            <div className="flex gap-2 mb-3">
              <span className={cn("px-3 py-1 text-xs font-bold rounded-full", webinar.type === 'free' ? "bg-yellow-400 text-yellow-900" : "bg-white text-gray-700")}>
                {webinar.type === 'free' ? 'FREE' : `₦${webinar.price?.toLocaleString()}`}
              </span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                {webinar.status === 'replay' ? 'Replay Available' : 'Upcoming'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{webinar.title}</h1>
            <p className="text-white/70 text-lg">{webinar.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{webinar.date}</p>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{webinar.time}</p>
                  <p className="text-xs text-gray-500">Time</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Timer className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{webinar.duration}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
              </div>

              {/* Speakers */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Speakers</h3>
              {webinar.speakers.map((speaker, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-3">
                  <img src={speaker.avatar} alt={speaker.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{speaker.name}</p>
                    <p className="text-sm text-primary-600">{speaker.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{speaker.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Agenda */}
            {webinar.agenda.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Agenda</h3>
                <div className="space-y-3">
                  {webinar.agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <span className="text-sm font-mono text-primary-600 font-bold w-12 shrink-0">{item.time}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Countdown */}
            {webinar.status === 'upcoming' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Starts In</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hrs', value: countdown.hours },
                    { label: 'Min', value: countdown.mins },
                    { label: 'Sec', value: countdown.secs },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-900 rounded-xl p-3 text-center">
                      <p className="text-xl font-black text-white">{String(item.value).padStart(2, '0')}</p>
                      <p className="text-[9px] text-gray-400 uppercase">{item.label}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
                  Register Now — Free
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  {webinar.capacity - webinar.registered} spots remaining
                </p>
              </div>
            )}

            {/* Replay */}
            {webinar.status === 'replay' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Watch Replay</h3>
                <button onClick={onGoLive} className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />Watch Now
                </button>
                {webinar.replayExpiry && (
                  <p className="text-xs text-red-500 text-center mt-2 font-medium">
                    â° Expires: {webinar.replayExpiry}
                  </p>
                )}
              </div>
            )}

            {/* Upsell */}
            {webinar.courseUpsell && (
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                <Gift className="w-8 h-8 mb-3 text-white/80" />
                <h3 className="font-bold mb-1">Exclusive Offer</h3>
                <p className="text-sm text-white/80 mb-3">{webinar.courseUpsell.discount}</p>
                <p className="text-2xl font-black mb-3">{webinar.courseUpsell.price}</p>
                <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Enroll in {webinar.courseUpsell.title}
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Registration Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Registered</span>
                  <span className="font-bold text-gray-900">{webinar.registered}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(webinar.registered / webinar.capacity) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{Math.round((webinar.registered / webinar.capacity) * 100)}% full</span>
                  <span>{webinar.capacity} capacity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Live Webinar View â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LiveWebinarView: React.FC<{ webinar: Webinar; onBack: () => void; }> = ({ webinar, onBack }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Dr. Megor', message: 'Welcome everyone! We\'re about to begin. 🎉', time: '7:00 PM', isHost: true },
    { id: '2', user: 'Adaeze O.', message: 'So excited for this session!', time: '7:01 PM', isHost: false },
    { id: '3', user: 'Emeka C.', message: 'Joining from Lagos. Ready to learn!', time: '7:01 PM', isHost: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showOffer, setShowOffer] = useState(false);
  const [viewerCount] = useState(289);
  const [activePoll, setActivePoll] = useState<Poll | null>({
    id: '1',
    question: 'What is your biggest postpartum challenge?',
    options: [
      { label: 'Sleep deprivation', votes: 89 },
      { label: 'Breastfeeding', votes: 67 },
      { label: 'Emotional wellness', votes: 54 },
      { label: 'Partner support', votes: 38 },
    ],
    isActive: true,
  });

  // Simulate offer popup at "minute 42"
  useEffect(() => {
    const timer = setTimeout(() => setShowOffer(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const totalVotes = activePoll ? activePoll.options.reduce((sum, o) => sum + o.votes, 0) : 0;

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← Exit</button>
          <div className="h-4 w-px bg-gray-700" />
          <span className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold">LIVE</span>
          </span>
          <span className="text-white font-semibold text-sm truncate max-w-md">{webinar.title}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{viewerCount} watching</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />42:15</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">Live Stream</p>
              <p className="text-white/30 text-sm mt-1">Video player would render here</p>
            </div>

            {/* Offer Popup */}
            {showOffer && webinar.courseUpsell && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-6 right-6 bg-white rounded-2xl p-5 shadow-2xl max-w-sm"
              >
                <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
                <Gift className="w-8 h-8 text-primary-600 mb-2" />
                <h4 className="font-black text-gray-900">🎉 Special Offer!</h4>
                <p className="text-sm text-gray-600 mt-1">{webinar.courseUpsell.discount}</p>
                <p className="text-2xl font-black text-primary-600 mt-2">{webinar.courseUpsell.price}</p>
                <button className="w-full mt-3 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 text-sm">
                  Claim Discount →
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">Offer expires when webinar ends</p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="h-14 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><Volume2 className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><Maximize className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30">
                <Hand className="w-4 h-4" />Raise Hand
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
                <Download className="w-4 h-4" />Resources
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
                <Share2 className="w-4 h-4" />Share
              </button>
            </div>
          </div>
        </div>

        {/* Chat & Engagement Sidebar */}
        <div className="w-[340px] bg-gray-800 border-l border-gray-700 flex flex-col shrink-0">
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="h-10 border-b border-gray-700 flex items-center px-4">
              <span className="text-sm font-bold text-white">Live Chat</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="flex gap-2">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0", msg.isHost ? "bg-primary-600 text-white" : "bg-gray-600 text-gray-300")}>
                    {msg.user[0]}
                  </div>
                  <div>
                    <span className={cn("text-xs font-semibold", msg.isHost ? "text-primary-400" : "text-gray-400")}>{msg.user}</span>
                    <p className="text-sm text-gray-200">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-500"
                />
                <button className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Poll */}
          {activePoll && (
            <div className="border-t border-gray-700 p-4">
              <h4 className="text-sm font-bold text-white mb-3">📊 Live Poll</h4>
              <p className="text-sm text-gray-300 mb-3">{activePoll.question}</p>
              <div className="space-y-2">
                {activePoll.options.map((opt, idx) => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  return (
                    <button key={idx} className="w-full relative overflow-hidden rounded-lg bg-gray-700 p-2.5 text-left hover:bg-gray-600 transition-colors">
                      <div className="absolute inset-0 bg-primary-600/20 rounded-lg" style={{ width: `${pct}%` }} />
                      <div className="relative flex items-center justify-between">
                        <span className="text-sm text-gray-200">{opt.label}</span>
                        <span className="text-xs font-bold text-primary-400">{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">{totalVotes} votes</p>
            </div>
          )}

          {/* Emoji Reactions */}
          <div className="border-t border-gray-700 p-3 flex items-center justify-center gap-3">
            {['❤️', '👏', '🔥', '💡', '😮', '🎉'].map(emoji => (
              <button key={emoji} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
