import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Heart, Star, Sparkles, Sun, Rainbow, Cloud, Baby, BookOpen, Users, Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  heart: Heart, star: Star, sparkles: Sparkles, sun: Sun, rainbow: Rainbow,
  cloud: Cloud, baby: Baby, book: BookOpen, users: Users, play: Play,
};

// ============== PLAYFUL HERO BLOCK ==============
export const playfulHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Word", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "secondaryCtaText", label: "Secondary Button", type: "text", group: "Content" },
  { name: "secondaryCtaLink", label: "Secondary Link", type: "text", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
  { name: "accentColor", label: "Accent Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const PlayfulHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Welcome to Your Postpartum Reset",
    titleHighlight = "Postpartum",
    subtitle = "A warm, friendly, culturally grounded roadmap that feels like a supportive village.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    secondaryCtaText = "View Curriculum",
    secondaryCtaLink = "#curriculum",
    badgeText = "Fun & Friendly",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    primaryColor = "#22d3ee",
    secondaryColor = "#a855f7",
    accentColor = "#facc15",
    textAlign = "center",
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
        <span key={i} style={{ color: secondaryColor }} className="relative">
          <span 
            className="absolute -bottom-2 left-0 right-0 h-3 opacity-30 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          {part}
        </span>
      ) : part
    );
  };

  return (
    <section 
      className={cn("relative overflow-hidden min-h-[700px] flex items-center", paddingY)}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15, ${accentColor}15)`,
      }}
    >
      {/* Playful floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-60"
          style={{ backgroundColor: primaryColor }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-16 h-16 rounded-2xl opacity-50 rotate-12"
          style={{ backgroundColor: secondaryColor }}
        />
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-24 h-24 rounded-3xl opacity-40 -rotate-12"
          style={{ backgroundColor: accentColor }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 right-1/4 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Star decorations */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            className="absolute"
            style={{
              top: `${10 + (i * 12)}%`,
              left: `${5 + (i * 11)}%`,
            }}
          >
            <Star className="w-4 h-4" style={{ color: i % 2 === 0 ? primaryColor : secondaryColor }} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className={cn("relative z-10 mx-auto px-6 w-full", containerSize)}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimationWrapper animation={animConfig} className={cn(
            "space-y-8",
            textAlign === "center" && "text-center lg:col-span-2 lg:max-w-3xl lg:mx-auto",
            textAlign === "right" && "text-right lg:order-2"
          )}>
            {/* Badge */}
            {badgeText && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg",
                  textAlign === "center" && "justify-center",
                  textAlign === "right" && "justify-end"
                )}
                style={{ 
                  backgroundColor: "white",
                  color: secondaryColor,
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
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
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {renderTitle()}
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed font-medium",
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all"
                style={{ backgroundColor: secondaryColor }}
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
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-gray-200 hover:border-gray-300 transition-all"
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

          {/* Hero Image - only show if not centered */}
          {textAlign !== "center" && (
            <AnimationWrapper 
              animation={{ ...animConfig, type: "slideLeft", delay: 0.2 }}
              className={cn(textAlign === "right" && "lg:order-1")}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Decorative frame */}
                <div 
                  className="absolute -inset-4 rounded-[2.5rem] rotate-3 opacity-30"
                  style={{ backgroundColor: primaryColor }}
                />
                <div 
                  className="absolute -inset-2 rounded-[2rem] -rotate-2 opacity-20"
                  style={{ backgroundColor: secondaryColor }}
                />
                <img
                  src={heroImage}
                  alt="Hero"
                  className="relative z-10 w-full rounded-[2rem] shadow-2xl object-cover aspect-[4/3]"
                />
                {/* Floating badge on image */}
                <motion.div
                  animate={{ rotate: [ -5, 5, -5 ] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -right-4 z-20 px-6 py-3 rounded-2xl shadow-xl font-black text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  🎉 Fun Learning!
                </motion.div>
              </motion.div>
            </AnimationWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

// ============== PLAYFUL FEATURES BLOCK ==============
export const playfulFeaturesBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "features", label: "Features", type: "array", arrayItemSchema: [
    { name: "icon", label: "Icon", type: "select", options: [
      { label: "Heart", value: "heart" },
      { label: "Star", value: "star" },
      { label: "Sparkles", value: "sparkles" },
      { label: "Sun", value: "sun" },
      { label: "Users", value: "users" },
      { label: "Book", value: "book" },
    ]},
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ], group: "Features" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
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

export const PlayfulFeaturesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Designed to make recovery feel lighter",
    subtitle = "Clear steps, friendly reminders, and real support.",
    features = [
      { icon: "heart", title: "Gentle Guidance", description: "Supportive lessons that respect your pace." },
      { icon: "users", title: "Community", description: "You're never doing this alone." },
      { icon: "book", title: "Practical Resources", description: "Checklists, routines, and templates." },
    ],
    primaryColor = "#22d3ee",
    secondaryColor = "#a855f7",
    accentColor = "#facc15",
    backgroundColor = "#ffffff",
    textAlign = "center",
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
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${primaryColor} 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, ${secondaryColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        {/* Header */}
        <div className={cn(
          "mb-16",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black mb-4"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </motion.h2>
          <p
            className={cn(
              "text-lg text-gray-600 max-w-2xl",
              textAlign === "center" && "mx-auto",
              textAlign === "right" && "ml-auto"
            )}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {(features || []).map((feature: any, i: number) => {
            const Icon = ICON_MAP[feature.icon] || Heart;
            const colors = [primaryColor, secondaryColor, accentColor];
            const color = colors[i % 3];
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color }} />
                </motion.div>

                {/* Content */}
                <h3
                  className="text-xl font-bold mb-3"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newFeatures = [...features];
                    newFeatures[i] = { ...newFeatures[i], title: e.currentTarget.textContent || "" };
                    handleChange("features", newFeatures);
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newFeatures = [...features];
                    newFeatures[i] = { ...newFeatures[i], description: e.currentTarget.textContent || "" };
                    handleChange("features", newFeatures);
                  }}
                >
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-50"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            );
          })}
        </div>
      </AnimationWrapper>
    </section>
  );
};

// ============== PLAYFUL CTA BLOCK ==============
export const playfulCtaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "secondaryCtaText", label: "Secondary Button", type: "text", group: "Content" },
  { name: "secondaryCtaLink", label: "Secondary Link", type: "text", group: "Content" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
  { name: "accentColor", label: "Accent Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const PlayfulCtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Ready to begin?",
    subtitle = "Enroll now and start your recovery plan today.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    secondaryCtaText = "View Pricing",
    secondaryCtaLink = "#pricing",
    primaryColor = "#22d3ee",
    secondaryColor = "#a855f7",
    accentColor = "#facc15",
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
      style={{
        background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
      }}
    >
      {/* Floating decorations */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-16 h-16 rounded-full opacity-30"
        style={{ backgroundColor: primaryColor }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-20 h-20 rounded-2xl opacity-20"
        style={{ backgroundColor: secondaryColor }}
      />

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        <div className={cn(
          "bg-white rounded-[2.5rem] p-12 md:p-16 shadow-2xl border-2 border-gray-100",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}>
          {/* Decorative badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6",
              textAlign === "center" && "mx-auto",
              textAlign === "right" && "ml-auto"
            )}
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <Sparkles className="w-4 h-4" />
            Let's Do This!
          </motion.div>

          <h2
            className="text-3xl md:text-4xl font-black mb-4"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>

          <p
            className={cn(
              "text-lg text-gray-600 mb-8 max-w-xl",
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
            "flex flex-wrap gap-4",
            textAlign === "center" && "justify-center",
            textAlign === "right" && "justify-end"
          )}>
            <motion.a
              href={ctaLink}
              onClick={(e) => handleNav(e, ctaLink)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg"
              style={{ backgroundColor: secondaryColor }}
            >
              <Heart className="w-5 h-5" />
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
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-gray-200 hover:border-gray-300"
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
        </div>
      </AnimationWrapper>
    </section>
  );
};
