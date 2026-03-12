import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { Heart, Star, Play, Users, Baby, BookOpen, Shield, Zap, Award, Target, Mic, Calendar } from "lucide-react";
import { AnimatedBlob } from "../components/AnimatedBlob";
import { InlineText } from "../components/InlineText";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

const ICON_MAP: Record<string, React.FC<any>> = {
  heart: Heart, star: Star, play: Play, users: Users, baby: Baby,
  book: BookOpen, shield: Shield, zap: Zap, award: Award,
  target: Target, mic: Mic, calendar: Calendar,
};

export const heroBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Centered", value: "centered" },
      { label: "Split (Image Right)", value: "split" },
      { label: "Minimal", value: "minimal" },
      { label: "Video Background", value: "video-bg" },
    ], group: "Layout"
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Text", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "Button Link", type: "text", group: "Content" },
  { name: "secondaryCtaText", label: "Secondary Button", type: "text", group: "Content" },
  { name: "secondaryCtaLink", label: "Secondary Link", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image (Split)", type: "image", group: "Content" },
  {
    name: "heroImageSize",
    label: "Hero Image Size",
    type: "select",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
    group: "Layout",
  },
  {
    name: "imagePosition", label: "Image Position", type: "select", options: [
      { label: "Right", value: "right" },
      { label: "Left", value: "left" },
    ], group: "Layout"
  },
  {
    name: "imageEffect", label: "Image Effect", type: "select", options: [
      { label: "None", value: "none" },
      { label: "Rotate Right", value: "rotate-right" },
      { label: "Rotate Left", value: "rotate-left" },
      { label: "Animated Blob", value: "animated-blob" },
    ], group: "Layout"
  },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  {
    name: "badgeIcon", label: "Badge Icon", type: "select", options: [
      { label: "None", value: "" },
      { label: "Heart", value: "heart" },
      { label: "Star", value: "star" },
      { label: "Play", value: "play" },
      { label: "Users", value: "users" },
      { label: "Baby", value: "baby" },
      { label: "Book", value: "book" },
    ], group: "Content"
  },
  {
    name: "align", label: "Alignment", type: "select", options: [
      { label: "Center", value: "center" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ], group: "Layout"
  },
  {
    name: "contentAlign",
    label: "Content Alignment",
    type: "select",
    options: [
      { label: "Center", value: "center" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
    group: "Content",
  },
  { name: "fullHeight", label: "Full Height (Screen)", type: "boolean", group: "Layout" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Background" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Background" },
  { name: "backgroundGradient", label: "Gradient", type: "gradient", group: "Background" },
  { name: "showOverlay", label: "Show Overlay", type: "boolean", group: "Background" },
  {
    name: "overlayType", label: "Overlay Type", type: "select", options: [
      { label: "Solid", value: "solid" },
      { label: "Side Gradient (Light)", value: "gradient-side-light" },
      { label: "Side Gradient (Dark)", value: "gradient-side-dark" },
    ], group: "Background"
  },
  { name: "overlayOpacity", label: "Overlay Opacity", type: "number", min: 0, max: 100, step: 5, group: "Background" },
  { name: "videoUrl", label: "Video URL (Video BG)", type: "text", group: "Background" },

  // Social Proof Group
  { name: "showSocialProof", label: "Show Social Proof", type: "boolean", group: "Social Proof" },
  { name: "socialProofText", label: "Social Proof Text", type: "text", group: "Social Proof" },
  { name: "socialProofAvatars", label: "Avatars", type: "array", arrayItemSchema: [{ name: "url", label: "Image URL", type: "image" }], group: "Social Proof" },
  { name: "showRating", label: "Show Rating Stars", type: "boolean", group: "Social Proof" },

  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const HeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId?: string }>();
  const addCourse = useCartStore((s) => s.addCourse);

  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get("courseId");
  const actualCourseId = courseId || builderCourseId || undefined;

  // Determine effectiveVariant - if block type is hero_split, use "split" as default
  const effectiveVariant = block.props.variant || (block.type === "hero_split" ? "split" : "centered");
  const isSplitLike = effectiveVariant === "split";
  const isPodcastSplit = block.type === "hero_split";

  const {
    title = "Empowering Your Postpartum Journey",
    titleHighlight = "",
    subtitle = "Evidence-based care meets cultural wisdom. Join thousands of mothers transforming their recovery experience.",
    ctaText = "Start Learning",
    ctaLink = "#",
    secondaryCtaText = "Watch Free Masterclass",
    secondaryCtaLink = "#",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    heroImageSize = "md",
    imagePosition = "right",
    imageEffect = "none",
    badgeText = "",
    badgeIcon = "",
    align = "center",
    contentAlign = align,
    backgroundImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=2000",
    backgroundColor,
    backgroundGradient,
    showOverlay = true,
    overlayType = "solid",
    overlayOpacity = 50,
    videoUrl,
    showSocialProof = false,
    socialProofText = "15,000+ families supported",
    socialProofAvatars = [],
    showRating = false,
    paddingY = "py-32",
    containerSize = "max-w-7xl",
    fullHeight = false,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const resolveSmartHref = (href: string) => {
    const raw = String(href || "");
    if (!raw) return raw;
    if (actualCourseId) {
      if (raw.includes("{courseId}")) return raw.replace("{courseId}", actualCourseId);
      if (raw === "/checkout" || raw === "/checkout/") return `/checkout/${actualCourseId}`;
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

    // in-app navigation
    if (target.startsWith("/")) {
      e.preventDefault();
      if (actualCourseId && (target.startsWith(`/checkout/${actualCourseId}`) || target === "/checkout" || target === "/checkout/")) {
        addCourse(actualCourseId);
      }
      navigate(target);
    }
  };

  const effectiveHeroImageSize =
    isSplitLike && !block.props.heroImageSize ? "lg" : heroImageSize;

  const heroImageSizeClass =
    effectiveHeroImageSize === "sm"
      ? "max-w-[340px] lg:max-w-[380px]"
      : effectiveHeroImageSize === "lg"
        ? "max-w-[520px] lg:max-w-[600px]"
        : "max-w-[420px] lg:max-w-[460px]";

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const onBlurHtml = (key: string) => (e: React.FocusEvent<HTMLElement>) => {
    handleChange(key, (e.currentTarget as any).innerHTML || "");
  };

  const BadgeIcon = badgeIcon ? ICON_MAP[badgeIcon] : null;

  const isDark = (showOverlay && overlayType !== "gradient-side-light") || (backgroundImage && effectiveVariant !== "split" && effectiveVariant !== "minimal" && overlayType !== "gradient-side-light");

  const renderTitle = () => {
    if (!titleHighlight) return title;
    const parts = title.split(new RegExp(`(${titleHighlight})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === titleHighlight.toLowerCase() ? (
            <span key={i} className="text-primary-600">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderSocialProof = () => (
    <div className={cn(
      "mt-12 flex items-center gap-6",
      contentAlign === "center" && "justify-center",
      contentAlign === "right" && "justify-end"
    )}>
      {socialProofAvatars && socialProofAvatars.length > 0 && (
        <div className="flex -space-x-3">
          {socialProofAvatars.map((avatar: any, i: number) => (
            <img
              key={i}
              src={avatar.url || `https://i.pravatar.cc/100?img=${i + 10}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ))}
        </div>
      )}
      <div>
        {showRating && (
          <div className="flex items-center gap-1 mb-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        )}
        {socialProofText && (
          <p className={cn("text-sm", isDark ? "text-white/80" : "text-gray-600")}>
            {socialProofText}
          </p>
        )}
      </div>
    </div>
  );

  const renderOverlay = () => {
    if (!showOverlay) return null;

    if (overlayType === "solid") {
      return (
        <div
          className="absolute inset-0 z-[1]"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
        />
      );
    }

    if (overlayType === "gradient-side-light" || overlayType === "gradient-side") {
      return (
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/95 to-white/30"
          style={{ opacity: overlayOpacity / 100 }}
        />
      );
    }

    if (overlayType === "gradient-side-dark") {
      return (
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/80 to-transparent"
          style={{ opacity: overlayOpacity / 100 }}
        />
      );
    }

    return null;
  };

  //  Split Variant 
  if (effectiveVariant === "split") {
    return (
      <section
        className={cn("relative", paddingY)}
        style={{ backgroundColor: backgroundColor || "transparent", background: backgroundGradient || undefined }}
      >
        <div className={cn("mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center", containerSize)}>
          <AnimationWrapper animation={{ ...animConfig, type: animConfig.type || "slideUp" }} className={imagePosition === "left" ? "order-2" : "order-1"}>
            <div className={cn(contentAlign === "center" && "text-center", contentAlign === "right" && "text-right")}>
              {badgeText && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-900 text-gray-900 text-[10px] font-bold tracking-widest uppercase rounded-full mb-6">
                  {BadgeIcon && <BadgeIcon className="w-3 h-3 fill-current" />}
                  <InlineText
                    element="span"
                    value={badgeText}
                    onChange={(val) => handleChange("badgeText", val)}
                    selected={selected}
                  />
                </span>
              )}
              <InlineText
                element="h1"
                className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-[1.1]"
                value={titleHighlight ? String(renderTitle() as any) : (title || "")}
                onChange={(val) => handleChange("title", val)}
                selected={selected}
              />
              <InlineText
                element="p"
                className="text-lg md:text-xl mb-8 text-gray-600 max-w-lg leading-relaxed"
                value={subtitle}
                onChange={(val) => handleChange("subtitle", val)}
                selected={selected}
              />
              <div className={cn(
                "flex gap-4 flex-wrap",
                contentAlign === "center" && "justify-center",
                contentAlign === "right" && "justify-end"
              )}>
                {ctaText && (
                  <a
                    href={resolveSmartHref(ctaLink)}
                    className="inline-flex items-center px-8 py-4 bg-[#a855f7] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/30"
                    onClick={(e) => handleSmartNav(e, ctaLink)}
                  >
                    <InlineText
                      element="span"
                      value={ctaText}
                      onChange={(val) => handleChange("ctaText", val)}
                      selected={selected}
                    />
                  </a>
                )}
                {secondaryCtaText && (
                  <a
                    href={resolveSmartHref(secondaryCtaLink)}
                    className="inline-flex items-center px-8 py-4 font-bold uppercase tracking-wider rounded-full transition-colors border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={(e) => handleSmartNav(e, secondaryCtaLink)}
                  >
                    {secondaryCtaText}
                  </a>
                )}
              </div>
              {showSocialProof && renderSocialProof()}
            </div>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, type: animConfig.type || (imagePosition === "left" ? "slideRight" : "slideLeft"), delay: 0.2 }} className={cn("relative", imagePosition === "left" ? "order-1" : "order-2")}>
            <div className="relative">
              {imageEffect === "rotate-right" && (
                <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] rotate-3 opacity-50 z-0" />
              )}
              {imageEffect === "rotate-left" && (
                <div className="absolute -inset-4 bg-primary-100 rounded-[3rem] -rotate-3 opacity-50 z-0" />
              )}
              {(imageEffect === "animated-blob" || isPodcastSplit) ? (
                <AnimatedBlob className="-inset-2 -translate-x-2 -translate-y-2" />
              ) : (
                <>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary-100 rounded-2xl z-0" />
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-600/20 rounded-full z-0" />
                </>
              )}
              <div className={cn("relative z-10", (isPodcastSplit || imageEffect === "animated-blob") && heroImageSizeClass)}>
                <img
                  src={heroImage}
                  alt="Hero"
                  className={cn(
                    "relative w-full rounded-[2.5rem] shadow-2xl object-cover",
                    isPodcastSplit ? "aspect-square" : "aspect-[4/3]"
                  )}
                />
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    );
  }

  //  Minimal Variant 
  if (effectiveVariant === "minimal") {
    return (
      <section className={cn("relative overflow-hidden", paddingY)} style={{ backgroundColor: backgroundColor || "#ffffff" }}>
        <AnimationWrapper animation={animConfig} className={cn("mx-auto px-4 md:px-8 text-center", containerSize)}>
          {badgeText && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-full mb-6">
              {BadgeIcon && <BadgeIcon className="w-3 h-3 fill-current" />}
              {badgeText}
            </span>
          )}
          <InlineText
            element="h1"
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-[1.1]"
            value={titleHighlight ? String(renderTitle() as any) : (title || "")}
            onChange={(val) => handleChange("title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-lg md:text-xl mb-8 text-gray-500 max-w-2xl mx-auto leading-relaxed"
            value={subtitle}
            onChange={(val) => handleChange("subtitle", val)}
            selected={selected}
          />
          <div className="flex gap-4 flex-wrap justify-center">
            {ctaText && (
              <a
                href={resolveSmartHref(ctaLink)}
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                onClick={(e) => handleSmartNav(e, ctaLink)}
              >
                {ctaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={resolveSmartHref(secondaryCtaLink)}
                className="inline-flex items-center px-8 py-4 font-bold rounded-xl transition-colors text-gray-600 hover:text-gray-900"
                onClick={(e) => handleSmartNav(e, secondaryCtaLink)}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
          {showSocialProof && renderSocialProof()}
        </AnimationWrapper>
      </section>
    );
  }

  //  Video Background Variant 
  if (effectiveVariant === "video-bg") {
    return (
      <section className={cn("relative flex flex-col justify-center items-center text-center overflow-hidden min-h-[600px]", paddingY)}>
        {videoUrl && (
          <div className="absolute inset-0 z-0">
            <iframe
              src={videoUrl.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0"}
              className="w-full h-full object-cover"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", minWidth: "100%", minHeight: "100%" }}
              allow="autoplay; fullscreen"
              frameBorder="0"
              title="Background video"
            />
          </div>
        )}
        {!videoUrl && backgroundImage && (
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
          </div>
        )}
        {renderOverlay()}
        <AnimationWrapper animation={animConfig} className={cn("relative z-10 mx-auto px-4 md:px-8", containerSize)}>
          <InlineText
            element="h1"
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-[1.1]"
            value={titleHighlight ? String(renderTitle() as any) : (title || "")}
            onChange={(val) => handleChange("title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/80 leading-relaxed"
            value={subtitle}
            onChange={(val) => handleChange("subtitle", val)}
            selected={selected}
          />
          <div className="flex gap-4 flex-wrap justify-center">
            {ctaText && (
              <a
                href={resolveSmartHref(ctaLink)}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
                onClick={(e) => handleSmartNav(e, ctaLink)}
              >
                {ctaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={resolveSmartHref(secondaryCtaLink)}
                className="inline-flex items-center px-8 py-4 font-bold rounded-xl transition-colors border-2 border-white/30 text-white hover:bg-white/10"
                onClick={(e) => handleSmartNav(e, secondaryCtaLink)}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
          {showSocialProof && renderSocialProof()}
        </AnimationWrapper>
      </section>
    );
  }

  //  Centered (Default) Variant 
  return (
    <section
      className={cn(
        "relative flex flex-col justify-center overflow-hidden min-h-[600px]",
        fullHeight && "min-h-screen",
        paddingY,
        align === "left" && "items-start",
        align === "center" && "items-center",
        align === "right" && "items-end"
      )}
      style={{
        backgroundColor: backgroundColor || undefined,
        background: backgroundGradient || undefined,
      }}
    >
      {backgroundImage && !backgroundColor && !backgroundGradient && (
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      )}

      {renderOverlay()}

      <AnimationWrapper
        animation={animConfig}
        className={cn(
          "relative z-10 mx-auto px-4 md:px-8",
          containerSize,
          align === "left" && "ml-0 mr-auto",
          align === "right" && "mr-0 ml-auto"
        )}
      >
        {badgeText && (
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-full mb-6",
            isDark ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
          )}>
            {BadgeIcon && <BadgeIcon className="w-3 h-3 fill-current" />}
            {badgeText}
          </span>
        )}

        <InlineText
          element="h1"
          className={cn(
            "text-4xl md:text-6xl font-black tracking-tight mb-6",
            contentAlign === "center" && "text-center",
            contentAlign === "right" && "text-right",
            isDark ? "text-white" : "text-gray-900"
          )}
          value={titleHighlight ? String(renderTitle() as any) : (title || "")}
          onChange={(val) => handleChange("title", val)}
          selected={selected}
        />

        <InlineText
          element="p"
          className={cn(
            "text-lg md:text-xl mb-8 max-w-2xl leading-relaxed",
            contentAlign === "center" && "mx-auto",
            contentAlign === "right" && "ml-auto",
            contentAlign === "center" && "text-center",
            contentAlign === "right" && "text-right",
            isDark ? "text-white/80" : "text-gray-600"
          )}
          value={subtitle}
          onChange={(val) => handleChange("subtitle", val)}
          selected={selected}
        />

        <div className={cn(
          "flex gap-4 flex-wrap",
          contentAlign === "center" && "justify-center",
          contentAlign === "right" && "justify-end"
        )}>
          {ctaText && (
            <a
              href={resolveSmartHref(ctaLink)}
              className={cn(
                "inline-flex items-center px-8 py-4 font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg",
                isDark
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              )}
              onClick={(e) => handleSmartNav(e, ctaLink)}
            >
              {ctaText}
            </a>
          )}
          {secondaryCtaText && (
            <a
              href={resolveSmartHref(secondaryCtaLink)}
              className={cn(
                "inline-flex items-center px-8 py-4 font-bold rounded-full transition-colors border-2",
                isDark
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
              onClick={(e) => handleSmartNav(e, secondaryCtaLink)}
            >
              {secondaryCtaText}
            </a>
          )}
        </div>

        {showSocialProof && renderSocialProof()}
      </AnimationWrapper>
    </section>
  );
};
