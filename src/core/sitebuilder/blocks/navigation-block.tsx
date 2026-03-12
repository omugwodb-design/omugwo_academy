import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Heart, Menu } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";
import { BrandLogo } from "../../../components/branding/BrandLogo";

export const navigationBlockSchema: PropSchema[] = [
  { name: "brandName", label: "Brand Name", type: "text", group: "Content" },
  {
    name: "menuItems", label: "Menu Items", type: "array", arrayItemSchema: [
      { name: "label", label: "Label", type: "text" },
      { name: "href", label: "Link", type: "text" },
    ], group: "Content"
  },
  {
    name: "megaMenu", label: "Mega Menu Dropdown", type: "boolean", group: "Content"
  },
  { name: "ctaText", label: "CTA Button", type: "text", group: "Content" },
  { name: "ctaLink", label: "CTA Link", type: "text", group: "Content" },
  {
    name: "variant", label: "Variant", type: "select", options: [
      { label: "Light", value: "light" }, { label: "Dark", value: "dark" }, { label: "Transparent", value: "transparent" },
    ], group: "Style"
  },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const NavigationBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    brandName = "Omugwo Academy",
    menuItems = [
      { label: "Courses", href: "/courses" },
      { label: "Community", href: "/community" },
      { label: "Webinars", href: "/webinars" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ],
    megaMenu = false,
    ctaText = "Start Learning",
    ctaLink = "/courses",
    variant = "light",
    paddingY = "py-4",
    containerSize = "max-w-7xl",
  } = block.props;

  const bg = variant === "dark" ? "bg-gray-900" : variant === "transparent" ? "bg-transparent" : "bg-white";
  const textClass = variant === "dark" || variant === "transparent" ? "text-white" : "text-gray-700";

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateMenuItem = (idx: number, key: string, value: any) => {
    const newMenuItems = [...menuItems];
    newMenuItems[idx] = { ...newMenuItems[idx], [key]: value };
    handleChange("menuItems", newMenuItems);
  };

  return (
    <nav className={cn(paddingY, "px-6 border-b", bg, variant === "light" && "border-gray-100", variant !== "light" && "border-white/10")}>
      <div className={cn("mx-auto flex items-center justify-between", containerSize)}>
        <div className="flex items-center gap-2">
          {selected ? (
            <>
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className={cn("font-bold text-lg", variant === "light" ? "text-gray-900" : "text-white")}>
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
            <BrandLogo
              imageClassName="h-8 max-w-[120px]"
              iconClassName="w-8 h-8 rounded-xl"
              nameClassName={cn("font-bold text-lg", variant === "light" ? "text-gray-900" : "text-white")}
            />
          )}
        </div>
        <div className="hidden md:flex items-center gap-8 relative">
          {menuItems.map((menuItem: any, idx: number) => (
            <div key={idx} className="group relative">
              <a href={menuItem.href} className={cn("text-sm font-medium hover:text-primary-600 transition-colors py-2 flex items-center gap-1", textClass)} onClick={(e) => e.preventDefault()}>
                <span
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateMenuItem(idx, "label", e.currentTarget.textContent || "")}
                >
                  {menuItem.label}
                </span>
                {megaMenu && menuItem.label.toLowerCase() === "courses" && (
                  <svg className="w-4 h-4 ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
              
              {megaMenu && menuItem.label.toLowerCase() === "courses" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="w-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Popular Programs</p>
                      <div className="space-y-4">
                        <a href="#" className="block group/item">
                          <p className="text-sm font-bold text-gray-900 group-hover/item:text-primary-600">The Omugwo Masterclass</p>
                          <p className="text-xs text-gray-500 mt-1">Complete postnatal guide for new mothers</p>
                        </a>
                        <a href="#" className="block group/item">
                          <p className="text-sm font-bold text-gray-900 group-hover/item:text-primary-600">Partner Support Training</p>
                          <p className="text-xs text-gray-500 mt-1">Essential knowledge for fathers and partners</p>
                        </a>
                        <a href="#" className="block group/item">
                          <p className="text-sm font-bold text-gray-900 group-hover/item:text-primary-600">Essential Postnatal Care</p>
                          <p className="text-xs text-gray-500 mt-1">Core fundamentals for a healthy journey</p>
                        </a>
                      </div>
                    </div>
                    <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 flex flex-col justify-center">
                      <Heart className="w-6 h-6 text-primary-600 mb-3" />
                      <p className="text-sm font-bold text-primary-900 mb-2">Not sure where to start?</p>
                      <p className="text-xs text-primary-700 mb-4">Take our free assessment to find the perfect learning path for your needs.</p>
                      <button className="text-xs font-bold text-primary-600 bg-white px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors w-fit border border-primary-200">
                        Start Assessment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {ctaText && (
            <a href={ctaLink} className="hidden md:inline-flex px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors" onClick={(e) => e.preventDefault()}>
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
              >
                {ctaText}
              </span>
            </a>
          )}
          <button className="md:hidden p-2"><Menu className={cn("w-5 h-5", textClass)} /></button>
        </div>
      </div>
    </nav>
  );
};
