
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Save, Eye, UploadCloud, Undo2, Redo2, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Canvas } from './canvas';
import { DeviceProvider } from './device-context';
import { dbToStorePage } from './schema';
import { SidebarLeft } from './sidebar-left';
import { SidebarRight } from './sidebar-right';
import { useEditorStore } from './editor-store';
import type { GlobalStyles, SitePage } from './types';
import { TEMPLATES } from './templates';
import { toast } from 'react-hot-toast';
import { VersionHistoryModal } from './version-history-modal';

type BuilderMode = 'website' | 'course' | 'community';

const parseSearch = (search: string) => {
  const params = new URLSearchParams(search);
  return {
    type: params.get('type') || undefined,
    courseId: params.get('courseId') || undefined,
    builderMode: (params.get('builderMode') as BuilderMode | null) || undefined,
    entityId: params.get('entityId') || undefined,
  };
};

const storeToDbPatch = (page: SitePage) => ({
  title: page.title,
  slug: page.slug,
  page_type: page.pageType,
  sort_order: page.sortOrder,
  status: page.status,
  draft_blocks: page.draftBlocks,
  published_blocks: page.publishedBlocks,
  is_home_page: !!page.isHomePage,
  seo_title: page.seoTitle || null,
  seo_description: page.seoDescription || null,
  seo_image: page.seoImage || null,
});

export const SiteBuilder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    pages,
    currentPageId,
    setPages,
    switchPage,
    getCurrentPage,
    globalStyles,
    setGlobalStyles,
    isDirty,
    markClean,
    setIsSaving,
    undo,
    redo,
    canUndo,
    canRedo,
    getHistory,
    getHistoryIndex,
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState<BuilderMode>('website');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const canEdit = useMemo(() => {
    const role = user?.role as unknown as string | undefined;
    return role === 'admin' || role === 'super_admin' || role === 'marketing_admin' || role === 'instructor';
  }, [user?.role]);

  const canManageTemplates = canEdit;
  const canManagePages = builderMode === 'website' && canEdit;
  const canEditTheme = builderMode === 'website' && canEdit;

  useEffect(() => {
    const { type, courseId: qCourseId, builderMode: qMode, entityId } = parseSearch(location.search);
    
    if (qMode) {
      setBuilderMode(qMode);
      setCourseId(qMode === 'course' ? (entityId || qCourseId || null) : null);
      return;
    }

    if (type === 'course_sales') {
      setBuilderMode('course');
      setCourseId(qCourseId || null);
      return;
    }

    setBuilderMode('website');
    setCourseId(null);
  }, [location.search]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);

        const { data: configRow, error: configErr } = await supabase
          .from('site_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (configErr) throw configErr;

        let resolvedSiteId: string;

        if (!configRow) {
          const { data: created, error: createErr } = await supabase
            .from('site_config')
            .insert({ name: 'Omugwo Academy', global_styles: globalStyles as any })
            .select('*')
            .single();
          if (createErr) throw createErr;
          setSiteId(created.id);
          resolvedSiteId = created.id;
          setGlobalStyles((created.global_styles || {}) as GlobalStyles);
        } else {
          setSiteId(configRow.id);
          resolvedSiteId = configRow.id;
          setGlobalStyles((configRow.global_styles || {}) as GlobalStyles);
        }

        const baseQuery = supabase
          .from('site_pages')
          .select('*')
          .order('sort_order', { ascending: true });

        let pageRows: any[] = [];

        if (builderMode === 'course') {
          if (!courseId) {
            setPages([]);
            return;
          }

          // Validate that courseId is a valid UUID format
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(courseId)) {
            console.error('Invalid courseId format:', courseId);
            setPages([]);
            return;
          }

          const { data, error } = await baseQuery
            .eq('page_type', 'course_sales')
            .eq('course_id', courseId);
          if (error) throw error;
          pageRows = data || [];

          if (pageRows.length === 0) {
            const tpl =
              TEMPLATES.find((t) => t.pageType === 'course_sales') ||
              TEMPLATES.find((t) => t.id === 'course-sales-premium');

            const { data: createdPage, error: createPageErr } = await supabase
              .from('site_pages')
              .insert({
                site_id: resolvedSiteId as any,
                title: 'Course Sales Page',
                slug: `course-${courseId}`,
                page_type: 'course_sales',
                sort_order: 0,
                status: 'DRAFT',
                draft_blocks: (tpl?.blocks || []) as any,
                published_blocks: [],
                is_home_page: false,
                course_id: courseId,
              })
              .select('*')
              .single();
            if (createPageErr) throw createPageErr;
            pageRows = [createdPage];
          }
        } else {
          // For website mode, prioritize the published home page if it exists
          const { data: publishedHome, error: publishedHomeErr } = await supabase
            .from('site_pages')
            .select('*')
            .eq('site_id', resolvedSiteId as any)
            .eq('is_home_page', true)
            .eq('status', 'PUBLISHED')
            .is('course_id', null)
            .maybeSingle();

          if (publishedHomeErr && publishedHomeErr.code !== 'PGRST116') {
            throw publishedHomeErr;
          }

          if (publishedHome) {
            // Load the published home page
            console.log('Site Builder - Loading published home page:', publishedHome.id);
            pageRows = [publishedHome];
          } else {
            console.log('Site Builder - No published home page found, checking for existing pages...');
            // Fallback to loading all pages and prioritizing the home page (draft or published)
            const { data, error } = await baseQuery
              .eq('site_id', resolvedSiteId as any)
              .is('course_id', null);
            if (error) throw error;
            
            let fetchedRows = data || [];
            console.log('Site Builder - Fetched pages:', fetchedRows.length, fetchedRows);
            
            // Force update all existing pages with new exact replica templates
            for (const row of fetchedRows) {
              console.log('Site Builder - Updating page with exact replica template:', row.slug);
              
              // Find the correct template based on page slug
              let templateId = 'omugwo-default-home'; // default
              if (row.slug === 'about') templateId = 'omugwo-about-page';
              else if (row.slug === 'courses') templateId = 'omugwo-courses-page';
              else if (row.slug === 'community') templateId = 'omugwo-community-page';
              else if (row.slug === 'webinars') templateId = 'omugwo-webinars-page';
              else if (row.slug === 'contact') templateId = 'omugwo-contact-page';
              
              const template = TEMPLATES.find((t) => t.id === templateId);
              if (template) {
                row.draft_blocks = template.blocks;
                // Update the database
                await supabase
                  .from('site_pages')
                  .update({ draft_blocks: template.blocks })
                  .eq('id', row.id);
                console.log('Site Builder - Updated page with exact replica template:', row.slug);
              }
            }
            
            // Check for missing comprehensive pages and create them if needed
            const requiredPages = [
              { templateId: 'omugwo-default-home', slug: '', pageType: 'homepage', title: 'Home', isHome: true },
              { templateId: 'omugwo-about-page', slug: 'about', pageType: 'about', title: 'About' },
              { templateId: 'omugwo-courses-page', slug: 'courses', pageType: 'courses', title: 'Courses' },
              { templateId: 'omugwo-community-page', slug: 'community', pageType: 'community', title: 'Community' },
              { templateId: 'omugwo-webinars-page', slug: 'webinars', pageType: 'webinars', title: 'Webinars' },
              { templateId: 'omugwo-contact-page', slug: 'contact', pageType: 'contact', title: 'Contact' }
            ];
            
            const existingSlugs = fetchedRows.map(row => row.slug);
            const missingPages = requiredPages.filter(page => !existingSlugs.includes(page.slug));
            
            if (missingPages.length > 0) {
              console.log('Site Builder - Creating missing pages:', missingPages.map(p => p.title));
              
              for (const pageInfo of missingPages) {
                const tpl = TEMPLATES.find((t) => t.id === pageInfo.templateId);
                
                if (tpl) {
                  const { data: createdPage, error: createPageErr } = await supabase
                    .from('site_pages')
                    .insert({
                      site_id: resolvedSiteId as any,
                      title: pageInfo.title,
                      slug: pageInfo.slug,
                      page_type: pageInfo.pageType,
                      sort_order: fetchedRows.length + 1,
                      status: 'DRAFT',
                      draft_blocks: (tpl.blocks || []) as any,
                      published_blocks: [],
                      is_home_page: pageInfo.isHome || false,
                    })
                    .select('*')
                    .single();
                  if (createPageErr) throw createPageErr;
                  console.log(`Site Builder - Created ${pageInfo.title} page:`, createdPage.id);
                  fetchedRows.push(createdPage);
                }
              }
            }
            
            // Reorder fetched pages so that the home page is correctly identified/at the top if available
            fetchedRows.sort((a, b) => {
               if (a.is_home_page && !b.is_home_page) return -1;
               if (!a.is_home_page && b.is_home_page) return 1;
               return 0;
            });
            
            pageRows = fetchedRows;
          }
        }

        const mapped = pageRows.map(dbToStorePage);
        setPages(mapped);
        if (mapped[0]) {
          switchPage(mapped[0].id);
        } else {
          console.error('Site Builder - No pages to switch to');
        }
        markClean();
      } catch (err: any) {
        console.error('Error loading builder:', err);
        toast.error(err?.message || 'Failed to load Site Builder');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [builderMode, courseId]);

  const handleSave = async () => {
    const page = getCurrentPage();
    if (!page) return;
    if (!canEdit) {
      toast.error('You do not have permission to edit pages.');
      return;
    }

    try {
      setIsSaving(true);
      const { error: configErr } = await supabase
        .from('site_config')
        .update({ global_styles: globalStyles as any })
        .eq('id', siteId);
      if (configErr) throw configErr;

      const patch = storeToDbPatch(page);
      const { error: pageErr } = await supabase
        .from('site_pages')
        .update(patch as any)
        .eq('id', page.id);
      if (pageErr) throw pageErr;

      // Create a version entry for this save
      const newVersion = page.version + 1;
      await supabase.from('site_page_versions').insert({
        page_id: page.id,
        version: newVersion,
        blocks: page.draftBlocks,
        change_description: 'Draft saved',
      });

      // Update local page version
      setPages(
        pages.map((p) =>
          p.id === page.id ? { ...p, version: newVersion } : p
        )
      );

      markClean();
      toast.success('Saved');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const page = getCurrentPage();
    if (!page) return;
    if (!canEdit) {
      toast.error('You do not have permission to publish pages.');
      return;
    }

    try {
      setIsSaving(true);
      
      // Update both draft_blocks AND published_blocks in the database
      const { error: pageErr } = await supabase
        .from('site_pages')
        .update({
          draft_blocks: page.draftBlocks,
          published_blocks: page.draftBlocks, // THIS IS CRITICAL - updates what users see
          status: 'PUBLISHED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', page.id);
      
      if (pageErr) throw pageErr;

      // Create a version entry for this publish
      await supabase.from('site_page_versions').insert({
        page_id: page.id,
        version: page.version + 1,
        blocks: page.draftBlocks,
        change_description: 'Published changes',
      });

      // Update local state
      setPages(
        pages.map((p) =>
          p.id === page.id
            ? {
                ...p,
                publishedBlocks: [...page.draftBlocks],
                status: 'PUBLISHED',
                version: p.version + 1,
              }
            : p
        )
      );

      toast.success('Published successfully! Changes are now live.');
      markClean();
    } catch (err: any) {
      console.error('Publish error:', err);
      toast.error(err?.message || 'Failed to publish');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    const page = getCurrentPage();
    if (!page) return;

    localStorage.setItem(
      'omugwo_sitebuilder_preview',
      JSON.stringify({ blocks: page.draftBlocks, globalStyles })
    );
    navigate('/p/__preview__');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const currentPage = pages.find((p) => p.id === currentPageId);

  return (
    <div className="h-[calc(100vh-0px)] w-full flex flex-col bg-white dark:bg-gray-950">
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-black text-gray-900 dark:text-white truncate">
            {builderMode === 'course' ? 'Course Sales Page Builder' : 'Website Builder'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {currentPage ? `${currentPage.title} • ${currentPage.status}` : 'No page loaded'}
            {isDirty ? ' • Unsaved changes' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Version Control */}
          <div className="flex items-center gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-3">
            <button
              onClick={() => undo()}
              disabled={!canUndo()}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo()}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Version History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePreview}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <span className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </span>
          </button>

          <button
            onClick={handlePublish}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white"
          >
            <span className="inline-flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Publish
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <SidebarLeft
          canEdit={canEdit}
          canEditTheme={canEditTheme}
          canManagePages={canManagePages}
          canManageTemplates={canManageTemplates}
          builderMode={builderMode}
        />
        <Canvas />
        <SidebarRight />
      </div>

      {/* Version History Modal */}
      {showHistory && currentPageId && (
        <VersionHistoryModal
          pageId={currentPageId}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};
