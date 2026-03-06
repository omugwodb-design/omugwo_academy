import React from "react";
import { Check } from "lucide-react";
import { BlockComponentProps, PropSchema } from "../types";

export const minimalistCourseCurriculumBlockSchema: PropSchema[] = [
  { name: "eyebrow", label: "Eyebrow", type: "text", group: "Content" },
  { name: "summary", label: "Summary", type: "textarea", group: "Content" },
  {
    name: "modules",
    label: "Modules",
    type: "array",
    group: "Content",
    arrayItemSchema: [
      { name: "id", label: "ID", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      {
        name: "lessons",
        label: "Lessons",
        type: "array",
        arrayItemSchema: [{ name: "text", label: "Lesson", type: "text" }],
      },
    ],
  },
];

export const MinimalistCourseCurriculumBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    eyebrow = "The Syllabus",
    summary = "48 carefully curated lessons over 12 Hours.",
    modules = [
      {
        id: "m1",
        title: "Module 1: Body Recovery",
        duration: "2h 15m",
        lessons: [
          { text: "Introduction to Postpartum Recovery" },
          { text: "Understanding Your Body's Changes" },
          { text: "Safe Exercise Guidelines" },
          { text: "Nutrition for Recovery" },
        ],
      },
      {
        id: "m2",
        title: "Module 2: Mental Health",
        duration: "1h 45m",
        lessons: [
          { text: "Recognizing Baby Blues vs PPD" },
          { text: "Building Your Support System" },
          { text: "Self-Care Strategies" },
        ],
      },
    ],
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-32">
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <div className="sticky top-12">
            <h2
              className="text-sm font-bold uppercase tracking-[0.2em] mb-8"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("eyebrow", e.currentTarget.textContent || "")}
            >
              {eyebrow}
            </h2>
            <p className="text-gray-500 mb-8">
              <span
                contentEditable={selected}
                suppressContentEditableWarning
                onBlur={(e) => handleChange("summary", e.currentTarget.textContent || "")}
              >
                {summary}
              </span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-black">
            {(modules || []).map((mod: any, i: number) => (
              <div key={mod.id} className="group border-b border-black py-8 hover:bg-gray-50 transition-colors cursor-pointer px-4 -mx-4">
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="text-2xl lg:text-4xl font-medium tracking-tight">
                    <span className="text-gray-400 text-lg mr-4 font-mono">0{i + 1}</span>
                    <span
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
                    </span>
                  </h3>
                  <span
                    className="font-mono text-sm"
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const next = (modules || []).map((m: any, idx: number) =>
                        idx === i ? { ...m, duration: e.currentTarget.textContent || "" } : m
                      );
                      handleChange("modules", next);
                    }}
                  >
                    {mod.duration}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-y-3 h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                  {(mod.lessons || []).map((lesson: any, j: number) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-1 text-gray-400" />
                      <span
                        className="text-gray-600"
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
