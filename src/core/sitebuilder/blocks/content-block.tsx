import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { AnimatedBlob } from "../components/AnimatedBlob";
import { DraggableElement } from "../components/DraggableElement";
import { InlineText } from "../components/InlineText";

export const contentBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Image Right", value: "image-right" },
      { label: "Image Left", value: "image-left" },
      { label: "Full Width", value: "full-width" },
      { label: "Cards", value: "cards" },
    ], group: "Layout"
  },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "badgeVariant", label: "Badge Style", type: "select", options: [{ label: "Default", value: "default" }, { label: "Warning", value: "warning" }], group: "Style" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "body", label: "Body", type: "richtext", group: "Content" },
  { name: "image", label: "Image", type: "image", group: "Content" },
  {
    name: "imagePosition", label: "Image Position", type: "select", options: [
      { label: "Left", value: "left" }, { label: "Right", value: "right" },
    ], group: "Layout"
  },
  {
    name: "imageEffect", label: "Image Effect", type: "select", options: [
      { label: "None", value: "none" },
      { label: "Rotated Background (Right)", value: "rotate-right" },
      { label: "Rotated Background (Left)", value: "rotate-left" },
      { label: "Animated Blob", value: "animated-blob" },
    ], group: "Style"
  },
  { name: "quoteText", label: "Quote Overlay", type: "textarea", group: "Content" },
  { name: "ctaText", label: "Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "Button Link", type: "text", group: "Content" },
  { name: "ctaVariant", label: "Button Style", type: "select", options: [{ label: "Solid", value: "solid" }, { label: "Outline", value: "outline" }], group: "Style" },
  { name: "imageOffsetX", label: "Image X", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "imageOffsetY", label: "Image Y", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "quoteOffsetX", label: "Quote X", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "quoteOffsetY", label: "Quote Y", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "textOffsetX", label: "Text X", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "textOffsetY", label: "Text Y", type: "number", min: -500, max: 500, step: 1, group: "Layout" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  {
    name: "textAlign", label: "Text Alignment", type: "select", options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ], group: "Layout"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ContentBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    badgeText = "",
    badgeVariant = "default",
    title = "Our Story",
    body = "Omugwo Academy was born from a deep understanding that the postpartum period is one of the most transformative   and often most challenging   times in a family's life. Founded by Dr. Megor Ikuenobe, our mission is to bridge the gap between traditional African postnatal wisdom and modern evidence-based care.",
    image = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    imagePosition = "right",
    imageEffect = "none",
    quoteText = "",
    ctaText = "Learn More",
    ctaLink = "#",
    ctaVariant = "solid",
    backgroundColor,
    paddingY = "py-20",
    containerSize = "max-w-7xl",
    imageOffsetX = 0,
    imageOffsetY = 0,
    quoteOffsetX = 0,
    quoteOffsetY = 0,
    textOffsetX = 0,
    textOffsetY = 0,
    textAlign = "left",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const stopBlockSelection = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <section className={cn(paddingY, "px-4 md:px-8")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto grid lg:grid-cols-2 gap-16 items-center", containerSize)}>
        <AnimationWrapper
          animation={animConfig}
          className={cn(imagePosition === "left" ? "order-2" : "order-1", "relative")}
        >
          <DraggableElement
            id="textGroup"
            initialX={Number(textOffsetX) || 0}
            initialY={Number(textOffsetY) || 0}
            selected={selected}
            label="Drag Text"
            onUpdateXY={(x, y) => {
              handleChange("textOffsetX", x);
              handleChange("textOffsetY", y);
            }}
            className="w-full"
            style={{ textAlign }}
          >
            {badgeText && (
              <span className={cn(
                "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6",
                badgeVariant === "warning" ? "bg-amber-100 text-amber-800" : "bg-primary-100 text-primary-700"
              )}>
                {badgeText}
              </span>
            )}
            <InlineText
              element="h2"
              className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight"
              value={title}
              onChange={(val) => handleChange("title", val)}
              selected={selected}
            />
            <InlineText
              element="p"
              className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line"
              value={body}
              onChange={(val) => handleChange("body", val)}
              selected={selected}
            />
            {ctaText && (
              <a href={ctaLink} className={cn(
                "inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all shadow-sm gap-2 mt-4",
                ctaVariant === "outline" ? "border-2 border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-primary-600 text-white hover:bg-primary-700"
              )} onClick={(e) => {
                if (selected) e.preventDefault();
              }}>
                <InlineText
                  element="span"
                  value={ctaText}
                  onChange={(val) => handleChange("ctaText", val)}
                  selected={selected}
                />
                {ctaVariant === "outline" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </a>
            )}
          </DraggableElement>
        </AnimationWrapper>
        <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }} className={cn("relative", imagePosition === "left" ? "order-1" : "order-2")}>
          {image && (
            <div className="relative">
              {imageEffect === "rotate-right" && (
                <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] rotate-3 opacity-50 z-0" />
              )}
              {imageEffect === "rotate-left" && (
                <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] -rotate-3 opacity-50 z-0" />
              )}
              {imageEffect === "animated-blob" && (
                <AnimatedBlob className="-inset-2 -translate-x-2 -translate-y-2" />
              )}
              <DraggableElement
                id="image"
                initialX={Number(imageOffsetX) || 0}
                initialY={Number(imageOffsetY) || 0}
                selected={selected}
                label="Drag Image"
                onUpdateXY={(x, y) => {
                  handleChange("imageOffsetX", x);
                  handleChange("imageOffsetY", y);
                }}
                className="w-full z-10"
              >
                <img
                  src={image}
                  alt={title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full rounded-[2.5rem] shadow-2xl object-cover relative z-10"
                />
              </DraggableElement>

              {quoteText && (
                <DraggableElement
                  id="quote"
                  initialX={Number(quoteOffsetX) || 0}
                  initialY={Number(quoteOffsetY) || 0}
                  selected={selected}
                  label="Drag Quote"
                  onUpdateXY={(x, y) => {
                    handleChange("quoteOffsetX", x);
                    handleChange("quoteOffsetY", y);
                  }}
                  className="absolute -bottom-8 -right-8 max-w-xs z-10"
                >
                  <div className="bg-primary-600 text-white p-8 rounded-3xl shadow-xl w-full h-full">
                    <svg className="w-8 h-8 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="font-semibold italic leading-relaxed">{quoteText}</p>
                  </div>
                </DraggableElement>
              )}
            </div>
          )}
        </AnimationWrapper>
      </div>
    </section>
  );
};
