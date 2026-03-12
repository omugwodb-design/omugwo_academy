import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Cpu, Database, Globe, Zap, Code2, Layers, Play, ArrowRight, CheckCircle2, Users, BookOpen, Sparkles } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  cpu: Cpu, database: Database, globe: Globe, zap: Zap, code: Code2,
  layers: Layers, play: Play, users: Users, book: BookOpen, sparkles: Sparkles,
};

// ============== TECH HERO BLOCK ==============
export const techHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Word", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "priceSubtext", label: "Price Subtext", type: "text", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Content" },
  { name: "instructorRole", label: "Instructor Role", type: "text", group: "Content" },
  { name: "stat1Label", label: "Stat 1 Label", type: "text", group: "Stats" },
  { name: "stat1Value", label: "Stat 1 Value", type: "text", group: "Stats" },
  { name: "stat2Label", label: "Stat 2 Label", type: "text", group: "Stats" },
  { name: "stat2Value", label: "Stat 2 Value", type: "text", group: "Stats" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const TechHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "A Modern Postpartum System",
    titleHighlight = "Modern",
    subtitle = "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
    ctaText = "Get Access",
    ctaLink = "/checkout",
    price = "₦49,000",
    priceSubtext = "One-time payment",
    badgeText = "New Cohort Open",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    instructorName = "Dr. Megor",
    instructorRole = "Lead Instructor",
    stat1Label = "Duration",
    stat1Value = "12 Hours",
    stat2Label = "Lessons",
    stat2Value = "48",
    primaryColor = "#8b5cf6",
    secondaryColor = "#06b6d4",
    backgroundColor = "#0f0f23",
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
        <span key={i} className="relative">
          <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 blur-lg opacity-50" />
          <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
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
      {/* Tech grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow effects */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${primaryColor}40` }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${secondaryColor}30` }}
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
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold",
                  textAlign === "center" && "mx-auto",
                  textAlign === "right" && "ml-auto"
                )}
                style={{ 
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}40`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: secondaryColor }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: secondaryColor }} />
                </span>
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white font-mono"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {renderTitle()}
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed",
                textAlign === "center" && "mx-auto",
                textAlign === "right" && "ml-auto"
              )}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>

            {/* Stats row */}
            <div className={cn(
              "flex gap-8",
              textAlign === "center" && "justify-center",
              textAlign === "right" && "justify-end"
            )}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{stat1Value}</div>
                <div className="text-sm text-gray-500">{stat1Label}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{stat2Value}</div>
                <div className="text-sm text-gray-500">{stat2Label}</div>
              </div>
            </div>

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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white shadow-lg transition-all relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Play className="w-5 h-5 relative z-10" />
                <span className="relative z-10" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}>
                  {ctaText}
                </span>
              </motion.a>
              <div className="flex flex-col justify-center">
                <div className="text-2xl font-bold text-white font-mono">{price}</div>
                <div className="text-sm text-gray-500">{priceSubtext}</div>
              </div>
            </div>
          </AnimationWrapper>

          {/* Hero Image */}
          {textAlign !== "center" && (
            <AnimationWrapper 
              animation={{ ...animConfig, type: "slideLeft", delay: 0.2 }}
              className={cn(textAlign === "right" && "lg:order-1")}
            >
              <div className="relative">
                {/* Code-like frame */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30" />
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <img
                  src={heroImage}
                  alt="Hero"
                  className="relative z-10 w-full rounded-xl shadow-2xl object-cover aspect-[4/3] mt-6"
                />
              </div>
            </AnimationWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

// ============== TECH FEATURES BLOCK ==============
export const techFeaturesBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "features", label: "Features", type: "array", arrayItemSchema: [
    { name: "icon", label: "Icon", type: "select", options: [
      { label: "Play", value: "play" },
      { label: "Users", value: "users" },
      { label: "Book", value: "book" },
      { label: "Zap", value: "zap" },
      { label: "Code", value: "code" },
      { label: "Layers", value: "layers" },
    ]},
    { name: "badge", label: "Badge", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ], group: "Features" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const TechFeaturesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Structured, intuitive, and supportive",
    subtitle = "Everything you need in one modern experience.",
    features = [
      { icon: "play", badge: "LESSONS", title: "Video-first learning", description: "Short, digestible sessions." },
      { icon: "users", badge: "COMMUNITY", title: "Peer support", description: "Ask questions and share wins." },
      { icon: "book", badge: "RESOURCES", title: "Downloadables", description: "Checklists and plans." },
    ],
    primaryColor = "#8b5cf6",
    secondaryColor = "#06b6d4",
    backgroundColor = "rgba(245, 243, 255, 0.5)",
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
            className="text-3xl md:text-4xl font-bold mb-4 font-mono"
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
        <div className="grid md:grid-cols-3 gap-6">
          {(features || []).map((feature: any, i: number) => {
            const Icon = ICON_MAP[feature.icon] || Play;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:border-violet-200 transition-all group"
              >
                {/* Badge */}
                {feature.badge && (
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 font-mono"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {feature.badge}
                  </div>
                )}
                
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                >
                  <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                </div>

                {/* Content */}
                <h3
                  className="text-lg font-bold mb-2 font-mono"
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
                  className="text-gray-600 text-sm"
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
              </motion.div>
            );
          })}
        </div>
      </AnimationWrapper>
    </section>
  );
};

// ============== TECH CTA BLOCK ==============
export const techCtaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "primaryColor", label: "Primary Color", type: "color", group: "Style" },
  { name: "secondaryColor", label: "Secondary Color", type: "color", group: "Style" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  { name: "textAlign", label: "Text Alignment", type: "select", options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ], group: "Layout" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const TechCtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Ready to Get Started?",
    subtitle = "Join the modern approach to postpartum recovery.",
    ctaText = "Get Access Now",
    ctaLink = "/checkout",
    primaryColor = "#8b5cf6",
    secondaryColor = "#06b6d4",
    backgroundColor = "#0f0f23",
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
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${primaryColor}15 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}15 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        <div className={cn(
          "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 md:p-16 border border-gray-700",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}>
          {/* Terminal-style header */}
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>

          <p
            className={cn(
              "text-lg text-gray-400 mb-8 max-w-xl font-mono",
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white shadow-lg relative overflow-hidden group"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              <Zap className="w-5 h-5" />
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
