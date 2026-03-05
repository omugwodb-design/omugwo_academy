import React from 'react';

interface TextLessonProps {
  content: string;
}

export const TextLesson: React.FC<TextLessonProps> = ({ content }) => {
  if (!content) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
        No content provided for this lesson.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800">
      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};
