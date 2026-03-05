import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { supabase } from '../lib/supabase';
import { paymentService } from '../services/payment';
import { toast } from 'react-hot-toast';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeCourse, clear } = useCartStore();

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const courseIds = items.map((i) => i.courseId).filter(Boolean);
        if (courseIds.length === 0) {
          setCourses([]);
          return;
        }

        const { data, error } = await supabase
          .from('courses')
          .select('id, title, price, thumbnail_url, slug')
          .in('id', courseIds);

        if (error) throw error;

        const byId = new Map((data || []).map((c: any) => [c.id, c]));
        setCourses(courseIds.map((id) => byId.get(id)).filter(Boolean));
      } catch (e: any) {
        console.error(e);
        toast.error('Failed to load cart');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [items]);

  const subtotal = useMemo(() => {
    return courses.reduce((sum, c) => sum + Number(c.price || 0), 0);
  }, [courses]);

  const formattedSubtotal = paymentService.formatPrice(subtotal, 'NGN');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your Cart</h1>
            <p className="text-gray-600 dark:text-gray-400">Review your selected courses and proceed to checkout.</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clear}>
              Clear cart
            </Button>
          )}
        </div>

        {isLoading ? (
          <Card className="p-6">Loading…</Card>
        ) : courses.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty.</p>
            <Link to="/courses">
              <Button>Browse courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-4 flex gap-4 items-center">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=200'}
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{course.title}</p>
                    <p className="text-sm font-semibold text-primary-600">{paymentService.formatPrice(Number(course.price || 0), 'NGN')}</p>
                    <Link to={course.slug ? `/courses/${course.slug}` : `/courses/${course.id}`} className="text-xs text-gray-500 hover:underline">
                      View course
                    </Link>
                  </div>
                  <button
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => removeCourse(course.id)}
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Summary</h2>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Items</span>
                  <span className="font-bold text-gray-900 dark:text-white">{courses.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-black text-gray-900 dark:text-white">{formattedSubtotal}</span>
                </div>

                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
