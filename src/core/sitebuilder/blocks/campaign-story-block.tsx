import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { CheckCircle } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig, sizingSchemaFields } from "./animation-wrapper";

export const campaignStoryBlockSchema: PropSchema[] = [
  { name: "badgeText", label: "Badge Text", type: "text", group: "Content" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "titleHighlight", label: "Title Highlight", type: "text", group: "Content" },
  { name: "body1", label: "Body Paragraph 1", type: "textarea", group: "Content" },
  { name: "body2", label: "Body Paragraph 2", type: "textarea", group: "Content" },
  { name: "listTitle", label: "List Title", type: "text", group: "List" },
  { name: "listItems", label: "List Items", type: "textarea", group: "List" },
  { name: "ctaText", label: "Button Text", type: "text", group: "Content" },
  { name: "ctaLink", label: "Button Link", type: "text", group: "Content" },
  
  // Images
  { name: "image1", label: "Image 1", type: "image", group: "Images" },
  { name: "image2", label: "Image 2", type: "image", group: "Images" },
  { name: "image3", label: "Image 3", type: "image", group: "Images" },
  { name: "image4", label: "Image 4", type: "image", group: "Images" },

  { name: "backgroundColor", label: "Background Color", type: "color", group: "Style" },
  ...animationSchemaFields,
  ...sizingSchemaFields,
];

export const CampaignStoryBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    badgeText = "Featured Campaign",
    title = "My ",
    titleHighlight = "Omugwo",
    titleSuffix = " Story",
    body1 = "The \"My Omugwo Story\" campaign aims to highlight the transformative power of omugwo care by sharing real-life experiences of new moms, new dads, and close relatives who have benefited from this tradition. Through storytelling, we will showcase the diverse perspectives and profound impact of Omugwo on families worldwide.",
    body2 = "Whether your journey was filled with challenges, triumphs, or a combination of both, we want to hear your story, the good, the bad and the ugly. We encourage you to embrace the opportunity to share your omugwo story and inspire others on their parenting journeys. Together we can celebrate the transformative power of Omugwo care.",
    listTitle = "How to Share Your Omugwo Story:",
    listSubtitle = "We offer three convenient ways to share your omugwo story:",
    listItems = "Video Submission / walk in video recording\nPodcast Feature\nWritten Article\nLive videos",
    ctaText = "SHARE YOUR STORY",
    ctaLink = "#",
    image1 = "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400",
    image2 = "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400",
    image3 = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    image4 = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
    backgroundColor,
    paddingY = "py-24",
    containerSize = "max-w-7xl",
  } = block.props;

  const animConfig = getAnimationConfig(block.props);
  const items = listItems.split('\n').filter((i: string) => i.trim());

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <section className={cn(paddingY, "px-6", backgroundColor ? "" : "bg-white")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className={cn("mx-auto grid lg:grid-cols-2 gap-16 items-center", containerSize)}>
        <AnimationWrapper animation={animConfig} className="order-2 lg:order-1">
          {badgeText && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-bold rounded-full mb-6">
              {badgeText}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
            <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</span>
            {titleHighlight && <span className="text-primary-300" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("titleHighlight", e.currentTarget.textContent || "")}>{titleHighlight}</span>}
            <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("titleSuffix", e.currentTarget.textContent || "")}>{titleSuffix}</span>
          </h2>
          <div className="space-y-6 text-gray-600 mb-10 text-lg leading-relaxed">
            <p contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("body1", e.currentTarget.textContent || "")}>{body1}</p>
            <p contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("body2", e.currentTarget.textContent || "")}>{body2}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-primary-700 text-xl mb-6" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("listTitle", e.currentTarget.textContent || "")}>{listTitle}</h3>
            {listSubtitle && <p className="text-gray-600 mb-6" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("listSubtitle", e.currentTarget.textContent || "")}>{listSubtitle}</p>}
            <ul className="space-y-4 mb-10">
              {items.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            {ctaText && (
              <a href={ctaLink} onClick={(e) => e.preventDefault()} className="inline-flex items-center px-8 py-4 bg-primary-300 hover:bg-primary-400 text-white font-bold tracking-wider rounded-full transition-colors shadow-lg">
                <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}>
                  {ctaText}
                </span>
              </a>
            )}
          </div>
        </AnimationWrapper>

        <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }} className="relative order-1 lg:order-2 bg-primary-50 rounded-[2.5rem] p-4">
          <div className="grid grid-cols-2 gap-4 h-full aspect-square">
            <img src={image1} alt="Grid 1" className="w-full h-full object-cover rounded-3xl" />
            <img src={image2} alt="Grid 2" className="w-full h-full object-cover rounded-3xl" />
            <img src={image3} alt="Grid 3" className="w-full h-full object-cover rounded-3xl" />
            <img src={image4} alt="Grid 4" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};
