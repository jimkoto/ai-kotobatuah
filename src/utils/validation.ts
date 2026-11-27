import {
  BLOG_CATEGORIES,
  HOSTING_TIERS,
  LEAD_BUDGET_RANGES,
  LEAD_SERVICES,
  PORTFOLIO_CATEGORIES,
  PROCEDURE_SLUGS,
  type BlogCategory,
  type BlogPost,
  type HostingPartnerItem,
  type LeadInquiryInput,
  type PortfolioCategory,
  type PortfolioItem,
  type ProcedurePage,
  type ProcedureSlug,
  type SheetsConfig,
  type SiteSettings,
  type TestimonialItem,
} from '../types/domain';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const WHATSAPP_REGEX = /^[0-9+\-\s()]+$/;
export const DOC_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
export const SLUG_REGEX = /^[a-z0-9-]+$/;

export interface ValidationResult<T> {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: T;
}

export function clampText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function slugifyId(input: string, fallbackPrefix = 'item'): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  const base = cleaned.length >= 2 ? cleaned : fallbackPrefix;
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export function validateLeadInquiry(input: LeadInquiryInput): ValidationResult<LeadInquiryInput> {
  const errors: Record<string, string> = {};

  const fullName = clampText(input.fullName ?? '', 100);
  const company = clampText(input.company ?? '', 100);
  const email = clampText(input.email ?? '', 120);
  const whatsapp = clampText(input.whatsapp ?? '', 25);
  const city = clampText(input.city ?? '', 80);
  const brief = clampText(input.brief ?? '', 1000);

  if (fullName.length < 2) {
    errors.fullName = 'Nama lengkap minimal 2 karakter.';
  }
  if (company.length < 2) {
    errors.company = 'Nama perusahaan atau brand minimal 2 karakter.';
  }
  if (email.length < 5 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Masukkan alamat email bisnis yang valid.';
  }
  if (whatsapp.length < 8 || !WHATSAPP_REGEX.test(whatsapp)) {
    errors.whatsapp = 'Masukkan nomor WhatsApp yang valid (minimal 8 digit).';
  }
  if (!LEAD_SERVICES.includes(input.serviceType)) {
    errors.serviceType = 'Pilih layanan utama yang valid.';
  }
  if (!LEAD_BUDGET_RANGES.includes(input.budgetRange)) {
    errors.budgetRange = 'Pilih estimasi anggaran yang valid.';
  }
  if (city.length < 2) {
    errors.city = 'Masukkan kota target kampanye.';
  }
  if (brief.length < 10) {
    errors.brief = 'Jelaskan kebutuhan kampanye Anda minimal 10 karakter.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      fullName,
      company,
      email,
      whatsapp,
      serviceType: input.serviceType,
      budgetRange: input.budgetRange,
      city,
      brief,
      source: input.source,
    },
  };
}

export function validatePortfolioItem(
  input: Omit<PortfolioItem, 'id'>
): ValidationResult<Omit<PortfolioItem, 'id'>> {
  const errors: Record<string, string> = {};

  const title = clampText(input.title ?? '', 120);
  const client = clampText(input.client ?? '', 80);
  const metricLabel = clampText(input.metricLabel ?? '', 80);
  const summary = clampText(input.summary ?? '', 320);
  const challenge = clampText(input.challenge ?? '', 600);
  const solution = clampText(input.solution ?? '', 600);
  const imageUrl = clampText(input.imageUrl ?? '', 300);
  const location = clampText(input.location ?? '', 80);
  const year = clampText(input.year ?? '', 10);

  if (title.length < 3) errors.title = 'Judul karya minimal 3 karakter.';
  if (client.length < 2) errors.client = 'Nama klien minimal 2 karakter.';
  if (!PORTFOLIO_CATEGORIES.includes(input.category)) errors.category = 'Kategori tidak valid.';
  if (metricLabel.length < 2) errors.metricLabel = 'Metrik hasil wajib diisi.';
  if (summary.length < 10) errors.summary = 'Ringkasan minimal 10 karakter.';
  if (challenge.length < 10) errors.challenge = 'Tantangan klien minimal 10 karakter.';
  if (solution.length < 10) errors.solution = 'Solusi kreatif minimal 10 karakter.';
  if (imageUrl.length < 5) errors.imageUrl = 'URL gambar wajib diisi.';
  if (location.length < 2) errors.location = 'Lokasi wajib diisi.';
  if (year.length < 4) errors.year = 'Tahun wajib diisi (4 karakter).';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      title,
      client,
      category: input.category,
      metricLabel,
      summary,
      challenge,
      solution,
      imageUrl,
      location,
      year,
      featured: Boolean(input.featured),
      published: Boolean(input.published),
      sortOrder: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 1,
    },
  };
}

export function validateTestimonialItem(
  input: Omit<TestimonialItem, 'id'>
): ValidationResult<Omit<TestimonialItem, 'id'>> {
  const errors: Record<string, string> = {};

  const clientName = clampText(input.clientName ?? '', 80);
  const role = clampText(input.role ?? '', 80);
  const company = clampText(input.company ?? '', 80);
  const city = clampText(input.city ?? '', 60);
  const quote = clampText(input.quote ?? '', 500);
  const outcome = clampText(input.outcome ?? '', 120);

  if (clientName.length < 2) errors.clientName = 'Nama klien minimal 2 karakter.';
  if (role.length < 2) errors.role = 'Jabatan minimal 2 karakter.';
  if (company.length < 2) errors.company = 'Perusahaan minimal 2 karakter.';
  if (city.length < 2) errors.city = 'Kota minimal 2 karakter.';
  if (quote.length < 10) errors.quote = 'Kutipan testimoni minimal 10 karakter.';
  if (outcome.length < 3) errors.outcome = 'Dampak terukur wajib diisi.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      clientName,
      role,
      company,
      city,
      quote,
      outcome,
      published: Boolean(input.published),
      sortOrder: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 1,
    },
  };
}

export function validateHostingPartnerItem(
  input: Omit<HostingPartnerItem, 'id'>
): ValidationResult<Omit<HostingPartnerItem, 'id'>> {
  const errors: Record<string, string> = {};

  const name = clampText(input.name ?? '', 80);
  const region = clampText(input.region ?? '', 60);
  const uptimeSla = clampText(input.uptimeSla ?? '', 20);
  const description = clampText(input.description ?? '', 300);
  const features = (input.features ?? [])
    .map((f) => clampText(f, 100))
    .filter((f) => f.length >= 2)
    .slice(0, 6);

  if (name.length < 2) errors.name = 'Nama paket/partner minimal 2 karakter.';
  if (!HOSTING_TIERS.includes(input.tier)) errors.tier = 'Tier hosting tidak valid.';
  if (region.length < 2) errors.region = 'Wilayah server wajib diisi.';
  if (uptimeSla.length < 2) errors.uptimeSla = 'SLA uptime wajib diisi.';
  if (description.length < 10) errors.description = 'Deskripsi minimal 10 karakter.';
  if (features.length < 1) errors.features = 'Minimal 1 fitur infrastruktur wajib diisi.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      name,
      tier: input.tier,
      region,
      uptimeSla,
      description,
      features,
      published: Boolean(input.published),
      sortOrder: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 1,
    },
  };
}

export function validateSiteSettings(input: SiteSettings): ValidationResult<SiteSettings> {
  const errors: Record<string, string> = {};

  const primaryHubName = clampText(input.primaryHubName ?? '', 80);
  const primaryAddress = clampText(input.primaryAddress ?? '', 200);
  const secondaryAddress = clampText(input.secondaryAddress ?? '', 200);
  const contactEmail = clampText(input.contactEmail ?? '', 120);
  const contactPhone = clampText(input.contactPhone ?? '', 30);
  const taglineId = clampText(input.taglineId ?? '', 120);
  const taglineEn = clampText(input.taglineEn ?? '', 120);
  const managementDisclaimerId = clampText(
    input.managementDisclaimerId ??
      'Kami berkantor di Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini.',
    300
  );
  const managementDisclaimerEn = clampText(
    input.managementDisclaimerEn ??
      'We operate within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id serving as our current Management Representative.',
    300
  );
  const adsenseClientId = clampText(input.adsenseClientId ?? '', 40);
  const adsenseBlogSlotId = clampText(input.adsenseBlogSlotId ?? '', 40);
  const adsenseArticleSlotId = clampText(input.adsenseArticleSlotId ?? '', 40);

  if (primaryHubName.length < 2) errors.primaryHubName = 'Basis utama minimal 2 karakter.';
  if (primaryAddress.length < 5) errors.primaryAddress = 'Alamat utama minimal 5 karakter.';
  if (secondaryAddress.length < 5) errors.secondaryAddress = 'Alamat perwakilan minimal 5 karakter.';
  if (contactEmail.length < 5 || !EMAIL_REGEX.test(contactEmail)) {
    errors.contactEmail = 'Masukkan email kontak yang valid.';
  }
  if (contactPhone.length < 6) errors.contactPhone = 'Nomor kontak minimal 6 karakter.';
  if (taglineId.length < 5) errors.taglineId = 'Tagline ID minimal 5 karakter.';
  if (taglineEn.length < 5) errors.taglineEn = 'Tagline EN minimal 5 karakter.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      primaryHubName,
      primaryAddress,
      secondaryAddress,
      contactEmail,
      contactPhone,
      taglineId,
      taglineEn,
      managementDisclaimerId,
      managementDisclaimerEn,
      adsenseClientId,
      adsenseBlogSlotId,
      adsenseArticleSlotId,
    },
  };
}

export function filterPortfolioByCategory(
  items: PortfolioItem[],
  category: PortfolioCategory | 'Semua'
): PortfolioItem[] {
  const published = items.filter((item) => item.published);
  const sorted = [...published].sort((a, b) => a.sortOrder - b.sortOrder);
  if (category === 'Semua') {
    return sorted;
  }
  return sorted.filter((item) => item.category === category);
}

export function normalizeSlug(input: string, fallback = 'artikel'): string {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return normalized.length >= 3 ? normalized : fallback;
}

export function validateBlogPost(
  input: Omit<BlogPost, 'id'>
): ValidationResult<Omit<BlogPost, 'id'>> {
  const errors: Record<string, string> = {};

  const slug = normalizeSlug(input.slug || input.titleId || 'artikel', 'artikel');
  const titleId = clampText(input.titleId ?? '', 140);
  const titleEn = clampText(input.titleEn || titleId, 140);
  const excerptId = clampText(input.excerptId ?? '', 360);
  const excerptEn = clampText(input.excerptEn || excerptId, 360);
  const contentId = clampText(input.contentId ?? '', 8000);
  const contentEn = clampText(input.contentEn || contentId, 8000);
  const author = clampText(input.author || 'Tim Editorial kotobatuah.com', 80);
  const coverImageUrl = clampText(input.coverImageUrl ?? '', 400);
  const seoTitle = clampText(input.seoTitle || titleId, 140);
  const seoDescription = clampText(input.seoDescription || excerptId, 320);
  const geoCity = clampText(input.geoCity || 'Tangerang Raya', 80);
  const publishedAt = clampText(input.publishedAt || '2026-11-26', 30);
  const tags = (input.tags ?? [])
    .map((t) => clampText(t, 40))
    .filter((t) => t.length >= 2)
    .slice(0, 6);

  if (tags.length === 0) {
    tags.push('Kotobatuah');
  }

  if (slug.length < 3 || !SLUG_REGEX.test(slug)) errors.slug = 'Slug artikel minimal 3 karakter (huruf kecil, angka, tanda hubung).';
  if (titleId.length < 3) errors.titleId = 'Judul artikel (ID) minimal 3 karakter.';
  if (titleEn.length < 3) errors.titleEn = 'Judul artikel (EN) minimal 3 karakter.';
  if (!BLOG_CATEGORIES.includes(input.category)) errors.category = 'Kategori blog tidak valid.';
  if (excerptId.length < 10) errors.excerptId = 'Ringkasan artikel (ID) minimal 10 karakter.';
  if (contentId.length < 20) errors.contentId = 'Konten artikel minimal 20 karakter.';
  if (coverImageUrl.length < 5) errors.coverImageUrl = 'URL gambar sampul wajib diisi.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const readMinutesRaw = Number(input.readMinutes);
  const readMinutes =
    Number.isFinite(readMinutesRaw) && readMinutesRaw >= 1 && readMinutesRaw <= 60
      ? Math.round(readMinutesRaw)
      : 4;

  return {
    valid: true,
    errors: {},
    sanitized: {
      slug,
      titleId,
      titleEn,
      excerptId,
      excerptEn,
      contentId,
      contentEn,
      category: input.category,
      author,
      coverImageUrl,
      tags,
      seoTitle,
      seoDescription,
      geoCity,
      readMinutes,
      featured: Boolean(input.featured),
      published: Boolean(input.published),
      publishedAt,
      source: input.source === 'google_sheets' ? 'google_sheets' : 'cms',
    },
  };
}

export function validateSheetsConfig(input: SheetsConfig): ValidationResult<SheetsConfig> {
  const errors: Record<string, string> = {};

  const spreadsheetId = clampText(input.spreadsheetId ?? '', 120);
  const spreadsheetTitle = clampText(input.spreadsheetTitle || 'Kotobatuah Blog CMS', 120);
  const spreadsheetUrl = clampText(
    input.spreadsheetUrl ||
      (spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : ''),
    300
  );
  const postsTab = clampText(input.postsTab ?? '', 80);
  const categoriesTab = clampText(input.categoriesTab ?? '', 80);
  const configTab = clampText(input.configTab ?? '', 80);
  const seoTab = clampText(input.seoTab ?? '', 80);
  const procedureTab = clampText(input.procedureTab ?? 'Procedure_Pages', 80) || 'Procedure_Pages';
  const lastSyncedAt = clampText(input.lastSyncedAt || '', 40);
  const countRaw = Number(input.lastSyncedCount);
  const lastSyncedCount = Number.isFinite(countRaw) && countRaw >= 0 ? Math.round(countRaw) : 0;

  if (spreadsheetId.length < 10 || !DOC_ID_REGEX.test(spreadsheetId)) {
    errors.spreadsheetId = 'Spreadsheet ID tidak valid (minimal 10 karakter alfanumerik/garis bawah/strip).';
  }
  if (postsTab.length < 1) errors.postsTab = 'Nama tab artikel blog wajib diisi.';
  if (categoriesTab.length < 1) errors.categoriesTab = 'Nama tab kategori wajib diisi.';
  if (configTab.length < 1) errors.configTab = 'Nama tab konfigurasi wajib diisi.';
  if (seoTab.length < 1) errors.seoTab = 'Nama tab SEO & GEO wajib diisi.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      spreadsheetId,
      spreadsheetTitle,
      spreadsheetUrl,
      postsTab,
      categoriesTab,
      configTab,
      seoTab,
      procedureTab,
      autoSyncEnabled: Boolean(input.autoSyncEnabled),
      lastSyncedAt,
      lastSyncedCount,
    },
  };
}

export function filterBlogsByCategory(
  posts: BlogPost[],
  category: BlogCategory | 'Semua'
): BlogPost[] {
  const published = posts.filter((p) => p.published);
  const sorted = [...published].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
  if (category === 'Semua') return sorted;
  return sorted.filter((p) => p.category === category);
}

export function validateProcedurePage(
  input: Omit<ProcedurePage, 'id'>
): ValidationResult<Omit<ProcedurePage, 'id'>> {
  const errors: Record<string, string> = {};
  const rawSlug = clampText((input.slug ?? '').replace(/^\/?procedure\//i, ''), 60).toLowerCase();
  const slug = (PROCEDURE_SLUGS.includes(rawSlug as ProcedureSlug)
    ? rawSlug
    : '') as ProcedureSlug;

  const titleId = clampText(input.titleId ?? '', 120);
  const titleEn = clampText(input.titleEn || titleId, 120);
  const summaryId = clampText(input.summaryId ?? '', 360);
  const summaryEn = clampText(input.summaryEn || summaryId, 360);
  const contentId = clampText(input.contentId ?? '', 8000);
  const contentEn = clampText(input.contentEn || contentId, 8000);
  const updatedAt = clampText(input.updatedAt || '2026-11-26', 30);

  if (!slug) {
    errors.slug = 'Slug prosedur harus salah satu dari: disclaimers, tos, privacy-policy, cookies.';
  }
  if (titleId.length < 3) errors.titleId = 'Judul halaman prosedur minimal 3 karakter.';
  if (summaryId.length < 10) errors.summaryId = 'Ringkasan prosedur minimal 10 karakter.';
  if (contentId.length < 20) errors.contentId = 'Isi dokumen prosedur minimal 20 karakter.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      slug,
      titleId,
      titleEn,
      summaryId,
      summaryEn,
      contentId,
      contentEn,
      updatedAt,
      published: Boolean(input.published),
      source: input.source === 'google_sheets' ? 'google_sheets' : 'cms',
    },
  };
}
