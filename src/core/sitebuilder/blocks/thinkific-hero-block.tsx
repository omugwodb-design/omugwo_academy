import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronRight, BookOpen, CreditCard, Calendar, Globe } from "lucide-react";

// Thinkific-style hero - clean, professional, course platform
export const thinkificHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "previewImage", label: "Preview Image", type: "image", group: "Media" },
  { name: "videoUrl", label: "Video URL", type: "text", group: "Media" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Pricing" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "CTA" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "CTA" },
  { name: "lessonCount", label: "Lesson Count", type: "number", group: "Meta" },
  { name: "duration", label: "Duration", type: "text", group: "Meta" },
  { name: "level", label: "Level", type: "select", options: [
    { label: "All Levels", value: "All Levels" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ], group: "Meta" },
  { name: "language", label: "Language", type: "text", group: "Meta" },
  { name: "lastUpdated", label: "Last Updated", type: "text", group: "Meta" },
  { name: "features", label: "Features (comma-separated)", type: "text", group: "Content" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ThinkificHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "The Postpartum Masterclass",
    subtitle = "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist & Founder",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    previewImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    videoUrl = "",
    price = "₦49,000",
    originalPrice = "₦129,000",
    ctaText = "Start Learning",
    ctaLink = "/checkout",
    lessonCount = 48,
    duration = "12 hours",
    level = "All Levels",
    language = "English",
    lastUpdated = "January 2025",
    features = "Lifetime access, Certificate of completion, Downloadable resources",
    backgroundColor = "#1a1a2e",
    paddingY = "py-0",
    containerSize = "max-w-7xl",
  } = block.props;

  const featuresList = features.split(",").map(f => f.trim());

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("relative", paddingY)} style={{ backgroundColor }}>
        <div className={cn("mx-auto px-4 py-12 lg:py-20", containerSize)}>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="flex-1">
              <h1
                className="text-3xl lg:text-4xl font-bold text-white mb-4 outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, title: e.currentTarget.textContent || "" })}
              >
                {title}
              </h1>

              <p
                className="text-lg text-white/80 mb-8 outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, subtitle: e.currentTarget.textContent || "" })}
              >
                {subtitle}
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                  {lessonCount} lessons
                </span>
                <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                  {duration}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                  {level}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{instructorName}</p>
                  <p className="text-white/60 text-sm">{instructorTitle}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-8">
                {featuresList.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-8">
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {lastUpdated}</span>
                </div>
              </div>

              {/* CTA */}
              <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                {ctaText}
              </button>
            </div>

            {/* Right - Video */}
            <div className="lg:w-[450px] shrink-0">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {videoUrl ? (
                  <iframe src={videoUrl} className="w-full h-full" allowFullScreen />
                ) : (
                  <>
                    <img
                      src={previewImage}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                        <Play className="w-7 h-7 text-gray-900 ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Price Card */}
              <div className="mt-6 p-6 bg-white rounded-xl shadow-lg">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{price}</span>
                  {originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
                  )}
                </div>
                <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                  {ctaText}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
