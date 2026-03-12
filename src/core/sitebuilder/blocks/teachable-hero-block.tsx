import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, sizingSchemaFields } from "./animation-wrapper";
import { Play, Star, Clock, Users, Award, CheckCircle, ChevronRight, BookOpen, CreditCard } from "lucide-react";

// Teachable-style hero - clean, minimalist, conversion-focused
export const teachableHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Course Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorBio", label: "Instructor Bio", type: "textarea", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "videoUrl", label: "Video URL", type: "text", group: "Media" },
  { name: "previewImage", label: "Preview Image", type: "image", group: "Media" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Pricing" },
  { name: "paymentPlans", label: "Payment Plans", type: "boolean", group: "Pricing" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "CTA" },
  { name: "guaranteeText", label: "Guarantee Text", type: "text", group: "Content" },
  { name: "features", label: "Features (comma-separated)", type: "text", group: "Content" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const TeachableHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "The Postnatal Masterclass",
    subtitle = "Everything you need to know for a smooth recovery. Evidence-based, culturally relevant, and expert-led.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorBio = "ECD Specialist with over 15 years of experience in maternal and child health.",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    videoUrl = "",
    previewImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    price = "₦49,000",
    originalPrice = "₦129,000",
    paymentPlans = true,
    ctaText = "Enroll Now",
    guaranteeText = "30-day money-back guarantee",
    features = "Lifetime access, 48 video lessons, Downloadable resources, Certificate of completion",
    backgroundColor = "#f9fafb",
    paddingY = "py-16",
    containerSize = "max-w-5xl",
  } = block.props;

  const featuresList = features.split(",").map(f => f.trim());

  return (
    <AnimationWrapper animation={block.props.animation} className={cn("relative", selected && "ring-2 ring-primary-500")}>
      <section className={cn("", paddingY)} style={{ backgroundColor }}>
        <div className={cn("mx-auto px-4", containerSize)}>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left - Video */}
            <div className="flex-1 w-full">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
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
                      <button className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                        <Play className="w-8 h-8 text-gray-900 ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex-1 w-full">
              <h1
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 outline-none"
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
              <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-lg border">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{instructorName}</p>
                  <p className="text-sm text-gray-500">{instructorBio}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {featuresList.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{price}</span>
                  {originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
                  )}
                </div>
                {paymentPlans && (
                  <p className="text-sm text-gray-500 mt-1">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment plans available
                  </p>
                )}
              </div>

              {/* CTA */}
              <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors mb-3">
                {ctaText}
              </button>

              {/* Guarantee */}
              {guaranteeText && (
                <p className="text-center text-sm text-gray-500">
                  ✓ {guaranteeText}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
