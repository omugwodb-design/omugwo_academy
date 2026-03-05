DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'blog_posts'
  ) THEN
    CREATE TABLE public.blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      published_at TIMESTAMPTZ,
      status TEXT DEFAULT 'draft',
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      cover_image_url TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_image TEXT,
      category TEXT,
      author_id UUID REFERENCES public.users(id) ON DELETE SET NULL
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_posts'
      AND policyname = 'Public can read published blog posts'
  ) THEN
    CREATE POLICY "Public can read published blog posts" ON public.blog_posts
      FOR SELECT
      USING (status = 'published');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_posts'
      AND policyname = 'Admins can manage blog posts'
  ) THEN
    CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
      FOR ALL
      USING (
        EXISTS (
          SELECT 1
          FROM public.users u
          WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'super_admin', 'marketing_admin')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.users u
          WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'super_admin', 'marketing_admin')
        )
      );
  END IF;
END $$;
