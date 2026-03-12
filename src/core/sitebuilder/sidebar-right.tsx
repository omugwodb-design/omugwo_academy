import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { useEditorStore } from "./editor-store";
import { BLOCK_DEFINITIONS } from "./registry";
import { PropSchema } from "./types";
import { ChevronDown, Plus, Trash2, Palette, Settings2, Layout, Sparkles, Type, Image as ImageIcon, Layers } from "lucide-react";
import { MediaUpload } from "../../components/ui/MediaUpload";
import { RichTextEditor } from "./components/RichTextEditor";
import { TypographyControl, BorderControl, SpacingControl } from "./components/VisualControls";
export const SidebarRight: React.FC = () => {
  const { selectedBlockId, getBlocks, updateBlockProps } = useEditorStore();
  const [activeTab, setActiveTab] = useState<string>("Content");

  const blocks = getBlocks();
  const selectedBlock = selectedBlockId
    ? blocks.find((b) => b.id === selectedBlockId) || null
    : null;

  if (!selectedBlock) {
    return (
      <div className="w-[300px] border-l border-gray-200 dark:border-gray-800 h-full bg-white dark:bg-gray-950 p-6 text-center text-gray-400 text-sm shrink-0 flex flex-col items-center justify-center">
        <Palette className="w-8 h-8 text-gray-300 mb-3" />
        <p className="font-medium text-gray-700 dark:text-gray-200">No block selected</p>
        <p className="text-xs mt-1 text-gray-400">Click a block on the canvas to edit its properties.</p>
      </div>
    );
  }

  const def = BLOCK_DEFINITIONS[selectedBlock.type];
  if (!def) return null;

  const Icon = def.icon;

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...selectedBlock.props, [key]: value };
    updateBlockProps(selectedBlock.id, newProps);
  };

  // Standardized Tabs
  const tabs = [
    { id: "Content", icon: Type },
    { id: "Layout", icon: Layout },
    { id: "Style", icon: Palette },
    { id: "Animation", icon: Sparkles },
    { id: "Advanced", icon: Settings2 },
  ];

  // Group schemas for the ACTIVE TAB ONLY
  const schemasForActiveTab = def.propSchema.filter(s => (s.group || "Content") === activeTab);

  // Further group by sub-groups if any (optional, but keep the PropertyGroup logic)
  // For now, let's just group them into a "General" group within the tab if they don't have a sub-group
  // or just render them directly.
  // Actually, the current PropertyGroup logic expects a group name.
  // Let's just use the activeTab as the single group for now, or if we want nested groups:

  return (
    <div className="w-[300px] border-l border-gray-200 dark:border-gray-800 h-full bg-white dark:bg-gray-950 flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 bg-primary-50 dark:bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-600">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{def.label}</p>
          <p className="text-[9px] text-gray-400 font-mono">{selectedBlock.type}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-1 shrink-0">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          // Check if this tab has any fields
          const hasFields = def.propSchema.some(s => (s.group || "Content") === tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 rounded-md transition-all relative group",
                isActive
                  ? "bg-white dark:bg-gray-800 text-primary-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                !hasFields && tab.id !== "Content" && "opacity-30 grayscale cursor-not-allowed"
              )}
              title={tab.id}
              disabled={!hasFields && tab.id !== "Content"}
            >
              <TabIcon className={cn("w-4 h-4", isActive ? "scale-110" : "scale-100")} />
              {isActive && (
                <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter">{tab.id}</span>
              )}
              {!isActive && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {tab.id}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Properties Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {schemasForActiveTab.length > 0 ? (
          <div className="p-4 space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            {schemasForActiveTab.map((schema) => (
              <PropertyField
                key={schema.name}
                schema={schema}
                value={selectedBlock.props[schema.name]}
                onChange={(value) => handlePropChange(schema.name, value)}
                allProps={selectedBlock.props}
                onPropsChange={(props) => updateBlockProps(selectedBlock.id, props)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 p-8 text-center grayscale">
            <Settings2 className="w-12 h-12 mb-4" />
            <p className="text-xs font-medium">No settings available for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

//  Property Group 
const PropertyGroup: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 dark:border-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {name}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform",
            !isOpen && "-rotate-90"
          )}
        />
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
};

//  Property Field 
const PropertyField: React.FC<{
  schema: PropSchema;
  value: any;
  onChange: (value: any) => void;
  allProps: Record<string, any>;
  onPropsChange: (props: Record<string, any>) => void;
}> = ({ schema, value, onChange, allProps, onPropsChange }) => {
  switch (schema.type) {
    case "text":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      );

    case "richtext":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <RichTextEditor
            value={value || ""}
            onChange={onChange}
            placeholder={`Enter ${schema.label.toLowerCase()}...`}
            minHeight="120px"
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <input
            type="number"
            value={value ?? schema.default ?? 0}
            min={schema.min}
            max={schema.max}
            step={schema.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {schema.label}
          </label>
          <button
            onClick={() => onChange(!value)}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative",
              value ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-800"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm",
                value ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        </div>
      );

    case "select":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            {schema.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer"
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="transparent"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <MediaUpload
            value={value || ""}
            onChange={(url) => onChange(url)}
            bucket="assets"
            folder="site"
            placeholder="Upload Image"
            className="h-32"
          />
        </div>
      );

    case "gradient":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="">None</option>
            <option value="linear-gradient(135deg, #e85d75, #f8a4b8)">Primary Gradient</option>
            <option value="linear-gradient(135deg, #1e293b, #334155)">Dark Gradient</option>
            <option value="linear-gradient(135deg, #7c3aed, #a78bfa)">Purple Gradient</option>
            <option value="linear-gradient(135deg, #059669, #34d399)">Green Gradient</option>
            <option value="linear-gradient(135deg, #d97706, #fbbf24)">Amber Gradient</option>
          </select>
          {value && (
            <div
              className="w-full h-8 rounded-lg mt-2"
              style={{ background: value }}
            />
          )}
        </div>
      );

    case "array":
      return (
        <ArrayField
          schema={schema}
          value={value || []}
          onChange={onChange}
        />
      );

    case "padding":
    case "margin":
      return (
        <SpacingControl
          label={schema.label}
          type={schema.type as 'padding' | 'margin'}
          values={value || {}}
          onChange={onChange}
        />
      );

    case "border_radius":
      return (
        <BorderControl
          label={schema.label}
          values={value || {}}
          onChange={onChange}
        />
      );

    case "shadow":
      return (
        <div className="space-y-2 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{schema.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['none', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'].map((s) => (
              <button
                key={s}
                onClick={() => onChange(s)}
                className={cn(
                  "py-1.5 text-[10px] uppercase font-bold rounded-lg border transition-all",
                  (value || 'none') === s
                    ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/40 dark:border-primary-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            {schema.label}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      );
  }
};

//  Array Field 
const ArrayField: React.FC<{
  schema: PropSchema;
  value: any[];
  onChange: (value: any[]) => void;
}> = ({ schema, value, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addItem = () => {
    const newItem: Record<string, any> = {};
    schema.arrayItemSchema?.forEach((s) => {
      newItem[s.name] = s.default || "";
    });
    onChange([...value, newItem]);
    setExpandedIndex(value.length);
  };

  const removeItem = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    if (expandedIndex === idx) setExpandedIndex(null);
  };

  const updateItem = (idx: number, key: string, val: any) => {
    const newValue = [...value];
    newValue[idx] = { ...newValue[idx], [key]: val };
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {schema.label} ({value.length})
        </label>
        <button
          onClick={addItem}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900/60 rounded text-gray-500 dark:text-gray-300"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1">
        {value.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 cursor-pointer"
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                {item.title || item.name || item.question || item.label || `Item ${idx + 1}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(idx);
                  }}
                  className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-gray-400 transition-transform",
                    expandedIndex !== idx && "-rotate-90"
                  )}
                />
              </div>
            </div>
            {expandedIndex === idx && schema.arrayItemSchema && (
              <div className="p-3 space-y-2">
                {schema.arrayItemSchema.map((fieldSchema) => {
                  const fieldValue = item[fieldSchema.name];
                  if (fieldSchema.type === "select") {
                    return (
                      <div key={fieldSchema.name}>
                        <label className="text-[10px] font-medium text-gray-500 mb-0.5 block">
                          {fieldSchema.label}
                        </label>
                        <select
                          value={fieldValue || ""}
                          onChange={(e) =>
                            updateItem(idx, fieldSchema.name, e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        >
                          {fieldSchema.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (fieldSchema.type === "boolean") {
                    return (
                      <div
                        key={fieldSchema.name}
                        className="flex items-center justify-between"
                      >
                        <label className="text-[10px] font-medium text-gray-500">
                          {fieldSchema.label}
                        </label>
                        <button
                          onClick={() =>
                            updateItem(idx, fieldSchema.name, !fieldValue)
                          }
                          className={cn(
                            "w-8 h-5 rounded-full transition-colors relative",
                            fieldValue ? "bg-primary-600" : "bg-gray-200"
                          )}
                        >
                          <div
                            className={cn(
                              "w-3 h-3 bg-white rounded-full absolute top-1 transition-transform shadow-sm",
                              fieldValue ? "translate-x-4" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    );
                  }
                  if (fieldSchema.type === "textarea") {
                    return (
                      <div key={fieldSchema.name}>
                        <label className="text-[10px] font-medium text-gray-500 mb-0.5 block">
                          {fieldSchema.label}
                        </label>
                        <textarea
                          value={fieldValue || ""}
                          onChange={(e) =>
                            updateItem(idx, fieldSchema.name, e.target.value)
                          }
                          rows={2}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-800 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    );
                  }
                  if (fieldSchema.type === "number") {
                    return (
                      <div key={fieldSchema.name}>
                        <label className="text-[10px] font-medium text-gray-500 mb-0.5 block">
                          {fieldSchema.label}
                        </label>
                        <input
                          type="number"
                          value={fieldValue ?? ""}
                          min={fieldSchema.min}
                          max={fieldSchema.max}
                          step={fieldSchema.step}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              fieldSchema.name,
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    );
                  }
                  if (fieldSchema.type === "image") {
                    return (
                      <div key={fieldSchema.name}>
                        <label className="text-[10px] font-medium text-gray-500 mb-0.5 block">
                          {fieldSchema.label}
                        </label>
                        <MediaUpload
                          value={fieldValue || ""}
                          onChange={(url) => updateItem(idx, fieldSchema.name, url)}
                          bucket="assets"
                          folder="site"
                          placeholder="Upload Image"
                          className="h-20"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={fieldSchema.name}>
                      <label className="text-[10px] font-medium text-gray-500 mb-0.5 block">
                        {fieldSchema.label}
                      </label>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) =>
                          updateItem(idx, fieldSchema.name, e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
