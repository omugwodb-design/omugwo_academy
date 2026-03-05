import React, { useState } from 'react';
import { Block } from '../types';
import { cn } from '../../../lib/utils';
import { Mail, User, Phone, MessageSquare, Send } from 'lucide-react';

interface ContactFormBlockProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  paddingY?: string;
  containerSize?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
    required: boolean;
    options?: string[];
  }>;
}

export const ContactFormBlock: React.FC<{ block: Block; onChange: (id: string, props: any) => void; selected: boolean }> = ({ block, onChange, selected }) => {
  const props = block.props as ContactFormBlockProps;
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (key: keyof ContactFormBlockProps, value: any) => {
    onChange(block.id, { ...props, [key]: value });
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const renderField = (field: any) => {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors";
    
    switch (field.type) {
      case 'select':
        return (
          <select
            className={baseClasses}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            className={cn(baseClasses, 'resize-none h-32')}
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      default:
        return (
          <input
            type={field.type}
            className={baseClasses}
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        props.paddingY || 'py-24',
        props.backgroundColor || 'bg-white'
      )}
    >
      <div className={cn('mx-auto px-4', props.containerSize || 'max-w-4xl')}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {props.title}
          </h2>
          {props.subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {props.subtitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid gap-6">
            {props.fields?.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
