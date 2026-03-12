/**
 * Animated Transitions System
 * 
 * Comprehensive animation components for interactive lessons:
 * - Scene transitions (fade, slide, zoom, parallax)
 * - Content reveal animations (scroll-reveal, entrance)
 * - Interactive element animations
 * - Page-level transitions
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence, useInView, useAnimation, Variants } from 'framer-motion';

// ============================================
// TRANSITION TYPES
// ============================================

export type TransitionType = 
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'rotate'
  | 'blur'
  | 'parallax'
  | 'none';

export type TransitionTiming = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'bounce';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  delay?: number;
  timing?: TransitionTiming;
  stagger?: number;
}

export interface SceneTransitionProps {
  children: React.ReactNode;
  transition?: TransitionConfig;
  isActive?: boolean;
  className?: string;
}

// ============================================
// TRANSITION VARIANTS
// ============================================

const TRANSITION_VARIANTS: Record<TransitionType, { enter: any; exit: any; initial: any }> = {
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'fade-up': {
    initial: { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  'fade-down': {
    initial: { opacity: 0, y: -30 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  },
  'fade-left': {
    initial: { opacity: 0, x: 30 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  'fade-right': {
    initial: { opacity: 0, x: -30 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
  'slide-up': {
    initial: { y: '100%' },
    enter: { y: 0 },
    exit: { y: '-100%' },
  },
  'slide-down': {
    initial: { y: '-100%' },
    enter: { y: 0 },
    exit: { y: '100%' },
  },
  'slide-left': {
    initial: { x: '100%' },
    enter: { x: 0 },
    exit: { x: '-100%' },
  },
  'slide-right': {
    initial: { x: '-100%' },
    enter: { x: 0 },
    exit: { x: '100%' },
  },
  'zoom-in': {
    initial: { scale: 0.8, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
  },
  'zoom-out': {
    initial: { scale: 1.1, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    enter: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  rotate: {
    initial: { rotate: -10, opacity: 0 },
    enter: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
  },
  blur: {
    initial: { filter: 'blur(10px)', opacity: 0 },
    enter: { filter: 'blur(0px)', opacity: 1 },
    exit: { filter: 'blur(10px)', opacity: 0 },
  },
  parallax: {
    initial: { y: 50, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  none: {
    initial: {},
    enter: {},
    exit: {},
  },
};

const TIMING_MAP: Record<TransitionTiming, string> = {
  ease: 'ease',
  'ease-in': 'easeIn',
  'ease-out': 'easeOut',
  'ease-in-out': 'easeInOut',
  linear: 'linear',
  bounce: 'bounce',
};

// ============================================
// SCENE TRANSITION COMPONENT
// ============================================

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  transition = { type: 'fade', duration: 0.5 },
  isActive = true,
  className,
}) => {
  const variants = TRANSITION_VARIANTS[transition.type];
  const timing = transition.timing ? TIMING_MAP[transition.timing] : 'easeInOut';

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={cn('w-full h-full', className)}
          initial={variants.initial}
          animate={variants.enter}
          exit={variants.exit}
          transition={{
            duration: transition.duration,
            delay: transition.delay || 0,
            ease: timing,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// SCENE WRAPPER WITH TRANSITIONS
// ============================================

interface AnimatedSceneWrapperProps {
  children: React.ReactNode;
  sceneId: string;
  transition?: TransitionConfig;
  background?: string;
  className?: string;
}

export const AnimatedSceneWrapper: React.FC<AnimatedSceneWrapperProps> = ({
  children,
  sceneId,
  transition = { type: 'fade-up', duration: 0.6 },
  background,
  className,
}) => {
  return (
    <SceneTransition
      transition={transition}
      className={cn('min-h-screen relative', className)}
      key={sceneId}
    >
      {background && (
        <div
          className="absolute inset-0 -z-10"
          style={{ background }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </SceneTransition>
  );
};

// ============================================
// SCROLL REVEAL COMPONENT
// ============================================

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: TransitionType;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  triggerOnce = true,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    margin: '-100px' as any
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  const variants = {
    hidden: TRANSITION_VARIANTS[animation].initial,
    visible: {
      ...TRANSITION_VARIANTS[animation].enter,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// STAGGERED CHILDREN ANIMATION
// ============================================

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  animation?: TransitionType;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  animation = 'fade-up',
  className,
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const childVariants = {
    hidden: TRANSITION_VARIANTS[animation].initial,
    visible: {
      ...TRANSITION_VARIANTS[animation].enter,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

// ============================================
// ENTRANCE ANIMATION COMPONENT
// ============================================

interface EntranceAnimationProps {
  children: React.ReactNode;
  animation?: TransitionType;
  delay?: number;
  duration?: number;
  trigger?: 'mount' | 'hover' | 'click';
  className?: string;
}

export const EntranceAnimation: React.FC<EntranceAnimationProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.5,
  trigger = 'mount',
  className,
}) => {
  const [isAnimated, setIsAnimated] = useState(trigger === 'mount');
  const variants = TRANSITION_VARIANTS[animation];

  const triggerAnimation = useCallback(() => {
    if (trigger !== 'mount') {
      setIsAnimated(true);
    }
  }, [trigger]);

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      animate={isAnimated ? variants.enter : variants.initial}
      transition={{ duration, delay, ease: 'easeOut' }}
      onMouseEnter={trigger === 'hover' ? triggerAnimation : undefined}
      onClick={trigger === 'click' ? triggerAnimation : undefined}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// PARALLAX CONTAINER
// ============================================

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  className,
}) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const parallaxOffset = (scrollProgress - 0.5) * speed * 100;
        setOffset(parallaxOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  const transform = direction === 'vertical'
    ? `translateY(${offset}px)`
    : `translateX(${offset}px)`;

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

// ============================================
// ANIMATED COUNTER
// ============================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1,
  formatValue = (v) => v.toLocaleString(),
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = displayValue;
    const endValue = value;
    const diff = endValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + diff * eased;
      
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={className}>
      {formatValue(displayValue)}
    </span>
  );
};

// ============================================
// TYPING ANIMATION
// ============================================

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  className?: string;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  onComplete,
  className,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      timeoutId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timeoutId);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timeoutId);
    };
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    if (isComplete && cursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isComplete, cursor]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && (
        <span className={cn(
          'inline-block ml-0.5',
          !showCursor && 'opacity-0'
        )}>
          {cursorChar}
        </span>
      )}
    </span>
  );
};

// ============================================
// PULSE ANIMATION
// ============================================

interface PulseAnimationProps {
  children: React.ReactNode;
  pulseScale?: number;
  duration?: number;
  trigger?: boolean;
  className?: string;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  pulseScale = 1.05,
  duration = 0.3,
  trigger,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? { scale: [1, pulseScale, 1] } : {}}
      transition={{ duration, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// SHAKE ANIMATION
// ============================================

interface ShakeAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export const ShakeAnimation: React.FC<ShakeAnimationProps> = ({
  children,
  trigger = false,
  intensity = 'medium',
  className,
}) => {
  const intensityValues = {
    light: 2,
    medium: 5,
    heavy: 10,
  };

  const shake = intensityValues[intensity];

  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [0, -shake, shake, -shake, shake, 0],
      } : {}}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// TRANSITION PRESETS
// ============================================

export const TRANSITION_PRESETS = {
  // Scene transitions
  sceneEnter: { type: 'fade-up' as TransitionType, duration: 0.6, timing: 'ease-out' as TransitionTiming },
  sceneExit: { type: 'fade' as TransitionType, duration: 0.3, timing: 'ease-in' as TransitionTiming },
  sceneSlide: { type: 'slide-left' as TransitionType, duration: 0.5, timing: 'ease-in-out' as TransitionTiming },
  
  // Content reveals
  contentFade: { type: 'fade' as TransitionType, duration: 0.4, delay: 0.1 },
  contentSlideUp: { type: 'fade-up' as TransitionType, duration: 0.5, delay: 0.2 },
  contentZoom: { type: 'zoom-in' as TransitionType, duration: 0.4, delay: 0.1 },
  
  // Interactive elements
  buttonPop: { type: 'zoom-in' as TransitionType, duration: 0.2 },
  cardFlip: { type: 'flip' as TransitionType, duration: 0.6 },
  modalEnter: { type: 'zoom-in' as TransitionType, duration: 0.3, timing: 'ease-out' as TransitionTiming },
  
  // Special effects
  dramatic: { type: 'zoom-out' as TransitionType, duration: 0.8, timing: 'ease-in-out' as TransitionTiming },
  cinematic: { type: 'fade' as TransitionType, duration: 1.0, timing: 'ease-in-out' as TransitionTiming },
  playful: { type: 'rotate' as TransitionType, duration: 0.5, timing: 'bounce' as TransitionTiming },
};

// ============================================
// CSS ANIMATION UTILITIES (for tailwind)
// ============================================

export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  zoomIn: 'animate-zoom-in',
  zoomOut: 'animate-zoom-out',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
};

export default {
  SceneTransition,
  AnimatedSceneWrapper,
  ScrollReveal,
  StaggerContainer,
  EntranceAnimation,
  ParallaxContainer,
  AnimatedCounter,
  TypingAnimation,
  PulseAnimation,
  ShakeAnimation,
  TRANSITION_PRESETS,
  ANIMATION_CLASSES,
};
