import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, MessageCircle, Heart, Share2, MoreHorizontal, 
  Plus, Search, Bell, TrendingUp, Calendar, Award,
  Baby, Stethoscope, HeartHandshake, Brain, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';

const spaces = [
  { id: 'new-moms', name: 'New Moms', icon: Baby, members: 5420, posts: 1250, color: 'bg-pink-500' },
  { id: 'expecting', name: 'Expecting Moms', icon: Heart, members: 3180, posts: 890, color: 'bg-purple-500' },
  { id: 'dads', name: 'Dads Lounge', icon: Users, members: 1850, posts: 420, color: 'bg-blue-500' },
  { id: 'mental-health', name: 'Mental Health', icon: Brain, members: 2340, posts: 680, color: 'bg-green-500' },
  { id: 'marriage', name: 'Marriage & Intimacy', icon: HeartHandshake, members: 1920, posts: 510, color: 'bg-red-500' },
  { id: 'expert', name: 'Expert Corner', icon: Stethoscope, members: 4100, posts: 320, color: 'bg-yellow-500' },
];

const posts = [
  {
    id: 1,
    author: { name: 'Adaeze O.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100' },
    space: 'New Moms',
    content: "Just completed my first week postpartum and I can't believe how much the nutrition module helped! The pepper soup recipe Dr. Megor shared has been amazing for my recovery. Anyone else tried it?",
    likes: 48,
    comments: 12,
    time: '2 hours ago',
    isLiked: false,
  },
  {
    id: 2,
    author: { name: 'Anonymous', avatar: null },
    space: 'Mental Health',
    content: "I've been feeling really overwhelmed lately. My baby is 3 weeks old and I can't stop crying. Is this normal? I'm scared to tell my family because they'll think I'm ungrateful.",
    likes: 89,
    comments: 34,
    time: '4 hours ago',
    isLiked: true,
    isAnonymous: true,
  },
  {
    id: 3,
    author: { name: 'Dr. Megor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100', isExpert: true },
    space: 'Expert Corner',
    content: "🌟 Quick tip for today: If your baby is cluster feeding in the evenings, this is completely normal! It's their way of building your milk supply. Stay hydrated, rest when you can, and remember - this phase passes. You're doing amazing! 💪",
    likes: 156,
    comments: 28,
    time: '6 hours ago',
    isLiked: false,
  },
  {
    id: 4,
    author: { name: 'Chukwuemeka E.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    space: 'Dads Lounge',
    content: "Fellow dads, how do you handle it when your wife says she doesn't need help but clearly does? I want to support her but don't want to overstep. The partner course helped but real-life application is tricky!",
    likes: 67,
    comments: 45,
    time: '8 hours ago',
    isLiked: false,
  },
];

const upcomingEvents = [
  { id: 1, title: 'Live Q&A with Dr. Megor', date: 'Tomorrow, 3:00 PM', attendees: 234 },
  { id: 2, title: 'New Moms Support Circle', date: 'Friday, 5:00 PM', attendees: 89 },
  { id: 3, title: 'Breastfeeding Workshop', date: 'Saturday, 10:00 AM', attendees: 156 },
];

const topContributors = [
  { name: 'Ngozi A.', points: 2450, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', badge: '🏆' },
  { name: 'Folake M.', points: 2180, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100', badge: '⭐' },
  { name: 'Amaka O.', points: 1920, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', badge: '💎' },
];

export const Community: React.FC = () => {
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set([2]));

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Community</h1>
              <p className="text-gray-600">Connect, share, and find support in our global village</p>
            </div>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Post
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Spaces */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                Spaces
              </h3>
              <div className="space-y-2">
                {spaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpace(activeSpace === space.id ? null : space.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      activeSpace === space.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 ${space.color} rounded-xl flex items-center justify-center text-white`}>
                      <space.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{space.name}</p>
                      <p className="text-xs text-gray-500">{space.members.toLocaleString()} members</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Top Contributors */}
            <Card className="p-4 hidden lg:block">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {topContributors.map((user, idx) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-5">{idx + 1}</span>
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm flex items-center gap-1">
                        {user.name} {user.badge}
                      </p>
                      <p className="text-xs text-gray-500">{user.points.toLocaleString()} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search posts..."
                  leftIcon={<Search className="w-5 h-5" />}
                  className="bg-white"
                />
              </div>
              <Button variant="outline" className="px-4">
                <TrendingUp className="w-5 h-5" />
              </Button>
            </div>

            {/* Create Post Card */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Avatar name="You" size="md" />
                <button className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors">
                  Share something with the community...
                </button>
              </div>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {post.isAnonymous ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                      ) : (
                        <Avatar src={post.author.avatar || undefined} name={post.author.name} />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{post.author.name}</p>
                          {post.author.isExpert && (
                            <Badge size="sm" variant="info">Expert</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {post.space} • {post.time}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes + (likedPosts.has(post.id) && !post.isLiked ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}

            <div className="text-center py-8">
              <Button variant="outline">Load More Posts</Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Events */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-900 text-sm mb-1">{event.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{event.date}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{event.attendees} attending</span>
                      <Button size="sm" variant="ghost" className="text-xs">RSVP</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/community/events">
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Events
                </Button>
              </Link>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-4 bg-primary-50 border-primary-100">
              <h3 className="font-bold text-gray-900 mb-2">Community Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be respectful and supportive</li>
                <li>• No medical advice - consult professionals</li>
                <li>• Keep discussions on-topic</li>
                <li>• Report inappropriate content</li>
              </ul>
            </Card>

            {/* Join Premium */}
            <Card className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
              <Sparkles className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="font-bold mb-2">Unlock Premium</h3>
              <p className="text-sm text-primary-100 mb-4">
                Get access to exclusive expert sessions and private groups.
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
