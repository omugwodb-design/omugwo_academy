import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Star, Clock, BookOpen, Award } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";

export const cinematicCourseHeroBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "ctaText", label: "CTA Button Text", type: "text", group: "Content" },
  { name: "price", label: "Price", type: "text", group: "Content" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Content" },
  { name: "rating", label: "Rating", type: "text", group: "Stats" },
  { name: "students", label: "Students Count", type: "text", group: "Stats" },
  { name: "duration", label: "Duration", type: "text", group: "Stats" },
  { name: "lessons", label: "Number of Lessons", type: "text", group: "Stats" },
];

export const CinematicCourseHeroBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "The Postpartum Masterclass",
    subtitle = "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
    badgeText = "Masterclass",
    ctaText = "Enroll Now",
    price = "₦49,000",
    backgroundImage = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600",
    rating = "4.9",
    students = "8,432",
    duration = "12 Hours",
    lessons = "48",
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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 font-sans">
      {/* Cinematic Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover scale-105" />
        </motion.div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span 
                className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("badgeText", e.currentTarget.textContent || "")}
              >
                {badgeText}
              </span>
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                <Star className="w-4 h-4 fill-current" /> {rating} ({students})
              </span>
            </div>
            <h1 
              className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {title}
            </h1>
            <p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white border-0 px-10 h-14 text-lg rounded-full shadow-[0_0_40px_rgba(220,38,38,0.3)] font-bold transition-colors"
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
                {" — "}
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                >
                  {price}
                </span>
              </button>
              <button className="border border-white/20 hover:bg-white/5 text-white h-14 px-8 rounded-full backdrop-blur-md flex items-center gap-2 font-medium transition-colors">
                <Play className="w-5 h-5" /> Watch Trailer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-around items-center gap-8">
          {[
            { icon: Clock, label: duration, sub: 'of video content' },
            { icon: BookOpen, label: `${lessons} Lessons`, sub: 'comprehensive guide' },
            { icon: Award, label: 'Certificate', sub: 'upon completion' },
            { icon: Star, label: 'Lifetime Access', sub: 'learn at your pace' },
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
    </div>
  );
};
