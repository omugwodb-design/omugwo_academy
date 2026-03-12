import {
  Sparkles, SplitSquareHorizontal, LayoutGrid, Quote, MessageCircleHeart,
  Zap, CircleHelp, BarChart3, MailPlus, BadgeDollarSign, ToggleRight,
  BookOpen, Video, Calendar, Users, Award, Target, Timer,
  PanelTopDashed, Rows4, Phone, MapPinned, GitBranch, Database,
  GalleryHorizontalEnd, UsersRound, FileText, Megaphone, Play, Gem, FlaskConical, Code2, Layers, Globe, Leaf, TrendingUp, Gift
} from "lucide-react";
import { BlockDefinition, PropSchema } from "./types";

// --- UNIVERSAL SCHEMAS ---
const universalSchema: PropSchema[] = [
  // LAYOUT
  { name: "padding", label: "Padding", type: "padding", group: "Layout" },
  { name: "margin", label: "Margin", type: "margin", group: "Layout" },
  {
    name: "maxWidth", label: "Max Width", type: "select", group: "Layout", options: [
      { label: "Small (640px)", value: "max-w-screen-sm" },
      { label: "Medium (768px)", value: "max-w-screen-md" },
      { label: "Large (1024px)", value: "max-w-screen-lg" },
      { label: "XL (1280px)", value: "max-w-screen-xl" },
      { label: "Full Width", value: "max-w-full" },
    ], default: "max-w-screen-xl"
  },

  // STYLE
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Style" },
  { name: "borderRadius", label: "Corner Radius", type: "border_radius", group: "Style" },
  { name: "shadow", label: "Drop Shadow", type: "shadow", group: "Style" },
  { name: "borderWidth", label: "Border Width", type: "number", group: "Style", min: 0, max: 20, default: 0 },
  { name: "borderColor", label: "Border Color", type: "color", group: "Style" },

  // ANIMATION
  {
    name: "animation", label: "Entrance Animation", type: "select", group: "Animation", options: [
      { label: "None", value: "none" },
      { label: "Fade In", value: "fadeIn" },
      { label: "Slide Up", value: "slideUp" },
      { label: "Scale Up", value: "scaleUp" },
      { label: "Float", value: "float" },
    ], default: "fadeIn"
  },

  // ADVANCED
  { name: "customCss", label: "Custom CSS", type: "textarea", group: "Advanced" },
  { name: "anchorId", label: "Section Anchor ID", type: "text", group: "Advanced" },
];

const universalDefaultProps = {
  padding: { top: 80, bottom: 80, left: 24, right: 24, linked: false },
  margin: { top: 0, bottom: 0, left: 0, right: 0, linked: true },
  maxWidth: "max-w-screen-xl",
  backgroundColor: "transparent",
  borderRadius: { borderRadius: 0 },
  animation: "fadeIn",
};

/**
 * Helper to wrap block definitions with universal props
 */
const withUniversal = (def: Omit<BlockDefinition, "propSchema" | "defaultProps"> & { propSchema: PropSchema[], defaultProps: Record<string, any> }): BlockDefinition => {
  return {
    ...def,
    defaultProps: { ...universalDefaultProps, ...def.defaultProps },
    propSchema: [...def.propSchema, ...universalSchema],
  };
};

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
import { UdemyHeroBlock, udemyHeroBlockSchema } from "./blocks/udemy-hero-block";
import { CourseraHeroBlock, courseraHeroBlockSchema } from "./blocks/coursera-hero-block";
import { MasterclassHeroBlock, masterclassHeroBlockSchema } from "./blocks/masterclass-hero-block";
import { LinkedinHeroBlock, linkedinHeroBlockSchema } from "./blocks/linkedin-hero-block";
import { TeachableHeroBlock, teachableHeroBlockSchema } from "./blocks/teachable-hero-block";
import { ThinkificHeroBlock, thinkificHeroBlockSchema } from "./blocks/thinkific-hero-block";
import { PlayfulHeroBlock, playfulHeroBlockSchema, PlayfulFeaturesBlock, playfulFeaturesBlockSchema, PlayfulCtaBlock, playfulCtaBlockSchema } from "./blocks/playful-course-blocks";
import { ScientificHeroBlock, scientificHeroBlockSchema, ScientificStatsBlock, scientificStatsBlockSchema, ScientificContentBlock, scientificContentBlockSchema, ScientificCtaBlock, scientificCtaBlockSchema } from "./blocks/scientific-course-blocks";
import { TechHeroBlock, techHeroBlockSchema, TechFeaturesBlock, techFeaturesBlockSchema, TechCtaBlock, techCtaBlockSchema } from "./blocks/tech-course-blocks";
import { CulturalHeroBlock, culturalHeroBlockSchema, CulturalFeaturesBlock, culturalFeaturesBlockSchema, CulturalCtaBlock, culturalCtaBlockSchema } from "./blocks/cultural-course-blocks";
import { SalesHeroBlock, salesHeroBlockSchema, SalesBenefitsBlock, salesBenefitsBlockSchema, SalesCtaBlock, salesCtaBlockSchema } from "./blocks/sales-course-blocks";

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  //  Hero Blocks 
  hero: withUniversal({
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
  }),
  hero_split: withUniversal({
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
  }),

  //  Marketing Blocks 
  features: withUniversal({
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
  }),
  testimonials: withUniversal({
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
  }),
  cta: withUniversal({
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
  }),
  faq: withUniversal({
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
  }),
  stats: withUniversal({
    type: "stats",
    label: "Stats Counter",
    icon: BarChart3,
    category: "marketing",
    component: StatsBlock,
    defaultProps: { variant: "light" },
    propSchema: statsBlockSchema,
  }),
  newsletter: withUniversal({
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
  }),
  campaign_story: withUniversal({
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
  }),
  content: withUniversal({
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
  }),

  //  Course Blocks 
  course_curriculum: withUniversal({
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
  }),
  course_overview: withUniversal({
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
  }),
  course_grid: withUniversal({
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
  }),
  pricing_table: withUniversal({
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
  }),

  pricing: withUniversal({
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
  }),

  //  Showcase Course Layout Blocks (Exact Replicas) 
  interactive_course_hero: withUniversal({
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
  }),
  cinematic_course_hero: withUniversal({
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
  }),
  minimalist_course_hero: withUniversal({
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
  }),
  luxury_course_hero: withUniversal({
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
  }),
  interactive_course_features: withUniversal({
    type: "interactive_course_features",
    label: "Interactive Course Features",
    icon: LayoutGrid,
    category: "course",
    component: InteractiveCourseFeaturesBlock,
    defaultProps: {},
    propSchema: interactiveCourseFeaturesBlockSchema,
  }),
  interactive_course_modules: withUniversal({
    type: "interactive_course_modules",
    label: "Interactive Course Modules",
    icon: LayoutGrid,
    category: "course",
    component: InteractiveCourseModulesBlock,
    defaultProps: {},
    propSchema: interactiveCourseModulesBlockSchema,
  }),
  cinematic_course_body: withUniversal({
    type: "cinematic_course_body",
    label: "Cinematic Course Body",
    icon: Play,
    category: "course",
    component: CinematicCourseBodyBlock,
    defaultProps: {},
    propSchema: cinematicCourseBodyBlockSchema,
  }),
  minimalist_course_philosophy: withUniversal({
    type: "minimalist_course_philosophy",
    label: "Minimalist Course Philosophy",
    icon: FileText,
    category: "course",
    component: MinimalistCoursePhilosophyBlock,
    defaultProps: {},
    propSchema: minimalistCoursePhilosophyBlockSchema,
  }),
  minimalist_course_curriculum: withUniversal({
    type: "minimalist_course_curriculum",
    label: "Minimalist Course Curriculum",
    icon: BookOpen,
    category: "course",
    component: MinimalistCourseCurriculumBlock,
    defaultProps: {},
    propSchema: minimalistCourseCurriculumBlockSchema,
  }),
  luxury_course_experience: withUniversal({
    type: "luxury_course_experience",
    label: "Luxury Course Experience",
    icon: Gem,
    category: "course",
    component: LuxuryCourseExperienceBlock,
    defaultProps: {},
    propSchema: luxuryCourseExperienceBlockSchema,
  }),
  luxury_course_curriculum: withUniversal({
    type: "luxury_course_curriculum",
    label: "Luxury Course Curriculum",
    icon: BookOpen,
    category: "course",
    component: LuxuryCourseCurriculumBlock,
    defaultProps: {},
    propSchema: luxuryCourseCurriculumBlockSchema,
  }),
  luxury_course_investment: withUniversal({
    type: "luxury_course_investment",
    label: "Luxury Course Investment",
    icon: BadgeDollarSign,
    category: "course",
    component: LuxuryCourseInvestmentBlock,
    defaultProps: {},
    propSchema: luxuryCourseInvestmentBlockSchema,
  }),
  interactive_course_page: withUniversal({
    type: "interactive_course_page",
    label: "Interactive Course Page (Exact)",
    icon: Sparkles,
    category: "course",
    component: InteractiveCoursePageBlock,
    defaultProps: {},
    propSchema: interactiveCoursePageBlockSchema,
  }),
  cinematic_course_page: withUniversal({
    type: "cinematic_course_page",
    label: "Cinematic Course Page (Exact)",
    icon: Play,
    category: "course",
    component: CinematicCoursePageBlock,
    defaultProps: {},
    propSchema: cinematicCoursePageBlockSchema,
  }),
  minimalist_course_page: withUniversal({
    type: "minimalist_course_page",
    label: "Minimalist Course Page (Exact)",
    icon: FileText,
    category: "course",
    component: MinimalistCoursePageBlock,
    defaultProps: {},
    propSchema: minimalistCoursePageBlockSchema,
  }),
  luxury_course_page: withUniversal({
    type: "luxury_course_page",
    label: "Luxury Course Page (Exact)",
    icon: Award,
    category: "course",
    component: LuxuryCoursePageBlock,
    defaultProps: {},
    propSchema: luxuryCoursePageBlockSchema,
  }),

  //  Platform-Specific Course Blocks 
  udemy_hero: withUniversal({
    type: "udemy_hero",
    label: "Udemy-Style Hero",
    icon: Sparkles,
    category: "course",
    component: UdemyHeroBlock,
    defaultProps: {
      title: "The Complete Postpartum Recovery Masterclass",
      price: "₦49,000",
      originalPrice: "₦129,000",
      discountPercent: 62,
    },
    propSchema: udemyHeroBlockSchema,
  }),
  coursera_hero: withUniversal({
    type: "coursera_hero",
    label: "Coursera-Style Hero",
    icon: Award,
    category: "course",
    component: CourseraHeroBlock,
    defaultProps: {
      title: "Postpartum Recovery Specialization",
      badgeText: "PROFESSIONAL CERTIFICATE",
    },
    propSchema: courseraHeroBlockSchema,
  }),
  masterclass_hero: withUniversal({
    type: "masterclass_hero",
    label: "MasterClass-Style Hero",
    icon: Play,
    category: "course",
    component: MasterclassHeroBlock,
    defaultProps: {
      title: "Dr. Megor Teaches Postpartum Recovery",
    },
    propSchema: masterclassHeroBlockSchema,
  }),
  linkedin_hero: withUniversal({
    type: "linkedin_hero",
    label: "LinkedIn Learning Hero",
    icon: Users,
    category: "course",
    component: LinkedinHeroBlock,
    defaultProps: {
      title: "Essential Postnatal Care Skills",
    },
    propSchema: linkedinHeroBlockSchema,
  }),
  teachable_hero: withUniversal({
    type: "teachable_hero",
    label: "Teachable-Style Hero",
    icon: FileText,
    category: "course",
    component: TeachableHeroBlock,
    defaultProps: {
      title: "The Postnatal Masterclass",
    },
    propSchema: teachableHeroBlockSchema,
  }),
  thinkific_hero: withUniversal({
    type: "thinkific_hero",
    label: "Thinkific-Style Hero",
    icon: BookOpen,
    category: "course",
    component: ThinkificHeroBlock,
    defaultProps: {
      title: "The Postpartum Masterclass",
    },
    propSchema: thinkificHeroBlockSchema,
  }),

  //  Webinar Blocks 
  webinar_registration: withUniversal({
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
  }),
  webinar_grid: withUniversal({
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
  }),

  //  Community Blocks 
  community_discussions: withUniversal({
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
  }),

  blog_posts: withUniversal({
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
  }),

  //  New Essential Blocks 
  team: withUniversal({
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
  }),
  video: withUniversal({
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
  }),
  countdown: withUniversal({
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
  }),
  logo_cloud: withUniversal({
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
  }),
  gallery: withUniversal({
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
  }),
  contact: withUniversal({
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
  }),
  contact_form: withUniversal({
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
  }),
  contact_info: withUniversal({
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
  }),

  //  Playful Course Blocks 
  playful_hero: withUniversal({
    type: "playful_hero",
    label: "Playful Hero",
    icon: Sparkles,
    category: "course",
    component: PlayfulHeroBlock,
    defaultProps: {
      title: "Welcome to Your Postpartum Reset",
      titleHighlight: "Postpartum",
      subtitle: "A warm, friendly, culturally grounded roadmap that feels like a supportive village.",
      ctaText: "Enroll Now",
      ctaLink: "/checkout",
      secondaryCtaText: "View Curriculum",
      secondaryCtaLink: "#curriculum",
      badgeText: "Fun & Friendly",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      primaryColor: "#22d3ee",
      secondaryColor: "#a855f7",
      accentColor: "#facc15",
      textAlign: "center",
      paddingY: "py-24",
      containerSize: "max-w-7xl",
    },
    propSchema: playfulHeroBlockSchema,
  }),
  playful_features: {
    type: "playful_features",
    label: "Playful Features",
    icon: Zap,
    category: "course",
    component: PlayfulFeaturesBlock,
    defaultProps: {
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
    propSchema: playfulFeaturesBlockSchema,
  },
  playful_cta: {
    type: "playful_cta",
    label: "Playful CTA",
    icon: Target,
    category: "course",
    component: PlayfulCtaBlock,
    defaultProps: {
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
    propSchema: playfulCtaBlockSchema,
  },

  //  Scientific Course Blocks 
  scientific_hero: {
    type: "scientific_hero",
    label: "Scientific Hero",
    icon: FlaskConical,
    category: "course",
    component: ScientificHeroBlock,
    defaultProps: {
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
    propSchema: scientificHeroBlockSchema,
  },
  scientific_stats: {
    type: "scientific_stats",
    label: "Scientific Stats",
    icon: BarChart3,
    category: "course",
    component: ScientificStatsBlock,
    defaultProps: {
      stats: [
        { value: "4.9", label: "Avg. Rating" },
        { value: "8,432", label: "Students" },
        { value: "12h", label: "Duration" },
        { value: "48", label: "Lessons" },
      ],
      primaryColor: "#0ea5e9",
      backgroundColor: "#0b1220",
      paddingY: "py-12",
      containerSize: "max-w-7xl",
    },
    propSchema: scientificStatsBlockSchema,
  },
  scientific_content: {
    type: "scientific_content",
    label: "Scientific Content",
    icon: FileText,
    category: "course",
    component: ScientificContentBlock,
    defaultProps: {
      badgeText: "Clinical Summary",
      title: "What you'll learn",
      body: "Complete guide for new mothers covering recovery, nutrition, and baby care basics.",
      image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=1200",
      imagePosition: "right",
      primaryColor: "#0ea5e9",
      accentColor: "#10b981",
      backgroundColor: "#ffffff",
      textAlign: "left",
      paddingY: "py-24",
      containerSize: "max-w-7xl",
    },
    propSchema: scientificContentBlockSchema,
  },
  scientific_cta: {
    type: "scientific_cta",
    label: "Scientific CTA",
    icon: Target,
    category: "course",
    component: ScientificCtaBlock,
    defaultProps: {
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
    propSchema: scientificCtaBlockSchema,
  },

  //  Tech Course Blocks 
  tech_hero: {
    type: "tech_hero",
    label: "Tech Hero",
    icon: Code2,
    category: "course",
    component: TechHeroBlock,
    defaultProps: {
      title: "A Modern Postpartum System",
      titleHighlight: "Modern",
      subtitle: "A complete, culturally grounded and medically sound roadmap to help you recover, feel supported, and enjoy motherhood.",
      ctaText: "Get Access",
      ctaLink: "/checkout",
      price: "₦49,000",
      priceSubtext: "One-time payment",
      badgeText: "New Cohort Open",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      instructorName: "Dr. Megor",
      instructorRole: "Lead Instructor",
      stat1Label: "Duration",
      stat1Value: "12 Hours",
      stat2Label: "Lessons",
      stat2Value: "48",
      primaryColor: "#8b5cf6",
      secondaryColor: "#06b6d4",
      backgroundColor: "#0f0f23",
      textAlign: "left",
      paddingY: "py-24",
      containerSize: "max-w-7xl",
    },
    propSchema: techHeroBlockSchema,
  },
  tech_features: {
    type: "tech_features",
    label: "Tech Features",
    icon: Layers,
    category: "course",
    component: TechFeaturesBlock,
    defaultProps: {
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
    propSchema: techFeaturesBlockSchema,
  },
  tech_cta: {
    type: "tech_cta",
    label: "Tech CTA",
    icon: Target,
    category: "course",
    component: TechCtaBlock,
    defaultProps: {
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
    propSchema: techCtaBlockSchema,
  },

  //  Cultural Course Blocks 
  cultural_hero: {
    type: "cultural_hero",
    label: "Cultural Hero",
    icon: Globe,
    category: "course",
    component: CulturalHeroBlock,
    defaultProps: {
      title: "Rooted in Tradition, Guided by Care",
      titleHighlight: "Tradition",
      subtitle: "A culturally grounded postpartum journey that honors heritage while embracing modern wellness.",
      ctaText: "Begin Your Journey",
      ctaLink: "/checkout",
      secondaryCtaText: "Learn More",
      secondaryCtaLink: "#about",
      badgeText: "African Heritage",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      primaryColor: "#b45309",
      secondaryColor: "#92400e",
      accentColor: "#f59e0b",
      backgroundColor: "#fef3c7",
      textAlign: "center",
      paddingY: "py-24",
      containerSize: "max-w-7xl",
    },
    propSchema: culturalHeroBlockSchema,
  },
  cultural_features: {
    type: "cultural_features",
    label: "Cultural Features",
    icon: Leaf,
    category: "course",
    component: CulturalFeaturesBlock,
    defaultProps: {
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
    propSchema: culturalFeaturesBlockSchema,
  },
  cultural_cta: {
    type: "cultural_cta",
    label: "Cultural CTA",
    icon: Target,
    category: "course",
    component: CulturalCtaBlock,
    defaultProps: {
      title: "Join Our Community of Care",
      subtitle: "Begin your culturally-rooted postpartum journey today.",
      ctaText: "Start Your Journey",
      ctaLink: "/checkout",
      primaryColor: "#b45309",
      secondaryColor: "#92400e",
      accentColor: "#f59e0b",
      backgroundColor: "#fef3c7",
      textAlign: "center",
      paddingY: "py-24",
      containerSize: "max-w-4xl",
    },
    propSchema: culturalCtaBlockSchema,
  },

  //  Sales Course Blocks 
  sales_hero: {
    type: "sales_hero",
    label: "Sales Hero",
    icon: TrendingUp,
    category: "course",
    component: SalesHeroBlock,
    defaultProps: {
      title: "Enroll in the Postpartum Masterclass",
      titleHighlight: "Enroll",
      subtitle: "Limited-time pricing. Start today and feel supported through every step.",
      ctaText: "Enroll Now",
      ctaLink: "/checkout",
      price: "₦49,000",
      originalPrice: "₦75,000",
      urgencyText: "Limited Time Offer",
      urgencyIcon: "flame",
      heroImage: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      primaryColor: "#dc2626",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textAlign: "center",
      paddingY: "py-24",
      containerSize: "max-w-7xl",
    },
    propSchema: salesHeroBlockSchema,
  },
  sales_benefits: {
    type: "sales_benefits",
    label: "Sales Benefits",
    icon: Gift,
    category: "course",
    component: SalesBenefitsBlock,
    defaultProps: {
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
    propSchema: salesBenefitsBlockSchema,
  },
  sales_cta: {
    type: "sales_cta",
    label: "Sales CTA",
    icon: Target,
    category: "course",
    component: SalesCtaBlock,
    defaultProps: {
      title: "Don't Wait - Start Your Recovery Today",
      subtitle: "Join thousands of mothers who have transformed their postpartum experience.",
      ctaText: "Enroll Now",
      ctaLink: "/checkout",
      price: "₦49,000",
      originalPrice: "₦75,000",
      urgencyText: "Price increases soon",
      primaryColor: "#dc2626",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textAlign: "center",
      paddingY: "py-24",
      containerSize: "max-w-4xl",
    },
    propSchema: salesCtaBlockSchema,
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
  { id: "course", label: "Course Blocks", blocks: ["course_grid", "pricing_table", "pricing", "interactive_course_hero", "interactive_course_features", "interactive_course_modules", "cinematic_course_hero", "cinematic_course_body", "minimalist_course_hero", "minimalist_course_philosophy", "minimalist_course_curriculum", "luxury_course_hero", "luxury_course_experience", "luxury_course_curriculum", "luxury_course_investment", "interactive_course_page", "cinematic_course_page", "minimalist_course_page", "luxury_course_page", "playful_hero", "playful_features", "playful_cta", "scientific_hero", "scientific_stats", "scientific_content", "scientific_cta", "tech_hero", "tech_features", "tech_cta", "cultural_hero", "cultural_features", "cultural_cta", "sales_hero", "sales_benefits", "sales_cta"] },
  { id: "webinar", label: "Webinar Blocks", blocks: ["webinar_registration", "webinar_grid"] },
  { id: "community", label: "Community", blocks: ["community_discussions"] },
  { id: "social_proof", label: "Social Proof", blocks: ["testimonials", "logo_cloud"] },
  { id: "marketing", label: "Marketing", blocks: ["features", "cta", "faq", "stats", "newsletter", "content", "blog_posts", "team", "video", "countdown", "gallery", "campaign_story"] },
  { id: "structural", label: "Structure", blocks: ["navigation", "footer", "contact", "contact_form", "contact_info"] },
];

// Get blocks by category
export const getBlocksByCategory = (categoryId: string): BlockDefinition[] => {
  const category = BLOCK_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];

  return category.blocks
    .map(blockType => BLOCK_DEFINITIONS[blockType])
    .filter((block): block is BlockDefinition => block !== undefined);
};

// Get all block definitions as array
export const getAllBlockDefinitions = (): BlockDefinition[] => {
  return Object.values(BLOCK_DEFINITIONS);
};
