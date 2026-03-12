import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronRight, BookOpen, Globe, Calendar, PlayCircle } from "lucide-react";

// MasterClass-style hero - dark, cinematic, celebrity instructor
export const masterclassHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Media" },
  { name: "trailerUrl", label: "Trailer Video URL", type: "text", group: "Media" },
  { name: "lessonCount", label: "Lesson Count", type: "number", group: "Meta" },
  { name: "duration", label: "Total Duration", type: "text", group: "Meta" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "CTA" },
  { name: "secondaryCtaText", label: "Secondary CTA", type: "text", group: "CTA" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const MasterclassHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Dr. Megor Teaches Postpartum Recovery",
    subtitle = "The founder of Lead Oak Foundation shares her comprehensive framework for healing, mental wellness, and thriving in motherhood.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist & Founder",
    backgroundImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1920",
    trailerUrl = "",
    lessonCount = 48,
    duration = "12+ hours",
    ctaText = "Sign Up",
    secondaryCtaText = "Watch Trailer",
    price = "$15/month",
    paddingY = "py-0",
    containerSize = "max-w-7xl",
  } = block.props;

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("relative min-h-[80vh] flex items-center", paddingY)}>
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className={cn("relative mx-auto px-4 w-full", containerSize)}>
          <div className="max-w-2xl">
            {/* Instructor */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-red-500" />
              <div>
                <p className="text-white font-medium text-lg">{instructorName}</p>
                <p className="text-gray-400 text-sm">{instructorTitle}</p>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight outline-none"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => onChange(block.id, { ...block.props, title: e.currentTarget.textContent || "" })}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg text-gray-300 mb-8 leading-relaxed outline-none"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => onChange(block.id, { ...block.props, subtitle: e.currentTarget.textContent || "" })}
            >
              {subtitle}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
              <span>{lessonCount} lessons</span>
              <span>•</span>
              <span>{duration}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded transition-colors">
                {ctaText}
              </button>
              {secondaryCtaText && (
                <button className="flex items-center gap-2 px-6 py-3 border border-white/30 hover:border-white/50 text-white font-medium rounded transition-colors">
                  <PlayCircle className="w-5 h-5" />
                  {secondaryCtaText}
                </button>
              )}
            </div>

            {/* Pricing hint */}
            <p className="text-gray-500 text-sm mt-6">
              Starting at {price}
            </p>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
