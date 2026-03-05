import React from "react";
import { motion, Variants } from "framer-motion";

export type AnimationType =
  | "none"
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "bounce"
  | "flip";

export type AnimationTrigger = "onLoad" | "onScroll" | "onHover";

export interface AnimationConfig {
  type?: AnimationType;
  trigger?: AnimationTrigger;
  duration?: number;
  delay?: number;
  easing?: string;
}

const ANIMATION_VARIANTS: Record<AnimationType, Variants> = {
  none: { hidden: {}, visible: {} },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  bounce: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
};

interface AnimationWrapperProps {
  animation?: AnimationConfig;
  className?: string;
  children: React.ReactNode;
  /** Index for stagger delay */
  index?: number;
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  animation,
  className,
  children,
  index = 0,
}) => {
  const type = animation?.type || "none";
  const trigger = animation?.trigger || "onScroll";
  const duration = animation?.duration ?? 0.6;
  const delay = (animation?.delay ?? 0) + index * 0.08;

  if (type === "none") {
    return <div className={className}>{children}</div>;
  }

  const variants = ANIMATION_VARIANTS[type] || ANIMATION_VARIANTS.none;

  const transitionConfig = {
    duration,
    delay,
    ease: animation?.easing === "spring" ? undefined : [0.25, 0.46, 0.45, 0.94],
  };

  if (trigger === "onHover") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        whileHover="visible"
        variants={variants}
        transition={transitionConfig}
      >
        {children}
      </motion.div>
    );
  }

  if (trigger === "onScroll") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={variants}
        transition={transitionConfig}
      >
        {children}
      </motion.div>
    );
  }

  // onLoad
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  );
};

/** Shared animation schema fields to add to any block's propSchema */
export const animationSchemaFields = [
  {
    name: "animationType",
    label: "Animation",
    type: "select" as const,
    options: [
      { label: "None", value: "none" },
      { label: "Fade In", value: "fadeIn" },
      { label: "Slide Up", value: "slideUp" },
      { label: "Slide Down", value: "slideDown" },
      { label: "Slide Left", value: "slideLeft" },
      { label: "Slide Right", value: "slideRight" },
      { label: "Zoom In", value: "zoomIn" },
      { label: "Bounce", value: "bounce" },
      { label: "Flip", value: "flip" },
    ],
    group: "Animation",
  },
  {
    name: "animationTrigger",
    label: "Trigger",
    type: "select" as const,
    options: [
      { label: "On Scroll", value: "onScroll" },
      { label: "On Load", value: "onLoad" },
      { label: "On Hover", value: "onHover" },
    ],
    group: "Animation",
  },
  {
    name: "animationDuration",
    label: "Duration (s)",
    type: "number" as const,
    min: 0.1,
    max: 3,
    step: 0.1,
    group: "Animation",
  },
  {
    name: "animationDelay",
    label: "Delay (s)",
    type: "number" as const,
    min: 0,
    max: 2,
    step: 0.1,
    group: "Animation",
  },
];

/** Padding and sizing options */
export const sizingSchemaFields = [
  {
    name: "paddingY",
    label: "Vertical Padding",
    type: "select" as const,
    options: [
      { label: "None", value: "py-0" },
      { label: "Extra Small", value: "py-8" },
      { label: "Small", value: "py-16" },
      { label: "Medium", value: "py-24" },
      { label: "Large", value: "py-32" },
      { label: "Extra Large", value: "py-40" },
      { label: "Screen Height", value: "py-52" },
    ],
    group: "Style",
  },
  {
    name: "containerSize",
    label: "Container Width",
    type: "select" as const,
    options: [
      { label: "Full", value: "max-w-full" },
      { label: "Extra Large (8xl)", value: "max-w-[1440px]" },
      { label: "Large (7xl)", value: "max-w-7xl" },
      { label: "Medium (5xl)", value: "max-w-5xl" },
      { label: "Small (3xl)", value: "max-w-3xl" },
      { label: "Extra Small (xl)", value: "max-w-xl" },
    ],
    group: "Style",
  },
];

/** Helper to extract AnimationConfig from block props */
export const getAnimationConfig = (props: Record<string, any>): AnimationConfig => ({
  type: props.animationType || "none",
  trigger: props.animationTrigger || "onScroll",
  duration: props.animationDuration ?? 0.6,
  delay: props.animationDelay ?? 0,
});
