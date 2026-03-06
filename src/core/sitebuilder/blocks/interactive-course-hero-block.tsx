import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { MousePointer2, Smartphone, MessagesSquare, Play, Download } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const interactiveCourseHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Highlight Word", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "priceSubtext", label: "Price Subtext", type: "text", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "heroImage", label: "Hero Image", type: "image", group: "Content" },
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Content" },
  { name: "instructorRole", label: "Instructor Role", type: "text", group: "Content" },
  { name: "stat1Label", label: "Stat 1 Label", type: "text", group: "Stats" },
  { name: "stat1Value", label: "Stat 1 Value", type: "text", group: "Stats" },
  { name: "stat2Label", label: "Stat 2 Label", type: "text", group: "Stats" },
  { name: "stat2Value", label: "Stat 2 Value", type: "text", group: "Stats" },
];

export const InteractiveCourseHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Your Modern Postpartum Playbook",
    titleHighlight = "Postpartum",
    subtitle = "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy the first year of motherhood with confidence.",
    ctaText = "Get Lifetime Access",
    price = "₦49,000",
    priceSubtext = "One-time payment",
    badgeText = "Enrolling Now for Next Cohort",
    heroImage = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    instructorName = "Dr. Megor",
    instructorRole = "Lead Instructor",
    stat1Label = "Format",
    stat1Value = "12 Hours Video",
    stat2Label = "Community",
    stat2Value = "8,432 Members",
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

  const renderTitle = () => {
    if (!titleHighlight) return title;
    const parts = title.split(new RegExp(`(${titleHighlight})`, "gi"));
    return parts.map((part, i) => {
      if (part.toLowerCase() === titleHighlight.toLowerCase()) {
        return (
          <span key={i} className="relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-20"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {part}
            </span>
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans text-slate-900 overflow-hidden relative">
      
      {/* Floating Blobs Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          <div className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Omugwo
          </div>
          <button className="px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm font-bold text-sm hover:shadow-md transition-shadow">
            Sign In
          </button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-center lg:text-left"
            >
              {badgeText && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                  <span 
                    className="text-sm font-bold text-indigo-900"
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("badgeText", e.currentTarget.textContent || "")}
                  >
                    {badgeText}
                  </span>
                </div>
              )}

              <h1 
                className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
              >
                {renderTitle()}
              </h1>

              <p 
                className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
              >
                {subtitle}
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
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
                  >
                    {ctaText}
                  </span>
                </button>
                <div className="flex items-center gap-4 text-left">
                  <div 
                    className="text-2xl font-black"
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                  >
                    {price}
                  </div>
                  <div 
                    className="text-sm text-slate-500 font-medium leading-tight"
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("priceSubtext", e.currentTarget.textContent || "")}
                  >
                    {priceSubtext}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Cards */}
            <div className="relative h-[600px] w-full hidden lg:block" style={{ perspective: '1000px' }}>
              <motion.div 
                animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Main Card */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white p-4 rounded-3xl shadow-2xl border border-slate-100"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <img 
                    src={heroImage} 
                    className="w-full aspect-[4/5] object-cover rounded-2xl mb-4" 
                    alt="Course" 
                  />
                  <div className="flex justify-between items-center px-2">
                    <div>
                      <p 
                        className="font-bold text-lg"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("instructorName", e.currentTarget.textContent || "")}
                      >
                        {instructorName}
                      </p>
                      <p 
                        className="text-sm text-slate-500"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("instructorRole", e.currentTarget.textContent || "")}
                      >
                        {instructorRole}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <MousePointer2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div 
                  className="absolute top-[15%] left-[10%] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl"><Smartphone className="w-5 h-5 text-purple-600" /></div>
                    <div>
                      <p 
                        className="text-xs text-slate-500 font-bold uppercase"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("stat1Label", e.currentTarget.textContent || "")}
                      >
                        {stat1Label}
                      </p>
                      <p 
                        className="font-bold"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("stat1Value", e.currentTarget.textContent || "")}
                      >
                        {stat1Value}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute bottom-[20%] -right-[5%] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl"><MessagesSquare className="w-5 h-5 text-indigo-600" /></div>
                    <div>
                      <p 
                        className="text-xs text-slate-500 font-bold uppercase"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("stat2Label", e.currentTarget.textContent || "")}
                      >
                        {stat2Label}
                      </p>
                      <p 
                        className="font-bold"
                        contentEditable={selected}
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("stat2Value", e.currentTarget.textContent || "")}
                      >
                        {stat2Value}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
