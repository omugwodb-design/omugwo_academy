import React from 'react';
import { FileText } from 'lucide-react';

interface PdfLessonProps {
  url: string;
  title: string;
}

export const PdfLesson: React.FC<PdfLessonProps> = ({ url, title }) => {
  if (!url) {
    return (
      <div className="w-full h-[70vh] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-gray-500 border border-gray-200 dark:border-gray-800">
        <FileText className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-700" />
        <p className="font-medium">PDF document is not available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <iframe 
        src={`${url}#toolbar=0`} 
        className="w-full flex-1" 
        title={title}
      />
    </div>
  );
};
