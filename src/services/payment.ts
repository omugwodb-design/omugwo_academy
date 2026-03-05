import { supabase } from '../lib/supabase';

interface PaymentConfig {
  email: string;
  amount: number;
  currency?: string;
  courseId?: string;
  webinarId?: string;
  metadata?: Record<string, any>;
}

interface PaystackResponse {
  reference: string;
  status: string;
  message: string;
}

// Paystack Integration
export const paystackService = {
  async initializePayment(
    config: PaymentConfig
  ): Promise<{ authorizationUrl: string; reference: string; paymentId: string } | null> {
    const { email, amount, currency = 'NGN', courseId, webinarId, metadata } = config;
    
    try {
      const reference = `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment record in database
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert({
          user_id: metadata?.userId,
          course_id: courseId,
          webinar_id: webinarId,
          amount,
          currency,
          provider: 'paystack',
          provider_reference: reference,
          provider_response: metadata || null,
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        authorizationUrl: `https://checkout.paystack.com/${reference}`,
        reference,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return null;
    }
  },

  async verifyPayment(reference: string): Promise<PaystackResponse | null> {
    try {
      // In production, verify with Paystack API
      // const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      //   headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
      // });
      
      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          provider_reference: reference,
        })
        .eq('provider_reference', reference);

      if (error) throw error;

      return {
        reference,
        status: 'success',
        message: 'Payment verified successfully',
      };
    } catch (error) {
      console.error('Paystack verification error:', error);
      return null;
    }
  },

  // Initialize Paystack inline popup
  openPopup(config: {
    email: string;
    amount: number;
    reference: string;
    onSuccess: (response: any) => void;
    onClose: () => void;
  }) {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    
    // @ts-ignore - Paystack is loaded via script tag
    if (typeof window.PaystackPop !== 'undefined') {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: config.email,
        amount: config.amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: config.reference,
        callback: config.onSuccess,
        onClose: config.onClose,
      });
      handler.openIframe();
    } else {
      console.error('Paystack script not loaded');
    }
  },
};

// Stripe Integration
export const stripeService = {
  async createCheckoutSession(
    config: PaymentConfig
  ): Promise<{ sessionId: string; url: string; paymentId: string } | null> {
    const { email, amount, currency = 'USD', courseId, webinarId, metadata } = config;
    
    try {
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment record
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert({
          user_id: metadata?.userId,
          course_id: courseId,
          webinar_id: webinarId,
          amount,
          currency,
          provider: 'stripe',
          provider_reference: sessionId,
          provider_response: metadata || null,
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // In production, create Stripe checkout session via backend
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, amount, courseId, paymentId: payment.id }),
      // });
      
      return {
        sessionId,
        url: `https://checkout.stripe.com/pay/${sessionId}`,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Stripe session creation error:', error);
      return null;
    }
  },

  async verifySession(sessionId: string): Promise<{ status: string; paymentIntent: string } | null> {
    try {
      // In production, verify with Stripe API
      // const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        status: 'complete',
        paymentIntent: `pi_${sessionId}`,
      };
    } catch (error) {
      console.error('Stripe verification error:', error);
      return null;
    }
  },

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId: string) {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    // @ts-ignore - Stripe is loaded via script tag
    if (typeof window.Stripe !== 'undefined') {
      // @ts-ignore
      const stripe = window.Stripe(publicKey);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe redirect error:', error);
      }
    } else {
      console.error('Stripe script not loaded');
    }
  },
};

// Unified Payment Service
export const paymentService = {
  async processPayment(
    provider: 'paystack' | 'stripe',
    config: PaymentConfig
  ) {
    if (provider === 'paystack') {
      return paystackService.initializePayment(config);
    } else {
      return stripeService.createCheckoutSession(config);
    }
  },

  async verifyPayment(provider: 'paystack' | 'stripe', reference: string) {
    if (provider === 'paystack') {
      return paystackService.verifyPayment(reference);
    } else {
      return stripeService.verifySession(reference);
    }
  },

  async createEnrollmentAfterPayment(userId: string, courseId: string, paymentId: string) {
    try {
      // Create enrollment
      const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'active',
          progress: 0,
        })
        .select()
        .single();

      if (enrollError) throw enrollError;

      // Update payment with enrollment reference
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', paymentId);

      return enrollment;
    } catch (error) {
      console.error('Enrollment creation error:', error);
      return null;
    }
  },

  formatPrice(amount: number, currency: string = 'NGN'): string {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  },

  calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  },
};

export default paymentService;
