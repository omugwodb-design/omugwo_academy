-- Migration to add missing quiz fields and tables
-- Ensure update_updated_at() trigger function exists (some environments only have handle_updated_at)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Add points column to quiz_questions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quiz_questions' 
                   AND column_name = 'points') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN points INTEGER DEFAULT 1;
    END IF;
END $$;

-- Expand question_type constraint to match app (multiple_choice, true_false, short_answer, survey, poll, rating)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'quiz_questions'
          AND tc.constraint_type = 'CHECK'
    ) THEN
        BEGIN
            ALTER TABLE public.quiz_questions DROP CONSTRAINT IF EXISTS quiz_questions_question_type_check;
        EXCEPTION WHEN OTHERS THEN
            -- ignore
        END;
    END IF;
END $$;

ALTER TABLE public.quiz_questions
    ADD CONSTRAINT quiz_questions_question_type_check
    CHECK (question_type IN ('multiple_choice', 'true_false', 'text', 'short_answer', 'survey', 'poll', 'rating'));

-- Ensure quiz_responses has basic policies for authenticated users
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;
CREATE POLICY "Users can view their own quiz responses"
    ON public.quiz_responses
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON public.quiz_responses;
CREATE POLICY "Users can insert their own quiz responses"
    ON public.quiz_responses
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Instructors and admins can view all quiz responses" ON public.quiz_responses;
CREATE POLICY "Instructors and admins can view all quiz responses"
    ON public.quiz_responses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role IN ('admin', 'instructor', 'super_admin')
        )
    );

-- Create quiz_attempts table
DO $$
DECLARE
  users_id_type text;
BEGIN
  SELECT atttypid::regtype::text
    INTO users_id_type
  FROM pg_attribute
  WHERE attrelid = 'public.users'::regclass
    AND attname = 'id'
    AND NOT attisdropped;

  IF users_id_type IS NULL THEN
    users_id_type := 'uuid';
  END IF;

  EXECUTE format($f$
    CREATE TABLE IF NOT EXISTS public.quiz_attempts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id %s NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
      score DECIMAL(5,2) NOT NULL DEFAULT 0,
      passed BOOLEAN NOT NULL DEFAULT false,
      time_taken_seconds INTEGER,
      answers JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  $f$, users_id_type);
END $$;

-- Enable RLS on quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
    ON public.quiz_attempts FOR SELECT 
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own quiz attempts" 
    ON public.quiz_attempts FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Instructors and admins can view all quiz attempts" 
    ON public.quiz_attempts FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role IN ('admin', 'instructor')
        )
    );

-- Add updated_at trigger for quiz_attempts
DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON public.quiz_attempts;
CREATE TRIGGER update_quiz_attempts_updated_at
    BEFORE UPDATE ON public.quiz_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
