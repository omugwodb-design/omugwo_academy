import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const logoCloudBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Grid", value: "grid" },
    { label: "Inline Strip", value: "strip" },
    { label: "With Title", value: "titled" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "logos", label: "Logos", type: "array", arrayItemSchema: [
    { name: "name", label: "Name", type: "text" },
    { name: "image", label: "Logo URL", type: "image" },
    { name: "href", label: "Link", type: "text" },
  ], group: "Content" },
  { name: "grayscale", label: "Grayscale", type: "boolean", group: "Style" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

export const LogoCloudBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    variant = "grid",
    title = "Trusted by leading organizations",
    logos = [
      { name: "Partner 1", image: "https://via.placeholder.com/200x80?text=Partner+1", href: "#" },
      { name: "Partner 2", image: "https://via.placeholder.com/200x80?text=Partner+2", href: "#" },
      { name: "Partner 3", image: "https://via.placeholder.com/200x80?text=Partner+3", href: "#" },
      { name: "Partner 4", image: "https://via.placeholder.com/200x80?text=Partner+4", href: "#" },
      { name: "Partner 5", image: "https://via.placeholder.com/200x80?text=Partner+5", href: "#" },
    ],
    grayscale = true,
    backgroundColor,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const imgClass = cn(
    "h-10 md:h-12 w-auto object-contain transition-all",
    grayscale ? "grayscale opacity-50 hover:grayscale-0 hover:opacity-100" : ""
  );

  if (variant === "strip") {
    return (
      <section className={cn("py-8 px-6 border-y border-gray-100")} style={{ backgroundColor: backgroundColor || undefined }}>
        <AnimationWrapper animation={animConfig}>
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-10 flex-wrap">
            {logos.map((logo: any, idx: number) => (
              <a key={idx} href={logo.href || "#"} onClick={(e) => e.preventDefault()}>
                <img src={logo.image} alt={logo.name} className={imgClass} />
              </a>
            ))}
          </div>
        </AnimationWrapper>
      </section>
    );
  }

  if (variant === "titled") {
    return (
      <section className={cn("py-16 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="max-w-7xl mx-auto">
          <AnimationWrapper animation={animConfig} className="text-center mb-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</p>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }}>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {logos.map((logo: any, idx: number) => (
                <a key={idx} href={logo.href || "#"} onClick={(e) => e.preventDefault()}>
                  <img src={logo.image} alt={logo.name} className={imgClass} />
                </a>
              ))}
            </div>
          </AnimationWrapper>
        </div>
      </section>
    );
  }

  // Default: grid
  return (
    <section className={cn("py-16 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        {title && (
          <AnimationWrapper animation={animConfig} className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-2" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
          </AnimationWrapper>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {logos.map((logo: any, idx: number) => (
            <AnimationWrapper key={idx} animation={animConfig} index={idx}>
              <a href={logo.href || "#"} onClick={(e) => e.preventDefault()}>
                <img src={logo.image} alt={logo.name} className={imgClass} />
              </a>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
