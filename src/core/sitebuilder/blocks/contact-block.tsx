import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { AnimationWrapper, animationSchemaFields, getAnimationConfig } from "./animation-wrapper";

export const contactBlockSchema: PropSchema[] = [
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Split (Form + Info)", value: "split" },
    { label: "Centered Form", value: "centered" },
    { label: "Minimal", value: "minimal" },
  ], group: "Layout" },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "email", label: "Email", type: "text", group: "Contact Info" },
  { name: "phone", label: "Phone", type: "text", group: "Contact Info" },
  { name: "address", label: "Address", type: "textarea", group: "Contact Info" },
  { name: "buttonText", label: "Submit Button", type: "text", group: "Content" },
  { name: "showNameField", label: "Show Name Field", type: "boolean", group: "Form" },
  { name: "showPhoneField", label: "Show Phone Field", type: "boolean", group: "Form" },
  { name: "showMessageField", label: "Show Message Field", type: "boolean", group: "Form" },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
  ...animationSchemaFields,
];

export const ContactBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    variant = "split",
    title = "Get In Touch",
    subtitle = "Have a question? We'd love to hear from you.",
    email = "hello@omugwoacademy.com",
    phone = "+234 800 000 0000",
    address = "Lagos, Nigeria",
    buttonText = "Send Message",
    showNameField = true,
    showPhoneField = false,
    showMessageField = true,
    backgroundColor,
  } = block.props;

  const animConfig = getAnimationConfig(block.props);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white";

  const formFields = (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {showNameField && <input type="text" placeholder="Your name" className={inputClass} />}
      <input type="email" placeholder="Your email" className={inputClass} />
      {showPhoneField && <input type="tel" placeholder="Phone number" className={inputClass} />}
      {showMessageField && <textarea placeholder="Your message" rows={4} className={cn(inputClass, "resize-none")} />}
      <button className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("buttonText", e.currentTarget.textContent || "")}>{buttonText}</span>
      </button>
    </form>
  );

  const contactInfo = (
    <div className="space-y-6">
      {email && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Email</p>
            <p className="text-gray-600 text-sm" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("email", e.currentTarget.textContent || "")}>{email}</p>
          </div>
        </div>
      )}
      {phone && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Phone</p>
            <p className="text-gray-600 text-sm" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("phone", e.currentTarget.textContent || "")}>{phone}</p>
          </div>
        </div>
      )}
      {address && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Address</p>
            <p className="text-gray-600 text-sm" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("address", e.currentTarget.textContent || "")}>{address}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "centered") {
    return (
      <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="max-w-lg mx-auto">
          <AnimationWrapper animation={animConfig} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }}>
            {formFields}
          </AnimationWrapper>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="max-w-2xl mx-auto">
          <AnimationWrapper animation={animConfig} className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
            <p className="text-gray-600 text-sm" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, delay: 0.15 }}>
            <div className="flex gap-3">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              <button className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors whitespace-nowrap">
                <span contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("buttonText", e.currentTarget.textContent || "")}>{buttonText}</span>
              </button>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    );
  }

  // Default: split
  return (
    <section className={cn("py-20 px-6")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        <AnimationWrapper animation={animConfig} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}>{title}</h2>
          <p className="text-lg text-gray-600" contentEditable={selected} suppressContentEditableWarning onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}>{subtitle}</p>
        </AnimationWrapper>
        <div className="grid lg:grid-cols-2 gap-12">
          <AnimationWrapper animation={animConfig}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {formFields}
            </div>
          </AnimationWrapper>
          <AnimationWrapper animation={{ ...animConfig, delay: 0.2 }}>
            {contactInfo}
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
};
