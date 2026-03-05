import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const statsBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  {
    name: "stats", label: "Stats", type: "array", arrayItemSchema: [
      { name: "value", label: "Value", type: "text" },
      { name: "label", label: "Label", type: "text" },
      { name: "suffix", label: "Suffix", type: "text" },
    ], group: "Content"
  },
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Light", value: "light" }, { label: "Dark", value: "dark" }, { label: "Primary", value: "primary" },
    ], group: "Style"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const StatsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const {
    title,
    stats = [
      { value: "15,000", label: "Active Students", suffix: "+" },
      { value: "48", label: "Expert-Led Lessons", suffix: "" },
      { value: "4.9", label: "Average Rating", suffix: "/5" },
      { value: "98", label: "Completion Rate", suffix: "%" },
    ],
    variant = "light",
    paddingY = "py-16",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateStat = (idx: number, key: string, value: any) => {
    const next = (stats || []).map((s: any, i: number) => (i === idx ? { ...s, [key]: value } : s));
    handleChange("stats", next);
  };

  const bg = variant === "dark" ? "bg-gray-900" : variant === "primary" ? "bg-primary-600" : "bg-white";
  const text = variant === "light" ? "text-gray-900" : "text-white";
  const sub = variant === "light" ? "text-gray-500" : "text-white/70";

  return (
    <section className={cn(paddingY, "px-6", bg)}>
      <div className={cn("mx-auto", containerSize)}>
        {title && (
          <h2
            className={cn("text-2xl font-black text-center mb-12", text)}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
        )}
        <div className={cn("grid gap-8", getResponsiveGridClasses(4, device))}>
          {stats.map((stat: any, idx: number) => (
            <AnimationWrapper key={idx} animation={animConfig} index={idx} className="text-center">
              <p className={cn("text-4xl md:text-5xl font-black mb-2", text)}>
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateStat(idx, "value", e.currentTarget.textContent || "")}
                >
                  {stat.value}
                </span>
                <span
                  className="text-primary-400"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateStat(idx, "suffix", e.currentTarget.textContent || "")}
                >
                  {stat.suffix}
                </span>
              </p>
              <p
                className={cn("text-sm font-medium", sub)}
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => updateStat(idx, "label", e.currentTarget.textContent || "")}
              >
                {stat.label}
              </p>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
