-- Omugwo Academy - Course Seeding Script
-- This script seeds the initial courses, modules, and lessons into the Supabase database.

-- 1. Identify or Create an Instructor
-- You can replace the email with your own email after signing up to be the instructor.
DO $$
DECLARE
    instructor_id UUID;
    course_moms_id UUID;
    course_dads_id UUID;
    course_essential_id UUID;
    module_id UUID;
BEGIN
    -- Get an existing admin or student to be the temporary instructor
    SELECT id INTO instructor_id FROM public.users LIMIT 1;
    
    IF instructor_id IS NULL THEN
        RAISE NOTICE 'No users found. Please sign up first before running the seed script if you want correct instructor assignment.';
    END IF;

    -- Clean up existing courses to avoid unique constraint violations if re-running
    DELETE FROM public.courses WHERE slug IN ('moms-course', 'dads-course', 'essential');

    -- 2. Seed Courses
    -- Moms Course
    INSERT INTO public.courses (
        title, slug, description, short_description, thumbnail_url, price, 
        original_price, is_published, is_featured, category, duration_hours, instructor_id
    ) VALUES (
        'The Omugwo Masterclass for Moms',
        'moms-course',
        'Complete postnatal guide covering body recovery, mental health, cultural balance, marriage & intimacy, and infant care.',
        'The ultimate postnatal blueprint for the modern African mother.',
        'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800',
        49000, 55000, true, true, 'moms', 12.0, instructor_id
    ) RETURNING id INTO course_moms_id;

    -- Dads Course
    INSERT INTO public.courses (
        title, slug, description, short_description, thumbnail_url, price, 
        original_price, is_published, is_featured, category, duration_hours, instructor_id
    ) VALUES (
        'Partner Support Training',
        'dads-course',
        'Essential knowledge for fathers and partners to provide meaningful support during the postnatal period.',
        'Become the anchor your family needs during the postpartum transition.',
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800',
        29000, 35000, true, false, 'dads', 6.0, instructor_id
    ) RETURNING id INTO course_dads_id;

    -- Essential Course
    INSERT INTO public.courses (
        title, slug, description, short_description, thumbnail_url, price, 
        original_price, is_published, is_featured, category, duration_hours, instructor_id
    ) VALUES (
        'Essential Postnatal Care',
        'essential',
        'Core fundamentals every parent needs to know for a healthy postpartum journey.',
        'A concise guide to the most critical aspects of newborn and mother care.',
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
        39000, 45000, true, false, 'essential', 8.0, instructor_id
    ) RETURNING id INTO course_essential_id;

    -- 3. Seed Modules and Lessons for Moms Course
    -- Module 1
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES (course_moms_id, 'Module 1: Body Recovery & Physical Health', 'Understanding your body after birth and how to heal effectively.', 1)
    RETURNING id INTO module_id;

    INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index)
    VALUES 
    (module_id, 'Understanding the Postpartum Body', 'A deep dive into the physiological changes after delivery.', 'https://vimeo.com/example/1', 15, 1),
    (module_id, 'Nutrition for Healing', 'What to eat to accelerate your recovery.', 'https://vimeo.com/example/2', 12, 2);

    -- Module 2
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES (course_moms_id, 'Module 2: Mental Wellbeing', 'Navigating the emotional roller coaster of new motherhood.', 2)
    RETURNING id INTO module_id;

    INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index)
    VALUES 
    (module_id, 'Baby Blues vs. Postpartum Depression', 'Identifying signs and knowing when to seek help.', 'https://vimeo.com/example/3', 20, 1),
    (module_id, 'Self-Care Strategies for New Moms', 'Practical ways to pour back into yourself.', 'https://vimeo.com/example/4', 10, 2);

    -- Module 3
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES (course_moms_id, 'Module 3: Cultural Balance', 'Blending traditional Omugwo wisdom with modern medicine.', 3)
    RETURNING id INTO module_id;

    INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index)
    VALUES 
    (module_id, 'The Philosophy of Omugwo', 'Why the tradition exists and how it evolves.', 'https://vimeo.com/example/5', 15, 1);

    -- 4. Seed Modules for Dads Course
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES (course_dads_id, 'Module 1: The Support System', 'How to be the ultimate partner.', 1)
    RETURNING id INTO module_id;

    INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index)
    VALUES 
    (module_id, 'Practical Help for New Moms', 'Tangible ways to reduce her load.', 'https://vimeo.com/example/6', 15, 1);

    -- 5. Seed Modules for Essential Course
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES (course_essential_id, 'Module 1: Newborn Basics', 'The absolute essentials of caring for your baby.', 1)
    RETURNING id INTO module_id;

    INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index)
    VALUES 
    (module_id, 'Safe Sleep Practices', 'Preventing SIDS and ensuring restful nights.', 'https://vimeo.com/example/7', 12, 1);

    RAISE NOTICE 'Seeding completed successfully!';
END $$;
