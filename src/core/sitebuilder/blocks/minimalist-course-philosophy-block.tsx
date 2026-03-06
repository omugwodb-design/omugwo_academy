import React from "react";
import { motion } from "framer-motion";
import { BlockComponentProps, PropSchema } from "../types";

export const minimalistCoursePhilosophyBlockSchema: PropSchema[] = [
  { name: "quote", label: "Quote", type: "textarea", group: "Content" },
];

export const MinimalistCoursePhilosophyBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    quote =
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <div className="border-y border-black bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-8 py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-5xl font-light leading-relaxed max-w-4xl mx-auto"
          contentEditable={selected}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("quote", e.currentTarget.textContent?.replace(/^"|"$/g, "") || "")}
        >
          "{quote}"
        </motion.h2>
      </div>
    </div>
  );
};
