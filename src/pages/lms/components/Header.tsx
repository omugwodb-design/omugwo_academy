import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Trophy } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface HeaderProps {
  courseTitle: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  courseTitle,
  progressPercent,
  completedLessons,
  totalLessons,
  setMobileOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const canGoBack =
      typeof window !== 'undefined' &&
      (window.history.length > 1 || (window.history.state && (window.history.state as any).idx > 0));

    if (canGoBack) {
      navigate(-1);
      return;
    }

    if (location.pathname.startsWith('/course-preview')) {
      navigate('/admin/courses');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-[60] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleBack}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />

          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Omugwo Academy</p>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md">
              {courseTitle || 'Loading Course...'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{progressPercent}%</span>
                <span className="text-[10px] font-medium text-gray-500">({completedLessons}/{totalLessons})</span>
              </div>
              <div className="w-48 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn(
                    "h-full rounded-full",
                    progressPercent === 100 
                      ? "bg-gradient-to-r from-green-400 to-green-500" 
                      : "bg-gradient-to-r from-primary-500 to-primary-600"
                  )}
                />
              </div>
            </div>
            
            {progressPercent === 100 && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border-none gap-1 py-1">
                <Trophy className="w-3.5 h-3.5" />
                Completed
              </Badge>
            )}
          </div>

          <Button 
            onClick={handleBack}
            variant="outline" 
            className="md:hidden px-3 py-1.5 h-auto text-xs"
          >
            Exit
          </Button>
        </div>
      </div>
    </header>
  );
};
