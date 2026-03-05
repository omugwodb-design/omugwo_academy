import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSeeds() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // First, create a test user if none exists
    console.log('👤 Checking for test user...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*');
    
    if (userError) throw userError;
    
    if (!users || users.length === 0) {
      throw new Error('No users found. Create at least one user account first, then re-run seeds.');
    }

    const instructorUser =
      users.find((u) => u.role === 'instructor' && u.auth_id) ||
      users.find((u) => u.auth_id) ||
      users.find((u) => u.role === 'instructor') ||
      users[0];
    const instructorId = instructorUser.id;
    console.log('✅ Using existing user:', instructorId);
    
    // Seed courses
    console.log('📚 Seeding courses...');
    const courses = [
      {
        title: 'The Omugwo Masterclass for Moms',
        slug: 'omugwo-masterclass-moms',
        description: 'Complete postnatal guide covering body recovery, mental health, cultural balance, marriage & intimacy, and infant care.',
        short_description: '12-week comprehensive postnatal recovery program for new mothers',
        price: 49000,
        original_price: 65000,
        currency: 'NGN',
        is_published: true,
        is_featured: true,
        target_audience: 'New mothers seeking postnatal guidance',
        duration_hours: 12,
        difficulty_level: 'beginner',
        instructor_id: instructorId,
        category: 'Postnatal Care',
        tags: ['postnatal', 'recovery', 'motherhood', 'omugwo'],
        drip_type: 'immediate',
        drip_config: {}
      },
      {
        title: 'Partner Support Training',
        slug: 'partner-support-training',
        description: 'Essential knowledge for fathers and partners to provide meaningful support during the postnatal period.',
        short_description: '6-week program for partners to support new mothers',
        price: 29000,
        currency: 'NGN',
        is_published: true,
        is_featured: false,
        target_audience: 'Fathers and partners of new mothers',
        duration_hours: 6,
        difficulty_level: 'beginner',
        instructor_id: instructorId,
        category: 'Partner Support',
        tags: ['partners', 'fathers', 'support', 'postnatal'],
        drip_type: 'immediate',
        drip_config: {}
      },
      {
        title: 'Essential Postnatal Care',
        slug: 'essential-postnatal-care',
        description: 'Core fundamentals every parent needs to know for a healthy postpartum journey.',
        short_description: '8-week essential postnatal care program',
        price: 39000,
        currency: 'NGN',
        is_published: true,
        is_featured: false,
        target_audience: 'All new parents',
        duration_hours: 8,
        difficulty_level: 'beginner',
        instructor_id: instructorId,
        category: 'Postnatal Care',
        tags: ['postnatal', 'essentials', 'newborn', 'care'],
        drip_type: 'immediate',
        drip_config: {}
      }
    ];
    
    for (const course of courses) {
      const { error: courseError } = await supabase
        .from('courses')
        .upsert(course, { onConflict: 'slug' });
      
      if (courseError) throw courseError;
      console.log(`✅ Course seeded: ${course.title}`);
    }
    
    // Load the moms course id (needed for modules/lessons/community that reference course_id)
    const { data: momsCourse, error: momsCourseErr } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'omugwo-masterclass-moms')
      .maybeSingle();
    if (momsCourseErr) throw momsCourseErr;
    if (!momsCourse) throw new Error('Moms course not found after upsert');

    const courseMomsId = momsCourse.id;

    // Seed modules and lessons for moms course
    console.log('📖 Seeding modules and lessons...');
    const modulesData = [
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 1-2: Physical Recovery',
        description: 'Understanding your body\'s healing journey',
        order_index: 1,
        is_published: true
      },
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 3-4: Mental & Emotional Health',
        description: 'Navigating the emotional challenges of motherhood',
        order_index: 2,
        is_published: true
      },
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 5-6: Cultural Integration',
        description: 'Balancing traditional omugwo with modern practices',
        order_index: 3,
        is_published: true
      },
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 7-8: Marriage & Intimacy',
        description: 'Maintaining healthy relationships postpartum',
        order_index: 4,
        is_published: true
      },
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 9-10: Infant Care Mastery',
        description: 'Comprehensive newborn care techniques',
        order_index: 5,
        is_published: true
      },
      {
        id: randomUUID(),
        course_id: courseMomsId,
        title: 'Week 11-12: Long-term Wellness',
        description: 'Sustaining health and wellbeing beyond the postpartum period',
        order_index: 6,
        is_published: true
      }
    ];
    
    for (const module of modulesData) {
      const { error: moduleError } = await supabase
        .from('modules')
        .upsert(module, { onConflict: 'id' });
      
      if (moduleError) throw moduleError;
      
      // Add lessons to each module
      const lessons = [
        {
          id: randomUUID(),
          module_id: module.id,
          title: 'Introduction to ' + module.title.split(':')[1]?.trim() || module.title,
          content: `Welcome to ${module.title}. This module will guide you through essential concepts and practical skills.`,
          video_url: 'https://example.com/intro-video.mp4',
          duration_minutes: 15,
          order_index: 1,
          is_free: module.order_index === 1,
          is_published: true,
          resources: JSON.stringify([
            { type: 'pdf', title: 'Module Guide', url: '/guides/' + module.id + '.pdf' },
            { type: 'link', title: 'Additional Resources', url: '/resources/' + module.id }
          ])
        },
        {
          id: randomUUID(),
          module_id: module.id,
          title: 'Core Concepts and Techniques',
          content: 'Deep dive into the fundamental principles and practical applications.',
          video_url: 'https://example.com/core-concepts.mp4',
          duration_minutes: 25,
          order_index: 2,
          is_free: false,
          is_published: true,
          resources: JSON.stringify([
            { type: 'pdf', title: 'Practice Worksheet', url: '/worksheets/' + module.id + '.pdf' }
          ])
        },
        {
          id: randomUUID(),
          module_id: module.id,
          title: 'Practical Application',
          content: 'Hands-on exercises and real-world applications of what you\'ve learned.',
          video_url: 'https://example.com/practical.mp4',
          duration_minutes: 20,
          order_index: 3,
          is_free: false,
          is_published: true,
          resources: JSON.stringify([
            { type: 'video', title: 'Demonstration', url: '/demos/' + module.id + '.mp4' }
          ])
        }
      ];
      
      for (const lesson of lessons) {
        const { error: lessonError } = await supabase
          .from('lessons')
          .upsert(lesson, { onConflict: 'id' });
        
        if (lessonError) throw lessonError;
      }
      
      console.log(`✅ Module seeded: ${module.title}`);
    }
    
    // Seed community spaces
    console.log('👥 Seeding community spaces...');
    const communitySpaces = [
      {
        name: 'New Moms Support',
        slug: 'new-moms-support',
        description: 'A safe space for new mothers to share experiences and get support',
        icon: 'baby',
        color: '#ec4899',
        is_private: false,
        requires_enrollment: true
      },
      {
        name: 'Dads Lounge',
        slug: 'dads-lounge',
        description: 'Where fathers and partners can connect and share their journey',
        icon: 'users',
        color: '#3b82f6',
        is_private: false,
        requires_enrollment: true
      },
      {
        name: 'Mental Health Matters',
        slug: 'mental-health-matters',
        description: 'Discussing postpartum mental health and wellbeing',
        icon: 'heart',
        color: '#8b5cf6',
        is_private: true,
        requires_enrollment: true
      },
      {
        name: 'Marriage & Intimacy',
        slug: 'marriage-intimacy',
        description: 'Navigating relationships during the postpartum period',
        icon: 'heart',
        color: '#ef4444',
        is_private: true,
        requires_enrollment: true
      },
      {
        name: 'Expert Q&A',
        slug: 'expert-qa',
        description: 'Get answers from medical and childcare experts',
        icon: 'award',
        color: '#f59e0b',
        is_private: false,
        requires_enrollment: false
      },
      {
        name: 'Masterclass Cohort',
        slug: 'masterclass-cohort',
        description: 'Exclusive community for masterclass students',
        icon: 'graduation-cap',
        color: '#10b981',
        is_private: true,
        requires_enrollment: true,
        course_id: courseMomsId
      }
    ];
    
    for (const space of communitySpaces) {
      const { data: existingSpace, error: existingSpaceErr } = await supabase
        .from('community_spaces')
        .select('id')
        .eq('slug', space.slug)
        .maybeSingle();
      if (existingSpaceErr) throw existingSpaceErr;

      if (existingSpace?.id) {
        const { error: spaceUpdateError } = await supabase
          .from('community_spaces')
          .update(space)
          .eq('id', existingSpace.id);
        if (spaceUpdateError) throw spaceUpdateError;
      } else {
        const { error: spaceInsertError } = await supabase
          .from('community_spaces')
          .insert({ id: randomUUID(), ...space });
        if (spaceInsertError) throw spaceInsertError;
      }
      console.log(`✅ Community space seeded: ${space.name}`);
    }
    
    // Seed sample webinars
    console.log('🎥 Seeding webinars...');
    const webinars = [
      {
        title: 'Introduction to Omugwo Care',
        description: 'Learn the fundamentals of traditional postnatal care',
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        duration_minutes: 90,
        thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        host_id: instructorId,
        topics: JSON.stringify(['omugwo', 'postnatal', 'traditional care']),
        status: 'upcoming',
        max_attendees: 100,
        is_free: true,
        price: null
      },
      {
        title: 'Advanced Postpartum Recovery Techniques',
        description: 'Deep dive into advanced recovery methods and modern practices',
        scheduled_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        duration_minutes: 120,
        thumbnail_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
        host_id: instructorId,
        topics: JSON.stringify(['recovery', 'advanced', 'techniques']),
        status: 'upcoming',
        max_attendees: 50,
        is_free: false,
        price: 5000,
        course_upsell_id: courseMomsId
      }
    ];
    
    for (const webinar of webinars) {
      const { data: existingWebinar, error: existingWebinarErr } = await supabase
        .from('webinars')
        .select('id')
        .eq('title', webinar.title)
        .maybeSingle();
      if (existingWebinarErr) throw existingWebinarErr;

      if (existingWebinar?.id) {
        const { error: webinarUpdateError } = await supabase
          .from('webinars')
          .update(webinar)
          .eq('id', existingWebinar.id);
        if (webinarUpdateError) throw webinarUpdateError;
      } else {
        const { error: webinarInsertError } = await supabase
          .from('webinars')
          .insert({ id: randomUUID(), ...webinar });
        if (webinarInsertError) throw webinarInsertError;
      }
      console.log(`✅ Webinar seeded: ${webinar.title}`);
    }
    
    // Seed site builder templates
    console.log('🎨 Seeding site builder templates...');
    const templates = [
      {
        name: 'Omugwo Default Home',
        description: 'Default homepage with all sections',
        category: 'homepage',
        page_type: 'homepage',
        blocks: JSON.stringify([
          {
            type: 'hero',
            props: {
              title: 'Welcome to Omugwo Academy',
              subtitle: 'Your journey through motherhood, supported by tradition and science',
              ctaText: 'Get Started',
              ctaLink: '/courses',
              backgroundImage: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1920'
            }
          }
        ]),
        is_system: true
      }
    ];
    
    for (const template of templates) {
      const { data: existingTemplate, error: existingTemplateErr } = await supabase
        .from('site_templates')
        .select('id')
        .eq('name', template.name)
        .maybeSingle();
      if (existingTemplateErr) throw existingTemplateErr;

      if (existingTemplate?.id) {
        const { error: templateUpdateError } = await supabase
          .from('site_templates')
          .update(template)
          .eq('id', existingTemplate.id);
        if (templateUpdateError) throw templateUpdateError;
      } else {
        const { error: templateInsertError } = await supabase
          .from('site_templates')
          .insert({ id: randomUUID(), ...template });
        if (templateInsertError) throw templateInsertError;
      }
      console.log(`✅ Template seeded: ${template.name}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Summary of seeded data:');
    console.log(`- ${courses.length} courses`);
    console.log(`- ${modulesData.length} modules`);
    console.log(`- ${modulesData.length * 3} lessons`);
    console.log(`- ${communitySpaces.length} community spaces`);
    console.log(`- ${webinars.length} webinars`);
    console.log(`- ${templates.length} site templates`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeeds();
