import React from "react";
import { motion } from "framer-motion";
import { BlockComponentProps, PropSchema } from "../types";

export const interactiveCourseModulesBlockSchema: PropSchema[] = [
  { name: "modulesTitle", label: "Title", type: "text", group: "Content" },
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

export const InteractiveCourseModulesBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    modulesTitle = "Course Modules",
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
      {
        id: "m3",
        title: "Module 3: Cultural Balance",
        duration: "1h 30m",
        lessons: [{ text: "Understanding Expectations" }, { text: "Setting Healthy Boundaries" }],
      },
      {
        id: "m4",
        title: "Module 4: Infant Care",
        duration: "2h 00m",
        lessons: [{ text: "Feeding Basics" }, { text: "Understanding Baby Sleep" }, { text: "Newborn Care Essentials" }],
      },
    ],
  } = block.props || {};

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateModule = (idx: number, key: string, value: any) => {
    const next = (modules || []).map((m: any, i: number) => (i === idx ? { ...m, [key]: value } : m));
    handleChange("modules", next);
  };

  const updateLesson = (moduleIdx: number, lessonIdx: number, value: string) => {
    const next = (modules || []).map((m: any, i: number) => {
      if (i !== moduleIdx) return m;
      const lessons = (m.lessons || []).map((l: any, j: number) => (j === lessonIdx ? { ...(typeof l === "string" ? { text: l } : l), text: value } : l));
      return { ...m, lessons };
    });
    handleChange("modules", next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <h2
        className="text-4xl md:text-5xl font-black text-center mb-16"
        contentEditable={selected}
        suppressContentEditableWarning
        onBlur={(e) => handleChange("modulesTitle", e.currentTarget.textContent || "")}
      >
        {modulesTitle}
      </h2>

      <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
        {(modules || []).map((mod: any, i: number) => (
          <motion.div
            whileHover={{ scale: 0.98 }}
            key={mod.id}
            className={`p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group cursor-pointer ${
              i === 0 ? "md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-white text-slate-900"
            }`}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700 ${i === 0 ? "text-white" : "text-indigo-600"}`}>
              <div className="text-9xl font-black">{i + 1}</div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mt-auto">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${i === 0 ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                  <span
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => updateModule(i, "duration", e.currentTarget.textContent || "")}
                  >
                    {mod.duration}
                  </span>
                </span>
                <h3
                  className={`text-2xl font-black mb-4 ${i === 0 ? "md:text-4xl" : ""}`}
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => updateModule(i, "title", e.currentTarget.textContent || "")}
                >
                  {String(mod.title).split(": ")[1] || mod.title}
                </h3>

                {i === 0 && (
                  <ul className="space-y-2 mt-6">
                    {(mod.lessons || []).map((lesson: any, j: number) => (
                      <li key={j} className="flex items-center gap-2 font-medium text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span
                          contentEditable={selected}
                          suppressContentEditableWarning
                          onBlur={(e) => updateLesson(i, j, e.currentTarget.textContent || "")}
                        >
                          {typeof lesson === "string" ? lesson : lesson?.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
