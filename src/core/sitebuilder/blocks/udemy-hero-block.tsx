import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronDown } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

// Udemy-style hero with sticky sidebar pricing
export const udemyHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "rating", label: "Rating (1-5)", type: "number", min: 1, max: 5, step: 0.1, group: "Social Proof" },
  { name: "ratingCount", label: "Number of Ratings", type: "number", group: "Social Proof" },
  { name: "studentCount", label: "Student Count", type: "text", group: "Social Proof" },
  { name: "lastUpdated", label: "Last Updated", type: "text", group: "Meta" },
  { name: "language", label: "Language", type: "text", group: "Meta" },
  { name: "videoPreviewUrl", label: "Preview Video URL", type: "text", group: "Media" },
  { name: "previewImageUrl", label: "Preview Image", type: "image", group: "Media" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Pricing" },
  { name: "discountPercent", label: "Discount %", type: "number", group: "Pricing" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Pricing" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Pricing" },
  { name: "includes", label: "What's Included", type: "array", arrayItemSchema: [
    { name: "icon", label: "Icon", type: "select", options: [
      { label: "Video", value: "video" },
      { label: "Book", value: "book" },
      { label: "Clock", value: "clock" },
      { label: "Award", value: "award" },
      { label: "Check", value: "check" },
    ]},
    { name: "text", label: "Text", type: "text" }
  ], group: "Includes" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

const ICON_MAP: Record<string, React.FC<any>> = {
  video: Play,
  book: Play,
  clock: Clock,
  award: Award,
  check: CheckCircle,
};

export const UdemyHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId?: string }>();
  const addCourse = useCartStore((s) => s.addCourse);

  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get("courseId");
  const actualCourseId = courseId || builderCourseId || undefined;

  const {
    title = "The Complete Postpartum Recovery Masterclass",
    subtitle = "Everything you need to know for a healthy, supported postpartum journey. From physical recovery to mental wellness.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist & Founder",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rating = 4.8,
    ratingCount = 2847,
    studentCount = "8,432",
    lastUpdated = "2/2025",
    language = "English",
    videoPreviewUrl = "",
    previewImageUrl = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    price = "₦49,000",
    originalPrice = "₦129,000",
    discountPercent = 62,
    ctaText = "Add to Cart",
    ctaLink = "/checkout",
    includes = [
      { icon: "video", text: "12 hours on-demand video" },
      { icon: "book", text: "24 downloadable resources" },
      { icon: "clock", text: "Full lifetime access" },
      { icon: "award", text: "Certificate of completion" },
    ],
    paddingY = "py-0",
    containerSize = "max-w-7xl",
  } = block.props;

  const handleCtaClick = () => {
    if (actualCourseId) {
      addCourse(actualCourseId);
    }
    if (ctaLink) {
      navigate(ctaLink);
    }
  };

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("bg-white", paddingY)}>
        <div className={cn("mx-auto px-4", containerSize)}>
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-4">
            <span className="hover:text-primary-600 cursor-pointer">Courses</span>
            <span className="mx-2">›</span>
            <span className="hover:text-primary-600 cursor-pointer">Health & Wellness</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Postpartum Care</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 lg:pr-8">
              <h1
                className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, title: e.currentTarget.textContent || "" })}
              >
                {title}
              </h1>

              <p
                className="text-base text-gray-600 mb-4 leading-relaxed outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => onChange(block.id, { ...block.props, subtitle: e.currentTarget.textContent || "" })}
              >
                {subtitle}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-600">{rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-500">({ratingCount.toLocaleString()} ratings)</span>
                <span className="text-gray-500">{studentCount} students</span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm">
                  <span className="text-gray-500">Created by </span>
                  <span className="text-primary-600 font-medium hover:underline cursor-pointer">{instructorName}</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated {lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🌐</span>
                  <span>{language}</span>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">What you'll learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Understand postpartum body changes and recovery timeline",
                    "Implement evidence-based self-care strategies",
                    "Recognize signs of postpartum depression and anxiety",
                    "Build a supportive network and communicate effectively",
                    "Master newborn care fundamentals with confidence",
                    "Balance cultural traditions with modern medical advice",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Includes */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {includes.map((item: any, i: number) => {
                    const Icon = ICON_MAP[item.icon] || Play;
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Sticky */}
            <div className="lg:w-[400px] shrink-0">
              <div className="lg:sticky lg:top-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900">
                  {videoPreviewUrl ? (
                    <iframe
                      src={videoPreviewUrl}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={previewImageUrl}
                        alt="Course preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                          <Play className="w-6 h-6 text-gray-900 ml-1" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white text-sm">
                        Preview this course
                      </div>
                    </>
                  )}
                </div>

                {/* Pricing */}
                <div className="p-4">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{price}</span>
                    <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
                    <span className="text-sm font-semibold text-green-600">{discountPercent}% off</span>
                  </div>
                  
                  <div className="text-sm text-red-600 font-medium mb-4">
                    🔥 2 days left at this price!
                  </div>

                  <button
                    onClick={handleCtaClick}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors mb-2"
                  >
                    {ctaText}
                  </button>
                  
                  <button className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors">
                    Buy Now
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    30-Day Money-Back Guarantee
                  </p>

                  {/* Share */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                    <button className="text-sm text-primary-600 hover:underline">Share</button>
                    <button className="text-sm text-primary-600 hover:underline">Gift this course</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
