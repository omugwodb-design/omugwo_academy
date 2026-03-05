import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { ChevronDown, ChevronRight, PlayCircle, FileText, Lock, Clock, CheckCircle, Link as LinkIcon } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

export const courseCurriculumBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "modules", label: "Modules", type: "array", arrayItemSchema: [
      { name: "title", label: "Module Title", type: "text" },
      { name: "description", label: "Module Description", type: "textarea" },
      { name: "duration", label: "Duration (e.g., 2h 30m)", type: "text" },
      {
        name: "lessons", label: "Lessons", type: "array", arrayItemSchema: [
          { name: "title", label: "Lesson Title", type: "text" },
          { name: "duration", label: "Duration (e.g., 8:30)", type: "text" },
          { name: "type", label: "Type", type: "select", options: [
            { label: "Video", value: "video" },
            { label: "Text", value: "text" },
            { label: "Quiz", value: "quiz" },
            { label: "Assignment", value: "assignment" }
          ]},
          { name: "linkedLessonId", label: "Linked Lesson ID", type: "text" }
        ]
      },
    ], group: "Content"
  },
  { name: "showProgress", label: "Show Progress", type: "boolean", group: "Style" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

interface Lesson {
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  linkedLessonId?: string | null;
  isLocked?: boolean;
  isCompleted?: boolean;
}

interface Module {
  title: string;
  description?: string;
  duration?: string;
  lessons: Lesson[];
}

export const CourseCurriculumBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { courseId } = useParams<{ courseId?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get('courseId');
  const actualCourseId = courseId || builderCourseId;

  const [availableLessons, setAvailableLessons] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    if (actualCourseId) {
      const fetchLessons = async () => {
        const { data } = await supabase
          .from('modules')
          .select('lessons(id, title)')
          .eq('course_id', actualCourseId);
        if (data) {
          const lessons = data.flatMap((m: any) => m.lessons || []);
          setAvailableLessons(lessons);
        }
      };
      fetchLessons();
    }
  }, [actualCourseId]);

  const {
    title = "Course Curriculum",
    subtitle = "Everything you'll learn in this comprehensive program",
    modules = [
      {
        title: "Module 1: Body Recovery",
        description: "Learn how to heal and rebuild strength safely after childbirth",
        duration: "2h 15m",
        lessons: [
          { title: "Introduction to Postpartum Recovery", duration: "8:30", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Understanding Your Body's Changes", duration: "12:45", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Safe Exercise Guidelines", duration: "15:20", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Nutrition for Recovery", duration: "10:15", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Module Quiz", duration: "5:00", type: "quiz", linkedLessonId: null, isLocked: false, isCompleted: false }
        ]
      },
      {
        title: "Module 2: Mental Health & Emotional Wellbeing",
        description: "Navigate the emotional landscape of new motherhood with confidence",
        duration: "1h 45m",
        lessons: [
          { title: "Recognizing Baby Blues vs PPD", duration: "10:30", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Building Your Support System", duration: "12:00", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Self-Care Strategies", duration: "8:45", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "When to Seek Help", duration: "7:30", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false }
        ]
      },
      {
        title: "Module 3: Cultural Balance",
        description: "Honor traditions while maintaining your autonomy",
        duration: "1h 30m",
        lessons: [
          { title: "Understanding Cultural Expectations", duration: "9:15", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Setting Healthy Boundaries", duration: "11:30", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false },
          { title: "Communicating with Family", duration: "10:45", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false }
        ]
      }
    ],
    showProgress = false,
    backgroundColor,
  } = block.props;

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const toggleModule = (index: number) => {
    const next = new Set(expandedModules);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedModules(next);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'quiz': return CheckCircle;
      case 'assignment': return FileText;
      default: return FileText;
    }
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    modules.forEach((mod: Module) => {
      mod.lessons.forEach(lesson => {
        const [mins, secs] = lesson.duration.split(':').map(Number);
        totalMinutes += mins + (secs || 0) / 60;
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getTotalLessons = () => {
    return modules.reduce((total: number, mod: Module) => {
      return total + mod.lessons.length;
    }, 0);
  };

  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-5xl mx-auto">
        <AnimationWrapper animation={getAnimationConfig(block.props)} className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 outline-none"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
          <p
            className="text-lg text-gray-600 mb-6 outline-none"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              <span>{getTotalLessons()} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getTotalDuration()} total</span>
            </div>
          </div>
        </AnimationWrapper>

        <div className="space-y-3">
          {modules.map((module: Module, moduleIndex: number) => {
            const isExpanded = expandedModules.has(moduleIndex);
            const lessons = parseLessons(module.lessons);
            const completedCount = lessons.filter(l => l.isCompleted).length;

            return (
              <AnimationWrapper
                key={moduleIndex}
                animation={getAnimationConfig(block.props)}
                index={moduleIndex}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => !selected && toggleModule(moduleIndex)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                      <h3 
                        className="text-lg font-bold text-gray-900 outline-none"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onClick={(e) => selected && e.stopPropagation()}
                        onBlur={(e) => {
                          const newModules = [...modules];
                          newModules[moduleIndex] = { ...module, title: e.currentTarget.textContent || "" };
                          handleChange("modules", newModules);
                        }}
                      >
                        {module.title}
                      </h3>
                    </div>
                    {module.description && (
                      <p 
                        className="text-sm text-gray-600 ml-8 outline-none"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onClick={(e) => selected && e.stopPropagation()}
                        onBlur={(e) => {
                          const newModules = [...modules];
                          newModules[moduleIndex] = { ...module, description: e.currentTarget.textContent || "" };
                          handleChange("modules", newModules);
                        }}
                      >
                        {module.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {showProgress && (
                      <span className="text-xs text-gray-500">
                        {completedCount}/{lessons.length} completed
                      </span>
                    )}
                    {module.duration && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span
                          className="outline-none"
                          contentEditable={selected}
                          suppressContentEditableWarning
                          onClick={(e) => selected && e.stopPropagation()}
                          onBlur={(e) => {
                            const newModules = [...modules];
                            newModules[moduleIndex] = { ...module, duration: e.currentTarget.textContent || "" };
                            handleChange("modules", newModules);
                          }}
                        >
                          {module.duration}
                        </span>
                      </span>
                    )}
                  </div>
                </button>

                {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 mt-2">
                      <ul className="space-y-4 mt-4">
                        {lessons.map((lesson, lessonIndex) => {
                          const Icon = getLessonIcon(lesson.type);
                          return (
                            <div
                              key={lessonIndex}
                              className={cn(
                                "px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors",
                                lessonIndex !== lessons.length - 1 && "border-b border-gray-100"
                              )}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Icon className={cn(
                                  "w-5 h-5 shrink-0",
                                  lesson.isCompleted ? "text-green-600" : "text-gray-400"
                                )} />
                                <span 
                                  className={cn(
                                    "text-sm outline-none",
                                    lesson.isLocked ? "text-gray-400" : "text-gray-700"
                                  )}
                                  contentEditable={selected}
                                  suppressContentEditableWarning
                                  onBlur={(e) => {
                                    const newText = e.currentTarget.textContent || "";
                                    const newLessons = [...lessons];
                                    newLessons[lessonIndex] = { ...lesson, title: newText };
                                    
                                    const newModules = [...modules];
                                    newModules[moduleIndex] = { ...module, lessons: newLessons };
                                    handleChange("modules", newModules);
                                  }}
                                >
                                  {lesson.title}
                                </span>
                                {selected && availableLessons.length > 0 && (
                                  <select
                                    value={lesson.linkedLessonId || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const newLessons = [...lessons];
                                      newLessons[lessonIndex] = { ...lesson, linkedLessonId: val };
                                      const newModules = [...modules];
                                      newModules[moduleIndex] = { ...module, lessons: newLessons };
                                      handleChange("modules", newModules);
                                    }}
                                    className="ml-2 text-[10px] border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-500 max-w-[120px] outline-none"
                                  >
                                    <option value="">No link</option>
                                    {availableLessons.map(al => (
                                      <option key={al.id} value={al.id}>{al.title}</option>
                                    ))}
                                  </select>
                                )}
                                {!selected && lesson.linkedLessonId && (
                                  <LinkIcon className="w-3 h-3 text-gray-300" />
                                )}
                                {lesson.isCompleted && showProgress && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span 
                                  className="text-sm text-gray-500 outline-none"
                                  contentEditable={selected}
                                  suppressContentEditableWarning
                                  onBlur={(e) => {
                                    const newText = e.currentTarget.textContent || "";
                                    const newLessons = [...lessons];
                                    newLessons[lessonIndex] = { ...lesson, duration: newText };
                                    
                                    const newModules = [...modules];
                                    newModules[moduleIndex] = { ...module, lessons: newLessons };
                                    handleChange("modules", newModules);
                                  }}
                                >
                                  {lesson.duration}
                                </span>
                                {lesson.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                )}
              </AnimationWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
