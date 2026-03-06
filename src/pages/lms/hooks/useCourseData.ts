import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'react-hot-toast';

const getParsedContent = (content: any) => {
  if (!content) return {};
  if (typeof content === 'object') return content;
  try {
    return JSON.parse(content);
  } catch {
    return { body: content };
  }
};

export const useCourseData = (courseId?: string, lessonId?: string) => {
  const { user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      
      // 1. Fetch Course Data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
        
      if (courseError) {
        console.error('[useCourseData] course fetch error', {
          courseId,
          code: (courseError as any)?.code,
          message: (courseError as any)?.message,
          details: (courseError as any)?.details,
          hint: (courseError as any)?.hint,
        });
        throw courseError;
      }
      setCourse(courseData);

      // 2. Fetch Modules & Lessons
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons:lessons(*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (moduleError) {
        console.error('[useCourseData] modules+lessons fetch error', {
          courseId,
          code: (moduleError as any)?.code,
          message: (moduleError as any)?.message,
          details: (moduleError as any)?.details,
          hint: (moduleError as any)?.hint,
        });
        throw moduleError;
      }
      
      // Sort lessons within modules
      const sortedModules = moduleData?.map(mod => ({
        ...mod,
        lessons: (mod.lessons || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((l: any) => ({ ...l, content: getParsedContent(l.content) }))
      })) || [];
      
      setModules(sortedModules);

      // 3. Fetch Progress if User exists
      if (user) {
        const lessonIds = sortedModules.flatMap(m => m.lessons.map((l: any) => l.id));
        if (lessonIds.length > 0) {
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);
            
          if (progressData) {
            // Normalize db rows to what the UI expects
            setLessonProgress(
              (progressData as any[]).map((p: any) => ({
                ...p,
                completed: !!p.is_completed,
              }))
            );
          }
        }
      }

      // 4. Set Current Lesson
      let targetLesson = null;
      if (lessonId) {
        // Find requested lesson
        sortedModules.forEach(mod => {
          const found = mod.lessons.find((l: any) => l.id === lessonId);
          if (found) {
            targetLesson = found;
            setExpandedModule(mod.id);
          }
        });
      }
      
      if (!targetLesson && sortedModules.length > 0 && sortedModules[0].lessons.length > 0) {
        targetLesson = sortedModules[0].lessons[0];
        setExpandedModule(sortedModules[0].id);
      }
      
      setCurrentLesson(targetLesson);

    } catch (error) {
      toast.error('Failed to load course content');
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lessonId, user]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const markComplete = async (id: string) => {
    if (!user) return;
    
    // Optimistic UI update
    setLessonProgress(prev => {
      const existing = prev.find(p => p.lesson_id === id);
      if (existing) {
        return prev.map(p => p.lesson_id === id ? { ...p, completed: true, is_completed: true } : p);
      }
      return [...prev, { lesson_id: id, user_id: user.id, completed: true, is_completed: true }];
    });

    try {
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', id)
        .single();

      if (existing) {
        await supabase
          .from('lesson_progress')
          .update({ 
            is_completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: id,
            is_completed: true,
            completed_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      // Optional: rollback optimistic update on error
    }
  };

  return {
    course,
    modules,
    currentLesson,
    setCurrentLesson,
    lessonProgress,
    isLoading,
    expandedModule,
    setExpandedModule,
    markComplete,
    refetch: fetchCourseData
  };
};
