import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  FileSpreadsheet,
  FolderOpen,
  Layers,
  Plus,
  RefreshCw,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { SEED_BLOG_POSTS, SEED_PROCEDURE_PAGES } from '../data/seedData';
import {
  getWorkspaceAccessToken,
  signInWithGoogleWorkspace,
} from '../lib/firebase';
import {
  deleteBlogPost,
  saveSheetsConfig,
  saveSiteSettings,
  syncBlogPostsFromSheets,
  syncProcedurePagesFromSheets,
  upsertBlogPost,
} from '../services/firestoreService';
import {
  appendBlogPostRow,
  createBlogCmsSpreadsheet,
  fetchSheetRange,
  getSpreadsheetMetadata,
  listUserSpreadsheets,
} from '../services/googleSheetsService';
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPost,
  type DriveSpreadsheetSummary,
  type Locale,
  type ProcedurePage,
  type SheetCategoryRow,
  type SheetSeoKeywordRow,
  type SheetsConfig,
  type SiteSettings,
  type SpreadsheetTabInfo,
} from '../types/domain';
import {
  BLOG_POSTS_HEADERS,
  PROCEDURE_PAGES_HEADERS,
  extractSpreadsheetId,
  parseBlogCategoriesFromSheet,
  parseBlogSheetRows,
  parseProcedurePagesFromSheet,
  parseSeoKeywordsFromSheet,
  parseSiteConfigFromSheet,
} from '../utils/sheetsParser';
import { normalizeSlug } from '../utils/validation';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SheetsBlogCmsTabProps {
  lang: Locale;
  siteSettings: SiteSettings;
  blogPosts: BlogPost[];
  sheetsConfig: SheetsConfig | null;
  onFeedback: (msg: string) => void;
}

type SheetsSubTab = 'config' | 'posts' | 'siteConfig' | 'taxonomy';

interface ConfirmActionState {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}

export function SheetsBlogCmsTab({
  lang,
  siteSettings,
  blogPosts,
  sheetsConfig,
  onFeedback,
}: SheetsBlogCmsTabProps) {
  const [subTab, setSubTab] = useState<SheetsSubTab>('config');
  const [hasToken, setHasToken] = useState<boolean>(() => Boolean(getWorkspaceAccessToken()));
  const [authBusy, setAuthBusy] = useState(false);

  const [driveFiles, setDriveFiles] = useState<DriveSpreadsheetSummary[]>([]);
  const [availableTabs, setAvailableTabs] = useState<SpreadsheetTabInfo[]>([]);
  const [sheetUrlInput, setSheetUrlInput] = useState(
    sheetsConfig?.spreadsheetUrl || sheetsConfig?.spreadsheetId || ''
  );

  const [configDraft, setConfigDraft] = useState<SheetsConfig>({
    spreadsheetId: sheetsConfig?.spreadsheetId ?? '',
    spreadsheetTitle: sheetsConfig?.spreadsheetTitle ?? 'kotobatuah.com — Blog & Site Config CMS',
    spreadsheetUrl: sheetsConfig?.spreadsheetUrl ?? '',
    postsTab: sheetsConfig?.postsTab ?? 'Blog_Posts',
    categoriesTab: sheetsConfig?.categoriesTab ?? 'Blog_Categories',
    configTab: sheetsConfig?.configTab ?? 'Site_Config',
    seoTab: sheetsConfig?.seoTab ?? 'SEO_GEO_Keywords',
    procedureTab: sheetsConfig?.procedureTab ?? 'Procedure_Pages',
    autoSyncEnabled: sheetsConfig?.autoSyncEnabled ?? true,
    lastSyncedAt: sheetsConfig?.lastSyncedAt ?? '',
    lastSyncedCount: sheetsConfig?.lastSyncedCount ?? 0,
  });

  useEffect(() => {
    if (sheetsConfig) {
      setConfigDraft({
        ...sheetsConfig,
        procedureTab: sheetsConfig.procedureTab || 'Procedure_Pages',
      });
      setSheetUrlInput(sheetsConfig.spreadsheetUrl || sheetsConfig.spreadsheetId);
    }
  }, [sheetsConfig]);

  // Pulled preview states from Google Sheets
  const [pulledPosts, setPulledPosts] = useState<BlogPost[]>([]);
  const [pulledSkipped, setPulledSkipped] = useState<Array<{ rowNumber: number; reason: string }>>(
    []
  );
  const [pulledProcedures, setPulledProcedures] = useState<ProcedurePage[]>([]);
  const [pulledProcedureSkipped, setPulledProcedureSkipped] = useState<
    Array<{ rowNumber: number; reason: string }>
  >([]);
  const [pulledSiteConfig, setPulledSiteConfig] = useState<{
    config: SiteSettings;
    matchedKeys: string[];
  } | null>(null);
  const [pulledCategories, setPulledCategories] = useState<SheetCategoryRow[]>([]);
  const [pulledSeoRows, setPulledSeoRows] = useState<SheetSeoKeywordRow[]>([]);
  const [sheetBusy, setSheetBusy] = useState(false);

  // Quick Blog Composer state
  const [bTitleId, setBTitleId] = useState('');
  const [bTitleEn, setBTitleEn] = useState('');
  const [bSlug, setBSlug] = useState('');
  const [bCategory, setBCategory] = useState<BlogCategory>('Strategi OOH');
  const [bGeoCity, setBGeoCity] = useState(siteSettings.primaryHubName);
  const [bAuthor, setBAuthor] = useState('Tim Editorial kotobatuah.com');
  const [bReadMinutes, setBReadMinutes] = useState('4');
  const [bCover, setBCover] = useState(
    '/src/assets/images/zafran_coffee_billboard_1795681798711.jpg'
  );
  const [bTags, setBTags] = useState('Kotobatuah, Tangerang Raya, Strategi Media');
  const [bExcerptId, setBExcerptId] = useState('');
  const [bContentId, setBContentId] = useState('');
  const [bContentEn, setBContentEn] = useState('');
  const [bFeatured, setBFeatured] = useState(false);
  const [bPublished, setBPublished] = useState(true);

  // Mandatory explicit confirmation dialog for Google Sheets/Drive mutations
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const ensureWorkspaceToken = (): string => {
    const token = getWorkspaceAccessToken();
    setHasToken(Boolean(token));
    if (!token) {
      throw new Error(
        lang === 'en'
          ? 'Please connect Google Workspace access via "Sign in with Google" first.'
          : 'Silakan klik "Sign in with Google" terlebih dahulu untuk mengaktifkan akses Drive & Sheets.'
      );
    }
    return token;
  };

  const handleWorkspaceSignIn = async () => {
    setAuthBusy(true);
    try {
      const res = await signInWithGoogleWorkspace();
      setHasToken(Boolean(res.accessToken));
      if (res.accessToken) {
        onFeedback(
          lang === 'en'
            ? 'Google Drive & Sheets Workspace session connected in memory.'
            : 'Izin akses Google Drive & Google Sheets aktif pada sesi ini.'
        );
        const files = await listUserSpreadsheets(res.accessToken);
        setDriveFiles(files);
      } else {
        onFeedback(
          lang === 'en'
            ? 'Signed in, but no Google Workspace access token was returned. Please grant Drive & Sheets permissions.'
            : 'Berhasil masuk, namun izin Google Drive & Sheets belum diberikan. Coba klik lagi dan centang izin akses.'
        );
      }
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menghubungkan Google Workspace.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLoadDriveFiles = async () => {
    setSheetBusy(true);
    try {
      const token = ensureWorkspaceToken();
      const files = await listUserSpreadsheets(token);
      setDriveFiles(files);
      onFeedback(`Ditemukan ${files.length} file Google Sheets di Google Drive Anda.`);
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal memuat daftar Google Sheets.');
    } finally {
      setSheetBusy(false);
    }
  };

  const handleInspectSpreadsheet = async (rawIdOrUrl: string) => {
    const spreadsheetId = extractSpreadsheetId(rawIdOrUrl);
    if (!spreadsheetId) {
      onFeedback('Masukkan URL atau ID Google Sheets yang valid.');
      return;
    }
    setSheetBusy(true);
    try {
      const token = ensureWorkspaceToken();
      const meta = await getSpreadsheetMetadata(token, spreadsheetId);
      setAvailableTabs(meta.tabs);

      const tabTitles = meta.tabs.map((t) => t.title);
      const pickTab = (preferred: string, fallbackIdx: number) =>
        tabTitles.find((t) => t.toLowerCase() === preferred.toLowerCase()) ??
        tabTitles[Math.min(fallbackIdx, Math.max(0, tabTitles.length - 1))] ??
        preferred;

      setConfigDraft((prev) => ({
        ...prev,
        spreadsheetId: meta.spreadsheetId,
        spreadsheetTitle: meta.title,
        spreadsheetUrl: meta.spreadsheetUrl,
        postsTab: pickTab(prev.postsTab || 'Blog_Posts', 0),
        categoriesTab: pickTab(prev.categoriesTab || 'Blog_Categories', 1),
        configTab: pickTab(prev.configTab || 'Site_Config', 2),
        seoTab: pickTab(prev.seoTab || 'SEO_GEO_Keywords', 3),
        procedureTab: pickTab(prev.procedureTab || 'Procedure_Pages', 4),
      }));
      setSheetUrlInput(meta.spreadsheetUrl);
      onFeedback(
        `Terhubung ke "${meta.title}" (${meta.tabs.length} tab terdeteksi: ${tabTitles.join(', ')}).`
      );
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal membaca metadata spreadsheet.');
    } finally {
      setSheetBusy(false);
    }
  };

  const handlePullAllTabs = async (overrideConfig?: SheetsConfig) => {
    const target = overrideConfig ?? configDraft;
    if (!target.spreadsheetId) {
      onFeedback('Hubungkan atau pilih Google Spreadsheet terlebih dahulu.');
      return;
    }
    setSheetBusy(true);
    try {
      const token = ensureWorkspaceToken();
      const procTabName = target.procedureTab || 'Procedure_Pages';
      const [postsRows, catRows, cfgRows, seoRows, procRows] = await Promise.all([
        fetchSheetRange(token, target.spreadsheetId, target.postsTab),
        fetchSheetRange(token, target.spreadsheetId, target.categoriesTab).catch(() => []),
        fetchSheetRange(token, target.spreadsheetId, target.configTab).catch(() => []),
        fetchSheetRange(token, target.spreadsheetId, target.seoTab).catch(() => []),
        fetchSheetRange(token, target.spreadsheetId, procTabName).catch(() => []),
      ]);

      const parsedPosts = parseBlogSheetRows(postsRows);
      const parsedProcedures = parseProcedurePagesFromSheet(procRows);
      setPulledPosts(parsedPosts.posts);
      setPulledSkipped(parsedPosts.skipped);
      setPulledProcedures(parsedProcedures.pages);
      setPulledProcedureSkipped(parsedProcedures.skipped);
      setPulledCategories(parseBlogCategoriesFromSheet(catRows));
      setPulledSiteConfig(parseSiteConfigFromSheet(cfgRows, siteSettings));
      setPulledSeoRows(parseSeoKeywordsFromSheet(seoRows));

      onFeedback(
        `Berhasil menarik ${parsedPosts.posts.length} artikel blog, ${cfgRows.length > 1 ? cfgRows.length - 1 : 0} baris config, ${seoRows.length > 1 ? seoRows.length - 1 : 0} kata kunci SEO/GEO, dan ${parsedProcedures.pages.length} dokumen prosedur.`
      );
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menarik isi tab Google Sheets.');
    } finally {
      setSheetBusy(false);
    }
  };

  const requestCreateTemplateSpreadsheet = () => {
    try {
      ensureWorkspaceToken();
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Harap hubungkan Google Workspace dahulu.');
      return;
    }

    setConfirmAction({
      title: 'Buat Template Spreadsheet CMS 5-Tab di Google Drive?',
      description:
        'Aksi ini akan membuat file Google Sheets baru bernama "kotobatuah.com — Blog & Site Config CMS" lengkap dengan 5 tab (Blog_Posts, Blog_Categories, Site_Config, SEO_GEO_Keywords, Procedure_Pages) beserta data awal.',
      confirmLabel: 'Ya, Buat Spreadsheet 5-Tab',
      onConfirm: async () => {
        const token = ensureWorkspaceToken();
        const created = await createBlogCmsSpreadsheet(
          token,
          siteSettings,
          SEED_BLOG_POSTS,
          SEED_PROCEDURE_PAGES
        );
        const nextConfig: SheetsConfig = {
          spreadsheetId: created.spreadsheetId,
          spreadsheetTitle: created.spreadsheetTitle,
          spreadsheetUrl: created.spreadsheetUrl,
          postsTab: 'Blog_Posts',
          categoriesTab: 'Blog_Categories',
          configTab: 'Site_Config',
          seoTab: 'SEO_GEO_Keywords',
          procedureTab: 'Procedure_Pages',
          autoSyncEnabled: true,
          lastSyncedAt: configDraft.lastSyncedAt,
          lastSyncedCount: configDraft.lastSyncedCount,
        };
        setAvailableTabs(created.tabs);
        setConfigDraft(nextConfig);
        setSheetUrlInput(created.spreadsheetUrl);
        await saveSheetsConfig(nextConfig);
        const files = await listUserSpreadsheets(token).catch(() => []);
        if (files.length > 0) setDriveFiles(files);
        await handlePullAllTabs(nextConfig);
        onFeedback(
          `Template Google Sheets 5-Tab "${created.spreadsheetTitle}" berhasil dibuat dan terhubung ke CMS!`
        );
      },
    });
  };

  const handleSaveConfigMapping = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await saveSheetsConfig(configDraft);
      onFeedback('Mapping tab & konfigurasi Google Sheets tersimpan di Firestore.');
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi Sheets.');
    }
  };

  const handleSyncPulledPostsToFirestore = async () => {
    if (pulledPosts.length === 0) {
      onFeedback('Belum ada artikel valid hasil tarikan Google Sheets untuk disinkronkan.');
      return;
    }
    setSheetBusy(true);
    try {
      const synced = await syncBlogPostsFromSheets(pulledPosts);
      const updatedCfg: SheetsConfig = {
        ...configDraft,
        lastSyncedAt: new Date().toLocaleString('id-ID'),
        lastSyncedCount: synced,
      };
      setConfigDraft(updatedCfg);
      if (updatedCfg.spreadsheetId.length >= 10) {
        await saveSheetsConfig(updatedCfg);
      }
      onFeedback(
        `${synced} artikel dari tab "${configDraft.postsTab}" berhasil disinkronkan ke Blog live (Firestore)!`
      );
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menyinkronkan artikel ke Firestore.');
    } finally {
      setSheetBusy(false);
    }
  };

  const buildComposerPost = (source: 'cms' | 'google_sheets'): BlogPost => {
    const slug = normalizeSlug(bSlug || bTitleId, 'artikel-baru');
    const tags = bTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      id: slug,
      slug,
      titleId: bTitleId,
      titleEn: bTitleEn || bTitleId,
      excerptId: bExcerptId || bContentId.slice(0, 180),
      excerptEn: bExcerptId || bContentEn.slice(0, 180) || bContentId.slice(0, 180),
      contentId: bContentId,
      contentEn: bContentEn || bContentId,
      category: bCategory,
      author: bAuthor,
      coverImageUrl: bCover,
      tags: tags.length > 0 ? tags : ['Kotobatuah'],
      seoTitle: `${bTitleId} | kotobatuah.com`,
      seoDescription: bExcerptId || bContentId.slice(0, 155),
      geoCity: bGeoCity,
      readMinutes: Number(bReadMinutes) || 4,
      featured: bFeatured,
      published: bPublished,
      publishedAt: new Date().toISOString().slice(0, 10),
      source,
    };
  };

  const resetComposer = () => {
    setBTitleId('');
    setBTitleEn('');
    setBSlug('');
    setBExcerptId('');
    setBContentId('');
    setBContentEn('');
  };

  const handleSavePostFirestoreOnly = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const post = buildComposerPost('cms');
      await upsertBlogPost(post);
      resetComposer();
      onFeedback(`Artikel "${post.titleId}" berhasil diterbitkan ke Firestore.`);
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menerbitkan artikel blog.');
    }
  };

  const requestAppendPostToGoogleSheets = () => {
    try {
      ensureWorkspaceToken();
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Harap hubungkan Google Workspace dahulu.');
      return;
    }

    if (!configDraft.spreadsheetId) {
      onFeedback('Pilih atau buat Google Spreadsheet terlebih dahulu di sub-tab Konfigurasi.');
      return;
    }

    const post = buildComposerPost('google_sheets');
    if (!post.titleId || post.titleId.trim().length < 3 || post.contentId.trim().length < 20) {
      onFeedback('Isi judul (min 3 karakter) dan konten artikel (min 20 karakter) terlebih dahulu.');
      return;
    }

    setConfirmAction({
      title: `Tambahkan Artikel ke Tab "${configDraft.postsTab}"?`,
      description: `Baris baru untuk artikel "${post.titleId}" (slug: ${post.slug}) akan ditambahkan ke Google Sheet "${configDraft.spreadsheetTitle}" sekaligus diterbitkan ke Blog Firestore.`,
      confirmLabel: 'Ya, Tulis ke Google Sheets & Publish',
      onConfirm: async () => {
        const token = ensureWorkspaceToken();
        await appendBlogPostRow(token, configDraft.spreadsheetId, configDraft.postsTab, post);
        await upsertBlogPost(post);
        resetComposer();
        onFeedback(`Artikel "${post.titleId}" berhasil ditambahkan ke Google Sheets & Firestore!`);
      },
    });
  };

  const requestApplySiteConfigFromSheet = () => {
    if (!pulledSiteConfig) return;
    setConfirmAction({
      title: 'Terapkan Site_Config dari Google Sheets ke Situs Live?',
      description: `Akan memperbarui ${pulledSiteConfig.matchedKeys.length} pengaturan live (${pulledSiteConfig.matchedKeys.join(', ')}) di Hero, Kontak, dan Footer kotobatuah.com.`,
      confirmLabel: 'Ya, Terapkan Config Sekarang',
      onConfirm: async () => {
        await saveSiteSettings(pulledSiteConfig.config);
        onFeedback('Site_Config dari Google Sheets berhasil diterapkan ke situs live!');
      },
    });
  };

  const executeConfirm = async () => {
    if (!confirmAction) return;
    setConfirmBusy(true);
    try {
      await confirmAction.onConfirm();
      setConfirmAction(null);
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Operasi gagal dijalankan.');
    } finally {
      setConfirmBusy(false);
    }
  };

  const handleSyncPulledProceduresToFirestore = async () => {
    if (pulledProcedures.length === 0) {
      onFeedback('Belum ada dokumen prosedur hasil tarikan Google Sheets.');
      return;
    }
    setSheetBusy(true);
    try {
      const synced = await syncProcedurePagesFromSheets(pulledProcedures);
      onFeedback(
        `${synced} dokumen prosedur (/procedure/*) dari tab "${configDraft.procedureTab || 'Procedure_Pages'}" berhasil disinkronkan ke Firestore!`
      );
    } catch (err: unknown) {
      onFeedback(err instanceof Error ? err.message : 'Gagal menyinkronkan halaman prosedur.');
    } finally {
      setSheetBusy(false);
    }
  };

  const tabOptions =
    availableTabs.length > 0
      ? availableTabs.map((t) => t.title)
      : Array.from(
          new Set([
            configDraft.postsTab,
            configDraft.categoriesTab,
            configDraft.configTab,
            configDraft.seoTab,
            configDraft.procedureTab || 'Procedure_Pages',
          ])
        ).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Workspace Auth & Connection Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-[#0D1117]">
              Google Sheets &amp; Drive Content Engine (Blog + Config)
            </h3>
            <span
              className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${
                hasToken
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {hasToken ? 'Token Sesi Aktif' : 'Perlu Otorisasi Sesi'}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Kelola artikel blog, kategori, konfigurasi basis Tangerang Raya/Jakarta + AdSense, klaster
            SEO &amp; GEO, serta halaman <code>/procedure/*</code> melalui Google Sheets 5-tab terstruktur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <GoogleSignInButton
            label={hasToken ? 'Refresh Sesi Google' : 'Sign in with Google'}
            onClick={() => void handleWorkspaceSignIn()}
            disabled={authBusy}
          />
          {configDraft.spreadsheetUrl && (
            <a
              href={configDraft.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-stone-300 bg-[#F8F7F4] hover:bg-stone-100 text-xs font-semibold text-[#0D1117] rounded-lg"
            >
              <span>Buka Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-stone-200 rounded-lg">
        {(
          [
            { id: 'config', label: '1. Koneksi & Tab Mapping', icon: FolderOpen },
            { id: 'posts', label: `2. Artikel Blog & Sync (${blogPosts.length})`, icon: Layers },
            { id: 'siteConfig', label: '3. Config Situs via Sheets', icon: Sliders },
            { id: 'taxonomy', label: '4. Kategori, SEO & Procedure', icon: Sparkles },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = subTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                active ? 'bg-[#0D1117] text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: Config & Sheet Connection */}
      {subTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display text-sm font-bold text-[#0D1117]">
                Pilih atau Buat Template Spreadsheet
              </h4>
              <button
                type="button"
                onClick={requestCreateTemplateSpreadsheet}
                disabled={sheetBusy}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-60"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Buat Template 5-Tab</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  Pilih dari Google Drive Anda
                </label>
                <button
                  type="button"
                  onClick={() => void handleLoadDriveFiles()}
                  disabled={sheetBusy}
                  className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  Muat Daftar Drive
                </button>
              </div>
              <select
                value={configDraft.spreadsheetId}
                onChange={(e) => {
                  const id = e.target.value;
                  if (id) void handleInspectSpreadsheet(id);
                }}
                aria-label="Pilih Spreadsheet dari Google Drive"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="">
                  {driveFiles.length > 0
                    ? '-- Pilih Google Spreadsheet --'
                    : '-- Klik Muat Daftar Drive atau tempel URL di bawah --'}
                </option>
                {driveFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sheet-url-input" className="text-xs font-semibold text-stone-700">
                Atau Tempel URL / Spreadsheet ID
              </label>
              <div className="flex gap-2">
                <input
                  id="sheet-url-input"
                  type="text"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => void handleInspectSpreadsheet(sheetUrlInput)}
                  disabled={sheetBusy}
                  className="px-4 py-2 bg-[#0D1117] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer shrink-0"
                >
                  Deteksi Tab
                </button>
              </div>
            </div>

            {configDraft.lastSyncedAt && (
              <p className="text-xs text-stone-500 font-mono-tabular">
                Sinkronisasi terakhir: {configDraft.lastSyncedAt} ({configDraft.lastSyncedCount}{' '}
                artikel)
              </p>
            )}
          </div>

          <form
            onSubmit={handleSaveConfigMapping}
            className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 space-y-4"
          >
            <h4 className="font-display text-sm font-bold text-[#0D1117]">
              Pemetaan Tab Komprehensif (5 Tab)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tab Artikel Blog
                </label>
                <select
                  value={configDraft.postsTab}
                  onChange={(e) =>
                    setConfigDraft((prev) => ({ ...prev, postsTab: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {tabOptions.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tab Kategori Blog
                </label>
                <select
                  value={configDraft.categoriesTab}
                  onChange={(e) =>
                    setConfigDraft((prev) => ({ ...prev, categoriesTab: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {tabOptions.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tab Konfigurasi Situs
                </label>
                <select
                  value={configDraft.configTab}
                  onChange={(e) =>
                    setConfigDraft((prev) => ({ ...prev, configTab: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {tabOptions.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tab SEO &amp; GEO Keywords
                </label>
                <select
                  value={configDraft.seoTab}
                  onChange={(e) =>
                    setConfigDraft((prev) => ({ ...prev, seoTab: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {tabOptions.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tab Halaman Prosedur (<code>/procedure/*</code>)
                </label>
                <select
                  value={configDraft.procedureTab || 'Procedure_Pages'}
                  onChange={(e) =>
                    setConfigDraft((prev) => ({ ...prev, procedureTab: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {tabOptions.map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0D1117] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Simpan Config Mapping</span>
              </button>

              <button
                type="button"
                onClick={() => void handlePullAllTabs()}
                disabled={sheetBusy}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tarik Semua 5 Tab Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab 2: Blog Articles & Sync */}
      {subTab === 'posts' && (
        <div className="space-y-6">
          {/* Google Sheets Pull & Sync Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-display text-sm font-bold text-[#0D1117]">
                  Pratinjau &amp; Sinkronisasi dari Tab &ldquo;{configDraft.postsTab}&rdquo;
                </h4>
                <p className="text-xs text-stone-600">
                  Tarik baris terbaru dari Google Sheets, periksa validasi, lalu terbitkan ke
                  koleksi <code>blogPosts</code> Firestore.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handlePullAllTabs()}
                  disabled={sheetBusy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 bg-[#F8F7F4] hover:bg-stone-100 text-xs font-semibold text-[#0D1117] rounded-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tarik dari Sheets</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleSyncPulledPostsToFirestore()}
                  disabled={sheetBusy || pulledPosts.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sinkronkan {pulledPosts.length} Artikel ke Blog Live</span>
                </button>
              </div>
            </div>

            {pulledSkipped.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span>{pulledSkipped.length} baris dilewati karena belum memenuhi skema:</span>
                </p>
                {pulledSkipped.slice(0, 4).map((skip) => (
                  <p key={skip.rowNumber}>
                    Baris {skip.rowNumber}: {skip.reason}
                  </p>
                ))}
              </div>
            )}

            {pulledPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pulledPosts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#F8F7F4] border border-stone-200 rounded-lg text-xs"
                  >
                    <p className="font-semibold text-[#1D4ED8]">
                      {p.category} · {p.geoCity} · {p.published ? 'Publik' : 'Draft'}
                    </p>
                    <p className="font-display text-sm font-bold text-[#0D1117] mt-0.5">
                      {p.titleId}
                    </p>
                    <p className="text-stone-600 line-clamp-2 mt-1">{p.excerptId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Composer + Live Firestore List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSavePostFirestoreOnly}
              className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-3"
            >
              <h4 className="font-display text-base font-bold text-[#0D1117]">
                Tulis Artikel Baru (Dual Language + Sheets)
              </h4>
              <input
                type="text"
                value={bTitleId}
                onChange={(e) => setBTitleId(e.target.value)}
                placeholder="Judul Artikel (Indonesia) *"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={bTitleEn}
                onChange={(e) => setBTitleEn(e.target.value)}
                placeholder="Article Title (English - opsional)"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={bCategory}
                  onChange={(e) => setBCategory(e.target.value as BlogCategory)}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={bGeoCity}
                  onChange={(e) => setBGeoCity(e.target.value)}
                  placeholder="Kota Target (GEO)"
                  required
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={bSlug}
                  onChange={(e) => setBSlug(e.target.value)}
                  placeholder="slug-url (otomatis jika kosong)"
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={bReadMinutes}
                  onChange={(e) => setBReadMinutes(e.target.value)}
                  placeholder="Menit baca"
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                value={bAuthor}
                onChange={(e) => setBAuthor(e.target.value)}
                placeholder="Penulis"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={bCover}
                onChange={(e) => setBCover(e.target.value)}
                placeholder="URL / Path Gambar Sampul"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={bTags}
                onChange={(e) => setBTags(e.target.value)}
                placeholder="Tags dipisah koma"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <textarea
                rows={2}
                value={bExcerptId}
                onChange={(e) => setBExcerptId(e.target.value)}
                placeholder="Ringkasan artikel (minimal 10 karakter) *"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <textarea
                rows={4}
                value={bContentId}
                onChange={(e) => setBContentId(e.target.value)}
                placeholder="Isi artikel Bahasa Indonesia (minimal 20 karakter) *"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <textarea
                rows={3}
                value={bContentEn}
                onChange={(e) => setBContentEn(e.target.value)}
                placeholder="Article body in English (optional)"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <div className="flex items-center gap-4 text-xs text-stone-700 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bPublished}
                    onChange={(e) => setBPublished(e.target.checked)}
                  />
                  <span>Langsung Publikasikan</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bFeatured}
                    onChange={(e) => setBFeatured(e.target.checked)}
                  />
                  <span>Artikel Utama (Featured)</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-3 bg-[#0D1117] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Simpan ke Firestore
                </button>
                <button
                  type="button"
                  onClick={requestAppendPostToGoogleSheets}
                  className="py-2.5 px-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Tulis ke Google Sheets
                </button>
              </div>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {blogPosts.length === 0 ? (
                <div className="p-6 bg-white border border-stone-200 rounded-xl text-sm text-stone-600">
                  Belum ada artikel di koleksi Firestore <code>blogPosts</code>. Tarik dari Google
                  Sheets atau klik &ldquo;Sinkronkan Katalog Awal ke Firestore&rdquo;.
                </div>
              ) : (
                blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-stone-500">
                        {post.category} · {post.geoCity} ·{' '}
                        {post.source === 'google_sheets' ? 'Google Sheets' : 'CMS'} ·{' '}
                        {post.published ? 'Publik' : 'Draft'}
                      </p>
                      <p className="font-display text-sm font-bold text-[#0D1117] truncate">
                        {post.titleId}
                      </p>
                      <p className="font-mono-tabular text-xs text-stone-500">
                        /{post.slug} · {post.publishedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          void upsertBlogPost({ ...post, published: !post.published })
                        }
                        className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer"
                      >
                        {post.published ? 'Jadikan Draft' : 'Publikasikan'}
                      </button>
                      <button
                        type="button"
                        aria-label={`Hapus artikel ${post.titleId}`}
                        onClick={() => void deleteBlogPost(post.id)}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Site Config via Google Sheets */}
      {subTab === 'siteConfig' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-display text-base font-bold text-[#0D1117]">
                Konfigurasi Situs dari Tab &ldquo;{configDraft.configTab}&rdquo;
              </h4>
              <p className="text-xs text-stone-600">
                Ubah basis operasional (misal Tangerang Raya), nomor WhatsApp, email, dan tagline
                langsung dari spreadsheet lalu terapkan ke situs live.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handlePullAllTabs()}
                disabled={sheetBusy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 bg-[#F8F7F4] hover:bg-stone-100 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Muat Site_Config</span>
              </button>
              <button
                type="button"
                onClick={requestApplySiteConfigFromSheet}
                disabled={!pulledSiteConfig || pulledSiteConfig.matchedKeys.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Terapkan ke Situs Live</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F4] border-b border-stone-200 text-stone-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Key Konfigurasi</th>
                  <th className="py-2.5 px-3 font-semibold">Nilai Live Saat Ini</th>
                  <th className="py-2.5 px-3 font-semibold">Nilai di Google Sheets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(
                  [
                    'primaryHubName',
                    'primaryAddress',
                    'secondaryAddress',
                    'contactEmail',
                    'contactPhone',
                    'taglineId',
                    'taglineEn',
                    'managementDisclaimerId',
                    'managementDisclaimerEn',
                    'adsenseClientId',
                    'adsenseBlogSlotId',
                    'adsenseArticleSlotId',
                  ] as const
                ).map((k) => (
                  <tr key={k}>
                    <td className="py-2.5 px-3 font-mono-tabular font-semibold text-[#0D1117]">
                      {k}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{siteSettings[k] || '—'}</td>
                    <td className="py-2.5 px-3 font-medium text-[#1D4ED8]">
                      {pulledSiteConfig ? pulledSiteConfig.config[k] || '—' : '— Belum ditarik —'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Categories, SEO, Procedure Pages & Schema Reference */}
      {subTab === 'taxonomy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h4 className="font-display text-sm font-bold text-[#0D1117]">
                Tab Kategori ({configDraft.categoriesTab})
              </h4>
              {pulledCategories.length === 0 ? (
                <p className="text-xs text-stone-600">
                  Klik &ldquo;Tarik Semua 5 Tab Sekarang&rdquo; di tab Koneksi untuk melihat daftar
                  kategori dari Google Sheets.
                </p>
              ) : (
                <div className="space-y-2">
                  {pulledCategories.map((c) => (
                    <div
                      key={c.slug}
                      className="p-3 bg-[#F8F7F4] border border-stone-200 rounded-lg text-xs"
                    >
                      <p className="font-semibold text-[#0D1117]">
                        {c.name} <span className="text-stone-400">({c.slug})</span>
                      </p>
                      <p className="text-stone-600 mt-0.5">{c.descriptionId}</p>
                      <p className="text-[#1D4ED8] mt-1">CTA Layanan: {c.targetCtaService}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h4 className="font-display text-sm font-bold text-[#0D1117]">
                Tab Klaster SEO &amp; GEO ({configDraft.seoTab})
              </h4>
              {pulledSeoRows.length === 0 ? (
                <p className="text-xs text-stone-600">
                  Klik &ldquo;Tarik Semua 5 Tab Sekarang&rdquo; untuk menampilkan peta kata kunci
                  kota target dari Google Sheets.
                </p>
              ) : (
                <div className="space-y-2">
                  {pulledSeoRows.map((row, i) => (
                    <div
                      key={`${row.city}-${i}`}
                      className="p-3 bg-[#F8F7F4] border border-stone-200 rounded-lg text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-[#0D1117]">{row.keyword}</p>
                        <p className="text-stone-600">
                          {row.city} · {row.intent} · Target: {row.targetSlug}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-white border border-stone-300 rounded font-mono-tabular text-[11px]">
                        {row.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tab 5: Procedure Pages (/procedure/*) */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-display text-sm font-bold text-[#0D1117]">
                  Tab Halaman Prosedur &amp; Legal ({configDraft.procedureTab || 'Procedure_Pages'})
                </h4>
                <p className="text-xs text-stone-600">
                  Kelola isi <code>/procedure/disclaimers</code>, <code>/procedure/tos</code>,{' '}
                  <code>/procedure/privacy-policy</code>, dan <code>/procedure/cookies</code> dari Google Sheets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleSyncPulledProceduresToFirestore()}
                disabled={sheetBusy || pulledProcedures.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sinkronkan {pulledProcedures.length} Prosedur ke Live</span>
              </button>
            </div>

            {pulledProcedureSkipped.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                {pulledProcedureSkipped.map((skip) => (
                  <p key={skip.rowNumber}>
                    Baris {skip.rowNumber}: {skip.reason}
                  </p>
                ))}
              </div>
            )}

            {pulledProcedures.length === 0 ? (
              <p className="text-xs text-stone-600">
                Belum ada baris prosedur ditarik. Klik &ldquo;Tarik Semua 5 Tab Sekarang&rdquo; di sub-tab Koneksi.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pulledProcedures.map((page) => (
                  <div
                    key={page.slug}
                    className="p-3.5 bg-[#F8F7F4] border border-stone-200 rounded-lg text-xs space-y-1"
                  >
                    <p className="font-mono-tabular font-semibold text-[#1D4ED8]">
                      /procedure/{page.slug} · {page.updatedAt}
                    </p>
                    <p className="font-display text-sm font-bold text-[#0D1117]">{page.titleId}</p>
                    <p className="text-stone-600 line-clamp-2">{page.summaryId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
            <h4 className="font-display text-sm font-bold text-[#0D1117]">
              Referensi Kolom Header Tab <code>Blog_Posts</code> &amp; <code>Procedure_Pages</code>
            </h4>
            <p className="text-xs text-stone-600">
              Baris 1 pada tab <code>Blog_Posts</code>:
            </p>
            <div className="p-3 bg-[#0D1117] text-stone-200 rounded-lg font-mono-tabular text-[11px] overflow-x-auto">
              {BLOG_POSTS_HEADERS.join(' | ')}
            </div>
            <p className="text-xs text-stone-600">
              Baris 1 pada tab <code>Procedure_Pages</code>:
            </p>
            <div className="p-3 bg-[#0D1117] text-stone-200 rounded-lg font-mono-tabular text-[11px] overflow-x-auto">
              {PROCEDURE_PAGES_HEADERS.join(' | ')}
            </div>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Modal for Workspace Mutations */}
      {confirmAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="workspace-confirm-title"
          className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-4"
          onClick={() => !confirmBusy && setConfirmAction(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4
              id="workspace-confirm-title"
              className="font-display text-lg font-bold text-[#0D1117]"
            >
              {confirmAction.title}
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">{confirmAction.description}</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => void executeConfirm()}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-60"
              >
                {confirmBusy ? 'Memproses...' : confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
