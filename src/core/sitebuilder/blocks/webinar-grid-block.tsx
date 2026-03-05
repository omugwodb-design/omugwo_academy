import React from 'react';
import { Block } from '../types';
import { cn } from '../../../lib/utils';
import { Calendar, Clock, Users, DollarSign, Play, FileText } from 'lucide-react';

interface WebinarGridBlockProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  columns?: string;
  backgroundColor?: string;
  paddingY?: string;
  containerSize?: string;
  webinars: Array<{
    title: string;
    description: string;
    image: string;
    date: string;
    time?: string;
    duration: string;
    price: string;
    instructor: string;
    type: 'live' | 'recorded';
  }>;
}

export const WebinarGridBlock: React.FC<{ block: Block; onChange: (id: string, props: any) => void; selected: boolean }> = ({ block, onChange, selected }) => {
  const props = block.props as WebinarGridBlockProps;

  const handleChange = (key: keyof WebinarGridBlockProps, value: any) => {
    onChange(block.id, { ...props, [key]: value });
  };

  return (
    <div
      className={cn(
        props.paddingY || 'py-24',
        props.backgroundColor || 'bg-white'
      )}
    >
      <div className={cn('mx-auto px-4', props.containerSize || 'max-w-7xl')}>
        {props.badgeText && (
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-bold uppercase tracking-wider">
              {props.badgeText}
            </span>
          </div>
        )}
        
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
          {props.webinars?.map((webinar, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img
                  src={webinar.image}
                  alt={webinar.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
                    webinar.type === 'live' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-700'
                  )}>
                    {webinar.type === 'live' ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    {webinar.type === 'live' ? 'LIVE' : 'RECORDED'}
                  </span>
                </div>
                {webinar.type === 'live' && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {(webinar as any).spotsLeft || 'Limited'} Spots
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {webinar.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {webinar.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{webinar.date}</span>
                  </div>
                  {webinar.time && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{webinar.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{webinar.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{webinar.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-primary-600">
                    {webinar.price}
                  </span>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors">
                    {webinar.type === 'live' ? 'Register' : 'Watch'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
