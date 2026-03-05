import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const courseGridBlockSchema: PropSchema[] = [
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { label: "Static (manual)", value: "static" },
      { label: "Dynamic (from courses)", value: "dynamic" },
    ],
    group: "Data"
  },
  {
    name: "badgeText",
    label: "Badge Text",
    type: "text",
    group: "Content"
  },
  {
    name: "title",
    label: "Title",
    type: "text",
    group: "Content"
  },
  {
    name: "subtitle",
    label: "Subtitle",
    type: "textarea",
    group: "Content"
  },
  {
    name: "columns",
    label: "Columns",
    type: "select",
    options: [
      { label: "2 Columns", value: "2" },
      { label: "3 Columns", value: "3" },
      { label: "4 Columns", value: "4" },
    ],
    group: "Layout"
  },
  {
    name: "limit",
    label: "Max Items (Dynamic)",
    type: "number",
    min: 1,
    max: 12,
    group: "Data"
  },
  {
    name: "courses",
    label: "Courses (Static)",
    type: "array",
    arrayItemSchema: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      { name: "price", label: "Price", type: "text" },
      { name: "badge", label: "Badge", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "lessons", label: "Lessons", type: "number" },
      { name: "rating", label: "Rating", type: "number", min: 1, max: 5 },
      { name: "students", label: "Students", type: "number" },
    ],
    group: "Data"
  },
  {
    name: "showViewAll",
    label: "Show 'View All' Button",
    type: "boolean",
    group: "Layout"
  },
  {
    name: "backgroundColor",
    label: "Background",
    type: "color",
    group: "Style"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CourseGridBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const [dynamicCourses, setDynamicCourses] = useState<any[]>([]);
  const {
    mode = "static",
    badgeText = "",
    title = "Featured Courses",
    subtitle = "Explore our most popular learning paths.",
    columns = "3",
    limit = 3,
    courses = [
      {
        title: "The Omugwo Masterclass for Moms",
        description: "Complete postnatal guide covering body recovery, mental health, cultural balance, marriage & intimacy, and infant care.",
        image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
        price: "₦49,000",
        badge: "Most Popular",
        duration: "12 Hours",
        lessons: 48,
        rating: 5,
        students: 12000
      },
      {
        title: "Partner Support Training",
        description: "Essential knowledge for fathers and partners to provide meaningful support during the postnatal period.",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800",
        price: "₦29,000",
        duration: "6 Hours",
        lessons: 24,
        rating: 5,
        students: 5400
      },
      {
        title: "Essential Postnatal Care",
        description: "Core fundamentals every parent needs to know for a healthy postpartum journey.",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
        price: "₦39,000",
        duration: "8 Hours",
        lessons: 32,
        rating: 5,
        students: 8200
      }
    ],
    showViewAll = true,
    backgroundColor,
    paddingY = "py-20",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  useEffect(() => {
    if (mode === "dynamic") {
      supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .limit(limit)
        .then(({ data }) => {
          if (data) setDynamicCourses(data);
        });
    }
  }, [mode, limit]);

  const displayCourses = mode === "dynamic" ? dynamicCourses : courses;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateCourse = (idx: number, key: string, value: any) => {
    if (mode === "dynamic") return;
    const next = [...courses];
    next[idx] = { ...next[idx], [key]: value };
    handleChange("courses", next);
  };

  const renderCard = (course: any, idx: number) => (
    <AnimationWrapper key={course.id || idx} animation={{ ...animConfig, type: "slideUp", delay: idx * 0.1 }} index={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-gray-100 group">
      <div className="relative h-48 overflow-hidden">
        <img src={course.image_url || course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {course.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full shadow-sm">
            {course.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-8 flex flex-col flex-1 relative bg-white">
        <div className="flex items-center gap-2 mb-4">
          {(course.duration || course.duration_hours) && (
            <>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                {course.duration || `${course.duration_hours} Hours`}
              </span>
              <span className="text-gray-300">•</span>
            </>
          )}
          {course.lessons && (
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
              {course.lessons} Lessons
            </span>
          )}
        </div>
        <h3 className="font-bold text-2xl mb-4 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2" contentEditable={selected && mode === "static"} suppressContentEditableWarning onBlur={(e) => updateCourse(idx, "title", e.currentTarget.textContent || "")}>
          {course.title}
        </h3>
        <p className="text-gray-600 text-[15px] mb-8 flex-1 line-clamp-3 leading-relaxed" contentEditable={selected && mode === "static"} suppressContentEditableWarning onBlur={(e) => updateCourse(idx, "description", e.currentTarget.textContent || "")}>
          {course.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
          <span className="font-black text-3xl text-primary-600" contentEditable={selected && mode === "static"} suppressContentEditableWarning onBlur={(e) => updateCourse(idx, "price", e.currentTarget.textContent || "")}>
            {typeof course.price === 'number' ? `₦${course.price.toLocaleString()}` : course.price}
          </span>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-900 text-sm font-bold rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
            Learn More
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );

  return (
    <section className={cn(paddingY, "px-6", backgroundColor ? "" : "bg-primary-50/50")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto", containerSize)}>
        <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-16">
          {badgeText && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-700 text-sm font-bold rounded-full mb-4 shadow-sm">
              {badgeText}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>
            {title}
          </h2>
          <p className="text-xl text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>
            {subtitle}
          </p>
        </AnimationWrapper>
        <div className={cn("grid gap-8", getResponsiveGridClasses(Number(columns || 3), device))}>
          {displayCourses.map((course: any, idx: number) => renderCard(course, idx))}
        </div>
        {showViewAll && (
          <div className="mt-16 text-center">
            <a href="/courses" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-xl hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm" onClick={(e) => e.preventDefault()}>
              View All Courses
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
