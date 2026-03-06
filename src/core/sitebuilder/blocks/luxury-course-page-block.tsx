import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlayCircle, ShieldCheck, Gem } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const luxuryCoursePageBlockSchema: PropSchema[] = [];

export const LuxuryCoursePageBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
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
    brandName: "Omugwo Academy",
    navButtonText: "Boutique",
    collectionTag: "The Signature Collection",
    title: "The Postpartum",
    titleItalic: "Masterclass",
    subtitle: "Curated expertise for the modern mother. A refined approach to healing and wellness.",
    heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
    videoBg: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600",
    description:
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
    modules: [
      { id: "m1", title: "Module 1: Body Recovery", duration: "2h 15m", lessons: ["Introduction to Postpartum Recovery", "Understanding Your Body's Changes"] },
      { id: "m2", title: "Module 2: Mental Health", duration: "1h 45m", lessons: ["Recognizing Baby Blues vs PPD", "Building Your Support System"] },
    ],
    instructor: {
      name: "Dr. Megor Ikuenobe",
      role: "Founder & Maternal Health Expert",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    price: "₦49,000",
    originalPrice: "₦129,000",
    experienceTitle: "The Experience",
    experienceQuote: "A masterclass that elevates the standard of maternal care.",
    curriculumEyebrow: "The Curriculum",
    curriculumTitle: "Program Itinerary",
    investmentTitle: "Acquire Access",
    investmentSubtitle: "Lifetime access to the complete masterclass, curated resources, and priority support.",
    investmentEyebrow: "Investment",
    investmentCtaText: "Reserve Your Place",
  };

  const templateData = { ...fallback, ...(block.props || {}) };
  const data = COURSE_DATA || templateData;

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2C] font-serif selection:bg-[#D4AF37]/30">
      <nav className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent text-white">
        <div
          className="tracking-[0.3em] text-sm uppercase"
          contentEditable={selected && !COURSE_DATA}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("brandName", e.currentTarget.textContent || "")}
        >
          {templateData.brandName}
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
            contentEditable={selected && !COURSE_DATA}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("navButtonText", e.currentTarget.textContent || "")}
          >
            {templateData.navButtonText}
          </span>
        </button>
      </nav>

      <div className="h-screen relative overflow-hidden flex items-center">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img src={data.heroImage} alt="Luxury Motherhood" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-[#2C2C2C]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]" />
        </motion.div>

        <div className="relative z-10 w-full px-8 md:px-16 text-center mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            <h2
              className="text-[#D4AF37] tracking-[0.4em] text-xs uppercase mb-8 font-sans"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("collectionTag", e.currentTarget.textContent || "")}
            >
              {templateData.collectionTag}
            </h2>
            <h1 className="text-5xl md:text-8xl font-light text-white mb-6 tracking-wide drop-shadow-lg">
              <span
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
              >
                {templateData.title}
              </span>
              <br />
              <span
                className="italic font-serif"
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("titleItalic", e.currentTarget.textContent || "")}
              >
                {templateData.titleItalic}
              </span>
            </h1>
            <p
              className="text-white/90 font-sans font-light tracking-wide max-w-xl mx-auto text-lg md:text-xl drop-shadow"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {templateData.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-32">
        <div className="text-center mb-24">
          <Gem className="w-8 h-8 mx-auto text-[#D4AF37] mb-6" />
          <h2
            className="text-3xl font-light uppercase tracking-[0.2em] mb-8"
            contentEditable={selected && !COURSE_DATA}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("experienceTitle", e.currentTarget.textContent || "")}
          >
            {templateData.experienceTitle}
          </h2>
          <div className="w-px h-16 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <h3
              className="text-4xl italic font-light leading-tight"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("experienceQuote", e.currentTarget.textContent?.replace(/^"|"$/g, "") || "")}
            >
              "{templateData.experienceQuote}"
            </h3>
            <p className="font-sans font-light text-[#555] leading-relaxed text-lg">{data.description}</p>
            <div className="flex items-center gap-6 pt-8 border-t border-[#EAEAEA]">
              <img src={data.instructor.avatar} alt="Expert" className="w-16 h-16 rounded-full object-cover grayscale" />
              <div>
                <p className="font-sans font-medium uppercase tracking-widest text-sm">{data.instructor.name}</p>
                <p className="font-sans font-light text-xs text-[#888] tracking-wider">{data.instructor.role}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
            <div className="absolute inset-0 border border-[#D4AF37] translate-x-4 -translate-y-4" />
            <img src={data.videoBg} alt="Experience" className="relative z-10 w-full aspect-[3/4] object-cover" />
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-[#2C2C2C] font-light" strokeWidth={1} />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#2C2C2C] text-[#FDFBF7] py-32">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2
              className="text-sm font-sans font-light uppercase tracking-[0.4em] text-[#D4AF37] mb-4"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("curriculumEyebrow", e.currentTarget.textContent || "")}
            >
              {templateData.curriculumEyebrow}
            </h2>
            <h3
              className="text-4xl italic font-light"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("curriculumTitle", e.currentTarget.textContent || "")}
            >
              {templateData.curriculumTitle}
            </h3>
          </div>

          <div className="space-y-16">
            {(data.modules || []).map((mod: any, i: number) => (
              <div key={mod.id} className="relative pl-12 border-l border-white/20 pb-8">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full border border-[#D4AF37] bg-[#2C2C2C]" />
                <span className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] block mb-2">PART 0{i + 1}</span>
                <h4 className="text-3xl font-light mb-6">{String(mod.title).split(": ")[1] || mod.title}</h4>
                <ul className="space-y-4">
                  {(mod.lessons || []).map((lesson: string, j: number) => (
                    <li key={j} className="flex items-center justify-between font-sans font-light text-sm text-[#CCC] border-b border-white/10 pb-4">
                      <span>{lesson}</span>
                      <span className="italic text-[#888]">Included</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-32 px-8 text-center max-w-2xl mx-auto">
        <ShieldCheck className="w-8 h-8 mx-auto text-[#D4AF37] mb-8" />
        <h2
          className="text-4xl font-light mb-6"
          contentEditable={selected && !COURSE_DATA}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("investmentTitle", e.currentTarget.textContent || "")}
        >
          {templateData.investmentTitle}
        </h2>
        <p
          className="font-sans font-light text-[#555] mb-12"
          contentEditable={selected && !COURSE_DATA}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("investmentSubtitle", e.currentTarget.textContent || "")}
        >
          {templateData.investmentSubtitle}
        </p>

        <div className="border border-[#EAEAEA] p-12 bg-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            <span
              className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] uppercase"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("investmentEyebrow", e.currentTarget.textContent || "")}
            >
              {templateData.investmentEyebrow}
            </span>
          </div>

          <div className="flex justify-center items-baseline gap-4 mb-8">
            <span className="text-xl text-[#888] line-through font-sans font-light">{data.originalPrice}</span>
            <span className="text-5xl font-light">{data.price}</span>
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
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("investmentCtaText", e.currentTarget.textContent || "")}
            >
              {templateData.investmentCtaText}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
