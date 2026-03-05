import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCommunityData } from './useCommunityData';
import {
  MessageSquare, Users, Heart, ThumbsUp, Bookmark, Share2, Flag,
  Send, Image, Paperclip, Video, Hash, Bell, Search, Plus, Star,
  Shield, Award, Trophy, Crown, ChevronDown, ChevronRight, MoreHorizontal,
  Eye, EyeOff, Pin, Lock, Globe, UserPlus, Calendar, MapPin, Clock,
  TrendingUp, Flame, Filter, ArrowUp, MessageCircle, CheckCircle
} from 'lucide-react';

const SPACE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Users,
  Heart,
  Shield,
  Award,
  Trophy,
  Crown,
  Globe,
  Lock,
  Calendar,
  Flag,
};

const SpaceIcon: React.FC<{ value?: string; className?: string }> = ({ value, className }) => {
  const normalized = (value || '').trim();
  const Icon = normalized ? SPACE_ICON_MAP[normalized] || SPACE_ICON_MAP[normalized.toLowerCase()] : undefined;
  if (Icon) return <Icon className={className} />;
  return <span className={className}>{normalized || ''}</span>;
};

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Space {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  postCount: number;
  visibility: 'public' | 'private' | 'invite_only';
  moderationLevel: 'open' | 'semi' | 'strict';
  color: string;
}

interface Post {
  id: string;
  spaceId: string;
  author: { name: string; avatar: string; role: string; badge?: string; isExpert?: boolean; };
  content: string;
  images?: string[];
  tags: string[];
  isAnonymous: boolean;
  isPinned: boolean;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  replies?: Reply[];
}

interface Reply {
  id: string;
  author: { name: string; avatar: string; role: string; isExpert?: boolean; };
  content: string;
  likes: number;
  isLiked: boolean;
  isBestAnswer: boolean;
  createdAt: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isRsvped: boolean;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SPACES: Space[] = [
  { id: '1', name: 'New Moms', description: 'Support and advice for first-time mothers', icon: '👶', memberCount: 8420, postCount: 12500, visibility: 'public', moderationLevel: 'semi', color: '#e85d75' },
  { id: '2', name: 'Dads Lounge', description: 'A safe space for fathers to connect and share', icon: '👨', memberCount: 3200, postCount: 4800, visibility: 'public', moderationLevel: 'open', color: '#3b82f6' },
  { id: '3', name: 'Mental Health', description: 'Postpartum mental health support and resources', icon: '🧠', memberCount: 5600, postCount: 7200, visibility: 'public', moderationLevel: 'strict', color: '#8b5cf6' },
  { id: '4', name: 'Marriage & Intimacy', description: 'Navigating relationships after baby', icon: '💑', memberCount: 4100, postCount: 3900, visibility: 'public', moderationLevel: 'semi', color: '#f59e0b' },
  { id: '5', name: 'Expert Q&A', description: 'Ask verified professionals your questions', icon: '🩺', memberCount: 12000, postCount: 8900, visibility: 'public', moderationLevel: 'strict', color: '#059669' },
  { id: '6', name: 'Masterclass Cohort', description: 'Private group for current cohort students', icon: '🎓', memberCount: 250, postCount: 1200, visibility: 'private', moderationLevel: 'open', color: '#dc2626' },
];

const POSTS: Post[] = [
  {
    id: '1', spaceId: '1',
    author: { name: 'Adaeze O.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100', role: 'Mom of 1', badge: 'Community Star' },
    content: "Just finished Module 3 of the Masterclass and I'm blown away by the breastfeeding section. The traditional techniques combined with modern research is exactly what I needed. Anyone else finding the night feeding tips helpful? 🌙",
    tags: ['breastfeeding', 'masterclass', 'tips'],
    isAnonymous: false, isPinned: false, likes: 47, comments: 12, isLiked: false, isBookmarked: false,
    createdAt: '2 hours ago',
    replies: [
      { id: 'r1', author: { name: 'Dr. Megor I.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100', role: 'Founder', isExpert: true }, content: "So glad you're finding it helpful, Adaeze! The night feeding module was developed with input from 3 lactation consultants. Don't hesitate to reach out if you need personalized guidance.", likes: 23, isLiked: false, isBestAnswer: true, createdAt: '1 hour ago' },
      { id: 'r2', author: { name: 'Ngozi A.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', role: 'Mom of 3' }, content: "Yes! The side-lying position tip was a game changer for me. My baby latches so much better now.", likes: 8, isLiked: false, isBestAnswer: false, createdAt: '45 min ago' },
    ],
  },
  {
    id: '2', spaceId: '3',
    author: { name: 'Anonymous', avatar: '', role: '', },
    content: "I've been struggling with postpartum anxiety for 3 weeks now. Some days I feel like I can't breathe. Is this normal? I'm scared to tell my family because they'll think I'm ungrateful for my baby. 😢",
    tags: ['anxiety', 'support', 'anonymous'],
    isAnonymous: true, isPinned: false, likes: 89, comments: 34, isLiked: true, isBookmarked: true,
    createdAt: '5 hours ago',
    replies: [
      { id: 'r3', author: { name: 'Dr. Chioma N.', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100', role: 'Clinical Psychologist', isExpert: true }, content: "What you're experiencing is more common than you think — about 1 in 5 new mothers experience postpartum anxiety. You are NOT ungrateful. This is a medical condition, not a character flaw. Please reach out to a healthcare provider. You can also DM me for a free 15-minute consultation. 💛", likes: 56, isLiked: false, isBestAnswer: true, createdAt: '4 hours ago' },
    ],
  },
  {
    id: '3', spaceId: '2',
    author: { name: 'Emeka C.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', role: 'Dad of 2', badge: 'Dad Advocate' },
    content: "Completed the Partner Support Training today! 🎉 Honestly, I wish I had this before our first child. The module on 'reading your partner's unspoken needs' hit different. Fellas, this course is worth every naira.",
    tags: ['partner-training', 'completed', 'review'],
    isAnonymous: false, isPinned: true, likes: 124, comments: 28, isLiked: false, isBookmarked: false,
    createdAt: '1 day ago',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Adaeze O.', points: 2450, badge: 'Community Star', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100' },
  { rank: 2, name: 'Emeka C.', points: 2180, badge: 'Dad Advocate', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { rank: 3, name: 'Ngozi A.', points: 1920, badge: 'Mentor Mom', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { rank: 4, name: 'Folake M.', points: 1750, badge: 'Helper', avatar: '' },
  { rank: 5, name: 'Chidi O.', points: 1680, badge: 'Rising Star', avatar: '' },
];

const EVENTS: CommunityEvent[] = [
  { id: '1', title: 'Monthly Mom Meetup', date: 'Mar 20, 2025', time: '4:00 PM WAT', location: 'Zoom', attendees: 85, isRsvped: false },
  { id: '2', title: 'Expert AMA: Infant Sleep', date: 'Mar 25, 2025', time: '7:00 PM WAT', location: 'Community Live', attendees: 120, isRsvped: true },
  { id: '3', title: 'Dad\'s Night Out (Virtual)', date: 'Mar 28, 2025', time: '8:00 PM WAT', location: 'Zoom', attendees: 42, isRsvped: false },
];

const BADGES: Badge[] = [
  { id: '1', name: 'New Mom', icon: '👶', description: 'Joined the community' },
  { id: '2', name: 'Dad Advocate', icon: '💪', description: 'Active in Dads Lounge' },
  { id: '3', name: 'Mental Health Champion', icon: '🧠', description: 'Supported 10+ members' },
  { id: '4', name: 'Community Star', icon: '⭐', description: '1000+ points earned' },
  { id: '5', name: 'Course Completer', icon: '🎓', description: 'Completed a course' },
  { id: '6', name: 'Helpful Answer', icon: '✅', description: '10+ best answers' },
];

// â”€â”€â”€ Community App Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const CommunityApp: React.FC = () => {
  const { postId } = useParams();
  const community = useCommunityData();
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'spaces' | 'events' | 'leaderboard' | 'badges'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [isPosting, setIsPosting] = useState(false);

  // Use Supabase data if available, fall back to mock data
  const liveSpaces = community.spaces.length > 0 ? community.spaces : SPACES;
  const livePosts = community.posts.length > 0 ? community.posts.map((p: any) => ({
    id: p.id,
    spaceId: p.space_id,
    author: p.author ? { name: p.author.full_name || 'Anonymous', avatar: p.author.avatar_url || '', role: p.author.role || '', isExpert: p.author.role === 'instructor' } : { name: 'Anonymous', avatar: '', role: '' },
    content: p.content,
    images: p.images || [],
    tags: p.tags || [],
    isAnonymous: p.is_anonymous || false,
    isPinned: p.is_pinned || false,
    likes: p.likesCount || 0,
    comments: p.commentsCount || 0,
    isLiked: community.userLikes.postIds.includes(p.id),
    isBookmarked: false,
    createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
    replies: [],
  })) : POSTS;
  const liveEvents = community.events.length > 0 ? community.events.map((e: any) => ({
    id: e.id, title: e.title, date: e.date, time: e.time, location: e.location, attendees: e.attendees || 0, isRsvped: false,
  })) : EVENTS;
  const liveLeaderboard = community.leaderboard.length > 0 ? community.leaderboard.map((l: any, i: number) => ({
    rank: i + 1, name: l.user?.full_name || 'User', points: l.total_points || 0, badge: '', avatar: l.user?.avatar_url || '',
  })) : LEADERBOARD;
  const liveBadges = community.badges.length > 0 ? community.badges : BADGES;

  // Load posts by space when space changes
  useEffect(() => {
    if (activeSpace) {
      community.loadPostsBySpace(activeSpace);
    } else {
      community.loadPostsBySpace();
    }
  }, [activeSpace]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    const spaceId = activeSpace || liveSpaces[0]?.id;
    if (!spaceId) return;
    setIsPosting(true);
    try {
      await community.submitPost(spaceId, newPostContent, isAnonymous);
      setNewPostContent('');
      toast.success('Post created!');
    } catch (err) {
      toast.error('Failed to create post. Please sign in.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await community.togglePostLike(postId);
    } catch {
      toast.error('Please sign in to like posts');
    }
  };

  const handleRsvp = async (eventId: string) => {
    try {
      await community.toggleEventRsvp(eventId);
    } catch {
      toast.error('Please sign in to RSVP');
    }
  };

  const filteredPosts = useMemo(() => livePosts.filter((p: any) => {
    if (activeSpace && p.spaceId !== activeSpace) return false;
    if (searchQuery) {
      return p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  }), [activeSpace, searchQuery, livePosts]);

  useEffect(() => {
    if (!postId) return;
    setActiveTab('feed');
    const el = document.getElementById(`community-post-${postId}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [postId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">Omugwo Community</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">15,420 members • 38,500 posts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search community..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 -mb-px">
            {[
              { id: 'feed' as const, label: 'Feed', icon: MessageSquare },
              { id: 'spaces' as const, label: 'Spaces', icon: Hash },
              { id: 'events' as const, label: 'Events', icon: Calendar },
              { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
              { id: 'badges' as const, label: 'Badges', icon: Award },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* â”€â”€â”€ Sidebar: Spaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Spaces</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSpace(null)}
                  className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors", !activeSpace ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-900/60 text-gray-600 dark:text-gray-300")}
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">All Spaces</span>
                </button>
                {liveSpaces.map((space: any) => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpace(space.id)}
                    className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors", activeSpace === space.id ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-900/60 text-gray-600 dark:text-gray-300")}
                  >
                    <SpaceIcon value={space.icon} className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <span className="font-medium block">{space.name}</span>
                      <span className="text-xs text-gray-400">{(space.memberCount || 0).toLocaleString()} members</span>
                    </div>
                    {space.visibility === 'private' && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Community Guidelines</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />Be respectful and supportive</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />No medical advice without credentials</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />Anonymous posting is available</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />Report harmful content</li>
              </ul>
            </div>
          </div>

          {/* â”€â”€â”€ Main Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:col-span-2 space-y-4">
            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <>
                {/* Post Composer */}
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-300"><Image className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-300"><Video className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-300"><Paperclip className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-300"><Hash className="w-4 h-4" /></button>
                      <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", isAnonymous ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300" : "hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-300")}
                      >
                        {isAnonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {isAnonymous ? 'Anonymous' : 'Public'}
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPostContent.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>

                {/* Sort Bar */}
                <div className="flex items-center gap-2">
                  {[
                    { id: 'recent' as const, label: 'Recent', icon: Clock },
                    { id: 'popular' as const, label: 'Popular', icon: Flame },
                    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
                  ].map(sort => (
                    <button
                      key={sort.id}
                      onClick={() => setSortBy(sort.id)}
                      className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", sortBy === sort.id ? "bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300" : "bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-gray-100 dark:border-gray-800")}
                    >
                      <sort.icon className="w-3 h-3" />
                      {sort.label}
                    </button>
                  ))}
                </div>

                {/* Posts */}
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} deepLinkPostId={postId} />
                ))}
              </>
            )}

            {/* Spaces Tab */}
            {activeTab === 'spaces' && (
              <div className="grid gap-4">
                {liveSpaces.map((space: any) => (
                  <div key={space.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: (space.color || '#666') + '15' }}>
                        <SpaceIcon value={space.icon} className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{space.name}</h3>
                          {space.visibility === 'private' && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 text-xs font-medium rounded-full flex items-center gap-1"><Lock className="w-3 h-3" />Private</span>}
                          {space.visibility === 'invite_only' && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">Invite Only</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{space.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(space.memberCount || 0).toLocaleString()} members</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{(space.postCount || 0).toLocaleString()} posts</span>
                          <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{space.moderationLevel || space.moderation_level || 'open'}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700">
                    <Plus className="w-4 h-4" />Create Event
                  </button>
                </div>
                {liveEvents.map((event: any) => (
                  <div key={event.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{event.attendees} attending</p>
                      </div>
                      <button
                        onClick={() => handleRsvp(event.id)}
                        className={cn("px-4 py-2 text-sm font-bold rounded-xl transition-colors", event.isRsvped ? "bg-green-100 text-green-700" : "bg-primary-600 text-white hover:bg-primary-700")}
                      >
                        {event.isRsvped ? '✓ RSVP\'d' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Community Leaderboard</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Top contributors this month</p>
                </div>
                <div className="divide-y">
                  {liveLeaderboard.map((entry: any) => (
                    <div key={entry.rank} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/60">
                      <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black", entry.rank === 1 ? "bg-yellow-100 text-yellow-700" : entry.rank === 2 ? "bg-gray-100 text-gray-600" : entry.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500")}>
                        {entry.rank}
                      </span>
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {entry.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{entry.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.badge}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary-600">{(entry.points || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Community Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {liveBadges.map((badge: any) => (
                    <div key={badge.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                      <span className="text-4xl block mb-3">{badge.icon}</span>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{badge.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Points System</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"><span className="text-gray-600 dark:text-gray-300">Create a post</span><span className="font-bold text-primary-600">+5 pts</span></div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"><span className="text-gray-600 dark:text-gray-300">Comment</span><span className="font-bold text-primary-600">+2 pts</span></div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"><span className="text-gray-600 dark:text-gray-300">Best answer</span><span className="font-bold text-primary-600">+10 pts</span></div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"><span className="text-gray-600 dark:text-gray-300">Course completion</span><span className="font-bold text-primary-600">+50 pts</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* â”€â”€â”€ Right Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:col-span-1 space-y-4 hidden lg:block">
            {/* Trending Tags */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['breastfeeding', 'sleep-training', 'postpartum', 'mental-health', 'nutrition', 'partner-support', 'self-care', 'baby-milestones'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Upcoming Events</h3>
              {EVENTS.slice(0, 2).map(event => (
                <div key={event.id} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Online Members */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2" />
                342 Online Now
              </h3>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/10 border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-bold text-primary-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                  +337
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Post Card Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PostCard: React.FC<{ post: Post; deepLinkPostId?: string }> = ({ post, deepLinkPostId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);

  useEffect(() => {
    if (deepLinkPostId && deepLinkPostId === post.id) {
      setShowReplies(true);
    }
  }, [deepLinkPostId, post.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      id={`community-post-${post.id}`}
      className="bg-white dark:bg-gray-950 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {post.isPinned && (
        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-500/10 border-b border-yellow-100 dark:border-yellow-500/20 flex items-center gap-2 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
          <Pin className="w-3 h-3" />Pinned Post
        </div>
      )}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          {post.isAnonymous ? (
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-purple-500" />
            </div>
          ) : (
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {post.isAnonymous ? 'Anonymous' : post.author.name}
              </span>
              {post.author.isExpert && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />Expert
                </span>
              )}
              {post.author.badge && (
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 text-[10px] font-bold rounded-full">
                  {post.author.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{post.isAnonymous ? '' : post.author.role + ' • '}{post.createdAt}</span>
          </div>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-3 whitespace-pre-line">{post.content}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 text-xs rounded-full">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors", liked ? "text-red-500 bg-red-50 dark:bg-red-500/10" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60")}>
            <Heart className={cn("w-4 h-4", liked && "fill-red-500")} />{post.likes + (liked && !post.isLiked ? 1 : 0)}
          </button>
          <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60">
            <MessageCircle className="w-4 h-4" />{post.comments}
          </button>
          <button onClick={() => setBookmarked(!bookmarked)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors", bookmarked ? "text-primary-600 bg-primary-50 dark:bg-primary-500/10" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60")}>
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-primary-600")} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60">
            <Share2 className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/60 hover:text-red-500">
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Replies */}
        {showReplies && post.replies && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
            {post.replies.map(reply => (
              <div key={reply.id} className={cn("p-3 rounded-xl", reply.isBestAnswer ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20" : "bg-gray-50 dark:bg-gray-900")}>
                {reply.isBestAnswer && (
                  <span className="text-[10px] font-bold text-green-700 dark:text-green-300 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" />Best Answer</span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <img src={reply.author.avatar} alt={reply.author.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{reply.author.name}</span>
                  {reply.author.isExpert && <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300 text-[9px] font-bold rounded-full">Expert</span>}
                  <span className="text-xs text-gray-400">{reply.createdAt}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{reply.content}</p>
              </div>
            ))}
            {/* Reply input */}
            <div className="flex gap-2">
              <input type="text" placeholder="Write a reply..." className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400" />
              <button className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
