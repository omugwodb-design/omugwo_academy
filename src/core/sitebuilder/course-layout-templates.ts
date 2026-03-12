import { Template } from "./types";

const id = () => Math.random().toString(36).substr(2, 9);

// Shared course data for all templates
const COURSE_DATA = {
  title: "The Postpartum Masterclass",
  subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
  description: "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science.",
  instructor: {
    name: "Dr. Megor Ikuenobe",
    role: "Founder & Maternal Health Expert",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    bio: "Dr. Megor is a distinguished medical professional and early childhood development specialist."
  },
  stats: {
    students: "8,432",
    rating: 4.9,
    duration: "12 Hours",
    lessons: 48
  },
  modules: [
    { id: "m1", title: "Module 1: Body Recovery", duration: "2h 15m", lessons: ["Introduction to Postpartum Recovery", "Understanding Your Body's Changes", "Safe Exercise Guidelines", "Nutrition for Recovery"] },
    { id: "m2", title: "Module 2: Mental Health", duration: "1h 45m", lessons: ["Recognizing Baby Blues vs PPD", "Building Your Support System", "Self-Care Strategies"] },
    { id: "m3", title: "Module 3: Cultural Balance", duration: "1h 30m", lessons: ["Understanding Expectations", "Setting Healthy Boundaries"] },
    { id: "m4", title: "Module 4: Infant Care", duration: "2h 00m", lessons: ["Feeding Basics", "Understanding Baby Sleep", "Newborn Care Essentials"] }
  ],
  price: "₦49,000",
  originalPrice: "₦129,000",
  heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
  videoBg: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600"
};

export const COURSE_LAYOUT_TEMPLATES: Template[] = [
  // 1. INTERACTIVE LAYOUT - Modern with floating blobs and 3D cards (EXACT REPLICA)
  {
    id: "course-interactive-layout",
    name: "Interactive Course Layout",
    description: "Modern interactive design with floating animated blobs, 3D perspective cards, and glassmorphism effects - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400", // Interactive modern tech style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["interactive", "modern", "3d", "glassmorphism", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "interactive_course_hero",
        label: "Interactive Course Hero",
        props: {
          title: "Your Modern Postpartum Playbook",
          titleHighlight: "Postpartum",
          subtitle: COURSE_DATA.subtitle,
          ctaText: "Get Lifetime Access",
          price: COURSE_DATA.price,
          priceSubtext: "One-time payment",
          badgeText: "Enrolling Now for Next Cohort",
          heroImage: COURSE_DATA.heroImage,
          instructorName: COURSE_DATA.instructor.name,
          instructorRole: "Lead Instructor",
          stat1Label: "Format",
          stat1Value: `${COURSE_DATA.stats.duration} Video`,
          stat2Label: "Community",
          stat2Value: `${COURSE_DATA.stats.students} Members`,
        }
      },
      {
        id: id(),
        type: "interactive_course_features",
        label: "Interactive Features",
        props: {
          featuresTitle: "Everything You Need.",
          featuresSubtitle: "Delivered in an interactive, bite-sized format.",
          features: [
            { title: "Video Lessons", icon: "play", desc: "Cinematic quality tutorials" },
            { title: "Audio Options", icon: "smartphone", desc: "Listen on the go" },
            { title: "Workbooks", icon: "download", desc: "Interactive PDF guides" },
            { title: "Community", icon: "community", desc: "24/7 peer support" },
          ],
        },
      },
      {
        id: id(),
        type: "interactive_course_modules",
        label: "Interactive Modules",
        props: {
          modulesTitle: "Course Modules",
          modules: COURSE_DATA.modules.map((m) => ({
            id: m.id,
            title: m.title,
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ text: t })),
          })),
        },
      }
    ]
  },

  // 2. CINEMATIC LAYOUT - Dark Netflix-style with parallax (EXACT REPLICA)
  {
    id: "course-cinematic-layout",
    name: "Cinematic Course Layout",
    description: "Dark, cinematic Netflix-style design with parallax hero, sticky stats bar, and dramatic visuals - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1478720568567-971210a2a5b2?auto=format&fit=crop&q=80&w=400", // Cinematic dark style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["cinematic", "dark", "netflix", "parallax", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "cinematic_course_hero",
        label: "Cinematic Course Hero",
        props: {
          title: COURSE_DATA.title,
          subtitle: COURSE_DATA.subtitle,
          badgeText: "Masterclass",
          ctaText: "Enroll Now",
          price: COURSE_DATA.price,
          backgroundImage: COURSE_DATA.videoBg,
          rating: String(COURSE_DATA.stats.rating),
          students: String(COURSE_DATA.stats.students),
          duration: String(COURSE_DATA.stats.duration),
          lessons: String(COURSE_DATA.stats.lessons),
        }
      },
      {
        id: id(),
        type: "cinematic_course_body",
        label: "Cinematic Body",
        props: {
          overviewTitle: "The Definitive Guide to Your Recovery",
          description: COURSE_DATA.description,
          curriculumTitle: "Curriculum",
          modules: COURSE_DATA.modules.map((m) => ({
            id: m.id,
            title: m.title,
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ text: t })),
          })),
          instructorName: COURSE_DATA.instructor.name,
          instructorRole: COURSE_DATA.instructor.role,
          instructorAvatar: COURSE_DATA.instructor.avatar,
          instructorBio: COURSE_DATA.instructor.bio,
          price: COURSE_DATA.price,
          originalPrice: COURSE_DATA.originalPrice,
          highlights: [
            { text: `${COURSE_DATA.stats.duration} on-demand video` },
            { text: `${COURSE_DATA.stats.lessons} Lessons` },
            { text: "Lifetime access" },
            { text: "Certificate of completion" },
            { text: "30-day money-back guarantee" },
          ],
          ctaText: "Enroll Now",
        }
      }
    ]
  },

  // 3. MINIMALIST LAYOUT - Editorial black & white (EXACT REPLICA)
  {
    id: "course-minimalist-layout",
    name: "Minimalist Course Layout",
    description: "Clean editorial design with serif typography, grayscale imagery, and refined spacing - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&sat=-100", // Minimalist grayscale
    category: "course_sales",
    pageType: "course_sales",
    tags: ["minimalist", "editorial", "serif", "clean", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "minimalist_course_hero",
        label: "Minimalist Course Hero",
        props: {
          tagline: "A Modern Guide to Postpartum",
          titleLine1: "Reclaim",
          titleLine2: "Your Body.",
          titleLine3: "Restore",
          titleLine4: "Your Mind.",
          ctaText: "Start the Journey",
          price: COURSE_DATA.price,
          heroImage: COURSE_DATA.heroImage,
          brandName: "Omugwo.",
        }
      },
      {
        id: id(),
        type: "minimalist_course_philosophy",
        label: "Minimalist Philosophy",
        props: {
          quote: COURSE_DATA.description,
        },
      },
      {
        id: id(),
        type: "minimalist_course_curriculum",
        label: "Minimalist Curriculum",
        props: {
          eyebrow: "The Syllabus",
          summary: `${COURSE_DATA.stats.lessons} carefully curated lessons over ${COURSE_DATA.stats.duration}.`,
          modules: COURSE_DATA.modules.map((m) => ({
            id: m.id,
            title: m.title,
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ text: t })),
          })),
        }
      }
    ]
  },

  // 4. LUXURY LAYOUT - High-end boutique style (EXACT REPLICA)
  {
    id: "course-luxury-layout",
    name: "Luxury Course Layout",
    description: "Premium boutique design with gold accents, refined typography, and elegant spacing - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400", // Luxury elegant style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["luxury", "premium", "boutique", "elegant", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "luxury_course_hero",
        label: "Luxury Course Hero",
        props: {
          collectionTag: "The Signature Collection",
          title: "The Postpartum",
          titleItalic: "Masterclass",
          subtitle: "Curated expertise for the modern mother. A refined approach to healing and wellness.",
          heroImage: COURSE_DATA.heroImage,
          brandName: "Omugwo Academy",
          buttonText: "Boutique",
        }
      },
      {
        id: id(),
        type: "luxury_course_experience",
        label: "Luxury Experience",
        props: {
          sectionTitle: "The Experience",
          quote: "A masterclass that elevates the standard of maternal care.",
          description: COURSE_DATA.description,
          instructorName: COURSE_DATA.instructor.name,
          instructorRole: COURSE_DATA.instructor.role,
          instructorAvatar: COURSE_DATA.instructor.avatar,
          image: COURSE_DATA.videoBg,
        },
      },
      {
        id: id(),
        type: "luxury_course_curriculum",
        label: "Luxury Curriculum",
        props: {
          eyebrow: "The Curriculum",
          title: "Program Itinerary",
          modules: COURSE_DATA.modules.map((m) => ({
            id: m.id,
            title: m.title,
            lessons: (m.lessons || []).map((t) => ({ text: t })),
          })),
        },
      },
      {
        id: id(),
        type: "luxury_course_investment",
        label: "Luxury Investment",
        props: {
          title: "Acquire Access",
          subtitle: "Lifetime access to the complete masterclass, curated resources, and priority support.",
          eyebrow: "Investment",
          price: COURSE_DATA.price,
          originalPrice: COURSE_DATA.originalPrice,
          ctaText: "Reserve Your Place",
        },
      }
    ]
  },

  // 5: PLAYFUL LAYOUT - Fun, colorful design with playful animations
  {
    id: "course-playful-layout",
    name: "Playful Course Layout",
    description: "Fun, colorful design with playful illustrations, floating shapes, and friendly tone - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1534796647163-7a3a5f1c2b78?auto=format&fit=crop&q=80&w=400", // Playful colorful style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["playful", "colorful", "fun", "friendly", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "playful_hero",
        label: "Playful Hero",
        props: {
          title: "Welcome to Your Postpartum Reset",
          titleHighlight: "Postpartum",
          subtitle: "A warm, friendly, culturally grounded roadmap that feels like a supportive village.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          secondaryCtaText: "View Curriculum",
          secondaryCtaLink: "#curriculum",
          badgeText: "Fun & Friendly",
          heroImage: COURSE_DATA.heroImage,
          primaryColor: "#22d3ee",
          secondaryColor: "#a855f7",
          accentColor: "#facc15",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "playful_features",
        label: "Playful Features",
        props: {
          title: "Designed to make recovery feel lighter",
          subtitle: "Clear steps, friendly reminders, and real support.",
          features: [
            { icon: "heart", title: "Gentle Guidance", description: "Supportive lessons that respect your pace." },
            { icon: "users", title: "Community", description: "You're never doing this alone." },
            { icon: "book", title: "Practical Resources", description: "Checklists, routines, and templates." },
          ],
          primaryColor: "#22d3ee",
          secondaryColor: "#a855f7",
          accentColor: "#facc15",
          backgroundColor: "#ffffff",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "course_curriculum",
        label: "Curriculum",
        props: {
          title: "Curriculum",
          subtitle: "A simple path from day one to month three.",
          backgroundColor: "#f9fafb",
          modules: COURSE_DATA.modules.map((m) => ({
            title: m.title,
            description: "",
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ title: t, duration: "", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false })),
          })),
        },
      },
      {
        id: id(),
        type: "playful_cta",
        label: "Playful CTA",
        props: {
          title: "Ready to begin?",
          subtitle: "Enroll now and start your recovery plan today.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          secondaryCtaText: "View Pricing",
          secondaryCtaLink: "#pricing",
          primaryColor: "#22d3ee",
          secondaryColor: "#a855f7",
          accentColor: "#facc15",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  },
  {
    id: "course-scientific-layout",
    name: "Scientific Course Layout",
    description: "Professional medical design with data visualization and clinical credibility - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a168d537b1?auto=format&fit=crop&q=80&w=400", // Scientific medical style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["scientific", "medical", "professional", "data", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "scientific_hero",
        label: "Scientific Hero",
        props: {
          title: "Evidence-Based Postpartum Recovery",
          titleHighlight: "Evidence-Based",
          subtitle: "A structured masterclass bridging tradition and modern medicine.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          secondaryCtaText: "Course Overview",
          secondaryCtaLink: "#overview",
          heroImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200",
          primaryColor: "#0ea5e9",
          accentColor: "#10b981",
          backgroundColor: "#0b1220",
          textAlign: "left",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "scientific_stats",
        label: "Stats",
        props: {
          stats: [
            { value: String(COURSE_DATA.stats.rating), label: "Avg. Rating" },
            { value: String(COURSE_DATA.stats.students), label: "Students" },
            { value: String(COURSE_DATA.stats.duration), label: "Duration" },
            { value: String(COURSE_DATA.stats.lessons), label: "Lessons" },
          ],
          primaryColor: "#0ea5e9",
          backgroundColor: "#0b1220",
          paddingY: "py-12",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "scientific_content",
        label: "Clinical Summary",
        props: {
          badgeText: "Clinical Summary",
          title: "What you'll learn",
          body: COURSE_DATA.description,
          image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=1200",
          imagePosition: "right",
          primaryColor: "#0ea5e9",
          accentColor: "#10b981",
          backgroundColor: "#ffffff",
          textAlign: "left",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "course_overview",
        label: "Course Overview",
        props: {
          variant: "tabs",
          title: "Course Description",
          description: COURSE_DATA.description,
          price: COURSE_DATA.price,
          originalPrice: COURSE_DATA.originalPrice,
          ctaText: "ENROLL NOW",
          secondaryCtaText: "ADD TO CART",
          instructorName: COURSE_DATA.instructor.name,
          instructorTitle: COURSE_DATA.instructor.role,
          instructorImage: COURSE_DATA.instructor.avatar,
          instructorBio: COURSE_DATA.instructor.bio,
        },
      },
      {
        id: id(),
        type: "scientific_cta",
        label: "Scientific CTA",
        props: {
          title: "Start Your Evidence-Based Journey",
          subtitle: "Join thousands of mothers who have transformed their recovery with clinically-proven methods.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          primaryColor: "#0ea5e9",
          backgroundColor: "#0b1220",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  },
  {
    id: "course-storytelling-layout",
    name: "Storytelling Course Layout",
    description: "Narrative-driven design with emotional journey and personal stories",
    thumbnail: "https://images.unsplash.com/photo-1507670428126-10c6d1c2772e?auto=format&fit=crop&q=80&w=400", // Storytelling warm style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["storytelling", "narrative", "emotional", "journey"],
    blocks: [
      {
        id: id(),
        type: "hero_split",
        label: "Hero",
        props: {
          title: "Your Postpartum Story Can Be Softer",
          titleHighlight: "Softer",
          subtitle: "A guided journey from survival mode to supported healing.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          secondaryCtaText: "Read the Curriculum",
          secondaryCtaLink: "#curriculum",
          align: "left",
          heroImage: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=1200",
          imagePosition: "right",
          backgroundGradient: "linear-gradient(to right, rgba(17,24,39,0.95), rgba(17,24,39,0.25))",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "content",
        label: "Story",
        props: {
          badgeText: "The Journey",
          title: "From overwhelmed to grounded",
          body: COURSE_DATA.description,
          image: COURSE_DATA.heroImage,
          imagePosition: "left",
          backgroundColor: "#ffffff",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "testimonials",
        label: "Testimonials",
        props: {
          variant: "cards",
          title: "Stories from mothers",
          subtitle: "Real experiences. Real healing.",
          columns: "3",
          backgroundColor: "#111827",
          textColor: "#ffffff",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
          testimonials: [
            { name: "Adaeze Okonkwo", role: "First-time Mom, Lagos", content: "I felt seen. The lessons gave me language for what I was going through.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", rating: 5 },
            { name: "Folake Adeyemi", role: "Mom of 3, Ibadan", content: "The cultural balance section changed how I set boundaries with love.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200", rating: 5 },
            { name: "Chukwuemeka Eze", role: "New Dad, Abuja", content: "It helped me support my wife with practical steps, not guesses.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", rating: 5 },
          ],
        },
      },
      {
        id: id(),
        type: "cta",
        label: "CTA",
        props: {
          title: "Join the journey",
          subtitle: "Enroll now and build your recovery story with support.",
          primaryText: "Enroll Now",
          primaryHref: "/checkout",
          secondaryText: "View Curriculum",
          secondaryHref: "#curriculum",
          variant: "solid",
          align: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  },
  {
    id: "course-tech-layout",
    name: "Tech Course Layout",
    description: "Modern tech-focused design with gradients, animations, and sleek UI - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4b0d2c4d8e2d?auto=format&fit=crop&q=80&w=400", // Tech gradient style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["tech", "modern", "gradients", "sleek", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "tech_hero",
        label: "Tech Hero",
        props: {
          title: "A Modern Postpartum System",
          titleHighlight: "Modern",
          subtitle: COURSE_DATA.subtitle,
          ctaText: "Get Access",
          ctaLink: "/checkout",
          price: COURSE_DATA.price,
          priceSubtext: "One-time payment",
          badgeText: "New Cohort Open",
          heroImage: COURSE_DATA.heroImage,
          instructorName: COURSE_DATA.instructor.name,
          instructorRole: COURSE_DATA.instructor.role,
          stat1Label: "Duration",
          stat1Value: String(COURSE_DATA.stats.duration),
          stat2Label: "Lessons",
          stat2Value: String(COURSE_DATA.stats.lessons),
          primaryColor: "#8b5cf6",
          secondaryColor: "#06b6d4",
          backgroundColor: "#0f0f23",
          textAlign: "left",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "tech_features",
        label: "Tech Features",
        props: {
          title: "Structured, intuitive, and supportive",
          subtitle: "Everything you need in one modern experience.",
          features: [
            { icon: "play", badge: "LESSONS", title: "Video-first learning", description: "Short, digestible sessions." },
            { icon: "users", badge: "COMMUNITY", title: "Peer support", description: "Ask questions and share wins." },
            { icon: "book", badge: "RESOURCES", title: "Downloadables", description: "Checklists and plans." },
          ],
          primaryColor: "#8b5cf6",
          secondaryColor: "#06b6d4",
          backgroundColor: "rgba(245, 243, 255, 0.5)",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "course_curriculum",
        label: "Curriculum",
        props: {
          title: "Curriculum",
          subtitle: "A structured path from start to finish.",
          backgroundColor: "#ffffff",
          modules: COURSE_DATA.modules.map((m) => ({
            title: m.title,
            description: "",
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ title: t, duration: "", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false })),
          })),
        },
      },
      {
        id: id(),
        type: "tech_cta",
        label: "Tech CTA",
        props: {
          title: "Ready to Get Started?",
          subtitle: "Join the modern approach to postpartum recovery.",
          ctaText: "Get Access Now",
          ctaLink: "/checkout",
          primaryColor: "#8b5cf6",
          secondaryColor: "#06b6d4",
          backgroundColor: "#0f0f23",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  },
  {
    id: "course-cultural-layout",
    name: "Cultural Course Layout",
    description: "Culturally rich design celebrating African heritage and traditional wisdom - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc404a3e?auto=format&fit=crop&q=80&w=400", // Cultural heritage style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["cultural", "african", "traditional", "heritage", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "cultural_hero",
        label: "Cultural Hero",
        props: {
          title: "Rooted in Omugwo. Supported by Science.",
          titleHighlight: "Omugwo",
          subtitle: "A culturally grounded postpartum masterclass for modern families.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          secondaryCtaText: "Explore Curriculum",
          secondaryCtaLink: "#curriculum",
          badgeText: "Cultural + Clinical",
          heroImage: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=1200",
          primaryColor: "#b45309",
          secondaryColor: "#92400e",
          accentColor: "#f59e0b",
          backgroundColor: "#fef3c7",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "cultural_features",
        label: "Cultural Features",
        props: {
          title: "Wisdom passed down through generations",
          subtitle: "Where tradition meets modern care.",
          features: [
            { icon: "globe", title: "Cultural Heritage", description: "Rooted in African traditions and wisdom." },
            { icon: "users", title: "Community Support", description: "Connect with mothers who understand." },
            { icon: "leaf", title: "Natural Recovery", description: "Holistic approaches to healing." },
          ],
          primaryColor: "#b45309",
          secondaryColor: "#92400e",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "course_curriculum",
        label: "Curriculum",
        props: {
          title: "Curriculum",
          subtitle: "A respectful blend of tradition and evidence-based care.",
          backgroundColor: "#fff7ed",
          modules: COURSE_DATA.modules.map((m) => ({
            title: m.title,
            description: "",
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ title: t, duration: "", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false })),
          })),
        },
      },
      {
        id: id(),
        type: "cultural_cta",
        label: "Cultural CTA",
        props: {
          title: "Bring the village back",
          subtitle: "Enroll now and access a complete postpartum support system.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          primaryColor: "#b45309",
          secondaryColor: "#92400e",
          accentColor: "#f59e0b",
          backgroundColor: "#fef3c7",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  },
  {
    id: "course-sales-focused-layout",
    name: "Sales-Focused Course Layout",
    description: "High-conversion sales page with urgency, scarcity, and strong CTAs - EXACT replica of showcase",
    thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6035d?auto=format&fit=crop&q=80&w=400", // Sales conversion style
    category: "course_sales",
    pageType: "course_sales",
    tags: ["sales", "conversion", "urgency", "cta", "exact-replica"],
    blocks: [
      {
        id: id(),
        type: "sales_hero",
        label: "Sales Hero",
        props: {
          title: "Enroll in the Postpartum Masterclass",
          titleHighlight: "Enroll",
          subtitle: "Limited-time pricing. Start today and feel supported through every step.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          price: COURSE_DATA.price,
          originalPrice: COURSE_DATA.originalPrice,
          urgencyText: "Limited Time Offer",
          urgencyIcon: "flame",
          heroImage: COURSE_DATA.heroImage,
          primaryColor: "#dc2626",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "sales_benefits",
        label: "Sales Benefits",
        props: {
          title: "What You'll Get",
          subtitle: "Everything you need for a complete postpartum recovery.",
          benefits: [
            { icon: "check", title: "Complete Course Access", description: "All modules, lessons, and resources included." },
            { icon: "star", title: "Bonus Templates", description: "Checklists, meal plans, and recovery trackers." },
            { icon: "gift", title: "Community Access", description: "Private group for ongoing support." },
            { icon: "award", title: "Certificate", description: "Completion certificate for your records." },
          ],
          primaryColor: "#dc2626",
          accentColor: "#f59e0b",
          backgroundColor: "#f9fafb",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-7xl",
        },
      },
      {
        id: id(),
        type: "course_curriculum",
        label: "Curriculum",
        props: {
          title: "Curriculum",
          subtitle: "A complete path from day one to month three.",
          backgroundColor: "#ffffff",
          modules: COURSE_DATA.modules.map((m) => ({
            title: m.title,
            description: "",
            duration: m.duration,
            lessons: (m.lessons || []).map((t) => ({ title: t, duration: "", type: "video", linkedLessonId: null, isLocked: false, isCompleted: false })),
          })),
        },
      },
      {
        id: id(),
        type: "sales_cta",
        label: "Sales CTA",
        props: {
          title: "Don't Wait - Start Your Recovery Today",
          subtitle: "Join thousands of mothers who have transformed their postpartum experience.",
          ctaText: "Enroll Now",
          ctaLink: "/checkout",
          price: COURSE_DATA.price,
          originalPrice: COURSE_DATA.originalPrice,
          urgencyText: "Price increases soon",
          primaryColor: "#dc2626",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textAlign: "center",
          paddingY: "py-24",
          containerSize: "max-w-4xl",
        },
      },
    ]
  }
];
