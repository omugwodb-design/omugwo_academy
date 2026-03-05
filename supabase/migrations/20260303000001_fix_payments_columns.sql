-- Fix payments provider column if it doesn't exist
DO $$ 
BEGIN
    -- Check if the provider column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'provider'
    ) THEN
        -- Add the provider column
        ALTER TABLE public.payments 
        ADD COLUMN provider TEXT NOT NULL DEFAULT 'paystack' 
        CHECK (provider IN ('stripe', 'paystack', 'flutterwave'));
        
        RAISE NOTICE 'Added provider column to payments table';
    ELSE
        RAISE NOTICE 'Provider column already exists in payments table';
    END IF;
END $$;

-- Also check and add any missing columns that might be referenced
DO $$
BEGIN
    -- Check provider_reference column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'provider_reference'
    ) THEN
        ALTER TABLE public.payments 
        ADD COLUMN provider_reference TEXT;
        RAISE NOTICE 'Added provider_reference column to payments table';
    END IF;
    
    -- Check provider_response column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'provider_response'
    ) THEN
        ALTER TABLE public.payments 
        ADD COLUMN provider_response JSONB;
        RAISE NOTICE 'Added provider_response column to payments table';
    END IF;
    
    -- Check completed_at column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE public.payments 
        ADD COLUMN completed_at TIMESTAMPTZ;
        RAISE NOTICE 'Added completed_at column to payments table';
    END IF;
END $$;
