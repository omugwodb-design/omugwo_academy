// Lesson Content Block Types for the Visual Lesson Editor
// Extended for Adapt Learning-style interactive course creation

export type LessonBlockType =
  // Text & Content
  | 'text'
  | 'heading'
  | 'quote'
  | 'list'
  | 'code'
  | 'callout'
  // Media
  | 'image'
  | 'hero'
  | 'video'
  | 'audio'
  | 'embed'
  | 'file'
  // Interactive Components
  | 'button'
  | 'flipCard'
  | 'accordion'
  | 'tabs'
  | 'hotspot'
  | 'timeline'
  | 'scenario'
  | 'carousel'
  | 'slider'
  | 'process'
  // Assessment & Knowledge Checks
  | 'quiz'
  | 'knowledgeCheck'
  | 'reflection'
  | 'poll'
  | 'matching'
  | 'sorting'
  | 'fillBlank'
  // Engagement & Collaboration
  | 'discussion'
  | 'submission'
  | 'exercise'
  // Resources & Tools
  | 'resource'
  | 'checklist'
  | 'badge'
  | 'progress'
  // Layout & Structure
  | 'divider'
  | 'section'
  | 'columns'
  | 'grid'
  | 'spacer';

// Completion tracking for interactive components
export interface CompletionRule {
  type: 'view' | 'interaction' | 'time' | 'percentage' | 'submission' | 'score';
  threshold?: number; // For percentage/time-based completion
  required?: boolean;
}

// Animation configuration
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'flip' | 'none';
  duration: number; // milliseconds
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  props: Record<string, any>;
  children?: LessonBlock[]; // For nested content
}

export interface LessonContent {
  version: string;
  blocks: LessonBlock[];
}

// Block-specific prop types

export interface TextBlockProps {
  content: string; // Rich text HTML or markdown
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  color: string;
}

export interface HeadingBlockProps {
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  alignment: 'left' | 'center' | 'right';
  width: 'full' | 'large' | 'medium' | 'small';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow: boolean;
  link?: string;
  openInNewTab?: boolean;
}

export interface VideoBlockProps {
  provider: 'youtube' | 'vimeo' | 'bunny' | 'upload' | 'custom';
  videoUrl: string;
  poster?: string;
  title?: string;
  description?: string;
  autoplay: boolean;
  showControls: boolean;
  width: 'full' | 'large' | 'medium';
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
}

export interface AudioBlockProps {
  src: string;
  title?: string;
  description?: string;
  autoplay: boolean;
  showTranscript: boolean;
  transcript?: string;
}

export interface ButtonBlockProps {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg';
  alignment: 'left' | 'center' | 'right';
  openInNewTab: boolean;
  icon?: string;
  iconPosition: 'left' | 'right';
  fullWidth: boolean;
}

export interface DividerBlockProps {
  style: 'solid' | 'dashed' | 'dotted' | 'gradient';
  thickness: 'thin' | 'medium' | 'thick';
  color: string;
  width: 'full' | 'partial';
  margin: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CalloutBlockProps {
  variant: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';
  title?: string;
  content: string;
  icon: string;
  dismissible: boolean;
}

export interface EmbedBlockProps {
  provider: 'youtube' | 'vimeo' | 'spotify' | 'soundcloud' | 'typeform' | 'google-forms' | 'custom';
  embedUrl: string;
  embedCode?: string;
  width: 'full' | 'large' | 'medium';
  aspectRatio: '16:9' | '4:3' | '1:1' | 'auto';
  title?: string;
}

export interface QuoteBlockProps {
  content: string;
  author?: string;
  source?: string;
  alignment: 'left' | 'center';
  style: 'default' | 'highlighted' | 'minimal';
}

export interface ListBlockProps {
  items: string[];
  ordered: boolean;
  style: 'default' | 'checklist' | 'numbered' | 'icons';
  icon?: string;
}

export interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers: boolean;
  showCopyButton: boolean;
  theme: 'light' | 'dark' | 'auto';
  title?: string;
}

export interface FileBlockProps {
  url: string;
  filename: string;
  description?: string;
  fileSize?: string;
  fileType?: string;
  allowDownload: boolean;
  openInNewTab: boolean;
}

export interface QuizBlockProps {
  quizId: string;
  title?: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  showResults: boolean;
}

export interface ReflectionBlockProps {
  prompt: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  required: boolean;
}

// Block definition for the editor

export interface LessonBlockDefinition {
  type: LessonBlockType;
  label: string;
  icon: string;
  category: 'text' | 'media' | 'interactive' | 'assessment' | 'structure';
  description: string;
  defaultProps: Record<string, any>;
  propsSchema: LessonBlockPropSchema[];
  supportsChildren: boolean;
}

export interface LessonBlockPropSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'color' | 'number' | 'boolean' | 'url' | 'image' | 'video' | 'icon' | 'code' | 'rich-text' | 'json';
  options?: { value: string | number; label: string }[];
  defaultValue?: any;
  placeholder?: string;
  required?: boolean;
  group?: string;
  description?: string;
}
