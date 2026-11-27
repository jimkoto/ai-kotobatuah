import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  DEFAULT_SITE_SETTINGS,
  SEED_BLOG_POSTS,
  SEED_HOSTING_PARTNERS,
  SEED_PORTFOLIO,
  SEED_PROCEDURE_PAGES,
  SEED_TESTIMONIALS,
} from '../data/seedData';
import type {
  BlogCategory,
  BlogPost,
  HostingPartnerItem,
  LeadInquiryInput,
  LeadInquiryRecord,
  LeadStatus,
  PortfolioItem,
  ProcedurePage,
  ProcedureSlug,
  SheetsConfig,
  SiteSettings,
  TestimonialItem,
} from '../types/domain';
import {
  normalizeSlug,
  slugifyId,
  validateBlogPost,
  validateHostingPartnerItem,
  validateLeadInquiry,
  validatePortfolioItem,
  validateProcedurePage,
  validateSheetsConfig,
  validateSiteSettings,
  validateTestimonialItem,
} from '../utils/validation';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

function formatTimestamp(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'Baru saja';
}

const LEGACY_PLACEHOLDER_PORTFOLIO_CLIENTS = new Set([
  'Axon Nusantara Systems',
  'Aurum & Stone Atelier',
  'Dapur Ranah Heritage',
]);

export function subscribePublishedPortfolio(
  onData: (items: PortfolioItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'portfolio';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(SEED_PORTFOLIO);
        return;
      }
      const items: PortfolioItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        const client = String(data.client ?? '');
        const metricLabel = String(data.metricLabel ?? '');
        if (
          LEGACY_PLACEHOLDER_PORTFOLIO_CLIENTS.has(client) ||
          (d.id === 'ooh-sudirman-arabica-2026' && metricLabel === '+185% Brand Recall Lokal')
        ) {
          const cleanSeed = SEED_PORTFOLIO.find((item) => item.id === d.id);
          if (cleanSeed) return cleanSeed;
        }
        return {
          id: d.id,
          title: String(data.title ?? ''),
          client,
          category: data.category,
          metricLabel,
          summary: String(data.summary ?? ''),
          challenge: String(data.challenge ?? ''),
          solution: String(data.solution ?? ''),
          imageUrl: String(data.imageUrl ?? ''),
          location: String(data.location ?? ''),
          year: String(data.year ?? '2026'),
          featured: Boolean(data.featured),
          published: Boolean(data.published),
          sortOrder: Number(data.sortOrder ?? 0),
        };
      });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

const LEGACY_PLACEHOLDER_TESTIMONIAL_IDS = new Set([
  'testi-andalas-kopi',
  'testi-axon-nusantara',
  'testi-ranah-heritage',
]);

export function subscribePublishedTestimonials(
  onData: (items: TestimonialItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'testimonials';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(SEED_TESTIMONIALS);
        return;
      }
      const items: TestimonialItem[] = snapshot.docs
        .filter((d) => !LEGACY_PLACEHOLDER_TESTIMONIAL_IDS.has(d.id))
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            clientName: String(data.clientName ?? ''),
            role: String(data.role ?? ''),
            company: String(data.company ?? ''),
            city: String(data.city ?? ''),
            quote: String(data.quote ?? ''),
            outcome: String(data.outcome ?? ''),
            published: Boolean(data.published),
            sortOrder: Number(data.sortOrder ?? 0),
          };
        });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export function subscribePublishedHostingPartners(
  onData: (items: HostingPartnerItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'hostingPartners';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(SEED_HOSTING_PARTNERS);
        return;
      }
      const items: HostingPartnerItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ''),
          tier: data.tier,
          region: String(data.region ?? ''),
          uptimeSla: String(data.uptimeSla ?? ''),
          description: String(data.description ?? ''),
          features: Array.isArray(data.features) ? data.features.map(String) : [],
          published: Boolean(data.published),
          sortOrder: Number(data.sortOrder ?? 0),
        };
      });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export async function submitLeadInquiry(
  input: LeadInquiryInput
): Promise<{ id: string; referenceCode: string }> {
  const validation = validateLeadInquiry(input);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data formulir tidak valid.');
  }

  const leadId = slugifyId(`${validation.sanitized.company}-${validation.sanitized.fullName}`, 'lead');
  const path = `leads/${leadId}`;

  try {
    await setDoc(doc(db, 'leads', leadId), {
      ...validation.sanitized,
      status: 'baru',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id: leadId,
      referenceCode: leadId.toUpperCase().slice(0, 14),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// --- Admin CMS Subscriptions & Mutations ---

export function subscribeAllPortfolioAdmin(
  onData: (items: PortfolioItem[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'portfolio';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: PortfolioItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: String(data.title ?? ''),
          client: String(data.client ?? ''),
          category: data.category,
          metricLabel: String(data.metricLabel ?? ''),
          summary: String(data.summary ?? ''),
          challenge: String(data.challenge ?? ''),
          solution: String(data.solution ?? ''),
          imageUrl: String(data.imageUrl ?? ''),
          location: String(data.location ?? ''),
          year: String(data.year ?? '2026'),
          featured: Boolean(data.featured),
          published: Boolean(data.published),
          sortOrder: Number(data.sortOrder ?? 0),
        };
      });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      onError(error);
    }
  );
}

export function subscribeAllTestimonialsAdmin(
  onData: (items: TestimonialItem[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'testimonials';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: TestimonialItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          clientName: String(data.clientName ?? ''),
          role: String(data.role ?? ''),
          company: String(data.company ?? ''),
          city: String(data.city ?? ''),
          quote: String(data.quote ?? ''),
          outcome: String(data.outcome ?? ''),
          published: Boolean(data.published),
          sortOrder: Number(data.sortOrder ?? 0),
        };
      });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      onError(error);
    }
  );
}

export function subscribeAllHostingAdmin(
  onData: (items: HostingPartnerItem[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'hostingPartners';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: HostingPartnerItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ''),
          tier: data.tier,
          region: String(data.region ?? ''),
          uptimeSla: String(data.uptimeSla ?? ''),
          description: String(data.description ?? ''),
          features: Array.isArray(data.features) ? data.features.map(String) : [],
          published: Boolean(data.published),
          sortOrder: Number(data.sortOrder ?? 0),
        };
      });
      onData(items.sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      onError(error);
    }
  );
}

export function subscribeAllLeadsAdmin(
  onData: (items: LeadInquiryRecord[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'leads';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: LeadInquiryRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          fullName: String(data.fullName ?? ''),
          company: String(data.company ?? ''),
          email: String(data.email ?? ''),
          whatsapp: String(data.whatsapp ?? ''),
          serviceType: data.serviceType,
          budgetRange: data.budgetRange,
          city: String(data.city ?? ''),
          brief: String(data.brief ?? ''),
          status: data.status as LeadStatus,
          source: data.source,
          createdAtLabel: formatTimestamp(data.createdAt),
        };
      });
      onData(items);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function upsertPortfolioItem(item: PortfolioItem): Promise<string> {
  const { id, ...rest } = item;
  const validation = validatePortfolioItem(rest);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data portofolio tidak valid.');
  }
  const docId = id && id.trim().length > 0 ? id : slugifyId(validation.sanitized.title, 'karya');
  const docRef = doc(db, 'portfolio', docId);
  const path = `portfolio/${docId}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...validation.sanitized,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...validation.sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const path = `portfolio/${id}`;
  try {
    await deleteDoc(doc(db, 'portfolio', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertTestimonialItem(item: TestimonialItem): Promise<string> {
  const { id, ...rest } = item;
  const validation = validateTestimonialItem(rest);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data testimoni tidak valid.');
  }
  const docId = id && id.trim().length > 0 ? id : slugifyId(validation.sanitized.company, 'testi');
  const docRef = doc(db, 'testimonials', docId);
  const path = `testimonials/${docId}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...validation.sanitized,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...validation.sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTestimonialItem(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertHostingPartnerItem(item: HostingPartnerItem): Promise<string> {
  const { id, ...rest } = item;
  const validation = validateHostingPartnerItem(rest);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data partner hosting tidak valid.');
  }
  const docId = id && id.trim().length > 0 ? id : slugifyId(validation.sanitized.name, 'hosting');
  const docRef = doc(db, 'hostingPartners', docId);
  const path = `hostingPartners/${docId}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...validation.sanitized,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...validation.sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteHostingPartnerItem(id: string): Promise<void> {
  const path = `hostingPartners/${id}`;
  try {
    await deleteDoc(doc(db, 'hostingPartners', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  const path = `leads/${leadId}`;
  try {
    await updateDoc(doc(db, 'leads', leadId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

const LEGACY_PLACEHOLDER_ADDRESSES = new Set([
  'BSD Green Office Park, Tangerang Raya, Banten 15345',
  'District 8 Treasury Tower Lt. 12, SCBD, Jakarta Selatan',
]);

export function subscribeSiteSettings(
  onData: (settings: SiteSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'siteSettings/main';
  return onSnapshot(
    doc(db, 'siteSettings', 'main'),
    (snap) => {
      if (!snap.exists()) {
        onData(DEFAULT_SITE_SETTINGS);
        return;
      }
      const data = snap.data();
      const rawPrimaryAddress = String(data.primaryAddress ?? '');
      const rawSecondaryAddress = String(data.secondaryAddress ?? '');
      onData({
        primaryHubName: String(data.primaryHubName ?? DEFAULT_SITE_SETTINGS.primaryHubName),
        primaryAddress:
          !rawPrimaryAddress || LEGACY_PLACEHOLDER_ADDRESSES.has(rawPrimaryAddress)
            ? DEFAULT_SITE_SETTINGS.primaryAddress
            : rawPrimaryAddress,
        secondaryAddress:
          !rawSecondaryAddress || LEGACY_PLACEHOLDER_ADDRESSES.has(rawSecondaryAddress)
            ? DEFAULT_SITE_SETTINGS.secondaryAddress
            : rawSecondaryAddress,
        contactEmail: String(data.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail),
        contactPhone: String(data.contactPhone ?? DEFAULT_SITE_SETTINGS.contactPhone),
        taglineId: String(data.taglineId ?? DEFAULT_SITE_SETTINGS.taglineId),
        taglineEn: String(data.taglineEn ?? DEFAULT_SITE_SETTINGS.taglineEn),
        managementDisclaimerId: String(
          data.managementDisclaimerId ?? DEFAULT_SITE_SETTINGS.managementDisclaimerId ?? ''
        ),
        managementDisclaimerEn: String(
          data.managementDisclaimerEn ?? DEFAULT_SITE_SETTINGS.managementDisclaimerEn ?? ''
        ),
        adsenseClientId: String(data.adsenseClientId ?? DEFAULT_SITE_SETTINGS.adsenseClientId ?? ''),
        adsenseBlogSlotId: String(
          data.adsenseBlogSlotId ?? DEFAULT_SITE_SETTINGS.adsenseBlogSlotId ?? ''
        ),
        adsenseArticleSlotId: String(
          data.adsenseArticleSlotId ?? DEFAULT_SITE_SETTINGS.adsenseArticleSlotId ?? ''
        ),
      });
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const validation = validateSiteSettings(settings);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Pengaturan situs tidak valid.');
  }
  const path = 'siteSettings/main';
  try {
    await setDoc(doc(db, 'siteSettings', 'main'), {
      ...validation.sanitized,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedInitialCatalogToFirestore(): Promise<void> {
  const batch = writeBatch(db);
  for (const item of SEED_PORTFOLIO) {
    const { id, ...rest } = item;
    batch.set(doc(db, 'portfolio', id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  for (const t of SEED_TESTIMONIALS) {
    const { id, ...rest } = t;
    batch.set(doc(db, 'testimonials', id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  for (const h of SEED_HOSTING_PARTNERS) {
    const { id, ...rest } = h;
    batch.set(doc(db, 'hostingPartners', id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  for (const post of SEED_BLOG_POSTS) {
    const { id, ...rest } = post;
    batch.set(doc(db, 'blogPosts', id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  for (const page of SEED_PROCEDURE_PAGES) {
    const { id, updatedAt, ...rest } = page;
    batch.set(doc(db, 'procedurePages', id), {
      ...rest,
      effectiveDate: updatedAt,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  batch.set(doc(db, 'siteSettings', 'main'), {
    ...DEFAULT_SITE_SETTINGS,
    updatedAt: serverTimestamp(),
  });
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch_seed');
  }
}

function mapDocToBlogPost(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    slug: String(data.slug ?? id),
    titleId: String(data.titleId ?? ''),
    titleEn: String(data.titleEn ?? data.titleId ?? ''),
    excerptId: String(data.excerptId ?? ''),
    excerptEn: String(data.excerptEn ?? data.excerptId ?? ''),
    contentId: String(data.contentId ?? ''),
    contentEn: String(data.contentEn ?? data.contentId ?? ''),
    category: (data.category as BlogCategory) ?? 'Performance Ads',
    author: String(data.author ?? 'Tim Editorial kotobatuah.com'),
    coverImageUrl: String(
      data.coverImageUrl ?? '/src/assets/images/portfolio_digital_campaign_1795655952843.jpg'
    ),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : ['Kotobatuah'],
    seoTitle: String(data.seoTitle ?? data.titleId ?? ''),
    seoDescription: String(data.seoDescription ?? data.excerptId ?? ''),
    geoCity: String(data.geoCity ?? 'Tangerang Raya'),
    readMinutes: Number(data.readMinutes ?? 4),
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    publishedAt: String(data.publishedAt ?? '2026-11-26'),
    source: data.source === 'google_sheets' ? 'google_sheets' : 'cms',
  };
}

export function subscribePublishedBlogPosts(
  onData: (posts: BlogPost[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'blogPosts';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(SEED_BLOG_POSTS);
        return;
      }
      const posts = snapshot.docs.map((d) => mapDocToBlogPost(d.id, d.data()));
      posts.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.publishedAt.localeCompare(a.publishedAt);
      });
      onData(posts);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export function subscribeAllBlogPostsAdmin(
  onData: (posts: BlogPost[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'blogPosts';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const posts = snapshot.docs.map((d) => mapDocToBlogPost(d.id, d.data()));
      posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      onData(posts);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function upsertBlogPost(post: BlogPost): Promise<string> {
  const { id, ...rest } = post;
  const validation = validateBlogPost(rest);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data artikel blog tidak valid.');
  }
  const docId =
    id && id.trim().length > 0
      ? id.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120)
      : normalizeSlug(validation.sanitized.slug || validation.sanitized.titleId, 'artikel');
  const docRef = doc(db, 'blogPosts', docId);
  const path = `blogPosts/${docId}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...validation.sanitized,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...validation.sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  const path = `blogPosts/${id}`;
  try {
    await deleteDoc(doc(db, 'blogPosts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncBlogPostsFromSheets(posts: BlogPost[]): Promise<number> {
  if (posts.length === 0) return 0;

  const batch = writeBatch(db);
  let syncedCount = 0;

  for (const raw of posts) {
    const validation = validateBlogPost({
      ...raw,
      source: 'google_sheets',
    });
    if (!validation.valid || !validation.sanitized) {
      continue;
    }
    const docId = normalizeSlug(
      raw.id || validation.sanitized.slug || validation.sanitized.titleId,
      `sheet-${syncedCount + 1}`
    );
    batch.set(
      doc(db, 'blogPosts', docId),
      {
        ...validation.sanitized,
        source: 'google_sheets',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    syncedCount += 1;
  }

  if (syncedCount === 0) {
    return 0;
  }

  try {
    await batch.commit();
    return syncedCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'blogPosts_sheets_sync');
  }
}

export function subscribeSheetsConfigAdmin(
  onData: (config: SheetsConfig | null) => void,
  onError: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'sheetsConfig', 'main'),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = snap.data();
      onData({
        spreadsheetId: String(data.spreadsheetId ?? ''),
        spreadsheetTitle: String(data.spreadsheetTitle ?? 'Kotobatuah Blog CMS'),
        spreadsheetUrl: String(data.spreadsheetUrl ?? ''),
        postsTab: String(data.postsTab ?? 'Blog_Posts'),
        categoriesTab: String(data.categoriesTab ?? 'Blog_Categories'),
        configTab: String(data.configTab ?? 'Site_Config'),
        seoTab: String(data.seoTab ?? 'SEO_GEO_Keywords'),
        procedureTab: String(data.procedureTab ?? 'Procedure_Pages'),
        autoSyncEnabled: Boolean(data.autoSyncEnabled),
        lastSyncedAt: String(data.lastSyncedAt ?? ''),
        lastSyncedCount: Number(data.lastSyncedCount ?? 0),
      });
    },
    (error) => {
      onError(error);
    }
  );
}

export async function saveSheetsConfig(config: SheetsConfig): Promise<void> {
  const validation = validateSheetsConfig(config);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Konfigurasi Google Sheets tidak valid.');
  }
  const path = 'sheetsConfig/main';
  try {
    await setDoc(doc(db, 'sheetsConfig', 'main'), {
      ...validation.sanitized,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function mapDocToProcedurePage(id: string, data: Record<string, unknown>): ProcedurePage {
  return {
    id,
    slug: (data.slug as ProcedureSlug) ?? (id as ProcedureSlug),
    titleId: String(data.titleId ?? ''),
    titleEn: String(data.titleEn ?? data.titleId ?? ''),
    summaryId: String(data.summaryId ?? ''),
    summaryEn: String(data.summaryEn ?? data.summaryId ?? ''),
    contentId: String(data.contentId ?? ''),
    contentEn: String(data.contentEn ?? data.contentId ?? ''),
    updatedAt: String(data.effectiveDate ?? '2026-11-26'),
    published: Boolean(data.published),
    source: data.source === 'google_sheets' ? 'google_sheets' : 'cms',
  };
}

export function subscribePublishedProcedurePages(
  onData: (pages: ProcedurePage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'procedurePages';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(SEED_PROCEDURE_PAGES);
        return;
      }
      const docs = snapshot.docs.map((d) => mapDocToProcedurePage(d.id, d.data()));
      const merged = SEED_PROCEDURE_PAGES.map(
        (seed) => docs.find((d) => d.slug === seed.slug) ?? seed
      );
      onData(merged);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export function subscribeAllProcedurePagesAdmin(
  onData: (pages: ProcedurePage[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'procedurePages';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const docs = snapshot.docs.map((d) => mapDocToProcedurePage(d.id, d.data()));
      onData(docs);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function upsertProcedurePage(page: ProcedurePage): Promise<string> {
  const validation = validateProcedurePage(page);
  if (!validation.valid || !validation.sanitized) {
    throw new Error(Object.values(validation.errors)[0] || 'Data halaman prosedur tidak valid.');
  }
  const { updatedAt, ...rest } = validation.sanitized;
  const docId = rest.slug;
  const docRef = doc(db, 'procedurePages', docId);
  const path = `procedurePages/${docId}`;

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        ...rest,
        effectiveDate: updatedAt,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...rest,
        effectiveDate: updatedAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncProcedurePagesFromSheets(pages: ProcedurePage[]): Promise<number> {
  if (pages.length === 0) return 0;
  let syncedCount = 0;

  for (const raw of pages) {
    const validation = validateProcedurePage({
      ...raw,
      source: 'google_sheets',
    });
    if (!validation.valid || !validation.sanitized) {
      continue;
    }
    const { updatedAt, ...rest } = validation.sanitized;
    const docId = rest.slug;
    const docRef = doc(db, 'procedurePages', docId);
    const path = `procedurePages/${docId}`;
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, {
          ...rest,
          effectiveDate: updatedAt,
          source: 'google_sheets',
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          ...rest,
          effectiveDate: updatedAt,
          source: 'google_sheets',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      syncedCount += 1;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  return syncedCount;
}
