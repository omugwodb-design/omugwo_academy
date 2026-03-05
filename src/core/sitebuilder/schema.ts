import type { SitePage } from './types';

// Database to Store conversion
export const dbToStorePage = (row: any): SitePage => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  pageType: row.page_type,
  sortOrder: row.sort_order ?? 0,
  status: row.status,
  draftBlocks: row.draft_blocks || [],
  publishedBlocks: row.published_blocks || [],
  isHomePage: row.is_home_page,
  version: row.version || 1,
  seoTitle: row.seo_title || undefined,
  seoDescription: row.seo_description || undefined,
  seoImage: row.seo_image || undefined,
  createdAt: row.created_at || undefined,
  updatedAt: row.updated_at || undefined,
});

// Store to Database conversion
export const storeToDbPatch = (page: SitePage) => ({
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
