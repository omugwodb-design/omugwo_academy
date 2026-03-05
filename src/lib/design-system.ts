// Enhanced Design System - Matching Original Landing Page

export const shadows = {
  // Layered shadow system
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Premium layered shadows (for cards)
  card: '0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.08)',
  cardHover: '0 4px 8px rgba(0, 0, 0, 0.06), 0 12px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02)',
  
  // Glow effects
  glow: '0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.15)',
  glowStrong: '0 0 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const spacing = {
  section: {
    desktop: '120px',
    tablet: '80px',
    mobile: '60px',
  },
  container: {
    padding: {
      desktop: '2rem',
      tablet: '1.5rem',
      mobile: '1rem',
    },
  },
};

export const gradients = {
  primary: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  primarySoft: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  hero: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.3) 100%)',
  heroRadial: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
  ctaGlow: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
  text: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  sectionBg: 'linear-gradient(180deg, #FFFFFF 0%, #F9F7FF 100%)',
  darkSection: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
};

export const typography = {
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

export const animations = {
  hover: {
    lift: 'transform: translateY(-4px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    scale: 'transform: scale(1.02); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    glow: 'box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); transition: all 0.3s ease;',
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const colors = {
  primary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#7C3AED', // Main primary
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  secondary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Main secondary
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
};

// Utility function to apply design system
export const applyDesignSystem = () => {
  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--shadow-card', shadows.card);
  root.style.setProperty('--shadow-card-hover', shadows.cardHover);
  root.style.setProperty('--shadow-glow', shadows.glow);
  root.style.setProperty('--border-radius-lg', borderRadius.lg);
  root.style.setProperty('--border-radius-xl', borderRadius.xl);
  root.style.setProperty('--gradient-primary', gradients.primary);
  root.style.setProperty('--gradient-hero', gradients.hero);
};
