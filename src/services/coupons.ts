import { supabase } from '../lib/supabase';

export type CouponDiscountType = 'percent' | 'fixed';

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  coupon?: any;
}

export const couponsService = {
  async validateCoupon(params: {
    code: string;
    userId?: string;
    courseIds: string[];
  }): Promise<CouponValidationResult> {
    const code = params.code.trim().toUpperCase();
    if (!code) return { valid: false, reason: 'Missing coupon code' };

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error) return { valid: false, reason: error.message };
    if (!coupon) return { valid: false, reason: 'Invalid coupon' };

    if (!coupon.is_active) return { valid: false, reason: 'Coupon is inactive' };

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) return { valid: false, reason: 'Coupon not active yet' };
    if (coupon.expires_at && new Date(coupon.expires_at) < now) return { valid: false, reason: 'Coupon expired' };

    if (coupon.max_uses_total != null && coupon.uses_total >= coupon.max_uses_total) {
      return { valid: false, reason: 'Coupon usage limit reached' };
    }

    if (coupon.course_ids && Array.isArray(coupon.course_ids) && coupon.course_ids.length > 0) {
      const intersection = params.courseIds.filter((id) => coupon.course_ids.includes(id));
      if (intersection.length === 0) return { valid: false, reason: 'Coupon not applicable to selected courses' };
    }

    return { valid: true, coupon };
  },
};
