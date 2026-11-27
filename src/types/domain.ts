export type Locale = 'id' | 'en';

export type PortfolioCategory =
  | 'OOH & Billboard'
  | 'Kampanye Digital'
  | 'Branding & Identitas'
  | 'Produksi Video';

export type HostingTier =
  | 'Edge CDN'
  | 'Cloud Managed'
  | 'Dedicated Media'
  | 'Enterprise Security';

export type LeadServiceType =
  | 'OOH & Billboard'
  | 'Kampanye Digital'
  | 'Branding & Identitas'
  | 'Produksi Video'
  | 'Partner Hosting & CMS';

export type LeadBudgetRange =
  | '< Rp 25 Juta'
  | 'Rp 25 - 75 Juta'
  | 'Rp 75 - 200 Juta'
  | '> Rp 200 Juta';

export type LeadStatus = 'baru' | 'dihubungi' | 'proposal' | 'selesai';

export type LeadSource = 'homepage_form' | 'chatbot_handoff' | 'portfolio_cta';

export interface SiteSettings {
  primaryHubName: string;
  primaryAddress: string;
  secondaryAddress: string;
  contactEmail: string;
  contactPhone: string;
  taglineId: string;
  taglineEn: string;
  managementDisclaimerId?: string;
  managementDisclaimerEn?: string;
  adsenseClientId?: string;
  adsenseBlogSlotId?: string;
  adsenseArticleSlotId?: string;
}

export type ProcedureSlug = 'disclaimers' | 'tos' | 'privacy-policy' | 'cookies';

export interface ProcedurePage {
  id: string;
  slug: ProcedureSlug;
  titleId: string;
  titleEn: string;
  summaryId: string;
  summaryEn: string;
  contentId: string;
  contentEn: string;
  updatedAt: string;
  published: boolean;
  source: BlogSource;
}

export const PROCEDURE_SLUGS: readonly ProcedureSlug[] = [
  'disclaimers',
  'tos',
  'privacy-policy',
  'cookies',
];

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: PortfolioCategory;
  metricLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  imageUrl: string;
  location: string;
  year: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  city: string;
  quote: string;
  outcome: string;
  published: boolean;
  sortOrder: number;
}

export interface HostingPartnerItem {
  id: string;
  name: string;
  tier: HostingTier;
  region: string;
  uptimeSla: string;
  description: string;
  features: string[];
  published: boolean;
  sortOrder: number;
}

export interface LeadInquiryInput {
  fullName: string;
  company: string;
  email: string;
  whatsapp: string;
  serviceType: LeadServiceType;
  budgetRange: LeadBudgetRange;
  city: string;
  brief: string;
  source: LeadSource;
}

export interface LeadInquiryRecord extends LeadInquiryInput {
  id: string;
  status: LeadStatus;
  createdAtLabel?: string;
}

export interface GeoRegionProfile {
  id: string;
  regionLabel: string;
  regionLabelEn: string;
  hubCity: string;
  oohInventoryCount: string;
  oohInventoryCountEn: string;
  avgLoadLatency: string;
  localSearchLift: string;
  localSearchLiftEn: string;
  summary: string;
  summaryEn: string;
  targetKeywords: string[];
  recommendedChannels: string[];
  recommendedChannelsEn: string[];
}

export type BlogCategory =
  | 'Strategi OOH'
  | 'SEO & GEO'
  | 'Performance Ads'
  | 'Partner Hosting';

export type BlogSource = 'google_sheets' | 'cms';

export interface BlogPost {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  category: BlogCategory;
  author: string;
  coverImageUrl: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  geoCity: string;
  readMinutes: number;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  source: BlogSource;
}

export interface SheetsConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  postsTab: string;
  categoriesTab: string;
  configTab: string;
  seoTab: string;
  procedureTab?: string;
  autoSyncEnabled: boolean;
  lastSyncedAt: string;
  lastSyncedCount: number;
}

export interface DriveSpreadsheetSummary {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SpreadsheetTabInfo {
  sheetId: number;
  title: string;
  index: number;
}

export interface SheetCategoryRow {
  name: string;
  slug: string;
  descriptionId: string;
  descriptionEn: string;
  targetCtaService: LeadServiceType;
}

export interface SheetSeoKeywordRow {
  city: string;
  keyword: string;
  intent: string;
  targetSlug: string;
  priority: string;
}

export const PORTFOLIO_CATEGORIES: readonly PortfolioCategory[] = [
  'OOH & Billboard',
  'Kampanye Digital',
  'Branding & Identitas',
  'Produksi Video',
];

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'Strategi OOH',
  'SEO & GEO',
  'Performance Ads',
  'Partner Hosting',
];

export const HOSTING_TIERS: readonly HostingTier[] = [
  'Edge CDN',
  'Cloud Managed',
  'Dedicated Media',
  'Enterprise Security',
];

export const LEAD_SERVICES: readonly LeadServiceType[] = [
  'OOH & Billboard',
  'Kampanye Digital',
  'Branding & Identitas',
  'Produksi Video',
  'Partner Hosting & CMS',
];

export const LEAD_BUDGET_RANGES: readonly LeadBudgetRange[] = [
  '< Rp 25 Juta',
  'Rp 25 - 75 Juta',
  'Rp 75 - 200 Juta',
  '> Rp 200 Juta',
];

export const LEAD_STATUSES: readonly LeadStatus[] = [
  'baru',
  'dihubungi',
  'proposal',
  'selesai',
];

export const ADMIN_EMAIL = 'yames.isa@gmail.com';
