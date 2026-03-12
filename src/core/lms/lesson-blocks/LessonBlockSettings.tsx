import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { LessonBlock, LessonBlockPropSchema } from './types';
import { LESSON_BLOCK_DEFINITIONS } from './registry';
import { MediaUpload } from '../../../components/ui/MediaUpload';

interface LessonBlockSettingsProps {
  block: LessonBlock;
  onChange: (props: Record<string, any>) => void;
}

// Group component for settings sections
const SettingsGroup: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="mb-4">
    {title && (
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{title}</h4>
    )}
    <div className="space-y-3">{children}</div>
  </div>
);

// JSON Editor component for complex properties
const JsonEditor: React.FC<{
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [text, setText] = useState(() => {
    try {
      return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    } catch {
      return '';
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newText: string) => {
    setText(newText);
    
    try {
      const parsed = JSON.parse(newText);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Invalid JSON format');
      // Still allow the string to be stored for editing
      onChange(newText);
    }
  };

  return (
    <div className="space-y-1">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || '[\n  { "key": "value" }\n]'}
        rows={6}
        className={cn(
          'w-full px-3 py-2 bg-gray-900 text-gray-100 border rounded-lg text-sm font-mono',
          'focus:ring-2 focus:ring-primary-500 outline-none resize-none',
          error ? 'border-red-500' : 'border-gray-700'
        )}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {error}
        </p>
      )}
      <p className="text-[10px] text-gray-500">
        Enter valid JSON (arrays or objects)
      </p>
    </div>
  );
};

// Individual setting input based on type
const SettingInput: React.FC<{
  schema: LessonBlockPropSchema;
  value: any;
  onChange: (value: any) => void;
}> = ({ schema, value, onChange }) => {
  const renderInput = () => {
    switch (schema.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          />
        );

      case 'rich-text':
        // Simple textarea for now - could integrate a rich text editor
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={6}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono"
          />
        );

      case 'select':
        return (
          <select
            value={value || schema.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {schema.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? schema.defaultValue ?? ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder={schema.placeholder}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value ?? schema.defaultValue ?? false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">{schema.label}</span>
          </label>
        );

      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || 'https://...'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );

      case 'image':
        return (
          <MediaUpload
            value={value || ''}
            onChange={(url) => onChange(url)}
            bucket="assets"
            folder="lesson-images"
            placeholder={schema.placeholder || 'Upload image'}
            type="image"
            accept="image/*"
          />
        );

      case 'video':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={schema.placeholder || 'Paste video URL'}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <p className="text-[10px] text-gray-400">Supports YouTube, Vimeo, or direct video URLs</p>
          </div>
        );

      case 'code':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={8}
            className="w-full px-3 py-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          />
        );

      case 'icon':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || 'Icon name'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );

      case 'json':
        return (
          <JsonEditor
            value={value}
            onChange={onChange}
            placeholder={schema.placeholder}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );
    }
  };

  return (
    <div>
      {schema.type !== 'boolean' && (
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {schema.label}
          {schema.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {schema.description && (
        <p className="text-[10px] text-gray-400 mt-1">{schema.description}</p>
      )}
    </div>
  );
};

export const LessonBlockSettings: React.FC<LessonBlockSettingsProps> = ({
  block,
  onChange,
}) => {
  const definition = LESSON_BLOCK_DEFINITIONS[block.type];
  const schemas = definition.propsSchema;

  // Group schemas by their group property
  const groupedSchemas = schemas.reduce((acc, schema) => {
    const group = schema.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(schema);
    return acc;
  }, {} as Record<string, LessonBlockPropSchema[]>);

  const handlePropChange = (propName: string, value: any) => {
    onChange({ [propName]: value });
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedSchemas).map(([groupName, groupSchemas]) => (
        <SettingsGroup key={groupName} title={groupName !== 'General' ? groupName : undefined}>
          {groupSchemas.map((schema) => (
            <SettingInput
              key={schema.name}
              schema={schema}
              value={block.props[schema.name]}
              onChange={(value) => handlePropChange(schema.name, value)}
            />
          ))}
        </SettingsGroup>
      ))}
    </div>
  );
};

export default LessonBlockSettings;
