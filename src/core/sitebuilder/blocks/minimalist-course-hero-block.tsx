import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const minimalistCourseHeroBlockSchema: PropSchema[] = [
  { name: "tagline", label: "Tagline", type: "text", group: "Content" },
  { name: "titleLine1", label: "Title Line 1", type: "text", group: "Content" },
  { name: "titleLine2", label: "Title Line 2", type: "text", group: "Content" },
  { name: "titleLine3", label: "Title Line 3", type: "text", group: "Content" },
  { name: "titleLine4", label: "Title Line 4", type: "text", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "brandName", label: "Brand Name", type: "text", group: "Header" },
];

export const MinimalistCourseHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    tagline = "A Modern Guide to Postpartum",
    titleLine1 = "Reclaim",
    titleLine2 = "Your Body.",
    titleLine3 = "Restore",
    titleLine4 = "Your Mind.",
    ctaText = "Start the Journey",
    price = "₦49,000",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
    brandName = "Omugwo.",
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
    <div className="min-h-screen bg-white text-black font-serif antialiased">
      {/* Editorial Header */}
      <header className="border-b border-black">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex justify-between items-center">
          <div 
            className="font-bold tracking-tighter text-2xl uppercase"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("brandName", e.currentTarget.textContent || "")}
          >
            {brandName}
          </div>
          <button
            className="text-sm font-bold uppercase tracking-widest hover:underline underline-offset-4"
            onClick={(e) => {
              if (selected) {
                e.preventDefault();
                return;
              }
              goToCheckout();
            }}
          >
            Enroll Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-screen-2xl mx-auto px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p 
                className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-gray-500"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("tagline", e.currentTarget.textContent || "")}
              >
                {tagline}
              </p>
              <h1 className="text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.9] mb-12">
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine1", e.currentTarget.textContent || "")}
                >
                  {titleLine1}
                </span>
                <br />
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine2", e.currentTarget.textContent || "")}
                >
                  {titleLine2}
                </span>
                <br />
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine3", e.currentTarget.textContent || "")}
                >
                  {titleLine3}
                </span>
                <br />
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine4", e.currentTarget.textContent || "")}
                >
                  {titleLine4}
                </span>
              </h1>
              
              <div className="flex items-center gap-6">
                <button
                  className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-3"
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
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span 
                  className="text-2xl font-light"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                >
                  {price}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="aspect-[3/4] relative overflow-hidden group"
            >
              <img 
                src={heroImage} 
                alt="Motherhood" 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 border border-black/10 m-4 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
