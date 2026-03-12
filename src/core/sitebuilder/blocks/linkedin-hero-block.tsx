import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronRight, BookOpen, Globe, BarChart3 } from "lucide-react";

// LinkedIn Learning-style hero - corporate, skill-focused
export const linkedinHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "skillLevel", label: "Skill Level", type: "select", options: [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ], group: "Meta" },
  { name: "duration", label: "Duration", type: "text", group: "Meta" },
  { name: "learnerCount", label: "Learner Count", type: "text", group: "Social Proof" },
  { name: "releaseDate", label: "Release Date", type: "text", group: "Meta" },
  { name: "skills", label: "Skills (comma-separated)", type: "text", group: "Content" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "CTA" },
  { name: "previewImageUrl", label: "Preview Image", type: "image", group: "Media" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const LinkedinHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Essential Postnatal Care Skills",
    subtitle = "Master the practical skills needed for navigating the postpartum period effectively. Learn from industry experts and gain in-demand skills.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    skillLevel = "Beginner",
    duration = "12h 30m",
    learnerCount = "15,243",
    releaseDate = "Jan 2025",
    skills = "Postpartum Recovery, Mental Health, Infant Care, Family Communication",
    ctaText = "Start Learning",
    previewImageUrl = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    backgroundColor = "#0a66c2",
    paddingY = "py-0",
    containerSize = "max-w-7xl",
  } = block.props;

  const skillsList = skills.split(",").map(s => s.trim());

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("relative", paddingY)}>
        {/* Blue header background */}
        <div className="absolute inset-0 bg-[#0a66c2]" style={{ backgroundColor }} />
        
        <div className={cn("relative mx-auto px-4 py-12 lg:py-16", containerSize)}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <h1
                className="text-2xl lg:text-3xl font-bold mb-4 outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, title: e.currentTarget.textContent || "" })}
              >
                {title}
              </h1>

              <p
                className="text-white/80 mb-6 text-lg outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, subtitle: e.currentTarget.textContent || "" })}
              >
                {subtitle}
              </p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>{skillLevel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{learnerCount} learners</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                />
                <div className="text-sm">
                  <p className="font-medium">{instructorName}</p>
                  <p className="text-white/70">{instructorTitle}</p>
                </div>
              </div>

              {/* CTA */}
              <button className="px-6 py-2.5 bg-white hover:bg-gray-100 text-[#0a66c2] font-semibold rounded transition-colors">
                {ctaText}
              </button>
            </div>

            {/* Right Side - Preview */}
            <div className="lg:w-[400px] shrink-0">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={previewImageUrl}
                  alt="Course preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="w-7 h-7 text-[#0a66c2] ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 text-white text-xs">
                  Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-white py-8 border-b">
        <div className={cn("mx-auto px-4", containerSize)}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Skills covered:</span>
            {skillsList.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
