import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Heart, Shield, BookOpen, Users, Star, Zap, Award, Target } from "lucide-react";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { InlineText } from "../components/InlineText";

const ICON_MAP: Record<string, React.FC<any>> = {
  heart: Heart, shield: Shield, book: BookOpen, users: Users,
  star: Star, zap: Zap, award: Award, target: Target,
};

export const featuresBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Cards", value: "cards" },
      { label: "Icons Left", value: "icons-left" },
      { label: "Icons Top (Centered)", value: "icons-top" },
      { label: "Minimal", value: "minimal" },
    ], group: "Layout"
  },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "align", label: "Card Alignment", type: "select", options: [
      { label: "Left", value: "left" }, { label: "Center", value: "center" },
    ], group: "Layout"
  },
  {
    name: "textAlign", label: "Text Alignment", type: "select", options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ], group: "Layout"
  },
  {
    name: "columns", label: "Columns", type: "select", options: [
      { label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" },
    ], group: "Layout"
  },
  {
    name: "features", label: "Features", type: "array", arrayItemSchema: [
      {
        name: "icon", label: "Icon", type: "select", options: [
          { label: "Heart", value: "heart" }, { label: "Shield", value: "shield" },
          { label: "Book", value: "book" }, { label: "Users", value: "users" },
          { label: "Star", value: "star" }, { label: "Zap", value: "zap" },
          { label: "Award", value: "award" }, { label: "Target", value: "target" },
          { label: "Baby", value: "baby" }, { label: "Mic", value: "mic" },
        ]
      },
      { name: "badge", label: "Badge", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
    ], group: "Content"
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const FeaturesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const {
    variant = "cards",
    badgeText = "",
    title = "Why Choose Omugwo Academy",
    subtitle = "A holistic approach to postpartum care that honors tradition while embracing modern science.",
    align = "left",
    textAlign = "left",
    columns = "3",
    features = [
      { icon: "heart", title: "Evidence-Based Care", description: "Our curriculum is developed by medical professionals and backed by research." },
      { icon: "shield", title: "Cultural Sensitivity", description: "We honor traditional Omugwo practices while integrating modern healthcare." },
      { icon: "book", title: "Expert-Led Content", description: "Learn from certified professionals with decades of experience." },
      { icon: "users", title: "Community Support", description: "Join 15,000+ parents in our supportive online community." },
      { icon: "star", title: "Flexible Learning", description: "Study at your own pace with lifetime access to all materials." },
      { icon: "award", title: "Certified Completion", description: "Earn a verified certificate upon completing each course." },
    ],
    backgroundColor,
    paddingY = "py-20",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateFeature = (idx: number, key: string, value: any) => {
    const next = (features || []).map((f: any, i: number) => (i === idx ? { ...f, [key]: value } : f));
    handleChange("features", next);
  };

  const renderFeatureItem = (feature: any, idx: number) => {
    const IconComp = ICON_MAP[feature.icon] || Heart;

    if (variant === "icons-left") {
      return (
        <AnimationWrapper key={idx} animation={animConfig} index={idx} className="flex gap-5">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 text-primary-600">
            <IconComp className="w-6 h-6" />
          </div>
          <div>
            {feature.badge && (
              <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-2">
                {feature.badge}
              </span>
            )}
            <InlineText
              element="h3"
              className="text-lg font-bold text-gray-900 mb-1"
              value={feature.title}
              onChange={(val) => updateFeature(idx, "title", val)}
              selected={selected}
            />
            <InlineText
              element="p"
              className="text-gray-600 text-sm"
              value={feature.description}
              onChange={(val) => updateFeature(idx, "description", val)}
              selected={selected}
            />
          </div>
        </AnimationWrapper>
      );
    }

    if (variant === "icons-top") {
      return (
        <AnimationWrapper key={idx} animation={animConfig} index={idx} className="text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
            <IconComp className="w-7 h-7" />
          </div>
          {feature.badge && (
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-3">
              {feature.badge}
            </span>
          )}
          <InlineText
            element="h3"
            className="text-lg font-bold text-gray-900 mb-2"
            value={feature.title}
            onChange={(val) => updateFeature(idx, "title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-gray-600 text-sm"
            value={feature.description}
            onChange={(val) => updateFeature(idx, "description", val)}
            selected={selected}
          />
        </AnimationWrapper>
      );
    }

    if (variant === "minimal") {
      return (
        <AnimationWrapper key={idx} animation={animConfig} index={idx} className="border-l-4 border-primary-500 pl-5 py-2">
          {feature.badge && (
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-2">
              {feature.badge}
            </span>
          )}
          <InlineText
            element="h3"
            className="text-lg font-bold text-gray-900 mb-1"
            value={feature.title}
            onChange={(val) => updateFeature(idx, "title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-gray-600 text-sm"
            value={feature.description}
            onChange={(val) => updateFeature(idx, "description", val)}
            selected={selected}
          />
        </AnimationWrapper>
      );
    }

    // Default: cards
    return (
      <AnimationWrapper key={idx} animation={{ ...animConfig, type: "slideUp", delay: idx * 0.1 }} index={idx} className={cn("bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group", align === "center" ? "text-center" : "text-left")}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0"></div>
        <div className="relative z-10">
          {feature.badge && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-6">
              {feature.badge}
            </span>
          )}
          <div className={cn("w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600", align === "center" ? "mx-auto" : "")}>
            <IconComp className="w-8 h-8" />
          </div>
          <InlineText
            element="h3"
            className="text-2xl font-bold text-gray-900 mb-4"
            value={feature.title}
            onChange={(val) => updateFeature(idx, "title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-gray-600 leading-relaxed"
            value={feature.description}
            onChange={(val) => updateFeature(idx, "description", val)}
            selected={selected}
          />
        </div>
      </AnimationWrapper>
    );
  };

  return (
    <section className={cn(paddingY, "px-6", backgroundColor ? "" : "bg-gray-50")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto", containerSize)}>
        <AnimationWrapper animation={animConfig} className={cn("max-w-3xl mx-auto mb-16", textAlign === "center" && "text-center", textAlign === "right" && "text-right", textAlign === "left" && "text-left")}>
          {badgeText && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-700 text-sm font-bold rounded-full mb-4 shadow-sm">
              {badgeText}
            </span>
          )}
          <InlineText
            element="h2"
            className="text-3xl md:text-5xl font-black text-gray-900 mb-6"
            value={title}
            onChange={(val) => handleChange("title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-xl text-gray-600"
            value={subtitle}
            onChange={(val) => handleChange("subtitle", val)}
            selected={selected}
          />
        </AnimationWrapper>
        <div className={cn("grid gap-8", getResponsiveGridClasses(Number(columns || 3), device))}>
          {features.map((feature: any, idx: number) => renderFeatureItem(feature, idx))}
        </div>
      </div>
    </section>
  );
};
