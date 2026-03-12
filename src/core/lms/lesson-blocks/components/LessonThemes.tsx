/**
 * Lesson Themes System
 * 
 * Predefined themes for interactive lessons:
 * - Immersive: Full-screen backgrounds, cinematic transitions
 * - Illustrated: Hand-drawn style, playful elements
 * - Infographic: Data-driven, clean charts and diagrams
 * - Storytelling: Narrative-focused, character-driven
 */

import React from 'react';
import { cn } from '../../../../lib/utils';
import {
  Palette,
  Image,
  Type,
  Layout,
  Sparkles,
  BookOpen,
  BarChart3,
  Film,
} from 'lucide-react';

// ============================================
// THEME TYPES
// ============================================

export type LessonThemeType = 'immersive' | 'illustrated' | 'infographic' | 'storytelling' | 'custom';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
  bodySize: string;
  lineHeight: string;
}

export interface ThemeSpacing {
  section: string;
  block: string;
  element: string;
}

export interface ThemeEffects {
  borderRadius: string;
  shadow: string;
  transition: string;
  animationStyle: 'subtle' | 'moderate' | 'dynamic';
}

export interface ThemeBackground {
  default: {
    type: 'solid' | 'gradient' | 'image' | 'video';
    value: string;
  };
  scene?: {
    type: 'solid' | 'gradient' | 'image' | 'video';
    value: string;
    overlay?: string;
    blur?: number;
  };
  parallax?: boolean;
}

export interface LessonTheme {
  id: LessonThemeType;
  name: string;
  description: string;
  icon: React.ElementType;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  effects: ThemeEffects;
  background: ThemeBackground;
  components: {
    card: string;
    button: string;
    input: string;
    badge: string;
    progress: string;
  };
  sceneDefaults: {
    defaultBackground: string;
    defaultTransition: string;
    defaultNavigation: 'scroll' | 'click' | 'auto';
  };
}

// ============================================
// PREDEFINED THEMES
// ============================================

export const LESSON_THEMES: Record<LessonThemeType, LessonTheme> = {
  immersive: {
    id: 'immersive',
    name: 'Immersive',
    description: 'Full-screen backgrounds, cinematic transitions, and atmospheric design',
    icon: Film,
    colors: {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      accent: '#f59e0b',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff',
      textMuted: '#a1a1aa',
      border: '#27273f',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
      headingSizes: {
        h1: '4rem',
        h2: '2.5rem',
        h3: '1.75rem',
        h4: '1.25rem',
      },
      bodySize: '1rem',
      lineHeight: '1.6',
    },
    spacing: {
      section: '4rem',
      block: '2rem',
      element: '1rem',
    },
    effects: {
      borderRadius: '1rem',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      animationStyle: 'dynamic',
    },
    background: {
      default: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      },
      scene: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
        overlay: 'rgba(139, 92, 246, 0.05)',
      },
      parallax: true,
    },
    components: {
      card: 'bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6',
      button: 'bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all',
      input: 'bg-surface border border-border rounded-xl px-4 py-3 text-text focus:ring-2 focus:ring-primary',
      badge: 'bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium',
      progress: 'h-2 bg-surface rounded-full overflow-hidden',
    },
    sceneDefaults: {
      defaultBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      defaultTransition: 'fade-up',
      defaultNavigation: 'click',
    },
  },

  illustrated: {
    id: 'illustrated',
    name: 'Illustrated',
    description: 'Playful, hand-drawn style with warm colors and friendly elements',
    icon: Sparkles,
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#84cc16',
      background: '#fef3c7',
      surface: '#fffbeb',
      text: '#292524',
      textMuted: '#78716c',
      border: '#fde68a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      headingFont: 'Georgia, serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
      headingSizes: {
        h1: '3rem',
        h2: '2rem',
        h3: '1.5rem',
        h4: '1.125rem',
      },
      bodySize: '1rem',
      lineHeight: '1.7',
    },
    spacing: {
      section: '3rem',
      block: '1.5rem',
      element: '0.75rem',
    },
    effects: {
      borderRadius: '1.5rem',
      shadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      animationStyle: 'moderate',
    },
    background: {
      default: {
        type: 'solid',
        value: '#fef3c7',
      },
      scene: {
        type: 'solid',
        value: '#fffbeb',
      },
      parallax: false,
    },
    components: {
      card: 'bg-surface border-2 border-border rounded-2xl p-5 shadow-sm',
      button: 'bg-primary hover:bg-secondary text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all',
      input: 'bg-white border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary',
      badge: 'bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold',
      progress: 'h-3 bg-border rounded-full overflow-hidden',
    },
    sceneDefaults: {
      defaultBackground: '#fef3c7',
      defaultTransition: 'fade',
      defaultNavigation: 'scroll',
    },
  },

  infographic: {
    id: 'infographic',
    name: 'Infographic',
    description: 'Clean, data-driven design with charts, diagrams, and structured layouts',
    icon: BarChart3,
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      headingSizes: {
        h1: '2.5rem',
        h2: '1.75rem',
        h3: '1.25rem',
        h4: '1rem',
      },
      bodySize: '0.9375rem',
      lineHeight: '1.5',
    },
    spacing: {
      section: '2.5rem',
      block: '1.25rem',
      element: '0.625rem',
    },
    effects: {
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      animationStyle: 'subtle',
    },
    background: {
      default: {
        type: 'solid',
        value: '#ffffff',
      },
      scene: {
        type: 'solid',
        value: '#f8fafc',
      },
      parallax: false,
    },
    components: {
      card: 'bg-white border border-border rounded-lg p-4 shadow-sm',
      button: 'bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg transition-colors',
      input: 'bg-surface border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20',
      badge: 'bg-primary/10 text-primary px-2.5 py-0.5 rounded text-sm font-medium',
      progress: 'h-1.5 bg-border rounded-full overflow-hidden',
    },
    sceneDefaults: {
      defaultBackground: '#ffffff',
      defaultTransition: 'fade',
      defaultNavigation: 'scroll',
    },
  },

  storytelling: {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrative-focused design with character elements and emotional storytelling',
    icon: BookOpen,
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#1e1b4b',
      surface: '#312e81',
      text: '#f5f3ff',
      textMuted: '#a5b4fc',
      border: '#4338ca',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
    typography: {
      headingFont: 'Georgia, serif',
      bodyFont: 'Georgia, serif',
      headingWeight: '700',
      bodyWeight: '400',
      headingSizes: {
        h1: '3.5rem',
        h2: '2.25rem',
        h3: '1.5rem',
        h4: '1.125rem',
      },
      bodySize: '1.0625rem',
      lineHeight: '1.8',
    },
    spacing: {
      section: '3.5rem',
      block: '1.75rem',
      element: '0.875rem',
    },
    effects: {
      borderRadius: '0.75rem',
      shadow: '0 10px 40px -10px rgba(124, 58, 237, 0.3)',
      transition: 'all 0.4s ease',
      animationStyle: 'moderate',
    },
    background: {
      default: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      },
      scene: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
        overlay: 'rgba(236, 72, 153, 0.03)',
      },
      parallax: true,
    },
    components: {
      card: 'bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-5',
      button: 'bg-primary hover:bg-secondary text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-all',
      input: 'bg-surface/50 border border-border rounded-lg px-4 py-2.5 text-text placeholder:text-textMuted',
      badge: 'bg-accent/20 text-accent px-3 py-1 rounded-lg text-sm font-medium',
      progress: 'h-2.5 bg-surface rounded-full overflow-hidden',
    },
    sceneDefaults: {
      defaultBackground: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
      defaultTransition: 'fade-up',
      defaultNavigation: 'click',
    },
  },

  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Build your own theme with custom colors, typography, and effects',
    icon: Palette,
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      headingSizes: {
        h1: '2.5rem',
        h2: '1.75rem',
        h3: '1.25rem',
        h4: '1rem',
      },
      bodySize: '1rem',
      lineHeight: '1.6',
    },
    spacing: {
      section: '2rem',
      block: '1.5rem',
      element: '1rem',
    },
    effects: {
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      animationStyle: 'subtle',
    },
    background: {
      default: {
        type: 'solid',
        value: '#ffffff',
      },
      parallax: false,
    },
    components: {
      card: 'bg-surface border border-border rounded-lg p-4',
      button: 'bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg',
      input: 'bg-white border border-border rounded-lg px-3 py-2',
      badge: 'bg-primary/10 text-primary px-2 py-0.5 rounded text-sm',
      progress: 'h-2 bg-border rounded-full overflow-hidden',
    },
    sceneDefaults: {
      defaultBackground: '#ffffff',
      defaultTransition: 'fade',
      defaultNavigation: 'scroll',
    },
  },
};

// ============================================
// THEME SELECTOR COMPONENT
// ============================================

interface ThemeSelectorProps {
  selectedTheme: LessonThemeType;
  onSelectTheme: (theme: LessonThemeType) => void;
  showPreview?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
  showPreview = true,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose Theme</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(LESSON_THEMES).map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-200',
                'text-left hover:shadow-md',
                isSelected
                  ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50 dark:bg-primary-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {/* Theme Preview Background */}
              {showPreview && (
                <div
                  className="absolute inset-0 rounded-xl opacity-10"
                  style={{ background: theme.background.default.value }}
                />
              )}

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <span className="font-semibold text-gray-900 dark:text-white">{theme.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {theme.description}
                </p>

                {/* Color Swatches */}
                <div className="flex gap-1 mt-3">
                  {['primary', 'secondary', 'accent'].map((colorKey) => (
                    <div
                      key={colorKey}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.colors[colorKey as keyof ThemeColors] }}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// THEME PROVIDER CONTEXT
// ============================================

import { createContext, useContext } from 'react';

interface ThemeContextValue {
  theme: LessonTheme;
  themeType: LessonThemeType;
  setTheme: (theme: LessonThemeType) => void;
  getClassName: (component: keyof LessonTheme['components']) => string;
  getColor: (color: keyof ThemeColors) => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useLessonTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useLessonTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: LessonThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'immersive',
}) => {
  const [themeType, setThemeType] = React.useState<LessonThemeType>(initialTheme);
  const theme = LESSON_THEMES[themeType];

  const getClassName = (component: keyof LessonTheme['components']): string => {
    return theme.components[component];
  };

  const getColor = (color: keyof ThemeColors): string => {
    return theme.colors[color];
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, setTheme: setThemeType, getClassName, getColor }}>
      <div
        className="min-h-screen transition-colors duration-500"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.typography.bodyFont,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// ============================================
// THEME PREVIEW COMPONENT
// ============================================

interface ThemePreviewProps {
  theme: LessonThemeType;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme: themeType }) => {
  const theme = LESSON_THEMES[themeType];
  const Icon = theme.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{ background: theme.background.default.value }}
    >
      {/* Header */}
      <div className="p-6" style={{ background: theme.colors.surface }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: theme.colors.text }}>{theme.name}</h3>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>{theme.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Sample Card */}
        <div className={theme.components.card}>
          <h4 style={{ color: theme.colors.text }}>Sample Content</h4>
          <p style={{ color: theme.colors.textMuted }}>This is how your content will look with this theme.</p>
        </div>

        {/* Sample Buttons */}
        <div className="flex gap-2">
          <button className={theme.components.button}>Primary Button</button>
          <button className={cn(theme.components.button, 'bg-transparent border-2')} style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
            Secondary
          </button>
        </div>

        {/* Sample Progress */}
        <div className={theme.components.progress}>
          <div
            className="h-full rounded-full"
            style={{ width: '60%', backgroundColor: theme.colors.primary }}
          />
        </div>

        {/* Color Palette */}
        <div className="flex gap-2 pt-2">
          {Object.entries(theme.colors).slice(0, 6).map(([name, color]) => (
            <div key={name} className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] mt-1" style={{ color: theme.colors.textMuted }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default {
  LESSON_THEMES,
  ThemeSelector,
  ThemeProvider,
  useLessonTheme,
  ThemePreview,
};
