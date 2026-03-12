import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Check, Star } from "lucide-react";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";
import { InlineText } from "../components/InlineText";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../../../stores/cartStore';

export const pricingBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "plans", label: "Plans", type: "array", arrayItemSchema: [
      { name: "name", label: "Plan Name", type: "text" },
      { name: "price", label: "Price", type: "text" },
      { name: "originalPrice", label: "Original Price", type: "text" },
      { name: "period", label: "Period", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "Features (comma separated)", type: "textarea" },
      { name: "ctaText", label: "Button Text", type: "text" },
      { name: "ctaLink", label: "Button Link", type: "text" },
      { name: "highlighted", label: "Highlighted", type: "boolean" },
      { name: "badge", label: "Badge", type: "text" },
    ], group: "Content"
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

export const PricingBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId?: string }>();
  const addCourse = useCartStore((s) => s.addCourse);

  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get('courseId');
  const actualCourseId = courseId || builderCourseId;

  const resolveSmartHref = (href: string) => {
    const raw = String(href || '');
    if (!raw) return raw;
    if (actualCourseId) {
      if (raw.includes('{courseId}')) return raw.replace('{courseId}', actualCourseId);
      if (raw === '/checkout' || raw === '/checkout/') return `/checkout/${actualCourseId}`;
    }
    return raw;
  };
  const {
    title = "Choose Your Learning Path",
    subtitle = "Invest in yourself and your family's wellbeing.",
    plans = [
      {
        name: "Essential",
        price: "₦29,000",
        originalPrice: "₦45,000",
        period: "one-time",
        description: "Perfect for new mothers seeking core knowledge.",
        features: "24 video lessons,Downloadable resources,Community access,Mobile-friendly,Email support",
        ctaText: "Get Started",
        ctaLink: "#",
        highlighted: false,
        badge: "",
      },
      {
        name: "Masterclass",
        price: "₦49,000",
        originalPrice: "₦75,000",
        period: "one-time",
        description: "Our most comprehensive program for the full journey.",
        features: "48 video lessons,All downloadable resources,Private community,Live Q&A sessions,Certificate of completion,Lifetime access,Priority support",
        ctaText: "Enroll Now",
        ctaLink: "#",
        highlighted: true,
        badge: "Most Popular",
      },
      {
        name: "Family Bundle",
        price: "₦69,000",
        originalPrice: "₦120,000",
        period: "one-time",
        description: "Complete access for both parents plus extended family.",
        features: "All Masterclass features,Partner Support Training,Family access (3 seats),1-on-1 consultation,Custom care plan,VIP community",
        ctaText: "Get Bundle",
        ctaLink: "#",
        highlighted: false,
        badge: "Best Value",
      },
    ],
    backgroundColor,
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updatePlan = (idx: number, key: string, value: any) => {
    const next = (plans || []).map((p: any, i: number) => (i === idx ? { ...p, [key]: value } : p));
    handleChange("plans", next);
  };

  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <InlineText
            element="h2"
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
            value={title}
            onChange={(val) => handleChange("title", val)}
            selected={selected}
          />
          <InlineText
            element="p"
            className="text-lg text-gray-600"
            value={subtitle}
            onChange={(val) => handleChange("subtitle", val)}
            selected={selected}
          />
        </div>
        <div className={cn("grid gap-8 max-w-5xl mx-auto", getResponsiveGridClasses(3, device))}>
          {plans.map((plan: any, idx: number) => {
            const features = (plan.features || "").split(",").map((f: string) => f.trim()).filter(Boolean);
            return (
              <AnimationWrapper
                key={idx}
                animation={getAnimationConfig(block.props)}
                index={idx}
                className={cn(
                  "rounded-2xl p-8 relative",
                  plan.highlighted
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20 scale-105 z-10"
                    : "bg-white border border-gray-200"
                )}
              >
                {plan.badge && (
                  <span className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full",
                    plan.highlighted ? "bg-yellow-400 text-yellow-900" : "bg-primary-100 text-primary-700"
                  )}>
                    <InlineText
                      element="span"
                      value={plan.badge}
                      onChange={(val) => updatePlan(idx, "badge", val)}
                      selected={selected}
                    />
                  </span>
                )}
                <InlineText
                  element="h3"
                  className={cn("text-xl font-bold mb-2", plan.highlighted ? "text-white" : "text-gray-900")}
                  value={plan.name}
                  onChange={(val) => updatePlan(idx, "name", val)}
                  selected={selected}
                />
                <InlineText
                  element="p"
                  className={cn("text-sm mb-4", plan.highlighted ? "text-white/70" : "text-gray-500")}
                  value={plan.description}
                  onChange={(val) => updatePlan(idx, "description", val)}
                  selected={selected}
                />
                <div className="mb-6">
                  <InlineText
                    element="span"
                    className={cn("text-4xl font-black", plan.highlighted ? "text-white" : "text-gray-900")}
                    value={plan.price}
                    onChange={(val) => updatePlan(idx, "price", val)}
                    selected={selected}
                  />
                  {plan.originalPrice && (
                    <InlineText
                      element="span"
                      className={cn("text-sm line-through ml-2", plan.highlighted ? "text-white/50" : "text-gray-400")}
                      value={plan.originalPrice}
                      onChange={(val) => updatePlan(idx, "originalPrice", val)}
                      selected={selected}
                    />
                  )}
                  <InlineText
                    element="p"
                    className={cn("text-xs mt-1", plan.highlighted ? "text-white/60" : "text-gray-400")}
                    value={plan.period}
                    onChange={(val) => updatePlan(idx, "period", val)}
                    selected={selected}
                  />
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature: string, fi: number) => (
                    <li key={fi} className={cn("flex items-center gap-2 text-sm", plan.highlighted ? "text-white/90" : "text-gray-600")}>
                      <Check className={cn("w-4 h-4 shrink-0", plan.highlighted ? "text-white" : "text-primary-600")} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={resolveSmartHref(plan.ctaLink)}
                  className={cn(
                    "block w-full text-center py-3 px-6 font-bold rounded-xl transition-colors",
                    plan.highlighted
                      ? "bg-white text-primary-700 hover:bg-gray-100"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                  onClick={(e) => {
                    if (selected) {
                      e.preventDefault();
                      return;
                    }
                    const target = resolveSmartHref(plan.ctaLink);
                    if (target && target.startsWith('/')) {
                      e.preventDefault();
                      if (actualCourseId && (target.startsWith(`/checkout/${actualCourseId}`) || target === '/checkout' || target === '/checkout/')) {
                        addCourse(actualCourseId);
                      }
                      navigate(target);
                    }
                  }}
                >
                  <InlineText
                    element="span"
                    value={plan.ctaText}
                    onChange={(val) => updatePlan(idx, "ctaText", val)}
                    selected={selected}
                  />
                </a>
              </AnimationWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
