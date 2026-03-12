// Template Preview Generation System
// Generates accurate thumbnail previews for templates

import { Block, Template, GlobalStyles } from "./types";
import { BLOCK_DEFINITIONS } from "./registry";

// Default global styles for preview generation
const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  primaryColor: "#7c3aed",
  secondaryColor: "#ec4899",
  accentColor: "#f59e0b",
  backgroundColor: "#ffffff",
  textColor: "#111827",
  fontFamily: "Inter, sans-serif",
  headingFont: "Inter, sans-serif",
  borderRadius: "lg",
  buttonStyle: "rounded",
};

// Template preview configuration
export interface TemplatePreviewConfig {
  width: number;
  height: number;
  scale: number;
  device: "desktop" | "tablet" | "mobile";
}

// Generate a preview configuration for a template
export const generatePreviewConfig = (
  template: Template,
  device: "desktop" | "tablet" | "mobile" = "desktop"
): TemplatePreviewConfig => {
  const configs = {
    desktop: { width: 1200, height: 630, scale: 0.5, device: "desktop" as const },
    tablet: { width: 768, height: 1024, scale: 0.4, device: "tablet" as const },
    mobile: { width: 375, height: 812, scale: 0.3, device: "mobile" as const },
  };
  return configs[device];
};

// Extract dominant colors from a template's blocks
export const extractTemplateColors = (template: Template): {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
} => {
  const colors = {
    primary: "#7c3aed",
    secondary: "#ec4899",
    accent: "#f59e0b",
    background: "#ffffff",
  };

  // Extract colors from hero block if present
  const heroBlock = template.blocks.find(
    (b) => b.type === "hero" || b.type.includes("hero")
  );
  if (heroBlock?.props) {
    if (heroBlock.props.primaryColor) colors.primary = heroBlock.props.primaryColor;
    if (heroBlock.props.secondaryColor) colors.secondary = heroBlock.props.secondaryColor;
    if (heroBlock.props.accentColor) colors.accent = heroBlock.props.accentColor;
    if (heroBlock.props.backgroundColor) colors.background = heroBlock.props.backgroundColor;
  }

  return colors;
};

// Generate a gradient thumbnail URL based on template colors
export const generateGradientThumbnail = (
  template: Template,
  width: number = 400,
  height: number = 225
): string => {
  const colors = extractTemplateColors(template);
  
  // Create a canvas-like gradient URL using CSS gradient
  // This returns a data URL or a placeholder
  const gradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`;
  
  // For actual implementation, we'd use canvas to render
  // For now, return a styled placeholder
  return `https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=${width}&h=${height}&sat=-100&hue=${extractHueFromColor(colors.primary)}`;
};

// Helper to extract hue from hex color
const extractHueFromColor = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return Math.round(h * 360);
};

// Template preview metadata
export interface TemplatePreviewMeta {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  thumbnailGenerated: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  blockCount: number;
  hasHero: boolean;
  hasVideo: boolean;
  hasTestimonials: boolean;
  hasPricing: boolean;
  estimatedLoadTime: "fast" | "medium" | "slow";
}

// Generate preview metadata for a template
export const generateTemplatePreviewMeta = (
  template: Template
): TemplatePreviewMeta => {
  const colors = extractTemplateColors(template);
  const blockTypes = template.blocks.map((b) => b.type);
  
  // Estimate load time based on block types
  const hasMedia = blockTypes.some((t) =>
    ["video", "image", "gallery"].includes(t)
  );
  const blockCount = template.blocks.length;
  let estimatedLoadTime: "fast" | "medium" | "slow" = "fast";
  if (blockCount > 10 || hasMedia) estimatedLoadTime = "medium";
  if (blockCount > 20) estimatedLoadTime = "slow";

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    thumbnail: template.thumbnail || generateGradientThumbnail(template),
    thumbnailGenerated: !template.thumbnail,
    colors,
    blockCount,
    hasHero: blockTypes.some((t) => t.includes("hero")),
    hasVideo: blockTypes.includes("video"),
    hasTestimonials: blockTypes.includes("testimonials"),
    hasPricing: blockTypes.includes("pricing") || blockTypes.includes("pricing_table"),
    estimatedLoadTime,
  };
};

// Template preview renderer component props
export interface TemplatePreviewRendererProps {
  template: Template;
  width: number;
  height: number;
  scale: number;
  showOverlay?: boolean;
}

// CSS styles for template preview thumbnails
export const TEMPLATE_PREVIEW_STYLES = {
  container: {
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  gradient: {
    position: "absolute" as const,
    inset: 0,
    opacity: 0.1,
  },
  content: {
    position: "relative" as const,
    zIndex: 1,
  },
};

// Generate all template preview metadata
export const generateAllPreviewMeta = (
  templates: Template[]
): TemplatePreviewMeta[] => {
  return templates.map(generateTemplatePreviewMeta);
};

// Update template with generated thumbnail
export const updateTemplateThumbnail = (
  template: Template,
  thumbnailUrl: string
): Template => {
  return {
    ...template,
    thumbnail: thumbnailUrl,
  };
};

// Preview thumbnail sizes for different contexts
export const THUMBNAIL_SIZES = {
  small: { width: 200, height: 112 },
  medium: { width: 400, height: 225 },
  large: { width: 800, height: 450 },
  social: { width: 1200, height: 630 },
};

// Get thumbnail URL with size
export const getThumbnailUrl = (
  template: Template,
  size: keyof typeof THUMBNAIL_SIZES = "medium"
): string => {
  const { width, height } = THUMBNAIL_SIZES[size];
  
  if (template.thumbnail) {
    // If it's an Unsplash URL, adjust the size
    if (template.thumbnail.includes("unsplash.com")) {
      return template.thumbnail.replace(
        /w=\d+&h=\d+/,
        `w=${width}&h=${height}`
      );
    }
    return template.thumbnail;
  }
  
  return generateGradientThumbnail(template, width, height);
};

// Export default configuration
export default {
  generatePreviewConfig,
  extractTemplateColors,
  generateGradientThumbnail,
  generateTemplatePreviewMeta,
  generateAllPreviewMeta,
  updateTemplateThumbnail,
  getThumbnailUrl,
  THUMBNAIL_SIZES,
  DEFAULT_GLOBAL_STYLES,
};
