import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BlockComponentProps, PropSchema } from "../types";
import { ArrowRight, Calendar } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { getResponsiveGridClasses, useDevice } from "../device-context";

export const blogPostsBlockSchema: PropSchema[] = [
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { label: "Static (manual)", value: "static" },
      { label: "Dynamic (from blog posts)", value: "dynamic" },
    ],
    group: "Data",
  },
  {
    name: "dynamicLimit",
    label: "Dynamic Limit",
    type: "number",
    min: 1,
    max: 24,
    step: 1,
    group: "Data",
  },
  {
    name: "dynamicCategory",
    label: "Dynamic Category",
    type: "text",
    group: "Data",
  },
  {
    name: "dynamicPageType",
    label: "Dynamic Page Type",
    type: "text",
    group: "Data",
  },
  { name: "title", label: "Title", type: "text", group: "Content" },
  { name: "subtitle", label: "Subtitle", type: "textarea", group: "Content" },
  {
    name: "posts",
    label: "Posts",
    type: "array",
    arrayItemSchema: [
      { name: "title", label: "Title", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "date", label: "Date", type: "text" },
      { name: "image", label: "Image", type: "image" },
      { name: "href", label: "Link", type: "text" },
    ],
    group: "Content",
  },
  { name: "backgroundColor", label: "Background", type: "color", group: "Style" },
];

type BlogPostCard = {
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  href: string;
};

export const BlogPostsBlock: React.FC<BlockComponentProps> = ({ block, onChange, selected }) => {
  const { device } = useDevice();
  const {
    mode = "static",
    dynamicLimit = 6,
    dynamicCategory = "",
    dynamicPageType = "blog",
    title = "Latest from Omugwo",
    subtitle = "Practical postpartum guidance, cultural wisdom, and expert insights.",
    posts = [
      {
        title: "5 postpartum recovery myths to stop believing",
        excerpt: "Letâ€™s unpack common myths and replace them with gentle, evidence-based guidance.",
        date: "Feb 12, 2026",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
        href: "/blog/postpartum-recovery-myths",
      },
      {
        title: "What to eat in your first 40 days (Naija-friendly)",
        excerpt: "Nourishing soups, warm meals, and hydration habits that support healing.",
        date: "Jan 28, 2026",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=1200",
        href: "/blog/first-40-days-nutrition",
      },
      {
        title: "How to build your support village",
        excerpt: "A realistic blueprint for asking for help, setting boundaries, and staying supported.",
        date: "Jan 05, 2026",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
        href: "/blog/support-village",
      },
    ],
    backgroundColor,
  } = block.props;

  const handleChange = (key: string, value: any) => {
    onChange(block.id, { ...block.props, [key]: value });
  };

  const [dynamicPosts, setDynamicPosts] = useState<BlogPostCard[]>([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  useEffect(() => {
    if (mode !== "dynamic") return;

    const run = async () => {
      try {
        setIsLoadingDynamic(true);

        const categoryFilter = (dynamicCategory || "").trim() || (dynamicPageType || "").trim();

        let q = supabase
          .from("blog_posts")
          .select(
            "id, title, slug, excerpt, cover_image_url, seo_description, seo_image, category, published_at, updated_at, created_at, status"
          )
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(dynamicLimit);

        if (categoryFilter && categoryFilter !== "all") {
          q = q.eq("category", categoryFilter);
        }

        const { data, error } = await q;

        if (error) throw error;

        const mapped: BlogPostCard[] = (data || []).map((p: any) => {
          const dt = new Date(p.published_at || p.updated_at || p.created_at || new Date().toISOString());
          const dateText = dt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            title: p.title,
            excerpt: p.excerpt || p.seo_description || "",
            date: dateText,
            image: p.cover_image_url || p.seo_image || undefined,
            href: p.slug ? `/blog/${p.slug}` : "/blog",
          };
        });

        setDynamicPosts(mapped);
      } catch (e) {
        console.error("Failed to load dynamic blog posts", e);
        setDynamicPosts([]);
      } finally {
        setIsLoadingDynamic(false);
      }
    };

    run();
  }, [mode, dynamicLimit, dynamicCategory, dynamicPageType]);

  const postsToRender = useMemo(() => {
    if (mode === "dynamic") {
      return dynamicPosts.length > 0 ? dynamicPosts : posts;
    }
    return posts;
  }, [mode, dynamicPosts, posts]);

  const updatePost = (idx: number, key: string, value: any) => {
    if (mode !== "static") return;
    const next = (posts || []).map((p: any, i: number) => (i === idx ? { ...p, [key]: value } : p));
    handleChange("posts", next);
  };

  return (
    <section className={cn("py-20 px-6", !backgroundColor && "bg-gray-50")} style={{ backgroundColor: backgroundColor || undefined }}>
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
          <div className="text-center text-sm text-gray-500 mb-8">Loading posts...</div>
        )}

        <div className={cn("grid gap-8", getResponsiveGridClasses(3, device))}>
          {postsToRender.map((p, idx) => (
            <motion.a
              key={idx}
              href={p.href}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => e.preventDefault()}
            >
              {p.image && (
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{p.date}</span>
                </div>
                <h3
                  className="font-black text-gray-900 text-lg mb-2 line-clamp-2"
                  contentEditable={selected && mode === "static"}
                  suppressContentEditableWarning
                  onBlur={(e) => updatePost(idx, "title", e.currentTarget.textContent || "")}
                >
                  {p.title}
                </h3>
                <p
                  className="text-sm text-gray-600 mb-5 line-clamp-3"
                  contentEditable={selected && mode === "static"}
                  suppressContentEditableWarning
                  onBlur={(e) => updatePost(idx, "excerpt", e.currentTarget.textContent || "")}
                >
                  {p.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
