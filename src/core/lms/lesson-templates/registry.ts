// Lesson Template Registry
// Comprehensive template library with all 10 categories

import {
  LessonTemplate,
  TemplateMetadata,
  TemplateCategory,
  TemplateSettings,
  TemplateCapability,
  TemplateDifficulty,
  InteractivityLevel,
  ContentStyle,
  generateTemplateId,
} from './types';
import { LessonBlock } from '../lesson-blocks/types';

// ============================================
// DEFAULT TEMPLATE SETTINGS
// ============================================

const defaultSettings: TemplateSettings = {
  allowSkip: false,
  requireCompletion: true,
  trackProgress: true,
  enableDiscussion: false,
  enableNotes: true,
  enableBookmarks: true,
  showFeedback: true,
  showHints: true,
};

// ============================================
// HELPER TO CREATE BLOCKS
// ============================================

const createBlock = (
  type: LessonBlock['type'],
  props: Record<string, unknown>,
  id?: string
): LessonBlock => ({
  id: id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  props,
});

// ============================================
// 1. STANDARD LESSON TEMPLATES
// ============================================

const videoLessonTemplate: LessonTemplate = {
  metadata: {
    id: 'video-lesson',
    name: 'Mastering Postpartum Nutrition',
    description: 'A comprehensive guide to nourishing your body and supporting physical recovery after childbirth through expert-led video instruction and dietary planning.',
    category: 'standard',
    subcategory: 'video',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'instructional',
    estimatedTime: 45,
    tags: ['nutrition', 'recovery', 'health', 'postpartum', 'diet'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Preparation
    createBlock('section', {
      title: 'Module 1: The Foundations of Healing',
      fullWidth: false,
      background: { type: 'color', color: '#f8fafc' }
    }),
    createBlock('callout', {
      type: 'info',
      title: 'Learning Objectives',
      content: 'By the end of this lesson, you will identify 4 critical micronutrients for tissue repair and draft a 3-day recovery meal plan.',
    }),

    // Phase 2: Core Instruction (Section 1)
    createBlock('video', {
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: 'Biological Restoration: The First 6 Weeks',
      description: 'Dr. Sarah Miller explains why "eating for two" changes to "nourishing for one" during recovery.',
      showTranscript: true,
      completionRequired: true,
      completionThreshold: 90,
      poster: 'https://images.unsplash.com/photo-1543362906-acfc16c6756d?q=80&w=1000&auto=format&fit=crop'
    }),
    createBlock('text', {
      content: '## The Restoration Principle\n\nYour body has undergone a massive physiological event. Replenishing your mineral stores—specifically iron and magnesium—is vital for preventing the "postpartum crash."',
      format: 'markdown',
    }),

    // Core Instruction (Section 2)
    createBlock('section', { title: 'Module 2: The Macro Landscape', fullWidth: false }),
    createBlock('text', {
      content: '### Protein: The Building Block of Repair\n\nAim for **71g of protein per day**. This supports the repair of uterine tissue and pelvic floor muscles.\n\n### Hydration: More Than Just Water\n\nIf you are breastfeeding, your fluid needs increase. Focus on "structured hydration" including electrolytes.',
      format: 'markdown',
    }),
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop',
      alt: 'Nutritious meal prep',
      caption: 'Visual Guide: A balanced recovery plate should be 50% colorful vegetables.',
    }),

    // Phase 3: Interaction
    createBlock('accordion', {
      items: [
        { title: 'The Iron-Absorption Hack', content: 'Always pair plant-based iron (spinach, lentils) with Vitamin C (lemon, bell peppers) to triple absorption.' },
        { title: 'Avoiding "Empty" Calories', content: 'Limit processed sugars which can trigger hormonal swings and inflammation.' },
      ],
      allowMultiple: false,
    }),

    // Phase 4: Practice & Check
    createBlock('knowledgeCheck', {
      question: 'Which nutrient is most critical for resetting your parasympathetic nervous system and aiding sleep?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Sugar', correct: false },
        { id: 'b', text: 'Magnesium', correct: true },
        { id: 'c', text: 'Caffeine', correct: false },
      ],
      feedback: {
        correct: 'Spot on! Magnesium helps muscle relaxation and stress regulation.',
        incorrect: 'Think about "nature\'s relaxant."'
      },
    }),

    // Phase 5: Conclusion
    createBlock('discussion', {
      prompt: 'What is one "comfort food" you can modify to be more recovery-focused? (e.g., adding spinach to pasta)',
      placeholder: 'Share your recipe hacks...',
    }),
    createBlock('text', {
      content: '## Summary\n\nRecovery is a marathon, not a sprint. Proper fueling ensures you have the energy to care for both yourself and your newborn.',
      format: 'markdown',
    }),
  ],
  components: [
    { type: 'video', label: 'Instructional Video', isRequired: true, order: 1 },
    { type: 'text', label: 'Instructional Text', isRequired: true, order: 2 },
    { type: 'knowledgeCheck', label: 'Progress Check', isRequired: true, order: 3 },
  ],
  capabilities: [
    { id: 'videoTracking', name: 'Engagement Gating', description: 'Requires 90% video view for completion' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'Use this template for lecture-style content where video is the primary delivery method.',
};

const textBasedLessonTemplate: LessonTemplate = {
  metadata: {
    id: 'text-lesson',
    name: 'The Science of Newborn Sleep',
    description: 'A deep dive into circadian rhythms, sleep associations, and developmental leaps. Essential for understanding your baby\'s rest patterns.',
    category: 'standard',
    subcategory: 'text',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'instructional',
    estimatedTime: 30,
    tags: ['sleep', 'newborn', 'development', 'parenting', 'science'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1520206183501-b80af970dcaa?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Module 1: The Evolutionary Roots of Sleep',
      fullWidth: false,
      background: { type: 'color', color: '#f0f9ff' }
    }),
    createBlock('text', {
      content: '# Why Babies Sleep Differently\n\nNewborn sleep is polyphasic, meaning it occurs in many small bursts throughout 24 hours. Unlike adults, babies spend 50% of their sleep in REM (Active Sleep).',
      format: 'markdown',
    }),

    // Phase 2: Core Instruction
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1595053802722-e1927788448a?q=80&w=1000&auto=format&fit=crop',
      alt: 'Sleeping newborn in crib',
      caption: 'Science Fact: REM sleep is when the most intense brain development occurs.',
    }),
    createBlock('text', {
      content: '## The 4-Month Architecture Shift\n\nAround 16 weeks, sleep "regresses" because it is actually **progressing**. The brain starts moving from 2 sleep stages to the 4 stages found in adults.',
      format: 'markdown',
    }),
    createBlock('callout', {
      type: 'warning',
      title: 'SIDS Prevention Checklist',
      content: '1. Back to sleep for every sleep.\n2. Firm, flat surface.\n3. No loose blankets or toys.\n4. Room-share (but don\'t bed-share).',
    }),

    // Phase 3: Interaction
    createBlock('section', { title: 'Module 2: Mastering Associations', fullWidth: false }),
    createBlock('text', {
      content: '### What is a Sleep Association?\n\nIt\'s the set of conditions present when a baby falls asleep. If they wake in the night and those conditions (e.g., rocking) are gone, they struggle to drift back.',
      format: 'markdown',
    }),
    createBlock('tabs', {
      tabs: [
        { id: 't1', label: 'White Noise', content: 'Mimics the sound of the womb (approx 85-90 decibels in utero).', icon: 'Volume2' },
        { id: 't2', label: 'Darkness', content: 'Triggers natural melatonin production.', icon: 'Moon' },
        { id: 't3', label: 'Swaddling', content: 'Prevents the Moro (startle) reflex from waking them.', icon: 'Package' },
      ],
    }),

    // Phase 4: Practice
    createBlock('knowledgeCheck', {
      question: 'True or False: A baby\'s sleep regression is actually a sign of healthy neurological growth.',
      type: 'multiple-choice',
      options: [
        { id: '1', text: 'True', correct: true },
        { id: '2', text: 'False', correct: false },
      ],
      feedback: {
        correct: 'Exactly! It\'s a developmental milestone.',
        incorrect: 'Re-read the "Architecture Shift" section.'
      },
    }),

    // Phase 5: Conclusion
    createBlock('reflection', {
      prompt: 'Reflect on your current bedtime routine. Identify one element that helps baby cue for sleep.',
      questions: ['What is the cue?', 'How consistent is it?'],
    }),
    createBlock('text', {
      content: '## Closing Thoughts\n\nConsistency is the language of the infant brain. Small, repeatable steps tonight lead to better rest tomorrow.',
      format: 'markdown',
    }),
  ],
  components: [
    { type: 'text', label: 'Master Narrative', isRequired: true, order: 1 },
    { type: 'tabs', label: 'Interactive Details', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'richTextLayout', name: 'Structured Narrative', description: 'Multi-section reading experience' },
  ],
  defaultSettings,
  usageNotes: 'Best for written instruction that requires careful reading and reflection.',
};

const slideBasedLessonTemplate: LessonTemplate = {
  metadata: {
    id: 'slide-lesson',
    name: 'Quarterly Childcare Budgeting',
    description: 'Master the financial side of parenting. Learn to project costs for care, supplies, and college savings using our structured slide format.',
    category: 'standard',
    subcategory: 'slides',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'instructional',
    estimatedTime: 40,
    tags: ['finance', 'budgeting', 'childcare', 'planning'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Financial Roadmap: The Year Ahead',
      fullWidth: true,
      background: { type: 'color', color: '#1e293b' }
    }),
    createBlock('text', {
      content: '## Proactive Planning\n\nTransitioning to parenting involves a significant shift in cash flow. This slide deck breaks down the "hidden costs" and provides a framework for sustainable budgeting.',
      format: 'markdown',
    }),

    // Phase 2: Core slides
    createBlock('carousel', {
      slides: [
        {
          id: 'slide-1',
          title: 'Fixed vs. Variable Costs',
          content: 'Fixed: Tuition, Insurance. Variable: Diapers, Formula, Clothing. Goal: 15% buffer.',
          image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop',
        },
        {
          id: 'slide-2',
          title: 'The Childcare Gradient',
          content: 'Nanny ($$$) > Daycare ($$) > Co-op ($). Analyze the hourly impact on your career ROI.',
          image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop',
        },
        {
          id: 'slide-3',
          title: 'Sinking Funds',
          content: 'Save $50/month specifically for the next size up in clothing/gear to avoid lump-sum surprises.',
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop',
        },
      ],
      showNavigation: true,
      showProgress: true,
    }),

    // Phase 3: Detailed Expansion
    createBlock('section', { title: 'Diving into the Numbers', fullWidth: false }),
    createBlock('accordion', {
      items: [
        { title: 'Tax Benefits (FSA/HSA)', content: 'Maximize your Dependent Care FSA to save up to $5,000 tax-free on childcare expenses.' },
        { title: 'The Bulk-Buying Strategy', content: 'Subscription services for recurring items like wipes can save 20% annually.' },
      ],
    }),

    // Phase 4: Practical task
    createBlock('exercise', {
      title: 'Quick Audit',
      instructions: 'List your top 3 non-negotiable monthly expenses for baby. Upload a screenshot of your current tracking method.',
      timeLimit: 15,
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'success',
      title: 'Key Takeaway',
      content: 'Financial peace is built on systems, not just income. Start your sinking fund today!',
    }),
  ],
  components: [
    { type: 'carousel', label: 'Financial Deck', isRequired: true, order: 1 },
    { type: 'exercise', label: 'Budget Audit', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'slideInteraction', name: 'Slide Mastery', description: 'Tracks interaction with every financial slide' },
  ],
  defaultSettings,
  usageNotes: 'Optimal for presenting data-heavy or chronological information.',
};

// ============================================
// 2. INTERACTIVE KNOWLEDGE TEMPLATES
// ============================================

const accordionLearningTemplate: LessonTemplate = {
  metadata: {
    id: 'accordion-learning',
    name: 'Infant Developmental Milestones',
    description: 'Explore key growth milestones from birth to 12 months. A progressive guide for new parents to track physical, social, and cognitive leaps.',
    category: 'interactive',
    subcategory: 'exploration',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'exploratory',
    estimatedTime: 40,
    tags: ['milestones', 'development', 'infant', 'growth', 'tracking'],
    featured: true,
    popular: false,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Growth Roadmap: The First Year',
      fullWidth: false,
      background: { type: 'color', color: '#fdf2f8' }
    }),
    createBlock('text', {
      content: '# The Extraordinary First Year\n\nA baby\'s brain doubles in size in the first 12 months. This lesson walks you through the physical, cognitive, and social milestones you can expect.',
      format: 'markdown',
    }),

    // Phase 2: Core Analysis
    createBlock('section', { title: 'The Chronology of Growth', fullWidth: false }),
    createBlock('accordion', {
      items: [
        {
          title: '0-3 Months: Sensory Awakening',
          content: 'Focus on tummy time. Babies start to lift their heads and smile socially.',
          image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
        },
        {
          title: '4-6 Months: Vocal Progression',
          content: 'Babbling begins. They start to roll and reach for interesting objects.',
          image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
        },
        {
          title: '7-9 Months: Mobility Leaps',
          content: 'The "Pincer Grasp" develops. Many start scooting or crawling.',
          image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    }),

    // Phase 3: Deep Dive
    createBlock('callout', {
      type: 'tip',
      title: 'The Milestone Window',
      content: 'Milestones are ranges, not deadlines. Every child develops at a unique pace.',
    }),
    createBlock('text', {
      content: '## Supporting Each Leap\n\nInteraction is the best "toy." Talking, singing, and responding to their cues builds the neural pathways for future language.',
      format: 'markdown',
    }),

    // Phase 4: Verification
    createBlock('knowledgeCheck', {
      question: 'Which milestone typically marks the beginning of complex hand-eye coordination (picking up small items)?',
      type: 'multiple-choice',
      options: [
        { id: '1', text: 'Social Smiling', correct: false },
        { id: '2', text: 'Pincer Grasp', correct: true },
        { id: '3', text: 'Rolling over', correct: false },
      ],
    }),

    // Phase 5: Closing
    createBlock('discussion', {
      prompt: 'Which milestone are you most looking forward to or have recently observed?',
      placeholder: 'E.g., The first real social smile!',
    }),
    createBlock('badge', {
      name: 'Development Scout',
      description: 'Completed the First Year Roadmap',
      icon: '🌱',
      earned: false,
    }),
  ],
  components: [
    { type: 'accordion', label: 'Milestone Panels', isRequired: true, order: 1 },
    { type: 'knowledgeCheck', label: 'Review', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'progressiveReveal', name: 'Layered Learning', description: 'Content unfolds through interaction' },
  ],
  defaultSettings,
  usageNotes: 'Excellent for content sets with 4-7 distinct developmental sub-topics.',
};

const tabbedLearningTemplate: LessonTemplate = {
  metadata: {
    id: 'tabbed-learning',
    name: 'Comparing Feeding Approaches',
    description: 'A balanced comparison of breastfeeding and formula feeding. Understand the pros, challenges, and support systems for each path.',
    category: 'interactive',
    subcategory: 'comparison',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'exploratory',
    estimatedTime: 45,
    tags: ['feeding', 'breastfeeding', 'formula', 'comparison', 'parenting'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Making an Informed Choice',
      fullWidth: false,
      background: { type: 'color', color: '#f0fdf4' }
    }),
    createBlock('text', {
      content: '## Fed is Best\n\nThe goal of this lesson is not to push one path, but to provide the biological and logistical facts for all feeding methods.',
      format: 'markdown',
    }),

    // Phase 2: Core Tabs
    createBlock('tabs', {
      tabs: [
        {
          id: 'tab-1',
          label: 'Breastfeeding',
          content: 'Key benefits: Biological antibodies (IgA), hormonal bonding (oxytocin), and zero cost for the milk itself.',
          icon: 'Heart',
        },
        {
          id: 'tab-2',
          label: 'Formula Feeding',
          content: 'Key benefits: Shared workload, predictable intake measurements, and consistent availability for partners.',
          icon: 'Milk',
        },
      ],
      completionRequired: 'all',
    }),

    // Phase 3: Deep Dive
    createBlock('section', { title: 'The Logistical Reality', fullWidth: false }),
    createBlock('text', {
      content: '### The Support Factor\n\nSuccess in any feeding journey depends significantly on your support system—LCs, doulas, and partners.',
      format: 'markdown',
    }),
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop',
      alt: 'Feeding baby',
      caption: 'Practicality: Choose the method that enables your mental health to flourish.',
    }),

    // Phase 4: Interaction
    createBlock('accordion', {
      items: [
        { title: 'Storing Breastmilk', content: 'Follow the 4-4-4 rule: 4 hours room temp, 4 days fridge, 4 months freezer.' },
        { title: 'Formula Safety', content: 'Never prop a bottle; always check temperature on your wrist first.' },
      ],
    }),

    // Phase 5: Conclusion
    createBlock('callout', {
      type: 'info',
      title: 'Consult a Pro',
      content: 'If you have pain, latch issues, or supply concerns, reach out to our "Ask a Doula" community space.',
    }),
    createBlock('discussion', {
      prompt: 'What is your biggest question or concern regarding starting your feeding journey?',
      placeholder: 'Share with other new parents...',
    }),
  ],
  components: [
    { type: 'tabs', label: 'Comparison System', isRequired: true, order: 1 },
    { type: 'accordion', label: 'Safety Guides', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'tabSwitching', name: 'Contextual Comparison', description: 'Side-by-side data analysis' },
  ],
  defaultSettings,
  usageNotes: 'Ideal for neutral comparisons where learners need to weigh options.',
};

const interactiveCardsTemplate: LessonTemplate = {
  metadata: {
    id: 'interactive-cards',
    name: 'Toddler First Aid Essentials',
    description: 'Rapid-response guides for common toddler emergencies. Flip each card to learn the immediate steps to take.',
    category: 'interactive',
    subcategory: 'cards',
    difficulty: 'beginner',
    interactivityLevel: 'high',
    contentStyle: 'exploratory',
    estimatedTime: 30,
    tags: ['first-aid', 'emergency', 'toddler', 'safety', 'micro-learning'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Emergency Preparedness',
      fullWidth: false,
      background: { type: 'color', color: '#fef2f2' }
    }),
    createBlock('callout', {
      type: 'warning',
      title: 'CRITICAL',
      content: 'This is an educational guide. In a true emergency, call 911 (or local equivalent) immediately.',
    }),

    // Phase 2: Active Recall Cards
    createBlock('text', {
      content: '## Situation Training\n\nRead the emergency on the front, recall the action, then flip to verify.',
      format: 'markdown',
    }),
    createBlock('grid', {
      columns: 3,
      gap: 'medium',
      children: [], // Grid container
    }),
    createBlock('flipCard', {
      frontContent: 'Airway Obstruction',
      backContent: 'Attempt Heimlich maneuver. For infants, 5 back slaps followed by 5 chest thrusts.',
      flipDirection: 'horizontal',
    }),
    createBlock('flipCard', {
      frontContent: 'Severe Burn',
      backContent: 'Run cool (not cold) water for 20 mins. Do not use ice, butter, or ointments.',
      flipDirection: 'horizontal',
    }),
    createBlock('flipCard', {
      frontContent: 'Fall / Head Injury',
      backContent: 'Monitor for vomiting, lethargy, or uneven pupils. Keep them calm and still.',
      flipDirection: 'horizontal',
    }),

    // Phase 3: Deep Dive Table
    createBlock('section', { title: 'The First Aid Kit', fullWidth: false }),
    createBlock('text', {
      content: '### Must-Have Supplies\n\n1. Sterile Gauze\n2. Antiseptic wipes\n3. Digital thermometer\n4. Saline solution',
      format: 'markdown',
    }),

    // Phase 4: Practice
    createBlock('knowledgeCheck', {
      question: 'What is the "Rule of 20" for minor household burns?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: '20 ice cubes', correct: false },
        { id: 'b', text: '20 minutes of cool water', correct: true },
        { id: 'c', text: '20 layers of bandages', correct: false },
      ],
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'success',
      title: 'Preparation is Peace',
      content: 'Print the PDF summary below for your fridge/nanny.',
    }),
    createBlock('badge', {
      name: 'Safety Guardian',
      description: 'Completed First Aid Essentials',
      icon: '🛡️',
      earned: false,
    }),
  ],
  components: [
    { type: 'flipCard', label: 'Emergency Cards', isRequired: true, order: 1 },
    { type: 'knowledgeCheck', label: 'Response Drill', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'cardInteraction', name: 'Active Recall', description: 'Flip-based memory reinforcement' },
  ],
  defaultSettings,
  usageNotes: 'Ideal for rapid response and emergency protocol training.',
};

// ============================================
// 3. ASSESSMENT TEMPLATES
// ============================================

const knowledgeCheckTemplate: LessonTemplate = {
  metadata: {
    id: 'knowledge-check',
    name: 'Safe Sleep Knowledge Check',
    description: 'A quick verification of safety protocols for newborn sleep environments. Ensure you can identify hazards before they become risks.',
    category: 'assessment',
    subcategory: 'inline',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'evaluative',
    estimatedTime: 20,
    tags: ['safety', 'sids', 'newborn', 'sleep', 'check'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Safety Audit: The Nursery',
      fullWidth: false,
      background: { type: 'color', color: '#fff7ed' }
    }),
    createBlock('text', {
      content: '# Protecting Your Sleep Space\n\nSIDS (Sudden Infant Death Syndrome) risks can be mitigated by following the "ABC" rules. This assessment verifies your nursery setup.',
      format: 'markdown',
    }),

    // Phase 2: Core Review
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1595053802722-e1927788448a?q=80&w=1000&auto=format&fit=crop',
      alt: 'Ideal safe crib',
      caption: 'Visualizing "Alone": Zero toys, zero pillows, zero blankets.',
    }),
    createBlock('callout', {
      type: 'warning',
      title: 'Marketing vs. Safety',
      content: 'Inclined sleepers and "cot bumpers" are often marketed as safe but are linked to significant suffocation risks.',
    }),

    // Phase 3: Immediate Knowledge Checks
    createBlock('section', { title: 'Assessment: Identify the Risk', fullWidth: false }),
    createBlock('knowledgeCheck', {
      question: 'Which of the following items is permissible in a newborn\'s crib according to the AAP (American Academy of Pediatrics)?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'A small, breathable stuffed animal', correct: false },
        { id: 'b', text: 'A fitted sheet only', correct: true },
        { id: 'c', text: 'A thin muslin blanket', correct: false },
      ],
      feedback: {
        correct: 'Exactly. The crib should be completely empty except for the baby and a fitted sheet.',
        incorrect: 'Even thin items like muslin blankets are considered hazards in the first year.',
      },
      allowRetry: true,
    }),

    // Phase 4: Secondary Scenario Check
    createBlock('knowledgeCheck', {
      question: 'What is the "A" in the ABCs of safe sleep?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Always nearby', correct: false },
        { id: 'b', text: 'Alone', correct: true },
        { id: 'c', text: 'Airflow maximized', correct: false },
      ],
      feedback: {
        correct: 'Correct! "Alone" means the baby should sleep in their own space.',
        incorrect: 'The "A" stands for Alone—meaning no co-sleeping.',
      },
      allowRetry: true,
    }),

    // Phase 5: Conclusion
    createBlock('callout', {
      type: 'success',
      title: 'Verification Complete',
      content: 'You can now identify major SIDS risks. Consistency saves lives.',
    }),
    createBlock('badge', {
      name: 'Safety Inspector',
      description: 'Mastered Safe Sleep Audits',
      icon: '🌙',
      earned: false,
    }),
  ],
  components: [
    { type: 'knowledgeCheck', label: 'Safety Verification', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'inlineGrading', name: 'Instant Validation', description: 'Immediate corrective feedback for safety protocols' },
  ],
  defaultSettings,
  usageNotes: 'Perfect for high-stakes safety information where immediate feedback is critical.',
};

const endOfLessonQuizTemplate: LessonTemplate = {
  metadata: {
    id: 'end-lesson-quiz',
    name: 'Maternal Mental Health Screening',
    description: 'An educational assessment designed to help learners identify signs of postpartum depression (PPD) and anxiety. Includes scoring and professional resource links.',
    category: 'assessment',
    subcategory: 'quiz',
    difficulty: 'intermediate',
    interactivityLevel: 'medium',
    contentStyle: 'evaluative',
    estimatedTime: 35,
    tags: ['mental-health', 'ppd', 'screening', 'health', 'wellness'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Contextual Intro
    createBlock('section', {
      title: 'Emotional Well-being Audit',
      fullWidth: false,
      background: { type: 'color', color: '#fff1f2' }
    }),
    createBlock('text', {
      content: '# Understanding Postpartum Emotions\n\nIt is normal to feel overwhelmed, but distinguishing between the "Baby Blues" and PPD is vital for recovery. Complete this quiz to gauge your understanding of the warning signs.',
      format: 'markdown',
    }),

    // Phase 2: Educational Primer
    createBlock('tabs', {
      tabs: [
        { id: 'b1', label: 'Baby Blues', content: 'Timing: Day 3-10. Symptoms: Crying, irritability. Resolution: Self-resolves with rest.' },
        { id: 'b2', label: 'PPD/PPA', content: 'Timing: Any time in first year. Symptoms: Intense anxiety, inability to sleep when baby sleeps, feelings of worthlessness.' },
      ],
    }),

    // Phase 3: The Scored Quiz
    createBlock('section', { title: 'Self-Reflection Quiz', fullWidth: false }),
    createBlock('quiz', {
      title: 'Emotional Health Awareness Quiz',
      questions: [
        {
          id: 'q1',
          question: 'In the last 7 days, I have blamed myself unnecessarily when things went wrong.',
          type: 'multiple-choice',
          options: [
            { id: '1', text: 'Yes, most of the time', points: 3 },
            { id: '2', text: 'Yes, some of the time', points: 2 },
            { id: '3', text: 'Not very often', points: 1 },
            { id: '4', text: 'No, not at all', points: 0 },
          ],
        },
        {
          id: 'q2',
          question: 'I have felt anxious or worried for no good reason.',
          type: 'multiple-choice',
          options: [
            { id: '1', text: 'Yes, quite a lot', points: 3 },
            { id: '2', text: 'Yes, sometimes', points: 2 },
            { id: '3', text: 'Hardly ever', points: 1 },
            { id: '4', text: 'No, not at all', points: 0 },
          ],
        },
      ],
      showResults: true,
      passingScore: 10,
    }),

    // Phase 4: Dynamic Feedback
    createBlock('callout', {
      type: 'info',
      title: 'Interpreting Results',
      content: 'A score of 10+ indicates a possible presence of PPD. Please share these results with your healthcare provider.',
    }),

    // Phase 5: Conclusion & Resources
    createBlock('section', { title: 'Support & Care', fullWidth: false }),
    createBlock('text', {
      content: '### You Are Not Alone\n\nRecovery is possible with the right support. Reach out to your doctor or our "Ask a Doula" space today.',
      format: 'markdown',
    }),
    createBlock('discussion', {
      prompt: 'Share one small thing you did for yourself today.',
      placeholder: 'E.g., Drank a hot cup of tea alone.',
    }),
  ],
  components: [
    { type: 'quiz', label: 'Health Screening Quiz', isRequired: true, order: 1 },
    { type: 'tabs', label: 'Comparison Chart', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'assessmentEngine', name: 'Scoring Diagnostic', description: 'Calculates understanding levels across symptoms' },
  ],
  defaultSettings,
  usageNotes: 'Best used at the end of mental health or wellness modules to summarize learning.',
};

const certificationExamTemplate: LessonTemplate = {
  metadata: {
    id: 'certification-exam',
    name: 'Professional Childcare Certification',
    description: 'A comprehensive, timed examination for nannies and professional caregivers. Covers emergency response, child development, and nutrition.',
    category: 'assessment',
    subcategory: 'exam',
    difficulty: 'advanced',
    interactivityLevel: 'medium',
    contentStyle: 'evaluative',
    estimatedTime: 60,
    tags: ['exam', 'certification', 'nanny', 'professional', 'career'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Certification Final Exam',
      fullWidth: true,
      background: { type: 'color', color: '#111827' }
    }),
    createBlock('callout', {
      type: 'warning',
      title: 'Exam Regulations',
      content: '• **Timed Session**: 60 Minutes\n• **Attempts**: 1 Attempt allowed\n• **Pass Mark**: 75% Required\n• **ID Verification**: Required upon completion',
    }),
    createBlock('quiz', {
      title: 'Certification Exam',
      questions: [
        {
          id: 'q1',
          question: 'A 2-year-old child begins to choke on a round food item. What is the immediate first step?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Perform blind finger sweeps', correct: false },
            { id: 'b', text: 'Apply abdominal thrusts (Heimlich)', correct: true },
            { id: 'c', text: 'Give water to help wash it down', correct: false },
            { id: 'd', text: 'Lay them on their back', correct: false },
          ],
          points: 5,
        },
        // Additional complex questions...
      ],
      shuffleQuestions: true,
      showProgress: true,
      showResults: true,
      passingScore: 75,
      allowReview: false,
      timed: true,
      timeLimit: 60,
    }),
    createBlock('text', {
      content: '## Final Verification\n\nUpon successful completion, your digital certification will be generated and added to your professional profile.',
      format: 'markdown',
    }),
  ],
  components: [
    { type: 'quiz', label: 'Timed Exam', isRequired: true, order: 1 },
    { type: 'callout', label: 'Proctoring Rules', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'advancedTesting', name: 'Exam Proctoring', description: 'Timed sessions with randomization logic' },
    { id: 'certification', name: 'Credential Tracking', description: 'Triggers certificate generation workflows' },
  ],
  defaultSettings: {
    ...defaultSettings,
    passingScore: 75,
    maxAttempts: 1,
    shuffleQuestions: true,
    timeLimit: 60,
    showFeedback: false,
  },
  usageNotes: 'Designed for formal accreditation and high-stakes competence testing.',
};

// ============================================
// 4. SCENARIO-BASED LEARNING TEMPLATES
// ============================================

const chooseYourPathTemplate: LessonTemplate = {
  metadata: {
    id: 'choose-your-path',
    name: 'The First Night Home: A Simulation',
    description: 'An interactive scenario where your choices determine the outcome of your first night home with a newborn. Experience the impact of fatigue, routine, and support.',
    category: 'scenario',
    subcategory: 'branching',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'narrative',
    estimatedTime: 40,
    tags: ['simulation', 'scenario', 'newborn', 'decision-making', 'parenting'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Hook
    createBlock('section', {
      title: 'Scene 1: The Door Closes',
      fullWidth: false,
      background: { type: 'color', color: '#0f172a' }
    }),
    createBlock('text', {
      content: '# You are Home\n\nThe hospital monitors are gone. It\'s just you and the baby. The sun is setting, and the "Fourth Trimester" truly begins.',
      format: 'markdown',
    }),

    // Phase 2: First Branch
    createBlock('scenario', {
      id: 'sc1',
      title: 'The Silent House',
      description: 'You\'vebeen home for 6 hours. Baby is crying. You haven\'t eaten. Partner offers to help. What do you do?',
      options: [
        {
          id: 'opt1',
          text: 'Accept the help and sleep for 4 hours',
          nextStepId: 'step_rest',
          feedback: 'Correct! Sleep is a biological necessity for recovery.'
        },
        {
          id: 'opt2',
          text: 'Insist on doing it yourself to "bond"',
          nextStepId: 'step_fatigue',
          feedback: 'Bonding happens better when you aren\'t in a state of extreme exhaustion.'
        },
      ],
    }),

    // Phase 3: Secondary Branch
    createBlock('section', { title: 'Scene 2: The 2 AM Wakeup', fullWidth: false }),
    createBlock('scenario', {
      id: 'sc2',
      title: 'The Cluster Feed',
      description: 'Baby is crying again, 40 mins after the last feed.',
      options: [
        {
          id: 's2_1',
          text: 'Feed again (Cluster feeding)',
          nextStepId: 'success',
          feedback: 'Yes! This builds milk supply and settles baby.'
        },
        {
          id: 's2_2',
          text: 'Rock them to skip a feed',
          nextStepId: 'fail',
          feedback: 'This often leads to more intense crying later.'
        },
      ],
    }),

    // Phase 4: Reflection
    createBlock('section', { title: 'Debrief', fullWidth: false }),
    createBlock('reflection', {
      prompt: 'Reflect on your choices',
      questions: ['How did accepting help impact your stress levels?', 'What was the hardest choice?'],
    }),

    // Phase 5: Summary
    createBlock('callout', {
      type: 'success',
      title: 'Survival Mastered',
      content: 'You navigated the first night with biological wisdom.',
    }),
    createBlock('badge', {
      name: 'First Night Hero',
      description: 'Completed the First Night Simulation',
      icon: '🏠',
      earned: false,
    }),
  ],
  components: [
    { type: 'scenario', label: 'Decision Matrix', isRequired: true, order: 1 },
    { type: 'reflection', label: 'Choice Debrief', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'branchingLogic', name: 'Adaptive Storytelling', description: 'Narrative shifts based on learner decisions' },
  ],
  defaultSettings,
  usageNotes: 'Immersive simulation for soft-skill development and realistic preparedness.',
};

const roleplaySimulationTemplate: LessonTemplate = {
  metadata: {
    id: 'roleplay-simulation',
    name: 'The First Pediatrician Visit',
    description: 'Practice advocating for your child in a clinical setting. Choose your dialogue options to ensure all your concerns are addressed by the healthcare provider.',
    category: 'scenario',
    subcategory: 'roleplay',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'narrative',
    estimatedTime: 15,
    tags: ['roleplay', 'advocacy', 'doctor', 'communication', 'parenting'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Practice: Clinical Communication',
      fullWidth: false,
      background: { type: 'color', color: '#f8fafc' }
    }),
    createBlock('text', {
      content: '## Advocacy in Action\n\nIn this roleplay, you are at your baby\'s 2-week check-up. You have concerns about nursing frequency and a small rash. **How do you start the conversation?**',
      format: 'markdown',
    }),
    createBlock('scenario', {
      title: 'Dialogue Choices',
      description: 'Choose the most effective way to communicate your concerns.',
      branches: [
        {
          id: 'opt-1',
          label: 'Wait for the doctor to lead and hope they ask about the rash',
          outcome: 'The doctor finishes the exam quickly and is about to leave...',
          consequence: 'Missed Opportunity. You leave the office feeling anxious because your main concern wasn\'t addressed.',
          nextBlockId: 'outcome-passive',
        },
        {
          id: 'opt-2',
          label: 'Interrupt with a list of everything you\'ve Googled',
          outcome: 'The doctor seems overwhelmed by the unsourced information...',
          consequence: 'Friction. The appointment takes longer than necessary, and the focus shifts away from the baby\'s actual symptoms.',
          nextBlockId: 'outcome-aggressive',
        },
        {
          id: 'opt-3',
          label: 'Present a concise, written list of symptoms and observations',
          outcome: 'The doctor reviews the list with you professionally...',
          consequence: 'Efficiency + Trust. Both concerns are addressed with medical precision, and you receive clear next steps.',
          nextBlockId: 'outcome-advocate',
        },
      ],
      allowRetry: true,
      showConsequences: true,
    }),
  ],
  components: [
    { type: 'scenario', label: 'Dialogue Engine', isRequired: true, order: 1 },
    { type: 'text', label: 'Communication Tips', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'characterInteraction', name: 'Persona Simulation', description: 'Interact with AI-driven or scripted personas' },
    { id: 'softSkillTracking', name: 'Advocacy Practice', description: 'Measures effectiveness of communication choices' },
  ],
  defaultSettings,
  usageNotes: 'Powerful for preparing learners for real-world interactions.',
};

const ethicalDilemmaTemplate: LessonTemplate = {
  metadata: {
    id: 'ethical-dilemma',
    name: 'The Career Transition Dilemma',
    description: 'Explore the complex intersection of career aspirations and early motherhood. Navigate a difficult workplace conversation without clear "right" or "wrong" answers.',
    category: 'scenario',
    subcategory: 'dilemma',
    difficulty: 'advanced',
    interactivityLevel: 'high',
    contentStyle: 'narrative',
    estimatedTime: 25,
    tags: ['ethics', 'career', 'motherhood', 'work-life-balance', 'psychology'],
    featured: false,
    popular: true,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Dilemma: The Promotion Offer',
      fullWidth: false,
      background: { type: 'color', color: '#111827' }
    }),
    createBlock('text', {
      content: '## Background\n\nYou are 3 months postpartum and have just returned to your regional manager role. Your boss offers you a promotion that requires 50% travel. \n\n### The Tension:\nThis is your dream job, but your partner also works full-time, and you have no local family support.',
      format: 'markdown',
    }),
    createBlock('scenario', {
      title: 'Choose Your Priority',
      description: 'There are no simple answers here. Explore the trade-offs of each path.',
      branches: [
        {
          id: 'path-career',
          label: 'Accept the promotion and hire a full-time live-in nanny',
          outcome: 'Career trajectory accelerates, but household expenses triple...',
          consequence: 'Financial Strain + High. Parental Time - Low.',
          nextBlockId: 'career-focus',
        },
        {
          id: 'path-family',
          label: 'Decline for now, asking to revisit the offer in 12 months',
          outcome: 'Pressure eases at home, but you realize you may be passed over for the next cycle...',
          consequence: 'Career Momentum - Stalled. Mental Peace + High.',
          nextBlockId: 'family-focus',
        },
        {
          id: 'path-hybrid',
          label: 'Negotiate for the role with a 10% travel limit and remote focus',
          outcome: 'Your boss is skeptical but willing to try for a 90-day pilot...',
          consequence: 'Uncertainty + High. Negotiation Skill + Mastery.',
          nextBlockId: 'hybrid-focus',
        },
      ],
      allowRetry: true,
      showConsequences: true,
    }),
    createBlock('discussion', {
      prompt: 'Reflect on your own values. In this scenario, which factor (Financial, Career, or Time) weighed most heavily on your decision?',
      placeholder: 'Consider your personal long-term goals...',
    }),
  ],
  components: [
    { type: 'scenario', label: 'Dilemma engine', isRequired: true, order: 1 },
    { type: 'discussion', label: 'Values Reflection', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'multipleOutcomes', name: 'Gray-Scale Ethics', description: 'No binary right/wrong answers' },
    { id: 'valueAssessment', name: 'Priority Mapping', description: 'Forces learners to rank competing values' },
  ],
  defaultSettings,
  usageNotes: 'Designed for high-level leadership and life-transition coaching.',
};

// ============================================
// 5. VISUAL LEARNING TEMPLATES
// ============================================

const interactiveHotspotTemplate: LessonTemplate = {
  metadata: {
    id: 'interactive-hotspot',
    name: 'The Anatomy of Lactation',
    description: 'A visual exploration of the endocrine system and physical structures involved in human lactation. Master the "supply and demand" feedback loop.',
    category: 'visual',
    subcategory: 'hotspot',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'exploratory',
    estimatedTime: 30,
    tags: ['biology', 'lactation', 'anatomy', 'science', 'visual'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306dcaedc?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Hormonal Triggers',
      fullWidth: true,
      background: { type: 'color', color: '#fdf2f8' }
    }),
    createBlock('text', {
      content: '## The Biological Factory\n\nLactation is not just a physical process; it\'s a complex interplay between the brain and the body. Explore the diagram below to see how it works.',
      format: 'markdown',
    }),

    // Phase 2: Active Exploration
    createBlock('hotspot', {
      image: 'https://images.unsplash.com/photo-1576086213369-97a306dcaedc?q=80&w=1000&auto=format&fit=crop',
      alt: 'Anatomical diagram of lactation',
      hotspots: [
        {
          id: 'hs-1',
          x: 30,
          y: 40,
          label: 'Pituitary Gland',
          content: 'Releases prolactin and oxytocin.',
          icon: 'info',
        },
        {
          id: 'hs-2',
          x: 50,
          y: 60,
          label: 'Alveoli',
          content: 'The clusters where milk is produced.',
          icon: 'info',
        },
      ],
    }),

    // Phase 3: Deep Dive
    createBlock('section', { title: 'Supply & Demand', fullWidth: false }),
    createBlock('text', {
      content: '### The "Milk Removal" Rule\n\nThe more frequently the breast is emptied, the faster the body refilling reflex triggers. Waiting for "fullness" actually slows production.',
      format: 'markdown',
    }),

    // Phase 4: Practice
    createBlock('knowledgeCheck', {
      question: 'Which hormone is responsible for the "Let Down Reflect" (squeezing milk towards the nipple)?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Insulin', correct: false },
        { id: 'b', text: 'Oxytocin', correct: true },
        { id: 'c', text: 'Melatonin', correct: false },
      ],
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'info',
      title: 'Knowledge is Power',
      content: 'Understanding the biology helps reduce anxiety during early breastfeeding.',
    }),
    createBlock('badge', {
      name: 'Lactation Analyst',
      description: 'Mastered the Anatomy of Lactation',
      icon: '🧠',
      earned: false,
    }),
  ],
  components: [
    { type: 'hotspot', label: 'Interactive Image', isRequired: true, order: 1 },
    { type: 'knowledgeCheck', label: 'Biology Check', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'hotspots', name: 'Interactive Hotspots', description: 'Clickable areas on medical diagrams' },
  ],
  defaultSettings,
  usageNotes: 'Best for teaching anatomy or systemic processes.',
};

const processFlowTemplate: LessonTemplate = {
  metadata: {
    id: 'process-flow',
    name: 'The 5 S\'s of Soothing',
    description: 'Dr. Harvey Karp\'s world-renowned system for calming a crying baby. Follow this step-by-step process to trigger the "calming reflex."',
    category: 'visual',
    subcategory: 'process',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'instructional',
    estimatedTime: 40,
    tags: ['soothing', 'crying', 'newborn', 'technique', 'dr-karp'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'The Calming Reflex',
      fullWidth: false,
      background: { type: 'color', color: '#f0f9ff' }
    }),
    createBlock('text', {
      content: '# Why Babies Cry\n\nNewborns are born "3 months early" compared to other mammals. The 5 S\'s mimic the sensory environment of the womb to stop the "startle" reflex.',
      format: 'markdown',
    }),

    // Phase 2: Functional Steps
    createBlock('process', {
      steps: [
        { id: 's1', number: 1, title: 'Swaddle', description: 'Snug wrapping stops jerky movements.' },
        { id: 's2', number: 2, title: 'Side/Stomach', description: 'A safe hold in your arms (not for sleep).' },
        { id: 's3', number: 3, title: 'Shush', description: 'Loud white noise mimicking the womb.' },
        { id: 's4', number: 4, title: 'Swing', description: 'Tiny shivering motions.' },
        { id: 's5', number: 5, title: 'Suck', description: 'The final step to deep calm.' },
      ],
    }),

    // Phase 3: Detailed Technique
    createBlock('section', { title: 'The "Loudness" Factor', fullWidth: false }),
    createBlock('text', {
      content: '### The Shush Rule\n\nYour "Shush" should be as loud as the baby\'s cry. In utero, the sound of the blood flow is louder than a vacuum cleaner!',
      format: 'markdown',
    }),

    // Phase 4: Interaction
    createBlock('accordion', {
      items: [
        { title: 'Swaddle Safety', content: 'Ensure 2 fingers fit between the chest and wrap; hips should be loose.' },
        { title: 'When it Fails', content: 'Check for hunger, wet diaper, or overstimulation.' },
      ],
    }),

    // Phase 5: Conclusion
    createBlock('callout', {
      type: 'success',
      title: 'Master Soother',
      content: 'Practice during calm times to be ready for the fussy hours.',
    }),
  ],
  components: [
    { type: 'process', label: 'Soothing Steps', isRequired: true, order: 1 },
    { type: 'accordion', label: 'Safety Details', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'sequentialLearning', name: 'Procedural Logic', description: 'Step-by-step calming methods' },
  ],
  defaultSettings,
  usageNotes: 'Perfect for "How-To" guides and multi-stage procedures.',
};

const timelineLearningTemplate: LessonTemplate = {
  metadata: {
    id: 'timeline-learning',
    name: 'Postpartum Recovery Timeline',
    description: 'A week-by-week guide to physical and emotional healing after delivery. Know what to expect during the "Golden Month."',
    category: 'visual',
    subcategory: 'timeline',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'narrative',
    estimatedTime: 40,
    tags: ['timeline', 'postpartum', 'recovery', 'health', 'healing'],
    featured: false,
    popular: false,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Healing Roadmap',
      fullWidth: true,
      background: { type: 'color', color: '#1e293b' }
    }),
    createBlock('text', {
      content: "# Your Body's Wisdom\n\nRecovery from childbirth isn't a single event; it's a physiological sequence. This timeline helps you manage expectations for the first 6 weeks.",
      format: 'markdown',
    }),

    // Phase 2: Active Timeline
    createBlock('timeline', {
      events: [
        { id: 'w1', date: 'Week 1', title: 'Inflammation & Flush', description: 'Body begins to shed excess fluid from pregnancy.' },
        { id: 'w2', date: 'Week 2', title: 'The Hormonal Cliff', description: 'A major drop in estrogen/progesterone can impact mood.' },
        { id: 'w6', date: 'Week 6', title: 'The Standard Milestone', description: 'Internal healing is largely complete.' },
      ],
    }),

    // Phase 3: Qualitative Detail
    createBlock('section', { title: 'The "Golden Month"', fullWidth: false }),
    createBlock('text', {
      content: '### Traditional Recovery\n\nMany cultures practice "The Sitting Moon" or "Golden Month," prioritizing 40 days of zero labor to ensure long-term pelvic health.',
      format: 'markdown',
    }),

    // Phase 4: Self-Check
    createBlock('exercise', {
      title: 'Recovery Audit',
      instructions: 'Which phase of the timeline are you currently in? List 2 physical boundaries you are holding this week.',
    }),

    // Phase 5: Conclusion
    createBlock('callout', {
      type: 'info',
      title: 'Listen to Your Body',
      content: 'If you experience fatigue that prevents basic care, reach out for a check-up.',
    }),
  ],
  components: [
    { type: 'timeline', label: 'Recovery Sequence', isRequired: true, order: 1 },
    { type: 'exercise', label: 'Personal Audit', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'chronologicalLearning', name: 'Temporal Logic', description: 'Visualizes progress over time' },
  ],
  defaultSettings,
  usageNotes: 'Excellent for historical, developmental, or procedural sequences.',
};

// ============================================
// 6. STORYTELLING TEMPLATES
// ============================================

const storyLessonTemplate: LessonTemplate = {
  metadata: {
    id: 'story-lesson',
    name: 'A Day in the Life: New Mom Edition',
    description: 'Follow "Amara" through her first 24 hours at home. A narrative journey that teaches time management and self-care through relatable storytelling.',
    category: 'storytelling',
    subcategory: 'narrative',
    difficulty: 'intermediate',
    interactivityLevel: 'low',
    contentStyle: 'narrative',
    estimatedTime: 20,
    tags: ['story', 'narrative', 'empathy', 'parenting', 'real-life'],
    featured: true,
    popular: true,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Amara\'s Journey Home',
      fullWidth: false,
      background: { type: 'color', color: '#fafaf9' }
    }),
    createBlock('text', {
      content: '# The Awakening\n\nIt\'s 3:15 AM. The familiar hum of the white noise machine is the only sound in the nursery. Amara stares at the ceiling, her body aching but her mind racing. \n\n> "I didn\'t expect the silence to be the loudest part," she whispers.',
      format: 'markdown',
    }),
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
      alt: 'Amara with her baby',
      caption: 'The quiet intensity of the first night.',
    }),
    createBlock('text', {
      content: '## The Choice\n\nAmara has a decision to make. She could wake her partner, or she could push through on her own. As a learner, you will see how these narrative beats reflect the modules we studied in "Parental Self-Care."',
      format: 'markdown',
    }),
    createBlock('callout', {
      type: 'quote',
      title: 'Voice of Experience',
      content: '"You can\'t pour from an empty cup. Sometimes, the bravest thing is asking for help."',
    }),
    createBlock('reflection', {
      prompt: 'Reflect on a time you felt silent pressure to "do it all."',
      questions: [
        'What was the external expectation?',
        'How did that impact your physical health?',
      ],
    }),
  ],
  components: [
    { type: 'text', label: 'Story Narrative', isRequired: true, order: 1 },
    { type: 'image', label: 'Emotional Visuals', isRequired: false, order: 2 },
    { type: 'reflection', label: 'Empathy Reflection', isRequired: false, order: 3 },
  ],
  capabilities: [
    { id: 'narrativeFlow', name: 'Narrative Logic', description: 'Story-driven content progression' },
    { id: 'emotionalEngagement', name: 'Empathy Bridge', description: 'Connect emotionally with learners' },
  ],
  defaultSettings,
  usageNotes: 'Use stories to create emotional connection and memorable learning.',
};

const caseStudyTemplate: LessonTemplate = {
  metadata: {
    id: 'case-study',
    name: 'Sleep Training: The Garcia Family',
    description: 'Analyze a real-world sleep intervention. Evaluate the environment, schedule, and temperament to recommend a sustainable solution.',
    category: 'storytelling',
    subcategory: 'analytical',
    difficulty: 'advanced',
    interactivityLevel: 'high',
    contentStyle: 'practical',
    estimatedTime: 40,
    tags: ['case-study', 'analysis', 'sleep-training', 'problem-solving'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Case Analysis: 4-Month Regression',
      fullWidth: false,
      background: { type: 'color', color: '#f8fafc' }
    }),
    createBlock('callout', {
      type: 'info',
      title: 'The Challenge',
      content: 'The Garcias have a 4.5-month-old who was previously sleeping 6-hour stretches. Now, she wakes every 45 minutes.',
    }),

    // Phase 2: Data Presentation
    createBlock('text', {
      content: '# The Nursery Audit\n**Temp:** 72°F | **Light:** Blackout Curtains | **Sound:** Loud White Noise\n**Bedtime:** 9:30 PM (Very late for this age).',
      format: 'markdown',
    }),
    createBlock('accordion', {
      items: [
        { title: 'Feeding Pattern', content: 'Last feeding is mid-sleep. This creates a strong "Suck-to-Sleep" association.' },
        { title: 'Overtiredness', content: 'The 9:30 PM bedtime means the baby is in a state of cortisol spikes by the time she hits the mattress.' },
      ],
    }),

    // Phase 3: Analytical Interaction
    createBlock('section', { title: 'Recommend a Solution', fullWidth: false }),
    createBlock('discussion', {
      prompt: 'Based on the facts, what is the single most important change the Garcias should make tonight?',
      placeholder: 'E.g., Move bedtime to 7:00 PM...',
    }),

    // Phase 4: Resolution
    createBlock('callout', {
      type: 'info',
      title: 'Expert Insight: Sleep Props',
      content: 'Separating feeding from sleep prevents "Sleep Props." If they fall asleep eating, they expect to eat every time they wake up.',
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'success',
      title: 'Case Resolved',
      content: 'By implementing a 7 PM bedtime and "Eat-Play-Sleep" routine, the Garcias saw 7-hour stretches in just 3 days.',
    }),
  ],
  components: [
    { type: 'discussion', label: 'Analysis', isRequired: true, order: 1 },
    { type: 'accordion', label: 'Data Panels', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'analyticalThinking', name: 'Root Cause Analysis', description: 'Identify underlying issues in infant care' },
  ],
  defaultSettings,
  usageNotes: 'Great for developing analytical skills in complex family dynamics.',
};

const personalStoryTemplate: LessonTemplate = {
  metadata: {
    id: 'personal-story',
    name: 'Resilience: Surviving PPD',
    description: 'A powerful testimonial from Sarah, a mother of three who navigated Postpartum Depression. Learn to identify the warning signs through her lived experience.',
    category: 'storytelling',
    subcategory: 'testimonial',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'narrative',
    estimatedTime: 30,
    tags: ['testimonial', 'PPD', 'mental-health', 'resilience', 'story'],
    featured: false,
    popular: false,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Hook
    createBlock('section', {
      title: 'Sarah\'s Story',
      fullWidth: false,
      background: { type: 'color', color: '#fff1f2' }
    }),
    createBlock('video', {
      src: 'https://www.google.com/search?q=postpartum+depression+testimonial+video',
      title: 'Interview: Finding the Light',
      description: 'Sarah discusses the moment she realized she needed professional support.',
    }),

    // Phase 2: Narrative Deepening
    createBlock('text', {
      content: '# The "Fog"\n\n"I thought I was failing as a mother. I didn\'t realize I was just ill. Knowing the difference saved my life."',
      format: 'markdown',
    }),
    createBlock('callout', {
      type: 'quote',
      title: 'A Moment of Truth',
      content: 'Sarah describes the turning point when her partner noticed she had stopped eating.',
    }),

    // Phase 3: Interactive Reflection
    createBlock('section', { title: 'Lessons in Empathy', fullWidth: false }),
    createBlock('reflection', {
      prompt: 'Identify the signs',
      questions: ['Which physical symptoms did Sarah mention?', 'What was her "inner dialogue" like?'],
    }),

    // Phase 4: Knowledge Check
    createBlock('knowledgeCheck', {
      question: 'Is PPD a result of parental choices?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Yes, it reflects a lack of bonding', correct: false },
        { id: 'b', text: 'No, it is a medical condition often tied to hormonal shifts', correct: true },
      ],
    }),

    // Phase 5: Resources
    createBlock('callout', {
      type: 'info',
      title: 'You Are Not Alone',
      content: 'If you relate to Sarah\'s story, help is available. Text 988 (in the US) or contact your local doula network.',
    }),
  ],
  components: [
    { type: 'video', label: 'Sarah\'s Story', isRequired: true, order: 1 },
    { type: 'reflection', label: 'Empathy Audit', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'emotionalStorytelling', name: 'Lived Experience', description: 'Testimonials that build deep empathy' },
  ],
  defaultSettings,
  usageNotes: 'Use for testimonials and building supportive communities.',
};

// ============================================
// 7. PRACTICE & ACTIVITY TEMPLATES
// ============================================

const exerciseTemplate: LessonTemplate = {
  metadata: {
    id: 'exercise',
    name: 'Your Postpartum Care Plan',
    description: 'Design a comprehensive support system for your first 40 days. From meal trains to boundary setting, build your roadmap to a peaceful recovery.',
    category: 'practice',
    subcategory: 'exercise',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'practical',
    estimatedTime: 50,
    tags: ['exercise', 'planning', 'postpartum', 'care-plan', 'submission'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Project: The 40-Day Sanctuary',
      fullWidth: false,
      background: { type: 'color', color: '#f0fdf4' }
    }),
    // Phase 2: Instruction
    createBlock('accordion', {
      items: [
        { title: 'The Meal Train', content: 'Designate one person to coordinate food. Be specific about allergies and delivery times.' },
        { title: 'Sleep Shifts', content: 'Identify a 4-hour window where you are guaranteed undisturbed sleep.' },
      ],
    }),

    // Phase 3: The Exercise
    createBlock('section', { title: 'Builder: Your Support Squad', fullWidth: false }),
    createBlock('exercise', {
      title: 'Support Network Mapping',
      instructions: 'Identify 3 people for these roles: 1. The Listener (Emotional), 2. The Doer (Meals/Laundry), 3. The Expert (Lactation/Medical).',
    }),

    // Phase 4: Submission
    createBlock('section', { title: 'Commitment', fullWidth: false }),
    createBlock('text', {
      content: '### Final Step\nSubmit your draft below for feedback from our Doula team.',
      format: 'markdown',
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'success',
      title: 'Plan Drafted',
      content: 'Consistency is key. Share this with your partner tonight.',
    }),
  ],
  components: [
    { type: 'exercise', label: 'Care Plan Builder', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'assignmentSubmission', name: 'Portfolio Building', description: 'Create and submit reusable life plans' },
    { id: 'feedback', name: 'Doula Mentorship', description: 'Direct feedback from subject matter experts' },
  ],
  defaultSettings,
  usageNotes: 'Excellent for high-touch courses where personalized feedback is a core value proposition.',
};

const reflectionTemplate: LessonTemplate = {
  metadata: {
    id: 'reflection',
    name: 'Postpartum Reflection Journal',
    description: 'A guided journaling experience to help you process the emotional transition into motherhood. Private prompts for deep self-assessment.',
    category: 'practice',
    subcategory: 'reflection',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'practical',
    estimatedTime: 20,
    tags: ['reflection', 'journaling', 'mental-health', 'self-care', 'emotional'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Journal: The First 48 Hours',
      fullWidth: false,
      background: { type: 'color', color: '#fdf4ff' }
    }),
    createBlock('text', {
      content: '## Processing the Transition\n\nReflection isn\'t just about memory; it\'s about integration. Take 10 minutes to answer these prompts as honestly as possible.',
      format: 'markdown',
    }),
    createBlock('reflection', {
      prompt: 'Reflect on your birth and home-arrival journey',
      questions: [
        'What was the one moment where you felt most capable?',
        'Where do you feel you need the most grace for yourself right now?',
        'What is one physical sensation you want to remember about this week?',
        'Who has been your most unexpected source of support?',
      ],
      minWords: 30,
      requireCompletion: true,
    }),
    createBlock('text', {
      content: '## Safe Space\n\nYour responses are private to your journal and are not shared with the community. This is your space to be raw.',
      format: 'markdown',
    }),
  ],
  components: [
    { type: 'reflection', label: 'Journal Prompts', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'reflectionJournaling', name: 'Private Journaling', description: 'Guided reflection with word-count validation' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'Best used at the end of emotionally heavy modules to encourage processing.',
};

const workbookTemplate: LessonTemplate = {
  metadata: {
    id: 'workbook',
    name: 'Newborn Essentials Checklist',
    description: 'A comprehensive, interactive workbook to help you audit your nursery and gear. Ensure you have the essentials without the clutter.',
    category: 'practice',
    subcategory: 'workbook',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'practical',
    estimatedTime: 45,
    tags: ['workbook', 'checklist', 'newborn-gear', 'organization'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Audit: The Minimalist Nursery',
      fullWidth: false,
      background: { type: 'color', color: '#fafaf9' }
    }),
    createBlock('text', {
      content: '# What you really need\n\nMarketing often suggests you need 500 gadgets. In reality, a newborn\'s needs are simple: Safety, Food, and Warmth.',
      format: 'markdown',
    }),

    // Phase 2: Active Checklist
    createBlock('checklist', {
      title: 'Primary Essentials',
      items: [
        { id: 'i1', label: 'Safety-certified crib or bassinet', completed: false },
        { id: 'i2', label: 'Firm, flat sleep surface', completed: false },
        { id: 'i3', label: '6-8 sleepers/onesies', completed: false },
      ],
    }),

    // Phase 3: Qualitative Interaction
    createBlock('section', { title: 'Safe or Risk?', fullWidth: false }),
    createBlock('sorting', {
      instructions: 'Sort these items based on AAP safety guidelines.',
      items: [
        { id: 's1', text: 'Loose Blanket', category: 'Risk', order: 1 },
        { id: 's2', text: 'Breathable Mesh', category: 'Safe', order: 2 },
      ],
    }),

    // Phase 4: Practical Exercise
    createBlock('exercise', {
      title: 'Space Planning',
      instructions: 'Measure the distance from your bed to the baby\'s sleep space. It should be within arms reach for the first 6 months.',
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'success',
      title: 'Audit Complete',
      content: 'You are now prepared with the biological basics.',
    }),
  ],
  components: [
    { type: 'checklist', label: 'Primary Audit', isRequired: true, order: 1 },
    { type: 'sorting', label: 'Safety Sort', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'workbookIntegration', name: 'Interactive Checklist', description: 'Structured audit of physical equipment' },
  ],
  defaultSettings,
  usageNotes: 'Excellent for logistical planning and physical equipment preparation.',
};

// ============================================
// 8. RESOURCE TEMPLATES
// ============================================

const resourceLibraryTemplate: LessonTemplate = {
  metadata: {
    id: 'resource-library',
    name: 'Postpartum Resource Hub',
    description: 'A curated collection of medical guides, video tutorials, and emergency contacts. Your one-stop shop for reliable information.',
    category: 'resource',
    subcategory: 'library',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'reference',
    estimatedTime: 30,
    tags: ['resources', 'downloads', 'library', 'materials', 'emergency'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Digital Resource Library',
      fullWidth: false,
      background: { type: 'color', color: '#f1f5f9' }
    }),
    createBlock('text', {
      content: '# Verified Knowledge\n\nThe internet is full of "advice." This library contains only medically verified guides from our IBCLC and Pediatric advisors.',
      format: 'markdown',
    }),

    // Phase 2: High-Value Downloads
    createBlock('resource', {
      title: 'Infant First Aid Cheat Sheet',
      description: 'Step-by-step CPR and choking recovery for newborns.',
      type: 'pdf',
      url: 'https://example.com/cpr-guide.pdf',
    }),
    createBlock('resource', {
      title: 'Warning Signs (The RED List)',
      description: 'When to call your doctor vs. when to go to the ER.',
      type: 'pdf',
      url: 'https://example.com/warning-signs.pdf',
    }),

    // Phase 3: Interactive Deep Dive
    createBlock('section', { title: 'Glossary of Recovery', fullWidth: false }),
    createBlock('accordion', {
      items: [
        { title: 'Lochia', content: 'Normal postpartum bleeding. Should decrease in volume over 6 weeks.' },
        { title: 'Engorgement', content: 'Breast fullness as milk "comes in" (usually Day 3-5).' },
      ],
    }),

    // Phase 4: Practical Interaction
    createBlock('knowledgeCheck', {
      question: 'Where should you keep your "RED List" of warning signs for easiest access?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'In a filed folder', correct: false },
        { id: 'b', text: 'Printed on the refrigerator or saved to favorites', correct: true },
        { id: 'c', text: 'In the baby\'s diaper bag', correct: false },
      ],
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'info',
      title: 'Need a Specialist?',
      content: 'Access our referral network below to find local help.',
    }),
  ],
  components: [
    { type: 'resource', label: 'Primary Library', isRequired: true, order: 1 },
    { type: 'accordion', label: 'Medical Glossary', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'resourceManagement', name: 'Centralized Assets', description: 'Organized collection of high-value materials' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: false,
  },
  usageNotes: 'Perfect for providing supplementary materials and safety guides.',
};

const toolkitTemplate: LessonTemplate = {
  metadata: {
    id: 'toolkit',
    name: 'Mother\'s Recovery Toolkit',
    description: 'Essential digital tools for the fourth trimester. Includes feeding trackers, mood logs, and healing supply lists.',
    category: 'resource',
    subcategory: 'toolkit',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'reference',
    estimatedTime: 40,
    tags: ['toolkit', 'tools', 'practical', 'guides', 'postpartum'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Intro
    createBlock('section', {
      title: 'Your Fourth Trimester Toolkit',
      fullWidth: false,
      background: { type: 'color', color: '#111827' }
    }),
    createBlock('text', {
      content: '# The Essential Gear\n\nThese tools move you from "reacting" to "proactive care." Download the set below to start organizing your first 2 weeks.',
      format: 'markdown',
    }),

    // Phase 2: Active Tools
    createBlock('resource', {
      title: 'Feeding & Diaper Log',
      description: 'Printable template for tracking daily rhythms.',
      type: 'pdf',
      url: 'https://example.com/tracker.pdf',
    }),
    createBlock('resource', {
      title: 'The Visitor Policy Template',
      description: 'A polite text template for setting boundaries with family.',
      type: 'pdf',
      url: 'https://example.com/visitor-policy.pdf',
    }),

    // Phase 3: Qualitative Drill
    createBlock('section', { title: 'Strategy: Delegating Tasks', fullWidth: false }),
    createBlock('text', {
      content: '### The "Wait and Watch" Rule\nWhen visitors ask how to help, point them to your "Task Board" rather than doing the work yourself.',
      format: 'markdown',
    }),

    // Phase 4: Interaction
    createBlock('knowledgeCheck', {
      question: 'Which of these is a CORE recovery tool for the first week?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'A baby gym', correct: false },
        { id: 'b', text: 'Hydration tracker and meal train', correct: true },
        { id: 'c', text: 'Complex educational toys', correct: false },
      ],
    }),

    // Phase 5: Final Callout
    createBlock('callout', {
      type: 'success',
      title: 'Ready for Home',
      content: 'You have the tools; now give yourself the grace to use them.',
    }),
  ],
  components: [
    { type: 'resource', label: 'Toolbox items', isRequired: true, order: 1 },
    { type: 'knowledgeCheck', label: 'Strategy Check', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'resourceManagement', name: 'Digital Toolkit', description: 'Practical lifestyle tools' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: false,
  },
  usageNotes: 'Designed for quick retrieval and practical daily application.',
};

const checklistTemplate: LessonTemplate = {
  metadata: {
    id: 'checklist',
    name: 'Checklist Template',
    description: 'Interactive checklist with progress tracking.',
    category: 'resource',
    subcategory: 'checklist',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'reference',
    estimatedTime: 10,
    tags: ['checklist', 'progress', 'tracking', 'interactive'],
    featured: false,
    popular: true,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  blocks: [
    createBlock('section', { title: 'Interactive Checklist', fullWidth: false }),
    createBlock('text', {
      content: '## Your Checklist\n\nCheck off each item as you complete it.',
      format: 'markdown',
    }),
    createBlock('checklist', {
      title: 'Task List',
      items: [
        { id: 'item-1', text: 'Complete task 1', completed: false, required: true },
        { id: 'item-2', text: 'Complete task 2', completed: false, required: true },
        { id: 'item-3', text: 'Complete task 3', completed: false, required: true },
        { id: 'item-4', text: 'Complete task 4', completed: false, required: false },
        { id: 'item-5', text: 'Complete task 5', completed: false, required: false },
      ],
      showProgress: true,
      requireAll: false,
    }),
    createBlock('text', {
      content: '## Great Job!\n\nYou\'ve completed the checklist.',
      format: 'markdown',
    }),
  ],
  components: [
    { type: 'checklist', label: 'Interactive Checklist', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'checklistProgress', name: 'Checklist Progress', description: 'Interactive checklist with tracking' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'Great for task tracking and progress monitoring.',
};

// ============================================
// 9. MICROLEARNING TEMPLATES
// ============================================

const infographicLearningTemplate: LessonTemplate = {
  metadata: {
    id: 'infographic-learning',
    name: 'Breastmilk Composition: The Liquid Gold Infographic',
    description: 'A visually rich infographic breaking down the complex nutrients, antibodies, and stem cells found in breastmilk.',
    category: 'visual',
    subcategory: 'infographic',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'instructional',
    estimatedTime: 30,
    tags: ['breastmilk', 'nutrition', 'biology', 'infographic', 'visual'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Nutrition at a Glance',
      fullWidth: false,
      background: { type: 'color', color: '#f0fdf4' }
    }),
    createBlock('text', {
      content: '# Why it matters\n\nBreastmilk is living tissue. It contains billions of cells that help your baby build their immune system from scratch.',
      format: 'markdown',
    }),

    // Phase 2: Visual Core
    createBlock('image', {
      src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop',
      alt: 'Macro view of milk',
      caption: 'The biological complexity of "Liquid Gold."',
    }),

    // Phase 3: Data Breakdown
    createBlock('section', { title: 'The Components', fullWidth: false }),
    createBlock('grid', {
      columns: 2,
      children: [],
    }),
    createBlock('callout', {
      type: 'info',
      title: '88% Water',
      content: 'Ensures baby stays hydrated even in hot climates.',
    }),
    createBlock('callout', {
      type: 'success',
      title: 'IgA Antibodies',
      content: 'Coat the baby\'s gut to prevent infections.',
    }),

    // Phase 4: Practice
    createBlock('knowledgeCheck', {
      question: 'True or False: Breastmilk composition changes throughout a single feeding (Fore-milk to Hind-milk).',
      type: 'multiple-choice',
      options: [
        { id: '1', text: 'True', correct: true },
        { id: '2', text: 'False', correct: false },
      ],
    }),

    // Phase 5: Conclusion
    createBlock('badge', {
      name: 'Nutrition Guru',
      description: 'Mastered Breastmilk Composition',
      icon: '🥛',
      earned: false,
    }),
  ],
  components: [
    { type: 'image', label: 'Infographic Base', isRequired: true, order: 1 },
    { type: 'grid', label: 'Data Panels', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'visualSynthesis', name: 'Information Design', description: 'Condenses complex data into visual chunks' },
  ],
  defaultSettings,
  usageNotes: 'Best for complex nutritional or technical data summaries.',
};

const quickTipTemplate: LessonTemplate = {
  metadata: {
    id: 'quick-tip',
    name: 'Quick Tip: The 5-Minute Reset',
    description: 'A bite-sized lesson on emotional regulation for parents. Learn the "Box Breathing" technique in under 3 minutes.',
    category: 'microlearning',
    subcategory: 'tip',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'instructional',
    estimatedTime: 10,
    tags: ['quick', 'tip', 'micro', 'breathing', 'self-care'],
    featured: true,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'Micro-Reset',
      fullWidth: false,
      background: { type: 'color', color: '#ecfdf5' }
    }),
    createBlock('text', {
      content: '# Why We Reset\n\nWhen the baby\'s crying hits a certain pitch, your brain enters "Fight or Flight." A micro-reset pulls you back into "Rest and Digest."',
      format: 'markdown',
    }),

    // Phase 2: The Tip
    createBlock('callout', {
      type: 'tip',
      title: 'The Box Breathing Hack',
      content: 'Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 3 times.',
    }),

    // Phase 3: Qualitative Interaction
    createBlock('reflection', {
      prompt: 'Do a quick scan. Where in your body are you holding tension right now?',
      questions: ['Is it your jaw?', 'Is it your shoulders?'],
    }),

    // Phase 4: Verification
    createBlock('knowledgeCheck', {
      question: 'Which nervous system state does box breathing activate?',
      type: 'multiple-choice',
      options: [
        { id: '1', text: 'Sympathetic (Fight)', correct: false },
        { id: '2', text: 'Parasympathetic (Rest)', correct: true },
      ],
    }),

    // Phase 5: Conclusion
    createBlock('callout', {
      type: 'success',
      title: 'Action Item',
      content: 'Save this tip. It takes 1 minute and can change your whole afternoon.',
    }),
  ],
  components: [
    { type: 'callout', label: 'Instructional Core', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'microLearning', name: 'Rapid Skill Acquisition', description: 'Actionable content delivered in under 5 minutes' },
  ],
  defaultSettings,
  usageNotes: 'Perfect for daily "nuggets" of wisdom.',
};

const flashcardTemplate: LessonTemplate = {
  metadata: {
    id: 'flashcard',
    name: 'Infant Cues Flashcards',
    description: 'Master the silent language of your newborn. Learn to distinguish between "I\'m hungry," "I\'m tired," and "I\'m overstimulated."',
    category: 'microlearning',
    subcategory: 'flashcard',
    difficulty: 'beginner',
    interactivityLevel: 'high',
    contentStyle: 'instructional',
    estimatedTime: 20,
    tags: ['flashcard', 'review', 'infant-cues', 'communication'],
    featured: false,
    popular: true,
    version: '1.1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    // Phase 1: Context
    createBlock('section', {
      title: 'The Language of Cues',
      fullWidth: false,
      background: { type: 'color', color: '#fffbeb' }
    }),
    createBlock('text', {
      content: '# Translating the Baby\n\nBefore babies cry, they "speak" with their bodies. Mastering these cues means less crying for them and less stress for you.',
      format: 'markdown',
    }),

    // Phase 2: Active Recall
    createBlock('flipCard', {
      frontContent: 'Rooting & Sucking on Hands',
      backContent: 'Hunger Cue: "I\'m ready to eat! Don\'t wait for the cry."',
    }),
    createBlock('flipCard', {
      frontContent: 'Arching Back & Turning Away',
      backContent: 'Overstimulation: "I need a break from the noise/lights."',
    }),

    // Phase 3: Qualitative Drill (Scenario Integration)
    createBlock('section', { title: 'Practice Observation', fullWidth: false }),
    createBlock('scenario', {
      title: 'The Mid-Visit Melt',
      content: 'You\'re at a relative\'s house. Baby is arching their back and looking away from Grandma.',
      branches: [
        { text: 'Keep passing baby around', feedback: 'Risk of full meltdown.', nextBlockId: 'fail' },
        { text: 'Quietly take baby to a dark room', feedback: 'Correct! Recognizing the "Overstimulated" cue.', isCorrect: true },
      ],
    }),

    // Phase 4: Assessment
    createBlock('knowledgeCheck', {
      question: 'Is "Crying" an early or late hunger cue?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Early - First sign', correct: false },
        { id: 'b', text: 'Late - A sign of distress', correct: true },
      ],
    }),

    // Phase 5: Closing
    createBlock('callout', {
      type: 'info',
      title: 'Observation Badge',
      content: 'You\'ve unlocked the "Baby Whisperer" status. Keep observing!',
    }),
  ],
  components: [
    { type: 'flipCard', label: 'Flashcard Set', isRequired: true, order: 1 },
    { type: 'scenario', label: 'Observation Practice', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'cardFlipping', name: 'Active Recall', description: 'Flippable cards for rapid terminology mastery' },
  ],
  defaultSettings,
  usageNotes: 'Great for observational skill building.',
};

const dailyChallengeTemplate: LessonTemplate = {
  metadata: {
    id: 'daily-challenge',
    name: 'Day 1: The Hydration Goal',
    description: 'Start your healing journey with a simple, achievable task. Small wins build the foundation for long-term health.',
    category: 'microlearning',
    subcategory: 'challenge',
    difficulty: 'beginner',
    interactivityLevel: 'medium',
    contentStyle: 'practical',
    estimatedTime: 5,
    tags: ['daily', 'challenge', 'streak', 'habit', 'hydration'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Daily Challenge: Fuel Your Recovery',
      fullWidth: false,
      background: { type: 'color', color: '#eff6ff' }
    }),
    createBlock('callout', {
      type: 'info',
      title: '🔥 Start Your Streak',
      content: 'Complete today\'s challenge to unlock your "Early Bird" badge!',
    }),
    createBlock('text', {
      content: '## Today\'s Goal\n\nDrink 80oz of water today. Proper hydration is critical for tissue repair and milk supply (if breastfeeding).',
      format: 'markdown',
    }),
    createBlock('knowledgeCheck', {
      question: 'Did you hit your 80oz goal today?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Yes, Goal Smashed!', correct: true },
        { id: 'b', text: 'Almost (Over 50oz)', correct: false },
        { id: 'c', text: 'Not yet, but I\'m catching up now!', correct: false },
      ],
      feedback: {
        correct: '🎉 Challenge completed! Your streak is now 1 Day. See you tomorrow!',
        incorrect: 'No worries! Take a big sip now and mark this complete once you\'re there.',
      },
    }),
    createBlock('badge', {
      name: 'Hydration Hero',
      description: 'Completed the first hydration challenge',
      icon: '💧',
      earned: false,
    }),
  ],
  components: [
    { type: 'knowledgeCheck', label: 'Goal Validation', isRequired: true, order: 1 },
    { type: 'badge', label: 'Badge Reward', isRequired: false, order: 2 },
  ],
  capabilities: [
    { id: 'streakTracking', name: 'Habit Formation', description: 'Incentivize daily engagement through streaks' },
    { id: 'dailyEngagement', name: 'Gamified Micro-Goals', description: 'Transform small tasks into learning victories' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'Perfect for building sustainable habits and keeping learners coming back daily.',
};

// ============================================
// 10. ADVANCED LEARNING TEMPLATES
// ============================================

const adaptiveLearningTemplate: LessonTemplate = {
  metadata: {
    id: 'adaptive-learning',
    name: 'Personalized Postpartum Path',
    description: 'A dynamic lesson that adapts its content based on your birth experience and current support level. Get the information you need most, exactly when you need it.',
    category: 'advanced',
    subcategory: 'adaptive',
    difficulty: 'advanced',
    interactivityLevel: 'high',
    contentStyle: 'exploratory',
    estimatedTime: 30,
    tags: ['adaptive', 'personalized', 'AI-driven', 'dynamic', 'postpartum'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Adaptive Learning Experience',
      fullWidth: false,
      background: { type: 'color', color: '#111827' }
    }),
    createBlock('text', {
      content: '## Tailoring Your Journey\n\nThis lesson uses specialized branching logic to bypass irrelevant information and focus on your specific recovery needs.',
      format: 'markdown',
    }),
    createBlock('knowledgeCheck', {
      question: 'To customize your path, how would you describe your current support system?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'I have a full-time partner/family support', correct: false, adaptivePath: 'supported' },
        { id: 'b', text: 'I am primary caregiver with limited help', correct: false, adaptivePath: 'solo-priority' },
        { id: 'c', text: 'I am navigating this largely on my own', correct: false, adaptivePath: 'max-efficiency' },
      ],
      feedback: {
        correct: 'Thank you. We\'ve adjusted the following modules to match your energy levels and available resources.',
        incorrect: 'Let\'s find the right path for you.',
      },
    }),
    createBlock('scenario', {
      title: 'Strategy Shift',
      description: 'Based on your response, here is your optimized care plan...',
      branches: [
        {
          id: 'supported',
          label: 'Delegation Mastery',
          outcome: 'Focus on managing your team and protecting your "Baby Moon."',
          nextBlockId: 'supported-content',
        },
        {
          id: 'solo-priority',
          label: 'High-Efficiency Recovery',
          outcome: 'Focus on "Cluster Tasking" and essential self-care only.',
          nextBlockId: 'solo-content',
        },
        {
          id: 'max-efficiency',
          label: 'The Essentialist Path',
          outcome: 'Strict focus on safety, hydration, and radical rest.',
          nextBlockId: 'essential-content',
        },
      ],
    }),
  ],
  components: [
    { type: 'knowledgeCheck', label: 'Diagnostic Assessment', isRequired: true, order: 1 },
    { type: 'scenario', label: 'Branching Logic', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'conditionalLogic', name: 'Adaptive Branching', description: 'Real-time content adaptation based on learner diagnostics' },
    { id: 'personalization', name: 'Profile Personalization', description: 'Automated path generation for diverse user needs' },
  ],
  defaultSettings,
  usageNotes: 'Best for complex topics where learners have vastly different backgrounds or constraints.',
};

const gamifiedTemplate: LessonTemplate = {
  metadata: {
    id: 'gamified',
    name: 'The Omugwo Quest: Level 1',
    description: 'Turn your learning into a journey. Earn XP, unlock badges, and track your progress as you master the art of postpartum care.',
    category: 'advanced',
    subcategory: 'gamified',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'exploratory',
    estimatedTime: 20,
    tags: ['gamification', 'XP', 'badges', 'leveling', 'engagement'],
    featured: true,
    popular: true,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Quest: The Sleep Cycle Challenge',
      fullWidth: true,
      background: { type: 'color', color: '#1e1b4b' }
    }),
    createBlock('callout', {
      type: 'success',
      title: '🎮 New Quest Available',
      content: 'Identify correctly the 4 stages of infant sleep to earn 100 XP and the "Dream Weaver" badge!',
    }),
    createBlock('progress', {
      current: 25,
      total: 100,
      label: 'Rank: Junior Caretaker',
      showPercentage: true,
    }),
    createBlock('knowledgeCheck', {
      question: 'Which stage of sleep is responsible for the most brain development in newborns?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'Deep Sleep (Stage 4)', correct: false },
        { id: 'b', text: 'REM Sleep (Active Sleep)', correct: true },
        { id: 'c', text: 'Light Sleep', correct: false },
      ],
      points: 50,
      feedback: {
        correct: '🎉 +50 XP! You correctly identified REM sleep as the engine of cognitive growth.',
        incorrect: 'Try again! Hint: It\'s the stage where they sometimes twitch or make faces.',
      },
    }),
    createBlock('badge', {
      name: 'Sleep Scholar',
      description: 'Mastered the fundamentals of infant sleep rhythms.',
      icon: '🌙',
      earned: false,
    }),
  ],
  components: [
    { type: 'progress', label: 'XP Tracker', isRequired: true, order: 1 },
    { type: 'knowledgeCheck', label: 'Quest Tasks', isRequired: true, order: 2 },
    { type: 'badge', label: 'Rewards', isRequired: false, order: 3 },
  ],
  capabilities: [
    { id: 'gamification', name: 'XP & Rewards Engine', description: 'Points-based progression with badge unlocking' },
    { id: 'progressTracking', name: 'Visual Hierarchy', description: 'Dynamic progress bars for multi-stage tasks' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'High-engagement template for non-traditional learning paths and building community leaderboards.',
};

const workshopTemplate: LessonTemplate = {
  metadata: {
    id: 'workshop',
    name: 'Hospital Bag Workshop',
    description: 'A comprehensive, deep-dive session walking you through exactly what to pack for labor, delivery, and your first 24 hours postpartum.',
    category: 'advanced',
    subcategory: 'workshop',
    difficulty: 'advanced',
    interactivityLevel: 'high',
    contentStyle: 'practical',
    estimatedTime: 90,
    tags: ['workshop', 'comprehensive', 'interactive', 'hospital-bag', 'packing'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Full Session: The Ultimate Packing Guide',
      fullWidth: true,
      background: { type: 'color', color: '#f8fafc' }
    }),
    createBlock('video', {
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: 'Workshop Stream: Part 1',
      description: 'Join our head doula as she unboxes the essential hospital bag.',
      showTranscript: true,
    }),
    createBlock('accordion', {
      items: [
        { title: 'For Mom: Comfort & Recovery', content: 'Loose pajamas, nursing bras, nipple cream, and high-waisted underwear.' },
        { title: 'For Baby: The First Outfit', content: '2-3 onesies, a warm hat, and a safety-certified car seat.' },
        { title: 'For Partner: Survival Gear', content: 'Chargers, snacks, change of clothes, and the birth plan.' },
      ],
      allowMultiple: true,
    }),
    createBlock('discussion', {
      prompt: 'What is one "comfort item" from home you absolutely must have in your bag?',
      placeholder: 'E.g., Your own pillow, a specific playlist, a favorite robe...',
    }),
    createBlock('exercise', {
      title: 'Packing Audit',
      instructions: 'Upload a photo of your packed bag for a virtual spot-check by our team.',
      timeLimit: 30,
    }),
  ],
  components: [
    { type: 'video', label: 'Workshop Video', isRequired: true, order: 1 },
    { type: 'accordion', label: 'Itemized Lists', isRequired: true, order: 2 },
    { type: 'discussion', label: 'Community Sharing', isRequired: true, order: 3 },
  ],
  capabilities: [
    { id: 'workshopFormat', name: 'Comprehensive Deep-Dive', description: 'Multi-stage workshop with video, analysis, and hands-on tasks' },
    { id: 'collaboration', name: 'Social Learning', description: 'Integrated discussion for community-based wisdom' },
  ],
  defaultSettings: {
    ...defaultSettings,
    enableDiscussion: true,
    requireCompletion: true,
  },
  usageNotes: 'Designed for high-value sessions where learners expect deep technical or logistical mastery.',
};

const glossaryTemplate: LessonTemplate = {
  metadata: {
    id: 'glossary',
    name: 'Newborn Care Glossary',
    description: 'A searchable A-Z database of clinical and community terms, from "Apgar" to "Witching Hour." Perfect for new parents navigating medical jargon.',
    category: 'resource',
    subcategory: 'glossary',
    difficulty: 'beginner',
    interactivityLevel: 'low',
    contentStyle: 'reference',
    estimatedTime: 15,
    tags: ['glossary', 'terminology', 'medical-jargon', 'definitions', 'reference'],
    featured: false,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Term Index: Newborn Care',
      fullWidth: false,
      background: { type: 'color', color: '#f8fafc' }
    }),
    createBlock('text', {
      content: '## Jargon-Buster\n\nUse this glossary to quickly look up terms used during pediatric visits or in our community discussions.',
      format: 'markdown',
    }),
    createBlock('accordion', {
      items: [
        { title: 'Apgar Score', content: 'A quick test performed on a baby at 1 and 5 minutes after birth to determine physical health.' },
        { title: 'Colostrum', content: 'The first "liquid gold" milk produced by mothers, high in antibodies and protein.' },
        { title: 'Latching', content: 'How the baby attaches to the breast for feeding. A "deep latch" is key for pain-free feeding.' },
        { title: 'Meconium', content: 'The first stool of an infant, which is thick, sticky, and dark green/black.' },
        { title: 'Witching Hour', content: 'A period of increased fussiness occurring in the late afternoon or evening.' },
      ],
      allowMultiple: true,
    }),
  ],
  components: [
    { type: 'accordion', label: 'Term List', isRequired: true, order: 1 },
  ],
  capabilities: [
    { id: 'terminologyMastery', name: 'Reference Search', description: 'Quick-access lookup for technical terminology' },
  ],
  defaultSettings,
  usageNotes: 'Excellent as a supplemental lesson or a standalone reference tool.',
};

const simulationSandboxTemplate: LessonTemplate = {
  metadata: {
    id: 'simulation-sandbox',
    name: 'Diapering & Dressing Simulator',
    description: 'A hands-on virtual sandbox where you practice the sequence of newborn care tasks. Experiment with different clothing layers for various temperatures.',
    category: 'advanced',
    subcategory: 'simulation',
    difficulty: 'intermediate',
    interactivityLevel: 'high',
    contentStyle: 'exploratory',
    estimatedTime: 25,
    tags: ['simulation', 'sandbox', 'hands-on', 'interactive', 'practice'],
    featured: true,
    popular: false,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop',
  },
  blocks: [
    createBlock('section', {
      title: 'Sandbox: Dressing for Sleep',
      fullWidth: true,
      background: { type: 'color', color: '#0f172a' }
    }),
    createBlock('text', {
      content: '## The Goldilocks Challenge\n\nBaby shouldn\'t be too hot or too cold. Drag and drop layers onto the avatar based on the room temperature.',
      format: 'markdown',
    }),
    createBlock('grid', {
      columns: 3,
      gap: 'large',
      children: [],
    }),
    createBlock('process', {
      title: 'Diaper Change Sequence',
      steps: [
        { id: 'step-1', title: 'Prepare Station', content: 'Gather wipe, diaper, and cream.', duration: 30 },
        { id: 'step-2', title: 'The Cleanse', content: 'Wipe front to back gently.', duration: 45 },
        { id: 'step-3', title: 'The Shield', content: 'Apply barrier cream if needed.', duration: 20 },
        { id: 'step-4', title: 'Securing', content: 'Ensure the diaper is snug but not tight.', duration: 30 },
      ],
    }),
    createBlock('reflection', {
      prompt: 'Reflect on your simulator experience',
      questions: [
        'Which clothing layer was most surprising for a 68°F room?',
        'How did the timer affect your focus during the diaper change?',
      ],
    }),
  ],
  components: [
    { type: 'grid', label: 'Sandbox Area', isRequired: true, order: 1 },
    { type: 'process', label: 'Task Sequence', isRequired: true, order: 2 },
  ],
  capabilities: [
    { id: 'exploratoryLearning', name: 'Sandbox Simulation', description: 'Low-stakes environment for procedural practice' },
    { id: 'proceduralFluency', name: 'Task Sequencing', description: 'Mastering multi-step physical care routines' },
  ],
  defaultSettings: {
    ...defaultSettings,
    requireCompletion: true,
  },
  usageNotes: 'Ideal for teaching physical skills where order and environmental factors matter.',
};

// ============================================
// TEMPLATE REGISTRY
// ============================================

export const LESSON_TEMPLATES: Record<string, LessonTemplate> = {
  // 1. Standard Lessons
  'video-lesson': videoLessonTemplate,
  'text-lesson': textBasedLessonTemplate,
  'slide-lesson': slideBasedLessonTemplate,

  // 2. Interactive Knowledge
  'accordion-learning': accordionLearningTemplate,
  'tabbed-learning': tabbedLearningTemplate,
  'interactive-cards': interactiveCardsTemplate,

  // 3. Assessments
  'knowledge-check': knowledgeCheckTemplate,
  'end-lesson-quiz': endOfLessonQuizTemplate,
  'certification-exam': certificationExamTemplate,

  // 4. Scenario-Based
  'choose-your-path': chooseYourPathTemplate,
  'roleplay-simulation': roleplaySimulationTemplate,
  'ethical-dilemma': ethicalDilemmaTemplate,

  // 5. Visual Learning
  'interactive-hotspot': interactiveHotspotTemplate,
  'process-flow': processFlowTemplate,
  'timeline-learning': timelineLearningTemplate,

  // 6. Storytelling
  'story-lesson': storyLessonTemplate,
  'case-study': caseStudyTemplate,
  'personal-story': personalStoryTemplate,

  // 7. Practice & Activities
  'exercise': exerciseTemplate,
  'reflection': reflectionTemplate,
  'workbook': workbookTemplate,

  // 8. Resources
  'resource-library': resourceLibraryTemplate,
  'toolkit': toolkitTemplate,
  'glossary': glossaryTemplate,
  'checklist': checklistTemplate,

  // 9. Microlearning
  'quick-tip': quickTipTemplate,
  'flashcard': flashcardTemplate,
  'daily-challenge': dailyChallengeTemplate,

  // 10. Advanced
  'adaptive-learning': adaptiveLearningTemplate,
  'gamified': gamifiedTemplate,
  'simulation-sandbox': simulationSandboxTemplate,
  'workshop': workshopTemplate,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getTemplatesByCategory = (category: TemplateCategory): LessonTemplate[] => {
  return Object.values(LESSON_TEMPLATES).filter(
    (template) => template.metadata.category === category
  );
};

export const getTemplate = (id: string): LessonTemplate | undefined => {
  return LESSON_TEMPLATES[id];
};

export const getFeaturedTemplates = (): LessonTemplate[] => {
  return Object.values(LESSON_TEMPLATES).filter(
    (template) => template.metadata.featured
  );
};

export const getPopularTemplates = (): LessonTemplate[] => {
  return Object.values(LESSON_TEMPLATES).filter(
    (template) => template.metadata.popular
  );
};

export const searchTemplates = (query: string): LessonTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(LESSON_TEMPLATES).filter(
    (template) =>
      template.metadata.name.toLowerCase().includes(lowerQuery) ||
      template.metadata.description.toLowerCase().includes(lowerQuery) ||
      template.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const filterTemplates = (filters: {
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  interactivityLevel?: InteractivityLevel;
  contentStyle?: ContentStyle;
  maxTime?: number;
}): LessonTemplate[] => {
  return Object.values(LESSON_TEMPLATES).filter((template) => {
    if (filters.category && template.metadata.category !== filters.category) return false;
    if (filters.difficulty && template.metadata.difficulty !== filters.difficulty) return false;
    if (filters.interactivityLevel && template.metadata.interactivityLevel !== filters.interactivityLevel) return false;
    if (filters.contentStyle && template.metadata.contentStyle !== filters.contentStyle) return false;
    if (filters.maxTime && template.metadata.estimatedTime > filters.maxTime) return false;
    return true;
  });
};

export const createLessonFromTemplate = (
  templateId: string,
  customizations?: {
    title?: string;
    description?: string;
    blockOverrides?: Partial<LessonBlock>[];
  }
): { blocks: LessonBlock[]; settings: TemplateSettings } => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Clone blocks with new IDs
  const blocks = template.blocks.map((block, index) => ({
    ...block,
    id: customizations?.blockOverrides?.[index]?.id || generateTemplateId(),
    props: {
      ...block.props,
      ...customizations?.blockOverrides?.[index]?.props,
    },
  }));

  return {
    blocks,
    settings: template.defaultSettings,
  };
};
