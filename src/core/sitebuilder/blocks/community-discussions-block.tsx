import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { MessageCircle, ThumbsUp, Clock } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { getResponsiveGridClasses, useDevice } from "../device-context";

export const communityDiscussionsBlockSchema: PropSchema[] = [
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { label: "Static (manual)", value: "static" },
      { label: "Dynamic (from community posts)", value: "dynamic" },
    ],
    group: "Data",
  },
  {
    name: "dynamicLimit",
    label: "Dynamic Limit",
    type: "number",
    min: 1,
    max: 20,
    step: 1,
    group: "Data",
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "discussions",
    label: "Discussions",
    type: "array",
    arrayItemSchema: [
      { name: "title", label: "Title", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "meta", label: "Meta", type: "text" },
      { name: "likes", label: "Likes", type: "number", min: 0, max: 100000 },
      { name: "comments", label: "Comments", type: "number", min: 0, max: 100000 },
      { name: "href", label: "Link", type: "text" },
    ],
    group: "Content",
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
];

type DiscussionCard = {
  title: string;
  excerpt: string;
  meta: string;
  likes: number;
  comments: number;
  href: string;
};

export const CommunityDiscussionsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const {
    mode = "static",
    dynamicLimit = 6,
    title = "Trending Discussions",
    subtitle = "See what parents are talking about right now.",
    discussions = [
      {
        title: "Help: Baby wonâ€™t latch after week 2",
        excerpt: "Has anyone dealt with sudden latch refusal? Looking for practical tips that worked...",
        meta: "New Moms Â· 2h ago",
        likes: 18,
        comments: 7,
        href: "/community",
      },
      {
        title: "Postpartum meal prep ideas (Naija-friendly)",
        excerpt: "Share recipes and meal plans that helped you recover faster   especially soups and swallows.",
        meta: "Nutrition Â· 5h ago",
        likes: 42,
        comments: 19,
        href: "/community",
      },
      {
        title: "Sleep schedule for newborns: whatâ€™s realistic?",
        excerpt: "Trying to set expectations. How did you manage nights and naps in the first month?",
        meta: "Sleep Â· 1d ago",
        likes: 35,
        comments: 22,
        href: "/community",
      },
    ],
    backgroundColor,
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const updateDiscussion = (idx: number, key: string, value: any) => {
    if (mode === "dynamic") return;
    const next = (discussions || []).map((d: any, i: number) => (i === idx ? { ...d, [key]: value } : d));
    handleChange("discussions", next);
  };

  const [dynamicDiscussions, setDynamicDiscussions] = useState<DiscussionCard[]>([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  useEffect(() => {
    if (mode !== "dynamic") return;

    const run = async () => {
      try {
        setIsLoadingDynamic(true);
        const { data, error } = await supabase
          .from("community_posts")
          .select("id, content, created_at, like_count, comment_count")
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(dynamicLimit);

        if (error) throw error;

        const mapped: DiscussionCard[] = (data || []).map((p: any) => {
          const createdAt = p.created_at ? new Date(p.created_at) : null;
          const meta = createdAt
            ? `Community Â· ${createdAt.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}`
            : "Community";

          const raw = typeof p.content === "string" ? p.content.trim() : "";
          const short = raw.length > 160 ? `${raw.slice(0, 160)}...` : raw;

          const firstLine = raw.split("\n").find(Boolean) || "Community post";
          const computedTitle = firstLine.length > 64 ? `${firstLine.slice(0, 64)}...` : firstLine;

          return {
            title: computedTitle,
            excerpt: short,
            meta,
            likes: typeof p.like_count === "number" ? p.like_count : 0,
            comments: typeof p.comment_count === "number" ? p.comment_count : 0,
            href: p.id ? `/community/post/${p.id}` : "/community",
          };
        });

        setDynamicDiscussions(mapped);
      } catch (e) {
        console.error("Failed to load dynamic community posts", e);
        setDynamicDiscussions([]);
      } finally {
        setIsLoadingDynamic(false);
      }
    };

    run();
  }, [mode, dynamicLimit]);

  const discussionsToRender = useMemo(() => {
    if (mode === "dynamic") {
      return dynamicDiscussions.length > 0 ? dynamicDiscussions : discussions;
    }
    return discussions;
  }, [mode, dynamicDiscussions, discussions]);

  return (
    <section className={cn("py-20 px-6", !backgroundColor && "bg-white")} style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.currentTarget.textContent || "")}
          >
            {title}
          </h2>
          <p
            className="text-lg text-gray-600"
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e) => handleChange("subtitle", e.currentTarget.textContent || "")}
          >
            {subtitle}
          </p>
        </div>

        {mode === "dynamic" && isLoadingDynamic && (
          <div className="text-center text-sm text-gray-500 mb-8">Loading discussions...</div>
        )}

        <div className={cn("grid gap-6", getResponsiveGridClasses(3, device))}>
          {discussionsToRender.map((d, idx) => (
            <motion.a
              key={idx}
              href={d.href}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => e.preventDefault()}
            >
              <h3
                className="font-black text-gray-900 text-lg mb-2 line-clamp-2"
                contentEditable={selected && mode === "static"}
                suppressContentEditableWarning
                onBlur={(e) => updateDiscussion(idx, "title", e.currentTarget.textContent || "")}
              >
                {d.title}
              </h3>
              <p
                className="text-sm text-gray-600 mb-4 line-clamp-3"
                contentEditable={selected && mode === "static"}
                suppressContentEditableWarning
                onBlur={(e) => updateDiscussion(idx, "excerpt", e.currentTarget.textContent || "")}
              >
                {d.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {d.meta}
                </span>
                <span className="inline-flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {d.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {d.comments}
                  </span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
