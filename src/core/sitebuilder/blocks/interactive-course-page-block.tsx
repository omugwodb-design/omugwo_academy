import React from "react";
import { motion } from "framer-motion";
import { MousePointer2, Smartphone, Download, MessagesSquare, Play } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const interactiveCoursePageBlockSchema: PropSchema[] = [];

export const InteractiveCoursePageBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
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

  // Fallback content (used in template preview if props not provided)
  const fallback = {
    ctaText: "Get Lifetime Access",
    subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
    price: "₦49,000",
    heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
    stats: { duration: "12 Hours", students: "8,432" },
    modules: [
      { id: "m1", title: "Module 1: Body Recovery", duration: "2h 15m", lessons: ["Introduction to Postpartum Recovery", "Understanding Your Body's Changes", "Safe Exercise Guidelines", "Nutrition for Recovery"] },
      { id: "m2", title: "Module 2: Mental Health", duration: "1h 45m", lessons: ["Recognizing Baby Blues vs PPD", "Building Your Support System", "Self-Care Strategies"] },
      { id: "m3", title: "Module 3: Cultural Balance", duration: "1h 30m", lessons: ["Understanding Expectations", "Setting Healthy Boundaries"] },
      { id: "m4", title: "Module 4: Infant Care", duration: "2h 00m", lessons: ["Feeding Basics", "Understanding Baby Sleep", "Newborn Care Essentials"] },
    ],
  };

  const templateData = { ...fallback, ...(block.props || {}) };
  const data = COURSE_DATA || templateData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans text-slate-900 overflow-hidden">
      {/* Floating Blobs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-200/40 mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-200/40 mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -100, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-pink-200/40 mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Omugwo</div>
          <button className="px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm font-bold text-sm hover:shadow-md transition-shadow">Sign In</button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-bold text-indigo-900">Enrolling Now for Next Cohort</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                Your Modern <br />
                <span className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-20"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Postpartum</span>
                </span>{" "}
                <br />
                Playbook
              </h1>

              <p
                className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium"
                contentEditable={selected && !COURSE_DATA}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
              >
                {data.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
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
                </button>
                <div className="flex items-center gap-4 text-left">
                  <div
                    className="text-2xl font-black"
                    contentEditable={selected && !COURSE_DATA}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                  >
                    {data.price}
                  </div>
                  <div className="text-sm text-slate-500 font-medium leading-tight">One-time <br /> payment</div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Cards */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
              <motion.div animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 preserve-3d">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 transform translate-z-10">
                  <img src={data.heroImage} className="w-full aspect-[4/5] object-cover rounded-2xl mb-4" alt="Course" />
                  <div className="flex justify-between items-center px-2">
                    <div>
                      <p className="font-bold text-lg">Dr. Megor</p>
                      <p className="text-sm text-slate-500">Lead Instructor</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <MousePointer2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-[15%] left-[10%] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white transform translate-z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Format</p>
                      <p className="font-bold">{data.stats.duration} Video</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[20%] -right-[5%] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white transform translate-z-30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <MessagesSquare className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Community</p>
                      <p className="font-bold">{data.stats.students} Members</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="bg-white/60 backdrop-blur-xl border-y border-white">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything You Need.</h2>
              <p className="text-lg text-slate-500 font-medium">Delivered in an interactive, bite-sized format.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Video Lessons", icon: Play, desc: "Cinematic quality tutorials" },
                { title: "Audio Options", icon: Smartphone, desc: "Listen on the go" },
                { title: "Workbooks", icon: Download, desc: "Interactive PDF guides" },
                { title: "Community", icon: MessagesSquare, desc: "24/7 peer support" },
              ].map((feat, i) => (
                <motion.div whileHover={{ y: -10 }} key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <feat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                  <p className="text-slate-500 font-medium">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Box Curriculum */}
        <div className="max-w-7xl mx-auto px-6 py-32">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">Course Modules</h2>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
            {(data.modules || []).map((mod: any, i: number) => (
              <motion.div
                whileHover={{ scale: 0.98 }}
                key={mod.id}
                className={`p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group cursor-pointer ${
                  i === 0 ? "md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-white text-slate-900"
                }`}
              >
                <div
                  className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700 ${
                    i === 0 ? "text-white" : "text-indigo-600"
                  }`}
                >
                  <div className="text-9xl font-black">{i + 1}</div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mt-auto">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                        i === 0 ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {mod.duration}
                    </span>
                    <h3 className={`text-2xl font-black mb-4 ${i === 0 ? "md:text-4xl" : ""}`}>{String(mod.title).split(": ")[1] || mod.title}</h3>

                    {i === 0 && (
                      <ul className="space-y-2 mt-6">
                        {(mod.lessons || []).map((lesson: string, j: number) => (
                          <li key={j} className="flex items-center gap-2 font-medium text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
