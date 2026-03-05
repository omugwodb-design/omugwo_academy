import React from 'react';
import { Block } from '../types';
import { cn } from '../../../lib/utils';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface ContactInfoBlockProps {
  title: string;
  subtitle?: string;
  columns?: string;
  backgroundColor?: string;
  paddingY?: string;
  containerSize?: string;
  contactMethods: Array<{
    icon: string;
    title: string;
    description: string;
    contact: string;
    link: string;
  }>;
}

export const ContactInfoBlock: React.FC<{ block: Block; onChange: (id: string, props: any) => void; selected: boolean }> = ({ block, onChange, selected }) => {
  const props = block.props as ContactInfoBlockProps;

  const handleChange = (key: keyof ContactInfoBlockProps, value: any) => {
    onChange(block.id, { ...props, [key]: value });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail className="w-6 h-6" />;
      case 'phone':
        return <Phone className="w-6 h-6" />;
      case 'map-pin':
        return <MapPin className="w-6 h-6" />;
      default:
        return <ExternalLink className="w-6 h-6" />;
    }
  };

  return (
    <div
      className={cn(
        props.paddingY || 'py-24',
        props.backgroundColor || 'bg-gray-50'
      )}
    >
      <div className={cn('mx-auto px-4', props.containerSize || 'max-w-7xl')}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {props.title}
          </h2>
          {props.subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {props.subtitle}
            </p>
          )}
        </div>

        <div className={cn(
          'grid gap-8',
          props.columns === '2' ? 'md:grid-cols-2' :
          props.columns === '4' ? 'md:grid-cols-4' :
          'md:grid-cols-3'
        )}>
          {props.contactMethods?.map((method, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                <div className="text-primary-600">
                  {getIcon(method.icon)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {method.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {method.description}
              </p>
              
              <a
                href={method.link}
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
              >
                {method.contact}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
