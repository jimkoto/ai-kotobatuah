import { useEffect, useState, type FormEvent } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { X, Plus, Trash2, LogOut, Database, Check, Save } from 'lucide-react';
import {
  auth,
  signInWithGoogleWorkspace,
  signOutWorkspace,
} from '../lib/firebase';
import {
  ADMIN_EMAIL,
  HOSTING_TIERS,
  LEAD_STATUSES,
  PORTFOLIO_CATEGORIES,
  type BlogPost,
  type HostingPartnerItem,
  type HostingTier,
  type LeadInquiryRecord,
  type LeadStatus,
  type Locale,
  type PortfolioCategory,
  type PortfolioItem,
  type SheetsConfig,
  type SiteSettings,
  type TestimonialItem,
} from '../types/domain';
import {
  deleteHostingPartnerItem,
  deletePortfolioItem,
  deleteTestimonialItem,
  saveSiteSettings,
  seedInitialCatalogToFirestore,
  subscribeAllBlogPostsAdmin,
  subscribeAllHostingAdmin,
  subscribeAllLeadsAdmin,
  subscribeAllPortfolioAdmin,
  subscribeAllTestimonialsAdmin,
  subscribeSheetsConfigAdmin,
  updateLeadStatus,
  upsertHostingPartnerItem,
  upsertPortfolioItem,
  upsertTestimonialItem,
} from '../services/firestoreService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { SheetsBlogCmsTab } from './SheetsBlogCmsTab';

interface CmsModalProps {
  lang: Locale;
  siteSettings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
}

type CmsTab = 'portfolio' | 'blogSheets' | 'testimonials' | 'hosting' | 'leads' | 'settings';

export function CmsModal({ lang, siteSettings, isOpen, onClose }: CmsModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<CmsTab>('portfolio');

  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [blogPostsList, setBlogPostsList] = useState<BlogPost[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig | null>(null);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>([]);
  const [hostingList, setHostingList] = useState<HostingPartnerItem[]>([]);
  const [leadsList, setLeadsList] = useState<LeadInquiryRecord[]>([]);
  const [cmsFeedback, setCmsFeedback] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Editable Site Settings form state synced with Firestore
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Form states for quick creation/editing
  const [pTitle, setPTitle] = useState('');
  const [pClient, setPClient] = useState('');
  const [pCategory, setPCategory] = useState<PortfolioCategory>('OOH & Billboard');
  const [pMetric, setPMetric] = useState('');
  const [pLocation, setPLocation] = useState(siteSettings.primaryHubName);
  const [pSummary, setPSummary] = useState('');
  const [pImageUrl, setPImageUrl] = useState('/src/assets/images/zafran_coffee_billboard_1795681798711.jpg');

  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCompany, setTCompany] = useState('');
  const [tCity, setTCity] = useState(siteSettings.primaryHubName);
  const [tOutcome, setTOutcome] = useState('');
  const [tQuote, setTQuote] = useState('');

  const [hName, setHName] = useState('');
  const [hTier, setHTier] = useState<HostingTier>('Edge CDN');
  const [hRegion, setHRegion] = useState('Jakarta & Singapura');
  const [hSla, setHSla] = useState('99.99%');
  const [hDesc, setHDesc] = useState('');
  const [hFeaturesText, setHFeaturesText] = useState('Edge CDN Latensi Rendah\nCMS Responsif Siap Pakai');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = Boolean(
    user && user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL
  );

  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    const onErr = (err: Error) => setCmsFeedback(`Gagal sinkronisasi: ${err.message}`);
    const u1 = subscribeAllPortfolioAdmin(setPortfolioList, onErr);
    const u2 = subscribeAllTestimonialsAdmin(setTestimonialsList, onErr);
    const u3 = subscribeAllHostingAdmin(setHostingList, onErr);
    const u4 = subscribeAllLeadsAdmin(setLeadsList, onErr);
    const u5 = subscribeAllBlogPostsAdmin(setBlogPostsList, onErr);
    const u6 = subscribeSheetsConfigAdmin(setSheetsConfig, onErr);

    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
      u6();
    };
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGoogleWorkspace();
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : 'Gagal masuk dengan Google.'
      );
    }
  };

  const handleSeedAll = async () => {
    setCmsFeedback('');
    try {
      await seedInitialCatalogToFirestore();
      setCmsFeedback('Katalog awal portofolio, testimoni, dan partner hosting berhasil disinkronkan ke Firestore.');
    } catch (err: unknown) {
      setCmsFeedback(err instanceof Error ? err.message : 'Gagal menyinkronkan data awal.');
    }
  };

  const handleAddPortfolio = async (e: FormEvent) => {
    e.preventDefault();
    setCmsFeedback('');
    try {
      await upsertPortfolioItem({
        id: '',
        title: pTitle,
        client: pClient,
        category: pCategory,
        metricLabel: pMetric,
        summary: pSummary,
        challenge: `Tantangan kampanye untuk ${pClient} di wilayah ${pLocation}.`,
        solution: `Eksekusi kampanye ${pCategory} terpadu melalui kotobatuah.com.`,
        imageUrl: pImageUrl,
        location: pLocation,
        year: '2026',
        featured: true,
        published: true,
        sortOrder: portfolioList.length + 1,
      });
      setPTitle('');
      setPClient('');
      setPMetric('');
      setPSummary('');
      setCmsFeedback('Karya portofolio baru berhasil diterbitkan ke Firestore.');
    } catch (err: unknown) {
      setCmsFeedback(err instanceof Error ? err.message : 'Gagal menyimpan portofolio.');
    }
  };

  const handleAddTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    setCmsFeedback('');
    try {
      await upsertTestimonialItem({
        id: '',
        clientName: tName,
        role: tRole,
        company: tCompany,
        city: tCity,
        quote: tQuote,
        outcome: tOutcome,
        published: true,
        sortOrder: testimonialsList.length + 1,
      });
      setTName('');
      setTRole('');
      setTCompany('');
      setTOutcome('');
      setTQuote('');
      setCmsFeedback('Testimoni klien baru berhasil diterbitkan.');
    } catch (err: unknown) {
      setCmsFeedback(err instanceof Error ? err.message : 'Gagal menyimpan testimoni.');
    }
  };

  const handleAddHosting = async (e: FormEvent) => {
    e.preventDefault();
    setCmsFeedback('');
    try {
      const features = hFeaturesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      await upsertHostingPartnerItem({
        id: '',
        name: hName,
        tier: hTier,
        region: hRegion,
        uptimeSla: hSla,
        description: hDesc,
        features,
        published: true,
        sortOrder: hostingList.length + 1,
      });
      setHName('');
      setHDesc('');
      setCmsFeedback(
        lang === 'en'
          ? 'Partner Hosting tier saved to Firestore.'
          : 'Paket Partner Hosting berhasil ditambahkan.'
      );
    } catch (err: unknown) {
      setCmsFeedback(err instanceof Error ? err.message : 'Gagal menyimpan paket hosting.');
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setCmsFeedback('');
    setSavingSettings(true);
    try {
      await saveSiteSettings(settingsForm);
      setCmsFeedback(
        lang === 'en'
          ? 'Operational hub, addresses, and taglines updated live in Firestore.'
          : 'Basis operasional, alamat studio, dan tagline berhasil diperbarui langsung di Firestore.'
      );
    } catch (err: unknown) {
      setCmsFeedback(
        err instanceof Error
          ? err.message
          : lang === 'en'
          ? 'Failed to save site settings.'
          : 'Gagal menyimpan pengaturan situs.'
      );
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-modal-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#0D1117] text-white flex items-center justify-between gap-4">
          <div>
            <h2 id="cms-modal-title" className="font-display text-lg font-bold">
              Sistem Manajemen Konten (CMS) &amp; Leads · kotobatuah.com
            </h2>
            <p className="text-xs text-stone-400">
              Sinkronisasi langsung dengan Firebase Firestore
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <button
                type="button"
                onClick={() => void signOutWorkspace()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Keluar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel CMS"
              className="w-9 h-9 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8F7F4]">
          {authLoading ? (
            <p className="text-sm text-stone-600">Memeriksa sesi autentikasi...</p>
          ) : !user ? (
            <div className="max-w-md mx-auto my-8 bg-white border border-stone-200 rounded-xl p-8 text-center">
              <h3 className="font-display text-xl font-bold text-[#0D1117] mb-2">
                Masuk sebagai Editor / Admin
              </h3>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Untuk mengelola portofolio, testimoni, paket Partner Hosting, serta melihat data
                leads klien secara aman, silakan masuk dengan akun Google administrator.
              </p>
              {authError && (
                <p className="text-xs text-red-700 mb-4">{authError}</p>
              )}
              <GoogleSignInButton
                label="Sign in with Google"
                onClick={() => void handleGoogleSignIn()}
                fullWidth
              />
            </div>
          ) : !isAdmin ? (
            <div className="max-w-md mx-auto my-8 bg-white border border-stone-200 rounded-xl p-8 text-center">
              <h3 className="font-display text-xl font-bold text-[#0D1117] mb-2">
                Akses Terbatas
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Akun <strong>{user.email}</strong> tidak terdaftar sebagai administrator CMS
                kotobatuah.com.
              </p>
              <button
                type="button"
                onClick={() => void signOutWorkspace()}
                className="px-4 py-2 bg-[#0D1117] text-white text-sm font-medium rounded-lg cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-lg">
                  {(
                    [
                      {
                        id: 'portfolio',
                        label: `${lang === 'en' ? 'Portfolio' : 'Portofolio'} (${portfolioList.length})`,
                      },
                      {
                        id: 'blogSheets',
                        label: `Blog & Sheets (${blogPostsList.length})`,
                      },
                      {
                        id: 'testimonials',
                        label: `${lang === 'en' ? 'Testimonials' : 'Testimoni'} (${testimonialsList.length})`,
                      },
                      {
                        id: 'hosting',
                        label: `${lang === 'en' ? 'Partner Hosting' : 'Partner Hosting'} (${hostingList.length})`,
                      },
                      {
                        id: 'leads',
                        label: `${lang === 'en' ? 'Leads' : 'Leads Masuk'} (${leadsList.length})`,
                      },
                      {
                        id: 'settings',
                        label: lang === 'en' ? 'Location & Settings' : 'Lokasi & Pengaturan',
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#0D1117] text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => void handleSeedAll()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-[#0D1117] rounded-lg cursor-pointer"
                >
                  <Database className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                  <span>
                    {lang === 'en'
                      ? 'Sync Initial Catalog to Firestore'
                      : 'Sinkronkan Katalog Awal ke Firestore'}
                  </span>
                </button>
              </div>

              {cmsFeedback && (
                <div className="flex items-center gap-2 p-3 bg-white border border-stone-300 rounded-lg text-xs text-stone-800">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>{cmsFeedback}</span>
                </div>
              )}

              {/* Tab: Portfolio */}
              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleAddPortfolio}
                    className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-3"
                  >
                    <h3 className="font-display text-base font-bold text-[#0D1117]">
                      Tambah Karya Portofolio
                    </h3>
                    <input
                      type="text"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      placeholder="Judul Kampanye"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={pClient}
                      onChange={(e) => setPClient(e.target.value)}
                      placeholder="Nama Klien"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value as PortfolioCategory)}
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      >
                        {PORTFOLIO_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={pLocation}
                        onChange={(e) => setPLocation(e.target.value)}
                        placeholder="Kota"
                        required
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={pMetric}
                      onChange={(e) => setPMetric(e.target.value)}
                      placeholder="Metrik Hasil (misal: +140% Leads)"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={pImageUrl}
                      onChange={(e) => setPImageUrl(e.target.value)}
                      placeholder="Path Gambar"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <textarea
                      rows={3}
                      value={pSummary}
                      onChange={(e) => setPSummary(e.target.value)}
                      placeholder="Ringkasan kampanye (minimal 10 karakter)"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Terbitkan Karya</span>
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-3">
                    {portfolioList.length === 0 ? (
                      <div className="p-6 bg-white border border-stone-200 rounded-xl text-sm text-stone-600">
                        Belum ada dokumen di koleksi Firestore <code>portfolio</code>. Klik
                        &ldquo;Sinkronkan Katalog Awal ke Firestore&rdquo; untuk mengisi data awal.
                      </div>
                    ) : (
                      portfolioList.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-xs text-stone-500">
                              {item.category} · {item.client} · {item.published ? 'Publik' : 'Draft'}
                            </p>
                            <p className="font-display text-sm font-bold text-[#0D1117]">
                              {item.title}
                            </p>
                            <p className="font-mono-tabular text-xs text-[#1D4ED8]">
                              {item.metricLabel}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                void upsertPortfolioItem({ ...item, published: !item.published })
                              }
                              className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer"
                            >
                              {item.published ? 'Jadikan Draft' : 'Publikasikan'}
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${item.title}`}
                              onClick={() => void deletePortfolioItem(item.id)}
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
              )}

              {/* Tab: Blog & Google Sheets CMS */}
              {activeTab === 'blogSheets' && (
                <SheetsBlogCmsTab
                  lang={lang}
                  siteSettings={siteSettings}
                  blogPosts={blogPostsList}
                  sheetsConfig={sheetsConfig}
                  onFeedback={setCmsFeedback}
                />
              )}

              {/* Tab: Testimonials */}
              {activeTab === 'testimonials' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleAddTestimonial}
                    className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-3"
                  >
                    <h3 className="font-display text-base font-bold text-[#0D1117]">
                      Tambah Testimoni Klien
                    </h3>
                    <input
                      type="text"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      placeholder="Nama Klien"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={tRole}
                        onChange={(e) => setTRole(e.target.value)}
                        placeholder="Jabatan"
                        required
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={tCity}
                        onChange={(e) => setTCity(e.target.value)}
                        placeholder="Kota"
                        required
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={tCompany}
                      onChange={(e) => setTCompany(e.target.value)}
                      placeholder="Perusahaan"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={tOutcome}
                      onChange={(e) => setTOutcome(e.target.value)}
                      placeholder="Dampak Terukur (misal: +120% Penjualan)"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <textarea
                      rows={3}
                      value={tQuote}
                      onChange={(e) => setTQuote(e.target.value)}
                      placeholder="Kutipan testimoni klien"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg cursor-pointer"
                    >
                      Simpan Testimoni
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-3">
                    {testimonialsList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs text-stone-500">
                            {item.company} · {item.city}
                          </p>
                          <p className="font-display text-sm font-bold text-[#0D1117]">
                            {item.clientName} ({item.role})
                          </p>
                          <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                            {item.quote}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Hapus testimoni ${item.clientName}`}
                          onClick={() => void deleteTestimonialItem(item.id)}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Partner Hosting */}
              {activeTab === 'hosting' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleAddHosting}
                    className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-3"
                  >
                    <h3 className="font-display text-base font-bold text-[#0D1117]">
                      Tambah Paket Partner Hosting
                    </h3>
                    <input
                      type="text"
                      value={hName}
                      onChange={(e) => setHName(e.target.value)}
                      placeholder="Nama Paket"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={hTier}
                        onChange={(e) => setHTier(e.target.value as HostingTier)}
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      >
                        {HOSTING_TIERS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={hSla}
                        onChange={(e) => setHSla(e.target.value)}
                        placeholder="SLA (misal: 99.99%)"
                        required
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={hRegion}
                      onChange={(e) => setHRegion(e.target.value)}
                      placeholder="Region Server"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <textarea
                      rows={2}
                      value={hDesc}
                      onChange={(e) => setHDesc(e.target.value)}
                      placeholder="Deskripsi singkat"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <textarea
                      rows={3}
                      value={hFeaturesText}
                      onChange={(e) => setHFeaturesText(e.target.value)}
                      placeholder="Daftar fitur (1 per baris, maksimal 6)"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg cursor-pointer"
                    >
                      Simpan Paket Hosting
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-3">
                    {hostingList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs text-stone-500">
                            {item.tier} · {item.region} · SLA {item.uptimeSla}
                          </p>
                          <p className="font-display text-sm font-bold text-[#0D1117]">
                            {item.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Hapus ${item.name}`}
                          onClick={() => void deleteHostingPartnerItem(item.id)}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Leads */}
              {activeTab === 'leads' && (
                <div className="space-y-3">
                  {leadsList.length === 0 ? (
                    <div className="p-8 bg-white border border-stone-200 rounded-xl text-center text-sm text-stone-600">
                      Belum ada pengajuan leads masuk. Kirim formulir konsultasi di halaman utama
                      untuk menguji penyimpanan real-time.
                    </div>
                  ) : (
                    leadsList.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-5 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                            <span className="font-semibold text-[#1D4ED8]">{lead.serviceType}</span>
                            <span aria-hidden="true">·</span>
                            <span>{lead.budgetRange}</span>
                            <span aria-hidden="true">·</span>
                            <span>{lead.city}</span>
                            <span aria-hidden="true">·</span>
                            <span>{lead.createdAtLabel}</span>
                          </div>
                          <p className="font-display text-base font-bold text-[#0D1117]">
                            {lead.fullName} — {lead.company}
                          </p>
                          <p className="font-mono-tabular text-xs text-stone-700">
                            {lead.email} · {lead.whatsapp}
                          </p>
                          <p className="text-sm text-stone-600">{lead.brief}</p>
                        </div>

                        <div className="shrink-0">
                          <label htmlFor={`status-${lead.id}`} className="sr-only">
                            Ubah status lead {lead.fullName}
                          </label>
                          <select
                            id={`status-${lead.id}`}
                            value={lead.status}
                            onChange={(e) =>
                              void updateLeadStatus(lead.id, e.target.value as LeadStatus)
                            }
                            className="px-3 py-2 bg-[#F8F7F4] border border-stone-300 rounded-lg text-xs font-semibold text-[#0D1117]"
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                Status: {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Location & Site Settings (Self-Updatable Operational Base) */}
              {activeTab === 'settings' && (
                <form
                  onSubmit={handleSaveSettings}
                  className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 max-w-3xl"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0D1117]">
                      {lang === 'en'
                        ? 'Operational Base, Addresses & Bilingual Taglines'
                        : 'Basis Operasional, Alamat Studio & Tagline Dwi-Bahasa'}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      {lang === 'en'
                        ? 'Changes saved here update Hero, Lead Capture, and Footer across kotobatuah.com immediately without redeploying code.'
                        : 'Perubahan yang disimpan di sini langsung memperbarui Hero, Form Konsultasi, dan Footer secara real-time tanpa edit kode.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cms-primaryHub"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        {lang === 'en' ? 'Primary Operational Hub *' : 'Basis Operasional Utama *'}
                      </label>
                      <input
                        id="cms-primaryHub"
                        type="text"
                        value={settingsForm.primaryHubName}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, primaryHubName: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cms-contactPhone"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        {lang === 'en' ? 'WhatsApp / Contact Phone *' : 'Nomor WhatsApp / Telepon *'}
                      </label>
                      <input
                        id="cms-contactPhone"
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, contactPhone: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cms-primaryAddress"
                      className="block text-xs font-semibold text-stone-800 mb-1"
                    >
                      {lang === 'en'
                        ? 'Operational Model / Studio Base *'
                        : 'Model Operasional / Basis Studio *'}
                    </label>
                    <input
                      id="cms-primaryAddress"
                      type="text"
                      value={settingsForm.primaryAddress}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, primaryAddress: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cms-secondaryAddress"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        {lang === 'en'
                          ? 'Coverage & Meeting Policy *'
                          : 'Cakupan Proyek & Mekanisme Pertemuan *'}
                      </label>
                      <input
                        id="cms-secondaryAddress"
                        type="text"
                        value={settingsForm.secondaryAddress}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, secondaryAddress: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cms-contactEmail"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        {lang === 'en' ? 'Official Contact Email *' : 'Email Kontak Resmi *'}
                      </label>
                      <input
                        id="cms-contactEmail"
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, contactEmail: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cms-taglineId"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        Tagline (Indonesia) *
                      </label>
                      <input
                        id="cms-taglineId"
                        type="text"
                        value={settingsForm.taglineId}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, taglineId: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cms-taglineEn"
                        className="block text-xs font-semibold text-stone-800 mb-1"
                      >
                        Tagline (English) *
                      </label>
                      <input
                        id="cms-taglineEn"
                        type="text"
                        value={settingsForm.taglineEn}
                        onChange={(e) =>
                          setSettingsForm((s) => ({ ...s, taglineEn: e.target.value }))
                        }
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 space-y-4">
                    <h4 className="font-display text-sm font-bold text-[#0D1117]">
                      Studio &amp; Management Disclaimer + Monetisasi AdSense Blog
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="cms-disclaimerId"
                          className="block text-xs font-semibold text-stone-800 mb-1"
                        >
                          Disclaimer Manajemen (ID)
                        </label>
                        <textarea
                          id="cms-disclaimerId"
                          rows={2}
                          value={settingsForm.managementDisclaimerId ?? ''}
                          onChange={(e) =>
                            setSettingsForm((s) => ({
                              ...s,
                              managementDisclaimerId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cms-disclaimerEn"
                          className="block text-xs font-semibold text-stone-800 mb-1"
                        >
                          Management Disclaimer (EN)
                        </label>
                        <textarea
                          id="cms-disclaimerEn"
                          rows={2}
                          value={settingsForm.managementDisclaimerEn ?? ''}
                          onChange={(e) =>
                            setSettingsForm((s) => ({
                              ...s,
                              managementDisclaimerEn: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label
                          htmlFor="cms-adsenseClient"
                          className="block text-xs font-semibold text-stone-800 mb-1"
                        >
                          AdSense Publisher ID
                        </label>
                        <input
                          id="cms-adsenseClient"
                          type="text"
                          placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                          value={settingsForm.adsenseClientId ?? ''}
                          onChange={(e) =>
                            setSettingsForm((s) => ({ ...s, adsenseClientId: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono-tabular"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cms-adsenseBlogSlot"
                          className="block text-xs font-semibold text-stone-800 mb-1"
                        >
                          AdSense Blog Slot ID
                        </label>
                        <input
                          id="cms-adsenseBlogSlot"
                          type="text"
                          placeholder="1234567890"
                          value={settingsForm.adsenseBlogSlotId ?? ''}
                          onChange={(e) =>
                            setSettingsForm((s) => ({ ...s, adsenseBlogSlotId: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono-tabular"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cms-adsenseArticleSlot"
                          className="block text-xs font-semibold text-stone-800 mb-1"
                        >
                          AdSense Article Slot ID
                        </label>
                        <input
                          id="cms-adsenseArticleSlot"
                          type="text"
                          placeholder="0987654321"
                          value={settingsForm.adsenseArticleSlotId ?? ''}
                          onChange={(e) =>
                            setSettingsForm((s) => ({
                              ...s,
                              adsenseArticleSlotId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono-tabular"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold rounded-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {savingSettings
                        ? lang === 'en'
                          ? 'Saving...'
                          : 'Menyimpan...'
                        : lang === 'en'
                        ? 'Save Location & Settings'
                        : 'Simpan Lokasi & Pengaturan'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
