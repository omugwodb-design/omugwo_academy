// â”€â”€â”€ Enterprise LMS Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type LessonType = 'video' | 'text' | 'pdf' | 'quiz' | 'assignment' | 'reflection' | 'live_session';

export type DripType = 'immediate' | 'date_based' | 'progress_based' | 'cohort_based';

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'scenario';

export type CohortStatus = 'upcoming' | 'active' | 'completed' | 'archived';

export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'returned';

export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'expired' | 'refunded';

// â”€â”€â”€ Course Structure â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  banner: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  instructorId: string;
  modules: Module[];
  totalLessons: number;
  totalDuration: string;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  dripType: DripType;
  dripConfig?: DripConfig;
  prerequisites?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  lessons: Lesson[];
  dripDate?: string;
  dripAfterProgress?: number;
  isLocked?: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: LessonType;
  content: LessonContent;
  sortOrder: number;
  duration?: number;
  isFree: boolean;
  isRequired: boolean;
  resources: Resource[];
}

export interface LessonContent {
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'bunny' | 'custom';
  textContent?: string;
  pdfUrl?: string;
  quiz?: Quiz;
  assignment?: Assignment;
  reflectionPrompt?: string;
  liveSessionUrl?: string;
  liveSessionDate?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'link' | 'audio';
  url: string;
  size?: number;
}

// â”€â”€â”€ Drip Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface DripConfig {
  type: DripType;
  schedule?: DripScheduleItem[];
  progressThresholds?: { moduleId: string; requiredProgress: number; }[];
}

export interface DripScheduleItem {
  moduleId: string;
  releaseDate?: string;
  daysAfterEnrollment?: number;
}

// â”€â”€â”€ Assessments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  maxAttempts: number;
  showCorrectAnswers: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  explanation?: string;
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string;
  scenarioContext?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { questionId: string; answer: string; isCorrect: boolean; }[];
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpent: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: string;
  maxScore: number;
  allowFileUpload: boolean;
  allowTextSubmission: boolean;
  rubric?: RubricItem[];
  peerReview: boolean;
}

export interface RubricItem {
  criterion: string;
  maxPoints: number;
  levels: { label: string; points: number; description: string; }[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  status: AssignmentStatus;
  textContent?: string;
  fileUrl?: string;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  submittedAt: string;
  gradedAt?: string;
}

// â”€â”€â”€ Cohorts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Cohort {
  id: string;
  courseId: string;
  name: string;
  description: string;
  status: CohortStatus;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledCount: number;
  instructorId: string;
  schedule: CohortScheduleItem[];
  liveSessions: LiveSession[];
}

export interface CohortScheduleItem {
  moduleId: string;
  startDate: string;
  endDate: string;
  assignmentDueDate?: string;
}

export interface LiveSession {
  id: string;
  cohortId: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  meetingUrl: string;
  recordingUrl?: string;
  isCompleted: boolean;
}

// â”€â”€â”€ Progress Tracking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface UserProgress {
  userId: string;
  courseId: string;
  enrollmentStatus: EnrollmentStatus;
  overallProgress: number;
  completedLessons: string[];
  currentLessonId?: string;
  timeSpent: number;
  quizScores: { quizId: string; bestScore: number; attempts: number; }[];
  streak: number;
  lastAccessedAt: string;
  enrolledAt: string;
  completedAt?: string;
}

// â”€â”€â”€ Certificates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  verificationUrl: string;
  qrCode: string;
  issuedAt: string;
  templateId: string;
  metadata: {
    studentName: string;
    courseName: string;
    completionDate: string;
    grade?: string;
    instructorName: string;
  };
}

// â”€â”€â”€ Instructor Tools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface InstructorDashboard {
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
  courses: InstructorCourseStats[];
  recentActivity: InstructorActivity[];
}

export interface InstructorCourseStats {
  courseId: string;
  title: string;
  enrollments: number;
  completionRate: number;
  averageScore: number;
  revenue: number;
  dropOffPoints: { lessonId: string; title: string; dropRate: number; }[];
}

export interface InstructorActivity {
  type: 'enrollment' | 'completion' | 'submission' | 'question' | 'review';
  studentName: string;
  courseName: string;
  detail: string;
  timestamp: string;
}
