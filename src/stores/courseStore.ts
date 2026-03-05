import { create } from 'zustand';
import type { Course, Enrollment, Lesson } from '../types';

interface CourseState {
  courses: Course[];
  enrollments: Enrollment[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  isLoading: boolean;
  setCourses: (courses: Course[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setLoading: (loading: boolean) => void;
  updateLessonProgress: (lessonId: string, completed: boolean) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  enrollments: [],
  currentCourse: null,
  currentLesson: null,
  isLoading: false,
  setCourses: (courses) => set({ courses }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setCurrentCourse: (currentCourse) => set({ currentCourse }),
  setCurrentLesson: (currentLesson) => set({ currentLesson }),
  setLoading: (isLoading) => set({ isLoading }),
  updateLessonProgress: (lessonId, completed) =>
    set((state) => ({
      currentCourse: state.currentCourse
        ? {
            ...state.currentCourse,
            modules: state.currentCourse.modules?.map((module) => ({
              ...module,
              lessons: module.lessons?.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, isCompleted: completed } : lesson
              ),
            })),
          }
        : null,
    })),
}));
