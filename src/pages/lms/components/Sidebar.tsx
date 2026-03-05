import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle, Play, FileText, HelpCircle, ClipboardList, Lock, MonitorPlay } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SidebarProps {
  modules: any[];
  currentLesson: any;
  lessonProgress: any[];
  expandedModule: string | null;
  setExpandedModule: (id: string | null) => void;
  courseId: string;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  currentLesson,
  lessonProgress,
  expandedModule,
  setExpandedModule,
  courseId,
  isMobileOpen,
  setMobileOpen
}) => {
  const isLessonCompleted = (id: string) => lessonProgress.some(p => p.lesson_id === id && p.completed);

  const getModuleProgress = (mod: any) => {
    if (!mod.lessons || mod.lessons.length === 0) return 0;
    const completed = mod.lessons.filter((l: any) => isLessonCompleted(l.id)).length;
    return Math.round((completed / mod.lessons.length) * 100);
  };

  const iconForType = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'pdf': return FileText;
      case 'quiz': return HelpCircle;
      case 'assignment': return ClipboardList;
      case 'live_session': return MonitorPlay;
      default: return FileText;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300 lg:static lg:translate-x-0",
          !isMobileOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Curriculum</h2>
          <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{modules.length} Modules</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {modules.map((mod: any, idx: number) => {
            const progress = getModuleProgress(mod);
            const isExpanded = expandedModule === mod.id;
            
            return (
              <div key={mod.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  className="w-full p-4 flex items-start justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">Module {idx + 1}</span>
                      {progress === 100 && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2">{mod.title}</h3>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={cn("h-full rounded-full", progress === 100 ? "bg-green-500" : "bg-primary-500")}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">{progress}%</span>
                    </div>
                  </div>
                  <div className="mt-1 shrink-0">
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 pt-0 space-y-1 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                        {mod.lessons?.map((l: any, lIdx: number) => {
                          const Icon = iconForType(l.type);
                          const isCurrent = l.id === currentLesson?.id;
                          const isDone = isLessonCompleted(l.id);
                          const isLocked = !isDone && !isCurrent && false; // Implement drip rules here if needed

                          return (
                            <Link
                              key={l.id}
                              to={isLocked ? '#' : `/learn/${courseId}/${l.id}`}
                              onClick={(e) => {
                                if (isLocked) e.preventDefault();
                                setMobileOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-start gap-3 p-3 rounded-xl transition-all relative group",
                                isCurrent 
                                  ? "bg-primary-50 dark:bg-primary-900/20 shadow-sm" 
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                isLocked && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {/* Current Indicator Line */}
                              {isCurrent && (
                                <motion.div 
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-2 bottom-2 w-1 bg-primary-500 rounded-r-full"
                                />
                              )}

                              <div className={cn(
                                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors mt-0.5",
                                isDone 
                                  ? "bg-green-500 border-green-500 text-white"
                                  : isCurrent
                                    ? "border-primary-500 text-primary-500"
                                    : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                              )}>
                                {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3 h-3" /> : <span className="text-[10px] font-bold">{lIdx + 1}</span>}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm font-medium leading-snug mb-1 transition-colors",
                                  isCurrent ? "text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                )}>
                                  {l.title}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                                  <div className="flex items-center gap-1 uppercase tracking-wider">
                                    <Icon className="w-3 h-3" />
                                    {l.type}
                                  </div>
                                  {l.duration_minutes > 0 && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                      <span>{l.duration_minutes} MIN</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
};
