import React from "react";
import { motion } from "framer-motion";
import { Play, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const cinematicCourseBodyBlockSchema: PropSchema[] = [
  { name: "overviewTitle", label: "Overview Title", type: "text", group: "Content" },
  { name: "description", label: "Description", type: "textarea", group: "Content" },
  { name: "curriculumTitle", label: "Curriculum Title", type: "text", group: "Content" },
  {
    name: "modules",
    label: "Modules",
    type: "array",
    group: "Content",
    arrayItemSchema: [
      { name: "id", label: "ID", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      {
        name: "lessons",
        label: "Lessons",
        type: "array",
        arrayItemSchema: [{ name: "text", label: "Lesson", type: "text" }],
      },
    ],
  },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorRole", label: "Instructor Role", type: "text", group: "Instructor" },
  { name: "instructorAvatar", label: "Instructor Avatar", type: "image", group: "Instructor" },
  { name: "instructorBio", label: "Instructor Bio", type: "textarea", group: "Instructor" },
  { name: "price", label: "Price", type: "text", group: "Pricing" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Pricing" },
  {
    name: "highlights",
    label: "Highlights",
    type: "array",
    group: "Pricing",
    arrayItemSchema: [{ name: "text", label: "Highlight", type: "text" }],
  },
  { name: "ctaText", label: "CTA Text", type: "text", group: "Pricing" },
];

export const CinematicCourseBodyBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
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
    overviewTitle = "The Definitive Guide to Your Recovery",
    description =
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
    curriculumTitle = "Curriculum",
    modules = [
      {
        id: "m1",
        title: "Module 1: Body Recovery",
        duration: "2h 15m",
        lessons: [
          { text: "Introduction to Postpartum Recovery" },
          { text: "Understanding Your Body's Changes" },
          { text: "Safe Exercise Guidelines" },
          { text: "Nutrition for Recovery" },
        ],
      },
      {
        id: "m2",
        title: "Module 2: Mental Health",
        duration: "1h 45m",
        lessons: [
          { text: "Recognizing Baby Blues vs PPD" },
          { text: "Building Your Support System" },
          { text: "Self-Care Strategies" },
        ],
      },
    ],
    instructorName = "Dr. Megor Ikuenobe",
    instructorRole = "Founder & Maternal Health Expert",
    instructorAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    instructorBio = "Dr. Megor is a distinguished medical professional and early childhood development specialist.",
    price = "₦49,000",
    originalPrice = "₦129,000",
    highlights = [
      { text: "12 Hours on-demand video" },
      { text: "48 Lessons" },
      { text: "Lifetime access" },
      { text: "Certificate of completion" },
      { text: "30-day money-back guarantee" },
    ],
    ctaText = "Enroll Now",
  } = block.props || {};

  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <h2
              className="text-3xl md:text-5xl font-black mb-8"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("overviewTitle", e.currentTarget.textContent || "")}
            >
              {overviewTitle}
            </h2>
            <div className="prose prose-invert prose-lg text-gray-300">
              <p
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("description", e.currentTarget.textContent || "")}
              >
                {description}
              </p>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <h2
              className="text-3xl md:text-5xl font-black mb-10"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("curriculumTitle", e.currentTarget.textContent || "")}
            >
              {curriculumTitle}
            </h2>
            <div className="space-y-6">
              {(modules || []).map((mod: any, i: number) => (
                <div
                  key={mod.id}
                  className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-red-500 text-sm font-bold tracking-wider uppercase mb-2 block">Module {i + 1}</span>
                      <h3
                        className="text-2xl font-bold"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const next = (modules || []).map((m: any, idx: number) =>
                            idx === i ? { ...m, title: e.currentTarget.textContent || "" } : m
                          );
                          handleChange("modules", next);
                        }}
                      >
                        {String(mod.title).split(": ")[1] || mod.title}
                      </h3>
                    </div>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const next = (modules || []).map((m: any, idx: number) =>
                            idx === i ? { ...m, duration: e.currentTarget.textContent || "" } : m
                          );
                          handleChange("modules", next);
                        }}
                      >
                        {mod.duration}
                      </span>
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {(mod.lessons || []).map((lesson: any, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Play className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
                        <span
                          contentEditable={selected}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const next = (modules || []).map((m: any, idx: number) => {
                              if (idx !== i) return m;
                              const nextLessons = (m.lessons || []).map((l: any, lj: number) => {
                                if (lj !== j) return l;
                                if (typeof l === "string") return e.currentTarget.textContent || "";
                                return { ...l, text: e.currentTarget.textContent || "" };
                              });
                              return { ...m, lessons: nextLessons };
                            });
                            handleChange("modules", next);
                          }}
                        >
                          {typeof lesson === "string" ? lesson : lesson?.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] rounded-full" />

              <div className="mb-8">
                <img
                  src={instructorAvatar}
                  alt={instructorName}
                  className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white/10"
                />
                <h3
                  className="text-xl font-bold"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorName", e.currentTarget.textContent || "")}
                >
                  {instructorName}
                </h3>
                <p
                  className="text-red-400 text-sm mb-4"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorRole", e.currentTarget.textContent || "")}
                >
                  {instructorRole}
                </p>
                <p
                  className="text-sm text-gray-400"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorBio", e.currentTarget.textContent || "")}
                >
                  {instructorBio}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-gray-400">Total Price</span>
                  <div className="text-right">
                    <span
                      className="text-sm text-gray-500 line-through block"
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => handleChange("originalPrice", e.currentTarget.textContent || "")}
                    >
                      {originalPrice}
                    </span>
                    <span
                      className="text-3xl font-black text-white"
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                    >
                      {price}
                    </span>
                  </div>
                </div>

                {(highlights || []).map((t: any) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500" />
                    <span
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const next = (highlights || []).map((h: any) => {
                          if (h !== t) return h;
                          if (typeof h === "string") return e.currentTarget.textContent || "";
                          return { ...h, text: e.currentTarget.textContent || "" };
                        });
                        handleChange("highlights", next);
                      }}
                    >
                      {typeof t === "string" ? t : t?.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group"
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
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
