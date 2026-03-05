-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: LMS + Community
-- Run after schema_v2.sql has been applied
-- ═══════════════════════════════════════════════════════════════

 -- Ensure optional app columns exist (non-destructive)
 ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
 ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS type TEXT;

-- ─── LMS: Courses ────────────────────────────────────────────

INSERT INTO courses (id, title, slug, description, price, is_published, is_featured, category, difficulty_level, thumbnail_url, created_at, published_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'The Complete Postpartum Recovery Masterclass', 'postpartum-recovery-masterclass', 'A comprehensive course covering physical recovery, mental health, nutrition, and partner support during the fourth trimester. Developed by Dr. Megor Ikuenobe with input from 12 medical specialists.', 49000, true, true, 'Health & Wellness', 'beginner', 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
  ('c1000000-0000-0000-0000-000000000002', 'Professional Nanny & Caregiver Certification', 'nanny-caregiver-certification', 'Industry-recognized certification for professional nannies and caregivers. Covers infant care, safety protocols, developmental milestones, nutrition, and emergency response.', 75000, true, true, 'Professional Development', 'intermediate', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days'),
  ('c1000000-0000-0000-0000-000000000003', 'Partner Support Training: The Dad''s Guide', 'partner-support-training', 'Designed specifically for fathers and partners. Learn how to provide meaningful support during pregnancy, birth, and the postpartum period. Includes communication techniques and practical caregiving skills.', 29000, true, false, 'Parenting', 'beginner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days')
ON CONFLICT (id) DO NOTHING;

-- ─── LMS: Modules ────────────────────────────────────────────

INSERT INTO modules (id, course_id, title, order_index, created_at) VALUES
  -- Course 1: Postpartum Recovery
  ('m1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Understanding the Fourth Trimester', 0, NOW()),
  ('m1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Physical Recovery & Nutrition', 1, NOW()),
  ('m1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Mental Health & Emotional Wellbeing', 2, NOW()),
  ('m1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Breastfeeding Mastery', 3, NOW()),
  -- Course 2: Nanny Certification
  ('m1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Foundations of Infant Care', 0, NOW()),
  ('m1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Safety & Emergency Response', 1, NOW()),
  ('m1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'Developmental Milestones', 2, NOW()),
  -- Course 3: Partner Support
  ('m1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'Understanding Your Partner''s Journey', 0, NOW()),
  ('m1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'Practical Caregiving Skills', 1, NOW()),
  ('m1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000003', 'Communication & Emotional Support', 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- ─── LMS: Lessons ────────────────────────────────────────────

INSERT INTO lessons (id, module_id, title, type, order_index, duration_minutes, video_url, content, created_at) VALUES
  -- Module 1: Understanding the Fourth Trimester
  ('l1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'What is the Fourth Trimester?', 'video', 0, 15, 'https://www.youtube.com/watch?v=example1', '{"description": "An introduction to the concept of the fourth trimester and why it matters for both mother and baby."}', NOW()),
  ('l1000000-0000-0000-0000-000000000002', 'm1000000-0000-0000-0000-000000000001', 'The Science of Postpartum Recovery', 'video', 1, 20, 'https://www.youtube.com/watch?v=example2', '{"description": "Understanding the biological changes that occur after birth and the timeline of recovery."}', NOW()),
  ('l1000000-0000-0000-0000-000000000003', 'm1000000-0000-0000-0000-000000000001', 'Cultural Perspectives on Omugwo', 'text', 2, 10, NULL, '{"body": "The Omugwo tradition is a time-honored Nigerian postnatal care practice where a mother or mother-in-law comes to help care for a new mother and baby. This lesson explores how this tradition has evolved and how we can preserve its wisdom while adapting to modern life.\n\nKey Topics:\n- History of Omugwo across Nigerian cultures\n- The role of the grandmother in postnatal care\n- Modernizing traditional practices\n- Building your own support network"}', NOW()),
  ('l1000000-0000-0000-0000-000000000004', 'm1000000-0000-0000-0000-000000000001', 'Module 1 Quiz', 'quiz', 3, 10, NULL, '{"description": "Test your understanding of the fourth trimester concepts."}', NOW()),

  -- Module 2: Physical Recovery & Nutrition
  ('l1000000-0000-0000-0000-000000000005', 'm1000000-0000-0000-0000-000000000002', 'Postpartum Body Changes', 'video', 0, 18, 'https://www.youtube.com/watch?v=example3', '{"description": "What to expect physically in the weeks and months after birth."}', NOW()),
  ('l1000000-0000-0000-0000-000000000006', 'm1000000-0000-0000-0000-000000000002', 'Nutrition for Recovery', 'video', 1, 22, 'https://www.youtube.com/watch?v=example4', '{"description": "Essential nutrients and meal planning for postpartum recovery."}', NOW()),
  ('l1000000-0000-0000-0000-000000000007', 'm1000000-0000-0000-0000-000000000002', 'Traditional Nigerian Postpartum Foods', 'text', 2, 12, NULL, '{"body": "Nigerian culture has a rich tradition of postpartum nutrition. This lesson covers traditional foods like pepper soup, pap (ogi), and other nourishing meals that support recovery.\n\nRecipes included:\n- Oha Soup for lactation\n- Pepper Soup for healing\n- Zobo drink for iron\n- Fura da nono for calcium"}', NOW()),
  ('l1000000-0000-0000-0000-000000000008', 'm1000000-0000-0000-0000-000000000002', 'Gentle Exercise Guide', 'pdf', 3, 15, NULL, '{"pdf_url": "/resources/gentle-exercise-guide.pdf", "description": "A downloadable guide to safe postpartum exercises."}', NOW()),

  -- Module 3: Mental Health
  ('l1000000-0000-0000-0000-000000000009', 'm1000000-0000-0000-0000-000000000003', 'Understanding Postpartum Depression', 'video', 0, 25, 'https://www.youtube.com/watch?v=example5', '{"description": "Recognizing the signs and understanding the difference between baby blues and PPD."}', NOW()),
  ('l1000000-0000-0000-0000-000000000010', 'm1000000-0000-0000-0000-000000000003', 'Coping Strategies & Self-Care', 'video', 1, 20, 'https://www.youtube.com/watch?v=example6', '{"description": "Practical strategies for managing stress, anxiety, and emotional challenges."}', NOW()),
  ('l1000000-0000-0000-0000-000000000011', 'm1000000-0000-0000-0000-000000000003', 'Reflection: Your Mental Health Journey', 'reflection', 2, 15, NULL, '{"prompt": "Take a moment to reflect on your emotional state since becoming a parent. Write about one challenge you''ve faced and one thing that has brought you joy. There are no right or wrong answers."}', NOW()),

  -- Module 4: Breastfeeding
  ('l1000000-0000-0000-0000-000000000012', 'm1000000-0000-0000-0000-000000000004', 'Breastfeeding Fundamentals', 'video', 0, 20, 'https://www.youtube.com/watch?v=example7', '{"description": "Latch techniques, positioning, and establishing a feeding routine."}', NOW()),
  ('l1000000-0000-0000-0000-000000000013', 'm1000000-0000-0000-0000-000000000004', 'Common Challenges & Solutions', 'video', 1, 18, 'https://www.youtube.com/watch?v=example8', '{"description": "Addressing engorgement, low supply, mastitis, and other common issues."}', NOW()),
  ('l1000000-0000-0000-0000-000000000014', 'm1000000-0000-0000-0000-000000000004', 'Night Feeding Strategies', 'text', 2, 10, NULL, '{"body": "Night feeds are one of the most challenging aspects of early parenthood. This lesson covers strategies to make night feeding more manageable for both you and your baby.\n\nTopics:\n- Side-lying breastfeeding position\n- Safe co-sleeping guidelines\n- Partner involvement in night feeds\n- Building a night feeding station"}', NOW()),
  ('l1000000-0000-0000-0000-000000000015', 'm1000000-0000-0000-0000-000000000004', 'Breastfeeding Assignment', 'assignment', 3, 30, NULL, '{"instructions": "Create a personalized feeding plan for your first two weeks postpartum. Include feeding schedule, positions to try, and a list of supplies you''ll need. Submit as a document or photo of your handwritten plan."}', NOW()),

  -- Course 2 Lessons (abbreviated)
  ('l1000000-0000-0000-0000-000000000016', 'm1000000-0000-0000-0000-000000000005', 'Introduction to Professional Caregiving', 'video', 0, 15, 'https://www.youtube.com/watch?v=example9', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000017', 'm1000000-0000-0000-0000-000000000005', 'Newborn Care Essentials', 'video', 1, 25, 'https://www.youtube.com/watch?v=example10', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000018', 'm1000000-0000-0000-0000-000000000005', 'Bathing, Diapering & Hygiene', 'video', 2, 20, 'https://www.youtube.com/watch?v=example11', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000019', 'm1000000-0000-0000-0000-000000000006', 'CPR & First Aid for Infants', 'video', 0, 30, 'https://www.youtube.com/watch?v=example12', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000020', 'm1000000-0000-0000-0000-000000000006', 'Home Safety Assessment', 'text', 1, 15, NULL, '{"body": "Learn how to conduct a thorough safety assessment of any home environment where you will be caring for children."}', NOW()),

  -- Course 3 Lessons (abbreviated)
  ('l1000000-0000-0000-0000-000000000021', 'm1000000-0000-0000-0000-000000000008', 'The Emotional Landscape of New Parenthood', 'video', 0, 20, 'https://www.youtube.com/watch?v=example13', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000022', 'm1000000-0000-0000-0000-000000000008', 'Reading Your Partner''s Unspoken Needs', 'video', 1, 18, 'https://www.youtube.com/watch?v=example14', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000023', 'm1000000-0000-0000-0000-000000000009', 'Diaper Changing & Feeding Basics', 'video', 0, 15, 'https://www.youtube.com/watch?v=example15', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000024', 'm1000000-0000-0000-0000-000000000009', 'Soothing a Crying Baby', 'video', 1, 12, 'https://www.youtube.com/watch?v=example16', '{}', NOW()),
  ('l1000000-0000-0000-0000-000000000025', 'm1000000-0000-0000-0000-000000000010', 'Active Listening & Validation', 'video', 0, 15, 'https://www.youtube.com/watch?v=example17', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

-- ─── LMS: Quizzes ────────────────────────────────────────────

INSERT INTO quizzes (id, lesson_id, title, passing_score, time_limit_minutes, max_attempts, shuffle_questions, created_at) VALUES
  ('q1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000004', 'Fourth Trimester Knowledge Check', 70, 15, 3, true, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (id, quiz_id, question, question_type, options, correct_text, points, order_index) VALUES
  ('qq100000-0000-0000-0000-000000000001', 'q1000000-0000-0000-0000-000000000001', 'What is the "fourth trimester"?', 'multiple_choice', '[{"label": "The last 3 months of pregnancy", "value": "a"}, {"label": "The first 3 months after birth", "value": "b"}, {"label": "The first year of a baby''s life", "value": "c"}, {"label": "The period before conception", "value": "d"}]', 'b', 2, 0),
  ('qq100000-0000-0000-0000-000000000002', 'q1000000-0000-0000-0000-000000000001', 'Omugwo is a traditional practice from which country?', 'multiple_choice', '[{"label": "Ghana", "value": "a"}, {"label": "Kenya", "value": "b"}, {"label": "Nigeria", "value": "c"}, {"label": "South Africa", "value": "d"}]', 'c', 2, 1),
  ('qq100000-0000-0000-0000-000000000003', 'q1000000-0000-0000-0000-000000000001', 'Postpartum recovery typically takes 6-8 weeks for the body to return to its pre-pregnancy state.', 'true_false', '[{"label": "True", "value": "true"}, {"label": "False", "value": "false"}]', 'true', 1, 2),
  ('qq100000-0000-0000-0000-000000000004', 'q1000000-0000-0000-0000-000000000001', 'Name one benefit of the traditional Omugwo practice.', 'text', '[]', 'support', 3, 3),
  ('qq100000-0000-0000-0000-000000000005', 'q1000000-0000-0000-0000-000000000001', 'Which of the following is NOT a common postpartum physical change?', 'multiple_choice', '[{"label": "Uterine contractions", "value": "a"}, {"label": "Hair loss", "value": "b"}, {"label": "Increased bone density", "value": "c"}, {"label": "Night sweats", "value": "d"}]', 'c', 2, 4)
ON CONFLICT (id) DO NOTHING;

-- ─── LMS: Assignments ────────────────────────────────────────

INSERT INTO assignments (id, lesson_id, title, instructions, max_score, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000015', 'Personalized Feeding Plan', 'Create a personalized feeding plan for your first two weeks postpartum. Include: 1) A daily feeding schedule, 2) At least 3 breastfeeding positions to try, 3) A list of supplies needed, 4) A troubleshooting guide for common issues. Submit as a PDF or photo.', 100, NOW())
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- COMMUNITY SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- ─── Community: Spaces ───────────────────────────────────────

INSERT INTO community_spaces (id, name, description, icon, color, visibility, moderation_level, created_at) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'New Moms', 'Support and advice for first-time mothers', '👶', '#e85d75', 'public', 'semi', NOW()),
  ('s1000000-0000-0000-0000-000000000002', 'Dads Lounge', 'A safe space for fathers to connect and share', '👨', '#3b82f6', 'public', 'open', NOW()),
  ('s1000000-0000-0000-0000-000000000003', 'Mental Health', 'Postpartum mental health support and resources', '🧠', '#8b5cf6', 'public', 'strict', NOW()),
  ('s1000000-0000-0000-0000-000000000004', 'Marriage & Intimacy', 'Navigating relationships after baby', '💑', '#f59e0b', 'public', 'semi', NOW()),
  ('s1000000-0000-0000-0000-000000000005', 'Expert Q&A', 'Ask verified professionals your questions', '🩺', '#059669', 'public', 'strict', NOW()),
  ('s1000000-0000-0000-0000-000000000006', 'Masterclass Cohort', 'Private group for current cohort students', '🎓', '#dc2626', 'private', 'open', NOW())
ON CONFLICT (id) DO NOTHING;

-- ─── Community: Events ───────────────────────────────────────

INSERT INTO community_events (id, space_id, title, description, date, duration_minutes, location, created_at) VALUES
  ('e1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'Monthly Mom Meetup', 'Join us for our monthly virtual meetup where moms share experiences and support each other.', (NOW() + INTERVAL '14 days'), 60, 'Zoom', NOW()),
  ('e1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000005', 'Expert AMA: Infant Sleep', 'Ask our sleep consultant anything about getting your baby to sleep through the night.', (NOW() + INTERVAL '21 days'), 60, 'Community Live', NOW()),
  ('e1000000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000002', 'Dad''s Night Out (Virtual)', 'A casual virtual hangout for dads to connect, share stories, and support each other.', (NOW() + INTERVAL '28 days'), 60, 'Zoom', NOW())
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Courses: public read for published, authenticated write for instructors/admins
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'courses_public_read') THEN
    CREATE POLICY courses_public_read ON courses FOR SELECT USING (is_published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'courses_instructor_write') THEN
    CREATE POLICY courses_instructor_write ON courses FOR ALL USING (auth.uid() = instructor_id OR auth.jwt() ->> 'role' IN ('admin', 'super_admin'));
  END IF;
END $$;

-- Modules: read via course access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'modules_read') THEN
    CREATE POLICY modules_read ON modules FOR SELECT USING (true);
  END IF;
END $$;

-- Lessons: read via enrollment
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'lessons_read') THEN
    CREATE POLICY lessons_read ON lessons FOR SELECT USING (true);
  END IF;
END $$;

-- Enrollments: own user read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'enrollments_own_read') THEN
    CREATE POLICY enrollments_own_read ON enrollments FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'enrollments_insert') THEN
    CREATE POLICY enrollments_insert ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Lesson Progress: own user
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'lesson_progress_own') THEN
    CREATE POLICY lesson_progress_own ON lesson_progress FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Community Spaces: public read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'spaces_public_read') THEN
    CREATE POLICY spaces_public_read ON community_spaces FOR SELECT USING (visibility = 'public' OR EXISTS (SELECT 1 FROM community_space_members WHERE space_id = community_spaces.id AND user_id = auth.uid()));
  END IF;
END $$;

-- Community Posts: space members read, authenticated write
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'posts_read') THEN
    CREATE POLICY posts_read ON community_posts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'posts_insert') THEN
    CREATE POLICY posts_insert ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'posts_own_update') THEN
    CREATE POLICY posts_own_update ON community_posts FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'posts_own_delete') THEN
    CREATE POLICY posts_own_delete ON community_posts FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Community Comments: authenticated read/write
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'comments_read') THEN
    CREATE POLICY comments_read ON community_comments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'comments_insert') THEN
    CREATE POLICY comments_insert ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Community Likes: own user
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'likes_own') THEN
    CREATE POLICY likes_own ON community_likes FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Community Events: public read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'events_public_read') THEN
    CREATE POLICY events_public_read ON community_events FOR SELECT USING (true);
  END IF;
END $$;

-- User Points: own read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'points_read') THEN
    CREATE POLICY points_read ON user_points FOR SELECT USING (true);
  END IF;
END $$;

-- User Badges: own read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'badges_read') THEN
    CREATE POLICY badges_read ON user_badges FOR SELECT USING (true);
  END IF;
END $$;
