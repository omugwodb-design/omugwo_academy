import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Zap, Clock, Users, BookOpen, Play, ArrowRight, CheckCircle2, Star, Award, TrendingUp, Flame, Gift } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  zap: Zap, clock: Clock, users: Users, book: BookOpen, play: Play,
  star: Star, award: Award, trending: TrendingUp, flame: Flame, gift: Gift,
};

// ============== SALES HERO BLOCK ==============
export const salesHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Word", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Content" },
  { name: "urgencyText", label: "Urgency Text", type: "text", group: "Content" },
  { name: "urgencyIcon", label: "Urgency Icon", type: "select", options: [
    { label: "Flame", value: "flame" },
    { label: "Clock", value: "clock" },
    { label: "Zap", value: "zap" },
    { label: "Trending", value: "trending" },
  ], group: "Content" },
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

export const SalesHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Enroll in the Postpartum Masterclass",
    titleHighlight = "Enroll",
    subtitle = "Limited-time pricing. Start today and feel supported through every step.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    price = "₦49,000",
    originalPrice = "₦75,000",
    urgencyText = "Limited Time Offer",
    urgencyIcon = "flame",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    primaryColor = "#dc2626",
    accentColor = "#f59e0b",
    backgroundColor = "#ffffff",
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

  const UrgencyIcon = ICON_MAP[urgencyIcon] || Flame;

  const renderTitle = () => {
    if (!titleHighlight) return title;
    const parts = title.split(new RegExp(`(${titleHighlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === titleHighlight.toLowerCase() ? (
        <span key={i} style={{ color: primaryColor }} className="font-bold">
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
      {/* Urgency banner */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 py-3 text-center text-white font-bold text-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center justify-center gap-2">
          <UrgencyIcon className="w-4 h-4" />
          <span
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("urgencyText", e.currentTarget.textContent || "")}
          >
            {urgencyText}
          </span>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${primaryColor}20` }}
        />
      </div>

      <div className={cn("relative z-10 mx-auto px-6 w-full pt-12", containerSize)}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimationWrapper animation={animConfig} className={cn(
            "space-y-8",
            textAlign === "center" && "text-center lg:col-span-2 lg:max-w-3xl lg:mx-auto",
            textAlign === "right" && "text-right lg:order-2"
          )}>
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
                "text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed",
                textAlign === "center" && "mx-auto",
                textAlign === "right" && "ml-auto"
              )}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>

            {/* Price */}
            <div className={cn(
              "flex items-baseline gap-3",
              textAlign === "center" && "justify-center",
              textAlign === "right" && "justify-end"
            )}>
              <span className="text-4xl md:text-5xl font-black" style={{ color: primaryColor }}
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
              >
                {price}
              </span>
              {originalPrice && (
                <span className="text-xl text-gray-400 line-through">{originalPrice}</span>
              )}
            </div>

            {/* CTA */}
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
                className="inline-flex items-center gap-2 px-10 py-5 rounded-lg font-bold text-white shadow-xl transition-all text-lg"
                style={{ backgroundColor: primaryColor }}
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

            {/* Trust badges */}
            <div className={cn(
              "flex flex-wrap gap-6 pt-4",
              textAlign === "center" && "justify-center",
              textAlign === "right" && "justify-end"
            )}>
              {["30-Day Guarantee", "Instant Access", "Lifetime Updates"].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </AnimationWrapper>

          {/* Hero Image */}
          {textAlign !== "center" && (
            <AnimationWrapper 
              animation={{ ...animConfig, type: "slideLeft", delay: 0.2 }}
              className={cn(textAlign === "right" && "lg:order-1")}
            >
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="relative z-10 w-full rounded-xl shadow-2xl object-cover aspect-[4/3]"
                />
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 z-20 px-6 py-3 rounded-xl shadow-xl font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Best Seller</span>
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

// ============== SALES BENEFITS BLOCK ==============
export const salesBenefitsBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "benefits", label: "Benefits", type: "array", arrayItemSchema: [
    { name: "icon", label: "Icon", type: "select", options: [
      { label: "Check", value: "check" },
      { label: "Star", value: "star" },
      { label: "Zap", value: "zap" },
      { label: "Gift", value: "gift" },
      { label: "Award", value: "award" },
    ]},
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ], group: "Benefits" },
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

export const SalesBenefitsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "What You'll Get",
    subtitle = "Everything you need for a complete postpartum recovery.",
    benefits = [
      { icon: "check", title: "Complete Course Access", description: "All modules, lessons, and resources included." },
      { icon: "star", title: "Bonus Templates", description: "Checklists, meal plans, and recovery trackers." },
      { icon: "gift", title: "Community Access", description: "Private group for ongoing support." },
      { icon: "award", title: "Certificate", description: "Completion certificate for your records." },
    ],
    primaryColor = "#dc2626",
    accentColor = "#f59e0b",
    backgroundColor = "#f9fafb",
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

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(benefits || []).map((benefit: any, i: number) => {
            const Icon = benefit.icon === "check" ? CheckCircle2 : ICON_MAP[benefit.icon] || CheckCircle2;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all"
              >
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                </div>

                {/* Content */}
                <h3
                  className="text-lg font-bold mb-2"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[i] = { ...newBenefits[i], title: e.currentTarget.textContent || "" };
                    handleChange("benefits", newBenefits);
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[i] = { ...newBenefits[i], description: e.currentTarget.textContent || "" };
                    handleChange("benefits", newBenefits);
                  }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </AnimationWrapper>
    </section>
  );
};

// ============== SALES CTA BLOCK ==============
export const salesCtaBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Content" },
  { name: "urgencyText", label: "Urgency Text", type: "text", group: "Content" },
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

export const SalesCtaBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Don't Wait - Start Your Recovery Today",
    subtitle = "Join thousands of mothers who have transformed their postpartum experience.",
    ctaText = "Enroll Now",
    ctaLink = "/checkout",
    price = "₦49,000",
    originalPrice = "₦75,000",
    urgencyText = "Price increases soon",
    primaryColor = "#dc2626",
    accentColor = "#f59e0b",
    backgroundColor = "#ffffff",
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
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${primaryColor}, transparent 70%)`,
          }}
        />
      </div>

      <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-6", containerSize)}>
        <div className={cn(
          "bg-white rounded-2xl p-12 md:p-16 shadow-2xl border border-gray-100",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}>
          {/* Urgency badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6",
              textAlign === "center" && "mx-auto",
              textAlign === "right" && "ml-auto"
            )}
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <Flame className="w-4 h-4" />
            <span
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("urgencyText", e.currentTarget.textContent || "")}
            >
              {urgencyText}
            </span>
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

          {/* Price */}
          <div className={cn(
            "flex items-baseline gap-3 mb-8",
            textAlign === "center" && "justify-center",
            textAlign === "right" && "justify-end"
          )}>
            <span className="text-4xl font-black" style={{ color: primaryColor }}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
            >
              {price}
            </span>
            {originalPrice && (
              <span className="text-xl text-gray-400 line-through">{originalPrice}</span>
            )}
          </div>

          <div className={cn(
            "flex flex-col items-center gap-4",
            textAlign === "right" && "items-end"
          )}>
            <motion.a
              href={ctaLink}
              onClick={(e) => handleNav(e, ctaLink)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-10 py-5 rounded-lg font-bold text-white shadow-xl text-lg"
              style={{ backgroundColor: primaryColor }}
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

            {/* Guarantee */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
};
