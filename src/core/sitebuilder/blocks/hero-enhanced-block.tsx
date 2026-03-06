import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Heart, ArrowRight, Play } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const heroEnhancedBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "highlightText", label: "Highlighted Text", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "ctaText", label: "Primary CTA", type: "text", group: "Content" },
  { name: "ctaLink", label: "Primary Link", type: "text", group: "Content" },
  { name: "secondaryCtaText", label: "Secondary CTA", type: "text", group: "Content" },
  { name: "secondaryCtaLink", label: "Secondary Link", type: "text", group: "Content" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Style" },
  { name: "showGradientOverlay", label: "Show Gradient Overlay", type: "boolean", group: "Style" },
  { name: "showGlassEffect", label: "Glass Morphism Effect", type: "boolean", group: "Style" },
  ...animationSchemaFields,
];

export const HeroEnhancedBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId?: string }>();
  const addCourse = useCartStore((s) => s.addCourse);

  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get('courseId');
  const actualCourseId = courseId || builderCourseId || undefined;

  const {
    title = "Modern Postnatal Education for",
    highlightText = "African Families",
    subtitle = "Bridging tradition and science for a healthier motherhood journey. Expert-led courses, supportive community, and culturally relevant guidance.",
    badgeText = "Omugwo Academy",
    ctaText = "Start Learning",
    ctaLink = "/courses",
    secondaryCtaText = "Watch Free Masterclass",
    secondaryCtaLink = "/webinars",
    backgroundImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1920",
    showGradientOverlay = true,
    showGlassEffect = true,
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const resolveSmartHref = (href: string) => {
    const raw = String(href || '');
    if (!raw) return raw;
    if (actualCourseId) {
      if (raw.includes('{courseId}')) return raw.replace('{courseId}', actualCourseId);
      if (raw === '/checkout' || raw === '/checkout/') return `/checkout/${actualCourseId}`;
    }
    return raw;
  };

  const handleSmartNav = (e: React.MouseEvent, href: string) => {
    const target = resolveSmartHref(href);
    if (selected) {
      e.preventDefault();
      return;
    }
    if (!target) return;
    if (target.startsWith('/')) {
      e.preventDefault();
      if (actualCourseId && (target.startsWith(`/checkout/${actualCourseId}`) || target === '/checkout' || target === '/checkout/')) {
        addCourse(actualCourseId);
      }
      navigate(target);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        
        {/* Enhanced Gradient Overlay - Left to Right Fade */}
        {showGradientOverlay && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent" 
                 style={{ 
                   background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 40%, transparent 80%)'
                 }} 
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-32 w-full">
        <AnimationWrapper animation={getAnimationConfig(block.props)} className="max-w-2xl">
          {/* Badge with Glass Effect */}
          <div className="mb-6 inline-flex">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
                showGlassEffect
                  ? "bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 text-purple-700 shadow-sm"
                  : "bg-purple-100 text-purple-700"
              )}
              style={showGlassEffect ? {
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(124, 58, 237, 0.1)'
              } : {}}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("badgeText", e.currentTarget.textContent || "")}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              {badgeText}
            </div>
          </div>

          {/* Headline with Gradient Text */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight"
              style={{ lineHeight: 1.1 }}>
            <span
              className="text-gray-900"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {title}
            </span>
            {' '}
            <span
              className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("highlightText", e.currentTarget.textContent || "")}
            >
              {highlightText}
            </span>
          </h1>

          {/* Subtitle with Better Spacing */}
          <p
            className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
            style={{ lineHeight: 1.75 }}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Primary CTA with Glow */}
            <a
              href={resolveSmartHref(ctaLink)}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.5), 0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onClick={(e) => handleSmartNav(e, ctaLink)}
            >
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
              >
                {ctaText}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary CTA - Lighter */}
            <a
              href={resolveSmartHref(secondaryCtaLink)}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300"
              style={{
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.1)';
              }}
              onClick={(e) => handleSmartNav(e, secondaryCtaLink)}
            >
              <Play className="w-5 h-5 fill-purple-600 text-purple-600" />
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("secondaryCtaText", e.currentTarget.textContent || "")}
              >
                {secondaryCtaText}
              </span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white" />
                ))}
              </div>
              <span>5,000+ families</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};
