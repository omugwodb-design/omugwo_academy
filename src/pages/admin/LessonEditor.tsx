import React, { useState } from 'react';
import { X, Save, Video, FileText, Image as ImageIcon, Link as LinkIcon, Code, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { MediaUpload } from '../../components/ui/MediaUpload';
import MDEditor from '@uiw/react-md-editor';

interface LessonEditorProps {
  lesson: any;
  onSave: (updates: any) => void;
  onClose: () => void;
}

const LESSON_TYPES = [
  { value: 'video', label: 'Video Lesson', icon: Video },
  { value: 'text', label: 'Text/Article', icon: FileText },
  { value: 'quiz', label: 'Quiz', icon: FileText },
  { value: 'assignment', label: 'Assignment', icon: FileText },
];

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave, onClose }) => {
  const [title, setTitle] = useState(lesson?.title || '');
  const [type, setType] = useState(lesson?.type || 'video');
  const [content, setContent] = useState(lesson?.content || '');
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '');
  const [duration, setDuration] = useState(lesson?.duration_minutes || 0);
  const [resources, setResources] = useState<any[]>(lesson?.resources || []);
  const [isFree, setIsFree] = useState(lesson?.is_free || false);

  const handleSave = () => {
    onSave({
      title,
      type,
      content,
      video_url: videoUrl,
      duration_minutes: duration,
      resources,
      is_free: isFree,
    });
  };

  const addResource = () => {
    setResources([...resources, { title: '', url: '', type: 'pdf' }]);
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {lesson?.id ? 'Edit Lesson' : 'Create Lesson'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Postpartum Recovery"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  placeholder="15"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-free"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="is-free" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Free Preview Lesson
              </label>
            </div>
          </div>

          {/* Video Lesson */}
          {type === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video URL
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  leftIcon={<Video className="w-4 h-4" />}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube, Vimeo, or direct video URLs
                </p>
              </div>

              {videoUrl && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="w-full h-full" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Text/Article Content */}
          {(type === 'text' || type === 'assignment') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Content
              </label>
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <MDEditor
                  value={content}
                  onChange={(v) => setContent(v || '')}
                  height={320}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Markdown editor with preview
              </p>
            </div>
          )}

          {/* Quiz Builder */}
          {type === 'quiz' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Quiz builder coming soon. For now, use the content editor to create quiz questions.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Content
                </label>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <MDEditor
                    value={content}
                    onChange={(v) => setContent(v || '')}
                    height={240}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Downloadable Resources
              </label>
              <Button size="sm" variant="outline" onClick={addResource} leftIcon={<Upload className="w-4 h-4" />}>
                Add Resource
              </Button>
            </div>

            {resources.map((resource, index) => (
              <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={resource.title}
                      onChange={(e) => updateResource(index, 'title', e.target.value)}
                      placeholder="Resource title (e.g., Postpartum Recovery Checklist)"
                    />
                    <Input
                      value={resource.url}
                      onChange={(e) => updateResource(index, 'url', e.target.value)}
                      placeholder="URL or file path"
                      leftIcon={<LinkIcon className="w-4 h-4" />}
                    />
                    <select
                      value={resource.type}
                      onChange={(e) => updateResource(index, 'type', e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Document</option>
                      <option value="image">Image</option>
                      <option value="link">External Link</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeResource(index)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save Lesson
          </Button>
        </div>
      </Card>
    </div>
  );
};
