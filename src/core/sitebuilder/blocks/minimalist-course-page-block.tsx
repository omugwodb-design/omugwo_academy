import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const minimalistCoursePageBlockSchema: PropSchema[] = [];

export const MinimalistCoursePageBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const COURSE_DATA = block.props?.courseData;
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

  const fallback = {
    price: "₦49,000",
    heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
    description:
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
    stats: { lessons: 48, duration: "12 Hours", students: "8,432", rating: 4.9 },
    modules: [
      { id: "m1", title: "Module 1: Body Recovery", duration: "2h 15m", lessons: ["Introduction to Postpartum Recovery", "Understanding Your Body's Changes", "Safe Exercise Guidelines", "Nutrition for Recovery"] },
      { id: "m2", title: "Module 2: Mental Health", duration: "1h 45m", lessons: ["Recognizing Baby Blues vs PPD", "Building Your Support System", "Self-Care Strategies"] },
    ],
    instructor: {
      name: "Dr. Megor Ikuenobe",
      role: "Founder & Maternal Health Expert",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      bio: "Dr. Megor is a distinguished medical professional and early childhood development specialist.",
    },
  };

  const templateData = { ...fallback, ...(block.props || {}) };
  const data = COURSE_DATA || templateData;

  return (
    <div className="min-h-screen bg-white text-black font-serif antialiased">
      <header className="border-b border-black">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex justify-between items-center">
          <div
            className="font-bold tracking-tighter text-2xl uppercase"
            contentEditable={selected && !COURSE_DATA}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("brandName", e.currentTarget.textContent || "")}
          >
            {templateData.brandName || "Omugwo."}
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
            <span
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
            >
              {templateData.ctaText || "Enroll Now"}
            </span>
          </button>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <p
                className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-gray-500"
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("tagline", e.currentTarget.textContent || "")}
              >
                {templateData.tagline || "A Modern Guide to Postpartum"}
              </p>
              <h1 className="text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.9] mb-12">
                <span
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine1", e.currentTarget.textContent || "")}
                >
                  {templateData.titleLine1 || "Reclaim"}
                </span>
                <br />
                <span
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine2", e.currentTarget.textContent || "")}
                >
                  {templateData.titleLine2 || "Your Body."}
                </span>
                <br />
                <span
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine3", e.currentTarget.textContent || "")}
                >
                  {templateData.titleLine3 || "Restore"}
                </span>
                <br />
                <span
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("titleLine4", e.currentTarget.textContent || "")}
                >
                  {templateData.titleLine4 || "Your Mind."}
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
                    contentEditable={selected && !COURSE_DATA}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("buttonText", e.currentTarget.textContent || "")}
                  >
                    {templateData.buttonText || "Start the Journey"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span
                  className="text-2xl font-light"
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                >
                  {data.price}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="aspect-[3/4] relative overflow-hidden group">
              <img src={data.heroImage} alt="Motherhood" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 border border-black/10 m-4 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-y border-black bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-8 py-32 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-light leading-relaxed max-w-4xl mx-auto"
          >
            <span
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("description", e.currentTarget.textContent?.replace(/^"|"$/g, "") || "")}
            >
              "{data.description}"
            </span>
          </motion.h2>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">The Syllabus</h2>
              <p className="text-gray-500 mb-8">{data.stats.lessons} carefully curated lessons over {data.stats.duration}.</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-black">
              {(data.modules || []).map((mod: any, i: number) => (
                <div key={mod.id} className="group border-b border-black py-8 hover:bg-gray-50 transition-colors cursor-pointer px-4 -mx-4">
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-2xl lg:text-4xl font-medium tracking-tight">
                      <span className="text-gray-400 text-lg mr-4 font-mono">0{i + 1}</span>
                      {String(mod.title).split(": ")[1] || mod.title}
                    </h3>
                    <span className="font-mono text-sm">{mod.duration}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-y-3 h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                    {(mod.lessons || []).map((lesson: string, j: number) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-1 text-gray-400" />
                        <span className="text-gray-600">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
