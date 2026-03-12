import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Gem } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const luxuryCourseHeroBlockSchema: PropSchema[] = [
  { name: "collectionTag", label: "Collection Tag", type: "text", group: "Content" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleItalic", label: "Title Italic Part", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "brandName", label: "Brand Name", type: "text", group: "Header" },
  { name: "buttonText", label: "Button Text", type: "text", group: "Header" },
];

export const LuxuryCourseHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    collectionTag = "The Signature Collection",
    title = "The Postpartum",
    titleItalic = "Masterclass",
    subtitle = "Curated expertise for the modern mother. A refined approach to healing and wellness.",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
    brandName = "Omugwo Academy",
    buttonText = "Boutique",
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

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

  return (
    <div className="bg-[#FDFBF7] text-[#2C2C2C] font-serif selection:bg-[#D4AF37]/30">

      {/* Refined Navigation */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center bg-[#2C2C2C] text-white">
        <div
          className="tracking-[0.3em] text-sm uppercase"
          contentEditable={selected}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("brandName", e.currentTarget.textContent || "")}
        >
          {brandName}
        </div>
        <button
          className="text-xs uppercase tracking-[0.2em] border border-white/30 px-6 py-2 rounded-sm hover:bg-white hover:text-black transition-colors"
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
            onBlur={(e) => handleChange("buttonText", e.currentTarget.textContent || "")}
          >
            {buttonText}
          </span>
        </button>
      </nav>

      {/* Hero: Luxury Magazine Style */}
      <div className="relative overflow-hidden flex items-center py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury Motherhood"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#2C2C2C]/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2
              className="text-[#D4AF37] tracking-[0.4em] text-xs uppercase mb-8 font-sans"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("collectionTag", e.currentTarget.textContent || "")}
            >
              {collectionTag}
            </h2>
            <h1 className="text-5xl md:text-8xl font-light text-white mb-6 tracking-wide drop-shadow-lg">
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
              >
                {title}
              </span>
              <br />
              <span
                className="italic font-serif"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("titleItalic", e.currentTarget.textContent || "")}
              >
                {titleItalic}
              </span>
            </h1>
            <p
              className="text-white/90 font-sans font-light tracking-wide max-w-xl mx-auto text-lg md:text-xl drop-shadow"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* The Experience Section Preview */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <Gem className="w-8 h-8 mx-auto text-[#D4AF37] mb-6" />
          <h2 className="text-3xl font-light uppercase tracking-[0.2em] mb-4">The Experience</h2>
          <div className="w-px h-8 bg-[#D4AF37] mx-auto" />
        </div>
      </div>
    </div>
  );
};
