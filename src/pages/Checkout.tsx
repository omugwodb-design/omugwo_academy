import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Lock, CheckCircle, ArrowLeft, Shield,
  Clock, Users, Award, Heart, Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { paymentService } from '../services/payment';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import { supabase } from '../lib/supabase';
import { couponsService } from '../services/coupons';

const testimonials = [
  { name: "Adaeze O.", text: "Best investment I made for my postpartum journey!" },
  { name: "Ngozi E.", text: "The content is incredibly valuable and practical." },
];

export const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, addCourse } = useCartStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'stripe'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    couponCode: '',
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  useEffect(() => {
    if (courseId) {
      addCourse(courseId);
    }
  }, [courseId, addCourse]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const ids = items.map((i) => i.courseId).filter(Boolean);
        if (ids.length === 0) {
          setCourses([]);
          return;
        }

        const { data, error } = await supabase
          .from('courses')
          .select('id, title, price, thumbnail_url, slug')
          .in('id', ids);

        if (error) throw error;

        const byId = new Map((data || []).map((c: any) => [c.id, c]));
        setCourses(ids.map((id) => byId.get(id)).filter(Boolean));
      } catch (e: any) {
        console.error(e);
        toast.error('Failed to load courses for checkout');
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, [items]);

  const subtotal = useMemo(() => {
    return courses.reduce((sum, c) => sum + Number(c.price || 0), 0);
  }, [courses]);

  const finalPrice = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    try {
      if (!formData.couponCode) return;
      const ids = courses.map((c) => c.id);
      const res = await couponsService.validateCoupon({
        code: formData.couponCode,
        userId: user?.id,
        courseIds: ids,
      });

      if (!res.valid || !res.coupon) {
        toast.error(res.reason || 'Invalid coupon');
        return;
      }

      const coupon = res.coupon;

      let computed = 0;
      if (coupon.discount_type === 'percent') {
        computed = subtotal * (Number(coupon.discount_value || 0) / 100);
      } else {
        computed = Number(coupon.discount_value || 0);
      }

      setDiscount(Math.min(subtotal, computed));
      setCouponApplied(true);
      setAppliedCoupon(coupon);
      toast.success('Coupon applied');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to apply coupon');
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      navigate(`/login?next=/checkout`);
      return;
    }

    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setIsProcessing(true);
    try {
      if (courses.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      const result = await paymentService.processPayment(paymentMethod, {
        email: formData.email,
        amount: finalPrice,
        currency: 'NGN',
        metadata: {
          userId: user.id,
          courseIds: courses.map((c) => c.id),
          couponCode: appliedCoupon?.code || null,
          discount: discount || 0,
        },
      });

      if (!result) throw new Error('Failed to initialize payment');

      if (paymentMethod === 'paystack') {
        if (!('reference' in result)) {
          throw new Error('Invalid Paystack payment response');
        }

        // @ts-ignore - Paystack loaded via script tag
        if (typeof window.PaystackPop === 'undefined') {
          throw new Error('Paystack script not loaded');
        }

        // @ts-ignore
        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
          email: formData.email,
          amount: finalPrice * 100,
          currency: 'NGN',
          ref: result.reference,
          callback: (response: any) => {
            navigate(
              `/checkout/success?courseId=${encodeURIComponent(courses[0].id)}&ref=${encodeURIComponent(
                response.reference
              )}&paymentId=${encodeURIComponent(result.paymentId)}`
            );
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });
        handler.openIframe();
        return;
      }

      if (!('sessionId' in result)) {
        throw new Error('Invalid Stripe payment response');
      }

      // Stripe redirect (mock)
      navigate(
        `/checkout/success?courseId=${encodeURIComponent(courses[0].id)}&ref=${encodeURIComponent(
          result.sessionId
        )}&paymentId=${encodeURIComponent(result.paymentId)}`
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <Link to={courseId ? `/courses/${courseId}` : '/cart'} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Your Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('paystack')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'paystack'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🇳🇬</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Paystack</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cards, Bank Transfer, USSD</p>
                    </div>
                    {paymentMethod === 'paystack' && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'stripe'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Stripe</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">International Cards</p>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Have a Coupon?</h2>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter coupon code"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    disabled={couponApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={couponApplied || !formData.couponCode}
                  >
                    {couponApplied ? 'Applied!' : 'Apply'}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    ✓ Coupon applied! You saved ₦{discount.toLocaleString()}
                  </p>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24"
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>

                <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                  {isLoadingCourses ? (
                    <div className="text-sm text-gray-500">Loading…</div>
                  ) : courses.length === 0 ? (
                    <div className="text-sm text-gray-500">No courses in cart.</div>
                  ) : (
                    <div className="space-y-3">
                      {courses.map((c) => (
                        <div key={c.id} className="flex items-center gap-3">
                          <img
                            src={c.thumbnail_url || 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=200'}
                            alt={c.title}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{c.title}</p>
                            <p className="text-xs text-primary-600 font-bold">{paymentService.formatPrice(Number(c.price || 0), 'NGN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="py-4 space-y-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-100">{paymentService.formatPrice(subtotal, 'NGN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Coupon Discount</span>
                      <span className="text-green-600">-{paymentService.formatPrice(discount, 'NGN')}</span>
                    </div>
                  )}
                </div>

                <div className="py-4 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-primary-600">{paymentService.formatPrice(finalPrice, 'NGN')}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  disabled={!formData.email || !formData.fullName}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Purchase
                </Button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lifetime access
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Mobile-friendly learning
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Certificate of completion
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">30-Day Money-Back Guarantee</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </Card>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
                <Lock className="w-6 h-6" />
                <Shield className="w-6 h-6" />
                <CreditCard className="w-6 h-6" />
              </div>

              {/* Testimonials */}
              <div className="mt-6 space-y-3">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 text-sm">
                    <p className="text-gray-600 italic">"{t.text}"</p>
                    <p className="text-gray-900 font-semibold mt-1">— {t.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

