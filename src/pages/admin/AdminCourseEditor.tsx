import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import {
  BookOpen, Save, X, Plus, MoveUp, MoveDown, Trash2,
  ChevronDown, ChevronRight, Video, FileText, HelpCircle,
  ClipboardList, GripVertical, Eye, EyeOff, Globe, Loader2,
  Image as ImageIcon, Upload, GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { MediaUpload } from '../../components/ui/MediaUpload';
import {
  getCourse, createCourse, updateCourse, publishCourse,
  getModules, createModule, updateModule, deleteModule, reorderModules,
  createLesson, updateLesson, deleteLesson,
  getQuiz, createQuiz, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
} from '../../core/lms/lms-service';
import { QuizBuilder } from './QuizBuilder';

const LESSON_TYPES = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'text', label: 'Text/Article', icon: FileText },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'assignment', label: 'Assignment', icon: ClipboardList },
  { value: 'pdf', label: 'PDF Resource', icon: FileText },
];

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'short_answer', label: 'Short Answer' },
];

const toTitleCase = (value: string) => {
  if (!value) return value;
  return value
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const getParsedContent = (content: any) => {
  if (!content) return {};
  if (typeof content === 'object') return content;
  try {
    return JSON.parse(content);
  } catch {
    return { body: content };
  }
};

export const AdminCourseEditor: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId?: string }>();
  const isEditing = !!courseId;

  // Course state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('49000');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Curriculum state
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);
  const [quizBuilderLesson, setQuizBuilderLesson] = useState<{ id: string; title: string } | null>(null);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info');

  // Load course data if editing
  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    setIsLoading(true);
    try {
      const course = await getCourse(id);
      if (course) {
        setTitle(course.title || '');
        setDescription(course.description || '');
        setPrice(String(course.price || 0));
        setCategory(course.category || '');
        setLevel(toTitleCase(course.difficulty_level || 'beginner'));
        setThumbnailUrl(course.thumbnail_url || '');
        setIsPublished(course.is_published || false);
      }
      const mods = await getModules(id);
      const parsedMods = mods?.map(m => ({
        ...m,
        lessons: m.lessons?.map((l: any) => ({
          ...l,
          content: getParsedContent(l.content)
        })) || []
      })) || [];
      setModules(parsedMods);
      if (parsedMods?.length) {
        setExpandedModules(new Set([parsedMods[0].id]));
      }
    } catch (err) {
      console.error('Error loading course:', err);
      toast.error('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  //  Save Course 
  const handleSave = async () => {
    if (!title) {
      toast.error('Please enter a course title');
      return;
    }
    setIsSaving(true);
    try {
      if (isEditing && courseId) {
        await updateCourse(courseId, { title, description, price: parseFloat(price) || 0, category, difficulty_level: level.toLowerCase(), thumbnail_url: thumbnailUrl });
        toast.success('Course updated!');
      } else {
        const course = await createCourse({ title, description, price: parseFloat(price) || 0, category, difficulty_level: level.toLowerCase(), thumbnail_url: thumbnailUrl });
        toast.success('Course created!');
        navigate(`/admin/courses/${course.id}/edit`, { replace: true });
      }
    } catch (err) {
      console.error('Error saving course:', err);
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!courseId) return;
    try {
      await publishCourse(courseId);
      setIsPublished(true);
      toast.success('Course published!');
    } catch (err) {
      toast.error('Failed to publish');
    }
  };

  const handleStudentPreview = () => {
    if (!courseId) {
      toast.error('Please save the course first to preview it');
      return;
    }
    navigate(`/course-preview/${courseId}`);
  };

  //  Module CRUD 
  const handleAddModule = async () => {
    if (!courseId) {
      toast.error('Save the course first');
      return;
    }
    try {
      const mod = await createModule(courseId, `Module ${modules.length + 1}`, modules.length);
      setModules([...modules, { ...mod, lessons: [] }]);
      setExpandedModules(new Set([...expandedModules, mod.id]));
      toast.success('Module added');
    } catch (err) {
      toast.error('Failed to add module');
    }
  };

  const handleUpdateModule = async (moduleId: string, newTitle: string) => {
    try {
      await updateModule(moduleId, { title: newTitle });
      setModules(modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
    } catch (err) {
      toast.error('Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      await deleteModule(moduleId);
      setModules(modules.filter(m => m.id !== moduleId));
      toast.success('Module deleted');
    } catch (err) {
      toast.error('Failed to delete module');
    }
  };

  const handleMoveModule = async (moduleId: string, direction: 'up' | 'down') => {
    const idx = modules.findIndex(m => m.id === moduleId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === modules.length - 1)) return;
    const newModules = [...modules];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newModules[idx], newModules[swapIdx]] = [newModules[swapIdx], newModules[idx]];
    const reordered = newModules.map((m, i) => ({ ...m, order_index: i }));
    setModules(reordered);
    try {
      await reorderModules(reordered.map(m => ({ id: m.id, order_index: m.order_index })));
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  //  Lesson CRUD 
  const handleAddLesson = async (moduleId: string, type: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;
    const lessonCount = mod.lessons?.length || 0;
    try {
      const lesson = await createLesson(moduleId, {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
        type,
        order_index: lessonCount,
      });
      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, lessons: [...(m.lessons || []), lesson] } : m
      ));
      setEditingLesson(lesson.id);
      toast.success('Lesson added');
    } catch (err) {
      toast.error('Failed to add lesson');
    }
  };

  const handleUpdateLesson = async (lessonId: string, moduleId: string, updates: Record<string, any>) => {
    try {
      const payload = { ...updates };
      if (payload.content && typeof payload.content === 'object') {
        payload.content = JSON.stringify(payload.content);
      }
      const updated = await updateLesson(lessonId, payload);
      setModules(modules.map(m =>
        m.id === moduleId
          ? { ...m, lessons: (m.lessons || []).map((l: any) => l.id === lessonId ? { ...l, ...updated, content: getParsedContent(updated.content) } : l) }
          : m
      ));
    } catch (err) {
      toast.error('Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      setModules(modules.map(m =>
        m.id === moduleId
          ? { ...m, lessons: (m.lessons || []).filter((l: any) => l.id !== lessonId) }
          : m
      ));
      toast.success('Lesson deleted');
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  const toggleModule = (moduleId: string) => {
    const next = new Set(expandedModules);
    if (next.has(moduleId)) next.delete(moduleId);
    else next.add(moduleId);
    setExpandedModules(next);
  };

  const getLessonIcon = (type: string) => {
    const found = LESSON_TYPES.find(t => t.value === type);
    return found ? found.icon : FileText;
  };

  //  Render 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/courses')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 dark:text-white">{isEditing ? 'Edit Course' : 'Create Course'}</h1>
              {isPublished && <span className="text-xs text-green-600 font-medium">Published</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && (
              <Button variant="outline" onClick={handleStudentPreview} leftIcon={<GraduationCap className="w-4 h-4" />}>
                Preview as Student
              </Button>
            )}
            {isEditing && !isPublished && (
              <Button variant="outline" onClick={handlePublish} leftIcon={<Globe className="w-4 h-4" />}>
                Publish
              </Button>
            )}
            <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Course Info
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            disabled={!isEditing}
          >
            Curriculum {!isEditing && '(save first)'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'info' ? (
          /*  Course Info Tab  */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <Input placeholder="e.g. Postpartum Recovery Masterclass" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                      placeholder="What will students learn?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                      <Input placeholder="e.g. Health & Wellness" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
                      <select
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Thumbnail</label>
                    <MediaUpload
                      value={thumbnailUrl}
                      onChange={setThumbnailUrl}
                      bucket="assets"
                      folder="courses"
                      placeholder="Upload thumbnail (16:9 recommended)"
                      className="h-48"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pricing</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (NGN)</label>
                  <Input type="number" placeholder="49000" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status</h2>
                <div className={`flex items-center justify-between p-4 rounded-xl text-sm ${isPublished ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                  <div className="flex items-center gap-2">
                    {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <p>{isPublished ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
              </Card>

              {isEditing && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Stats</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Modules</span>
                      <span className="font-bold text-gray-900">{modules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lessons</span>
                      <span className="font-bold text-gray-900">{modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /*  Curriculum Tab  */
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Curriculum</h2>
              <Button onClick={handleAddModule} leftIcon={<Plus className="w-4 h-4" />}>
                Add Module
              </Button>
            </div>

            {modules.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No modules yet. Start building your curriculum.</p>
                <Button onClick={handleAddModule} leftIcon={<Plus className="w-4 h-4" />}>
                  Add First Module
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {modules.map((mod, modIdx) => (
                  <Card key={mod.id} className="overflow-hidden">
                    {/* Module Header */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                      <button onClick={() => toggleModule(mod.id)} className="p-1">
                        {expandedModules.has(mod.id) ? <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                      </button>
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">M{modIdx + 1}</span>
                      <input
                        className="flex-1 bg-transparent font-bold text-gray-900 dark:text-gray-100 outline-none text-sm"
                        value={mod.title}
                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                        onBlur={(e) => handleUpdateModule(mod.id, e.target.value)}
                      />
                      <span className="text-xs text-gray-400 dark:text-gray-500">{mod.lessons?.length || 0} lessons</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleMoveModule(mod.id, 'up')} className="p-1 hover:bg-gray-200 rounded" disabled={modIdx === 0}>
                          <MoveUp className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button onClick={() => handleMoveModule(mod.id, 'down')} className="p-1 hover:bg-gray-200 rounded" disabled={modIdx === modules.length - 1}>
                          <MoveDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button onClick={() => handleDeleteModule(mod.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Module Content */}
                    {expandedModules.has(mod.id) && (
                      <div className="p-4">
                        {/* Lessons List */}
                        {(mod.lessons || []).length > 0 ? (
                          <div className="space-y-2 mb-4">
                            {(mod.lessons || [])
                              .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                              .map((lesson: any, lessonIdx: number) => {
                                const LessonIcon = getLessonIcon(lesson.type);
                                const isExpanded = editingLesson === lesson.id;
                                return (
                                  <div key={lesson.id} className="border border-gray-100 rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                                      <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                                      <LessonIcon className="w-4 h-4 text-gray-400" />
                                      <button onClick={() => setEditingLesson(isExpanded ? null : lesson.id)} className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                                        {lesson.title}
                                      </button>
                                      <span className="text-[10px] font-medium text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">{lesson.type}</span>
                                      {lesson.duration_minutes && <span className="text-xs text-gray-400">{lesson.duration_minutes}m</span>}
                                      <button onClick={() => handleDeleteLesson(lesson.id, mod.id)} className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Expanded Lesson Editor */}
                                    {isExpanded && (
                                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                        <div className="space-y-1">
                                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Lesson Title</label>
                                          <input
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                                            value={lesson.title}
                                            onChange={(e) => setModules(modules.map(m =>
                                              m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, title: e.target.value } : l) } : m
                                            ))}
                                            onBlur={(e) => handleUpdateLesson(lesson.id, mod.id, { title: e.target.value })}
                                          />
                                        </div>
                                        {(lesson.type === 'video') && (
                                          <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Video URL</label>
                                            <input
                                              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                                              placeholder="https://youtube.com/watch?v=..."
                                              value={lesson.video_url || ''}
                                              onChange={(e) => setModules(modules.map(m =>
                                                m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, video_url: e.target.value } : l) } : m
                                              ))}
                                              onBlur={(e) => handleUpdateLesson(lesson.id, mod.id, { video_url: e.target.value })}
                                            />
                                          </div>
                                        )}
                                        {(lesson.type === 'text' || lesson.type === 'reflection') && (
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Content</label>
                                              <span className="text-[10px] text-gray-400 dark:text-gray-500">Supports Markdown formatting</span>
                                            </div>
                                            <div data-color-mode="light" className="dark:hidden">
                                              <MDEditor
                                                value={typeof lesson.content === 'object' ? (lesson.content?.body || lesson.content?.prompt || '') : (lesson.content || '')}
                                                onChange={(val) => {
                                                  const content = lesson.type === 'reflection' ? { prompt: val } : { body: val };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e: any) => {
                                                  const val = typeof lesson.content === 'object' ? (lesson.content?.body || lesson.content?.prompt || '') : (lesson.content || '');
                                                  const content = lesson.type === 'reflection' ? { prompt: val } : { body: val };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                                height={300}
                                                preview="edit"
                                              />
                                            </div>
                                            <div data-color-mode="dark" className="hidden dark:block">
                                              <MDEditor
                                                value={typeof lesson.content === 'object' ? (lesson.content?.body || lesson.content?.prompt || '') : (lesson.content || '')}
                                                onChange={(val) => {
                                                  const content = lesson.type === 'reflection' ? { prompt: val } : { body: val };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e: any) => {
                                                  const val = typeof lesson.content === 'object' ? (lesson.content?.body || lesson.content?.prompt || '') : (lesson.content || '');
                                                  const content = lesson.type === 'reflection' ? { prompt: val } : { body: val };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                                height={300}
                                                preview="edit"
                                                style={{ backgroundColor: '#09090b' }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                        {(lesson.type === 'pdf') && (
                                          <div className="space-y-4">
                                            <div className="space-y-1">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">PDF Document</label>
                                              <MediaUpload
                                                value={typeof lesson.content === 'object' ? lesson.content?.url : lesson.content || ''}
                                                onChange={(url) => {
                                                  const content = { url, title: lesson.title, description: lesson.description || '' };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                                bucket="assets"
                                                folder="pdfs"
                                                placeholder="Upload PDF Document"
                                                type="document"
                                                accept=".pdf"
                                                className="h-32"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Description (Optional)</label>
                                              <textarea
                                                className="w-full h-24 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                                placeholder="Brief description of the PDF..."
                                                value={typeof lesson.content === 'object' ? lesson.content?.description : ''}
                                                onChange={(e) => {
                                                  const currentUrl = typeof lesson.content === 'object' ? lesson.content?.url : lesson.content || '';
                                                  const content = { url: currentUrl, title: lesson.title, description: e.target.value };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e) => {
                                                  const currentUrl = typeof lesson.content === 'object' ? lesson.content?.url : lesson.content || '';
                                                  const content = { url: currentUrl, title: lesson.title, description: e.target.value };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                              />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="checkbox"
                                                id={`downloadable-${lesson.id}`}
                                                checked={typeof lesson.content === 'object' ? lesson.content?.allowDownload !== false : true}
                                                onChange={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { url: lesson.content };
                                                  const content = { ...currentContent, allowDownload: e.target.checked };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                              />
                                              <label htmlFor={`downloadable-${lesson.id}`} className="text-xs text-gray-700 dark:text-gray-300">
                                                Allow students to download this PDF
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                        {(lesson.type === 'assignment') && (
                                          <div className="space-y-4">
                                            <div className="space-y-1">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Assignment Title</label>
                                              <input
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="e.g., Final Essay Submission"
                                                value={typeof lesson.content === 'object' ? lesson.content?.assignmentTitle || '' : ''}
                                                onChange={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                  const content = { ...currentContent, assignmentTitle: e.target.value };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                  const content = { ...currentContent, assignmentTitle: e.target.value };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Instructions / Prompt</label>
                                              <textarea
                                                className="w-full h-32 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                                placeholder="What should the student do for this assignment?"
                                                value={typeof lesson.content === 'object' ? lesson.content?.prompt || '' : lesson.content || ''}
                                                onChange={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { assignmentTitle: '' };
                                                  const content = { ...currentContent, prompt: e.target.value };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { assignmentTitle: '' };
                                                  const content = { ...currentContent, prompt: e.target.value };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                              />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              <div className="flex items-center gap-2">
                                                <input
                                                  type="checkbox"
                                                  id={`require-file-${lesson.id}`}
                                                  checked={typeof lesson.content === 'object' ? lesson.content?.requireFileUpload : false}
                                                  onChange={(e) => {
                                                    const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                    const content = { ...currentContent, requireFileUpload: e.target.checked };
                                                    setModules(modules.map(m =>
                                                      m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                    ));
                                                    handleUpdateLesson(lesson.id, mod.id, { content });
                                                  }}
                                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <label htmlFor={`require-file-${lesson.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                                                  Require File Upload
                                                </label>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <input
                                                  type="checkbox"
                                                  id={`allow-text-${lesson.id}`}
                                                  checked={typeof lesson.content === 'object' ? lesson.content?.allowTextSubmission !== false : true}
                                                  onChange={(e) => {
                                                    const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                    const content = { ...currentContent, allowTextSubmission: e.target.checked };
                                                    setModules(modules.map(m =>
                                                      m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                    ));
                                                    handleUpdateLesson(lesson.id, mod.id, { content });
                                                  }}
                                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <label htmlFor={`allow-text-${lesson.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                                                  Allow Text Submission
                                                </label>
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                              <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Max Score (Points)</label>
                                                <input
                                                  type="number"
                                                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                                                  placeholder="100"
                                                  value={typeof lesson.content === 'object' ? lesson.content?.maxScore || '' : ''}
                                                  onChange={(e) => {
                                                    const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                    const content = { ...currentContent, maxScore: parseInt(e.target.value) || 0 };
                                                    setModules(modules.map(m =>
                                                      m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                    ));
                                                  }}
                                                  onBlur={(e) => {
                                                    const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                    const content = { ...currentContent, maxScore: parseInt(e.target.value) || 0 };
                                                    handleUpdateLesson(lesson.id, mod.id, { content });
                                                  }}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Grading Method</label>
                                                <select
                                                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none"
                                                  value={typeof lesson.content === 'object' ? lesson.content?.gradingMethod || 'points' : 'points'}
                                                  onChange={(e) => {
                                                    const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                    const content = { ...currentContent, gradingMethod: e.target.value };
                                                    setModules(modules.map(m =>
                                                      m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                    ));
                                                    handleUpdateLesson(lesson.id, mod.id, { content });
                                                  }}
                                                >
                                                  <option value="points">Points Based</option>
                                                  <option value="pass_fail">Pass / Fail</option>
                                                  <option value="manual_review">Manual Review Only</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Instructor Notes (Private)</label>
                                              <textarea
                                                className="w-full h-20 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                                placeholder="Notes for grading..."
                                                value={typeof lesson.content === 'object' ? lesson.content?.instructorNotes || '' : ''}
                                                onChange={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                  const content = { ...currentContent, instructorNotes: e.target.value };
                                                  setModules(modules.map(m =>
                                                    m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, content } : l) } : m
                                                  ));
                                                }}
                                                onBlur={(e) => {
                                                  const currentContent = typeof lesson.content === 'object' ? lesson.content : { prompt: lesson.content };
                                                  const content = { ...currentContent, instructorNotes: e.target.value };
                                                  handleUpdateLesson(lesson.id, mod.id, { content });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                        {(lesson.type === 'quiz') && (
                                          <div className="space-y-4">
                                            {/* Quiz Builder CTA */}
                                            <div className="mt-4 p-6 border border-dashed border-primary-200 dark:border-primary-900/50 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 text-center">
                                              <HelpCircle className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                                              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Quiz Configuration</h4>
                                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto">
                                                Build your quiz questions and configure settings like passing score and time limit in the Quiz Builder.
                                              </p>
                                              <Button 
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  setQuizBuilderLesson({ id: lesson.id, title: lesson.title });
                                                }}
                                              >
                                                Open Quiz Builder
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration (min)</label>
                                            <input
                                              type="number"
                                              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                                              value={lesson.duration_minutes || ''}
                                              onChange={(e) => setModules(modules.map(m =>
                                                m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, duration_minutes: parseInt(e.target.value) || 0 } : l) } : m
                                              ))}
                                              onBlur={(e) => handleUpdateLesson(lesson.id, mod.id, { duration_minutes: parseInt(e.target.value) || 0 })}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
                                            <select
                                              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none"
                                              value={lesson.type}
                                              onChange={(e) => {
                                                handleUpdateLesson(lesson.id, mod.id, { type: e.target.value });
                                                setModules(modules.map(m =>
                                                  m.id === mod.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === lesson.id ? { ...l, type: e.target.value } : l) } : m
                                                ));
                                              }}
                                            >
                                              {LESSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-gray-400 text-sm mb-4">
                            No lessons in this module yet
                          </div>
                        )}

                        {/* Add Lesson Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {LESSON_TYPES.map(lt => {
                            const Icon = lt.icon;
                            return (
                              <button
                                key={lt.value}
                                onClick={() => handleAddLesson(mod.id, lt.value)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:text-primary-600 transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {lt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiz Builder Modal */}
      {quizBuilderLesson && (
        <QuizBuilder
          lessonId={quizBuilderLesson.id}
          lessonTitle={quizBuilderLesson.title}
          onClose={() => setQuizBuilderLesson(null)}
          onSaved={() => { if (courseId) loadCourse(courseId); }}
        />
      )}
    </div>
  );
};
