import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { ArrowRight } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const ctaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "primaryText", label: "Primary Button", type: "text", group: "Content" },
  { name: "primaryHref", label: "Primary Link", type: "text", group: "Content" },
  { name: "secondaryText", label: "Secondary Button", type: "text", group: "Content" },
  { name: "secondaryHref", label: "Secondary Link", type: "text", group: "Content" },
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Gradient", value: "gradient" },
      { label: "Solid", value: "solid" },
      { label: "Soft", value: "soft" },
    ], group: "Style"
  },
  {
    name: "align", label: "Alignment", type: "select", options: [
      { label: "Center", value: "center" }, { label: "Left", value: "left" },
    ], group: "Layout"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Ready to Transform Your Postpartum Journey?",
    subtitle = "Join thousands of parents who've found confidence, support, and expert guidance through Omugwo Academy.",
    // â”€â”€â”€ CTA Block Default â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    primaryText = "Explore Courses",
    primaryHref = "/courses",
    secondaryText = "Book Consultation",
    secondaryHref = "/contact",
    variant = "solid",
    align = "center",
    paddingY = "py-20",
    containerSize = "max-w-4xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const bgClass = variant === "gradient"
    ? "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
    : variant === "solid"
      ? "bg-primary-600"
      : "bg-primary-50";

  const textClass = variant === "soft" ? "text-gray-900" : "text-white";
  const subClass = variant === "soft" ? "text-gray-600" : "text-white/80";

  return (
    <section className={cn(paddingY, "px-6", bgClass)}>
      <div className={cn("mx-auto", containerSize, align === "center" ? "text-center" : "text-left")}>
        <AnimationWrapper animation={animConfig}>
          <h2
            className={cn("text-3xl md:text-4xl font-black mb-4", textClass)}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
          <p
            className={cn("text-lg mb-8 max-w-2xl", align === "center" && "mx-auto", subClass)}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>
          <div className={cn("flex gap-4 flex-wrap", align === "center" && "justify-center")}>
            {primaryText && (
              <a href={primaryHref} className={cn("inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-xl transition-all shadow-sm", variant === "soft" ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-white text-primary-700 hover:bg-gray-50 hover:scale-105")} onClick={(e) => e.preventDefault()}>
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("primaryText", e.currentTarget.textContent || "")}
                >
                  {primaryText}
                </span>{" "}
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
            {secondaryText && (
              <a href={secondaryHref} className={cn("inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-xl border-2 transition-all", variant === "soft" ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-white text-white hover:bg-white hover:text-primary-600")} onClick={(e) => e.preventDefault()}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("secondaryText", e.currentTarget.textContent || "")}
                >
                  {secondaryText}
                </span>
              </a>
            )}
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};
