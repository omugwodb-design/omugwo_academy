-- Ensure coupons table has all important columns used by the app/admin UI

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

DO $$
BEGIN
  -- Core coupon metadata
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS name TEXT;
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS description TEXT;

  -- Activation / schedule
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

  -- Usage limits
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_uses_total INTEGER;
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS uses_total INTEGER NOT NULL DEFAULT 0;

  -- Targeting
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS course_ids TEXT[];

  -- Audit
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
  ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION
  WHEN undefined_table THEN
    -- If coupons table doesn't exist yet, the create_coupons migration should be applied first.
    RAISE;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);

-- Ensure updated_at trigger exists (uses update_updated_at function already used elsewhere)
DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

NOTIFY pgrst, 'reload schema';
