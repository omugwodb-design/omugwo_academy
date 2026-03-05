import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Linkedin, Twitter, Globe } from "lucide-react";
import { getResponsiveGridClasses, useDevice } from "../device-context";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const teamBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Cards", value: "cards" },
    { label: "Compact", value: "compact" },
    { label: "Overlay", value: "overlay" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "columns", label: "Columns", type: "select", options: [
    { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" },
  ], group: "Layout" },
  { name: "members", label: "Team Members", type: "array", arrayItemSchema: [
    { name: "name", label: "Name", type: "text" },
    { name: "role", label: "Role", type: "text" },
    { name: "image", label: "Photo URL", type: "image" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "linkedin", label: "LinkedIn URL", type: "text" },
    { name: "twitter", label: "Twitter URL", type: "text" },
    { name: "website", label: "Website URL", type: "text" },
  ], group: "Content" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

export const TeamBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const {
    variant = "cards",
    title = "Meet Our Team",
    subtitle = "The passionate experts behind Omugwo Academy.",
    columns = "3",
    members = [
      { name: "Dr. Megor Ikuenobe", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", bio: "Medical professional and early childhood development specialist.", linkedin: "#", twitter: "#", website: "#" },
      { name: "Dr. Chioma Nwosu", role: "Head of Curriculum", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400", bio: "Clinical psychologist specializing in postpartum mental health.", linkedin: "#", twitter: "", website: "" },
      { name: "Emeka Okafor", role: "Community Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", bio: "Father of two and advocate for partner involvement in postnatal care.", linkedin: "#", twitter: "#", website: "" },
    ],
    backgroundColor,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateMember = (idx: number, key: string, value: any) => {
    const next = (members || []).map((m: any, i: number) => (i === idx ? { ...m, [key]: value } : m));
    handleChange("members", next);
  };

  const renderSocials = (member: any) => (
    <div className="flex gap-2 mt-3">
      {member.linkedin && <a href={member.linkedin} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" onClick={(e) => e.preventDefault()}><Linkedin className="w-4 h-4" /></a>}
      {member.twitter && <a href={member.twitter} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" onClick={(e) => e.preventDefault()}><Twitter className="w-4 h-4" /></a>}
      {member.website && <a href={member.website} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" onClick={(e) => e.preventDefault()}><Globe className="w-4 h-4" /></a>}
    </div>
  );

  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
          <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
        </AnimationWrapper>

        <div className={cn("grid gap-8", getResponsiveGridClasses(Number(columns || 3), device))}>
          {members.map((member: any, idx: number) => {
            if (variant === "overlay") {
              return (
                <AnimationWrapper key={idx} animation={animConfig} index={idx} className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "name", e.currentTarget.textContent || "")}>{member.name}</h3>
                    <p className="text-sm text-white/70" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "role", e.currentTarget.textContent || "")}>{member.role}</p>
                    <div className="flex gap-2 mt-3">
                      {member.linkedin && <a href={member.linkedin} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors" onClick={(e) => e.preventDefault()}><Linkedin className="w-4 h-4" /></a>}
                      {member.twitter && <a href={member.twitter} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors" onClick={(e) => e.preventDefault()}><Twitter className="w-4 h-4" /></a>}
                    </div>
                  </div>
                </AnimationWrapper>
              );
            }

            if (variant === "compact") {
              return (
                <AnimationWrapper key={idx} animation={animConfig} index={idx} className="flex items-center gap-4">
                  <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "name", e.currentTarget.textContent || "")}>{member.name}</h3>
                    <p className="text-sm text-gray-500" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "role", e.currentTarget.textContent || "")}>{member.role}</p>
                  </div>
                </AnimationWrapper>
              );
            }

            // Default: cards
            return (
              <AnimationWrapper key={idx} animation={animConfig} index={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "name", e.currentTarget.textContent || "")}>{member.name}</h3>
                  <p className="text-sm text-primary-600 font-medium mb-3" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "role", e.currentTarget.textContent || "")}>{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => updateMember(idx, "bio", e.currentTarget.textContent || "")}>{member.bio}</p>
                  {renderSocials(member)}
                </div>
              </AnimationWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
