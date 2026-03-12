import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronRight, BookOpen, Globe, Calendar } from "lucide-react";

// Coursera-style hero - clean, academic, professional
export const courseraHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "partnerName", label: "Partner/Institution", type: "text", group: "Instructor" },
  { name: "partnerLogo", label: "Partner Logo", type: "image", group: "Instructor" },
  { name: "rating", label: "Rating", type: "number", min: 1, max: 5, step: 0.1, group: "Social Proof" },
  { name: "ratingCount", label: "Rating Count", type: "number", group: "Social Proof" },
  { name: "enrollmentCount", label: "Enrollment Count", type: "text", group: "Social Proof" },
  { name: "level", label: "Level", type: "select", options: [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ], group: "Meta" },
  { name: "duration", label: "Duration", type: "text", group: "Meta" },
  { name: "schedule", label: "Schedule", type: "text", group: "Meta" },
  { name: "language", label: "Language", type: "text", group: "Meta" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "CTA" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "CTA" },
  { name: "secondaryCtaText", label: "Secondary CTA", type: "text", group: "CTA" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CourseraHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Postpartum Recovery Specialization",
    subtitle = "Gain expertise in evidence-based postnatal care. Develop skills for physical recovery, mental wellness, and infant care.",
    badgeText = "PROFESSIONAL CERTIFICATE",
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    partnerName = "Omugwo Academy",
    partnerLogo = "",
    rating = 4.8,
    ratingCount = 2847,
    enrollmentCount = "15,000+",
    level = "Beginner",
    duration = "12 weeks",
    schedule = "Flexible schedule",
    language = "English",
    ctaText = "Enroll for Free",
    ctaLink = "/checkout",
    secondaryCtaText = "Financial aid available",
    backgroundColor = "#ffffff",
    paddingY = "py-12",
    containerSize = "max-w-6xl",
  } = block.props;

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("bg-white", paddingY)} style={{ backgroundColor }}>
        <div className={cn("mx-auto px-4", containerSize)}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-4">
                  <Award className="w-3.5 h-3.5" />
                  {badgeText}
                </div>
              )}
              
              <h1
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, title: e.currentTarget.textContent || "" })}
              >
                {title}
              </h1>

              <p
                className="text-lg text-gray-600 mb-6 outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, subtitle: e.currentTarget.textContent || "" })}
              >
                {subtitle}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{instructorName}</p>
                  <p className="text-sm text-gray-500">{instructorTitle}</p>
                </div>
                {partnerLogo && (
                  <img src={partnerLogo} alt={partnerName} className="h-8 ml-2" />
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium">{rating}</span>
                  <span className="text-gray-400">({ratingCount.toLocaleString()} reviews)</span>
                </div>
                <span>•</span>
                <span>{enrollmentCount} already enrolled</span>
              </div>

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>{level} level</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>{language}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  {ctaText}
                </button>
                {secondaryCtaText && (
                  <button className="text-blue-600 hover:text-blue-700 font-medium underline">
                    {secondaryCtaText}
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Preview Image */}
            <div className="lg:w-[360px] shrink-0">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                  alt="Course preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <Play className="w-6 h-6 text-blue-600 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
