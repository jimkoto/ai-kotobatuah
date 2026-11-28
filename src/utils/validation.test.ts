import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DOC_ID_REGEX,
  filterBlogsByCategory,
  filterPortfolioByCategory,
  slugifyId,
  validateBlogPost,
  validateHostingPartnerItem,
  validateLeadInquiry,
  validatePortfolioItem,
  validateProcedurePage,
  validateSheetsConfig,
  validateSiteSettings,
} from './validation';
import {
  BLOG_POSTS_HEADERS,
  PROCEDURE_PAGES_HEADERS,
  buildBlogTemplateSheetsPayload,
  extractSpreadsheetId,
  parseBlogCategoriesFromSheet,
  parseBlogSheetRows,
  parseProcedurePagesFromSheet,
  parseSeoKeywordsFromSheet,
  parseSiteConfigFromSheet,
  procedurePageToSheetRow,
} from './sheetsParser';
import { generateStandardChatReply } from './chatFallback';
import {
  DEFAULT_SITE_SETTINGS,
  SEED_BLOG_POSTS,
  SEED_PROCEDURE_PAGES,
} from '../data/seedData';
import type { PortfolioItem } from '../types/domain';

test('validateLeadInquiry rejects empty or malformed fields', () => {
  const result = validateLeadInquiry({
    fullName: 'A',
    company: '',
    email: 'not-an-email',
    whatsapp: 'abc',
    serviceType: 'OOH & Billboard',
    budgetRange: 'Rp 25 - 75 Juta',
    city: '',
    brief: 'Pendek',
    source: 'homepage_form',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.company);
  assert.ok(result.errors.email);
  assert.ok(result.errors.whatsapp);
  assert.ok(result.errors.city);
  assert.ok(result.errors.brief);
});

test('validateLeadInquiry accepts and trims valid inquiry payload', () => {
  const result = validateLeadInquiry({
    fullName: '  Rizky Pratama  ',
    company: 'PT Andalas Kopi Nusantara',
    email: 'rizky@andalaskopi.co.id',
    whatsapp: '+62 812-7700-4411',
    serviceType: 'Kampanye Digital',
    budgetRange: 'Rp 75 - 200 Juta',
    city: 'Tangerang Raya & Jakarta',
    brief: 'Kami ingin meluncurkan kampanye digital dan billboard di 4 titik strategis bulan depan.',
    source: 'homepage_form',
  });

  assert.equal(result.valid, true);
  assert.equal(result.sanitized?.fullName, 'Rizky Pratama');
  assert.equal(result.sanitized?.email, 'rizky@andalaskopi.co.id');
});

test('validatePortfolioItem enforces schema boundaries', () => {
  const invalid = validatePortfolioItem({
    title: 'Hi',
    client: 'A',
    category: 'OOH & Billboard',
    metricLabel: '1',
    summary: 'Short',
    challenge: 'Short',
    solution: 'Short',
    imageUrl: 'x',
    location: 'P',
    year: '26',
    featured: true,
    published: true,
    sortOrder: 1,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.summary);
});

test('validateHostingPartnerItem bounds features to max 6 items', () => {
  const result = validateHostingPartnerItem({
    name: 'KotoCloud Edge Pro',
    tier: 'Edge CDN',
    region: 'Jakarta & Singapura',
    uptimeSla: '99.99%',
    description: 'Infrastruktur hosting berkecepatan tinggi untuk kampanye iklan nasional.',
    features: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'],
    published: true,
    sortOrder: 1,
  });

  assert.equal(result.valid, true);
  assert.equal(result.sanitized?.features.length, 6);
});

test('validateSiteSettings accepts default Tangerang Raya settings and rejects invalid email/short hub', () => {
  const valid = validateSiteSettings(DEFAULT_SITE_SETTINGS);
  assert.equal(valid.valid, true);
  assert.equal(valid.sanitized?.primaryHubName, 'Tangerang Raya');

  const invalid = validateSiteSettings({
    ...DEFAULT_SITE_SETTINGS,
    primaryHubName: 'A',
    contactEmail: 'invalid-email',
    primaryAddress: 'abc',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.primaryHubName);
  assert.ok(invalid.errors.contactEmail);
  assert.ok(invalid.errors.primaryAddress);
});

test('filterPortfolioByCategory filters published items and preserves sortOrder', () => {
  const sample: PortfolioItem[] = [
    {
      id: '2',
      title: 'Kampanye B',
      client: 'Client B',
      category: 'Kampanye Digital',
      metricLabel: '+120% Leads',
      summary: 'Ringkasan kampanye digital terpadu.',
      challenge: 'Tantangan akuisisi leads di pasar lokal.',
      solution: 'Landing page cepat + iklan pencarian lokal.',
      imageUrl: '/src/assets/images/test.jpg',
      location: 'Jakarta',
      year: '2026',
      featured: true,
      published: true,
      sortOrder: 2,
    },
    {
      id: '1',
      title: 'Kampanye A',
      client: 'Client A',
      category: 'OOH & Billboard',
      metricLabel: '+200% Recall',
      summary: 'Ringkasan kampanye billboard LED.',
      challenge: 'Tantangan visibilitas koridor utama.',
      solution: 'Placement LED videotron di persimpangan utama.',
      imageUrl: '/src/assets/images/test2.jpg',
      location: 'Tangerang Raya',
      year: '2026',
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      id: '3',
      title: 'Draft C',
      client: 'Client C',
      category: 'OOH & Billboard',
      metricLabel: '+50% Reach',
      summary: 'Draft yang belum dipublikasikan.',
      challenge: 'Tantangan draft.',
      solution: 'Solusi draft.',
      imageUrl: '/src/assets/images/test3.jpg',
      location: 'Bandung',
      year: '2026',
      featured: false,
      published: false,
      sortOrder: 0,
    },
  ];

  const all = filterPortfolioByCategory(sample, 'Semua');
  assert.equal(all.length, 2);
  assert.equal(all[0].id, '1');

  const ooh = filterPortfolioByCategory(sample, 'OOH & Billboard');
  assert.equal(ooh.length, 1);
  assert.equal(ooh[0].id, '1');
});

test('slugifyId generates Firestore-safe document IDs', () => {
  const id = slugifyId('Kampanye Kopi Sudirman 2026!!', 'lead');
  assert.match(id, DOC_ID_REGEX);
  assert.ok(id.length <= 128);
});

test('extractSpreadsheetId parses full Google Sheets URLs and raw IDs', () => {
  assert.equal(
    extractSpreadsheetId(
      'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0'
    ),
    '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  );
  assert.equal(
    extractSpreadsheetId('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'),
    '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  );
  assert.equal(extractSpreadsheetId('   '), '');
});

test('parseBlogSheetRows parses valid rows and reports skipped invalid rows', () => {
  const rows: string[][] = [
    [...BLOG_POSTS_HEADERS],
    [
      'post-1',
      'strategi-billboard-bsd',
      'Strategi Billboard BSD City 2026',
      'BSD City Billboard Strategy 2026',
      'Ringkasan strategi billboard di Tangerang Raya yang terukur.',
      'Measured billboard strategy summary.',
      'Konten lengkap strategi penempatan videotron LED di koridor BSD City Tangerang Raya untuk B2B.',
      'Complete LED videotron strategy content in BSD City Tangerang Raya for B2B leads.',
      'Strategi OOH',
      'Tim Koto',
      '/src/assets/images/zafran_coffee_billboard_1795681798711.jpg',
      'BSD City, OOH, Leads',
      'Strategi Billboard BSD',
      'Deskripsi SEO billboard BSD.',
      'Tangerang Raya',
      '5',
      'TRUE',
      'TRUE',
      '2026-11-26',
    ],
    [
      'bad-row',
      'x',
      'No',
      '',
      'Pendek',
      '',
      'Too short',
      '',
      'SEO & GEO',
      '',
      '',
      '',
      '',
      '',
      '',
      '4',
      'FALSE',
      'TRUE',
      '',
    ],
  ];

  const parsed = parseBlogSheetRows(rows);
  assert.equal(parsed.posts.length, 1);
  assert.equal(parsed.posts[0].slug, 'strategi-billboard-bsd');
  assert.equal(parsed.posts[0].source, 'google_sheets');
  assert.equal(parsed.posts[0].featured, true);
  assert.equal(parsed.skipped.length, 1);
  assert.equal(parsed.skipped[0].rowNumber, 3);
});

test('parseSiteConfigFromSheet updates known keys cleanly without breaking fallback', () => {
  const rows: string[][] = [
    ['key', 'value', 'description'],
    ['primaryHubName', 'Serpong & BSD', 'Main hub'],
    ['contactPhone', '+62 813-2441-2025', 'Phone'],
    ['unknownKey', 'IgnoredValue', 'Noise'],
  ];

  const { config, matchedKeys } = parseSiteConfigFromSheet(rows, DEFAULT_SITE_SETTINGS);
  assert.equal(config.primaryHubName, 'Serpong & BSD');
  assert.equal(config.contactPhone, '+62 813-2441-2025');
  assert.equal(config.contactEmail, DEFAULT_SITE_SETTINGS.contactEmail);
  assert.deepEqual(matchedKeys, ['primaryHubName', 'contactPhone']);
});

test('parseBlogCategoriesFromSheet, parseSeoKeywordsFromSheet, and parseProcedurePagesFromSheet parse 5-tab template structures', () => {
  const payload = buildBlogTemplateSheetsPayload(
    DEFAULT_SITE_SETTINGS,
    SEED_BLOG_POSTS,
    SEED_PROCEDURE_PAGES
  );
  assert.equal(payload.tabs.length, 5);

  const catTab = payload.tabs.find((t) => t.name === 'Blog_Categories');
  const seoTab = payload.tabs.find((t) => t.name === 'SEO_GEO_Keywords');
  const procTab = payload.tabs.find((t) => t.name === 'Procedure_Pages');
  assert.ok(catTab && seoTab && procTab);

  const categories = parseBlogCategoriesFromSheet(catTab.rows);
  const seoKeywords = parseSeoKeywordsFromSheet(seoTab.rows);
  const procedures = parseProcedurePagesFromSheet(procTab.rows);
  assert.equal(categories.length, 4);
  assert.equal(seoKeywords.length, 4);
  assert.equal(seoKeywords[0].city, 'Tangerang Raya');
  assert.equal(procedures.pages.length, 4);
  assert.equal(procedures.skipped.length, 0);
});

test('validateBlogPost, validateProcedurePage, validateSheetsConfig, and filterBlogsByCategory enforce domain bounds', () => {
  const validBlog = validateBlogPost(SEED_BLOG_POSTS[0]);
  assert.equal(validBlog.valid, true);

  const validProc = validateProcedurePage(SEED_PROCEDURE_PAGES[0]);
  assert.equal(validProc.valid, true);

  const parsedProcWithSkip = parseProcedurePagesFromSheet([
    [...PROCEDURE_PAGES_HEADERS],
    procedurePageToSheetRow(SEED_PROCEDURE_PAGES[0]),
    ['invalid-slug', 'Bad', 'Bad', 'Short summary', 'Short summary', 'Not enough text', '', '', 'TRUE'],
  ]);
  assert.equal(parsedProcWithSkip.pages.length, 1);
  assert.equal(parsedProcWithSkip.skipped.length, 1);

  const badSheetsCfg = validateSheetsConfig({
    spreadsheetId: 'short',
    spreadsheetTitle: 'Sheet',
    spreadsheetUrl: '',
    postsTab: '',
    categoriesTab: 'Blog_Categories',
    configTab: 'Site_Config',
    seoTab: 'SEO_GEO_Keywords',
    autoSyncEnabled: true,
    lastSyncedAt: '',
    lastSyncedCount: 0,
  });
  assert.equal(badSheetsCfg.valid, false);
  assert.ok(badSheetsCfg.errors.spreadsheetId);
  assert.ok(badSheetsCfg.errors.postsTab);

  const filtered = filterBlogsByCategory(SEED_BLOG_POSTS, 'SEO & GEO');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].category, 'SEO & GEO');
});

test('parseSiteConfigFromSheet parses disclaimer and Google AdSense settings', () => {
  const rows: string[][] = [
    ['key', 'value', 'description'],
    ['managementDisclaimerId', 'Kantor Akomoda Network · Rep: James Isa', 'Disclaimer'],
    ['adsenseClientId', 'ca-pub-1234567890123456', 'Publisher ID'],
    ['adsenseBlogSlotId', '1122334455', 'Blog Slot'],
  ];

  const { config, matchedKeys } = parseSiteConfigFromSheet(rows, DEFAULT_SITE_SETTINGS);
  assert.equal(config.managementDisclaimerId, 'Kantor Akomoda Network · Rep: James Isa');
  assert.equal(config.adsenseClientId, 'ca-pub-1234567890123456');
  assert.equal(config.adsenseBlogSlotId, '1122334455');
  assert.deepEqual(matchedKeys, ['managementDisclaimerId', 'adsenseClientId', 'adsenseBlogSlotId']);
});

test('generateStandardChatReply handles bilingual keyword queries and fallback cleanly', () => {
  const billboardReply = generateStandardChatReply(
    'Estimasi harga billboard di Tangerang Raya?',
    'id',
    DEFAULT_SITE_SETTINGS
  );
  assert.match(billboardReply, /OOH|Videotron/i);
  assert.match(billboardReply, /Tangerang Raya/i);

  const officeReply = generateStandardChatReply(
    'Dimana kantor akomoda network dan jimkoto?',
    'id',
    DEFAULT_SITE_SETTINGS
  );
  assert.match(officeReply, /Akomoda Network/i);
  assert.match(officeReply, /Jimkoto\.my\.id/i);

  const enSeoReply = generateStandardChatReply(
    'How does local SEO and Google Maps GEO work?',
    'en',
    DEFAULT_SITE_SETTINGS
  );
  assert.match(enSeoReply, /Schema\.org/i);

  const fallbackReply = generateStandardChatReply('random query xyz', 'id', DEFAULT_SITE_SETTINGS);
  assert.match(fallbackReply, /kotobatuah\.com/);
});

test('project-based defaults omit fabricated physical street addresses and unverified testimonials', async () => {
  const { SEED_PORTFOLIO, SEED_TESTIMONIALS } = await import('../data/seedData');
  assert.equal(SEED_TESTIMONIALS.length, 0);
  assert.doesNotMatch(DEFAULT_SITE_SETTINGS.primaryAddress, /BSD Green Office/i);
  assert.doesNotMatch(DEFAULT_SITE_SETTINGS.secondaryAddress, /Treasury Tower|SCBD/i);
  assert.match(DEFAULT_SITE_SETTINGS.primaryAddress, /Project-Based/i);
  for (const item of SEED_PORTFOLIO) {
    assert.doesNotMatch(item.client, /Axon Nusantara|Aurum & Stone|Dapur Ranah/i);
  }
});

test('buildWhatsAppUrl formats Indonesian phone numbers and prefilled messages accurately', async () => {
  const { formatWhatsAppNumber, buildWhatsAppUrl } = await import('./whatsapp');
  assert.equal(formatWhatsAppNumber('+62 813-2441-2025'), '6281324412025');
  assert.equal(formatWhatsAppNumber('0813-2441-2025'), '6281324412025');
  assert.equal(formatWhatsAppNumber(''), '6281324412025');

  const url = buildWhatsAppUrl(
    DEFAULT_SITE_SETTINGS.contactPhone,
    'Halo Koto Batuah, saya ingin konsultasi persiapan aset digital untuk 2027. Boleh info alur dan slot terdekatnya?'
  );
  assert.equal(
    url,
    'https://wa.me/6281324412025?text=Halo%20Koto%20Batuah%2C%20saya%20ingin%20konsultasi%20persiapan%20aset%20digital%20untuk%202027.%20Boleh%20info%20alur%20dan%20slot%20terdekatnya%3F'
  );
});

test('2027 landing page copy preserves exact badge, packages, E-E-A-T, and FAQ in ID and EN', async () => {
  const { COPY } = await import('../i18n/translations');
  assert.equal(COPY.id.hero.badge, 'SIAP AKSELERASI DIGITAL 2027 • KOTO BATUAH');
  assert.equal(COPY.id.packages2027.items.length, 3);
  assert.equal(COPY.en.packages2027.items.length, 3);
  assert.equal(COPY.id.faqClosing.items.length, 3);
  assert.equal(COPY.en.faqClosing.items.length, 3);

  const packageReply = generateStandardChatReply(
    'Info paket website bisnis kilat 2027',
    'id',
    DEFAULT_SITE_SETTINGS
  );
  assert.match(packageReply, /Website Bisnis Kilat 2027/);
  assert.match(packageReply, /Audit & Optimasi Web \+ SEO\/GEO/);
});


