import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const testimonialsBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Cards Grid", value: "cards" },
      { label: "Carousel", value: "carousel" },
      { label: "Spotlight", value: "spotlight" },
      { label: "Minimal", value: "minimal" },
    ], group: "Layout"
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "testimonials", label: "Testimonials", type: "array", arrayItemSchema: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "avatar", label: "Avatar URL", type: "image" },
      { name: "text", label: "Testimonial", type: "textarea" },
      { name: "rating", label: "Rating", type: "number", min: 1, max: 5 },
    ], group: "Content"
  },
  {
    name: "columns", label: "Columns", type: "select", options: [
      { label: "2", value: "2" }, { label: "3", value: "3" },
    ], group: "Layout"
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  { name: "textColor", label: "Text Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const TestimonialsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const {
    variant = "cards",
    title = "What Our Students Say",
    subtitle = "Real stories from real parents who transformed their postpartum experience.",
    testimonials = [
      { name: "Adaeze O.", role: "First-time Mom", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100", text: "This course literally saved my postpartum experience. I went from feeling lost to feeling empowered.", rating: 5 },
      { name: "Chukwuemeka E.", role: "New Dad", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", text: "As a first-time dad, I had no idea how to support my wife. This training changed everything.", rating: 5 },
      { name: "Ngozi A.", role: "Mother of Three", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", text: "Even on my third child, I learned so much. The cultural balance module was eye-opening.", rating: 5 },
    ],
    columns = "3",
    backgroundColor,
    textColor,
    paddingY = "py-20",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateTestimonial = (idx: number, key: string, value: any) => {
    const next = (testimonials || []).map((t: any, i: number) => (i === idx ? { ...t, [key]: value } : t));
    handleChange("testimonials", next);
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: rating || 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );

  const renderCard = (t: any, idx: number) => (
    <AnimationWrapper key={idx} animation={{ ...animConfig, type: "slideUp", delay: idx * 0.1 }} index={idx} className={cn("rounded-[2rem] p-8 border backdrop-blur transition-all", textColor === "#ffffff" ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm hover:shadow-md")}>
      <div className="flex items-center gap-1 mb-4 text-yellow-400">
        {renderStars(t.rating)}
      </div>
      <p className={cn("mb-6 leading-relaxed", textColor === "#ffffff" ? "text-gray-300" : "text-gray-700")} contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "text", e.currentTarget.textContent || "")}>
        "{t.text}"
      </p>
      <div className="flex items-center gap-4">
        {t.avatar && <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />}
        <div>
          <p className={cn("font-bold", textColor === "#ffffff" ? "text-white" : "text-gray-900")} contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "name", e.currentTarget.textContent || "")}>{t.name}</p>
          <p className={cn("text-sm", textColor === "#ffffff" ? "text-gray-400" : "text-gray-500")} contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "role", e.currentTarget.textContent || "")}>{t.role}</p>
        </div>
      </div>
    </AnimationWrapper>
  );

  //  Carousel Variant 
  if (variant === "carousel") {
    const current = testimonials[carouselIdx] || testimonials[0];
    if (!current) return null;
    return (
      <section className={cn(paddingY, "px-6", !backgroundColor && "bg-gray-50")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className={cn("mx-auto", containerSize)}>
          <AnimationWrapper animation={animConfig} className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-lg text-gray-600 mb-12" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <Quote className="w-10 h-10 text-primary-200 mx-auto mb-4" />
              {renderStars(current.rating)}
              <p className="text-xl text-gray-700 leading-relaxed mt-4 mb-6" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(carouselIdx, "text", e.currentTarget.textContent || "")}>
                "{current.text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                {current.avatar && <img src={current.avatar} alt={current.name} className="w-12 h-12 rounded-full object-cover" />}
                <div className="text-left">
                  <p className="font-bold text-gray-900" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(carouselIdx, "name", e.currentTarget.textContent || "")}>{current.name}</p>
                  <p className="text-sm text-gray-500" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(carouselIdx, "role", e.currentTarget.textContent || "")}>{current.role}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors" disabled={carouselIdx === 0}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_: any, i: number) => (
                  <button key={i} onClick={() => setCarouselIdx(i)} className={cn("w-2.5 h-2.5 rounded-full transition-colors", i === carouselIdx ? "bg-primary-600" : "bg-gray-300")} />
                ))}
              </div>
              <button onClick={() => setCarouselIdx(Math.min(testimonials.length - 1, carouselIdx + 1))} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors" disabled={carouselIdx === testimonials.length - 1}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  //  Spotlight Variant 
  if (variant === "spotlight" && testimonials.length > 0) {
    const main = testimonials[0];
    const rest = testimonials.slice(1);
    return (
      <section className={cn(paddingY, "px-6", !backgroundColor && "bg-gray-50")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className={cn("mx-auto", containerSize)}>
          <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <AnimationWrapper animation={animConfig} className="bg-primary-600 rounded-2xl p-10 text-white mb-8">
            <Quote className="w-10 h-10 text-white/30 mb-4" />
            <p className="text-xl leading-relaxed mb-6" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(0, "text", e.currentTarget.textContent || "")}>
              "{main.text}"
            </p>
            <div className="flex items-center gap-3">
              {main.avatar && <img src={main.avatar} alt={main.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/30" />}
              <div>
                <p className="font-bold" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(0, "name", e.currentTarget.textContent || "")}>{main.name}</p>
                <p className="text-sm text-white/70" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(0, "role", e.currentTarget.textContent || "")}>{main.role}</p>
              </div>
            </div>
          </AnimationWrapper>
          {rest.length > 0 && (
            <div className={cn("grid gap-6", getResponsiveGridClasses(Math.min(rest.length, 3), device))}>
              {rest.map((t: any, idx: number) => renderCard(t, idx + 1))}
            </div>
          )}
        </div>
      </section>
    );
  }

  //  Minimal Variant 
  if (variant === "minimal") {
    return (
      <section className={cn(paddingY, "px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className={cn("mx-auto", containerSize)}>
          <AnimationWrapper animation={animConfig} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
          </AnimationWrapper>
          <div className="space-y-8">
            {testimonials.map((t: any, idx: number) => (
              <AnimationWrapper key={idx} animation={animConfig} index={idx} className="border-l-4 border-primary-500 pl-6 py-2">
                <p className="text-gray-700 text-lg leading-relaxed mb-3" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "text", e.currentTarget.textContent || "")}>
                  "{t.text}"
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "name", e.currentTarget.textContent || "")}>{t.name}</span>
                  {" â€” "}
                  <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateTestimonial(idx, "role", e.currentTarget.textContent || "")}>{t.role}</span>
                </p>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  //  Cards Grid (Default) 
  return (
    <section className={cn(paddingY, "px-6", !backgroundColor && "bg-gray-50")} style={{ backgroundColor: backgroundColor || undefined, color: textColor || undefined }}>
      <div className={cn("mx-auto", containerSize)}>
        <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-16">
          {block.props.badgeText && (
            <span className={cn(
              "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6",
              textColor === "#ffffff" ? "bg-white/10 text-white" : "bg-primary-100 text-primary-700"
            )}>
              {block.props.badgeText}
            </span>
          )}
          <h2 className={cn("text-3xl md:text-5xl font-black mb-6", textColor === "#ffffff" ? "text-white" : "text-gray-900")} contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
          <p className={cn("text-xl max-w-2xl mx-auto", textColor === "#ffffff" ? "text-gray-400" : "text-gray-600")} contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
        </AnimationWrapper>
        <div className={cn("grid gap-8", getResponsiveGridClasses(Number(columns || 3), device))}>
          {testimonials.map((t: any, idx: number) => renderCard(t, idx))}
        </div>
      </div>
    </section>
  );
};
