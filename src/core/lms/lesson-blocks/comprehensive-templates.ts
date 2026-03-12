import { LessonTemplate, createScene, DEFAULT_TEMPLATE_SETTINGS, TemplateCategory } from './template-types';
import { SceneSection } from './scene-types';

function createBlock(id: string, type: string, props: Record<string, any>) {
  return { id, type, props };
}

function createSection(id: string, title?: string, blocks: any[] = []): SceneSection {
  return { id, title, blocks };
}

function generateBaseTemplate(
  id: string,
  name: string,
  description: string,
  category: TemplateCategory,
  components: string[],
  sceneCount: number = 3
): LessonTemplate {
  return {
    metadata: {
      id,
      name,
      description,
      category,
      difficulty: 'beginner',
      tags: [category, 'template'],
      components: components as any[],
      estimatedTime: 10,
      sceneCount,
      hasBranching: components.includes('branching'),
      hasAssessment: components.includes('quiz'),
      hasGamification: components.includes('score') || components.includes('badge'),
      isInteractive: true,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      featured: false,
      new: true,
      ratings: { average: 4.5 + Math.random() * 0.5, count: Math.floor(Math.random() * 100) + 10 },
      usageCount: Math.floor(Math.random() * 1000) + 100,
    },
    content: {
      title: name,
      description,
      theme: 'immersive',
      settings: DEFAULT_TEMPLATE_SETTINGS,
      scenes: Array(sceneCount).fill(0).map((_, i) => createScene(`scene-${i+1}`, `Scene ${i+1}`, {
        type: i === 0 ? 'welcome' : 'concept',
        sections: [
          createSection(`section-${i+1}`, `Section ${i+1}`, [
            createBlock(`heading-${i+1}`, 'heading', { level: 2, text: `Welcome to ${name}` }),
            createBlock(`text-${i+1}`, 'text', { text: 'Replace this content with your own learning material.' })
          ])
        ]
      })),
    },
    placeholders: []
  };
}

// 1. Narrative Learning Templates
export const narrativeTemplates: LessonTemplate[] = [
  {
    ...generateBaseTemplate('guided-story', 'Guided Story Lesson', 'A narrative-driven learning journey.', 'narrative', ['text', 'image', 'video']),
    metadata: { ...generateBaseTemplate('guided-story', '', '', 'narrative', []).metadata, featured: true }
  },
  generateBaseTemplate('personal-story', 'Personal Story Learning', 'Testimonial or lived experiences.', 'narrative', ['text', 'image', 'quote']),
  generateBaseTemplate('documentary-style', 'Documentary Style Lesson', 'Looks like a short documentary.', 'narrative', ['video', 'text', 'quiz']),
];

// 2. Exploration Templates
export const explorationTemplates: LessonTemplate[] = [
  generateBaseTemplate('interactive-exploration', 'Interactive Exploration', 'Learners explore different topics by clicking areas.', 'exploration', ['hotspot', 'image']),
  generateBaseTemplate('interactive-map', 'Interactive Map Lesson', 'Explore regions and data.', 'exploration', ['map', 'accordion']),
  generateBaseTemplate('interactive-diagram', 'Interactive Diagram', 'Explore parts of a whole.', 'exploration', ['diagram', 'text']),
];

// 3. Step-Based Learning Templates
export const stepBasedTemplates: LessonTemplate[] = [
  generateBaseTemplate('step-by-step', 'Step-by-Step Skill Tutorial', 'Guide learners through structured steps.', 'step-based', ['image', 'text', 'list']),
  generateBaseTemplate('process-flow', 'Process Flow Lesson', 'Animated timeline of a process.', 'step-based', ['timeline', 'text']),
  generateBaseTemplate('checklist-guided', 'Checklist Guided Lesson', 'Task completion tracking.', 'step-based', ['checklist', 'text']),
];

// 4. Scenario-Based Learning
export const scenarioTemplates: LessonTemplate[] = [
  {
    ...generateBaseTemplate('choose-your-path', 'Choose Your Path Scenario', 'Learners make decisions leading to different outcomes.', 'scenario', ['branching', 'scenario']),
    metadata: { ...generateBaseTemplate('choose-your-path', '', '', 'scenario', []).metadata, featured: true }
  },
  generateBaseTemplate('branching-simulation', 'Branching Simulation', 'Emergency response or decision training.', 'scenario', ['branching', 'video']),
  generateBaseTemplate('roleplay-dialogue', 'Roleplay Dialogue', 'Conversational branching.', 'scenario', ['branching', 'text']),
];

// 5. Assessment Templates
export const assessmentTemplates: LessonTemplate[] = [
  generateBaseTemplate('embedded-knowledge', 'Embedded Knowledge Check', 'Quiz questions appear throughout the lesson.', 'assessment', ['quiz', 'text']),
  generateBaseTemplate('end-of-lesson-quiz', 'End-of-Lesson Quiz', 'Traditional assessment.', 'assessment', ['quiz', 'score']),
  generateBaseTemplate('gamified-quiz', 'Gamified Quiz Lesson', 'Score meter, progress indicators, badges.', 'assessment', ['quiz', 'badge', 'score']),
];

// 6. Visual Learning Templates
export const visualTemplates: LessonTemplate[] = [
  generateBaseTemplate('infographic-lesson', 'Infographic Lesson', 'Highly visual teaching with infographics.', 'visual', ['infographic', 'text']),
  generateBaseTemplate('timeline-lesson', 'Timeline Lesson', 'Chronological learning events.', 'visual', ['timeline', 'text']),
  generateBaseTemplate('comparison-lesson', 'Comparison Lesson', 'Side-by-side comparison panels.', 'visual', ['comparison', 'text']),
];

// 7. Media-Driven Lessons
export const mediaDrivenTemplates: LessonTemplate[] = [
  generateBaseTemplate('video-led', 'Video-Led Lesson', 'Video sections with interactive pauses.', 'media-driven', ['video', 'quiz']),
  generateBaseTemplate('audio-podcast', 'Audio Podcast Lesson', 'Audio player with visual highlights.', 'media-driven', ['audio', 'text']),
  generateBaseTemplate('media-gallery', 'Media Gallery Lesson', 'Image collections and visual exploration.', 'media-driven', ['gallery', 'image']),
];

// 8. Practice and Activity Lessons
export const practiceTemplates: LessonTemplate[] = [
  generateBaseTemplate('guided-practice', 'Guided Practice Lesson', 'Hands-on learning with interactive prompts.', 'practice', ['prompt', 'text']),
  generateBaseTemplate('reflection-journal', 'Reflection Journal Lesson', 'Guided writing prompts and reflection fields.', 'practice', ['journal', 'reflection']),
  generateBaseTemplate('worksheet-lesson', 'Worksheet Lesson', 'Fillable sections and downloadable worksheets.', 'practice', ['worksheet', 'download']),
];

// 9. Microlearning Templates
export const microlearningTemplates: LessonTemplate[] = [
  generateBaseTemplate('quick-tip', 'Quick Tip Lesson', 'Short video and summary card.', 'microlearning', ['video', 'text']),
  generateBaseTemplate('flashcard-lesson', 'Flashcard Lesson', 'Flip cards for rapid review.', 'microlearning', ['flip-card', 'text']),
  generateBaseTemplate('daily-nugget', 'Daily Learning Nugget', 'Small interactive lesson and daily challenge.', 'microlearning', ['text', 'quiz']),
];

// 10. Immersive Themed Lessons
export const immersiveTemplates: LessonTemplate[] = [
  generateBaseTemplate('immersive-story', 'Immersive Story Adventure', 'Interactive journey with full-screen scenes.', 'immersive', ['branching', 'image']),
  generateBaseTemplate('illustrated-journey', 'Illustrated Learning Journey', 'Illustrated environments and animated transitions.', 'immersive', ['image', 'text']),
  generateBaseTemplate('interactive-workshop', 'Interactive Workshop Lesson', 'Live workshop simulation with multi-section activities.', 'immersive', ['video', 'checklist']),
];

// 11. Gamified Learning Templates
export const gamifiedTemplates: LessonTemplate[] = [
  generateBaseTemplate('challenge-based', 'Challenge-Based Lesson', 'Learners complete challenges with progress tracking.', 'gamified', ['badge', 'score', 'quiz']),
  generateBaseTemplate('puzzle-learning', 'Puzzle Learning Lesson', 'Matching or ordering tasks.', 'gamified', ['matching', 'sorting']),
  generateBaseTemplate('exploration-quest', 'Exploration Quest', 'Find the correct answers hidden across the scene.', 'gamified', ['hotspot', 'badge']),
];

// 12. Hybrid Learning Templates
export const hybridTemplates: LessonTemplate[] = [
  generateBaseTemplate('mixed-media', 'Mixed Media Lesson', 'Video + text + interaction.', 'hybrid', ['video', 'text', 'quiz']),
  generateBaseTemplate('case-study', 'Case Study Lesson', 'Scenario, analysis, and solutions.', 'hybrid', ['scenario', 'accordion', 'reflection']),
  generateBaseTemplate('workshop-masterclass', 'Workshop Masterclass', 'Instructor videos, exercises, and discussions.', 'hybrid', ['video', 'worksheet']),
];

export const COMPREHENSIVE_TEMPLATES = [
  ...narrativeTemplates,
  ...explorationTemplates,
  ...stepBasedTemplates,
  ...scenarioTemplates,
  ...assessmentTemplates,
  ...visualTemplates,
  ...mediaDrivenTemplates,
  ...practiceTemplates,
  ...microlearningTemplates,
  ...immersiveTemplates,
  ...gamifiedTemplates,
  ...hybridTemplates,
];
