import { LucideIcon } from "lucide-react";

//  Block Types 
export type BlockType =
  // Layout
  | "hero"
  | "hero_split"
  | "hero_video"
  | "hero_form"
  // Social Proof
  | "testimonials"
  | "testimonial_carousel"
  | "star_ratings"
  | "video_testimonials"
  // Course Blocks
  | "course_grid"
  | "course_curriculum"
  | "course_overview"
  | "pricing"
  | "pricing_table"
  | "instructor_bio"
  | "countdown"
  | "enrollment_cta"
  | "progress_preview"
  // Showcase Course Layouts (exact replicas)
  | "interactive_course_hero"
  | "cinematic_course_hero"
  | "minimalist_course_hero"
  | "luxury_course_hero"
  | "interactive_course_features"
  | "interactive_course_modules"
  | "cinematic_course_body"
  | "minimalist_course_philosophy"
  | "minimalist_course_curriculum"
  | "luxury_course_experience"
  | "luxury_course_curriculum"
  | "luxury_course_investment"
  | "interactive_course_page"
  | "cinematic_course_page"
  | "minimalist_course_page"
  | "luxury_course_page"
  // Webinar Blocks
  | "webinar_registration"
  | "webinar_countdown"
  | "webinar_speakers"
  | "webinar_agenda"
  | "webinar_offer"
  | "webinar_replay"
  // Community Blocks
  | "community_discussions"
  | "community_leaderboard"
  | "community_spotlight"
  | "community_events"
  // Marketing Blocks
  | "features"
  | "faq"
  | "comparison"
  | "stats"
  | "logo_cloud"
  | "newsletter"
  | "cta"
  | "content"
  | "campaign_story"
  | "video"
  | "gallery"
  | "team"
  | "timeline"
  | "tabs"
  | "pricing_toggle"
  | "bento_grid"
  // Structural
  | "navigation"
  | "footer"
  | "contact"
  | "contact_form"
  | "contact_info"
  | "map"
  // Grid Blocks
  | "webinar_grid"
  // CMS Dynamic
  | "dynamic_courses"
  | "dynamic_testimonials"
  | "dynamic_blog"
  | "dynamic_webinars"
  | "dynamic_community"
  | "dynamic_user_count";

//  Block Definition 
export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  label?: string;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: LucideIcon;
  category: BlockCategory;
  defaultProps: Record<string, any>;
  component: React.ComponentType<BlockComponentProps>;
  propSchema: PropSchema[];
}

export interface BlockComponentProps {
  block: Block;
  onChange: (id: string, props: any) => void;
  selected: boolean;
}

export type BlockCategory =
  | "hero"
  | "social_proof"
  | "course"
  | "webinar"
  | "community"
  | "marketing"
  | "structural"
  | "dynamic";

//  Property Schema 
export interface PropSchema {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "color"
    | "gradient"
    | "image"
    | "video"
    | "icon"
    | "boolean"
    | "select"
    | "number"
    | "array"
    | "padding"
    | "margin"
    | "border_radius"
    | "shadow"
    | "animation"
    | "css";
  options?: { label: string; value: string }[];
  arrayItemSchema?: PropSchema[];
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  group?: string;
}

//  Global Styles / Theme 
export interface GlobalStyles {
  fontFamily: string;
  headingFont: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  [key: string]: any;
}

//  Page System 
export type PageStatus = "DRAFT" | "PUBLISHED";

export type PageType =
  | "homepage"
  | "course_sales"
  | "webinar_registration"
  | "webinar_replay"
  | "lead_magnet"
  | "community_landing"
  | "blog"
  | "about"
  | "courses"
  | "community"
  | "webinars"
  | "contact"
  | "podcast"
  | "consultation"
  | "thank_you"
  | "checkout"
  | "404"
  | "login"
  | "register"
  | "forgot_password"
  | "custom";

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  sortOrder: number;
  status: PageStatus;
  draftBlocks: Block[];
  publishedBlocks: Block[];
  version: number;
  isHomePage?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  blocks: Block[];
  createdAt: string;
  createdBy: string;
  label?: string;
}

//  Site Configuration 
export interface SiteConfig {
  id: string;
  name: string;
  pages: SitePage[];
  globalStyles: GlobalStyles;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

//  Template System 
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  pageType: PageType;
  blocks: Block[];
  tags: string[];
}

export type TemplateCategory =
  | "course_sales"
  | "webinar"
  | "webinars"
  | "lead_magnet"
  | "community"
  | "content"
  | "landing"
  | "about"
  | "auth"
  | "courses"
  | "contact"
  | "blank";

//  Permissions 
export type BuilderRole =
  | "super_admin"
  | "marketing_admin"
  | "content_editor"
  | "designer";

export interface BuilderPermissions {
  canEditBlocks: boolean;
  canPublish: boolean;
  canManageTemplates: boolean;
  canManagePages: boolean;
  canEditGlobalStyles: boolean;
  canAccessCustomCSS: boolean;
}

export const ROLE_PERMISSIONS: Record<BuilderRole, BuilderPermissions> = {
  super_admin: {
    canEditBlocks: true,
    canPublish: true,
    canManageTemplates: true,
    canManagePages: true,
    canEditGlobalStyles: true,
    canAccessCustomCSS: true,
  },
  marketing_admin: {
    canEditBlocks: true,
    canPublish: true,
    canManageTemplates: true,
    canManagePages: true,
    canEditGlobalStyles: false,
    canAccessCustomCSS: false,
  },
  content_editor: {
    canEditBlocks: true,
    canPublish: false,
    canManageTemplates: false,
    canManagePages: false,
    canEditGlobalStyles: false,
    canAccessCustomCSS: false,
  },
  designer: {
    canEditBlocks: true,
    canPublish: false,
    canManageTemplates: true,
    canManagePages: false,
    canEditGlobalStyles: true,
    canAccessCustomCSS: true,
  },
};
