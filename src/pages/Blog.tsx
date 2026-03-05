import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Calendar, Clock, User, ArrowRight, Tag,
  BookOpen, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { supabase } from '../lib/supabase';

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'education', label: 'Education' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'community', label: 'Community' },
  { id: 'culture', label: 'Culture' },
];

const blogPosts = [
  {
    id: '1',
    slug: '7-myths-about-postnatal-recovery',
    title: '7 Myths About Postnatal Recovery You Need to Stop Believing',
    excerpt: 'From "bouncing back" to breastfeeding misconceptions, we debunk the most common myths that can harm new mothers.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800',
    category: 'education',
    author: { name: 'Dr. Megor Ikuenobe', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
    date: '2025-02-15',
    readTime: 8,
    featured: true,
  },
  {
    id: '2',
    slug: 'nutrition-guide-breastfeeding-moms',
    title: 'The Complete Nutrition Guide for Breastfeeding Moms',
    excerpt: 'What to eat, what to avoid, and how traditional African foods can boost your milk supply naturally.',
    image: 'https://images.unsplash.com/photo-1505576121720-9551e39fbbaf?auto=format&fit=crop&q=80&w=800',
    category: 'nutrition',
    author: { name: 'Nurse Tolani Adewale', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100' },
    date: '2025-02-10',
    readTime: 12,
    featured: false,
  },
  {
    id: '3',
    slug: 'power-of-the-village',
    title: 'The Power of the Village: Why Community Matters in Motherhood',
    excerpt: 'How rebuilding your support network can transform your postpartum experience.',
    image: 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=800',
    category: 'community',
    author: { name: 'Dr. Amara Obi', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=100' },
    date: '2025-02-05',
    readTime: 6,
    featured: false,
  },
  {
    id: '4',
    slug: 'traditional-omugwo-modern-world',
    title: 'Traditional Omugwo in the Modern World: Finding Balance',
    excerpt: 'How to honor cultural practices while embracing evidence-based care for you and your baby.',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=800',
    category: 'culture',
    author: { name: 'Dr. Megor Ikuenobe', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
    date: '2025-01-28',
    readTime: 10,
    featured: false,
  },
  {
    id: '5',
    slug: 'postpartum-depression-signs',
    title: 'Recognizing Postpartum Depression: Signs Every Family Should Know',
    excerpt: 'Early detection saves lives. Learn the warning signs and when to seek help.',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800',
    category: 'wellness',
    author: { name: 'Dr. Amara Obi', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=100' },
    date: '2025-01-20',
    readTime: 9,
    featured: false,
  },
  {
    id: '6',
    slug: 'partner-support-postpartum',
    title: 'How Partners Can Provide Meaningful Support During Postpartum',
    excerpt: 'Practical tips for fathers and partners to be truly helpful during the fourth trimester.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800',
    category: 'education',
    author: { name: 'Dr. Kofi Mensah', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100' },
    date: '2025-01-15',
    readTime: 7,
    featured: false,
  },
];

export const Blog: React.FC = () => {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  const [selectedDynamicPost, setSelectedDynamicPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, cover_image_url, category, published_at, author_id')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setDynamicPosts(data || []);
      } catch (e) {
        console.error('Failed to load blog posts', e);
        setDynamicPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (!slug) {
      setSelectedDynamicPost(null);
      return;
    }

    const run = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, content, cover_image_url, category, published_at')
          .eq('status', 'published')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        setSelectedDynamicPost(data || null);
      } catch (e) {
        console.error('Failed to load blog post', e);
        setSelectedDynamicPost(null);
      }
    };

    run();
  }, [slug]);

  const effectivePosts = dynamicPosts.length > 0 ? dynamicPosts.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    image: p.cover_image_url || '',
    category: p.category || 'education',
    author: { name: 'Omugwo Academy', avatar: '' },
    date: p.published_at || new Date().toISOString(),
    readTime: 8,
    featured: false,
  })) : blogPosts;

  const filteredPosts = effectivePosts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = effectivePosts.find((p: any) => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured || activeCategory !== 'all');

  const selectedPost = useMemo(() => {
    if (!slug) return null;
    return effectivePosts.find((p: any) => p.slug === slug) || null;
  }, [slug, effectivePosts]);

  if (slug && (selectedDynamicPost || selectedPost)) {
    const post = selectedDynamicPost || selectedPost;
    return (
      <div className="pt-20">
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <Link to="/blog" className="text-sm font-bold text-primary-700">← Back to Blog</Link>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4">{post.title}</h1>
            <p className="text-gray-600 mt-4">{post.excerpt}</p>
            {post.content && (
              <div className="prose prose-gray max-w-none mt-8">
                <p>{post.content}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge className="mb-4">The Omugwo Journal</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Stories, Tips & Insights
            </h1>
            <p className="text-xl text-gray-600">
              Expert advice and real stories from our community of parents and professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === 'all' && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to={`/blog/${featuredPost.slug}`}>
                <Card hover padding="none" className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="mb-4 w-fit">Featured</Badge>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4">
                        <Avatar src={featuredPost.author.avatar} name={featuredPost.author.name} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{featuredPost.author.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {featuredPost.readTime} min read
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 border-b border-gray-100 sticky top-16 bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {regularPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <Card hover padding="none" className="h-full flex flex-col">
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-4 left-4 capitalize">
                          {post.category}
                        </Badge>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                            <span className="text-sm text-gray-600">{post.author.name.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {regularPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-8">
            Get the latest articles, tips, and resources delivered to your inbox weekly.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button variant="secondary">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};
