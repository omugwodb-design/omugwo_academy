import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const countdownBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Cards", value: "cards" },
    { label: "Inline", value: "inline" },
    { label: "Minimal", value: "minimal" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "targetDate", label: "Target Date (YYYY-MM-DD)", type: "text", group: "Content" },
  { name: "ctaText", label: "Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "Button Link", type: "text", group: "Content" },
  { name: "expiredText", label: "Expired Text", type: "text", group: "Content" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  { name: "darkMode", label: "Dark Mode", type: "boolean", group: "Style" },
  ...animationSchemaFields,
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calcTimeLeft = (target: string): TimeLeft | null => {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const CountdownBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    variant = "cards",
    title = "Launch Countdown",
    subtitle = "Something amazing is coming. Don't miss it!",
    targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    ctaText = "Notify Me",
    ctaLink = "#",
    expiredText = "The event has started!",
    backgroundColor,
    darkMode = false,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const isDark = darkMode;
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";
  const bg = isDark ? "bg-gray-900" : "";

  const units = timeLeft
    ? [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ]
    : [];

  const renderUnits = () => {
    if (!timeLeft) {
      return (
        <p className={cn("text-2xl font-bold", textMain)}>
          {expiredText}
        </p>
      );
    }

    if (variant === "inline") {
      return (
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {units.map((u) => (
            <div key={u.label} className="flex items-baseline gap-1">
              <span className={cn("text-4xl md:text-5xl font-black", textMain)}>
                {String(u.value).padStart(2, "0")}
              </span>
              <span className={cn("text-sm font-medium", textSub)}>{u.label}</span>
            </div>
          ))}
        </div>
      );
    }

    if (variant === "minimal") {
      return (
        <div className="flex items-center gap-2 justify-center text-center">
          {units.map((u, i) => (
            <React.Fragment key={u.label}>
              <span className={cn("text-3xl md:text-4xl font-black tabular-nums", textMain)}>
                {String(u.value).padStart(2, "0")}
              </span>
              {i < units.length - 1 && <span className={cn("text-2xl font-bold", textSub)}>:</span>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    // Default: cards
    return (
      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {units.map((u) => (
          <div
            key={u.label}
            className={cn(
              "rounded-2xl p-4 text-center",
              isDark ? "bg-white/10 backdrop-blur" : "bg-white shadow-sm"
            )}
          >
            <p className={cn("text-3xl md:text-4xl font-black tabular-nums", textMain)}>
              {String(u.value).padStart(2, "0")}
            </p>
            <p className={cn("text-xs font-medium uppercase mt-1", textSub)}>{u.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className={cn("py-20 px-6", bg)}
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <AnimationWrapper animation={animConfig}>
          {title && (
            <h2
              className={cn("text-3xl md:text-4xl font-black mb-4", textMain)}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn("text-lg mb-10", textSub)}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>
          )}
        </AnimationWrapper>

        <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }}>
          {renderUnits()}
        </AnimationWrapper>

        {ctaText && timeLeft && (
          <AnimationWrapper animation={{ ...animConfig, delay: 0.4 }} className="mt-10">
            <a
              href={ctaLink}
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
              onClick={(e) => e.preventDefault()}
            >
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
              >
                {ctaText}
              </span>
            </a>
          </AnimationWrapper>
        )}
      </div>
    </section>
  );
};
