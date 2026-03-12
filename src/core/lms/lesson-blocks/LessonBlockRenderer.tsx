// Enhanced Lesson Block Renderer with Inline Editing
// Apple + Figma inspired design with rich interactions

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { LessonBlock } from './types';
import { LESSON_BLOCK_DEFINITIONS } from './registry';
import {
  FlipCard,
  Accordion,
  Tabs,
  HotspotImage,
  Timeline,
  KnowledgeCheck,
  Scenario,
  Carousel,
  ComparisonSlider,
  ProcessSteps,
  Poll,
  MatchingExercise,
  SortingExercise,
  FillBlank,
  Resource,
  Reflection,
  Badge,
  Checklist,
  Discussion,
  Exercise,
  Grid,
  HeroImage,
} from './components/InteractiveBlocks';
import {
  Type,
  Image as ImageIcon,
  Video,
  Music,
  MousePointer,
  Minus,
  AlertCircle,
  Code,
  Download,
  HelpCircle,
  MessageSquare,
  Quote,
  List,
  Terminal,
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Unlink,
  Upload,
  X,
  Check,
  RefreshCw,
  Copy,
  Sparkles,
  CheckCircle,
  Info,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Maximize,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface LessonBlockRendererProps {
  block: LessonBlock;
  isEditing?: boolean;
  onPropChange?: (blockId: string, props: Record<string, any>) => void;
  selected?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (props: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  renderChildBlock?: (parentId: string, index: number, column?: number) => React.ReactNode;
}

// ============================================
// INLINE EDITOR COMPONENT
// ============================================

const InlineEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  richText?: boolean;
  editable?: boolean;
}> = ({ value, onChange, placeholder = 'Click to edit...', className = '', multiline = false, richText = false, editable = true }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(richText ? editorRef.current.innerHTML : editorRef.current.innerText);
    }
  }, [onChange, richText]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // View-only mode (not editable)
  if (!editable) {
    return (
      <div className={cn('prose prose-gray dark:prose-invert max-w-none', className)}>
        {value ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <span className="text-gray-400 italic">{placeholder}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      {richText && isFocused && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-gray-900 rounded-lg p-1 shadow-lg z-10">
          <button onClick={() => document.execCommand('bold')} className="p-1.5 hover:bg-gray-700 rounded text-white" title="Bold">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => document.execCommand('italic')} className="p-1.5 hover:bg-gray-700 rounded text-white" title="Italic">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => document.execCommand('underline')} className="p-1.5 hover:bg-gray-700 rounded text-white" title="Underline">
            <Underline className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-600 mx-1" />
          <button onClick={() => { const url = prompt('Enter URL:'); if (url) document.execCommand('createLink', false, url); }} className="p-1.5 hover:bg-gray-700 rounded text-white" title="Add Link">
            <Link className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        className={cn(
          'outline-none min-h-[1.5em] focus:ring-2 focus:ring-blue-500/20 rounded px-1 -mx-1 transition-all',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400',
          multiline && 'min-h-[4em] whitespace-pre-wrap',
          richText && '[&_a]:text-blue-600 [&_a]:underline',
        )}
        suppressContentEditableWarning
      >
        {value}
      </div>
    </div>
  );
};

// ============================================
// BLOCK TOOLBAR COMPONENT
// ============================================

const BlockToolbar: React.FC<{
  block: LessonBlock;
  onUpdate?: (props: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}> = ({ block, onUpdate, onDelete, onDuplicate }) => {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900 rounded-xl p-1 shadow-xl z-20 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onUpdate?.({ alignment: 'left' })} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors" title="Align Left">
        <AlignLeft className="w-4 h-4" />
      </button>
      <button onClick={() => onUpdate?.({ alignment: 'center' })} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors" title="Align Center">
        <AlignCenter className="w-4 h-4" />
      </button>
      <button onClick={() => onUpdate?.({ alignment: 'right' })} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors" title="Align Right">
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1" />

      <button onClick={onDuplicate} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors" title="Duplicate">
        <Copy className="w-4 h-4" />
      </button>

      <button onClick={onDelete} className="p-2 hover:bg-red-600 rounded-lg text-white transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// ============================================
// IMAGE UPLOADER COMPONENT
// ============================================

const ImageUploader: React.FC<{
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
}> = ({ value, onChange, alt = '', onAltChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group">
          <img src={value} alt={alt} className="w-full h-auto rounded-xl object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" title="Replace image">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => onChange('')} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" title="Remove image">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Drop an image or click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF, SVG up to 10MB</p>
            </>
          )}
        </div>
      )}
      {onAltChange && (
        <input type="text" value={alt} onChange={(e) => onAltChange(e.target.value)} placeholder="Image description (alt text)" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      )}
    </div>
  );
};

// ============================================
// CALLOUT STYLES
// ============================================

const CALLOUT_STYLES = {
  info: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200', icon: Info, iconColor: 'text-blue-500' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-500' },
  success: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
  error: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200', icon: AlertCircle, iconColor: 'text-red-500' },
  tip: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-800 dark:text-purple-200', icon: Lightbulb, iconColor: 'text-purple-500' },
  note: { bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-200 dark:border-gray-700', text: 'text-gray-700 dark:text-gray-300', icon: Info, iconColor: 'text-gray-500' },
};

// ============================================
// WIDTH & RADIUS CLASSES
// ============================================

const WIDTH_CLASSES: Record<string, string> = { small: 'w-1/4', medium: 'w-1/2', large: 'w-3/4', full: 'w-full' };
const RADIUS_CLASSES: Record<string, string> = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full' };
const ASPECT_CLASSES: Record<string, string> = { '16:9': 'aspect-video', '4:3': 'aspect-[4/3]', '1:1': 'aspect-square', '9:16': 'aspect-[9/16]', auto: '' };

// ============================================
// MAIN BLOCK RENDERER
// ============================================

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({
  block,
  isEditing = false,
  onPropChange,
  selected = false,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
  renderChildBlock,
}) => {
  const props = block.props;
  const isEditable = isEditing && (isSelected || selected);

  // View-only wrapper for non-editing mode
  const ViewWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn('relative', className)}>
      {children}
    </div>
  );

  // Wrapper for inline editable blocks
  const EditableWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div
      onClick={onSelect}
      className={cn(
        'relative group transition-all',
        isEditing ? 'cursor-pointer' : '',
        isEditable && 'ring-2 ring-blue-500 bg-blue-50/50 rounded-xl',
        isEditing && !isEditable && 'hover:bg-gray-50 rounded-xl',
        className,
      )}
    >
      {dragHandleProps && (
        <div {...dragHandleProps} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      {isEditable && <BlockToolbar block={block} onUpdate={onUpdate} onDelete={onDelete} onDuplicate={onDuplicate} />}
      {children}
    </div>
  );

  // Use appropriate wrapper based on editing mode
  const Wrapper = isEditing ? EditableWrapper : ViewWrapper;

  switch (block.type) {
    case 'text':
      return (
        <Wrapper className="py-2 px-3">
          <div className={cn('prose prose-gray dark:prose-invert max-w-none', props.alignment === 'center' && 'text-center', props.alignment === 'right' && 'text-right', props.fontSize === 'sm' && 'prose-sm', props.fontSize === 'lg' && 'prose-lg', props.fontSize === 'xl' && 'prose-xl')} style={{ color: props.color }}>
            <InlineEditor value={props.content || ''} onChange={(content) => onUpdate?.({ content })} placeholder="Click to add text..." richText editable={isEditable} />
          </div>
          {isEditable && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {['sm', 'base', 'lg', 'xl'].map((size) => (
                <button key={size} onClick={() => onUpdate?.({ fontSize: size })} className={cn('px-2 py-1 text-xs rounded transition-colors', props.fontSize === size ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{size.toUpperCase()}</button>
              ))}
            </div>
          )}
        </Wrapper>
      );

    case 'heading':
      const headingLevels = [1, 2, 3, 4, 5, 6] as const;
      const level = headingLevels.includes(props.level as typeof headingLevels[number]) ? props.level as 1 | 2 | 3 | 4 | 5 | 6 : 2;
      const headingClasses = cn('font-black text-gray-900 dark:text-white', props.alignment === 'center' && 'text-center', props.alignment === 'right' && 'text-right', level === 1 && 'text-4xl', level === 2 && 'text-3xl', level === 3 && 'text-2xl', level === 4 && 'text-xl', level === 5 && 'text-lg', level === 6 && 'text-base');
      const HeadingComponent = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <Wrapper className="py-3 px-4">
          {React.createElement(HeadingComponent, { className: headingClasses, style: { color: props.color } }, <InlineEditor value={props.content || ''} onChange={(content) => onUpdate?.({ content })} placeholder="Heading..." editable={isEditable} />)}
          {isEditable && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <button key={l} onClick={() => onUpdate?.({ level: l })} className={cn('px-2 py-1 text-xs rounded transition-colors', level === l ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>H{l}</button>
              ))}
            </div>
          )}
        </Wrapper>
      );

    case 'hero':
      return (
        <Wrapper className="py-0 px-0 -mx-4 md:-mx-8">
          <HeroImage
            image={props.image || ''}
            title={props.title || 'Hero Title'}
            subtitle={props.subtitle}
            height={props.height || 'large'}
            alignment={props.alignment || 'center'}
            overlayOpacity={props.overlayOpacity ?? 50}
            overlayColor={props.overlayColor || '#000000'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'image':
      const imageWrapper = cn('flex flex-col', props.alignment === 'center' && 'items-center', props.alignment === 'right' && 'items-end', props.alignment === 'left' && 'items-start');
      return (
        <Wrapper className="py-4">
          <div className={imageWrapper}>
            <div className={cn('relative', WIDTH_CLASSES[props.width || 'full'])}>
              {isEditing ? (
                <ImageUploader value={props.src || ''} onChange={(src) => onUpdate?.({ src })} alt={props.alt || ''} onAltChange={(alt) => onUpdate?.({ alt })} />
              ) : props.src ? (
                <img src={props.src} alt={props.alt || ''} className={cn('w-full object-cover', RADIUS_CLASSES[props.borderRadius || 'lg'], props.shadow && 'shadow-lg')} />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {props.caption && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center italic">{props.caption}</p>}
            </div>
          </div>
          {isEditable && (
            <div className="flex flex-wrap items-center gap-3 mt-3 p-3 bg-gray-50 rounded-xl">
              <select value={props.width || 'full'} onChange={(e) => onUpdate?.({ width: e.target.value })} className="px-2 py-1 text-sm border border-gray-200 rounded-lg">
                <option value="full">Full Width</option>
                <option value="large">Large</option>
                <option value="medium">Medium</option>
                <option value="small">Small</option>
              </select>
              <select value={props.alignment || 'center'} onChange={(e) => onUpdate?.({ alignment: e.target.value })} className="px-2 py-1 text-sm border border-gray-200 rounded-lg">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
              <select value={props.borderRadius || 'lg'} onChange={(e) => onUpdate?.({ borderRadius: e.target.value })} className="px-2 py-1 text-sm border border-gray-200 rounded-lg">
                <option value="none">No Radius</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="full">Full</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={props.shadow || false} onChange={(e) => onUpdate?.({ shadow: e.target.checked })} className="rounded" />
                Shadow
              </label>
            </div>
          )}
        </Wrapper>
      );

    case 'video':
      const getEmbedUrl = () => {
        const url = props.videoUrl || '';
        if (props.provider === 'youtube' || !props.provider) {
          const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtu\.be\/)([^&\s?]+)/)?.[1];
          return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        if (props.provider === 'vimeo') {
          const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
          return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
        }
        return url;
      };
      return (
        <Wrapper className="py-4">
          <div className={cn('flex flex-col items-center', WIDTH_CLASSES[props.width || 'full'] === 'w-full' ? 'w-full' : 'mx-auto')}>
            {props.title && <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{props.title}</h4>}
            <div className={cn('w-full relative overflow-hidden rounded-xl bg-gray-900', ASPECT_CLASSES[props.aspectRatio || '16:9'])}>
              {props.videoUrl ? (
                <iframe
                  src={getEmbedUrl()}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  title={props.title || 'Video'}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Add video URL</p>
                  </div>
                </div>
              )}
            </div>
            {props.description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{props.description}</p>}
          </div>
          {isEditable && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <select value={props.provider || 'youtube'} onChange={(e) => onUpdate?.({ provider: e.target.value })} className="px-3 py-2 text-sm border border-gray-200 rounded-lg">
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="upload">Upload</option>
                  <option value="custom">Custom URL</option>
                </select>
                <input type="text" value={props.videoUrl || ''} onChange={(e) => onUpdate?.({ videoUrl: e.target.value })} placeholder="Video URL" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={props.showControls || false} onChange={(e) => onUpdate?.({ showControls: e.target.checked })} className="rounded" />
                  Show Controls
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={props.autoplay || false} onChange={(e) => onUpdate?.({ autoplay: e.target.checked })} className="rounded" />
                  Autoplay
                </label>
              </div>
            </div>
          )}
        </Wrapper>
      );

    case 'audio':
      return (
        <Wrapper className="py-4">
          <div className="w-full bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-gray-100 dark:border-gray-800 transition-all shadow-sm">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 relative overflow-hidden group/audio shadow-lg">
              <div className="absolute inset-0 bg-white/20 group-hover/audio:animate-pulse opacity-0 group-hover/audio:opacity-100 transition-opacity" />
              <Music className="w-10 h-10 text-white relative z-10" />
            </div>
            <div className="flex-1 min-w-0 w-full text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{props.title || 'Audio Recording'}</h3>
              {props.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{props.description}</p>
              )}
              {props.audioUrl || props.src ? (
                <audio controls className="w-full h-12 outline-none rounded-xl custom-audio shadow-sm">
                  <source src={props.audioUrl || props.src} />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="text-sm text-gray-400 italic p-3 border border-dashed border-gray-300 rounded-lg">No audio source provided. Add a URL below.</div>
              )}
            </div>
          </div>
          
          {/* Transcript Section */}
          {(props.transcript || isEditable) && (
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 select-none flex items-center gap-2">
                  View Transcript
                </summary>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-800">
                  {props.transcript || 'No transcript available.'}
                </div>
              </details>
            </div>
          )}

          {isEditable && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Audio Settings</h4>
              <div className="space-y-3">
                <input type="text" value={props.audioUrl || props.src || ''} onChange={(e) => onUpdate?.({ audioUrl: e.target.value, src: e.target.value })} placeholder="Audio URL (e.g. https://...)" className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={props.title || ''} onChange={(e) => onUpdate?.({ title: e.target.value })} placeholder="Audio Title" className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={props.description || ''} onChange={(e) => onUpdate?.({ description: e.target.value })} placeholder="Short Description" className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <textarea value={props.transcript || ''} onChange={(e) => onUpdate?.({ transcript: e.target.value })} placeholder="Audio Transcript (optional but recommended for accessibility)" className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" rows={4} />
              </div>
            </div>
          )}
        </Wrapper>
      );

    case 'button':
      const buttonClasses = cn('inline-flex items-center justify-center font-bold rounded-xl transition-all', props.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25', props.variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200', props.variant === 'outline' && 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50', props.variant === 'ghost' && 'text-blue-600 hover:bg-blue-50', props.variant === 'gradient' && 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg', props.size === 'sm' && 'px-4 py-2 text-sm', props.size === 'md' && 'px-6 py-3 text-base', props.size === 'lg' && 'px-8 py-4 text-lg', props.fullWidth && 'w-full');
      return (
        <Wrapper className="py-4">
          <div className={cn('flex', { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[props.alignment || 'center'])}>
            <button className={buttonClasses}>
              <InlineEditor value={props.text || ''} onChange={(text) => onUpdate?.({ text })} placeholder="Button text" editable={isEditable} />
            </button>
          </div>
          {isEditable && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <input type="text" value={props.href || ''} onChange={(e) => onUpdate?.({ href: e.target.value })} placeholder="Button URL" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <input type="checkbox" checked={props.openInNewTab || false} onChange={(e) => onUpdate?.({ openInNewTab: e.target.checked })} className="rounded" />
                  New tab
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['primary', 'secondary', 'outline', 'ghost', 'gradient'].map((variant) => (
                  <button key={variant} onClick={() => onUpdate?.({ variant })} className={cn('px-3 py-1 text-xs rounded-full transition-colors capitalize', props.variant === variant ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}>{variant}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {['sm', 'md', 'lg'].map((size) => (
                  <button key={size} onClick={() => onUpdate?.({ size })} className={cn('px-3 py-1 text-xs rounded-full transition-colors uppercase', props.size === size ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}>{size}</button>
                ))}
              </div>
            </div>
          )}
        </Wrapper>
      );

    case 'divider':
      return (
        <Wrapper className="py-4">
          {props.style === 'gradient' ? (
            <div className={cn('w-full', props.width === 'partial' && 'w-1/2 mx-auto')}>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            </div>
          ) : (
            <hr className={cn('border-0', props.width === 'partial' ? 'w-1/2 mx-auto' : 'w-full')} style={{ borderTopWidth: props.thickness === 'thin' ? 1 : props.thickness === 'medium' ? 2 : 3, borderTopStyle: props.style as 'solid' | 'dashed' | 'dotted', borderTopColor: props.color }} />
          )}
          {isEditable && (
            <div className="flex items-center gap-2 mt-2 justify-center">
              {['solid', 'dashed', 'dotted', 'gradient'].map((style) => (
                <button key={style} onClick={() => onUpdate?.({ style })} className={cn('px-3 py-1 text-xs rounded-full transition-colors capitalize', props.style === style ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{style}</button>
              ))}
            </div>
          )}
        </Wrapper>
      );

    case 'callout':
      const calloutStyle = CALLOUT_STYLES[props.variant as keyof typeof CALLOUT_STYLES] || CALLOUT_STYLES.info;
      const CalloutIcon = calloutStyle.icon;
      return (
        <Wrapper>
          <div className={cn('rounded-xl border-2 p-4', calloutStyle.bg, calloutStyle.border)}>
            <div className="flex gap-3">
              <CalloutIcon className={cn('w-5 h-5 shrink-0 mt-0.5', calloutStyle.iconColor)} />
              <div className="flex-1">
                <div className={cn('font-semibold mb-1', calloutStyle.text)}>
                  <InlineEditor value={props.title || ''} onChange={(title) => onUpdate?.({ title })} placeholder="Callout title..." editable={isEditable} />
                </div>
                <div className={calloutStyle.text}>
                  <InlineEditor value={props.content || ''} onChange={(content) => onUpdate?.({ content })} placeholder="Callout content..." multiline editable={isEditable} />
                </div>
              </div>
            </div>
            {isEditable && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-current/10">
                {Object.keys(CALLOUT_STYLES).map((variant) => (
                  <button key={variant} onClick={() => onUpdate?.({ variant })} className={cn('px-3 py-1 text-xs rounded-full transition-colors capitalize', props.variant === variant ? 'bg-gray-900 text-white' : 'bg-white/50 text-gray-600 hover:bg-white')}>{variant}</button>
                ))}
              </div>
            )}
          </div>
        </Wrapper>
      );

    case 'quote':
      const quoteStyles = { default: 'border-l-4 border-gray-300 bg-gray-50 pl-6 py-4', highlighted: 'border-l-4 border-blue-500 bg-blue-50 pl-6 py-4', minimal: 'border-l-2 border-gray-200 pl-4 py-2', dramatic: 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 pl-6 py-4' };
      return (
        <Wrapper>
          <div className={cn('rounded-xl transition-all', quoteStyles[props.variant as keyof typeof quoteStyles] || quoteStyles.default)}>
            <Quote className="w-8 h-8 text-gray-300 mb-2" />
            <InlineEditor value={props.content || ''} onChange={(content) => onUpdate?.({ content })} placeholder="Add a quote..." className="text-lg italic text-gray-700" editable={isEditable} />
            {props.author && (
              <div className="mt-3 text-sm text-gray-500">
                — <InlineEditor value={props.author || ''} onChange={(author) => onUpdate?.({ author })} placeholder="Author name" editable={isEditable} />
              </div>
            )}
            {isEditable && (
              <div className="flex items-center gap-2 mt-3">
                {['default', 'highlighted', 'minimal', 'dramatic'].map((variant) => (
                  <button key={variant} onClick={() => onUpdate?.({ variant })} className={cn('px-3 py-1 text-xs rounded-full transition-colors capitalize', props.variant === variant ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{variant}</button>
                ))}
              </div>
            )}
          </div>
        </Wrapper>
      );

    case 'list':
      const items = props.items || ['Item 1', 'Item 2', 'Item 3'];
      const updateItem = (index: number, value: string) => { const newItems = [...items]; newItems[index] = value; onUpdate?.({ items: newItems }); };
      const addItem = () => onUpdate?.({ items: [...items, 'New item'] });
      const removeItem = (index: number) => onUpdate?.({ items: items.filter((_, i) => i !== index) });
      return (
        <Wrapper className="py-2">
          <ul className={cn('space-y-2', props.ordered && 'list-decimal list-inside', !props.ordered && 'list-disc list-inside')}>
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 group/item">
                {!props.ordered && <span className="w-2 h-2 rounded-full bg-current flex-shrink-0" />}
                <InlineEditor value={item} onChange={(value) => updateItem(index, value)} placeholder={`Item ${index + 1}`} className="flex-1" editable={isEditable} />
                {isEditable && items.length > 1 && (
                  <button onClick={() => removeItem(index)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isEditable && (
            <button onClick={addItem} className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              Add item
            </button>
          )}
        </Wrapper>
      );

    case 'code':
      return (
        <Wrapper className="py-4">
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono">
              <code>{props.code || '// Add your code here'}</code>
            </pre>
          </div>
          {isEditable && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <select value={props.language || 'javascript'} onChange={(e) => onUpdate?.({ language: e.target.value })} className="px-3 py-2 text-sm border border-gray-200 rounded-lg">
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="sql">SQL</option>
              </select>
            </div>
          )}
        </Wrapper>
      );

    case 'accordion':
      return (
        <Wrapper className="py-4">
          <Accordion
            items={props.items || [{ title: 'Section 1', content: 'Content for section 1' }]}
            allowMultiple={props.allowMultiple}
            style={props.style}
            isEditing={isEditing}
          />
          {isEditable && (
            <button className="flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-700">
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          )}
        </Wrapper>
      );

    case 'tabs':
      return (
        <Wrapper className="py-4">
          <Tabs
            tabs={props.tabs || [{ label: 'Tab 1', content: 'Content 1' }]}
            style={props.style}
            position={props.position}
            isEditing={isEditing}
          />
          {isEditable && (
            <button className="flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-700">
              <Plus className="w-4 h-4" />
              Add Tab
            </button>
          )}
        </Wrapper>
      );

    case 'columns':
      const columns = props.columns || 2;
      const gap = props.gap || 'md';
      const gapClasses = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };
      return (
        <Wrapper className="py-4">
          <div className={cn('grid', gapClasses[gap])} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                {renderChildBlock?.(block.id, 0, colIndex)}
                {isEditable && (
                  <div className="flex items-center justify-center text-gray-400 mt-auto pt-2">
                    <span className="text-xs">Column {colIndex + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditable && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
              <span className="text-sm text-gray-600">Columns:</span>
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => onUpdate?.({ columns: num })} className={cn('px-3 py-1 text-sm rounded-lg transition-colors', columns === num ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}>{num}</button>
              ))}
            </div>
          )}
        </Wrapper>
      );

    case 'section':
      return (
        <Wrapper>
          <div className="rounded-2xl overflow-hidden" style={{ background: props.background || '#ffffff', padding: props.padding || '2rem' }}>
            <div className="space-y-4">
              {props.title && (
                <h3 className="text-xl font-bold" style={{ color: props.titleColor }}>
                  <InlineEditor value={props.title} onChange={(title) => onUpdate?.({ title })} placeholder="Section title" editable={isEditable} />
                </h3>
              )}
              {props.content && (
                <div style={{ color: props.textColor }}>
                  <InlineEditor value={props.content} onChange={(content) => onUpdate?.({ content })} placeholder="Section content" multiline editable={isEditable} />
                </div>
              )}
              {props.imageUrl && <img src={props.imageUrl} alt={props.imageAlt || ''} className="w-full rounded-xl" />}
            </div>
          </div>
        </Wrapper>
      );

    case 'spacer':
      const heightMap = { sm: 'h-4', md: 'h-8', lg: 'h-16', xl: 'h-24' };
      return (
        <Wrapper>
          <div className={cn(heightMap[props.height || 'md'], 'bg-gray-100/50 group-hover:bg-blue-100/50 transition-colors rounded', isEditable && 'bg-blue-100')} />
          {isEditable && (
            <div className="flex items-center gap-2 mt-2 justify-center">
              {['sm', 'md', 'lg', 'xl'].map((size) => (
                <button key={size} onClick={() => onUpdate?.({ height: size })} className={cn('px-3 py-1 text-xs rounded-full transition-colors uppercase', props.height === size ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{size}</button>
              ))}
            </div>
          )}
        </Wrapper>
      );

    case 'flipCard':
      return (
        <Wrapper className="py-4">
          <FlipCard
            frontContent={props.frontTitle || 'Click to reveal'}
            backContent={props.backTitle || 'Answer'}
            frontImage={props.frontImage}
            backImage={props.backImage}
            flipDirection={props.flipDirection || 'horizontal'}
            color={props.color}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'quiz':
    case 'knowledgeCheck':
      return (
        <Wrapper className="py-4">
          <KnowledgeCheck
            question={props.question || 'Question 1?'}
            options={props.options || [{ text: 'Option A', correct: true }, { text: 'Option B', correct: false }]}
            type={props.quizType || 'single'}
            allowRetry={props.allowRetry}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'hotspot':
      return (
        <Wrapper className="py-4">
          <HotspotImage
            image={props.image || ''}
            hotspots={props.hotspots || []}
            hotspotStyle={props.hotspotStyle || 'pulse'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'timeline':
      return (
        <Wrapper className="py-4">
          <Timeline
            events={props.events || [{ date: 'Date', title: 'Event', description: 'Description' }]}
            orientation={props.orientation || 'vertical'}
            style={props.style || 'default'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'embed':
      return (
        <Wrapper className="py-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden" style={{ aspectRatio: props.aspectRatio || '16/9' }}>
            {props.embedUrl ? (
              <iframe
                src={(() => {
                  const url = props.embedUrl || '';
                  // Robust video parsing for common providers if pasted into embed block
                  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtu\.be\/)([^&\s?]+)/);
                  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
                  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                  return url;
                })()}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                title={props.title || 'Embedded Content'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Add embed URL</p>
                </div>
              </div>
            )}
          </div>
          {isEditable && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <input type="text" value={props.embedUrl || ''} onChange={(e) => onUpdate?.({ embedUrl: e.target.value })} placeholder="Embed URL (e.g., https://www.youtube.com/embed/...)" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
            </div>
          )}
        </Wrapper>
      );

    case 'carousel':
      return (
        <Wrapper className="py-4">
          <Carousel
            items={props.items || [{ image: '', caption: 'Add Slide' }]}
            autoplay={props.autoplay}
            autoplaySpeed={props.autoplaySpeed}
            showDots={props.showDots}
            showArrows={props.showArrows}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'slider':
      return (
        <Wrapper className="py-4">
          <ComparisonSlider
            beforeImage={props.beforeImage || ''}
            afterImage={props.afterImage || ''}
            beforeLabel={props.beforeLabel}
            afterLabel={props.afterLabel}
            orientation={props.orientation}
            startPosition={props.startPosition}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'scenario':
      return (
        <Wrapper className="py-4">
          <Scenario
            title={props.title || 'Scenario'}
            scenario={props.scenario || { id: 'start', content: 'Scenario content', choices: [] }}
            nodes={props.nodes || []}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'process':
      return (
        <Wrapper className="py-4">
          <ProcessSteps
            steps={props.steps || [{ title: 'Step 1', description: 'Description', icon: '1' }]}
            style={props.style}
            allowNavigation={props.allowNavigation}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'poll':
      return (
        <Wrapper className="py-4">
          <Poll
            question={props.question || 'Question?'}
            options={props.options || [{ text: 'Option A', votes: 0 }, { text: 'Option B', votes: 0 }]}
            showResults={props.showResults}
            allowMultiple={props.allowMultiple}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'matching':
      return (
        <Wrapper className="py-4">
          <MatchingExercise
            pairs={props.pairs || [{ left: 'A', right: 'B' }]}
            instructions={props.instructions}
            shuffle={props.shuffle}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'sorting':
      return (
        <Wrapper className="py-4">
          <SortingExercise
            items={props.items || [{ id: '1', content: 'Item 1' }]}
            instructions={props.instructions}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'fillBlank':
      return (
        <Wrapper className="py-4">
          <FillBlank
            text={props.text || 'Fill in the [blank]'}
            blanks={props.blanks || [{ id: 'blank', answer: 'blank', hint: '' }]}
            caseSensitive={props.requireExactMatch}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );

    case 'reflection':
      return (
        <Wrapper className="py-4">
          <Reflection
            prompt={props.prompt || 'Reflection Prompt'}
            placeholder={props.placeholder}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'discussion':
      return (
        <Wrapper className="py-4">
          <Discussion
            title={props.title || 'Discussion'}
            prompt={props.prompt || 'Prompt'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'exercise':
    case 'submission':
      return (
        <Wrapper className="py-4">
          <Exercise
            title={props.title || 'Exercise'}
            instructions={props.instructions || 'Instructions'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'resource':
      return (
        <Wrapper className="py-4">
          <Resource
            title={props.title || 'Resources'}
            resources={props.resources || []}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'checklist':
      return (
        <Wrapper className="py-4">
          <Checklist
            title={props.title || 'Task List'}
            items={props.items || []}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'badge':
      return (
        <Wrapper className="py-4">
          <Badge
            title={props.title || 'Achievement'}
            description={props.description || 'Description'}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </Wrapper>
      );
    case 'grid':
      return (
        <Wrapper className="py-4">
          <Grid
            columns={props.columns}
            gap={props.gap}
            isEditing={isEditing}
            onUpdate={onUpdate}
          >
            {props.items?.map((_: any, idx: number) => (
              <div key={idx}>
                {renderChildBlock?.(block.id, idx)}
              </div>
            )) || <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">Empty Grid</div>}
          </Grid>
        </Wrapper>
      );

    case 'progress':
      return (
        <Wrapper className="py-4">
          <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 w-1/2 flex items-center justify-center text-[10px] text-white font-bold">50% COMPLETE</div>
          </div>
        </Wrapper>
      );

    case 'file':
      return (
        <Wrapper className="py-4">
          <div className="border border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group/file">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover/file:scale-105 transition-transform duration-300">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm tracking-tight">{props.filename || 'Downloadable File'}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-xs truncate">{props.description || 'Click to download'}</p>
              </div>
            </div>
            {props.url ? (
              <a href={props.url} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2">
                Download
              </a>
            ) : (
              <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">No file</span>
            )}
          </div>
        </Wrapper>
      );

    default:
      return (
        <Wrapper className="py-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 text-center">
            <p>Unknown block type: {block.type}</p>
          </div>
        </Wrapper>
      );
  }
};

export default LessonBlockRenderer;
