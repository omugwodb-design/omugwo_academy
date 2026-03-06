import React from "react";
import { motion } from "framer-motion";
import { MousePointer2, Smartphone, Download, MessagesSquare, Play } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";

const ICON_MAP: Record<string, React.FC<any>> = {
  play: Play,
  smartphone: Smartphone,
  download: Download,
  community: MessagesSquare,
  pointer: MousePointer2,
};

export const interactiveCourseFeaturesBlockSchema: PropSchema[] = [
  { name: "featuresTitle", label: "Title", type: "text", group: "Content" },
  { name: "featuresSubtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "features",
    label: "Features",
    type: "array",
    group: "Content",
    arrayItemSchema: [
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: [
          { label: "Play", value: "play" },
          { label: "Smartphone", value: "smartphone" },
          { label: "Download", value: "download" },
          { label: "Community", value: "community" },
          { label: "Pointer", value: "pointer" },
        ],
      },
      { name: "title", label: "Title", type: "text" },
      { name: "desc", label: "Description", type: "textarea" },
    ],
  },
];

export const InteractiveCourseFeaturesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    featuresTitle = "Everything You Need.",
    featuresSubtitle = "Delivered in an interactive, bite-sized format.",
    features = [
      { title: "Video Lessons", icon: "play", desc: "Cinematic quality tutorials" },
      { title: "Audio Options", icon: "smartphone", desc: "Listen on the go" },
      { title: "Workbooks", icon: "download", desc: "Interactive PDF guides" },
      { title: "Community", icon: "community", desc: "24/7 peer support" },
    ],
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateFeature = (idx: number, key: string, value: any) => {
    const next = (features || []).map((f: any, i: number) => (i === idx ? { ...f, [key]: value } : f));
    handleChange("features", next);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border-y border-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight mb-4"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("featuresTitle", e.currentTarget.textContent || "")}
          >
            {featuresTitle}
          </h2>
          <p
            className="text-lg text-slate-500 font-medium"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("featuresSubtitle", e.currentTarget.textContent || "")}
          >
            {featuresSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(features || []).map((feat: any, i: number) => {
            const Icon = ICON_MAP[String(feat.icon || "")] || MousePointer2;
            return (
              <motion.div
                whileHover={{ y: -10 }}
                key={i}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateFeature(i, "title", e.currentTarget.textContent || "")}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-slate-500 font-medium"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateFeature(i, "desc", e.currentTarget.textContent || "")}
                >
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
