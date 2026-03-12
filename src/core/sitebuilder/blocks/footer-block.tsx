import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Heart, Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { BrandLogo } from "../../../components/branding/BrandLogo";

export const footerBlockSchema: PropSchema[] = [
  { name: "brandName", label: "Brand Name", type: "text", group: "Content" },
  { name: "description", label: "Description", type: "textarea", group: "Content" },
  {
    name: "socialLinks", label: "Social Links", type: "array", arrayItemSchema: [
      { name: "platform", label: "Platform (facebook, twitter, instagram, youtube)", type: "text" },
      { name: "href", label: "Link", type: "text" },
    ], group: "Content"
  },
  { name: "col1Title", label: "Column 1 Title", type: "text", group: "Links" },
  {
    name: "col1Links", label: "Column 1 Links", type: "array", arrayItemSchema: [
      { name: "label", label: "Label", type: "text" }, { name: "href", label: "Link", type: "text" },
    ], group: "Links"
  },
  { name: "col2Title", label: "Column 2 Title", type: "text", group: "Links" },
  {
    name: "col2Links", label: "Column 2 Links", type: "array", arrayItemSchema: [
      { name: "label", label: "Label", type: "text" }, { name: "href", label: "Link", type: "text" },
    ], group: "Links"
  },
  { name: "col3Title", label: "Column 3 Title", type: "text", group: "Links" },
  {
    name: "col3Links", label: "Column 3 Links", type: "array", arrayItemSchema: [
      { name: "label", label: "Label", type: "text" }, { name: "href", label: "Link", type: "text" },
    ], group: "Links"
  },
  { name: "contactTitle", label: "Contact Title", type: "text", group: "Contact" },
  { name: "contactAddress", label: "Address", type: "text", group: "Contact" },
  { name: "contactEmail", label: "Email", type: "text", group: "Contact" },
  { name: "contactPhone", label: "Phone", type: "text", group: "Contact" },
  {
    name: "legalLinks", label: "Legal Links", type: "array", arrayItemSchema: [
      { name: "label", label: "Label", type: "text" }, { name: "href", label: "Link", type: "text" },
    ], group: "Content"
  },
  { name: "copyright", label: "Copyright", type: "text", group: "Content" },
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Dark", value: "dark" }, { label: "Light", value: "light" },
    ], group: "Style"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const FooterBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    brandName = "Omugwo Academy",
    description = "Modern postnatal education for African families. Bridging tradition and science for a healthier motherhood journey.",
    socialLinks = [
      { platform: "instagram", href: "#" },
      { platform: "twitter", href: "#" },
      { platform: "facebook", href: "#" },
      { platform: "youtube", href: "#" },
    ],
    col1Title = "Courses",
    col1Links = [
      { label: "Masterclass for Moms", href: "/courses/moms" },
      { label: "Partner Support", href: "/courses/dads" },
      { label: "Essential Course", href: "/courses/essential" },
      { label: "Free Mini-Course", href: "/courses/free" },
    ],
    col2Title = "Resources",
    col2Links = [
      { label: "Blog", href: "/blog" },
      { label: "Podcast", href: "/podcast" },
      { label: "Webinars", href: "/webinars" },
      { label: "Community", href: "/community" },
    ],
    col3Title = "Company",
    col3Links = [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    contactTitle = "Contact",
    contactAddress = "Victoria Island, Lagos, Nigeria",
    contactEmail = "hello@omugwoacademy.com",
    contactPhone = "+234 810 000 0000",
    legalLinks = [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
    copyright = `Â© ${new Date().getFullYear()} Omugwo Academy. All rights reserved.`,
    variant = "dark",
    paddingY = "py-16",
    containerSize = "max-w-7xl",
  } = block.props;

  const bg = variant === "dark" ? "bg-gray-900" : "bg-gray-50";
  const text = variant === "dark" ? "text-gray-400" : "text-gray-600";
  const heading = variant === "dark" ? "text-white" : "text-gray-900";

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <footer className={cn(paddingY, "px-6", bg)}>
      <div className={cn("mx-auto", containerSize)}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {selected ? (
                <>
                  <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className={cn("font-bold text-xl", heading)}>
                    <span
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => handleChange("brandName", e.currentTarget.textContent || "")}
                    >
                      {brandName}
                    </span>
                  </span>
                </>
              ) : (
                <BrandLogo nameClassName={cn("font-bold text-xl", heading)} />
              )}
            </div>
            <p
              className={cn("text-sm leading-relaxed mb-6", text)}
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("description", e.currentTarget.textContent || "")}
            >
              {description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social: any, idx: number) => (
                <a key={idx} href={social.href} className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all" onClick={(e) => e.preventDefault()}>
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className={cn("font-bold text-sm uppercase tracking-wider mb-4", variant === "dark" ? "text-gray-300" : "text-gray-900")}>{col1Title}</h4>
            <ul className="space-y-3">
              {col1Links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.href} className={cn("text-sm hover:text-primary-500 transition-colors", text)} onClick={(e) => e.preventDefault()}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={cn("font-bold text-sm uppercase tracking-wider mb-4", variant === "dark" ? "text-gray-300" : "text-gray-900")}>{col2Title}</h4>
            <ul className="space-y-3">
              {col2Links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.href} className={cn("text-sm hover:text-primary-500 transition-colors", text)} onClick={(e) => e.preventDefault()}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={cn("font-bold text-sm uppercase tracking-wider mb-4", variant === "dark" ? "text-gray-300" : "text-gray-900")}>{col3Title}</h4>
            <ul className="space-y-3">
              {col3Links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.href} className={cn("text-sm hover:text-primary-500 transition-colors", text)} onClick={(e) => e.preventDefault()}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={cn("font-bold text-sm uppercase tracking-wider mb-4", variant === "dark" ? "text-gray-300" : "text-gray-900")}>{contactTitle}</h4>
            <ul className="space-y-3">
              {contactAddress && (
                <li className={cn("flex items-start gap-3 text-sm", text)}>
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{contactAddress}</span>
                </li>
              )}
              {contactEmail && (
                <li>
                  <a href={`mailto:${contactEmail}`} className={cn("flex items-center gap-3 text-sm hover:text-white transition-colors", text)} onClick={(e) => e.preventDefault()}>
                    <Mail className="w-4 h-4" />
                    <span>{contactEmail}</span>
                  </a>
                </li>
              )}
              {contactPhone && (
                <li>
                  <a href={`tel:${contactPhone}`} className={cn("flex items-center gap-3 text-sm hover:text-white transition-colors", text)} onClick={(e) => e.preventDefault()}>
                    <Phone className="w-4 h-4" />
                    <span>{contactPhone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={cn("pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm", variant === "dark" ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500")}>
          <p
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("copyright", e.currentTarget.textContent || "")}
          >
            {copyright}
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link: any, idx: number) => (
              <a key={idx} href={link.href} className={cn("hover:text-white transition-colors", variant === "dark" ? "text-gray-500" : "text-gray-500 hover:text-gray-900")} onClick={(e) => e.preventDefault()}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
