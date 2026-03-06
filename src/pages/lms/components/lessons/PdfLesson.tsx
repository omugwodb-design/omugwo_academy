import React from 'react';
import { ExternalLink, Download, FileText } from 'lucide-react';

interface PdfLessonProps {
  url: string;
  title: string;
  allowDownload?: boolean;
}

export const PdfLesson: React.FC<PdfLessonProps> = ({ url, title, allowDownload = true }) => {
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
      <div className="px-4 py-3 bg-white/80 dark:bg-gray-950/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </a>
          {allowDownload && (
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 transition"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}
        </div>
      </div>

      <iframe
        src={`${url}#toolbar=0`}
        className="w-full flex-1"
        title={title}
      />
    </div>
  );
};
