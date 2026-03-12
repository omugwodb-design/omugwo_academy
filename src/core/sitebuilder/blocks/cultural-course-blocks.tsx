import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Heart, Users, BookOpen, Globe, Leaf, Sun, Play, ArrowRight, CheckCircle2, Star, Award, MapPin } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  heart: Heart, users: Users, book: BookOpen, globe: Globe, leaf: Leaf,
  sun: Sun, play: Play, star: Star, award: Award, mapPin: MapPin,
};

// ============== CULTURAL HERO BLOCK ==============
export const culturalHeroBlockSchema: PropSchema[] = [
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
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CulturalHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Rooted in Tradition, Guided by Care",
    titleHighlight = "Tradition",
    subtitle = "A culturally grounded postpartum journey that honors heritage while embracing modern wellness.",
    ctaText = "Begin Your Journey",
    ctaLink = "/checkout",
    secondaryCtaText = "Learn More",
    secondaryCtaLink = "#about",
    badgeText = "African Heritage",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    primaryColor = "#b45309",
    secondaryColor = "#92400e",
    accentColor = "#f59e0b",
    backgroundColor = "#fef3c7",
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
        <span key={i} className="relative">
          <span className="absolute bottom-2 left-0 right-0 h-3 opacity-30" style={{ backgroundColor: accentColor }} />
          <span style={{ color: primaryColor }} className="relative font-bold italic">
            {part}
          </span>
        </span>
      ) : part
    );
  };

  return (
    <section 
      className={cn("relative overflow-hidden min-h-[700px] flex items-center", paddingY)}
      style={{ backgroundColor }}
    >
      {/* Cultural pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ 
            background: `radial-gradient(circle, ${primaryColor}, transparent)`,
          }}
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ 
            background: `radial-gradient(circle, ${secondaryColor}, transparent)`,
          }}
        />
      </div>

      <div className={cn("relative z-10 mx-auto px-6 w-full", containerSize)}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimationWrapper animation={animConfig} className={cn(
            "space-y-8",
            textAlign === "center" && "text-center lg:col-span-2 lg:max-w-3xl lg:mx-auto",
            textAlign === "right" && "text-right lg:order-2"
          )}>
            {/* Badge */}
            {badgeText && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm",
                  textAlign === "center" && "mx-auto",
                  textAlign === "right" && "ml-auto"
                )}
                style={{ 
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  border: `2px solid ${primaryColor}40`,
                }}
              >
                <Globe className="w-4 h-4" />
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {renderTitle()}
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed",
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all"
                style={{ backgroundColor: primaryColor }}
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
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold border-2 transition-all"
                  style={{ borderColor: primaryColor, color: primaryColor }}
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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Decorative frame */}
                <div 
                  className="absolute -inset-4 rounded-[2rem] opacity-20"
                  style={{ 
                    backgroundColor: accentColor,
                    transform: 'rotate(3deg)',
                  }}
                />
                <div 
                  className="absolute -inset-2 rounded-[1.5rem] opacity-15"
                  style={{ 
                    backgroundColor: primaryColor,
                    transform: 'rotate(-2deg)',
                  }}
                />
                <img
                  src={heroImage}
                  alt="Hero"
                  className="relative z-10 w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]"
                />
                {/* Cultural badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 z-20 px-6 py-3 rounded-2xl shadow-xl font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  🌿 Heritage Care
                </motion.div>
              </motion.div>
            </AnimationWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

// ============== CULTURAL FEATURES BLOCK ==============
export const culturalFeaturesBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "features", label: "Features", type: "array", arrayItemSchema: [
    { name: "icon", label: "Icon", type: "select", options: [
      { label: "Heart", value: "heart" },
      { label: "Users", value: "users" },
      { label: "Book", value: "book" },
      { label: "Globe", value: "globe" },
      { label: "Leaf", value: "leaf" },
      { label: "Sun", value: "sun" },
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

export const CulturalFeaturesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Wisdom passed down through generations",
    subtitle = "Where tradition meets modern care.",
    features = [
      { icon: "globe", title: "Cultural Heritage", description: "Rooted in African traditions and wisdom." },
      { icon: "users", title: "Community Support", description: "Connect with mothers who understand." },
      { icon: "leaf", title: "Natural Recovery", description: "Holistic approaches to healing." },
    ],
    primaryColor = "#b45309",
    secondaryColor = "#92400e",
    accentColor = "#f59e0b",
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
      {/* Decorative pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
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
            className="text-3xl md:text-4xl font-bold mb-4"
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
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>

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
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-40"
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

// ============== CULTURAL CTA BLOCK ==============
export const culturalCtaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
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

export const CulturalCtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Join Our Community of Care",
    subtitle = "Begin your culturally-rooted postpartum journey today.",
    ctaText = "Start Your Journey",
    ctaLink = "/checkout",
    primaryColor = "#b45309",
    secondaryColor = "#92400e",
    accentColor = "#f59e0b",
    backgroundColor = "#fef3c7",
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
      {/* Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        <div className={cn(
          "bg-white rounded-[2rem] p-12 md:p-16 shadow-2xl border border-gray-100",
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
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Globe className="w-8 h-8" style={{ color: primaryColor }} />
          </motion.div>

          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
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
            "flex",
            textAlign === "center" && "justify-center",
            textAlign === "right" && "justify-end"
          )}>
            <motion.a
              href={ctaLink}
              onClick={(e) => handleNav(e, ctaLink)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg"
              style={{ backgroundColor: primaryColor }}
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
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};
