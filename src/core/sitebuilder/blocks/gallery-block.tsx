import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { X, ZoomIn } from "lucide-react";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const galleryBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Grid", value: "grid" },
    { label: "Masonry", value: "masonry" },
    { label: "Carousel", value: "carousel" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "columns", label: "Columns", type: "select", options: [
    { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" },
  ], group: "Layout" },
  { name: "images", label: "Images", type: "array", arrayItemSchema: [
    { name: "src", label: "Image URL", type: "image" },
    { name: "alt", label: "Alt Text", type: "text" },
    { name: "caption", label: "Caption", type: "text" },
  ], group: "Content" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

export const GalleryBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const {
    variant = "grid",
    title = "",
    subtitle = "",
    columns = "3",
    images = [
      { src: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=600", alt: "Image 1", caption: "" },
      { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600", alt: "Image 2", caption: "" },
      { src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600", alt: "Image 3", caption: "" },
      { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600", alt: "Image 4", caption: "" },
      { src: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=600", alt: "Image 5", caption: "" },
      { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600", alt: "Image 6", caption: "" },
    ],
    backgroundColor,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>}
          </AnimationWrapper>
        )}

        {variant === "masonry" ? (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {images.map((img: any, idx: number) => (
              <AnimationWrapper key={idx} animation={animConfig} index={idx} className="break-inside-avoid">
                <button onClick={() => setLightboxIdx(idx)} className="relative group w-full rounded-xl overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.caption && <p className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-sm">{img.caption}</p>}
                </button>
              </AnimationWrapper>
            ))}
          </div>
        ) : variant === "carousel" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {images.map((img: any, idx: number) => (
              <AnimationWrapper key={idx} animation={animConfig} index={idx} className="snap-center shrink-0 w-80">
                <button onClick={() => setLightboxIdx(idx)} className="relative group w-full rounded-xl overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-56 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                {img.caption && <p className="text-sm text-gray-500 mt-2 text-center">{img.caption}</p>}
              </AnimationWrapper>
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-4", getResponsiveGridClasses(Number(columns || 3), device))}>
            {images.map((img: any, idx: number) => (
              <AnimationWrapper key={idx} animation={animConfig} index={idx}>
                <button onClick={() => setLightboxIdx(idx)} className="relative group w-full rounded-xl overflow-hidden aspect-square">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.caption && <p className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-sm">{img.caption}</p>}
                </button>
              </AnimationWrapper>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxIdx !== null && images[lightboxIdx] && (
          <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxIdx(null)}>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={() => setLightboxIdx(null)}>
              <X className="w-6 h-6" />
            </button>
            <img src={images[lightboxIdx].src} alt={images[lightboxIdx].alt} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </section>
  );
};
