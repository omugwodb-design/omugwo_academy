-- Survey/Poll/Rating Tables for Quiz Engine Extension
-- Run this migration in your Supabase SQL Editor

-- 1. Survey Responses Table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  response_text TEXT,
  response_data JSONB, -- For structured responses (multi-select, matrix, etc.)
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT survey_responses_unique UNIQUE(quiz_id, question_id, user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_survey_responses_quiz ON survey_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question ON survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id);

-- 2. Poll Votes Table
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL, -- Which option was selected
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT poll_votes_unique UNIQUE(quiz_id, question_id, user_id)
);

-- Index for fast aggregation
CREATE INDEX IF NOT EXISTS idx_poll_votes_question ON poll_votes(question_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);

-- 3. Course Ratings Table
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT course_ratings_unique UNIQUE(course_id, user_id)
);

-- Index for fast aggregation and sorting
CREATE INDEX IF NOT EXISTS idx_course_ratings_course ON course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_user ON course_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_rating ON course_ratings(rating);

-- 4. Add new question types to quiz_questions (if not already present)
-- This is a comment - check if your quiz_questions.question_type column allows these values
-- If using an enum, you'll need to alter it:
-- ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'survey';
-- ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'poll';
-- ALTER TYPE question_type_enum ADD VALUE IF NOT EXISTS 'rating';

-- 5. Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for survey_responses
CREATE POLICY "Users can view their own survey responses"
  ON survey_responses FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own survey responses"
  ON survey_responses FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own survey responses"
  ON survey_responses FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Admins can view all survey responses
CREATE POLICY "Admins can view all survey responses"
  ON survey_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 7. RLS Policies for poll_votes
CREATE POLICY "Users can view poll results"
  ON poll_votes FOR SELECT
  USING (true); -- Public read for poll results

CREATE POLICY "Users can insert their own poll votes"
  ON poll_votes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own poll votes"
  ON poll_votes FOR UPDATE
  USING (auth.uid()::text = user_id);

-- 8. RLS Policies for course_ratings
CREATE POLICY "Anyone can view course ratings"
  ON course_ratings FOR SELECT
  USING (true); -- Public read for ratings

CREATE POLICY "Users can insert their own ratings"
  ON course_ratings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own ratings"
  ON course_ratings FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON course_ratings FOR DELETE
  USING (auth.uid()::text = user_id);

-- 9. Create view for poll results aggregation
CREATE OR REPLACE VIEW poll_results AS
SELECT 
  question_id,
  option_index,
  COUNT(*) as vote_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY question_id), 2) as percentage
FROM poll_votes
GROUP BY question_id, option_index;

-- 10. Create view for course rating aggregation
CREATE OR REPLACE VIEW course_rating_stats AS
SELECT 
  course_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating), 2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM course_ratings
GROUP BY course_id;

-- Grant access to views
GRANT SELECT ON poll_results TO authenticated;
GRANT SELECT ON course_rating_stats TO authenticated;

COMMENT ON TABLE survey_responses IS 'Stores user responses to survey questions';
COMMENT ON TABLE poll_votes IS 'Stores user votes on poll questions with real-time aggregation';
COMMENT ON TABLE course_ratings IS 'Stores course ratings and reviews from users';
COMMENT ON VIEW poll_results IS 'Aggregated poll results with vote counts and percentages';
COMMENT ON VIEW course_rating_stats IS 'Aggregated course rating statistics';
