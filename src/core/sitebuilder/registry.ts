import {
  Sparkles, SplitSquareHorizontal, LayoutGrid, Quote, MessageCircleHeart,
  Zap, CircleHelp, BarChart3, MailPlus, BadgeDollarSign, ToggleRight,
  BookOpen, Video, Calendar, Users, Award, Target, Timer,
  PanelTopDashed, Rows4, Phone, MapPinned, GitBranch, Database,
  GalleryHorizontalEnd, UsersRound, FileText, Megaphone, Play
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

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  // â”€â”€â”€ Hero Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      backgroundImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=2000",
      showOverlay: true,
      overlayOpacity: 40,
      animation: "slideUp",
      paddingY: "py-24",
    },
    propSchema: heroBlockSchema,
  },

  // â”€â”€â”€ Marketing Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    },
    propSchema: contentBlockSchema,
  },

  // â”€â”€â”€ Course Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ Webinar Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ Community Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ New Essential Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ Structural Blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  { id: "course", label: "Course Blocks", blocks: ["course_grid", "pricing_table"] },
  { id: "webinar", label: "Webinar Blocks", blocks: ["webinar_registration", "webinar_grid"] },
  { id: "community", label: "Community", blocks: ["community_discussions"] },
  { id: "social_proof", label: "Social Proof", blocks: ["testimonials", "logo_cloud"] },
  { id: "marketing", label: "Marketing", blocks: ["features", "cta", "faq", "stats", "newsletter", "content", "blog_posts", "team", "video", "countdown", "gallery", "campaign_story"] },
  { id: "structural", label: "Structure", blocks: ["navigation", "footer", "contact", "contact_form", "contact_info"] },
];
