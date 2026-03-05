export * from './database';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  price: number;
  currency: string;
  isPublished: boolean;
  targetAudience?: string;
  durationHours?: number;
  instructorId: string;
  instructor?: User;
  modules?: Module[];
  enrollmentCount?: number;
  rating?: number;
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  durationMinutes?: number;
  orderIndex: number;
  isFree: boolean;
  isPublished: boolean;
  quiz?: Quiz;
  isCompleted?: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  orderIndex: number;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  /** Academy roles:
   *  - student: regular paying customer / learner
   *  - instructor: course creator (backend access to course tools)
   *  - admin: full admin panel + site builder access
   *  - super_admin: admin + user role management
   */
  role: 'student' | 'instructor' | 'admin' | 'super_admin';
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'expired';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course?: Course;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  verificationUrl: string;
  course?: Course;
}

export interface CommunitySpace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isPrivate: boolean;
  postsCount?: number;
  membersCount?: number;
}

export interface CommunityPost {
  id: string;
  spaceId: string;
  userId: string;
  title?: string;
  content: string;
  isAnonymous: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: User;
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isAnonymous: boolean;
  likesCount: number;
  createdAt: string;
  user?: User;
}

export interface Webinar {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  hostId: string;
  host?: User;
  scheduledAt: string;
  durationMinutes: number;
  isFree: boolean;
  price?: number;
  maxAttendees?: number;
  replayUrl?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  registrationCount?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: Record<string, any>;
  earnedAt?: string;
}

export interface Lead {
  id: string;
  email: string;
  fullName?: string;
  source?: string;
  leadMagnet?: string;
  status: 'new' | 'nurturing' | 'converted' | 'unsubscribed';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  videoUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}
