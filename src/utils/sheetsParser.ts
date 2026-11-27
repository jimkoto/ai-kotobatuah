import {
  BLOG_CATEGORIES,
  LEAD_SERVICES,
  PROCEDURE_SLUGS,
  type BlogCategory,
  type BlogPost,
  type LeadServiceType,
  type ProcedurePage,
  type ProcedureSlug,
  type SheetCategoryRow,
  type SheetSeoKeywordRow,
  type SiteSettings,
} from '../types/domain';
import {
  clampText,
  normalizeSlug,
  validateBlogPost,
  validateProcedurePage,
} from './validation';

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch?.[1]) {
    return urlMatch[1];
  }
  return trimmed.replace(/[^a-zA-Z0-9_-]/g, '');
}

function parseBool(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'ya', 'aktif', 'published'].includes(normalized)) return true;
  if (['false', '0', 'no', 'tidak', 'draft'].includes(normalized)) return false;
  return defaultValue;
}

function normalizeBlogCategory(raw: string | undefined): BlogCategory {
  const trimmed = (raw ?? '').trim().toLowerCase();
  const matched = BLOG_CATEGORIES.find((c) => c.toLowerCase() === trimmed);
  if (matched) return matched;
  if (trimmed.includes('ooh') || trimmed.includes('billboard')) return 'Strategi OOH';
  if (trimmed.includes('seo') || trimmed.includes('geo')) return 'SEO & GEO';
  if (trimmed.includes('hosting') || trimmed.includes('cms')) return 'Partner Hosting';
  return 'Performance Ads';
}

function normalizeLeadService(raw: string | undefined): LeadServiceType {
  const trimmed = (raw ?? '').trim().toLowerCase();
  const matched = LEAD_SERVICES.find((s) => s.toLowerCase() === trimmed);
  return matched ?? 'Kampanye Digital';
}

export interface ParsedBlogRowsResult {
  posts: BlogPost[];
  skipped: Array<{ rowNumber: number; reason: string }>;
}

export function parseBlogSheetRows(rows: string[][]): ParsedBlogRowsResult {
  if (!Array.isArray(rows) || rows.length < 2) {
    return { posts: [], skipped: [] };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const col = (...aliases: string[]) => {
    for (const alias of aliases) {
      const idx = headers.indexOf(alias.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idxId = col('id', 'post_id');
  const idxSlug = col('slug');
  const idxTitleId = col('title_id', 'judul', 'title');
  const idxTitleEn = col('title_en');
  const idxExcerptId = col('excerpt_id', 'ringkasan', 'excerpt');
  const idxExcerptEn = col('excerpt_en');
  const idxContentId = col('content_id', 'konten', 'content', 'body');
  const idxContentEn = col('content_en');
  const idxCategory = col('category', 'kategori');
  const idxAuthor = col('author', 'penulis');
  const idxCover = col('cover_image_url', 'cover_url', 'image_url', 'gambar');
  const idxTags = col('tags', 'tag');
  const idxSeoTitle = col('seo_title');
  const idxSeoDesc = col('seo_description', 'meta_description');
  const idxGeoCity = col('geo_city', 'kota', 'city');
  const idxReadMinutes = col('read_minutes', 'menit_baca');
  const idxFeatured = col('featured', 'unggulan');
  const idxPublished = col('published', 'publish', 'status');
  const idxPublishedAt = col('published_at', 'tanggal', 'date');

  const posts: BlogPost[] = [];
  const skipped: Array<{ rowNumber: number; reason: string }> = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((cell) => !String(cell ?? '').trim())) continue;

    const get = (idx: number) => (idx >= 0 ? String(row[idx] ?? '').trim() : '');
    const titleId = get(idxTitleId);
    const slug = normalizeSlug(get(idxSlug) || titleId || `artikel-${i}`, `artikel-${i}`);
    const idRaw = get(idxId) || slug;
    const id = idRaw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120) || `sheet-${i}`;
    const excerptId = get(idxExcerptId);
    const contentId = get(idxContentId);
    const tags = get(idxTags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const candidate: Omit<BlogPost, 'id'> = {
      slug,
      titleId,
      titleEn: get(idxTitleEn) || titleId,
      excerptId: excerptId || contentId.slice(0, 180),
      excerptEn: get(idxExcerptEn) || excerptId || contentId.slice(0, 180),
      contentId,
      contentEn: get(idxContentEn) || contentId,
      category: normalizeBlogCategory(get(idxCategory)),
      author: get(idxAuthor) || 'Tim Editorial kotobatuah.com',
      coverImageUrl:
        get(idxCover) || '/src/assets/images/portfolio_digital_campaign_1795655952843.jpg',
      tags: tags.length > 0 ? tags : ['Kotobatuah', 'Tangerang Raya'],
      seoTitle: get(idxSeoTitle) || titleId,
      seoDescription: get(idxSeoDesc) || excerptId || contentId.slice(0, 160),
      geoCity: get(idxGeoCity) || 'Tangerang Raya',
      readMinutes: Number(get(idxReadMinutes)) || 4,
      featured: parseBool(get(idxFeatured), false),
      published: parseBool(get(idxPublished), true),
      publishedAt: get(idxPublishedAt) || '2026-11-26',
      source: 'google_sheets',
    };

    const validation = validateBlogPost(candidate);
    if (!validation.valid || !validation.sanitized) {
      skipped.push({
        rowNumber: i + 1,
        reason: Object.values(validation.errors)[0] || 'Data baris tidak valid.',
      });
      continue;
    }

    posts.push({ id, ...validation.sanitized });
  }

  return { posts, skipped };
}

export function parseSiteConfigFromSheet(
  rows: string[][],
  fallback: SiteSettings
): { config: SiteSettings; matchedKeys: string[] } {
  if (!Array.isArray(rows) || rows.length < 2) {
    return { config: { ...fallback }, matchedKeys: [] };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const keyIdx = Math.max(0, headers.findIndex((h) => ['key', 'config_key', 'kunci'].includes(h)));
  const valIdx = Math.max(1, headers.findIndex((h) => ['value', 'nilai', 'config_value'].includes(h)));

  const next: SiteSettings = { ...fallback };
  const matchedKeys: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const rawKey = String(row[keyIdx] ?? '').trim();
    const rawValue = String(row[valIdx] ?? '').trim();
    if (!rawKey || !rawValue) continue;

    switch (rawKey) {
      case 'primaryHubName':
        next.primaryHubName = clampText(rawValue, 80);
        matchedKeys.push(rawKey);
        break;
      case 'primaryAddress':
        next.primaryAddress = clampText(rawValue, 200);
        matchedKeys.push(rawKey);
        break;
      case 'secondaryAddress':
        next.secondaryAddress = clampText(rawValue, 200);
        matchedKeys.push(rawKey);
        break;
      case 'contactEmail':
        next.contactEmail = clampText(rawValue, 120);
        matchedKeys.push(rawKey);
        break;
      case 'contactPhone':
        next.contactPhone = clampText(rawValue, 30);
        matchedKeys.push(rawKey);
        break;
      case 'taglineId':
        next.taglineId = clampText(rawValue, 120);
        matchedKeys.push(rawKey);
        break;
      case 'taglineEn':
        next.taglineEn = clampText(rawValue, 120);
        matchedKeys.push(rawKey);
        break;
      case 'managementDisclaimerId':
        next.managementDisclaimerId = clampText(rawValue, 300);
        matchedKeys.push(rawKey);
        break;
      case 'managementDisclaimerEn':
        next.managementDisclaimerEn = clampText(rawValue, 300);
        matchedKeys.push(rawKey);
        break;
      case 'adsenseClientId':
        next.adsenseClientId = clampText(rawValue, 40);
        matchedKeys.push(rawKey);
        break;
      case 'adsenseBlogSlotId':
        next.adsenseBlogSlotId = clampText(rawValue, 40);
        matchedKeys.push(rawKey);
        break;
      case 'adsenseArticleSlotId':
        next.adsenseArticleSlotId = clampText(rawValue, 40);
        matchedKeys.push(rawKey);
        break;
      default:
        break;
    }
  }

  return { config: next, matchedKeys };
}

export function parseBlogCategoriesFromSheet(rows: string[][]): SheetCategoryRow[] {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  const results: SheetCategoryRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !String(row[0] ?? '').trim()) continue;
    results.push({
      name: clampText(String(row[0] ?? ''), 60),
      slug: normalizeSlug(String(row[1] ?? row[0] ?? ''), 'kategori'),
      descriptionId: clampText(String(row[2] ?? ''), 240),
      descriptionEn: clampText(String(row[3] ?? row[2] ?? ''), 240),
      targetCtaService: normalizeLeadService(row[4]),
    });
  }
  return results;
}

export function parseSeoKeywordsFromSheet(rows: string[][]): SheetSeoKeywordRow[] {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  const results: SheetSeoKeywordRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !String(row[0] ?? '').trim() || !String(row[1] ?? '').trim()) continue;
    results.push({
      city: clampText(String(row[0] ?? ''), 80),
      keyword: clampText(String(row[1] ?? ''), 120),
      intent: clampText(String(row[2] ?? 'Commercial'), 60),
      targetSlug: clampText(String(row[3] ?? '/'), 120),
      priority: clampText(String(row[4] ?? 'High'), 30),
    });
  }
  return results;
}

export const BLOG_POSTS_HEADERS = [
  'id',
  'slug',
  'title_id',
  'title_en',
  'excerpt_id',
  'excerpt_en',
  'content_id',
  'content_en',
  'category',
  'author',
  'cover_image_url',
  'tags',
  'seo_title',
  'seo_description',
  'geo_city',
  'read_minutes',
  'featured',
  'published',
  'published_at',
] as const;

export function blogPostToSheetRow(post: BlogPost): string[] {
  return [
    post.id,
    post.slug,
    post.titleId,
    post.titleEn,
    post.excerptId,
    post.excerptEn,
    post.contentId,
    post.contentEn,
    post.category,
    post.author,
    post.coverImageUrl,
    post.tags.join(', '),
    post.seoTitle,
    post.seoDescription,
    post.geoCity,
    String(post.readMinutes),
    post.featured ? 'TRUE' : 'FALSE',
    post.published ? 'TRUE' : 'FALSE',
    post.publishedAt,
  ];
}

export const PROCEDURE_PAGES_HEADERS = [
  'slug',
  'title_id',
  'title_en',
  'summary_id',
  'summary_en',
  'content_id',
  'content_en',
  'updated_at',
  'published',
] as const;

export function procedurePageToSheetRow(page: ProcedurePage): string[] {
  return [
    page.slug,
    page.titleId,
    page.titleEn,
    page.summaryId,
    page.summaryEn,
    page.contentId,
    page.contentEn,
    page.updatedAt,
    page.published ? 'TRUE' : 'FALSE',
  ];
}

export function parseProcedurePagesFromSheet(rows: string[][]): {
  pages: ProcedurePage[];
  skipped: Array<{ rowNumber: number; reason: string }>;
} {
  if (!Array.isArray(rows) || rows.length < 2) {
    return { pages: [], skipped: [] };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const col = (...aliases: string[]) => {
    for (const alias of aliases) {
      const idx = headers.indexOf(alias.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idxSlug = col('slug', 'path');
  const idxTitleId = col('title_id', 'judul', 'title');
  const idxTitleEn = col('title_en');
  const idxSummaryId = col('summary_id', 'ringkasan', 'summary');
  const idxSummaryEn = col('summary_en');
  const idxContentId = col('content_id', 'konten', 'content');
  const idxContentEn = col('content_en');
  const idxUpdatedAt = col('updated_at', 'tanggal');
  const idxPublished = col('published', 'status');

  const pages: ProcedurePage[] = [];
  const skipped: Array<{ rowNumber: number; reason: string }> = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((cell) => !String(cell ?? '').trim())) continue;

    const get = (idx: number) => (idx >= 0 ? String(row[idx] ?? '').trim() : '');
    const rawSlug = get(idxSlug).replace(/^\/?procedure\//i, '').toLowerCase() as ProcedureSlug;
    if (!PROCEDURE_SLUGS.includes(rawSlug)) {
      skipped.push({
        rowNumber: i + 1,
        reason: `Slug "${rawSlug || '(kosong)'}" bukan bagian dari /procedure/* (disclaimers, tos, privacy-policy, cookies).`,
      });
      continue;
    }

    const titleId = get(idxTitleId);
    const summaryId = get(idxSummaryId);
    const contentId = get(idxContentId);
    const validation = validateProcedurePage({
      slug: rawSlug,
      titleId,
      titleEn: get(idxTitleEn) || titleId,
      summaryId: summaryId || contentId.slice(0, 180),
      summaryEn: get(idxSummaryEn) || summaryId || contentId.slice(0, 180),
      contentId,
      contentEn: get(idxContentEn) || contentId,
      updatedAt: get(idxUpdatedAt) || '2026-11-26',
      published: parseBool(get(idxPublished), true),
      source: 'google_sheets',
    });

    if (!validation.valid || !validation.sanitized) {
      skipped.push({
        rowNumber: i + 1,
        reason: Object.values(validation.errors)[0] || 'Data baris prosedur tidak valid.',
      });
      continue;
    }

    pages.push({ id: rawSlug, ...validation.sanitized });
  }

  return { pages, skipped };
}

export function buildBlogTemplateSheetsPayload(
  settings: SiteSettings,
  seedPosts: BlogPost[],
  seedProcedures: ProcedurePage[] = []
): {
  title: string;
  tabs: Array<{ name: string; rows: string[][] }>;
} {
  return {
    title: 'kotobatuah.com — Blog & Site Config CMS',
    tabs: [
      {
        name: 'Blog_Posts',
        rows: [
          [...BLOG_POSTS_HEADERS],
          ...seedPosts.map(blogPostToSheetRow),
        ],
      },
      {
        name: 'Blog_Categories',
        rows: [
          ['name', 'slug', 'description_id', 'description_en', 'target_cta_service'],
          [
            'Strategi OOH',
            'strategi-ooh',
            'Panduan penempatan billboard, videotron LED, dan pelacakan QR real-time.',
            'LED videotron placement playbooks and real-time QR attribution.',
            'OOH & Billboard',
          ],
          [
            'SEO & GEO',
            'seo-geo',
            'Optimisasi pencarian lokal Tangerang Raya, Jabodetabek, dan Schema.org.',
            'Local search domination across Greater Tangerang and Schema.org.',
            'Kampanye Digital',
          ],
          [
            'Performance Ads',
            'performance-ads',
            'Strategi akuisisi leads B2B & ritel di Google, Meta, dan TikTok Ads.',
            'B2B and retail lead acquisition across Google, Meta, and TikTok.',
            'Kampanye Digital',
          ],
          [
            'Partner Hosting',
            'partner-hosting',
            'Arsitektur server edge berkecepatan < 1.2 detik dan CMS responsif.',
            'Sub-1.2s edge hosting architecture and responsive campaign CMS.',
            'Partner Hosting & CMS',
          ],
        ],
      },
      {
        name: 'Site_Config',
        rows: [
          ['key', 'value', 'description'],
          ['primaryHubName', settings.primaryHubName, 'Basis operasional utama (Hero & Footer)'],
          ['primaryAddress', settings.primaryAddress, 'Alamat lengkap basis operasional utama'],
          ['secondaryAddress', settings.secondaryAddress, 'Alamat kantor perwakilan Jakarta'],
          ['contactEmail', settings.contactEmail, 'Email kontak resmi untuk leads & footer'],
          ['contactPhone', settings.contactPhone, 'Nomor WhatsApp / telepon resmi'],
          ['taglineId', settings.taglineId, 'Tagline utama Bahasa Indonesia di Hero'],
          ['taglineEn', settings.taglineEn, 'Primary English tagline shown in Hero'],
          [
            'managementDisclaimerId',
            settings.managementDisclaimerId ?? '',
            'Disclaimer resmi Studio & Management (Jaringan Akomoda Network)',
          ],
          [
            'managementDisclaimerEn',
            settings.managementDisclaimerEn ?? '',
            'Official English Studio & Management disclaimer',
          ],
          [
            'adsenseClientId',
            settings.adsenseClientId ?? '',
            'Google AdSense Publisher ID (contoh: ca-pub-1234567890123456)',
          ],
          [
            'adsenseBlogSlotId',
            settings.adsenseBlogSlotId ?? '',
            'AdSense Slot ID untuk banner daftar artikel Blog',
          ],
          [
            'adsenseArticleSlotId',
            settings.adsenseArticleSlotId ?? '',
            'AdSense Slot ID untuk In-Article di dalam bacaan Blog',
          ],
        ],
      },
      {
        name: 'SEO_GEO_Keywords',
        rows: [
          ['city', 'keyword', 'intent', 'target_slug', 'priority'],
          ['Tangerang Raya', 'agensi periklanan tangerang raya', 'Commercial', '/#seo-geo', 'High'],
          ['Tangerang Raya', 'sewa videotron bsd alam sutera', 'Transactional', '/#portofolio', 'High'],
          ['Jakarta Selatan', 'jasa billboard sudirman scbd', 'Commercial', '/#layanan', 'High'],
          ['Indonesia', 'partner hosting landing page cepat', 'Transactional', '/#partner-hosting', 'Medium'],
        ],
      },
      {
        name: 'Procedure_Pages',
        rows: [
          [...PROCEDURE_PAGES_HEADERS],
          ...seedProcedures.map(procedurePageToSheetRow),
        ],
      },
    ],
  };
}
