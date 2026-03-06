import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Users, MessageCircle, Heart, Share2, MoreHorizontal,
  Plus, Search, Bell, TrendingUp, Calendar, Award,
  Baby, Stethoscope, HeartHandshake, Brain, Sparkles, Send, Lock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { useCommunityData } from './community/useCommunityData';

// Dynamic icon mapping
const SPACE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare: MessageCircle,
  Users: Users,
  Heart: Heart,
  Brain: Brain,
  HeartHandshake: HeartHandshake,
  Stethoscope: Stethoscope,
  Baby: Baby,
  Sparkles: Sparkles,
};

const SpaceIcon: React.FC<{ value?: string; className?: string }> = ({ value, className }) => {
  const normalized = (value || '').trim();
  const Icon = normalized ? SPACE_ICON_MAP[normalized] || SPACE_ICON_MAP[normalized.toLowerCase()] : undefined;
  if (Icon) return <Icon className={className} />;
  return <span className={className}>{normalized ? normalized.charAt(0).toUpperCase() : ''}</span>;
};

export const Community: React.FC = () => {
  const community = useCommunityData();
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Post creation state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Expanded post for comments
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeSpace) {
      community.loadPostsBySpace(activeSpace);
    } else {
      community.loadPostsBySpace(); // Load all
    }
  }, [activeSpace, community.loadPostsBySpace]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    const spaceId = activeSpace || (community.spaces[0] && community.spaces[0].id);
    if (!spaceId) {
      toast.error('Please select a space to post in.');
      return;
    }

    try {
      await community.submitPost(spaceId, newPostContent);
      setNewPostContent('');
      setIsCreatingPost(false);
      toast.success('Post created successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create post.');
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      await community.togglePostLike(postId);
    } catch (error) {
      toast.error('Failed to like post.');
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handlePostComment = async (postId: string) => {
    const content = newCommentContent[postId];
    if (!content?.trim()) return;

    try {
      await community.submitComment(postId, content);
      setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
      toast.success('Comment added!');
      // Ideally we should refresh the post replies, but useCommunityData updates via realtime or we can mock it here
      // For full real-time we'd rely on Supabase subscriptions which useCommunityData has
    } catch (error) {
      toast.error('Failed to post comment.');
    }
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    let postsToFilter = community.posts;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      postsToFilter = postsToFilter.filter(p =>
        p.content?.toLowerCase().includes(lowerQuery) ||
        p.author?.full_name?.toLowerCase().includes(lowerQuery)
      );
    }
    return postsToFilter;
  }, [community.posts, searchQuery]);

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
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreatingPost(true)}>
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
                <button
                  onClick={() => setActiveSpace(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeSpace === null
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center text-white`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 text-sm">All Spaces</p>
                  </div>
                </button>
                {community.spaces.map((space: any) => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpace(space.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeSpace === space.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: space.color || '#9333ea' }}
                    >
                      <SpaceIcon value={space.icon} className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                        {space.name}
                        {space.visibility === 'private' && <Lock className="w-3 h-3 text-gray-400" />}
                      </p>
                      <p className="text-xs text-gray-500">{(space.memberCount || space.members?.[0]?.count || 0).toLocaleString()} members</p>
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
                {community.leaderboard.length > 0 ? (
                  community.leaderboard.slice(0, 5).map((entry: any, idx: number) => {
                    const avatar = entry.user?.avatar_url || entry.avatar;
                    const name = entry.user?.full_name || entry.name || 'Anonymous';
                    const points = entry.total_points || entry.points || 0;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400 w-5">{idx + 1}</span>
                        <Avatar src={avatar} name={name} size="sm" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm flex items-center gap-1">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500">{points.toLocaleString()} points</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No contributors yet.</p>
                )}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="bg-white"
                />
              </div>
              <Button variant="outline" className="px-4">
                <TrendingUp className="w-5 h-5" />
              </Button>
            </div>

            {/* Create Post Card */}
            {(isCreatingPost || activeSpace) && (
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar src={community.user?.user_metadata?.avatar_url} name={community.user?.user_metadata?.full_name || "You"} size="md" />
                  <div className="flex-1 space-y-3">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={activeSpace ? `Share something with ${community.spaces.find((s: any) => s.id === activeSpace)?.name}...` : "Share something with the community..."}
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl text-gray-700 outline-none border border-gray-200 focus:border-primary-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      {isCreatingPost && <Button variant="ghost" onClick={() => { setIsCreatingPost(false); setNewPostContent(''); }}>Cancel</Button>}
                      <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>Post</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!isCreatingPost && !activeSpace && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={community.user?.user_metadata?.avatar_url} name={community.user?.user_metadata?.full_name || "You"} size="md" />
                  <button onClick={() => setIsCreatingPost(true)} className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors">
                    Share something with the community...
                  </button>
                </div>
              </Card>
            )}

            {/* Posts */}
            {community.isLoading && filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No posts found. Start the conversation!</div>
            ) : (
              filteredPosts.map((post: any) => {
                const authorName = post.author?.full_name || post.author?.name || 'Member';
                const authorAvatar = post.author?.avatar_url || post.author?.avatar;
                const authorRole = post.author?.role;
                const isExpert = authorRole === 'instructor' || authorRole === 'admin';
                const spaceName = community.spaces.find((s: any) => s.id === post.space_id)?.name || post.space || 'General';
                const timeCreated = post.created_at ? new Date(post.created_at).toLocaleDateString() : post.time || '';
                const isLiked = community.userLikes.postIds.includes(post.id) || post.isLiked;
                const likesCount = (post.likesCount != null) ? post.likesCount : post.likes;
                const commentsCount = (post.commentsCount != null) ? post.commentsCount : post.comments;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={authorAvatar || undefined} name={authorName} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{authorName}</p>
                              {isExpert && (
                                <Badge size="sm" variant="info">Expert</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {spaceName} • {timeCreated}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          {likesCount || 0}
                        </button>
                        <button
                          onClick={() => handleToggleComments(post.id)}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          {commentsCount || 0}
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                          Share
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments.has(post.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
                          {/* Replies list (could load actual replies here if we hook them into useCommunityData) */}
                          {post.replies?.map((reply: any) => (
                            <div key={reply.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                              <Avatar src={reply.author?.avatar_url || reply.author?.avatar || undefined} name={reply.author?.full_name || reply.author?.name || 'Member'} size="sm" />
                              <div>
                                <p className="text-sm font-semibold">{reply.author?.full_name || reply.author?.name || 'Member'}</p>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                          {post.replies?.length === 0 && <p className="text-xs text-gray-500">No comments yet.</p>}

                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Write a comment..."
                              value={newCommentContent[post.id] || ''}
                              onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                              className="flex-1 bg-gray-50"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handlePostComment(post.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handlePostComment(post.id)}
                              disabled={!newCommentContent[post.id]?.trim()}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })
            )}

            {filteredPosts.length > 0 && (
              <div className="text-center py-8">
                <Button variant="outline">Load More Posts</Button>
              </div>
            )}
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
                {community.events.length > 0 ? (
                  community.events.slice(0, 3).map((event: any) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{event.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{event.date} at {event.time}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{event.attendees || 0} attending</span>
                        <Button
                          size="sm"
                          variant={event.isRsvped ? 'primary' : 'ghost'}
                          className="text-xs"
                          onClick={() => community.toggleEventRsvp(event.id)}
                        >
                          {event.isRsvped ? 'RSVP\'d' : 'RSVP'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">No upcoming events.</p>
                )}
              </div>
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
