import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, FileText, PenTool, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { useIntelligentCompletion } from '../hooks';

// Import specific lesson components
import { VideoLesson } from './lessons/VideoLesson';
import { TextLesson } from './lessons/TextLesson';
import { PdfLesson } from './lessons/PdfLesson';
import { QuizLesson } from './lessons/QuizLesson';
import { AssignmentLesson } from './lessons/AssignmentLesson';
import { BlocksLesson } from './lessons/BlocksLesson';
import { useAuthStore } from '../../../stores/authStore';

interface MainContentProps {
  currentLesson: any;
  course: any;
  isLessonCompleted: boolean;
  markComplete: (id: string) => void;
  goNext: () => void;
  goPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentLesson,
  course,
  isLessonCompleted,
  markComplete,
  goNext,
  goPrev,
  hasNext,
  hasPrev
}) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'discussion'>('overview');

  // Set up intelligent completion rules based on content type
  const { handleScroll, handleVideoProgress, handleActionComplete } = useIntelligentCompletion(
    currentLesson?.id,
    currentLesson?.type || 'text',
    {
      type: currentLesson?.type || 'text',
      threshold: 0.85,
      minimum_time: currentLesson?.duration_minutes ? currentLesson.duration_minutes * 30 : 60 // half of duration in seconds, or 60s
    },
    markComplete,
    isLessonCompleted
  );

  if (!currentLesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 h-[calc(100vh-64px)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  const renderLessonContent = () => {
    // Check if we have block-based interactive content
    const isBlockContent = currentLesson.content?.blocks && Array.isArray(currentLesson.content.blocks);
    // Check if we have scene-based interactive content
    const isInteractiveContent = currentLesson.content?.type === 'interactive' && currentLesson.content?.scenes && Array.isArray(currentLesson.content.scenes);

    if (isBlockContent || isInteractiveContent) {
      return <BlocksLesson content={currentLesson.content} />;
    }

    switch (currentLesson.type) {
      case 'video':
        return (
          <VideoLesson
            url={currentLesson.video_url || ''}
            poster={course?.thumbnail_url}
            onProgress={handleVideoProgress}
            onEnded={() => markComplete(currentLesson.id)}
          />
        );
      case 'pdf':
        return (
          <PdfLesson
            url={
              currentLesson.content?.pdf_url ||
              currentLesson.content?.pdfUrl ||
              currentLesson.content?.url ||
              currentLesson.pdf_url ||
              currentLesson.pdfUrl ||
              ''
            }
            title={currentLesson.title}
            allowDownload={currentLesson.content?.allowDownload !== false}
          />
        );
      case 'quiz':
        return (
          <QuizLesson
            lessonId={currentLesson.id}
            userId={user?.id || ''}
            onComplete={() => markComplete(currentLesson.id)}
          />
        );
      case 'assignment':
        return (
          <AssignmentLesson
            lessonId={currentLesson.id}
            userId={user?.id || ''}
            onComplete={() => markComplete(currentLesson.id)}
          />
        );
      case 'text':
      default:
        return (
          <TextLesson
            content={typeof currentLesson.content === 'object' ? currentLesson.content?.body || currentLesson.content?.prompt : currentLesson.content || currentLesson.description}
          />
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 h-[calc(100vh-64px)] custom-scrollbar" onScroll={(e) => {
      const target = e.currentTarget;
      const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight);
      handleScroll(scrollPercent);
    }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">

        {/* Top Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge className="border-primary-200 text-primary-700 dark:border-primary-800 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 capitalize tracking-wider text-[10px] font-bold">
                {currentLesson.type}
              </Badge>
              {currentLesson.duration_minutes > 0 && (
                <span className="text-xs font-medium text-gray-500">{currentLesson.duration_minutes} min read</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {currentLesson.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={!hasPrev}
              className="border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button
              size="sm"
              onClick={goNext}
              disabled={!hasNext}
              className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {renderLessonContent()}
        </motion.div>

        {/* Tabs section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm mt-12">
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto hide-scrollbar">
            {([
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'resources', label: 'Resources', icon: FileText },
              { id: 'notes', label: 'My Notes', icon: PenTool },
              { id: 'discussion', label: 'Discussion', icon: MessageCircle },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all shrink-0 relative",
                  activeTab === t.id
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                {activeTab === t.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>{currentLesson.description || 'No additional details provided for this lesson.'}</p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {(currentLesson.resources || []).length > 0 ? (
                  (currentLesson.resources || []).map((r: any, i: number) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{r.name || r.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">PDF Document {r.size ? `• ${r.size}` : ''}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No downloadable resources for this lesson.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <textarea
                  placeholder="Capture your thoughts here. These notes are private to you..."
                  className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all"
                />
                <div className="flex justify-end mt-4">
                  <Button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                    Save Notes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Join the Conversation</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Share your thoughts, ask questions, and connect with other parents taking this course.</p>
                <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                  Go to Community Space
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Mark Complete Action */}
        <div className="flex items-center justify-between py-6 mt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500",
              isLessonCompleted ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            )}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {isLessonCompleted ? 'Lesson Completed' : 'In Progress'}
              </p>
              <p className="text-xs text-gray-500">
                {isLessonCompleted
                  ? 'Great job! You can move on to the next lesson.'
                  : 'Auto-completes as you engage, or mark manually.'}
              </p>
            </div>
          </div>

          {!isLessonCompleted && (
            <Button
              onClick={() => {
                handleActionComplete();
                markComplete(currentLesson.id);
              }}
              variant="outline"
              className="border-green-200 hover:border-green-500 hover:bg-green-50 dark:border-green-900/50 dark:hover:border-green-500/50 dark:hover:bg-green-500/10 text-green-700 dark:text-green-400 transition-colors"
            >
              Mark Complete
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
