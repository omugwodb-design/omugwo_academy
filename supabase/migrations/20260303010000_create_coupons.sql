-- Coupons & Usage Audit

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_uses_total INTEGER,
  uses_total INTEGER NOT NULL DEFAULT 0,
  course_ids TEXT[],
  created_by TEXT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  course_ids TEXT[],
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON public.coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON public.coupon_usages(user_id);

-- RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Read coupons (needed for checkout validation)
DROP POLICY IF EXISTS "Authenticated can read active coupons" ON public.coupons;
CREATE POLICY "Authenticated can read active coupons" ON public.coupons
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Admin manage coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL
  USING (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
  );

-- Users can view own coupon usage
DROP POLICY IF EXISTS "Users can view own coupon usage" ON public.coupon_usages;
CREATE POLICY "Users can view own coupon usage" ON public.coupon_usages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all coupon usage
DROP POLICY IF EXISTS "Admins can view all coupon usage" ON public.coupon_usages;
CREATE POLICY "Admins can view all coupon usage" ON public.coupon_usages
  FOR SELECT
  USING ((auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

-- System can insert usage rows from client after payment
DROP POLICY IF EXISTS "Authenticated can create coupon usage" ON public.coupon_usages;
CREATE POLICY "Authenticated can create coupon usage" ON public.coupon_usages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update updated_at trigger
DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
