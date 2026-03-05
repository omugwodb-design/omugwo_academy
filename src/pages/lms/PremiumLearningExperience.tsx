import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar, Header, MainContent } from './components';
import { useCourseData } from './hooks/useCourseData';
import { Loader2 } from 'lucide-react';

export const PremiumLearningExperience: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // Custom hook to manage all data fetching and state
  const { 
    course, 
    modules, 
    currentLesson, 
    setCurrentLesson, 
    lessonProgress, 
    isLoading, 
    expandedModule, 
    setExpandedModule,
    markComplete
  } = useCourseData(courseId, lessonId);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Derived state for progress
  const { progressPercent, completedLessons, totalLessons } = useMemo(() => {
    if (!modules.length) return { progressPercent: 0, completedLessons: 0, totalLessons: 0 };
    
    let total = 0;
    let completed = 0;
    
    modules.forEach(mod => {
      if (mod.lessons) {
        total += mod.lessons.length;
        mod.lessons.forEach((l: any) => {
          if (lessonProgress.some(p => p.lesson_id === l.id && p.completed)) {
            completed++;
          }
        });
      }
    });

    return {
      totalLessons: total,
      completedLessons: completed,
      progressPercent: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  }, [modules, lessonProgress]);

  // Navigation handlers
  const { getNext, getPrev } = useMemo(() => {
    let allLessons: any[] = [];
    modules.forEach(m => {
      if (m.lessons) {
        allLessons = [...allLessons, ...m.lessons];
      }
    });

    const currIdx = allLessons.findIndex(l => l.id === currentLesson?.id);
    
    return {
      getNext: () => currIdx < allLessons.length - 1 ? allLessons[currIdx + 1] : null,
      getPrev: () => currIdx > 0 ? allLessons[currIdx - 1] : null,
    };
  }, [modules, currentLesson]);

  const goNext = useCallback(() => {
    const next = getNext();
    if (next) {
      navigate(`/learn/${courseId}/${next.id}`);
      setCurrentLesson(next);
      // Auto-expand module containing next lesson
      const mod = modules.find(m => m.lessons?.some((l: any) => l.id === next.id));
      if (mod) setExpandedModule(mod.id);
    }
  }, [getNext, navigate, courseId, setCurrentLesson, modules, setExpandedModule]);

  const goPrev = useCallback(() => {
    const prev = getPrev();
    if (prev) {
      navigate(`/learn/${courseId}/${prev.id}`);
      setCurrentLesson(prev);
      const mod = modules.find(m => m.lessons?.some((l: any) => l.id === prev.id));
      if (mod) setExpandedModule(mod.id);
    }
  }, [getPrev, navigate, courseId, setCurrentLesson, modules, setExpandedModule]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading learning experience...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find the course you're looking for.</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden text-gray-900 dark:text-gray-100">
      <Header 
        courseTitle={course.title}
        progressPercent={progressPercent}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
        setMobileOpen={setIsMobileSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          modules={modules}
          currentLesson={currentLesson}
          lessonProgress={lessonProgress}
          expandedModule={expandedModule}
          setExpandedModule={setExpandedModule}
          courseId={courseId || ''}
          isMobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
        />
        
        <MainContent 
          currentLesson={currentLesson}
          course={course}
          isLessonCompleted={lessonProgress.some(p => p.lesson_id === currentLesson?.id && p.completed)}
          markComplete={markComplete}
          goNext={goNext}
          goPrev={goPrev}
          hasNext={!!getNext()}
          hasPrev={!!getPrev()}
        />
      </div>
    </div>
  );
};
