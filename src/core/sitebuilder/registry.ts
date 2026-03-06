import {
  Sparkles, SplitSquareHorizontal, LayoutGrid, Quote, MessageCircleHeart,
  Zap, CircleHelp, BarChart3, MailPlus, BadgeDollarSign, ToggleRight,
  BookOpen, Video, Calendar, Users, Award, Target, Timer,
  PanelTopDashed, Rows4, Phone, MapPinned, GitBranch, Database,
  GalleryHorizontalEnd, UsersRound, FileText, Megaphone, Play, Gem
} from "lucide-react";
import { BlockDefinition } from "./types";

import { HeroBlock, heroBlockSchema } from "./blocks/hero-block";
import { FeaturesBlock, featuresBlockSchema } from "./blocks/features-block";
import { CourseGridBlock, courseGridBlockSchema } from "./blocks/course-grid-block";
import { TestimonialsBlock, testimonialsBlockSchema } from "./blocks/testimonials-block";
import { CtaBlock, ctaBlockSchema } from "./blocks/cta-block";
import { FAQBlock, faqBlockSchema } from "./blocks/faq-block";
import { StatsBlock, statsBlockSchema } from "./blocks/stats-block";
import { NewsletterBlock, newsletterBlockSchema } from "./blocks/newsletter-block";
import { PricingBlock, pricingBlockSchema } from "./blocks/pricing-block";
import { WebinarRegistrationBlock, webinarRegistrationBlockSchema } from "./blocks/webinar-registration-block";
import { NavigationBlock, navigationBlockSchema } from "./blocks/navigation-block";
import { FooterBlock, footerBlockSchema } from "./blocks/footer-block";
import { ContentBlock, contentBlockSchema } from "./blocks/content-block";
import { CommunityDiscussionsBlock, communityDiscussionsBlockSchema } from "./blocks/community-discussions-block";
import { BlogPostsBlock, blogPostsBlockSchema } from "./blocks/blog-posts-block";
import { TeamBlock, teamBlockSchema } from "./blocks/team-block";
import { VideoBlock, videoBlockSchema } from "./blocks/video-block";
import { CountdownBlock, countdownBlockSchema } from "./blocks/countdown-block";
import { LogoCloudBlock, logoCloudBlockSchema } from "./blocks/logo-cloud-block";
import { GalleryBlock, galleryBlockSchema } from "./blocks/gallery-block";
import { ContactBlock, contactBlockSchema } from "./blocks/contact-block";
import { CourseCurriculumBlock, courseCurriculumBlockSchema } from "./blocks/course-curriculum-block";
import { CourseOverviewBlock, courseOverviewBlockSchema } from "./blocks/course-overview-block";
import { CampaignStoryBlock, campaignStoryBlockSchema } from "./blocks/campaign-story-block";
import { WebinarGridBlock } from "./blocks/webinar-grid-block";
import { ContactFormBlock } from "./blocks/contact-form-block";
import { ContactInfoBlock } from "./blocks/contact-info-block";
import { webinarGridBlockSchema, contactFormBlockSchema, contactInfoBlockSchema } from "./blocks/webinar-grid-block-schema";
import { InteractiveCourseHeroBlock, interactiveCourseHeroBlockSchema } from "./blocks/interactive-course-hero-block";
import { CinematicCourseHeroBlock, cinematicCourseHeroBlockSchema } from "./blocks/cinematic-course-hero-block";
import { MinimalistCourseHeroBlock, minimalistCourseHeroBlockSchema } from "./blocks/minimalist-course-hero-block";
import { LuxuryCourseHeroBlock, luxuryCourseHeroBlockSchema } from "./blocks/luxury-course-hero-block";
import { InteractiveCourseFeaturesBlock, interactiveCourseFeaturesBlockSchema } from "./blocks/interactive-course-features-block";
import { InteractiveCourseModulesBlock, interactiveCourseModulesBlockSchema } from "./blocks/interactive-course-modules-block";
import { CinematicCourseBodyBlock, cinematicCourseBodyBlockSchema } from "./blocks/cinematic-course-body-block";
import { MinimalistCoursePhilosophyBlock, minimalistCoursePhilosophyBlockSchema } from "./blocks/minimalist-course-philosophy-block";
import { MinimalistCourseCurriculumBlock, minimalistCourseCurriculumBlockSchema } from "./blocks/minimalist-course-curriculum-block";
import { LuxuryCourseExperienceBlock, luxuryCourseExperienceBlockSchema } from "./blocks/luxury-course-experience-block";
import { LuxuryCourseCurriculumBlock, luxuryCourseCurriculumBlockSchema } from "./blocks/luxury-course-curriculum-block";
import { LuxuryCourseInvestmentBlock, luxuryCourseInvestmentBlockSchema } from "./blocks/luxury-course-investment-block";
import { InteractiveCoursePageBlock, interactiveCoursePageBlockSchema } from "./blocks/interactive-course-page-block";
import { CinematicCoursePageBlock, cinematicCoursePageBlockSchema } from "./blocks/cinematic-course-page-block";
import { MinimalistCoursePageBlock, minimalistCoursePageBlockSchema } from "./blocks/minimalist-course-page-block";
import { LuxuryCoursePageBlock, luxuryCoursePageBlockSchema } from "./blocks/luxury-course-page-block";

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  //  Hero Blocks 
  hero: {
    type: "hero",
    label: "Hero Section",
    icon: Sparkles,
    category: "hero",
    component: HeroBlock,
    defaultProps: {
      title: "Empowering Your Postpartum Journey",
      subtitle: "Evidence-based care meets cultural wisdom. Join thousands of mothers transforming their recovery experience.",
      ctaText: "Start Learning",
      ctaLink: "/courses",
      secondaryCtaText: "Watch Free Masterclass",
      secondaryCtaLink: "/webinars",
      align: "center",
      backgroundImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=2000",
      showOverlay: true,
      overlayOpacity: 50,
      animation: "slideUp",
      paddingY: "py-32",
    },
    propSchema: heroBlockSchema,
  },
  hero_split: {
    type: "hero_split",
    label: "Hero (Split)",
    icon: SplitSquareHorizontal,
    category: "hero",
    component: HeroBlock,
    defaultProps: {
      title: "Your Postpartum Recovery Starts Here",
      subtitle: "Expert-led courses designed for every stage of your fourth trimester journey.",
      ctaText: "Explore Courses",
      ctaLink: "/courses",
      align: "left",
      heroImageSize: "lg",
      backgroundImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=2000",
      showOverlay: true,
      overlayOpacity: 40,
      animation: "slideUp",
      paddingY: "py-24",
    },
    propSchema: heroBlockSchema,
  },

  //  Marketing Blocks 
  features: {
    type: "features",
    label: "Features Grid",
    icon: LayoutGrid,
    category: "marketing",
    component: FeaturesBlock,
    defaultProps: {
      title: "Why Choose Omugwo Academy",
      subtitle: "A holistic approach to postpartum care that honors tradition while embracing modern science.",
      columns: "3",
    },
    propSchema: featuresBlockSchema,
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    icon: Quote,
    category: "social_proof",
    component: TestimonialsBlock,
    defaultProps: {
      title: "What Our Students Say",
      subtitle: "Real stories from real parents who transformed their postpartum experience.",
      columns: "3",
    },
    propSchema: testimonialsBlockSchema,
  },
  cta: {
    type: "cta",
    label: "Call To Action",
    icon: Zap,
    category: "marketing",
    component: CtaBlock,
    defaultProps: {
      title: "Ready to Transform Your Postpartum Journey?",
      subtitle: "Join thousands of parents who've found confidence, support, and expert guidance.",
      primaryText: "Enroll Now",
      primaryHref: "/courses",
      secondaryText: "Watch Free Masterclass",
      secondaryHref: "/webinars",
      variant: "gradient",
      align: "center",
    },
    propSchema: ctaBlockSchema,
  },
  faq: {
    type: "faq",
    label: "FAQ Accordion",
    icon: CircleHelp,
    category: "marketing",
    component: FAQBlock,
    defaultProps: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our courses and platform.",
    },
    propSchema: faqBlockSchema,
  },
  stats: {
    type: "stats",
    label: "Stats Counter",
    icon: BarChart3,
    category: "marketing",
    component: StatsBlock,
    defaultProps: { variant: "light" },
    propSchema: statsBlockSchema,
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter Signup",
    icon: MailPlus,
    category: "marketing",
    component: NewsletterBlock,
    defaultProps: {
      title: "Get Free Postnatal Tips Weekly",
      subtitle: "Join 15,000+ parents receiving expert advice every Thursday.",
      buttonText: "Subscribe",
      variant: "primary",
    },
    propSchema: newsletterBlockSchema,
  },
  campaign_story: {
    type: "campaign_story",
    label: "Campaign Story",
    icon: LayoutGrid,
    category: "marketing",
    component: CampaignStoryBlock,
    defaultProps: {
      badgeText: "Featured Campaign",
      title: "My ",
      titleHighlight: "Omugwo",
      titleSuffix: " Story",
    },
    propSchema: campaignStoryBlockSchema,
  },
  content: {
    type: "content",
    label: "Content Section",
    icon: FileText,
    category: "marketing",
    component: ContentBlock,
    defaultProps: {
      title: "Our Story",
      imagePosition: "right",
      imageOffsetX: 0,
      imageOffsetY: 0,
      quoteOffsetX: 0,
      quoteOffsetY: 0,
      textOffsetX: 0,
      textOffsetY: 0,
    },
    propSchema: contentBlockSchema,
  },

  //  Course Blocks 
  course_curriculum: {
    type: "course_curriculum",
    label: "Course Curriculum",
    icon: BookOpen,
    category: "course",
    component: CourseCurriculumBlock,
    defaultProps: {
      title: "Course Curriculum",
      subtitle: "Everything you'll learn in this comprehensive program",
      modules: [],
      showProgress: false,
    },
    propSchema: courseCurriculumBlockSchema,
  },
  course_overview: {
    type: "course_overview",
    label: "Course Overview (Sidebar)",
    icon: BookOpen,
    category: "course",
    component: CourseOverviewBlock,
    defaultProps: {
      variant: "tabs",
      title: "Course Description",
    },
    propSchema: courseOverviewBlockSchema,
  },
  course_grid: {
    type: "course_grid",
    label: "Course Grid",
    icon: LayoutGrid,
    category: "course",
    component: CourseGridBlock,
    defaultProps: {
      mode: "static",
      dynamicLimit: 6,
      dynamicFeaturedOnly: false,
      title: "Our Courses",
      subtitle: "Expert-led programs designed for every stage of your postpartum journey.",
      columns: "3",
      showCta: true,
      ctaText: "View All Courses",
      ctaLink: "/courses",
    },
    propSchema: courseGridBlockSchema,
  },
  pricing_table: {
    type: "pricing_table",
    label: "Pricing Table",
    icon: BadgeDollarSign,
    category: "course",
    component: PricingBlock,
    defaultProps: {
      title: "Choose Your Learning Path",
      subtitle: "Invest in yourself and your family's wellbeing.",
    },
    propSchema: pricingBlockSchema,
  },

  pricing: {
    type: "pricing",
    label: "Pricing",
    icon: BadgeDollarSign,
    category: "course",
    component: PricingBlock,
    defaultProps: {
      title: "Choose Your Learning Path",
      subtitle: "Invest in yourself and your family's wellbeing.",
    },
    propSchema: pricingBlockSchema,
  },

  //  Showcase Course Layout Blocks (Exact Replicas) 
  interactive_course_hero: {
    type: "interactive_course_hero",
    label: "Interactive Course Hero",
    icon: Sparkles,
    category: "course",
    component: InteractiveCourseHeroBlock,
    defaultProps: {
      title: "Your Modern Postpartum Playbook",
      titleHighlight: "Postpartum",
      subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy the first year of motherhood with confidence.",
      ctaText: "Get Lifetime Access",
      price: "₦49,000",
      priceSubtext: "One-time payment",
      badgeText: "Enrolling Now for Next Cohort",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      instructorName: "Dr. Megor",
      instructorRole: "Lead Instructor",
      stat1Label: "Format",
      stat1Value: "12 Hours Video",
      stat2Label: "Community",
      stat2Value: "8,432 Members",
    },
    propSchema: interactiveCourseHeroBlockSchema,
  },
  cinematic_course_hero: {
    type: "cinematic_course_hero",
    label: "Cinematic Course Hero",
    icon: Play,
    category: "course",
    component: CinematicCourseHeroBlock,
    defaultProps: {
      title: "The Postpartum Masterclass",
      subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
      badgeText: "Masterclass",
      ctaText: "Enroll Now",
      price: "₦49,000",
      backgroundImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1600",
      rating: "4.9",
      students: "8,432",
      duration: "12 Hours",
      lessons: "48",
    },
    propSchema: cinematicCourseHeroBlockSchema,
  },
  minimalist_course_hero: {
    type: "minimalist_course_hero",
    label: "Minimalist Course Hero",
    icon: FileText,
    category: "course",
    component: MinimalistCourseHeroBlock,
    defaultProps: {
      tagline: "A Modern Guide to Postpartum",
      titleLine1: "Reclaim",
      titleLine2: "Your Body.",
      titleLine3: "Restore",
      titleLine4: "Your Mind.",
      ctaText: "Start the Journey",
      price: "₦49,000",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
      brandName: "Omugwo.",
    },
    propSchema: minimalistCourseHeroBlockSchema,
  },
  luxury_course_hero: {
    type: "luxury_course_hero",
    label: "Luxury Course Hero",
    icon: Award,
    category: "course",
    component: LuxuryCourseHeroBlock,
    defaultProps: {
      collectionTag: "The Signature Collection",
      title: "The Postpartum",
      titleItalic: "Masterclass",
      subtitle: "Curated expertise for the modern mother. A refined approach to healing and wellness.",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1600",
      brandName: "Omugwo Academy",
      buttonText: "Boutique",
    },
    propSchema: luxuryCourseHeroBlockSchema,
  },
  interactive_course_features: {
    type: "interactive_course_features",
    label: "Interactive Course Features",
    icon: LayoutGrid,
    category: "course",
    component: InteractiveCourseFeaturesBlock,
    defaultProps: {},
    propSchema: interactiveCourseFeaturesBlockSchema,
  },
  interactive_course_modules: {
    type: "interactive_course_modules",
    label: "Interactive Course Modules",
    icon: LayoutGrid,
    category: "course",
    component: InteractiveCourseModulesBlock,
    defaultProps: {},
    propSchema: interactiveCourseModulesBlockSchema,
  },
  cinematic_course_body: {
    type: "cinematic_course_body",
    label: "Cinematic Course Body",
    icon: Play,
    category: "course",
    component: CinematicCourseBodyBlock,
    defaultProps: {},
    propSchema: cinematicCourseBodyBlockSchema,
  },
  minimalist_course_philosophy: {
    type: "minimalist_course_philosophy",
    label: "Minimalist Course Philosophy",
    icon: FileText,
    category: "course",
    component: MinimalistCoursePhilosophyBlock,
    defaultProps: {},
    propSchema: minimalistCoursePhilosophyBlockSchema,
  },
  minimalist_course_curriculum: {
    type: "minimalist_course_curriculum",
    label: "Minimalist Course Curriculum",
    icon: BookOpen,
    category: "course",
    component: MinimalistCourseCurriculumBlock,
    defaultProps: {},
    propSchema: minimalistCourseCurriculumBlockSchema,
  },
  luxury_course_experience: {
    type: "luxury_course_experience",
    label: "Luxury Course Experience",
    icon: Gem,
    category: "course",
    component: LuxuryCourseExperienceBlock,
    defaultProps: {},
    propSchema: luxuryCourseExperienceBlockSchema,
  },
  luxury_course_curriculum: {
    type: "luxury_course_curriculum",
    label: "Luxury Course Curriculum",
    icon: BookOpen,
    category: "course",
    component: LuxuryCourseCurriculumBlock,
    defaultProps: {},
    propSchema: luxuryCourseCurriculumBlockSchema,
  },
  luxury_course_investment: {
    type: "luxury_course_investment",
    label: "Luxury Course Investment",
    icon: BadgeDollarSign,
    category: "course",
    component: LuxuryCourseInvestmentBlock,
    defaultProps: {},
    propSchema: luxuryCourseInvestmentBlockSchema,
  },
  interactive_course_page: {
    type: "interactive_course_page",
    label: "Interactive Course Page (Exact)",
    icon: Sparkles,
    category: "course",
    component: InteractiveCoursePageBlock,
    defaultProps: {},
    propSchema: interactiveCoursePageBlockSchema,
  },
  cinematic_course_page: {
    type: "cinematic_course_page",
    label: "Cinematic Course Page (Exact)",
    icon: Play,
    category: "course",
    component: CinematicCoursePageBlock,
    defaultProps: {},
    propSchema: cinematicCoursePageBlockSchema,
  },
  minimalist_course_page: {
    type: "minimalist_course_page",
    label: "Minimalist Course Page (Exact)",
    icon: FileText,
    category: "course",
    component: MinimalistCoursePageBlock,
    defaultProps: {},
    propSchema: minimalistCoursePageBlockSchema,
  },
  luxury_course_page: {
    type: "luxury_course_page",
    label: "Luxury Course Page (Exact)",
    icon: Award,
    category: "course",
    component: LuxuryCoursePageBlock,
    defaultProps: {},
    propSchema: luxuryCoursePageBlockSchema,
  },

  //  Webinar Blocks 
  webinar_registration: {
    type: "webinar_registration",
    label: "Webinar Registration",
    icon: Video,
    category: "webinar",
    component: WebinarRegistrationBlock,
    defaultProps: {
      mode: "static",
      title: "Free Live Masterclass: The 4th Trimester Blueprint",
      subtitle: "Discover the 5 pillars of postpartum recovery.",
      date: "March 15, 2025",
      time: "7:00 PM WAT",
      duration: "90 minutes",
      spotsLeft: 47,
    },
    propSchema: webinarRegistrationBlockSchema,
  },
  webinar_grid: {
    type: "webinar_grid",
    label: "Webinar Grid",
    icon: Video,
    category: "webinar",
    component: WebinarGridBlock,
    defaultProps: {
      title: "Upcoming Webinars",
      subtitle: "Join our interactive webinars and learn directly from experts",
      columns: "3",
      webinars: [],
    },
    propSchema: webinarGridBlockSchema,
  },

  //  Community Blocks 
  community_discussions: {
    type: "community_discussions",
    label: "Community Discussions",
    icon: MessageCircleHeart,
    category: "community",
    component: CommunityDiscussionsBlock,
    defaultProps: {
      mode: "static",
      dynamicLimit: 6,
      title: "Trending Discussions",
      subtitle: "See what parents are talking about right now.",
    },
    propSchema: communityDiscussionsBlockSchema,
  },

  blog_posts: {
    type: "dynamic_blog" as any,
    label: "Blog Posts",
    icon: Megaphone,
    category: "marketing",
    component: BlogPostsBlock,
    defaultProps: {
      mode: "static",
      dynamicLimit: 6,
      dynamicPageType: "blog",
      title: "Latest from Omugwo",
      subtitle: "Practical postpartum guidance, cultural wisdom, and expert insights.",
    },
    propSchema: blogPostsBlockSchema,
  },

  //  New Essential Blocks 
  team: {
    type: "team",
    label: "Team Members",
    icon: UsersRound,
    category: "marketing",
    component: TeamBlock,
    defaultProps: {
      variant: "cards",
      title: "Meet Our Team",
      subtitle: "The passionate experts behind Omugwo Academy.",
      columns: "3",
    },
    propSchema: teamBlockSchema,
  },
  video: {
    type: "video",
    label: "Video Embed",
    icon: Play,
    category: "marketing",
    component: VideoBlock,
    defaultProps: {
      variant: "inline",
      title: "",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    propSchema: videoBlockSchema,
  },
  countdown: {
    type: "countdown",
    label: "Countdown Timer",
    icon: Timer,
    category: "marketing",
    component: CountdownBlock,
    defaultProps: {
      variant: "cards",
      title: "Launch Countdown",
      subtitle: "Something amazing is coming!",
      ctaText: "Notify Me",
    },
    propSchema: countdownBlockSchema,
  },
  logo_cloud: {
    type: "logo_cloud",
    label: "Logo Cloud",
    icon: Award,
    category: "social_proof",
    component: LogoCloudBlock,
    defaultProps: {
      variant: "grid",
      title: "Trusted by leading organizations",
      grayscale: true,
    },
    propSchema: logoCloudBlockSchema,
  },
  gallery: {
    type: "gallery",
    label: "Image Gallery",
    icon: GalleryHorizontalEnd,
    category: "marketing",
    component: GalleryBlock,
    defaultProps: {
      variant: "grid",
      columns: "3",
    },
    propSchema: galleryBlockSchema,
  },
  contact: {
    type: "contact",
    label: "Contact Form",
    icon: Phone,
    category: "structural",
    component: ContactBlock,
    defaultProps: {
      variant: "split",
      title: "Get In Touch",
      subtitle: "Have a question? We'd love to hear from you.",
      showNameField: true,
      showPhoneField: false,
      showMessageField: true,
    },
    propSchema: contactBlockSchema,
  },
  contact_form: {
    type: "contact_form",
    label: "Contact Form (Advanced)",
    icon: Phone,
    category: "structural",
    component: ContactFormBlock,
    defaultProps: {
      title: "Send Us a Message",
      subtitle: "Fill out the form below and we'll get back to you within 24 hours.",
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "subject", label: "Subject", type: "select", options: ["General Inquiry", "Course Information", "Technical Support"], required: true },
        { name: "message", label: "Message", type: "textarea", required: true }
      ],
    },
    propSchema: contactFormBlockSchema,
  },
  contact_info: {
    type: "contact_info",
    label: "Contact Information",
    icon: MapPinned,
    category: "structural",
    component: ContactInfoBlock,
    defaultProps: {
      title: "Other Ways to Reach Us",
      subtitle: "Choose the method that works best for you",
      columns: "3",
      contactMethods: [
        {
          icon: "mail",
          title: "Email",
          description: "Send us an email and we'll respond within 24 hours",
          contact: "support@omugwoacademy.com",
          link: "mailto:support@omugwoacademy.com"
        },
        {
          icon: "phone",
          title: "Phone",
          description: "Call us Monday-Friday, 9am-5pm WAT",
          contact: "+234 800 123 4567",
          link: "tel:+2348001234567"
        }
      ],
    },
    propSchema: contactInfoBlockSchema,
  },

  //  Structural Blocks 
  navigation: {
    type: "navigation",
    label: "Navigation Bar",
    icon: PanelTopDashed,
    category: "structural",
    component: NavigationBlock,
    defaultProps: {
      brandName: "Omugwo Academy",
      ctaText: "Start Learning",
      ctaLink: "/courses",
      variant: "light",
    },
    propSchema: navigationBlockSchema,
  },
  footer: {
    type: "footer",
    label: "Footer",
    icon: Rows4,
    category: "structural",
    component: FooterBlock,
    defaultProps: {
      brandName: "Omugwo Academy",
      variant: "dark",
    },
    propSchema: footerBlockSchema,
  },
};

// Grouped blocks for sidebar display
export const BLOCK_CATEGORIES = [
  { id: "hero", label: "Hero Sections", blocks: ["hero", "hero_split"] },
  { id: "course", label: "Course Blocks", blocks: ["course_grid", "pricing_table", "pricing", "interactive_course_hero", "interactive_course_features", "interactive_course_modules", "cinematic_course_hero", "cinematic_course_body", "minimalist_course_hero", "minimalist_course_philosophy", "minimalist_course_curriculum", "luxury_course_hero", "luxury_course_experience", "luxury_course_curriculum", "luxury_course_investment", "interactive_course_page", "cinematic_course_page", "minimalist_course_page", "luxury_course_page"] },
  { id: "webinar", label: "Webinar Blocks", blocks: ["webinar_registration", "webinar_grid"] },
  { id: "community", label: "Community", blocks: ["community_discussions"] },
  { id: "social_proof", label: "Social Proof", blocks: ["testimonials", "logo_cloud"] },
  { id: "marketing", label: "Marketing", blocks: ["features", "cta", "faq", "stats", "newsletter", "content", "blog_posts", "team", "video", "countdown", "gallery", "campaign_story"] },
  { id: "structural", label: "Structure", blocks: ["navigation", "footer", "contact", "contact_form", "contact_info"] },
];
