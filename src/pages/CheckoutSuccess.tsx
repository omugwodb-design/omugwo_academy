import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowRight, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { paymentService } from '../services/payment';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';

export const CheckoutSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const providerRef = searchParams.get('ref');
    const paymentId = searchParams.get('paymentId');
    const { user } = useAuthStore();
    const [isFinalizing, setIsFinalizing] = useState(true);
    const clearCart = useCartStore((s) => s.clear);
    const [primaryCourseId, setPrimaryCourseId] = useState<string | null>(courseId);

    useEffect(() => {
        const finalize = async () => {
            if (!courseId || !paymentId) {
                setIsFinalizing(false);
                return;
            }
            if (!user) {
                setIsFinalizing(false);
                return;
            }

            try {
                const { data: paymentRow, error: paymentErr } = await supabase
                    .from('payments')
                    .select('id, provider_response')
                    .eq('id', paymentId)
                    .maybeSingle();

                if (paymentErr) {
                    console.warn('Could not load payment metadata:', paymentErr.message);
                }

                const metaCourseIds = (paymentRow as any)?.provider_response?.courseIds;
                const couponCode = (paymentRow as any)?.provider_response?.couponCode;
                const discount = Number((paymentRow as any)?.provider_response?.discount || 0);

                const courseIds: string[] = Array.isArray(metaCourseIds) && metaCourseIds.length > 0
                    ? metaCourseIds
                    : [courseId];

                setPrimaryCourseId(courseIds[0] || courseId);

                for (const cid of courseIds) {
                    const enrollment = await paymentService.createEnrollmentAfterPayment(user.id, cid, paymentId);
                    if (!enrollment) {
                        toast.error('Could not finalize enrollment');
                        break;
                    }
                }

                if (couponCode && discount > 0) {
                    const normalized = String(couponCode).trim().toUpperCase();
                    const { data: couponRow, error: couponErr } = await supabase
                        .from('coupons')
                        .select('id, uses_total')
                        .eq('code', normalized)
                        .maybeSingle();

                    if (couponErr) {
                        console.warn('Could not load coupon row:', couponErr.message);
                    }

                    if (couponRow?.id) {
                        await supabase.from('coupon_usages').insert({
                            coupon_id: couponRow.id,
                            user_id: user.id,
                            payment_id: paymentId,
                            discount_amount: discount,
                            course_ids: courseIds,
                        });

                        await supabase
                            .from('coupons')
                            .update({ uses_total: Number(couponRow.uses_total || 0) + 1 })
                            .eq('id', couponRow.id);
                    }
                }

                clearCart();
            } catch (e) {
                console.error(e);
                toast.error('Could not finalize enrollment');
            } finally {
                setIsFinalizing(false);
            }
        };

        finalize();
    }, [courseId, paymentId, user, clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden"
            >
                <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">Payment Successful!</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Congratulations! You've successfully enrolled in the course.
                        Welcome to the Omugwo Academy family.
                    </p>

                    {isFinalizing && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Finalizing your enrollment...</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <Link to={courseId ? `/learn/${courseId}` : '/dashboard'} className="w-full">
                            <Button size="lg" className="w-full" leftIcon={<Play className="w-5 h-5" />}>
                                Start Learning Now
                            </Button>
                        </Link>
                        <Link to="/my-courses" className="w-full">
                            <Button size="lg" variant="outline" className="w-full" leftIcon={<Download className="w-5 h-5" />}>
                                View My Courses
                            </Button>
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">What's next?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-primary-600 font-bold">1</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Access your materials</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-primary-600 font-bold">2</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Join the community</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-primary-600 font-bold">3</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Set your goals</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary-600 p-8 text-center text-white">
                    <p className="font-bold mb-2">Need any help with your enrolment?</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 hover:underline">
                        Contact Support <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
