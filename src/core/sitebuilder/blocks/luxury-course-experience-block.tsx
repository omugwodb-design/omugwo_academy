import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Gem } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";

export const luxuryCourseExperienceBlockSchema: PropSchema[] = [
  { name: "sectionTitle", label: "Section Title", type: "text", group: "Content" },
  { name: "quote", label: "Quote", type: "textarea", group: "Content" },
  { name: "description", label: "Description", type: "textarea", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorRole", label: "Instructor Role", type: "text", group: "Instructor" },
  { name: "instructorAvatar", label: "Instructor Avatar", type: "image", group: "Instructor" },
  { name: "image", label: "Image", type: "image", group: "Content" },
];

export const LuxuryCourseExperienceBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    sectionTitle = "The Experience",
    quote = "A masterclass that elevates the standard of maternal care.",
    description =
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
    instructorName = "Dr. Megor Ikuenobe",
    instructorRole = "Founder & Maternal Health Expert",
    instructorAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    image = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600",
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2C2C2C] font-serif">
      <div className="max-w-6xl mx-auto px-8 py-32">
        <div className="text-center mb-24">
          <Gem className="w-8 h-8 mx-auto text-[#D4AF37] mb-6" />
          <h2
            className="text-3xl font-light uppercase tracking-[0.2em] mb-8"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("sectionTitle", e.currentTarget.textContent || "")}
          >
            {sectionTitle}
          </h2>
          <div className="w-px h-16 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <h3
              className="text-4xl italic font-light leading-tight"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("quote", e.currentTarget.textContent || "")}
            >
              "{quote}"
            </h3>
            <p
              className="font-sans font-light text-[#555] leading-relaxed text-lg"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("description", e.currentTarget.textContent || "")}
            >
              {description}
            </p>
            <div className="flex items-center gap-6 pt-8 border-t border-[#EAEAEA]">
              <img src={instructorAvatar} alt="Expert" className="w-16 h-16 rounded-full object-cover grayscale" />
              <div>
                <p
                  className="font-sans font-medium uppercase tracking-widest text-sm"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorName", e.currentTarget.textContent || "")}
                >
                  {instructorName}
                </p>
                <p
                  className="font-sans font-light text-xs text-[#888] tracking-wider"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorRole", e.currentTarget.textContent || "")}
                >
                  {instructorRole}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
            <div className="absolute inset-0 border border-[#D4AF37] translate-x-4 -translate-y-4" />
            <img src={image} alt="Experience" className="relative z-10 w-full aspect-[3/4] object-cover" />
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-[#2C2C2C] font-light" strokeWidth={1} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
