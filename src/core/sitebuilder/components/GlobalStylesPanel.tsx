// Global Styles Panel - Theme Customization
import React, { useState, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { GlobalStyles } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Palette,
  Type,
  Layout,
  RotateCcw,
  Save,
  Eye,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Font options
const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { label: 'Nunito', value: 'Nunito, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
];

// Border radius options
const RADIUS_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: 'Full', value: 'full' },
];

// Button style options
const BUTTON_STYLE_OPTIONS = [
  { label: 'Rounded', value: 'rounded' },
  { label: 'Pill', value: 'pill' },
  { label: 'Square', value: 'square' },
];

// Color presets
const COLOR_PRESETS = [
  { name: 'Primary', colors: { primary: '#7c3aed', secondary: '#ec4899', accent: '#f59e0b' } },
  { name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#14b8a6' } },
  { name: 'Forest', colors: { primary: '#10b981', secondary: '#22c55e', accent: '#84cc16' } },
  { name: 'Sunset', colors: { primary: '#f97316', secondary: '#ef4444', accent: '#eab308' } },
  { name: 'Royal', colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a855f7' } },
  { name: 'Rose', colors: { primary: '#f43f5e', secondary: '#fb7185', accent: '#fda4af' } },
  { name: 'Slate', colors: { primary: '#475569', secondary: '#64748b', accent: '#94a3b8' } },
  { name: 'Amber', colors: { primary: '#d97706', secondary: '#f59e0b', accent: '#fbbf24' } },
];

interface GlobalStylesPanelProps {
  className?: string;
}

export const GlobalStylesPanel: React.FC<GlobalStylesPanelProps> = ({ className }) => {
  const { globalStyles, setGlobalStyles, resetGlobalStyles } = useEditorStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['colors', 'typography'])
  );
  const [savedThemes, setSavedThemes] = useState<{ name: string; styles: GlobalStyles }[]>([]);

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

  // Update color
  const updateColor = (key: keyof GlobalStyles, value: string) => {
    setGlobalStyles({ [key]: value });
  };

  // Apply color preset
  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setGlobalStyles({
      primaryColor: preset.colors.primary,
      secondaryColor: preset.colors.secondary,
      accentColor: preset.colors.accent,
    });
  };

  // Save current theme
  const saveTheme = () => {
    const name = prompt('Enter theme name:');
    if (name) {
      setSavedThemes([...savedThemes, { name, styles: { ...globalStyles } }]);
    }
  };

  // Load saved theme
  const loadTheme = (theme: typeof savedThemes[0]) => {
    setGlobalStyles(theme.styles);
  };

  // Render color input
  const renderColorInput = (label: string, key: keyof GlobalStyles, value: string) => (
    <div className="flex items-center gap-3">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 w-24">
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => updateColor(key, e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-gray-700"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => updateColor(key, e.target.value)}
          className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Global Styles
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={saveTheme}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded transition-colors"
              title="Save Theme"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={resetGlobalStyles}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Reset to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Color Presets */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Quick Presets
          </p>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group relative p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
              >
                <div className="flex gap-0.5 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-primary-600">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              Colors
            </span>
            {expandedSections.has('colors') ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('colors') && (
            <div className="p-3 space-y-3">
              {renderColorInput('Primary', 'primaryColor', globalStyles.primaryColor)}
              {renderColorInput('Secondary', 'secondaryColor', globalStyles.secondaryColor)}
              {renderColorInput('Accent', 'accentColor', globalStyles.accentColor)}
              {renderColorInput('Background', 'backgroundColor', globalStyles.backgroundColor)}
              {renderColorInput('Text', 'textColor', globalStyles.textColor)}
            </div>
          )}
        </div>

        {/* Typography Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('typography')}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Type className="w-3.5 h-3.5" />
              Typography
            </span>
            {expandedSections.has('typography') ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('typography') && (
            <div className="p-3 space-y-3">
              {/* Body Font */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Body Font
                </label>
                <select
                  value={globalStyles.fontFamily}
                  onChange={(e) => setGlobalStyles({ fontFamily: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heading Font */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Heading Font
                </label>
                <select
                  value={globalStyles.headingFont}
                  onChange={(e) => setGlobalStyles({ headingFont: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Layout Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Layout className="w-3.5 h-3.5" />
              Layout
            </span>
            {expandedSections.has('layout') ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('layout') && (
            <div className="p-3 space-y-3">
              {/* Border Radius */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Border Radius
                </label>
                <select
                  value={globalStyles.borderRadius}
                  onChange={(e) => setGlobalStyles({ borderRadius: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {RADIUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Button Style */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Button Style
                </label>
                <select
                  value={globalStyles.buttonStyle}
                  onChange={(e) => setGlobalStyles({ buttonStyle: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {BUTTON_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Saved Themes */}
        {savedThemes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Saved Themes
            </p>
            <div className="space-y-1">
              {savedThemes.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => loadTheme(theme)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {theme.name}
                  </span>
                  <div className="flex gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.styles.primaryColor }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.styles.secondaryColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Bar */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: globalStyles.backgroundColor }}
        >
          <h4
            className="font-bold text-sm mb-1"
            style={{
              color: globalStyles.primaryColor,
              fontFamily: globalStyles.headingFont,
            }}
          >
            Preview Heading
          </h4>
          <p
            className="text-xs mb-2"
            style={{
              color: globalStyles.textColor,
              fontFamily: globalStyles.fontFamily,
            }}
          >
            This is how your text will look with the current settings.
          </p>
          <button
            className="px-3 py-1.5 text-xs font-bold text-white"
            style={{
              backgroundColor: globalStyles.primaryColor,
              borderRadius: globalStyles.borderRadius === 'full' ? '9999px' : `var(--radius-${globalStyles.borderRadius})`,
            }}
          >
            Button Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalStylesPanel;
