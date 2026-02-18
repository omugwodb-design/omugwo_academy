
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Instagram, 
  Twitter, 
  Facebook, 
  Phone,
  Baby,
  Stethoscope,
  Users,
  MessageCircle,
  Video,
  FileText,
  Mic,
  Search,
  Heart,
  ArrowRight,
  Settings,
  Save,
  Image as ImageIcon,
  Trash2,
  HelpCircle,
  Mail,
  MapPin,
  Plus,
  Clock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

// --- Icon Mapping for Dynamic Content ---
const IconMap: Record<string, any> = { 
  Baby, Heart, Users, Mic, Search, Stethoscope, Video, FileText, MessageCircle, HelpCircle, Mail, MapPin, Clock 
};

// --- Default Content Structure (The "Database") ---
const DEFAULT_CONTENT = {
  hero: {
    badge: "Omugwo Oasis",
    title: "Revolutionizing Postnatal Care for Sustainable Wellbeing",
    subtitle: "Omugwo Academy. Your premier destination for informed, supportive and deeply relatable postnatal guidance in Africa and beyond.",
    ctaPrimary: "Explore Our Journey",
    ctaSecondary: "Watch Video",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1920",
  },
  journey: {
    title: "Motherhood is a Journey and we're here to guide you through",
    cards: [
      { stage: "STAGE 01", title: "Labour & Delivery", desc: "Discover the wonders of childbirth and make informed decisions about your birth plan, pain management, and medical support.", icon: "Baby" },
      { stage: "STAGE 02", title: "Post-Delivery Care", desc: "Your comprehensive guide to a smooth and supportive transition to parenthood, focusing on recovery and emotional wellbeing.", icon: "Heart" },
      { stage: "STAGE 03", title: "Baby's First Year", desc: "Navigate the beautiful challenges of your baby's growth, from breastfeeding and sleep patterns to developmental milestones.", icon: "Users" }
    ]
  },
  founder: {
    badge: "THE VISIONARY",
    title: "A Personal Journey, A Global Mission",
    p1: "Dr. Megor Ikuenobe, a distinguished medical professional and early childhood development (ECD) specialist, is on a mission to provide every child in Africa with a promising start through comprehensive, data-driven interventions.",
    p2: "As the visionary founder of the Lead Oak Women and Children Foundation, Megor has been a relentless advocate for education, healthcare, and empowerment in rural communities.",
    quote: "Every child deserves a promising start.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  services: {
    title: "Expert Support for Every Stage",
    subtitle: "What We Offer",
    items: [
      { title: "Resources & Tools", desc: "Comprehensive workshops, specialized classes, and a deep library of online materials designed to help you navigate parenting challenges with ease.", icon: "Search" },
      { title: "Podcast Series", desc: "Expert advice and soulful stories for parents. Listen to weekly episodes featuring doctors, psychologists, and real moms sharing their truth.", icon: "Mic" },
      { title: "Vibrant Community", desc: "Join our 'Global Village'. A safe space to connect, share, and find support among peers who understand your journey precisely.", icon: "Users" }
    ]
  },
  faq: {
    title: "Commonly Asked Questions",
    items: [
      { q: "What is Omugwo?", a: "Omugwo is a time-honored Nigerian postnatal care practice deeply ingrained in tradition, focusing on holistic support for new mothers and infants." },
      { q: "How do I join the community?", a: "You can join by signing up for any of our courses or clicking the 'Join Academy' button to become part of our support network." },
      { q: "Is the content medically verified?", a: "Yes, all our resources are curated by Dr. Megor Ikuenobe and other seasoned medical professionals blending heritage with science." }
    ]
  },
  // --- New Individual Page Content ---
  coursesPage: {
    title: "Specialized Postnatal Courses",
    subtitle: "Evidence-based learning modules for the modern African parent.",
    items: [
      { title: "The 'Omugwo' Masterclass", desc: "Complete guide for new mothers covering recovery, nutrition, and baby care basics.", duration: "12 Hours", lessons: "24 Lessons", price: "$49", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800" },
      { title: "Partner Support Training", desc: "Essential knowledge for fathers and partners to provide meaningful support.", duration: "5 Hours", lessons: "10 Lessons", price: "$29", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800" },
      { title: "Neonatal Wellness", desc: "Focusing on the first 100 days of your baby's health and development.", duration: "8 Hours", lessons: "16 Lessons", price: "$39", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800" }
    ]
  },
  blogPage: {
    title: "The Omugwo Journal",
    subtitle: "Stories, tips, and insights from our community experts.",
    posts: [
      { title: "7 Myths About Postnatal Recovery", date: "Jan 24, 2025", category: "Education", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600" },
      { title: "Nutrition Guide for Breastfeeding Moms", date: "Jan 18, 2025", category: "Wellness", image: "https://images.unsplash.com/photo-1505576121720-9551e39fbbaf?auto=format&fit=crop&q=80&w=600" },
      { title: "The Power of the Village", date: "Jan 12, 2025", category: "Community", image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  podcastPage: {
    title: "Beyond Birth Podcast",
    subtitle: "Conversations that matter with Dr. Megor and guests.",
    episodes: [
      { title: "Ep. 01: The Fourth Trimester", guest: "Dr. Sarah Johnson", duration: "45 mins", image: "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?auto=format&fit=crop&q=80&w=600" },
      { title: "Ep. 02: Traditional Wisdom in 2025", guest: "Matron Amaka", duration: "38 mins", image: "https://images.unsplash.com/photo-1571235123956-6f81e6490333?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  aboutPage: {
    title: "Our Heritage, Your Future",
    subtitle: "We bridge the gap between tradition and modern care.",
    content: "Omugwo Academy was born from a realization that the transition to motherhood in modern Africa often lacks the support of the traditional 'village'. We leverage technology to rebuild that support system through evidence-based education.",
    stats: [
      { label: "Families Supported", value: "15k+" },
      { label: "Expert Lessons", value: "200+" },
      { label: "Global Reach", value: "12 countries" }
    ]
  },
  professionalsPage: {
    title: "Our Seasoned Professionals",
    subtitle: "The medical and wellness experts behind Omugwo Academy.",
    members: [
      { name: "Dr. Megor Ikuenobe", role: "Founder & Lead Educator", bio: "ECD Specialist with a focus on African maternal health.", image: "https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=300" },
      { name: "Nurse Tolani", role: "Postnatal Coordinator", bio: "Certified midwife with over 20 years of omugwo experience.", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300" },
      { name: "Dr. Kofi Mensah", role: "Pediatric Consultant", bio: "Neonatal care expert specializing in baby's first 100 days.", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" }
    ]
  },
  contactPage: {
    title: "We're Here for You",
    subtitle: "Reach out for support, inquiries, or collaboration.",
    address: "Omugwo Plaza, Victoria Island, Lagos, Nigeria",
    email: "support@omugwoacademy.com",
    phone: "+234 810 555 0123"
  },
  footer: {
    description: "Revolutionizing postnatal care for African families through a blend of heritage and science.",
    address: "Lagos, Nigeria",
    email: "hello@omugwoacademy.com",
    phone: "+234 800 000 0000"
  }
};

type ContentType = typeof DEFAULT_CONTENT;

// --- CMS Editable Components ---

const EditableText = ({ value, onChange, isEditing, className = "", multiline = false }: { 
  value: string; onChange: (val: string) => void; isEditing: boolean; className?: string; multiline?: boolean; 
}) => {
  if (!isEditing) return <span className={className}>{value}</span>;
  return multiline ? (
    <textarea 
      className={`w-full bg-purple-50/50 border border-purple-200 p-3 rounded-2xl focus:ring-2 ring-purple-300 outline-none resize-none transition-all ${className}`}
      value={value} onChange={(e) => onChange(e.target.value)} rows={4}
    />
  ) : (
    <input 
      className={`w-full bg-purple-50/50 border border-purple-200 px-3 py-1 rounded-xl focus:ring-2 ring-purple-300 outline-none transition-all ${className}`}
      value={value} onChange={(e) => onChange(e.target.value)}
    />
  );
};

const EditableImage = ({ src, onChange, isEditing, className = "", alt = "" }: { 
  src: string; onChange: (val: string) => void; isEditing: boolean; className?: string; alt?: string; 
}) => (
  <div className="relative group">
    <img src={src} className={className} alt={alt} />
    {isEditing && (
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-[inherit] z-20">
        <button 
          onClick={() => { const url = prompt("Enter Image URL:", src); if (url) onChange(url); }}
          className="bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-2xl scale-90 group-hover:scale-100 transition-transform"
        >
          <ImageIcon size={14} /> Change Image
        </button>
      </div>
    )}
  </div>
);

// --- Navigation & Mega Menu ---

const MegaMenu = ({ title, items, description, onNavigate }: { 
  title: string; items: { label: string; id: string; icon: any; desc: string }[]; description: string; onNavigate: (id: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-purple-600 transition-all">
        {title} <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[550px] bg-white shadow-[0_30px_80px_rgba(107,33,168,0.2)] rounded-[2.5rem] border border-purple-50 p-8 grid grid-cols-5 gap-8 animate-in fade-in slide-in-from-top-4 duration-300 z-50 overflow-hidden">
          <div className="col-span-2 bg-purple-600 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <Heart className="mb-4 opacity-50" size={32} />
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-[11px] text-purple-100 font-light">{description}</p>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            {items.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => { onNavigate(item.id); setIsOpen(false); }}
                className="group/item flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100 text-left"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                    {item.label} <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page View Components ---

const HomeView = ({ isEditing, content, update }: any) => (
  <>
    {/* HERO SECTION */}
    <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EditableImage isEditing={isEditing} src={content.hero.image} onChange={(v) => update('hero.image', v)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent"></div>
      </div>
      <div className="container mx-auto px-10 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-purple-600 rounded-full text-white font-black text-[10px] uppercase tracking-[0.2em] mb-10 shadow-xl shadow-purple-200">
            <Heart size={14} className="fill-white" /> 
            <EditableText isEditing={isEditing} value={content.hero.badge} onChange={(v) => update('hero.badge', v)} />
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-[1.05] mb-8 text-gray-900 tracking-tighter">
            <EditableText isEditing={isEditing} value={content.hero.title} onChange={(v) => update('hero.title', v)} multiline />
          </h1>
          <p className="text-gray-600 mb-12 text-xl leading-relaxed font-light max-w-lg">
            <EditableText isEditing={isEditing} value={content.hero.subtitle} onChange={(v) => update('hero.subtitle', v)} multiline />
          </p>
          <div className="flex flex-wrap gap-5">
            <button className="bg-purple-600 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all flex items-center gap-3 group">
              <EditableText isEditing={isEditing} value={content.hero.ctaPrimary} onChange={(v) => update('hero.ctaPrimary', v)} />
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="bg-white/80 backdrop-blur text-gray-900 px-10 py-5 rounded-full border border-gray-100 font-black text-sm uppercase tracking-widest hover:bg-white shadow-xl flex items-center gap-3">
              <Play size={20} className="text-purple-600 fill-purple-600" />
              <EditableText isEditing={isEditing} value={content.hero.ctaSecondary} onChange={(v) => update('hero.ctaSecondary', v)} />
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* JOURNEY SECTION */}
    <section className="py-32 px-10 bg-purple-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 max-w-4xl mx-auto leading-tight tracking-tight">
            <EditableText isEditing={isEditing} value={content.journey.title} onChange={(v) => update('journey.title', v)} />
          </h2>
          <div className="w-32 h-2.5 bg-purple-600 mx-auto rounded-full shadow-lg shadow-purple-100"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          {content.journey.cards.map((card, idx) => {
            const Icon = IconMap[card.icon] || Baby;
            return (
              <div key={idx} className="bg-white p-14 rounded-[4rem] shadow-2xl shadow-purple-100/30 border border-purple-50 flex flex-col items-center text-center group hover:-translate-y-4 transition-all duration-700">
                <div className="w-24 h-24 bg-purple-600 rounded-[2.5rem] flex items-center justify-center mb-10 text-white shadow-2xl shadow-purple-200 rotate-2 group-hover:rotate-12 transition-all duration-500">
                  <Icon size={44} />
                </div>
                <div className="text-purple-600 font-black text-[10px] tracking-[0.4em] mb-4">
                  <EditableText isEditing={isEditing} value={card.stage} onChange={(v) => { const c = [...content.journey.cards]; c[idx].stage = v; update('journey.cards', c); }} />
                </div>
                <h3 className="text-2xl font-black mb-6 text-gray-900">
                  <EditableText isEditing={isEditing} value={card.title} onChange={(v) => { const c = [...content.journey.cards]; c[idx].title = v; update('journey.cards', c); }} />
                </h3>
                <p className="text-gray-500 leading-relaxed text-base font-light mb-12">
                  <EditableText isEditing={isEditing} value={card.desc} onChange={(v) => { const c = [...content.journey.cards]; c[idx].desc = v; update('journey.cards', c); }} multiline />
                </p>
                <button className="mt-auto flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest group/btn">
                  READ MORE <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* FOUNDER SECTION */}
    <section className="py-40 px-10 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
        <div className="relative group">
          <div className="absolute -inset-10 bg-purple-100 rounded-[5rem] rotate-3 blur-3xl opacity-30"></div>
          <div className="relative aspect-[4/5] rounded-[5rem] overflow-hidden border-[16px] border-white shadow-3xl rotate-2 transition-transform duration-1000 group-hover:rotate-0">
            <EditableImage isEditing={isEditing} src={content.founder.image} onChange={(v) => update('founder.image', v)} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-600 rounded-[4rem] flex flex-col items-center justify-center p-12 text-white text-center shadow-3xl rotate-[-6deg] group-hover:rotate-[-2deg] transition-all">
            <Heart size={32} className="mb-4 opacity-40 fill-white" />
            <p className="text-lg font-bold leading-tight">
              <EditableText isEditing={isEditing} value={content.founder.quote} onChange={(v) => update('founder.quote', v)} multiline />
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <div>
            <span className="text-purple-600 font-black tracking-[0.4em] text-[10px] uppercase mb-8 block">
               <EditableText isEditing={isEditing} value={content.founder.badge} onChange={(v) => update('founder.badge', v)} />
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-10 text-gray-900 leading-[1.05] tracking-tighter">
              <EditableText isEditing={isEditing} value={content.founder.title} onChange={(v) => update('founder.title', v)} multiline />
            </h2>
            <div className="w-24 h-3 bg-purple-600 rounded-full"></div>
          </div>
          <div className="space-y-8 text-gray-500 leading-relaxed text-xl font-light">
            <p><EditableText isEditing={isEditing} value={content.founder.p1} onChange={(v) => update('founder.p1', v)} multiline /></p>
            <p className="border-l-8 border-purple-100 pl-10 italic py-4">
              <EditableText isEditing={isEditing} value={content.founder.p2} onChange={(v) => update('founder.p2', v)} multiline />
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* SERVICES SECTION */}
    <section className="py-32 px-10 bg-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-purple-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            <EditableText isEditing={isEditing} value={content.services.subtitle} onChange={(v) => update('services.subtitle', v)} />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">
            <EditableText isEditing={isEditing} value={content.services.title} onChange={(v) => update('services.title', v)} />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {content.services.items.map((s, idx) => {
            const Icon = IconMap[s.icon] || Search;
            return (
              <div key={idx} className="bg-white p-12 rounded-[4rem] shadow-xl shadow-purple-100 hover:shadow-2xl transition-all border border-purple-100 group">
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mb-8 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-6 text-gray-900">
                  <EditableText isEditing={isEditing} value={s.title} onChange={(v) => { const i = [...content.services.items]; i[idx].title = v; update('services.items', i); }} />
                </h3>
                <p className="text-gray-500 leading-relaxed font-light mb-10">
                  <EditableText isEditing={isEditing} value={s.desc} onChange={(v) => { const i = [...content.services.items]; i[idx].desc = v; update('services.items', i); }} multiline />
                </p>
                <button className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest group/btn">
                  EXPLORE <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-all" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <FAQSection isEditing={isEditing} content={content.faq} update={update} />
  </>
);

const CoursesView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20">
        <h1 className="text-5xl font-black mb-4 tracking-tight"><EditableText isEditing={isEditing} value={content.coursesPage.title} onChange={(v) => update('coursesPage.title', v)} /></h1>
        <p className="text-xl text-gray-500 font-light"><EditableText isEditing={isEditing} value={content.coursesPage.subtitle} onChange={(v) => update('coursesPage.subtitle', v)} /></p>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {content.coursesPage.items.map((course, idx) => (
          <div key={idx} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-100 border border-purple-50 group hover:-translate-y-2 transition-all">
            <EditableImage isEditing={isEditing} src={course.image} onChange={(v) => { const it = [...content.coursesPage.items]; it[idx].image = v; update('coursesPage.items', it); }} className="w-full h-56 object-cover" />
            <div className="p-10">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{course.duration}</span>
                <span className="text-purple-600 font-black text-lg">{course.price}</span>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">
                <EditableText isEditing={isEditing} value={course.title} onChange={(v) => { const it = [...content.coursesPage.items]; it[idx].title = v; update('coursesPage.items', it); }} />
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                <EditableText isEditing={isEditing} value={course.desc} onChange={(v) => { const it = [...content.coursesPage.items]; it[idx].desc = v; update('coursesPage.items', it); }} multiline />
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-purple-300 uppercase tracking-[0.2em] mb-8">
                <FileText size={14} /> {course.lessons}
              </div>
              <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-100 group-hover:bg-purple-700 transition-all">Enroll Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BlogView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight"><EditableText isEditing={isEditing} value={content.blogPage.title} onChange={(v) => update('blogPage.title', v)} /></h1>
        <p className="text-xl text-gray-500 font-light"><EditableText isEditing={isEditing} value={content.blogPage.subtitle} onChange={(v) => update('blogPage.subtitle', v)} /></p>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {content.blogPage.posts.map((post, idx) => (
          <div key={idx} className="cursor-pointer group">
            <div className="rounded-[3rem] overflow-hidden mb-8 aspect-[4/3] shadow-xl group-hover:shadow-2xl transition-all">
              <EditableImage isEditing={isEditing} src={post.image} onChange={(v) => { const ps = [...content.blogPage.posts]; ps[idx].image = v; update('blogPage.posts', ps); }} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
            <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest block mb-2">{post.category} • {post.date}</span>
            <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition-all">
              <EditableText isEditing={isEditing} value={post.title} onChange={(v) => { const ps = [...content.blogPage.posts]; ps[idx].title = v; update('blogPage.posts', ps); }} />
            </h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PodcastView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10 bg-purple-50/20">
    <div className="max-w-4xl mx-auto">
      <div className="mb-20 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight"><EditableText isEditing={isEditing} value={content.podcastPage.title} onChange={(v) => update('podcastPage.title', v)} /></h1>
        <p className="text-xl text-gray-500 font-light"><EditableText isEditing={isEditing} value={content.podcastPage.subtitle} onChange={(v) => update('podcastPage.subtitle', v)} /></p>
      </div>
      <div className="space-y-6">
        {content.podcastPage.episodes.map((ep, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-purple-50 flex items-center gap-8 group hover:border-purple-200 transition-all">
            <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-md">
              <EditableImage isEditing={isEditing} src={ep.image} onChange={(v) => { const eps = [...content.podcastPage.episodes]; eps[idx].image = v; update('podcastPage.episodes', eps); }} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-all">
                <EditableText isEditing={isEditing} value={ep.title} onChange={(v) => { const eps = [...content.podcastPage.episodes]; eps[idx].title = v; update('podcastPage.episodes', eps); }} />
              </h3>
              <p className="text-gray-400 text-sm font-medium">Guest: {ep.guest} • {ep.duration}</p>
            </div>
            <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
              <Play size={24} fill="white" className="ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-12">
        <h1 className="text-6xl font-black tracking-tight leading-tight"><EditableText isEditing={isEditing} value={content.aboutPage.title} onChange={(v) => update('aboutPage.title', v)} /></h1>
        <p className="text-2xl text-gray-500 font-light leading-relaxed">
          <EditableText isEditing={isEditing} value={content.aboutPage.content} onChange={(v) => update('aboutPage.content', v)} multiline />
        </p>
        <div className="grid grid-cols-3 gap-8 pt-8">
          {content.aboutPage.stats.map((stat, idx) => (
            <div key={idx}>
              <p className="text-4xl font-black text-purple-600 mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-10 bg-purple-100 rounded-[5rem] rotate-6 blur-3xl opacity-30"></div>
        <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200" className="relative w-full aspect-[4/5] object-cover rounded-[5rem] shadow-3xl rotate-2 transition-transform group-hover:rotate-0 duration-700" alt="About" />
      </div>
    </div>
  </section>
);

const ProfessionalsView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-black mb-6 tracking-tight"><EditableText isEditing={isEditing} value={content.professionalsPage.title} onChange={(v) => update('professionalsPage.title', v)} /></h1>
        <p className="text-xl text-gray-500 font-light"><EditableText isEditing={isEditing} value={content.professionalsPage.subtitle} onChange={(v) => update('professionalsPage.subtitle', v)} /></p>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {content.professionalsPage.members.map((member, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[4rem] shadow-2xl shadow-purple-100/50 text-center border border-purple-50 hover:-translate-y-2 transition-all duration-500">
            <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-10 border-4 border-purple-100 shadow-xl">
              <EditableImage isEditing={isEditing} src={member.image} onChange={(v) => { const ms = [...content.professionalsPage.members]; ms[idx].image = v; update('professionalsPage.members', ms); }} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-gray-900">
              <EditableText isEditing={isEditing} value={member.name} onChange={(v) => { const ms = [...content.professionalsPage.members]; ms[idx].name = v; update('professionalsPage.members', ms); }} />
            </h3>
            <p className="text-purple-600 font-black text-[10px] uppercase tracking-widest mb-6">
              <EditableText isEditing={isEditing} value={member.role} onChange={(v) => { const ms = [...content.professionalsPage.members]; ms[idx].role = v; update('professionalsPage.members', ms); }} />
            </p>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              <EditableText isEditing={isEditing} value={member.bio} onChange={(v) => { const ms = [...content.professionalsPage.members]; ms[idx].bio = v; update('professionalsPage.members', ms); }} multiline />
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactView = ({ isEditing, content, update }: any) => (
  <section className="py-24 px-10">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
      <div>
        <h1 className="text-6xl font-black mb-10 tracking-tight leading-tight"><EditableText isEditing={isEditing} value={content.contactPage.title} onChange={(v) => update('contactPage.title', v)} /></h1>
        <p className="text-2xl text-gray-500 font-light mb-16"><EditableText isEditing={isEditing} value={content.contactPage.subtitle} onChange={(v) => update('contactPage.subtitle', v)} /></p>
        
        <div className="space-y-10">
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
              <MapPin size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Our Location</p>
              <p className="text-xl font-bold text-gray-900"><EditableText isEditing={isEditing} value={content.contactPage.address} onChange={(v) => update('contactPage.address', v)} /></p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
              <Mail size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Email Us</p>
              <p className="text-xl font-bold text-gray-900"><EditableText isEditing={isEditing} value={content.contactPage.email} onChange={(v) => update('contactPage.email', v)} /></p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
              <Phone size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Call Support</p>
              <p className="text-xl font-bold text-gray-900"><EditableText isEditing={isEditing} value={content.contactPage.phone} onChange={(v) => update('contactPage.phone', v)} /></p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-purple-50 p-16 rounded-[4rem] shadow-3xl border border-white">
        <h3 className="text-3xl font-black mb-10 text-gray-900">Send a Message</h3>
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            <input type="text" placeholder="Full Name" className="w-full bg-white rounded-2xl px-8 py-5 text-sm outline-none focus:ring-2 ring-purple-300 transition-all border border-transparent focus:border-purple-100 shadow-sm" />
            <input type="email" placeholder="Email Address" className="w-full bg-white rounded-2xl px-8 py-5 text-sm outline-none focus:ring-2 ring-purple-300 transition-all border border-transparent focus:border-purple-100 shadow-sm" />
          </div>
          <input type="text" placeholder="Subject" className="w-full bg-white rounded-2xl px-8 py-5 text-sm outline-none focus:ring-2 ring-purple-300 transition-all border border-transparent focus:border-purple-100 shadow-sm" />
          <textarea placeholder="Your Message" rows={6} className="w-full bg-white rounded-[2rem] px-8 py-5 text-sm outline-none focus:ring-2 ring-purple-300 transition-all border border-transparent focus:border-purple-100 shadow-sm resize-none"></textarea>
          <button className="w-full bg-purple-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all">Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

const FAQSection = ({ isEditing, content, update }: { isEditing: boolean; content: ContentType['faq']; update: (p: string, v: any) => void }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="py-32 px-10 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            <EditableText isEditing={isEditing} value={content.title} onChange={(v) => update('faq.title', v)} />
          </h2>
          <div className="w-24 h-2 bg-purple-600 mx-auto rounded-full"></div>
        </div>
        <div className="space-y-4">
          {content.items.map((item, idx) => (
            <div key={idx} className="bg-purple-50/50 rounded-3xl border border-purple-100 overflow-hidden transition-all duration-300">
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full p-8 flex items-center justify-between text-left group">
                <span className="text-lg font-bold text-gray-800 pr-6">
                  <EditableText isEditing={isEditing} value={item.q} onChange={(v) => { const it = [...content.items]; it[idx].q = v; update('faq.items', it); }} />
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIdx === idx ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 border border-purple-100'}`}>
                  <ChevronDown className={`transition-transform duration-500 ${openIdx === idx ? 'rotate-180' : ''}`} size={20} />
                </div>
              </button>
              <div className={`px-8 overflow-hidden transition-all duration-500 ${openIdx === idx ? 'max-h-60 pb-8' : 'max-h-0'}`}>
                <p className="text-gray-500 leading-relaxed font-light text-lg">
                  <EditableText isEditing={isEditing} value={item.a} onChange={(v) => { const it = [...content.items]; it[idx].a = v; update('faq.items', it); }} multiline />
                </p>
                {isEditing && (
                  <button onClick={() => { const it = content.items.filter((_, i) => i !== idx); update('faq.items', it); }} className="mt-4 text-red-400 text-xs font-bold flex items-center gap-1">
                    <Trash2 size={12} /> Remove FAQ
                  </button>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
            <button onClick={() => update('faq.items', [...content.items, { q: "New Question", a: "New Answer" }])} className="w-full py-4 border-2 border-dashed border-purple-200 rounded-3xl text-purple-400 font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
              <Plus size={18} /> Add New FAQ
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// --- App Root ---

const App: React.FC = () => {
  const [content, setContent] = useState<ContentType>(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [activePage, setPage] = useState('home');

  useEffect(() => {
    const saved = localStorage.getItem('omugwo_cms_content_v3');
    if (saved) try { setContent(JSON.parse(saved)); } catch (e) { console.error(e); }
  }, []);

  const update = (path: string, val: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const keys = path.split('.');
    let curr = newContent;
    for (let i = 0; i < keys.length - 1; i++) curr = curr[keys[i]];
    curr[keys[keys.length - 1]] = val;
    setContent(newContent);
  };

  const save = () => { localStorage.setItem('omugwo_cms_content_v3', JSON.stringify(content)); setIsEditing(false); alert("Site Updated!"); };
  const reset = () => { if (confirm("Reset to default?")) { setContent(DEFAULT_CONTENT); localStorage.removeItem('omugwo_cms_content_v3'); setIsEditing(false); } };

  const renderView = () => {
    switch (activePage) {
      case 'home': return <HomeView isEditing={isEditing} content={content} update={update} />;
      case 'courses': return <CoursesView isEditing={isEditing} content={content} update={update} />;
      case 'blog': return <BlogView isEditing={isEditing} content={content} update={update} />;
      case 'podcast': return <PodcastView isEditing={isEditing} content={content} update={update} />;
      case 'about': return <AboutView isEditing={isEditing} content={content} update={update} />;
      case 'professionals': return <ProfessionalsView isEditing={isEditing} content={content} update={update} />;
      case 'contact': return <ContactView isEditing={isEditing} content={content} update={update} />;
      default: return <HomeView isEditing={isEditing} content={content} update={update} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-purple-50 px-8 h-24">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setPage('home')}>
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 transition-transform group-hover:scale-110">
              <span className="text-white font-black text-2xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-gray-900 leading-none">mugwo</span>
              <span className="text-purple-600 font-bold text-[10px] uppercase tracking-[0.2em]">Academy</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 h-full">
            <button onClick={() => setPage('home')} className={`text-sm font-bold transition-colors ${activePage === 'home' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>Home</button>
            
            <MegaMenu 
              onNavigate={setPage}
              title="Resources" 
              description="Everything you need for a supported transition into parenthood."
              items={[
                { label: 'Courses', id: 'courses', icon: FileText, desc: 'Guided paths from labour to baby’s first year.' },
                { label: 'Blog', id: 'blog', icon: MessageCircle, desc: 'Insights, myths, and facts on postnatal care.' },
                { label: 'Podcast', id: 'podcast', icon: Mic, desc: 'Real stories from experts and mothers.' }
              ]} 
            />
            
            <MegaMenu 
              onNavigate={setPage}
              title="Meet Us" 
              description="The experts blending traditional wisdom with modern science."
              items={[
                { label: 'About Us', id: 'about', icon: Heart, desc: 'Our mission to revolutionize African postnatal care.' },
                { label: 'Seasoned Professionals', id: 'professionals', icon: Users, desc: 'The elite team behind Omugwo Academy.' }
              ]} 
            />
            
            <button onClick={() => setPage('contact')} className={`text-sm font-bold transition-colors ${activePage === 'contact' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>Contact Us</button>
          </div>

          <button className="bg-purple-600 text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all">
            Join Academy
          </button>
        </div>
      </nav>
      
      <main className="pt-24 min-h-[70vh]">
        {renderView()}
        
        {/* GLOBAL FOOTER CALLOUT (Optional, but included for consistent UX) */}
        {activePage !== 'contact' && (
          <section id="global-cta" className="py-40 px-10 bg-purple-600 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="max-w-4xl mx-auto relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter">Ready to start your journey?</h2>
               <p className="text-xl text-purple-100 mb-12 font-light max-w-2xl mx-auto">Join thousands of families in Nigeria and beyond building a stronger future together.</p>
               <button onClick={() => setPage('contact')} className="bg-white text-purple-600 px-14 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">
                  Contact Us Today
               </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white pt-32 pb-16 px-10 border-t border-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-2xl">M</span>
                  </div>
                  <span className="font-black text-xl text-gray-900 leading-none">mugwo <span className="text-purple-600 block text-[10px] uppercase tracking-widest font-bold">Academy</span></span>
               </div>
               <p className="text-gray-500 leading-relaxed font-light">
                 <EditableText isEditing={isEditing} value={content.footer.description} onChange={(v) => update('footer.description', v)} multiline />
               </p>
               <div className="flex gap-4">
                  {[Instagram, Facebook, Twitter].map((I, i) => (
                    <div key={i} className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-sm"><I size={18} /></div>
                  ))}
               </div>
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-purple-300 mb-10">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><button onClick={() => setPage('about')} className="hover:text-purple-600 transition-colors">About Us</button></li>
                <li><button onClick={() => setPage('professionals')} className="hover:text-purple-600 transition-colors">Professionals</button></li>
                <li><button onClick={() => setPage('home')} className="hover:text-purple-600 transition-colors">Home</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-purple-300 mb-10">Resources</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><button onClick={() => setPage('courses')} className="hover:text-purple-600 transition-colors">Courses</button></li>
                <li><button onClick={() => setPage('podcast')} className="hover:text-purple-600 transition-colors">Podcast</button></li>
                <li><button onClick={() => setPage('blog')} className="hover:text-purple-600 transition-colors">Blog</button></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-purple-300 mb-10">Reach Out</h4>
              <div className="space-y-4 text-sm font-bold text-gray-700">
                <div className="flex items-center gap-3"><MapPin size={18} className="text-purple-300" /> <EditableText isEditing={isEditing} value={content.footer.address} onChange={(v) => update('footer.address', v)} /></div>
                <div className="flex items-center gap-3"><Mail size={18} className="text-purple-300" /> <EditableText isEditing={isEditing} value={content.footer.email} onChange={(v) => update('footer.email', v)} /></div>
                <div className="flex items-center gap-3"><Phone size={18} className="text-purple-300" /> <EditableText isEditing={isEditing} value={content.footer.phone} onChange={(v) => update('footer.phone', v)} /></div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-purple-50 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.3em] text-gray-400 gap-6 uppercase">
            <p>© 2025 Omugwo Academy. All Rights Reserved.</p>
            <p>Created by <span className="text-purple-300">SiteSliq</span> | Powered by <span className="text-purple-300">Sapphiite</span></p>
          </div>
        </div>
      </footer>

      {/* CMS CONTROL BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white/90 backdrop-blur-2xl border border-purple-100 shadow-3xl rounded-full px-10 py-5 flex items-center gap-10">
        <div className="flex items-center gap-3 pr-10 border-r border-purple-100">
          <Settings className={`text-purple-600 ${isEditing ? 'animate-spin' : ''}`} size={24} />
          <span className="text-[10px] font-black text-gray-900 tracking-[0.2em] uppercase">CMS Mode</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsEditing(!isEditing)} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-purple-100 text-purple-600' : 'bg-purple-600 text-white shadow-xl shadow-purple-200'}`}>
            {isEditing ? 'Exit' : 'Edit Page'}
          </button>
          {isEditing && (
            <>
              <button onClick={save} className="bg-green-500 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-600 flex items-center gap-2">
                <Save size={16} /> Save
              </button>
              <button onClick={reset} className="bg-red-50 text-red-500 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-100 flex items-center gap-2">
                <Trash2 size={16} /> Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
