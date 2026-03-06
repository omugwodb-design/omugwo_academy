import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Play } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const videoBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Inline", value: "inline" },
    { label: "With Text", value: "with-text" },
    { label: "Full Width", value: "fullwidth" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "videoUrl", label: "Video URL (YouTube/Vimeo)", type: "text", group: "Content" },
  { name: "posterImage", label: "Poster Image", type: "image", group: "Content" },
  { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [
    { label: "16:9", value: "16/9" },
    { label: "4:3", value: "4/3" },
    { label: "1:1", value: "1/1" },
    { label: "21:9", value: "21/9" },
  ], group: "Layout" },
  { name: "autoplay", label: "Autoplay", type: "boolean", group: "Settings" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

const getEmbedUrl = (url: string, autoplay: boolean): string => {
  if (!url) return "";
  const ap = autoplay ? "1" : "0";
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}?autoplay=${ap}&rel=0`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=${ap}&rel=0`;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}?autoplay=${ap}`;
  }
  return url;
};

export const VideoBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    variant = "inline",
    title = "",
    subtitle = "",
    videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    posterImage = "",
    aspectRatio = "16/9",
    autoplay = false,
    backgroundColor,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);
  const embedUrl = getEmbedUrl(videoUrl, autoplay);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const [showVideo, setShowVideo] = React.useState(autoplay);

  const videoPlayer = (
    <div className={cn("relative w-full rounded-2xl overflow-hidden shadow-lg bg-gray-900")} style={{ aspectRatio }}>
      {showVideo || autoplay ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          title="Video"
        />
      ) : (
        <button onClick={() => setShowVideo(true)} className="absolute inset-0 w-full h-full group">
          {posterImage ? (
            <img src={posterImage} alt="Video poster" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            </div>
          </div>
        </button>
      )}
    </div>
  );

  if (variant === "fullwidth") {
    return (
      <section style={{ backgroundColor: backgroundColor || undefined }}>
        <AnimationWrapper animation={animConfig}>
          <div className={cn("relative w-full bg-gray-900")} style={{ aspectRatio }}>
            {embedUrl ? (
              <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen" allowFullScreen frameBorder="0" title="Video" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Play className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        </AnimationWrapper>
      </section>
    );
  }

  if (variant === "with-text") {
    return (
      <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <AnimationWrapper animation={animConfig}>
            <div>
              {title && (
                <h2
                  className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("title", e.currentTarget.innerHTML || "")}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {subtitle && (
                <p
                  className="text-lg text-gray-600 leading-relaxed"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("subtitle", e.currentTarget.innerHTML || "")}
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              )}
            </div>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }}>
            {videoPlayer}
          </AnimationWrapper>
        </div>
      </section>
    );
  }

  // Default: inline
  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <AnimationWrapper animation={animConfig} className="text-center mb-10">
            {title && (
              <h2
                className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("title", e.currentTarget.innerHTML || "")}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {subtitle && (
              <p
                className="text-lg text-gray-600"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("subtitle", e.currentTarget.innerHTML || "")}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </AnimationWrapper>
        )}
        <AnimationWrapper animation={animConfig}>
          {videoPlayer}
        </AnimationWrapper>
      </div>
    </section>
  );
};
