import { Block, Template } from "./types";
import { BLOCK_DEFINITIONS } from "./registry";

const id = () => Math.random().toString(36).substr(2, 9);

export const COURSE_SALES_TEMPLATES: Template[] = [
    // 1. UDEMY STYLE - Classic Conversion Template
    {
        id: "udemy-style-v1",
        name: "Udemy Classic Sales Page",
        description: "High-conversion template with sticky sidebar, urgency elements, and social proof",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["udemy", "conversion", "sales"],
        blocks: [
            {
                id: id(),
                type: "navigation",
                label: "Navigation",
                props: BLOCK_DEFINITIONS.navigation.defaultProps
            },
            {
                id: id(),
                type: "udemy_hero",
                label: "Udemy Hero",
                props: {
                    title: "The Complete Postpartum Recovery Masterclass",
                    subtitle: "Everything you need to know for a healthy, supported postpartum journey. From physical recovery to mental wellness.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "ECD Specialist & Founder",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    rating: 4.8,
                    ratingCount: 2847,
                    studentCount: "8,432",
                    lastUpdated: "2/2025",
                    language: "English",
                    previewImageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
                    price: "₦49,000",
                    originalPrice: "₦129,000",
                    discountPercent: 62,
                    ctaText: "Add to Cart",
                    ctaLink: "/checkout",
                    includes: [
                        { icon: "video", text: "12 hours on-demand video" },
                        { icon: "book", text: "24 downloadable resources" },
                        { icon: "clock", text: "Full lifetime access" },
                        { icon: "award", text: "Certificate of completion" }
                    ]
                }
            },
            {
                id: id(),
                type: "hero_split",
                label: "Emotional Headline",
                props: {
                    title: "You Donâ€™t Have to Navigate Postpartum Alone",
                    subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy the first year of motherhood with confidence.",
                    ctaText: "Enroll Now",
                    ctaLink: "#pricing",
                    align: "left",
                    backgroundImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
                    showOverlay: true,
                    overlayOpacity: 45,
                    paddingY: "py-24",
                    containerSize: "max-w-7xl"
                }
            },
            {
                id: id(),
                type: "course_overview",
                label: "Course Details",
                props: {
                    variant: "tabs",
                    title: "Course Description",
                    description: "Complete guide for new mothers covering recovery, nutrition, and baby care basics. This comprehensive program is designed to bridge the gap between traditional wisdom and modern medical science. We believe that every mother deserves a 'village' of support, and this course is your digital village.\n\nYour body is healing. Your emotions are shifting. Your relationships are changing. And suddenly everyone has advice   but not everyone has answers. This is where new mothers often suffer quietly: exhaustion, anxiety, pain, confusion, isolation   and the pressure to look like everything is fine.\n\nYou deserve support that is practical, culturally relevant, and evidence-based.",
                    learningObjectives: [
                        { text: "Postnatal physical recovery" },
                        { text: "Nutritional needs for breastfeeding" },
                        { text: "Newborn sleep patterns" },
                        { text: "Emotional wellbeing and baby blues" }
                    ],
                    requirements: [
                        { text: "Basic understanding of pregnancy" },
                        { text: "Access to a quiet space for learning" },
                        { text: "A notebook for taking notes" }
                    ],
                    audience: [
                        { text: "First-time mothers" },
                        { text: "Expectant parents" },
                        { text: "Caregivers and nannies" }
                    ],
                    modules: [
                        {
                            title: "Module 1: Body Recovery",
                            duration: "2h 15m",
                            lessons: "Introduction to Postpartum Recovery, Understanding Your Body's Changes, Safe Exercise Guidelines, Nutrition for Recovery, Pelvic Floor Care, Pain Management Strategies"
                        },
                        {
                            title: "Module 2: Mental Health",
                            duration: "1h 45m",
                            lessons: "Recognizing Baby Blues vs PPD, Building Your Support System, Self-Care Strategies, Managing Anxiety, When to Seek Help"
                        },
                        {
                            title: "Module 3: Cultural Balance",
                            duration: "1h 30m",
                            lessons: "Understanding Cultural Expectations, Setting Healthy Boundaries, Communicating with Family, Balancing Tradition and Autonomy"
                        },
                        {
                            title: "Module 4: Marriage & Intimacy",
                            duration: "1h 20m",
                            lessons: "Communication After Birth, Partner Support Strategies, Intimacy Timelines, Rebuilding Connection"
                        },
                        {
                            title: "Module 5: Infant Care",
                            duration: "2h 00m",
                            lessons: "Feeding Basics, Understanding Baby Sleep, Newborn Care Essentials, Common Concerns Addressed, Building Confidence"
                        }
                    ],
                    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
                    price: "₦49,000",
                    originalPrice: "₦129,000",
                    discountBadge: "62% OFF",
                    ctaText: "ENROLL NOW",
                    secondaryCtaText: "ADD TO CART",
                    includes: [
                        { icon: "video", text: "12 Hours on-demand video" },
                        { icon: "book", text: "24 Lessons downloadable resources" },
                        { icon: "clock", text: "Full lifetime access" },
                        { icon: "award", text: "Certificate of completion" }
                    ],
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "ECD Specialist",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    instructorBio: "Dr. Megor is a distinguished medical professional and early childhood development specialist on a mission to provide every child in Africa with a promising start."
                }
            },
            {
                id: id(),
                type: "testimonials",
                label: "Student Reviews",
                props: {
                    title: "Student feedback",
                    subtitle: "4.8 course rating • 2,847 ratings",
                    columns: "3",
                    testimonials: [
                        { name: "Adaeze O.", role: "Verified Student", content: "This course transformed my postpartum experience. The cultural sensitivity combined with medical accuracy is unmatched.", avatar: "https://i.pravatar.cc/100?img=11", rating: 5 },
                        { name: "Chukwuemeka E.", role: "Verified Student", content: "As a new dad, this gave me the tools to truly support my wife. Highly recommend for partners too!", avatar: "https://i.pravatar.cc/100?img=12", rating: 5 },
                        { name: "Folake A.", role: "Verified Student", content: "Even after three children, I learned so much. The community support alone is worth it.", avatar: "https://i.pravatar.cc/100?img=13", rating: 5 }
                    ],
                    paddingY: "py-12",
                    containerSize: "max-w-7xl"
                }
            },
            {
                id: id(),
                type: "pricing_table",
                label: "Pricing",
                props: {
                    title: "Enroll Now",
                    subtitle: "Get lifetime access to the complete masterclass",
                    plans: [
                        {
                            name: "Complete Masterclass",
                            price: "₦49,000",
                            originalPrice: "₦98,000",
                            period: "lifetime access",
                            description: "Includes all 5 modules, bonuses, and community access.",
                            features: "12+ hours of video,50+ resources,Private community,Certificate of completion,30-day guarantee",
                            ctaText: "Add to Cart",
                            ctaLink: "/checkout",
                            highlighted: true,
                            badge: "50% OFF TODAY"
                        }
                    ],
                    paddingY: "py-12",
                    containerSize: "max-w-7xl"
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 2. COURSERA STYLE - Academic & Professional
    {
        id: "coursera-style-v1",
        name: "Coursera Professional",
        description: "Clean, academic layout with emphasis on credentials and learning outcomes",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["coursera", "academic", "professional", "clean"],
        blocks: [
            {
                id: id(),
                type: "coursera_hero",
                label: "Coursera Hero",
                props: {
                    title: "Postpartum Recovery Specialization",
                    subtitle: "Gain expertise in evidence-based postnatal care. Develop skills for physical recovery, mental wellness, and infant care.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "ECD Specialist",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    rating: 4.8,
                    reviewCount: 2847,
                    level: "Beginner",
                    duration: "12 weeks at 3 hours/week",
                    schedule: "Flexible schedule",
                    language: "English",
                    enrollmentCount: "15,000+",
                    ctaText: "Enroll for Free",
                    ctaLink: "/checkout",
                    previewImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                }
            },
            {
                id: id(),
                type: "stats",
                label: "Course Stats",
                props: {
                    variant: "minimal",
                    stats: [
                        { label: "Beginner level", value: "No prerequisites" },
                        { label: "12 weeks", value: "At 3 hours/week" },
                        { label: "Flexible schedule", value: "Learn at your own pace" },
                        { label: "English", value: "Subtitles available" }
                    ],
                    paddingY: "py-8",
                    containerSize: "max-w-6xl"
                }
            },
            {
                id: id(),
                type: "content",
                label: "Skills You'll Gain",
                props: {
                    title: "Skills you'll gain",
                    body: "• Postpartum Physical Recovery\n• Mental Health Management\n• Cultural Competency\n• Infant Care Fundamentals\n• Family Communication\n• Self-Care Strategies\n• Evidence-Based Decision Making\n• Support System Building",
                    backgroundColor: "#f5f5f5",
                    paddingY: "py-12",
                    containerSize: "max-w-6xl"
                }
            },
            {
                id: id(),
                type: "course_curriculum",
                label: "Syllabus",
                props: {
                    title: "Syllabus - What you will learn from this course",
                    subtitle: "5 modules • 48 lessons • Certificate upon completion",
                    modules: [
                        {
                            title: "Week 1-3: Physical Recovery Foundations",
                            description: "Master the fundamentals of postpartum physical healing",
                            duration: "3 weeks",
                            lessons: "Course Overview|8:00|video,Postpartum Anatomy|15:00|video,Healing Timeline|12:00|video,Exercise Protocols|18:00|video,Nutrition Science|14:00|video,Pain Management|11:00|video,Graded Quiz|10:00|quiz"
                        },
                        {
                            title: "Week 4-6: Mental & Emotional Wellness",
                            description: "Develop strategies for psychological wellbeing",
                            duration: "3 weeks",
                            lessons: "Perinatal Mental Health|13:00|video,Screening Tools|10:00|video,Coping Strategies|12:00|video,Support Networks|9:00|video,Professional Help|8:00|video,Graded Assessment|10:00|quiz"
                        }
                    ]
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 3. LINKEDIN LEARNING STYLE - Corporate & Skill-Focused
    {
        id: "linkedin-learning-style-v1",
        name: "LinkedIn Learning Corporate",
        description: "Professional, skill-focused layout optimized for career development and practical skills",
        thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["linkedin", "corporate", "skills"],
        blocks: [
            {
                id: id(),
                type: "linkedin_hero",
                label: "LinkedIn Hero",
                props: {
                    title: "Essential Postnatal Care Skills",
                    subtitle: "Master the practical skills needed for navigating the postpartum period effectively.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "ECD Specialist",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    skillLevel: "Beginner",
                    duration: "12h 30m",
                    learnerCount: "15,243",
                    releaseDate: "Updated Jan 2026",
                    skills: ["Postpartum Recovery", "Mental Health", "Infant Care", "Self-Care Strategies"],
                    ctaText: "Start Learning",
                    ctaLink: "/checkout",
                    previewImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                }
            },
            {
                id: id(),
                type: "features",
                label: "Course Details",
                props: {
                    variant: "minimal",
                    title: "Course details",
                    columns: "4",
                    features: [
                        { icon: "star", title: "Skill Level", description: "Beginner" },
                        { icon: "clock", title: "Duration", description: "12h 30m" },
                        { icon: "users", title: "Learners", description: "15,243" },
                        { icon: "award", title: "Certificate", description: "Included" }
                    ]
                }
            },
            {
                id: id(),
                type: "content",
                label: "Overview",
                props: {
                    title: "Course Overview",
                    body: "In this comprehensive course, Dr. Megor Ikuenobe guides you through the essential skills needed for a successful postpartum recovery.\n\nYou'll learn how to identify normal vs. abnormal healing, implement effective self-care strategies, and build a robust support system. Whether you're a first-time parent or looking to improve your experience, this course provides practical, actionable advice.",
                    imagePosition: "right"
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 4. MASTERCLASS STYLE - Premium & Celebrity
    {
        id: "masterclass-style-v1",
        name: "MasterClass Premium",
        description: "Dark, cinematic, luxury template focusing on the instructor's authority",
        thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["masterclass", "premium", "luxury", "dark"],
        blocks: [
            {
                id: id(),
                type: "masterclass_hero",
                label: "MasterClass Hero",
                props: {
                    title: "Dr. Megor Teaches Postpartum Recovery",
                    subtitle: "The founder of Lead Oak Foundation shares her comprehensive framework for healing, mental wellness, and thriving in motherhood.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "Founder & Maternal Health Expert",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    backgroundImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1920",
                    trailerUrl: "",
                    lessonCount: 24,
                    duration: "12+ hours",
                    ctaText: "Sign Up",
                    ctaLink: "/checkout",
                    price: "₦49,000"
                }
            },
            {
                id: id(),
                type: "features",
                label: "The Masterclass",
                props: {
                    title: "What's Included",
                    variant: "icons-top",
                    backgroundColor: "#111111", // Dark background
                    features: [
                        { icon: "video", title: "48 Video Lessons", description: "Cinematic quality instruction" },
                        { icon: "book", title: "Workbook", description: "Downloadable guides and exercises" },
                        { icon: "users", title: "Community", description: "Join fellow learners" }
                    ]
                }
            },
            {
                id: id(),
                type: "content",
                label: "Instructor Intro",
                props: {
                    title: "Meet Your Instructor",
                    body: "Dr. Megor Ikuenobe is a distinguished medical professional and early childhood development specialist on a mission to provide every child in Africa with a promising start.\n\nHer unique approach blends traditional African postnatal wisdom with evidence-based medical practice, creating a culturally relevant framework for modern mothers.",
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                    imagePosition: "left",
                    backgroundColor: "#000000" // Black background
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: { variant: "dark" }
            }
        ]
    },

    // 5. SKILLSHARE STYLE - Creative & Project-Based
    {
        id: "skillshare-style-v1",
        name: "Skillshare Creative",
        description: "Visual, project-based layout focusing on practical outcomes and community",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["skillshare", "creative", "project"],
        blocks: [
            {
                id: id(),
                type: "navigation",
                label: "Navigation",
                props: BLOCK_DEFINITIONS.navigation.defaultProps
            },
            {
                id: id(),
                type: "hero",
                label: "Hero",
                props: {
                    variant: "split",
                    title: "Design Your Postpartum Recovery Plan",
                    subtitle: "Join this class to create a personalized, actionable recovery roadmap that fits your life.",
                    ctaText: "Start Learning",
                    heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                }
            },
            {
                id: id(),
                type: "content",
                label: "About This Class",
                props: {
                    title: "About This Class",
                    body: "In this hands-on class, you won't just learn about recovery you'll actively plan it. We'll cover everything from meal prep strategies to boundary setting scripts.\n\n**The Project:** By the end of this class, you'll have a completed Postpartum Recovery Playbook, ready to implement or share with your support team.",
                    imagePosition: "right"
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 6. TEACHABLE STYLE - Minimalist Conversion
    {
        id: "teachable-style-v1",
        name: "Teachable Minimalist",
        description: "Clean, distraction-free template optimized for high conversion rates",
        thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["teachable", "minimalist", "conversion"],
        blocks: [
            {
                id: id(),
                type: "teachable_hero",
                label: "Teachable Hero",
                props: {
                    title: "The Postnatal Masterclass",
                    subtitle: "Everything you need to know for a smooth recovery.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "ECD Specialist",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    videoUrl: "",
                    price: "₦49,000",
                    originalPrice: "₦129,000",
                    ctaText: "Enroll Now",
                    ctaLink: "/checkout",
                    modules: [
                        { title: "Module 1: Body Recovery", lessonCount: 5, duration: "2h 15m" },
                        { title: "Module 2: Mental Health", lessonCount: 4, duration: "1h 45m" },
                        { title: "Module 3: Cultural Balance", lessonCount: 3, duration: "1h 30m" }
                    ],
                    includes: [
                        { icon: "video", text: "12 Hours on-demand video" },
                        { icon: "book", text: "24 Lessons downloadable resources" },
                        { icon: "clock", text: "Full lifetime access" },
                        { icon: "award", text: "Certificate of completion" }
                    ],
                    previewImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                }
            },
            {
                id: id(),
                type: "course_curriculum",
                label: "Curriculum",
                props: {
                    title: "Class Curriculum",
                    modules: [
                         {
                            title: "Module 1: The Basics",
                            description: "Getting started",
                            duration: "1h",
                            lessons: "Intro|5:00|video,Setup|10:00|video"
                        }
                    ]
                }
            },
            {
                id: id(),
                type: "pricing_table",
                label: "Enrollment",
                props: {
                    title: "Get Started Now",
                    plans: [
                        {
                            name: "Full Course",
                            price: "₦49,000",
                            period: "one-time payment",
                            features: "All lessons,Lifetime access",
                            ctaText: "Enroll Now",
                            highlighted: true
                        }
                    ]
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 7. THINKIFIC STYLE - Authority Builder
    {
        id: "thinkific-style-v1",
        name: "Thinkific Authority",
        description: "Expert-positioned template highlighting instructor credibility and course depth",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["thinkific", "authority", "expert"],
        blocks: [
             {
                id: id(),
                type: "thinkific_hero",
                label: "Thinkific Hero",
                props: {
                    title: "Evidence-Based Postpartum Care",
                    subtitle: "A proven framework developed by medical experts to ensure a safe, healthy recovery.",
                    instructorName: "Dr. Megor Ikuenobe",
                    instructorTitle: "Founder & Maternal Health Expert",
                    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    instructorBio: "Dr. Megor is a distinguished medical professional and early childhood development specialist on a mission to provide every child in Africa with a promising start.",
                    price: "₦49,000",
                    originalPrice: "₦129,000",
                    ctaText: "Buy Now",
                    ctaLink: "/checkout",
                    modules: [
                        { title: "Module 1: Body Recovery", lessonCount: 5, duration: "2h 15m" },
                        { title: "Module 2: Mental Health", lessonCount: 4, duration: "1h 45m" },
                        { title: "Module 3: Cultural Balance", lessonCount: 3, duration: "1h 30m" }
                    ],
                    enrollmentCount: "15,000+",
                    rating: 4.8,
                    reviewCount: 2847,
                    previewImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800"
                }
            },
            {
                id: id(),
                type: "testimonials",
                label: "Social Proof",
                props: { variant: "cards" }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 8. KAJABI STYLE - Sales Funnel Optimized
    {
        id: "kajabi-style-v1",
        name: "Kajabi Funnel",
        description: "Long-form sales page optimized for storytelling and overcoming objections",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["kajabi", "funnel", "long-form"],
        blocks: [
            {
                id: id(),
                type: "hero",
                label: "Hook Hero",
                props: {
                    variant: "centered",
                    title: "Tired of Feeling Overwhelmed by Postpartum Advice?",
                    subtitle: "Discover the step-by-step system to recover your body and protect your peace.",
                    ctaText: "Yes, I Want This",
                    backgroundColor: "#f5f3ff"
                }
            },
            {
                id: id(),
                type: "content",
                label: "The Problem",
                props: {
                    title: "Here's the truth about postpartum...",
                    body: "Most advice is conflicting, outdated, or ignores your cultural background. You shouldn't have to choose between modern medicine and honoring your traditions.",
                    imagePosition: "right"
                }
            },
            {
                id: id(),
                type: "features",
                label: "The Solution",
                props: { title: "Introducing the Omugwo Method", variant: "icons-top" }
            },
             {
                id: id(),
                type: "pricing_table",
                label: "Offer",
                props: { title: "Join Today" }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 9. PODIA STYLE - Community First
    {
        id: "podia-style-v1",
        name: "Podia Community",
        description: "Friendly, approachable template that emphasizes community and interaction",
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["podia", "community", "friendly"],
        blocks: [
            {
                id: id(),
                type: "navigation",
                label: "Navigation",
                props: BLOCK_DEFINITIONS.navigation.defaultProps
            },
            {
                id: id(),
                type: "hero",
                label: "Community Hero",
                props: {
                    variant: "split",
                    title: "Join the Omugwo Village",
                    subtitle: "Get the course + instant access to our private community of supportive mothers.",
                    ctaText: "Join the Community",
                    heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
                }
            },
             {
                id: id(),
                type: "features",
                label: "What's Inside",
                props: {
                    title: "Everything you get",
                    features: [
                        { icon: "book", title: "The Full Course", description: "All 5 modules" },
                        { icon: "users", title: "Community Forum", description: "24/7 support" },
                        { icon: "mic", title: "Live Q&A Calls", description: "Monthly access to Dr. Megor" }
                    ]
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    },

    // 10. GUMROAD STYLE - Direct Sale
    {
        id: "gumroad-style-v1",
        name: "Gumroad Direct",
        description: "No-fluff, direct sales template focused purely on the product and immediate checkout",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["gumroad", "direct", "simple"],
        blocks: [
            {
                id: id(),
                type: "hero",
                label: "Product Hero",
                props: {
                    variant: "split",
                    title: "The Postnatal Recovery Bundle",
                    subtitle: "A complete digital guide and workbook set for new mothers.",
                    ctaText: "I want this! (₦49,000)",
                    heroImage: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=800",
                    backgroundColor: "#ffffff"
                }
            },
            {
                id: id(),
                type: "content",
                label: "Description",
                props: {
                    title: "What you're getting:",
                    body: "This comprehensive bundle includes:\n\n• The 12-hour video masterclass\n• Printable recovery checklists\n• Nutrition guide and meal plans\n• Partner communication scripts",
                    imagePosition: "right"
                }
            }
        ]
    },
    // 7. MOODLE LMS STYLE - Structured & Clean
    {
        id: "moodle-style-v1",
        name: "Classic LMS (Moodle Style)",
        description: "A structured, familiar e-learning layout with a dark header and stacked content cards.",
        thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=400",
        category: "course_sales",
        pageType: "course_sales",
        tags: ["lms", "moodle", "structured", "academic"],
        blocks: [
            {
                id: id(),
                type: "navigation",
                label: "Navigation",
                props: { brandName: "Omugwo Academy", variant: "light" }
            },
            {
                id: id(),
                type: "hero",
                label: "Course Header",
                props: {
                    variant: "minimal",
                    title: "The Comprehensive Omugwo Masterclass",
                    subtitle: "Are you ready to transform your postpartum experience? Join our comprehensive course and embark on a journey of healing and confidence like never before.",
                    badgeText: "NEW • POPULAR",
                    backgroundColor: "#333d4a", // Dark Slate Blue
                    paddingY: "py-24",
                    containerSize: "max-w-7xl",
                    align: "left",
                    showOverlay: false
                }
            },
            {
                id: id(),
                type: "course_overview",
                label: "Course Details",
                props: {
                    variant: "stacked",
                    title: "What You'll Learn",
                    description: "Course content intro goes here. You can give a preview of your course content using this section. Evidence-based postnatal care blended with traditional Omugwo wisdom.",
                    learningObjectives: [
                        { text: "Understand physical recovery timelines" },
                        { text: "Identify baby blues vs postpartum depression" },
                        { text: "Establish healthy boundaries with family" },
                        { text: "Master newborn feeding basics" },
                        { text: "Improve partner communication" },
                        { text: "Develop a personalized care plan" }
                    ],
                    requirements: [],
                    audience: [],
                    modules: [
                        { title: "Module 1 - Course Introduction", duration: "1h", lessons: "Welcome, Expectations" },
                        { title: "Module 2 - Physical Healing", duration: "2h", lessons: "Body Changes, Nutrition, Sleep" },
                        { title: "Module 3 - Mental Wellbeing", duration: "1.5h", lessons: "Emotions, Support Systems" },
                        { title: "Module 4 - Infant Care", duration: "2h", lessons: "Feeding, Bathing, Soothing" }
                    ],
                    imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
                    price: "₦49,000",
                    originalPrice: "",
                    discountBadge: "",
                    ctaText: "Join Now",
                    secondaryCtaText: "",
                    includes: [
                        { icon: "video", text: "12+ hours video" },
                        { icon: "book", text: "5 Modules" },
                        { icon: "award", text: "100+ downloadable resources" },
                        { icon: "clock", text: "Lifetime access" },
                        { icon: "award", text: "Certificate of completion" }
                    ],
                    instructorName: "Sarah Doe",
                    instructorTitle: "Tutor",
                    instructorImage: "https://i.pravatar.cc/150?img=47",
                    instructorBio: "Sarah is a certified postnatal care specialist with over 10 years of experience helping new mothers navigate the fourth trimester.",
                    backgroundColor: "#f4f6f8", // Light gray background
                    paddingY: "py-16"
                }
            },
            {
                id: id(),
                type: "footer",
                label: "Footer",
                props: BLOCK_DEFINITIONS.footer.defaultProps
            }
        ]
    }
];
