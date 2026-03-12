import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteRenderer } from '../core/sitebuilder/renderer';
import { TEMPLATES } from '../core/sitebuilder/templates';
import { COURSE_LAYOUT_TEMPLATES } from '../core/sitebuilder/course-layout-templates';

export const CourseDetail: React.FC = () => {
  const { slug, courseId } = useParams<{ slug?: string; courseId?: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackBlocks = useMemo(() => {
    const byLuxuryLayout = COURSE_LAYOUT_TEMPLATES.find((t) => t.id === 'course-luxury-layout');
    const byLayoutType = COURSE_LAYOUT_TEMPLATES.find((t) => t.pageType === 'course_sales');
    const byId = TEMPLATES.find((t) => t.id === 'course-sales-premium');
    const byType = TEMPLATES.find((t) => t.pageType === 'course_sales');
    return (byLuxuryLayout || byLayoutType || byId || byType)?.blocks || [];
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);

        const courseKey = slug || courseId;
        if (!courseKey) {
          setCourse(null);
          setPageData(null);
          return;
        }

        const { data: config } = await supabase
          .from('site_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (config) setSiteConfig(config);

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          courseKey
        );

        const courseQuery = supabase.from('courses').select('*');

        const { data: courseRow, error: courseErr } = await (isUuid
          ? courseQuery.eq('id', courseKey).maybeSingle()
          : courseQuery.eq('slug', courseKey).maybeSingle());

        if (courseErr) {
          console.error('Error fetching course:', courseErr);
        }

        if (!courseRow) {
          setCourse(null);
          setPageData(null);
          return;
        }

        setCourse(courseRow);

        const { data: salesPage, error: pageErr } = await supabase
          .from('site_pages')
          .select('*')
          .eq('page_type', 'course_sales')
          .eq('course_id', courseRow.id)
          .eq('status', 'PUBLISHED')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pageErr) {
          console.error('Error fetching course sales page:', pageErr);
        }

        setPageData(salesPage || null);
      } catch (err) {
        console.error('Error fetching course detail page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [courseId, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">This course was not found.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <SiteRenderer
      blocks={pageData?.published_blocks || fallbackBlocks}
      globalStyles={siteConfig?.global_styles}
    />
  );
};
