import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { Calendar, Clock, Users, Play, CheckCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export const webinarRegistrationBlockSchema: PropSchema[] = [
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { label: "Static (manual)", value: "static" },
      { label: "Dynamic (next webinar)", value: "dynamic" },
    ],
    group: "Data",
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  { name: "date", label: "Date", type: "text", group: "Content" },
  { name: "time", label: "Time", type: "text", group: "Content" },
  { name: "duration", label: "Duration", type: "text", group: "Content" },
  { name: "spotsLeft", label: "Spots Left", type: "number", group: "Content" },
  { name: "speakerName", label: "Speaker Name", type: "text", group: "Content" },
  { name: "speakerTitle", label: "Speaker Title", type: "text", group: "Content" },
  { name: "speakerImage", label: "Speaker Image", type: "image", group: "Content" },
  { name: "benefits", label: "What You'll Learn (comma separated)", type: "textarea", group: "Content" },
  { name: "ctaText", label: "Button Text", type: "text", group: "Content" },
  { name: "backgroundImage", label: "Background Image", type: "image", group: "Background" },
  { name: "backgroundColor", label: "Background Color", type: "color", group: "Background" },
];

export const WebinarRegistrationBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const {
    mode = "static",
    title = "Free Live Masterclass: The 4th Trimester Blueprint",
    subtitle = "Discover the 5 pillars of postpartum recovery that every new mother needs to know.",
    date = "March 15, 2025",
    time = "7:00 PM WAT",
    duration = "90 minutes",
    spotsLeft = 47,
    speakerName = "Dr. Megor Ikuenobe",
    speakerTitle = "Founder, Omugwo Academy",
    speakerImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    benefits = "The truth about postpartum recovery timelines,How to build your support village,Nutrition secrets from traditional African wisdom,When to seek professional help,Exclusive course discount for attendees",
    ctaText = "Reserve My Free Spot",
    backgroundImage,
    backgroundColor,
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const [dynamicData, setDynamicData] = useState<any | null>(null);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  useEffect(() => {
    if (mode !== "dynamic") return;

    const run = async () => {
      try {
        setIsLoadingDynamic(true);

        const nowIso = new Date().toISOString();
        const { data, error } = await supabase
          .from("webinars")
          .select(
            "id, title, description, scheduled_at, duration_minutes, banner_url, max_attendees, slug"
          )
          .gte("scheduled_at", nowIso)
          .order("scheduled_at", { ascending: true })
          .limit(1);

        if (error) throw error;
        const w = data?.[0];
        if (!w) {
          setDynamicData(null);
          return;
        }

        const dt = new Date(w.scheduled_at);
        const dateText = dt.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeText = dt.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });

        setDynamicData({
          title: w.title,
          subtitle: w.description || "",
          date: dateText,
          time: timeText,
          duration:
            typeof w.duration_minutes === "number"
              ? `${w.duration_minutes} minutes`
              : "",
          backgroundImage: w.banner_url || null,
          spotsLeft:
            typeof w.max_attendees === "number" ? w.max_attendees : 0,
        });
      } catch (e) {
        console.error("Failed to load dynamic webinar", e);
        setDynamicData(null);
      } finally {
        setIsLoadingDynamic(false);
      }
    };

    run();
  }, [mode]);

  const computedTitle = mode === "dynamic" && dynamicData?.title ? dynamicData.title : title;
  const computedSubtitle = mode === "dynamic" && dynamicData?.subtitle ? dynamicData.subtitle : subtitle;
  const computedDate = mode === "dynamic" && dynamicData?.date ? dynamicData.date : date;
  const computedTime = mode === "dynamic" && dynamicData?.time ? dynamicData.time : time;
  const computedDuration = mode === "dynamic" && dynamicData?.duration ? dynamicData.duration : duration;
  const computedSpotsLeft = mode === "dynamic" && typeof dynamicData?.spotsLeft === "number" ? dynamicData.spotsLeft : spotsLeft;
  const computedBgImage = mode === "dynamic" && dynamicData?.backgroundImage ? dynamicData.backgroundImage : backgroundImage;

  const benefitsList = (benefits || "").split(",").map((b: string) => b.trim()).filter(Boolean);

  // Simple countdown (static for builder)
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, mins: 45, secs: 30 });

  return (
    <section
      className={cn("py-20 px-6 relative overflow-hidden")}
      style={{
        backgroundColor: backgroundColor || "#0f172a",
        backgroundImage: computedBgImage ? `url(${computedBgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {computedBgImage && <div className="absolute inset-0 bg-black/60 z-0" />}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              FREE LIVE EVENT
            </span>
            {mode === "dynamic" && isLoadingDynamic && (
              <p className="text-sm text-white/70 mb-3">Loading webinar...</p>
            )}
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
            >
              {computedTitle}
            </h2>
            <p
              className="text-lg text-gray-300 mb-6"
              contentEditable={selected}
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
            >
              {computedSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-300">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-400" />{computedDate}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" />{computedTime}</span>
              <span className="flex items-center gap-2"><Play className="w-4 h-4 text-primary-400" />{computedDuration}</span>
            </div>

            {/* Speaker */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-xl">
              <img src={speakerImage} alt={speakerName} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p
                  className="font-bold text-white"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("speakerName", e.currentTarget.textContent || "")}
                >
                  {speakerName}
                </p>
                <p
                  className="text-sm text-gray-400"
                  contentEditable={selected}
                  suppressContentEditableWarning
                  onBlur={(e) => handleChange("speakerTitle", e.currentTarget.textContent || "")}
                >
                  {speakerTitle}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-white uppercase tracking-wider">What you'll learn:</p>
              {benefitsList.map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div>
            {/* Countdown */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.mins },
                { label: "Seconds", value: countdown.secs },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-white">{String(item.value).padStart(2, "0")}</p>
                  <p className="text-xs text-gray-400 uppercase">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-gray-900 mb-2">Register Now   It's Free!</h3>
              <p className="text-sm text-gray-500 mb-6">
                <Users className="w-4 h-4 inline mr-1" />
                Only <span className="font-bold text-red-600">{computedSpotsLeft} spots</span> remaining
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your full name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                <input type="email" placeholder="Your email address" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                <input type="tel" placeholder="Phone (for reminders)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-lg">
                  <span
                    contentEditable={selected}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("ctaText", e.currentTarget.textContent || "")}
                  >
                    {ctaText}
                  </span>
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
