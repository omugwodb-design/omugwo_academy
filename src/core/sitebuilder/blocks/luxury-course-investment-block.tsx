import React from "react";
import { ShieldCheck } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const luxuryCourseInvestmentBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "eyebrow", label: "Eyebrow", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Pricing" },
  { name: "ctaText", label: "CTA Text", type: "text", group: "Pricing" },
];

export const LuxuryCourseInvestmentBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId?: string }>();
  const addCourse = useCartStore((s) => s.addCourse);

  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get("courseId");
  const actualCourseId = courseId || builderCourseId || undefined;

  const goToCheckout = () => {
    if (actualCourseId) addCourse(actualCourseId);
    navigate(actualCourseId ? `/checkout/${actualCourseId}` : "/checkout");
  };

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const {
    title = "Acquire Access",
    subtitle = "Lifetime access to the complete masterclass, curated resources, and priority support.",
    eyebrow = "Investment",
    price = "₦49,000",
    originalPrice = "₦129,000",
    ctaText = "Reserve Your Place",
  } = block.props || {};

  return (
    <div className="bg-[#FDFBF7] text-[#2C2C2C] font-serif py-32 px-8 text-center max-w-2xl mx-auto">
      <ShieldCheck className="w-8 h-8 mx-auto text-[#D4AF37] mb-8" />
      <h2
        className="text-4xl font-light mb-6"
        contentEditable={selected}
        suppressContentEditableWarning
        onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
      >
        {title}
      </h2>
      <p
        className="font-sans font-light text-[#555] mb-12"
        contentEditable={selected}
        suppressContentEditableWarning
        onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
      >
        {subtitle}
      </p>

      <div className="border border-[#EAEAEA] p-12 bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <span
            className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] uppercase"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("eyebrow", e.currentTarget.textContent || "")}
          >
            {eyebrow}
          </span>
        </div>

        <div className="flex justify-center items-baseline gap-4 mb-8">
          <span
            className="text-xl text-[#888] line-through font-sans font-light"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("originalPrice", e.currentTarget.textContent || "")}
          >
            {originalPrice}
          </span>
          <span
            className="text-5xl font-light"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
          >
            {price}
          </span>
        </div>

        <button
          className="w-full bg-[#2C2C2C] text-white font-sans font-light tracking-[0.2em] uppercase py-5 text-sm hover:bg-black transition-colors"
          onClick={(e) => {
            if (selected) {
              e.preventDefault();
              return;
            }
            goToCheckout();
          }}
        >
          <span
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
          >
            {ctaText}
          </span>
        </button>
      </div>
    </div>
  );
};
