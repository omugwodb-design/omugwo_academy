import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Users, BookOpen, Clock, FileText, Star,
  CheckCircle, ArrowRight, Filter, Search, GraduationCap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);

      if (error) throw error;

      // Transform data to match UI expectations if necessary
      const transformedCourses = data.map(course => {
        const instructor = { name: 'Omugwo Academy', avatar: '' };
        const fallbackImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800";
        const thumbnail = typeof course.thumbnail_url === 'string' ? course.thumbnail_url.trim() : '';

        return {
          ...course,
          image: thumbnail ? thumbnail : fallbackImage,
          rating: 4.8, // Fallback for now
          students: 0, // Fallback for now
          icon: GraduationCap,
          lessons: 0,
          instructor,
        };
      });

      setCourses(transformedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'moms', label: 'For Moms' },
    { id: 'dads', label: 'For Dads' },
    { id: 'essential', label: 'Essential' },
    { id: 'free', label: 'Free' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6">Our Courses</Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900">
              Expert-Led Postnatal Education
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive courses designed by medical professionals, tailored for African families.
              Learn at your own pace with lifetime access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-gray-100 sticky top-16 bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === category.id
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
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                className="py-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/courses/${course.id}`} className="block">
                    <Card hover padding="none" className="h-full flex flex-col md:flex-row overflow-hidden">
                      <div className="relative md:w-2/5 flex-shrink-0">
                        {typeof course.image === 'string' && course.image.trim() ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 md:h-full bg-gray-100" />
                        )}
                        {course.badge && (
                          <Badge
                            className="absolute top-4 left-4"
                            variant={course.badge === 'Free' ? 'success' : 'default'}
                          >
                            {course.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1">{course.shortDescription}</p>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {course.lessons} lessons
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          {course.instructor.avatar ? (
                            <img
                              src={course.instructor.avatar}
                              alt={course.instructor.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                          )}
                          <span className="text-sm text-gray-600">{course.instructor.name}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            {course.price === 0 ? (
                              <span className="text-2xl font-black text-green-600">Free</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-primary-600">
                                  ₦{course.price.toLocaleString()}
                                </span>
                                {course.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ₦{course.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            View Course
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              What's Included in Every Course
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Video Lessons', desc: 'HD quality with transcripts' },
              { icon: FileText, title: 'Resources', desc: 'Downloadable guides & checklists' },
              { icon: Users, title: 'Community', desc: 'Private support groups' },
              { icon: CheckCircle, title: 'Certificate', desc: 'Shareable completion badge' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">Not Sure Where to Start?</h2>
          <p className="text-primary-100 mb-8">
            Take our free mini-course to get a taste of what Omugwo Academy offers,
            or book a consultation to discuss your specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses/free-mini-course">
              <Button variant="secondary">Start Free Course</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
