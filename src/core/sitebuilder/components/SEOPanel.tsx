// SEO Optimization Panel
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { SitePage, GlobalStyles } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Search,
  Globe,
  FileText,
  Image,
  Link,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Copy,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  MessageSquare,
  Hash,
  ExternalLink,
} from 'lucide-react';

// SEO Analysis Result
export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  metrics: {
    titleLength: number;
    descriptionLength: number;
    headingCount: number;
    imageCount: number;
    imageAltCoverage: number;
    linkCount: number;
    wordCount: number;
    keywordDensity: Record<string, number>;
  };
}

// SEO Issue
export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field: string;
  suggestion: string;
}

// SEO Suggestion
export interface SEOSuggestion {
  priority: 'high' | 'medium' | 'low';
  message: string;
  impact: string;
}

// SEO Settings for a page
export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: 'website' | 'article' | 'product' | 'course';
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  noIndex: boolean;
  noFollow: boolean;
  structuredData: Record<string, any> | null;
}

// Default SEO settings
const DEFAULT_SEO_SETTINGS: SEOSettings = {
  title: '',
  description: '',
  keywords: [],
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  noIndex: false,
  noFollow: false,
  structuredData: null,
};

// Analyze SEO for a page
const analyzeSEO = (seoSettings: SEOSettings, pageContent: { title: string; blocks: any[] }): SEOAnalysis => {
  const issues: SEOIssue[] = [];
  const suggestions: SEOSuggestion[] = [];
  const metrics = {
    titleLength: seoSettings.title.length,
    descriptionLength: seoSettings.description.length,
    headingCount: 0,
    imageCount: 0,
    imageAltCoverage: 100,
    linkCount: 0,
    wordCount: 0,
    keywordDensity: {} as Record<string, number>,
  };

  // Title analysis
  if (metrics.titleLength === 0) {
    issues.push({
      type: 'error',
      message: 'Missing page title',
      field: 'title',
      suggestion: 'Add a descriptive title for your page',
    });
  } else if (metrics.titleLength < 30) {
    issues.push({
      type: 'warning',
      message: 'Title is too short',
      field: 'title',
      suggestion: 'Aim for 50-60 characters for optimal display in search results',
    });
  } else if (metrics.titleLength > 60) {
    issues.push({
      type: 'warning',
      message: 'Title is too long',
      field: 'title',
      suggestion: 'Keep titles under 60 characters to avoid truncation',
    });
  }

  // Description analysis
  if (metrics.descriptionLength === 0) {
    issues.push({
      type: 'error',
      message: 'Missing meta description',
      field: 'description',
      suggestion: 'Add a compelling description to improve click-through rates',
    });
  } else if (metrics.descriptionLength < 120) {
    issues.push({
      type: 'warning',
      message: 'Description is too short',
      field: 'description',
      suggestion: 'Aim for 150-160 characters for optimal display',
    });
  } else if (metrics.descriptionLength > 160) {
    issues.push({
      type: 'warning',
      message: 'Description is too long',
      field: 'description',
      suggestion: 'Keep descriptions under 160 characters to avoid truncation',
    });
  }

  // Keywords analysis
  if (seoSettings.keywords.length === 0) {
    suggestions.push({
      priority: 'medium',
      message: 'Add target keywords to improve content focus',
      impact: 'Helps search engines understand your content',
    });
  }

  // Open Graph analysis
  if (!seoSettings.ogImage) {
    issues.push({
      type: 'warning',
      message: 'Missing Open Graph image',
      field: 'ogImage',
      suggestion: 'Add an OG image for better social media sharing',
    });
  }

  // Canonical URL
  if (!seoSettings.canonicalUrl) {
    suggestions.push({
      priority: 'medium',
      message: 'Set a canonical URL to avoid duplicate content issues',
      impact: 'Prevents SEO penalties from duplicate content',
    });
  }

  // NoIndex check
  if (seoSettings.noIndex) {
    issues.push({
      type: 'info',
      message: 'Page is set to noindex',
      field: 'noIndex',
      suggestion: 'This page will not be indexed by search engines',
    });
  }

  // Calculate score
  let score = 100;
  issues.forEach(issue => {
    if (issue.type === 'error') score -= 20;
    if (issue.type === 'warning') score -= 10;
    if (issue.type === 'info') score -= 5;
  });
  score = Math.max(0, Math.min(100, score));

  // Add suggestions based on score
  if (score < 70) {
    suggestions.push({
      priority: 'high',
      message: 'Your SEO score needs improvement',
      impact: 'Better SEO can significantly increase organic traffic',
    });
  }

  return { score, issues, suggestions, metrics };
};

// Generate meta tags HTML
const generateMetaTags = (seoSettings: SEOSettings, pageUrl: string): string => {
  const tags: string[] = [];

  // Basic meta tags
  tags.push(`<title>${seoSettings.title}</title>`);
  tags.push(`<meta name="description" content="${seoSettings.description}">`);
  
  if (seoSettings.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${seoSettings.keywords.join(', ')}">`);
  }

  // Robots
  const robots = [
    seoSettings.noIndex ? 'noindex' : 'index',
    seoSettings.noFollow ? 'nofollow' : 'follow',
  ].join(', ');
  tags.push(`<meta name="robots" content="${robots}">`);

  // Canonical
  if (seoSettings.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${seoSettings.canonicalUrl}">`);
  }

  // Open Graph
  tags.push(`<meta property="og:title" content="${seoSettings.ogTitle || seoSettings.title}">`);
  tags.push(`<meta property="og:description" content="${seoSettings.ogDescription || seoSettings.description}">`);
  tags.push(`<meta property="og:url" content="${pageUrl}">`);
  tags.push(`<meta property="og:type" content="${seoSettings.ogType}">`);
  if (seoSettings.ogImage) {
    tags.push(`<meta property="og:image" content="${seoSettings.ogImage}">`);
  }

  // Twitter
  tags.push(`<meta name="twitter:card" content="${seoSettings.twitterCard}">`);
  tags.push(`<meta name="twitter:title" content="${seoSettings.twitterTitle || seoSettings.title}">`);
  tags.push(`<meta name="twitter:description" content="${seoSettings.twitterDescription || seoSettings.description}">`);
  if (seoSettings.twitterImage || seoSettings.ogImage) {
    tags.push(`<meta name="twitter:image" content="${seoSettings.twitterImage || seoSettings.ogImage}">`);
  }

  return tags.join('\n');
};

// SEO Panel Component
interface SEOPanelProps {
  page: SitePage | null;
  onUpdateSEO: (settings: SEOSettings) => void;
  className?: string;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  page,
  onUpdateSEO,
  className,
}) => {
  const [settings, setSettings] = useState<SEOSettings>(DEFAULT_SEO_SETTINGS);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'analysis'])
  );
  const [keywordInput, setKeywordInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Load settings from page
  useEffect(() => {
    if (page) {
      setSettings({
        title: page.seoTitle || page.title || '',
        description: page.seoDescription || '',
        keywords: [],
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: page.seoImage || '',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        noIndex: false,
        noFollow: false,
        structuredData: null,
      });
    }
  }, [page]);

  // Analyze SEO
  const analysis = useMemo(() => {
    return analyzeSEO(settings, {
      title: page?.title || '',
      blocks: page?.draftBlocks || [],
    });
  }, [settings, page]);

  // Update setting
  const updateSetting = useCallback((key: keyof SEOSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSEO(newSettings);
  }, [settings, onUpdateSEO]);

  // Add keyword
  const addKeyword = useCallback(() => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !settings.keywords.includes(keyword)) {
      updateSetting('keywords', [...settings.keywords, keyword]);
      setKeywordInput('');
    }
  }, [keywordInput, settings.keywords, updateSetting]);

  // Remove keyword
  const removeKeyword = useCallback((keyword: string) => {
    updateSetting('keywords', settings.keywords.filter(k => k !== keyword));
  }, [settings.keywords, updateSetting]);

  // Toggle section
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Copy meta tags
  const copyMetaTags = useCallback(async () => {
    const metaTags = generateMetaTags(settings, `https://yoursite.com/${page?.slug || ''}`);
    await navigator.clipboard.writeText(metaTags);
  }, [settings, page]);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get score background
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4" />
            SEO Settings
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={copyMetaTags}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Meta Tags"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* SEO Score */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(analysis.score / 100) * 176} 176`}
                  className={getScoreColor(analysis.score)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn('text-lg font-bold', getScoreColor(analysis.score))}>
                  {analysis.score}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                {analysis.score >= 80 ? 'Good' : analysis.score >= 60 ? 'Needs Work' : 'Poor'} SEO Score
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {analysis.issues.length} issues • {analysis.suggestions.length} suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Issues & Suggestions */}
        {analysis.issues.length > 0 && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Issues
            </p>
            <div className="space-y-2">
              {analysis.issues.map((issue, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-2 p-2 rounded-lg text-xs',
                    issue.type === 'error' && 'bg-red-50 dark:bg-red-950/30',
                    issue.type === 'warning' && 'bg-yellow-50 dark:bg-yellow-950/30',
                    issue.type === 'info' && 'bg-blue-50 dark:bg-blue-950/30'
                  )}
                >
                  <AlertCircle className={cn(
                    'w-4 h-4 flex-shrink-0 mt-0.5',
                    issue.type === 'error' && 'text-red-500',
                    issue.type === 'warning' && 'text-yellow-500',
                    issue.type === 'info' && 'text-blue-500'
                  )} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{issue.message}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Settings */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => toggleSection('basic')}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Basic Settings
            </span>
            {expandedSections.has('basic') ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {expandedSections.has('basic') && (
            <div className="p-3 space-y-3">
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Page Title
                  </label>
                  <span className={cn(
                    'text-xs',
                    settings.title.length > 60 ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {settings.title.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => updateSetting('title', e.target.value)}
                  placeholder="Enter page title..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Meta Description
                  </label>
                  <span className={cn(
                    'text-xs',
                    settings.description.length > 160 ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {settings.description.length}/160
                  </span>
                </div>
                <textarea
                  value={settings.description}
                  onChange={(e) => updateSetting('description', e.target.value)}
                  placeholder="Enter meta description..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Add keyword..."
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                {settings.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {settings.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                      >
                        <Hash className="w-3 h-3 text-gray-400" />
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Canonical URL */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={settings.canonicalUrl}
                  onChange={(e) => updateSetting('canonicalUrl', e.target.value)}
                  placeholder="https://yoursite.com/page"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>

              {/* Index Settings */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.noIndex}
                    onChange={(e) => updateSetting('noIndex', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">No Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.noFollow}
                    onChange={(e) => updateSetting('noFollow', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">No Follow</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => toggleSection('social')}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Social Media
            </span>
            {expandedSections.has('social') ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {expandedSections.has('social') && (
            <div className="p-3 space-y-3">
              {/* OG Image */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Social Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.ogImage}
                    onChange={(e) => updateSetting('ogImage', e.target.value)}
                    placeholder="https://yoursite.com/image.jpg"
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                  {settings.ogImage && (
                    <img
                      src={settings.ogImage}
                      alt="OG Preview"
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630 pixels</p>
              </div>

              {/* OG Type */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Content Type
                </label>
                <select
                  value={settings.ogType}
                  onChange={(e) => updateSetting('ogType', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="product">Product</option>
                  <option value="course">Course</option>
                </select>
              </div>

              {/* Twitter Card */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Twitter Card
                </label>
                <select
                  value={settings.twitterCard}
                  onChange={(e) => updateSetting('twitterCard', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Large Image</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="p-3">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Suggestions
            </p>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-primary-50 dark:bg-primary-950/20 rounded-lg">
                  <TrendingUp className={cn(
                    'w-4 h-4 flex-shrink-0 mt-0.5',
                    suggestion.priority === 'high' && 'text-red-500',
                    suggestion.priority === 'medium' && 'text-yellow-500',
                    suggestion.priority === 'low' && 'text-green-500'
                  )} />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{suggestion.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{suggestion.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <h4 className="font-bold text-sm">Google Preview</h4>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {/* Google Search Result Preview */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">Search Result Preview</p>
                <div className="p-4 bg-white rounded-lg border">
                  <p className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
                    {settings.title || 'Page Title'}
                  </p>
                  <p className="text-sm text-green-700 mb-1">
                    https://yoursite.com/{page?.slug || 'page'}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {settings.description || 'Your meta description will appear here...'}
                  </p>
                </div>
              </div>

              {/* Social Preview */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Social Share Preview</p>
                <div className="rounded-lg overflow-hidden border max-w-sm">
                  {settings.ogImage ? (
                    <img src={settings.ogImage} alt="" className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">yoursite.com</p>
                    <p className="font-medium text-sm text-gray-900 line-clamp-2">
                      {settings.ogTitle || settings.title || 'Page Title'}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {settings.ogDescription || settings.description || 'Description'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOPanel;
