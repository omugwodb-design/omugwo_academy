import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Star, Clock, BookOpen, ChevronRight, Award, CheckCircle2 } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const cinematicCoursePageBlockSchema: PropSchema[] = [];

export const CinematicCoursePageBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
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
    badgeText: "Masterclass",
    ctaText: "Enroll Now",
    title: "The Postpartum Masterclass",
    subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
    description:
      "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
    videoBg: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600",
    price: "₦49,000",
    originalPrice: "₦129,000",
    stats: { rating: 4.9, students: "8,432", duration: "12 Hours", lessons: 48 },
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
    heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
  };

  const templateData = { ...fallback, ...(block.props || {}) };
  const data = COURSE_DATA || templateData;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 font-sans">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={data.videoBg} alt="Background" className="w-full h-full object-cover scale-105" />
        </motion.div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span
                className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20"
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("badgeText", e.currentTarget.textContent || "")}
              >
                {templateData.badgeText}
              </span>
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                <Star className="w-4 h-4 fill-current" /> {data.stats.rating} ({data.stats.students})
              </span>
            </div>
            <h1
              className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {data.title}
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
              contentEditable={selected && !COURSE_DATA}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {data.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white border-0 px-10 h-14 text-lg rounded-full shadow-[0_0_40px_rgba(220,38,38,0.3)] font-bold"
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
                  {templateData.ctaText}
                </span>
                {" — "}
                <span
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                >
                  {data.price}
                </span>
              </button>
              <button className="border border-white/20 hover:bg-white/5 text-white h-14 px-8 rounded-full backdrop-blur-md flex items-center gap-2 font-medium">
                <Play className="w-5 h-5" /> Watch Trailer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-around items-center gap-8">
          {[
            { icon: Clock, label: data.stats.duration, sub: "of video content" },
            { icon: BookOpen, label: `${data.stats.lessons} Lessons`, sub: "comprehensive guide" },
            { icon: Award, label: "Certificate", sub: "upon completion" },
            { icon: Star, label: "Lifetime Access", sub: "learn at your pace" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/50">
                <stat.icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-sm">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl md:text-5xl font-black mb-8">The Definitive Guide to Your Recovery</h2>
            <div className="prose prose-invert prose-lg text-gray-300">
              <p
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("description", e.currentTarget.textContent || "")}
              >
                {data.description}
              </p>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl md:text-5xl font-black mb-10">Curriculum</h2>
            <div className="space-y-6">
              {(data.modules || []).map((mod: any, i: number) => (
                <div key={mod.id} className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-red-500 text-sm font-bold tracking-wider uppercase mb-2 block">Module {i + 1}</span>
                      <h3 className="text-2xl font-bold">{String(mod.title).split(": ")[1] || mod.title}</h3>
                    </div>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mod.duration}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {(mod.lessons || []).map((lesson: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Play className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
                        {lesson}
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
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] rounded-full" />

              <div className="mb-8">
                <img src={data.instructor.avatar} alt={data.instructor.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white/10" />
                <h3
                  className="text-xl font-bold"
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorName", e.currentTarget.textContent || "")}
                >
                  {data.instructor.name}
                </h3>
                <p
                  className="text-red-400 text-sm mb-4"
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorRole", e.currentTarget.textContent || "")}
                >
                  {data.instructor.role}
                </p>
                <p
                  className="text-sm text-gray-400"
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("instructorBio", e.currentTarget.textContent || "")}
                >
                  {data.instructor.bio}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-gray-400">Total Price</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 line-through block">{data.originalPrice}</span>
                    <span className="text-3xl font-black text-white">{data.price}</span>
                  </div>
                </div>

                {["12 Hours on-demand video", "48 Lessons", "Lifetime access", "Certificate of completion", "30-day money-back guarantee"].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500" />
                    {t}
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
                  contentEditable={selected && !COURSE_DATA}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
                >
                  {templateData.ctaText}
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
