// Lesson Templates - Pre-designed layouts for the multimedia lesson editor
// Each template provides a starting point for creating dynamic lesson content

import { LessonBlock, LessonBlockType } from './types';
import { generateBlockId } from './registry';

// Template metadata
export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  category: 'intro' | 'content' | 'interactive' | 'assessment' | 'summary';
  thumbnail: string;
  blocks: LessonBlock[];
  tags: string[];
}

// Helper to create a block quickly
const block = (type: LessonBlockType, props: Record<string, any>): LessonBlock => ({
  id: generateBlockId(),
  type,
  props,
});

// Template 1: Video Lesson Intro
export const videoLessonIntroTemplate: LessonTemplate = {
  id: 'video-lesson-intro',
  name: 'Video Lesson Intro',
  description: 'Start with a video introduction followed by key points and a summary',
  category: 'intro',
  thumbnail: 'https://images.unsplash.com/photo-1611161665564-5e8cb931b451?auto=format&fit=crop&q=80&w=400',
  tags: ['video', 'intro', 'structured'],
  blocks: [
    block('heading', {
      content: 'Lesson Title',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('video', {
      provider: 'youtube',
      videoUrl: '',
      title: 'Lesson Video',
      description: 'Watch this video to learn the key concepts',
      width: 'full',
      aspectRatio: '16:9',
      showControls: true,
      autoplay: false,
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Key Takeaways',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('list', {
      items: ['First key point from the video', 'Second key concept to remember', 'Third important insight'],
      ordered: false,
      style: 'default',
    }),
    block('callout', {
      variant: 'tip',
      title: 'Pro Tip',
      content: 'Add a helpful tip or additional insight here to reinforce learning.',
      icon: 'lightbulb',
      dismissible: false,
    }),
  ],
};

// Template 2: Reading Content Block
export const readingContentTemplate: LessonTemplate = {
  id: 'reading-content',
  name: 'Reading Content',
  description: 'Text-focused lesson with headings, paragraphs, and highlighted callouts',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1456513080558-0d3d09765d5b?auto=format&fit=crop&q=80&w=400',
  tags: ['reading', 'text', 'theory'],
  blocks: [
    block('heading', {
      content: 'Section Title',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Start with an engaging introduction that hooks the learner. Explain what they will learn in this section and why it matters.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('heading', {
      content: 'Core Concept',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Dive deeper into the main content. Use clear, concise language and break up long paragraphs.</p><p>You can include <strong>bold text</strong> for emphasis and <em>italics</em> for nuance.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('callout', {
      variant: 'info',
      title: 'Important Note',
      content: 'Highlight critical information that learners should pay special attention to.',
      icon: 'info',
      dismissible: false,
    }),
    block('heading', {
      content: 'Practical Application',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Connect the theory to practice. Show how the concepts apply in real-world scenarios.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('quote', {
      content: 'Include a relevant quote that reinforces the key message.',
      author: 'Expert Name',
      source: 'Source',
      alignment: 'left',
      style: 'highlighted',
    }),
  ],
};

// Template 3: Interactive Quiz
export const interactiveQuizTemplate: LessonTemplate = {
  id: 'interactive-quiz',
  name: 'Interactive Quiz',
  description: 'Knowledge check with quiz questions and reflection prompts',
  category: 'interactive',
  thumbnail: 'https://images.unsplash.com/photo-1606326608606-896184dc10de?auto=format&fit=crop&q=80&w=400',
  tags: ['quiz', 'assessment', 'interactive'],
  blocks: [
    block('heading', {
      content: 'Knowledge Check',
      level: 1,
      alignment: 'center',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Test your understanding of the concepts covered in this lesson.</p>',
      alignment: 'center',
      fontSize: 'base',
      color: '#6b7280',
    }),
    block('divider', {
      style: 'gradient',
      thickness: 'medium',
      color: '#7c3aed',
      width: 'partial',
      margin: 'lg',
    }),
    block('quiz', {
      quizId: '',
      title: 'Quick Quiz',
      description: 'Answer the following questions to test your knowledge.',
      passingScore: 70,
      maxAttempts: 3,
      showResults: true,
    }),
    block('reflection', {
      prompt: 'What was the most challenging concept in this lesson? How will you apply what you learned?',
      placeholder: 'Share your thoughts...',
      minLength: 50,
      maxLength: 1000,
      required: false,
    }),
  ],
};

// Template 4: Step-by-Step Guide
export const stepByStepGuideTemplate: LessonTemplate = {
  id: 'step-by-step-guide',
  name: 'Step-by-Step Guide',
  description: 'Numbered instructions with images and detailed explanations',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1484480972527-af7c8bad2c8a?auto=format&fit=crop&q=80&w=400',
  tags: ['tutorial', 'how-to', 'practical'],
  blocks: [
    block('heading', {
      content: 'How to Complete This Task',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Follow these steps to successfully complete the task. Each step builds on the previous one.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'md',
    }),
    block('heading', {
      content: 'Step 1: Preparation',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('image', {
      src: '',
      alt: 'Step 1 illustration',
      caption: 'Visual guide for step 1',
      alignment: 'center',
      width: 'large',
      borderRadius: 'md',
      shadow: true,
    }),
    block('text', {
      content: '<p>Explain what needs to be done in this first step. Be specific and clear.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('callout', {
      variant: 'warning',
      title: 'Watch Out',
      content: 'Mention common mistakes or things to be careful about in this step.',
      icon: 'alert-triangle',
      dismissible: false,
    }),
    block('heading', {
      content: 'Step 2: Execution',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('image', {
      src: '',
      alt: 'Step 2 illustration',
      caption: 'Visual guide for step 2',
      alignment: 'center',
      width: 'large',
      borderRadius: 'md',
      shadow: true,
    }),
    block('text', {
      content: '<p>Guide learners through the main action. Break complex steps into smaller sub-steps.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('heading', {
      content: 'Step 3: Verification',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Explain how to verify that the task was completed correctly.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('callout', {
      variant: 'success',
      title: 'Success!',
      content: 'You have completed the task. Here\'s what to do next.',
      icon: 'check-circle',
      dismissible: false,
    }),
  ],
};

// Template 5: Case Study
export const caseStudyTemplate: LessonTemplate = {
  id: 'case-study',
  name: 'Case Study',
  description: 'Real-world example with context, analysis, and lessons learned',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86cc3?auto=format&fit=crop&q=80&w=400',
  tags: ['case-study', 'example', 'real-world'],
  blocks: [
    block('heading', {
      content: 'Case Study: Title',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Introduce the case study and explain its relevance to the lesson topic.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Background',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('image', {
      src: '',
      alt: 'Case study featured image',
      caption: 'Context image for the case study',
      alignment: 'center',
      width: 'full',
      borderRadius: 'lg',
      shadow: true,
    }),
    block('text', {
      content: '<p>Provide context about the situation, the people involved, and the challenges faced.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('heading', {
      content: 'The Challenge',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Describe the specific problem or challenge that needed to be addressed.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('callout', {
      variant: 'note',
      title: 'Key Challenge',
      content: 'Summarize the main obstacle in one sentence.',
      icon: 'flag',
      dismissible: false,
    }),
    block('heading', {
      content: 'The Solution',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Explain how the challenge was approached and what actions were taken.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('list', {
      items: ['Action 1 taken', 'Action 2 implemented', 'Action 3 executed'],
      ordered: true,
      style: 'numbered',
    }),
    block('heading', {
      content: 'Lessons Learned',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('quote', {
      content: 'Include a key insight or quote from the case study protagonist.',
      author: 'Person Name',
      source: 'Role/Position',
      alignment: 'center',
      style: 'highlighted',
    }),
    block('reflection', {
      prompt: 'How would you have approached this challenge differently? What would you do the same?',
      placeholder: 'Share your analysis...',
      minLength: 100,
      maxLength: 2000,
      required: false,
    }),
  ],
};

// Template 6: Audio Podcast Style
export const audioPodcastTemplate: LessonTemplate = {
  id: 'audio-podcast',
  name: 'Audio Podcast Style',
  description: 'Audio-focused lesson with transcript and discussion points',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc153?auto=format&fit=crop&q=80&w=400',
  tags: ['audio', 'podcast', 'listening'],
  blocks: [
    block('heading', {
      content: 'Audio Lesson: Topic',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Listen to this audio lesson to learn about the topic. The transcript is available below.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('audio', {
      src: '',
      title: 'Audio Lesson Title',
      description: 'Duration: X minutes',
      autoplay: false,
      showTranscript: true,
      transcript: '',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Discussion Points',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('list', {
      items: ['Key point discussed at 2:30', 'Important concept from 5:15', 'Main takeaway from 8:00'],
      ordered: false,
      style: 'default',
    }),
    block('callout', {
      variant: 'tip',
      title: 'Listening Tip',
      content: 'Take notes while listening to help retain the information.',
      icon: 'headphones',
      dismissible: false,
    }),
    block('reflection', {
      prompt: 'What was your biggest insight from this audio lesson?',
      placeholder: 'Share your thoughts...',
      minLength: 50,
      maxLength: 1000,
      required: false,
    }),
  ],
};

// Template 7: Downloadable Resources
export const downloadableResourcesTemplate: LessonTemplate = {
  id: 'downloadable-resources',
  name: 'Downloadable Resources',
  description: 'Lesson with downloadable files, worksheets, and supplementary materials',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1554224155-672e5b0a67e5?auto=format&fit=crop&q=80&w=400',
  tags: ['resources', 'download', 'worksheets'],
  blocks: [
    block('heading', {
      content: 'Lesson Resources',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Download these resources to supplement your learning. They are designed to help you apply the concepts from this lesson.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Worksheets',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('file', {
      url: '',
      filename: 'worksheet-1.pdf',
      description: 'Practice worksheet for exercises 1-5',
      fileSize: '245 KB',
      fileType: 'PDF',
      allowDownload: true,
      openInNewTab: false,
    }),
    block('file', {
      url: '',
      filename: 'worksheet-2.pdf',
      description: 'Advanced practice problems',
      fileSize: '312 KB',
      fileType: 'PDF',
      allowDownload: true,
      openInNewTab: false,
    }),
    block('heading', {
      content: 'Reference Materials',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('file', {
      url: '',
      filename: 'quick-reference-guide.pdf',
      description: 'One-page summary of key concepts',
      fileSize: '156 KB',
      fileType: 'PDF',
      allowDownload: true,
      openInNewTab: false,
    }),
    block('callout', {
      variant: 'info',
      title: 'How to Use These Resources',
      content: 'Download and print the worksheets. Complete them as you go through the lesson for maximum retention.',
      icon: 'download',
      dismissible: false,
    }),
  ],
};

// Template 8: Code Tutorial
export const codeTutorialTemplate: LessonTemplate = {
  id: 'code-tutorial',
  name: 'Code Tutorial',
  description: 'Technical lesson with code examples and explanations',
  category: 'content',
  thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=400',
  tags: ['code', 'technical', 'programming'],
  blocks: [
    block('heading', {
      content: 'Code Tutorial: Topic',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Learn how to implement this feature step by step. Follow along with the code examples.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'thin',
      color: '#e5e7eb',
      width: 'full',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Prerequisites',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('list', {
      items: ['Basic understanding of JavaScript', 'Node.js installed', 'Code editor (VS Code recommended)'],
      ordered: false,
      style: 'checklist',
    }),
    block('heading', {
      content: 'Step 1: Setup',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>First, let\'s set up our project structure.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('code', {
      code: '// Initialize the project\nnpm init -y\nnpm install express',
      language: 'bash',
      showLineNumbers: true,
      showCopyButton: true,
      theme: 'dark',
      title: 'Terminal',
    }),
    block('heading', {
      content: 'Step 2: Implementation',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Now let\'s write the main code.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('code', {
      code: 'const express = require(\'express\');\nconst app = express();\n\napp.get(\'/\', (req, res) => {\n  res.send(\'Hello World!\');\n});\n\napp.listen(3000, () => {\n  console.log(\'Server running on port 3000\');\n});',
      language: 'javascript',
      showLineNumbers: true,
      showCopyButton: true,
      theme: 'dark',
      title: 'app.js',
    }),
    block('callout', {
      variant: 'tip',
      title: 'Pro Tip',
      content: 'Use environment variables for configuration in production.',
      icon: 'code',
      dismissible: false,
    }),
    block('heading', {
      content: 'Step 3: Testing',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Test your implementation by running the server.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('code', {
      code: 'node app.js\n// Open http://localhost:3000 in your browser',
      language: 'bash',
      showLineNumbers: false,
      showCopyButton: true,
      theme: 'dark',
      title: 'Terminal',
    }),
  ],
};

// Template 9: Reflection & Journal
export const reflectionJournalTemplate: LessonTemplate = {
  id: 'reflection-journal',
  name: 'Reflection & Journal',
  description: 'Guided reflection with prompts and personal application',
  category: 'assessment',
  thumbnail: 'https://images.unsplash.com/photo-1517842645427-c31d6c41a148?auto=format&fit=crop&q=80&w=400',
  tags: ['reflection', 'journal', 'personal'],
  blocks: [
    block('heading', {
      content: 'Personal Reflection',
      level: 1,
      alignment: 'center',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Take time to reflect on what you\'ve learned and how it applies to your life.</p>',
      alignment: 'center',
      fontSize: 'base',
      color: '#6b7280',
    }),
    block('divider', {
      style: 'gradient',
      thickness: 'medium',
      color: '#7c3aed',
      width: 'partial',
      margin: 'lg',
    }),
    block('heading', {
      content: 'Prompt 1: Key Insights',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('reflection', {
      prompt: 'What were the 3 most important things you learned in this lesson?',
      placeholder: 'List your key insights...',
      minLength: 50,
      maxLength: 500,
      required: true,
    }),
    block('heading', {
      content: 'Prompt 2: Personal Connection',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('reflection', {
      prompt: 'How does this content relate to your personal experiences?',
      placeholder: 'Share your personal connection...',
      minLength: 100,
      maxLength: 1000,
      required: false,
    }),
    block('heading', {
      content: 'Prompt 3: Action Plan',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('reflection', {
      prompt: 'What specific action will you take in the next week based on what you learned?',
      placeholder: 'Describe your action plan...',
      minLength: 50,
      maxLength: 500,
      required: true,
    }),
    block('callout', {
      variant: 'success',
      title: 'Reflection Complete',
      content: 'Great job taking time to reflect! This practice deepens your learning.',
      icon: 'heart',
      dismissible: false,
    }),
  ],
};

// Template 10: Complete Lesson Structure
export const completeLessonTemplate: LessonTemplate = {
  id: 'complete-lesson',
  name: 'Complete Lesson Structure',
  description: 'Full lesson with intro, content, activity, and assessment',
  category: 'intro',
  thumbnail: 'https://images.unsplash.com/photo-1501504905252-54d0a7e6d83f?auto=format&fit=crop&q=80&w=400',
  tags: ['complete', 'full-lesson', 'comprehensive'],
  blocks: [
    // INTRO SECTION
    block('heading', {
      content: 'Lesson Title',
      level: 1,
      alignment: 'left',
      color: '#111827',
    }),
    block('text', {
      content: '<p>Write a brief introduction that captures attention and explains what learners will gain from this lesson.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('callout', {
      variant: 'info',
      title: 'Learning Objectives',
      content: 'By the end of this lesson, you will be able to:\n• Objective 1\n• Objective 2\n• Objective 3',
      icon: 'target',
      dismissible: false,
    }),
    block('divider', {
      style: 'solid',
      thickness: 'medium',
      color: '#e5e7eb',
      width: 'full',
      margin: 'xl',
    }),
    // CONTENT SECTION
    block('heading', {
      content: 'Core Content',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('video', {
      provider: 'youtube',
      videoUrl: '',
      title: 'Lesson Video',
      description: 'Watch the main lesson video',
      width: 'full',
      aspectRatio: '16:9',
      showControls: true,
      autoplay: false,
    }),
    block('heading', {
      content: 'Key Concepts',
      level: 3,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Explain the main concepts in detail. Break down complex ideas into digestible chunks.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('image', {
      src: '',
      alt: 'Concept diagram',
      caption: 'Visual representation of the key concept',
      alignment: 'center',
      width: 'large',
      borderRadius: 'md',
      shadow: true,
    }),
    block('list', {
      items: ['Important point 1', 'Important point 2', 'Important point 3'],
      ordered: false,
      style: 'default',
    }),
    block('divider', {
      style: 'solid',
      thickness: 'medium',
      color: '#e5e7eb',
      width: 'full',
      margin: 'xl',
    }),
    // ACTIVITY SECTION
    block('heading', {
      content: 'Practice Activity',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Apply what you\'ve learned with this hands-on activity.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('file', {
      url: '',
      filename: 'activity-worksheet.pdf',
      description: 'Download and complete this worksheet',
      fileSize: '156 KB',
      fileType: 'PDF',
      allowDownload: true,
      openInNewTab: false,
    }),
    block('reflection', {
      prompt: 'What challenges did you face during the activity? How did you overcome them?',
      placeholder: 'Share your experience...',
      minLength: 50,
      maxLength: 1000,
      required: false,
    }),
    block('divider', {
      style: 'solid',
      thickness: 'medium',
      color: '#e5e7eb',
      width: 'full',
      margin: 'xl',
    }),
    // ASSESSMENT SECTION
    block('heading', {
      content: 'Knowledge Check',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('quiz', {
      quizId: '',
      title: 'Lesson Quiz',
      description: 'Test your understanding of the material',
      passingScore: 70,
      maxAttempts: 3,
      showResults: true,
    }),
    block('divider', {
      style: 'solid',
      thickness: 'medium',
      color: '#e5e7eb',
      width: 'full',
      margin: 'xl',
    }),
    // SUMMARY SECTION
    block('heading', {
      content: 'Summary',
      level: 2,
      alignment: 'left',
      color: '#374151',
    }),
    block('text', {
      content: '<p>Recap the main points and reinforce the key takeaways.</p>',
      alignment: 'left',
      fontSize: 'base',
      color: '#374151',
    }),
    block('quote', {
      content: 'End with an inspiring quote or final thought that motivates continued learning.',
      author: 'Author Name',
      source: 'Source',
      alignment: 'center',
      style: 'highlighted',
    }),
    block('button', {
      text: 'Mark as Complete',
      href: '#',
      variant: 'primary',
      size: 'lg',
      alignment: 'center',
      openInNewTab: false,
      fullWidth: false,
    }),
  ],
};

// All lesson templates
export const LESSON_TEMPLATES: LessonTemplate[] = [
  videoLessonIntroTemplate,
  readingContentTemplate,
  interactiveQuizTemplate,
  stepByStepGuideTemplate,
  caseStudyTemplate,
  audioPodcastTemplate,
  downloadableResourcesTemplate,
  codeTutorialTemplate,
  reflectionJournalTemplate,
  completeLessonTemplate,
];

// Template categories for organization
export const LESSON_TEMPLATE_CATEGORIES = [
  {
    id: 'intro',
    label: 'Introduction',
    description: 'Lesson introductions and overviews',
    icon: 'Play',
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Main lesson content layouts',
    icon: 'FileText',
  },
  {
    id: 'interactive',
    label: 'Interactive',
    description: 'Quizzes and interactive elements',
    icon: 'MousePointer',
  },
  {
    id: 'assessment',
    label: 'Assessment',
    description: 'Reflection and evaluation',
    icon: 'CheckCircle',
  },
  {
    id: 'summary',
    label: 'Summary',
    description: 'Lesson summaries and conclusions',
    icon: 'Flag',
  },
];

// Get templates by category
export const getTemplatesByCategory = (
  category: LessonTemplate['category']
): LessonTemplate[] => {
  return LESSON_TEMPLATES.filter((t) => t.category === category);
};

// Get template by ID
export const getTemplateById = (id: string): LessonTemplate | undefined => {
  return LESSON_TEMPLATES.find((t) => t.id === id);
};

// Create a new lesson from a template
export const createLessonFromTemplate = (
  templateId: string
): LessonBlock[] | null => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  // Generate new IDs for all blocks
  return template.blocks.map((b) => ({
    ...b,
    id: generateBlockId(),
  }));
};

export default LESSON_TEMPLATES;
