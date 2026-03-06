import React from "react";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Mail } from "lucide-react";
import { animationSchemaFields } from "./animation-wrapper";
import { toast } from "react-hot-toast";
import { leadsApi } from "../../../services/api";

export const newsletterBlockSchema: PropSchema[] = [
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "buttonText", label: "Button Text", type: "text", group: "Content" },
  { name: "placeholder", label: "Placeholder", type: "text", group: "Content" },
  { name: "variant", label: "Variant", type: "select", options: [
    { label: "Light", value: "light" }, { label: "Primary", value: "primary" }, { label: "Dark", value: "dark" },
  ], group: "Style" },
  { name: "layout", label: "Layout", type: "select", options: [
    { label: "Centered", value: "centered" }, { label: "Split (Horizontal)", value: "split" },
  ], group: "Layout" },
  ...animationSchemaFields,
];

export const NewsletterBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    title = "Get Free Postnatal Tips Weekly",
    subtitle = "Join 15,000+ parents receiving expert advice, resources, and community updates every Thursday.",
    buttonText = "Subscribe",
    placeholder = "Enter your email",
    variant = "primary",
    layout = "split",
  } = block.props;

  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const bg = variant === "primary" ? "bg-primary-600" : variant === "dark" ? "bg-gray-900" : "bg-gray-50";
  const text = variant === "light" ? "text-gray-900" : "text-white";
  const sub = variant === "light" ? "text-gray-600" : "text-white/80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) return;
    if (isSubmitting) return;

    const trimmed = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValidEmail) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setIsSubmitting(true);
      await leadsApi.create({ email: trimmed, source: "newsletter" });
      setEmail("");
      toast.success("Subscribed successfully");
    } catch (err: any) {
      const code = err?.code;
      if (code === "23505") {
        toast.success("You're already subscribed");
        return;
      }
      toast.error("Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(layout === "split" ? "py-12" : "py-20", "px-6", bg)}>
      <div className={cn("mx-auto", layout === "split" ? "max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6" : "max-w-2xl text-center")}>
        {layout === "centered" && <Mail className={cn("w-12 h-12 mx-auto mb-4", variant === "light" ? "text-primary-600" : "text-white/80")} />}
        <div className={layout === "split" ? "flex-1" : ""}>
          <h2
            className={cn(layout === "split" ? "text-2xl" : "text-3xl", "font-bold mb-2", text)}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
          <p
            className={cn("text-base", layout === "centered" && "mb-8 text-lg", sub)}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>
        </div>
        <form className={cn("flex gap-3", layout === "split" ? "w-full md:w-auto" : "max-w-md mx-auto w-full")} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={placeholder}
            className={cn("flex-1 px-4 py-3 rounded-xl border outline-none transition-all", variant === "light" ? "border-gray-200 focus:ring-2 focus:ring-primary-500" : "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={selected || isSubmitting}
          />
          <button
            className={cn("px-6 py-3 font-bold rounded-xl transition-colors whitespace-nowrap", variant === "light" ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-white text-primary-700 hover:bg-gray-100")}
            disabled={selected || isSubmitting}
          >
            <span
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("buttonText", e.currentTarget.textContent || "")}
            >
              {buttonText}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};
