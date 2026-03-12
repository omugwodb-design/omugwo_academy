import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Activity, BarChart3, CheckCircle2, Clock, FileText, FlaskConical, GraduationCap, Heart, Microscope, Play, Users, Award, ArrowRight, Star } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  activity: Activity, chart: BarChart3, check: CheckCircle2, clock: Clock,
  file: FileText, flask: FlaskConical, grad: GraduationCap, heart: Heart,
  microscope: Microscope, play: Play, users: Users, award: Award,
};

// ============== SCIENTIFIC HERO BLOCK ==============
export const scientificHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Word", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "secondaryCtaText", label: "Secondary Button", type: "text", group: "Content" },
  { name: "secondaryCtaLink", label: "Secondary Link", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "accentColor", label: "Accent Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ScientificHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Evidence-Based Postpartum Recovery",
    titleHighlight = "Evidence-Based",
    subtitle = "A structured masterclass bridging tradition and modern medicine.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    secondaryCtaText = "Course Overview",
    secondaryCtaLink = "#overview",
    heroImage = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200",
    primaryColor = "#0ea5e9",
    accentColor = "#10b981",
    backgroundColor = "#0b1220",
    textAlign = "left",
    paddingY = "py-24",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const addCourse = useCartStore((s) => s.addCourse);
  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get("courseId");
  const actualCourseId = courseId || builderCourseId || undefined;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const handleNav = (e: React.MouseEvent, href: string) => {
    if (selected) { e.preventDefault(); return; }
    if (href.startsWith("/")) {
      e.preventDefault();
      if (actualCourseId && (href === "/checkout" || href === "/checkout/")) {
        addCourse(actualCourseId);
      }
      navigate(href);
    }
  };

  const renderTitle = () => {
    if (!titleHighlight) return title;
    const parts = title.split(new RegExp(`(${titleHighlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === titleHighlight.toLowerCase() ? (
        <span key={i} style={{ color: primaryColor }} className="relative font-bold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <section 
      className={cn("relative overflow-hidden min-h-[700px] flex items-center", paddingY)}
      style={{ backgroundColor }}
    >
      {/* Scientific grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${primaryColor}20 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating molecules/dots decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 4 + (i % 5), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.3 
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
              top: `${5 + (i * 4.5)}%`,
              left: `${2 + (i * 4.8)}%`,
            }}
          />
        ))}
      </div>

      <div className={cn("relative z-10 mx-auto px-6 w-full", containerSize)}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimationWrapper animation={animConfig} className={cn(
            "space-y-8",
            textAlign === "center" && "text-center lg:col-span-2 lg:max-w-3xl lg:mx-auto",
            textAlign === "right" && "text-right lg:order-2"
          )}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "inline-flex items-center gap-3 px-4 py-2 rounded-lg font-bold text-sm",
                textAlign === "center" && "mx-auto",
                textAlign === "right" && "ml-auto"
              )}
              style={{ 
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
                borderLeft: `4px solid ${primaryColor}`,
              }}
            >
              <Microscope className="w-4 h-4" />
              <span>Clinically Grounded</span>
            </motion.div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {renderTitle()}
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed",
                textAlign === "center" && "mx-auto",
                textAlign === "right" && "ml-auto"
              )}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>

            {/* CTAs */}
            <div className={cn(
              "flex flex-wrap gap-4",
              textAlign === "center" && "justify-center",
              textAlign === "right" && "justify-end"
            )}>
              <motion.a
                href={ctaLink}
                onClick={(e) => handleNav(e, ctaLink)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white shadow-lg transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <Play className="w-5 h-5" />
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
                >
                  {ctaText}
                </span>
              </motion.a>
              {secondaryCtaText && (
                <motion.a
                  href={secondaryCtaLink}
                  onClick={(e) => handleNav(e, secondaryCtaLink)}
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold border-2 text-gray-300 hover:text-white hover:border-white/50 transition-all"
                >
                  <span
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("secondaryCtaText", e.currentTarget.textContent || "")}
                  >
                    {secondaryCtaText}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </AnimationWrapper>

          {/* Hero Image */}
          {textAlign !== "center" && (
            <AnimationWrapper 
              animation={{ ...animConfig, type: "slideLeft", delay: 0.2 }}
              className={cn(textAlign === "right" && "lg:order-1")}
            >
              <div className="relative">
                {/* Scientific frame */}
                <div 
                  className="absolute -inset-4 rounded-2xl opacity-20"
                  style={{ 
                    backgroundColor: primaryColor,
                    clipPath: 'polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%)',
                  }}
                />
                <img
                  src={heroImage}
                  alt="Hero"
                  className="relative z-10 w-full rounded-xl shadow-2xl object-cover aspect-[4/3]"
                />
                {/* Data overlay badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 z-20 px-4 py-3 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" style={{ color: accentColor }} />
                    <div>
                      <p className="text-white text-sm font-bold">4.9 Rating</p>
                      <p className="text-gray-400 text-xs">Based on 2,847 reviews</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimationWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

// ============== SCIENTIFIC STATS BLOCK ==============
export const scientificStatsBlockSchema: PropSchema[] = [
  { name: "stats", label: "Statistics", type: "array", arrayItemSchema: [
    { name: "value", label: "Value", type: "text" },
    { name: "label", label: "Label", type: "text" },
  ], group: "Stats" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ScientificStatsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    stats = [
      { value: "4.9", label: "Avg. Rating" },
      { value: "8,432", label: "Students" },
      { value: "12h", label: "Duration" },
      { value: "48", label: "Lessons" },
    ],
    primaryColor = "#0ea5e9",
    backgroundColor = "#0b1220",
    paddingY = "py-12",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <section 
      className={cn("relative", paddingY)}
      style={{ backgroundColor }}
    >
      <AnimationWrapper animation={animConfig} className={cn("mx-auto px-6", containerSize)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(stats || []).map((stat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div 
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: primaryColor }}
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newStats = [...stats];
                  newStats[i] = { ...newStats[i], value: e.currentTarget.textContent || "" };
                  handleChange("stats", newStats);
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimationWrapper>
    </section>
  );
};

// ============== SCIENTIFIC CONTENT BLOCK ==============
export const scientificContentBlockSchema: PropSchema[] = [
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "body", label: "Body Content", type: "textarea", group: "Content" },
  { name: "image", label: "Image", type: "image", group: "Content" },
  { name: "imagePosition", label: "Image Position", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "accentColor", label: "Accent Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ScientificContentBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    badgeText = "Clinical Summary",
    title = "What you'll learn",
    body = "Complete guide for new mothers covering recovery, nutrition, and baby care basics.",
    image = "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=1200",
    imagePosition = "right",
    primaryColor = "#0ea5e9",
    accentColor = "#10b981",
    backgroundColor = "#ffffff",
    textAlign = "left",
    paddingY = "py-24",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <section 
      className={cn("relative overflow-hidden", paddingY)}
      style={{ backgroundColor }}
    >
      <AnimationWrapper animation={animConfig} className={cn("mx-auto px-6", containerSize)}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={cn(imagePosition === "right" ? "order-1" : "order-2")}>
            {/* Badge */}
            {badgeText && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm mb-6",
                  textAlign === "center" && "mx-auto",
                  textAlign === "right" && "ml-auto"
                )}
                style={{ 
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <FlaskConical className="w-4 h-4" />
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("badgeText", e.currentTarget.textContent || "")}
                >
                  {badgeText}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-6",
                textAlign === "center" && "text-center",
                textAlign === "right" && "text-right"
              )}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {title}
            </h2>

            {/* Body */}
            <p
              className={cn(
                "text-lg text-gray-600 leading-relaxed",
                textAlign === "center" && "text-center",
                textAlign === "right" && "text-right"
              )}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("body", e.currentTarget.textContent || "")}
            >
              {body}
            </p>

            {/* Key points */}
            <div className="mt-8 space-y-3">
              {["Evidence-based protocols", "Clinical best practices", "Research-backed methods"].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />
                  <span className="text-gray-700">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className={cn(imagePosition === "right" ? "order-2" : "order-1")}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div 
                className="absolute -inset-4 rounded-2xl opacity-10"
                style={{ backgroundColor: primaryColor }}
              />
              <img
                src={image}
                alt="Content"
                className="relative z-10 w-full rounded-xl shadow-xl object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};

// ============== SCIENTIFIC CTA BLOCK ==============
export const scientificCtaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const ScientificCtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Start Your Evidence-Based Journey",
    subtitle = "Join thousands of mothers who have transformed their recovery with clinically-proven methods.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    primaryColor = "#0ea5e9",
    backgroundColor = "#0b1220",
    textAlign = "center",
    paddingY = "py-24",
    containerSize = "max-w-4xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const addCourse = useCartStore((s) => s.addCourse);
  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get("courseId");
  const actualCourseId = courseId || builderCourseId || undefined;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const handleNav = (e: React.MouseEvent, href: string) => {
    if (selected) { e.preventDefault(); return; }
    if (href.startsWith("/")) {
      e.preventDefault();
      if (actualCourseId && (href === "/checkout" || href === "/checkout/")) {
        addCourse(actualCourseId);
      }
      navigate(href);
    }
  };

  return (
    <section 
      className={cn("relative overflow-hidden", paddingY)}
      style={{ backgroundColor }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${primaryColor}20 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        <div className={cn(
          "bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 md:p-16 border border-gray-800",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-full mb-6",
              textAlign === "center" && "mx-auto",
              textAlign === "right" && "ml-auto"
            )}
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <GraduationCap className="w-8 h-8" style={{ color: primaryColor }} />
          </motion.div>

          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>

          <p
            className={cn(
              "text-lg text-gray-300 mb-8 max-w-xl",
              textAlign === "center" && "mx-auto",
              textAlign === "right" && "ml-auto"
            )}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>

          <div className={cn(
            "flex",
            textAlign === "center" && "justify-center",
            textAlign === "right" && "justify-end"
          )}>
            <motion.a
              href={ctaLink}
              onClick={(e) => handleNav(e, ctaLink)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Play className="w-5 h-5" />
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
              >
                {ctaText}
              </span>
            </motion.a>
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};
