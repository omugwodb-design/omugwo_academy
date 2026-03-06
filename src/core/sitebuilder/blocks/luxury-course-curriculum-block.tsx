import React from "react";
import { BlockComponentProps, PropSchema } from "../types";

export const luxuryCourseCurriculumBlockSchema: PropSchema[] = [
  { name: "eyebrow", label: "Eyebrow", type: "text", group: "Content" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  {
    name: "modules",
    label: "Modules",
    type: "array",
    group: "Content",
    arrayItemSchema: [
      { name: "id", label: "ID", type: "text" },
      { name: "title", label: "Title", type: "text" },
      {
        name: "lessons",
        label: "Lessons",
        type: "array",
        arrayItemSchema: [{ name: "text", label: "Lesson", type: "text" }],
      },
    ],
  },
];

export const LuxuryCourseCurriculumBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    eyebrow = "The Curriculum",
    title = "Program Itinerary",
    modules = [
      {
        id: "m1",
        title: "Module 1: Body Recovery",
        lessons: [{ text: "Introduction to Postpartum Recovery" }, { text: "Understanding Your Body's Changes" }],
      },
      {
        id: "m2",
        title: "Module 2: Mental Health",
        lessons: [{ text: "Recognizing Baby Blues vs PPD" }, { text: "Building Your Support System" }],
      },
    ],
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <div className="bg-[#2C2C2C] text-[#FDFBF7] py-32">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2
            className="text-sm font-sans font-light uppercase tracking-[0.4em] text-[#D4AF37] mb-4"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("eyebrow", e.currentTarget.textContent || "")}
          >
            {eyebrow}
          </h2>
          <h3
            className="text-4xl italic font-light"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h3>
        </div>

        <div className="space-y-16">
          {(modules || []).map((mod: any, i: number) => (
            <div key={mod.id} className="relative pl-12 border-l border-white/20 pb-8">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full border border-[#D4AF37] bg-[#2C2C2C]" />
              <span className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] block mb-2">PART 0{i + 1}</span>
              <h4
                className="text-3xl font-light mb-6"
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const next = (modules || []).map((m: any, idx: number) =>
                    idx === i ? { ...m, title: e.currentTarget.textContent || "" } : m
                  );
                  handleChange("modules", next);
                }}
              >
                {String(mod.title).split(": ")[1] || mod.title}
              </h4>
              <ul className="space-y-4">
                {(mod.lessons || []).map((lesson: any, j: number) => (
                  <li
                    key={j}
                    className="flex items-center justify-between font-sans font-light text-sm text-[#CCC] border-b border-white/10 pb-4"
                  >
                    <span
                      contentEditable={selected}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const next = (modules || []).map((m: any, idx: number) => {
                          if (idx !== i) return m;
                          const nextLessons = (m.lessons || []).map((l: any, lj: number) => {
                            if (lj !== j) return l;
                            if (typeof l === "string") return e.currentTarget.textContent || "";
                            return { ...l, text: e.currentTarget.textContent || "" };
                          });
                          return { ...m, lessons: nextLessons };
                        });
                        handleChange("modules", next);
                      }}
                    >
                      {typeof lesson === "string" ? lesson : lesson?.text}
                    </span>
                    <span className="italic text-[#888]">Included</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
