import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { CheckCircle2, PlayCircle, Clock, BookOpen, Star, Video, Monitor, Award, Calendar, Share2, Gift, ChevronDown, Check, Users } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useCartStore } from "../../../stores/cartStore";
import { toast } from 'react-hot-toast';

export const courseOverviewBlockSchema: PropSchema[] = [
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Modern (Tabbed)", value: "tabs" },
      { label: "Classic (Stacked)", value: "stacked" },
    ], group: "Layout"
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "description", label: "Description", type: "textarea", group: "Content" },
  
  // What you'll learn
  {
    name: "learningObjectives", label: "What You'll Learn", type: "array", arrayItemSchema: [
      { name: "text", label: "Objective", type: "text" }
    ], group: "Content"
  },

  // Requirements & Audience
  {
    name: "requirements", label: "Requirements", type: "array", arrayItemSchema: [
      { name: "text", label: "Requirement", type: "text" }
    ], group: "Content"
  },
  {
    name: "audience", label: "Target Audience", type: "array", arrayItemSchema: [
      { name: "text", label: "Audience", type: "text" }
    ], group: "Content"
  },

  // Curriculum
  { name: "useLiveCurriculum", label: "Use Live Curriculum Data", type: "boolean", group: "Curriculum" },
  {
    name: "modules", label: "Curriculum Modules", type: "array", arrayItemSchema: [
      { name: "title", label: "Module Title", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "lessons", label: "Lessons (comma separated)", type: "textarea" },
    ], group: "Curriculum"
  },

  // Sidebar details
  { name: "videoUrl", label: "Preview Video URL", type: "text", group: "Sidebar" },
  { name: "imageUrl", label: "Preview Image URL", type: "image", group: "Sidebar" },
  { name: "price", label: "Price", type: "text", group: "Sidebar" },
  { name: "originalPrice", label: "Original Price", type: "text", group: "Sidebar" },
  { name: "discountBadge", label: "Discount Badge", type: "text", group: "Sidebar" },
  { name: "ctaText", label: "Primary CTA Text", type: "text", group: "Sidebar" },
  { name: "secondaryCtaText", label: "Secondary CTA Text", type: "text", group: "Sidebar" },
  
  // Includes list
  {
    name: "includes", label: "Course Includes", type: "array", arrayItemSchema: [
      { name: "icon", label: "Icon (video, book, award, clock)", type: "text" },
      { name: "text", label: "Text", type: "text" }
    ], group: "Sidebar"
  },

  // Instructor
  { name: "instructorName", label: "Instructor Name", type: "text", group: "Instructor" },
  { name: "instructorTitle", label: "Instructor Title", type: "text", group: "Instructor" },
  { name: "instructorImage", label: "Instructor Image", type: "image", group: "Instructor" },
  { name: "instructorBio", label: "Instructor Bio", type: "textarea", group: "Instructor" },

  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CourseOverviewBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openModules, setOpenModules] = useState<number[]>([0]);
  const [liveModules, setLiveModules] = useState<any[] | null>(null);

  const navigate = useNavigate();
  const addCourse = useCartStore((s) => s.addCourse);

  const { courseId } = useParams<{ courseId?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const builderCourseId = searchParams.get('courseId');
  const actualCourseId = courseId || builderCourseId;

  const handleEnrollNow = () => {
    if (selected) return;
    if (!actualCourseId) {
      toast.error('Course not found');
      return;
    }
    addCourse(actualCourseId);
    navigate(`/checkout/${actualCourseId}`);
  };

  const handleAddToCart = () => {
    if (selected) return;
    if (!actualCourseId) {
      toast.error('Course not found');
      return;
    }
    addCourse(actualCourseId);
    toast.success('Added to cart');
    navigate('/cart');
  };

  const {
    variant = "tabs",
    title = "Course Description",
    description = "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science. We believe that every mother deserves a 'village' of support, and this course is your digital village.",
    learningObjectives = [
      { text: "Postnatal physical recovery" },
      { text: "Nutritional needs for breastfeeding" },
      { text: "Newborn sleep patterns" },
      { text: "Emotional wellbeing and baby blues" }
    ],
    requirements = [
      { text: "Basic understanding of pregnancy" },
      { text: "Access to a quiet space for learning" },
      { text: "A notebook for taking notes" }
    ],
    audience = [
      { text: "First-time mothers" },
      { text: "Expectant parents" },
      { text: "Caregivers and nannies" }
    ],
    useLiveCurriculum = false,
    modules = [
      { title: "Introduction to Omugwo", duration: "45 MINS", lessons: "Welcome to the Course, What is Omugwo?, Setting Expectations" },
      { title: "Physical Healing Post-Birth", duration: "1.5 HOURS", lessons: "Understanding Your Body, Nutrition for Recovery, Safe Exercises" },
      { title: "Mental & Emotional Wellbeing", duration: "2 HOURS", lessons: "Baby Blues vs PPD, Partner Support, Building a Village" }
    ],
    videoUrl = "",
    imageUrl = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
    price = "$49",
    originalPrice = "$129",
    discountBadge = "62% OFF",
    ctaText = "ENROLL NOW",
    secondaryCtaText = "ADD TO CART",
    includes = [
      { icon: "video", text: "12 Hours on-demand video" },
      { icon: "book", text: "24 Lessons downloadable resources" },
      { icon: "clock", text: "Full lifetime access" },
      { icon: "award", text: "Certificate of completion" }
    ],
    instructorName = "Dr. Megor Ikuenobe",
    instructorTitle = "ECD Specialist & Founder",
    instructorImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    instructorBio = "Dr. Megor is a distinguished medical professional and early childhood development specialist on a mission to provide every child in Africa with a promising start.",
    backgroundColor,
    paddingY = "py-16",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  useEffect(() => {
    if (useLiveCurriculum && actualCourseId) {
      const fetchCurriculum = async () => {
        try {
          const { data, error } = await supabase
            .from('modules')
            .select(`
              title,
              lessons ( title, duration_minutes, type, order_index )
            `)
            .eq('course_id', actualCourseId)
            .order('order_index', { ascending: true });

          if (error) throw error;
          
          if (data && data.length > 0) {
            const formatted = data.map((mod: any) => {
              const sortedLessons = [...(mod.lessons || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
              const lessonsStr = sortedLessons
                .map((l: any) => `${l.title}|${l.duration_minutes ? l.duration_minutes + 'm' : ''}|${l.type}`)
                .join(',');
              
              const totalMins = sortedLessons.reduce((sum: number, l: any) => sum + (l.duration_minutes || 0), 0);
              const durationStr = totalMins > 0 ? (totalMins >= 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`) : '';
              
              return {
                title: mod.title,
                duration: durationStr,
                lessons: lessonsStr
              };
            });
            setLiveModules(formatted);
          } else {
            setLiveModules([]);
          }
        } catch (err) {
          console.error("Failed to fetch live curriculum:", err);
        }
      };
      
      fetchCurriculum();
    } else {
      setLiveModules(null);
    }
  }, [useLiveCurriculum, actualCourseId]);

  const displayModules = liveModules !== null ? liveModules : modules;

  const toggleModule = (idx: number) => {
    if (openModules.includes(idx)) {
      setOpenModules(openModules.filter(i => i !== idx));
    } else {
      setOpenModules([...openModules, idx]);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'video': return <Video className="w-5 h-5 text-gray-400" />;
      case 'book': return <BookOpen className="w-5 h-5 text-gray-400" />;
      case 'clock': return <Clock className="w-5 h-5 text-gray-400" />;
      case 'award': return <Award className="w-5 h-5 text-gray-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderTabs = () => (
    <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
      {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
            activeTab === tab ? "border-primary-600 text-primary-900" : "border-transparent text-gray-500 hover:text-gray-900"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* What you'll learn */}
      <div className="bg-[#faf5ff] rounded-[2rem] p-8 md:p-10 border border-primary-100">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">What you'll learn</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
          {learningObjectives.map((obj: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <span 
                className="text-gray-700 leading-relaxed outline-none"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newArr = [...learningObjectives];
                  newArr[idx] = { text: e.currentTarget.textContent || "" };
                  handleChange("learningObjectives", newArr);
                }}
              >
                {obj.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 
          className="text-2xl font-bold text-gray-900 mb-6 outline-none"
          contentEditable={selected}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
        >
          {title}
        </h3>
        <div 
          className="prose prose-lg text-gray-600 max-w-none outline-none whitespace-pre-wrap"
          contentEditable={selected}
          suppressContentEditableWarning
          onBlur={(e) => handleChange("description", e.currentTarget.innerText || "")}
        >
          {description}
        </div>
      </div>

      {/* Requirements & Target Audience */}
      <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Requirements</h4>
          </div>
          <ul className="space-y-3">
            {requirements.map((req: any, idx: number) => (
              <li key={idx} className="flex items-center gap-3 text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <span 
                  className="outline-none"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newArr = [...requirements];
                    newArr[idx] = { text: e.currentTarget.textContent || "" };
                    handleChange("requirements", newArr);
                  }}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Target Audience</h4>
          </div>
          <ul className="space-y-3">
            {audience.map((aud: any, idx: number) => (
              <li key={idx} className="flex items-center gap-3 text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <span 
                  className="outline-none"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newArr = [...audience];
                    newArr[idx] = { text: e.currentTarget.textContent || "" };
                    handleChange("audience", newArr);
                  }}
                >
                  {aud.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h3>
      <div className="space-y-4">
        {displayModules.map((mod: any, idx: number) => {
          const isOpen = openModules.includes(idx);
          const lessonList = mod.lessons.split(',').map((l: string) => l.trim());
          
          return (
            <div key={idx} className={cn("bg-white rounded-2xl border transition-colors", isOpen ? "border-primary-200 shadow-sm" : "border-gray-200")}>
              <button
                onClick={() => !selected && toggleModule(idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span 
                    className="font-bold text-gray-900 text-lg outline-none"
                    contentEditable={selected && !useLiveCurriculum}
                    suppressContentEditableWarning
                    onClick={(e) => selected && !useLiveCurriculum && e.stopPropagation()}
                    onBlur={(e) => {
                      if (useLiveCurriculum) return;
                      const newArr = [...modules];
                      newArr[idx] = { ...newArr[idx], title: e.currentTarget.textContent || "" };
                      handleChange("modules", newArr);
                    }}
                  >
                    {mod.title}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span 
                    className="text-sm font-bold text-gray-400 uppercase tracking-wider hidden md:block outline-none"
                    contentEditable={selected && !useLiveCurriculum}
                    suppressContentEditableWarning
                    onClick={(e) => selected && !useLiveCurriculum && e.stopPropagation()}
                    onBlur={(e) => {
                      if (useLiveCurriculum) return;
                      const newArr = [...modules];
                      newArr[idx] = { ...newArr[idx], duration: e.currentTarget.textContent || "" };
                      handleChange("modules", newArr);
                    }}
                  >
                    {mod.duration}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 mt-2">
                      <ul className="space-y-4 mt-4">
                        {lessonList.map((lesson: string, i: number) => {
                          const [title, duration, type] = lesson.split('|');
                          return (
                            <li key={i} className="flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-primary-600 transition-colors" />
                                <span 
                                  className="text-gray-600 group-hover:text-gray-900 transition-colors outline-none"
                                  contentEditable={selected && !useLiveCurriculum}
                                  suppressContentEditableWarning
                                  onBlur={(e) => {
                                    if (useLiveCurriculum) return;
                                    const newText = e.currentTarget.textContent || "";
                                    const newLessonList = [...lessonList];
                                    newLessonList[i] = `${newText}|${duration || ''}|${type || ''}`;
                                    
                                    const newArr = [...modules];
                                    newArr[idx] = { ...newArr[idx], lessons: newLessonList.join(',') };
                                    handleChange("modules", newArr);
                                  }}
                                >
                                  {title || lesson}
                                </span>
                              </div>
                              <span 
                                className="text-sm text-gray-400 outline-none"
                                contentEditable={selected && !useLiveCurriculum}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  if (useLiveCurriculum) return;
                                  const newDuration = e.currentTarget.textContent || "";
                                  const newLessonList = [...lessonList];
                                  newLessonList[i] = `${title || lesson}|${newDuration}|${type || ''}`;
                                  
                                  const newArr = [...modules];
                                  newArr[idx] = { ...newArr[idx], lessons: newLessonList.join(',') };
                                  handleChange("modules", newArr);
                                }}
                              >
                                {duration || "Preview"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInstructor = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Meet your instructor</h3>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img src={instructorImage} alt={instructorName} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white" />
        <div>
          <h4 
            className="text-2xl font-bold text-gray-900 mb-2 outline-none"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("instructorName", e.currentTarget.textContent || "")}
          >
            {instructorName}
          </h4>
          <p 
            className="text-primary-600 font-bold mb-6 uppercase tracking-wider text-sm outline-none"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("instructorTitle", e.currentTarget.textContent || "")}
          >
            {instructorTitle}
          </p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">4.9</span> Instructor Rating
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="font-bold text-gray-900">15,243</span> Students
            </div>
          </div>
          <p 
            className="text-gray-600 leading-relaxed max-w-2xl outline-none whitespace-pre-wrap"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("instructorBio", e.currentTarget.innerText || "")}
          >
            {instructorBio}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className={cn(paddingY, "px-4 md:px-8", backgroundColor ? "" : "bg-white")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative", containerSize)}>
        
        {/* Left Column - Main Content */}
        <div className="w-full lg:w-[65%]">
          {variant === "tabs" ? (
            <>
              {renderTabs()}
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'curriculum' && renderCurriculum()}
              {activeTab === 'instructor' && renderInstructor()}
              {activeTab === 'reviews' && (
                <div className="text-center py-12 text-gray-500 animate-in fade-in">
                  Reviews section goes here
                </div>
              )}
            </>
          ) : (
            <div className="space-y-16">
              {renderOverview()}
              <hr className="border-gray-100" />
              {renderCurriculum()}
              <hr className="border-gray-100" />
              {renderInstructor()}
            </div>
          )}
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="w-full lg:w-[35%] lg:sticky lg:top-24 mt-8 lg:mt-0">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
            {/* Video/Image Header */}
            <div className="relative aspect-video bg-gray-900 group">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-end gap-4 mb-6">
                <span 
                  className="text-4xl font-black text-gray-900 outline-none"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("price", e.currentTarget.textContent || "")}
                >
                  {price}
                </span>
                <span 
                  className="text-xl text-gray-400 line-through mb-1 outline-none"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("originalPrice", e.currentTarget.textContent || "")}
                >
                  {originalPrice}
                </span>
                <span 
                  className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md mb-2 outline-none"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("discountBadge", e.currentTarget.textContent || "")}
                >
                  {discountBadge}
                </span>
              </div>
              
              <div className="space-y-3 mb-8">
                <button onClick={handleEnrollNow} className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
                  <span 
                    className="outline-none"
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
                  >
                    {ctaText}
                  </span>
                </button>
                {secondaryCtaText && (
                  <button onClick={handleAddToCart} className="w-full bg-white text-primary-600 border-2 border-primary-100 font-bold py-4 rounded-xl hover:bg-primary-50 transition-colors">
                    <span 
                      className="outline-none"
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => handleChange("secondaryCtaText", e.currentTarget.textContent || "")}
                    >
                      {secondaryCtaText}
                    </span>
                  </button>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-bold text-gray-900">This course includes:</p>
                {includes.map((inc: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-600">
                    {getIcon(inc.icon)}
                    <span 
                      className="text-sm font-medium outline-none"
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newArr = [...includes];
                        newArr[idx] = { ...newArr[idx], text: e.currentTarget.textContent || "" };
                        handleChange("includes", newArr);
                      }}
                    >
                      {inc.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                  <Gift className="w-4 h-4" /> Gift this course
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
