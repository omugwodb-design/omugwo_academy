import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { ChevronDown, HelpCircle } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const faqBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Accordion", value: "accordion" },
      { label: "Two Column", value: "two-column" },
      { label: "Cards", value: "cards" },
    ], group: "Layout"
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "faqs", label: "FAQs", type: "array", arrayItemSchema: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Answer", type: "textarea" },
    ], group: "Content"
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const FAQBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const {
    variant = "accordion",
    title = "Frequently Asked Questions",
    subtitle = "Everything you need to know about our courses and platform.",
    faqs = [
      { question: "Who is this course for?", answer: "Our courses are designed for new mothers, expectant mothers, fathers/partners, grandmothers, and healthcare professionals who want to provide better postnatal care." },
      { question: "How long do I have access?", answer: "You get lifetime access to all course materials. Learn at your own pace, revisit lessons anytime, and access future updates at no extra cost." },
      { question: "Is there a money-back guarantee?", answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the course, we'll refund your payment in full, no questions asked." },
      { question: "Can I access the course on mobile?", answer: "Absolutely! Our platform is fully responsive and works on all devices â€” phone, tablet, and desktop. You can also download resources for offline access." },
      { question: "Do I get a certificate?", answer: "Yes, upon completing any course, you'll receive a verified digital certificate that you can share on LinkedIn or add to your professional portfolio." },
    ],
    backgroundColor,
    paddingY = "py-20",
    containerSize = "max-w-3xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateFaq = (idx: number, key: string, value: any) => {
    const next = (faqs || []).map((f: any, i: number) => (i === idx ? { ...f, [key]: value } : f));
    handleChange("faqs", next);
  };

  // â”€â”€â”€ Two Column Variant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (variant === "two-column") {
    const mid = Math.ceil(faqs.length / 2);
    const left = faqs.slice(0, mid);
    const right = faqs.slice(mid);
    const renderCol = (items: any[], startIdx: number) => (
      <div className="space-y-6">
        {items.map((faq: any, i: number) => {
          const idx = startIdx + i;
          return (
            <AnimationWrapper key={idx} animation={animConfig} index={idx}>
              <h3 className="font-bold text-gray-900 mb-2" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateFaq(idx, "question", e.currentTarget.textContent || "")}>{faq.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateFaq(idx, "answer", e.currentTarget.textContent || "")}>{faq.answer}</p>
            </AnimationWrapper>
          );
        })}
      </div>
    );
    return (
      <section className={cn(paddingY, "px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className={cn("mx-auto", containerSize)}>
          <AnimationWrapper animation={animConfig} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <div className="grid md:grid-cols-2 gap-10">
            {renderCol(left, 0)}
            {renderCol(right, mid)}
          </div>
        </div>
      </section>
    );
  }

  // â”€â”€â”€ Cards Variant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (variant === "cards") {
    return (
      <section className={cn(paddingY, "px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className={cn("mx-auto", containerSize)}>
          <AnimationWrapper animation={animConfig} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq: any, idx: number) => (
              <AnimationWrapper key={idx} animation={animConfig} index={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateFaq(idx, "question", e.currentTarget.textContent || "")}>{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateFaq(idx, "answer", e.currentTarget.textContent || "")}>{faq.answer}</p>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // â”€â”€â”€ Accordion (Default) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <section className={cn(paddingY, "px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto", containerSize)}>
        <AnimationWrapper animation={animConfig} className="text-center mb-16 flex flex-col items-center">
          <h2
            className="text-3xl md:text-5xl font-black text-gray-900 mb-6"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
          <div className="w-24 h-1.5 bg-primary-600 rounded-full mb-6"></div>
          {subtitle && (
            <p
              className="text-xl text-gray-600"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>
          )}
        </AnimationWrapper>
        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <div key={idx} className={cn("bg-white rounded-[2rem] border transition-colors", openIndex === idx ? "border-primary-100 shadow-sm" : "border-gray-100")}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span
                  className="font-bold text-gray-900 pr-4 text-lg"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateFaq(idx, "question", e.currentTarget.textContent || "")}
                >
                  {faq.question}
                </span>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors", openIndex === idx ? "bg-primary-600 text-white" : "bg-white border border-gray-100 text-primary-300 shadow-sm")}>
                  <ChevronDown className={cn("w-5 h-5 transition-transform", openIndex === idx && "rotate-180")} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-6 md:px-8 pb-8 pt-0 text-gray-500 text-lg leading-relaxed"
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => updateFaq(idx, "answer", e.currentTarget.textContent || "")}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
