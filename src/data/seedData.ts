import type {
  BlogPost,
  GeoRegionProfile,
  HostingPartnerItem,
  PortfolioItem,
  ProcedurePage,
  SiteSettings,
  TestimonialItem,
} from '../types/domain';

export const HERO_STUDIO_IMAGE =
  '/src/assets/images/hero_advertising_studio_1795655950660.jpg';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  primaryHubName: 'Tangerang Raya',
  primaryAddress: 'Project-Based Studio · Tangerang Raya (Jaringan Akomoda Network)',
  secondaryAddress: 'Layanan Proyek Jarak Jauh & Meeting By Appointment · Jabodetabek & Nasional',
  contactEmail: 'halo@kotobatuah.com',
  contactPhone: '+62 813-2441-2025',
  taglineId: 'Studio Periklanan Project-Based · Tangerang Raya, Jakarta & Nasional',
  taglineEn: 'Project-Based Advertising Studio · Greater Tangerang, Jakarta & Nationwide',
  managementDisclaimerId:
    'Kami beroperasi secara project-based di bawah Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini.',
  managementDisclaimerEn:
    'We operate as a project-based studio within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id serving as our current Management Representative.',
  adsenseClientId: '',
  adsenseBlogSlotId: '',
  adsenseArticleSlotId: '',
};

export const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'ooh-sudirman-arabica-2026',
    title: 'Konsep Kampanye Videotron & Web Zafran Coffee Roastery',
    client: 'Studi Showcase · Zafran Coffee Roastery',
    category: 'OOH & Billboard',
    metricLabel: 'Integrasi OOH + Web Cepat',
    summary:
      'Rancangan sinkronisasi visual LED videotron dan halaman tujuan berkecepatan tinggi untuk produk Green Beans, Roasted Beans, serta Jasa Giling & Roasting dari Pamulang, Tangerang Selatan.',
    challenge:
      'Menghubungkan paparan visual media luar ruang di koridor komuter Tangerang Raya–Jakarta dengan katalog produk B2B yang langsung dapat diakses dari perangkat seluler.',
    solution:
      'Adaptasi materi visual roastery berkarakter ke layar LED format lanskap yang terhubung melalui QR/short-link ke landing page ringan di atas jaringan Edge CDN.',
    imageUrl: '/src/assets/images/zafran_coffee_billboard_1795681798711.jpg',
    location: 'Tangerang Raya & Jakarta',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: 'digital-axon-infrastructure-2026',
    title: 'Blueprint Akuisisi Leads & CMS Infrastruktur B2B',
    client: 'Kapabilitas Proyek · B2B Digital',
    category: 'Kampanye Digital',
    metricLabel: 'Arsitektur LCP < 1,2 Detik',
    summary:
      'Arsitektur landing page berkecepatan tinggi, struktur data SEO + GEO lokal, dan kampanye pencarian terarah untuk segmen korporasi serta layanan jasa di Indonesia.',
    challenge:
      'Banyak kampanye iklan berbayar mengalami biaya per prospek tinggi akibat halaman tujuan yang lambat dan struktur formulir yang kurang relevan dengan pencarian lokal.',
    solution:
      'Penerapan Partner Hosting Edge CDN, sinkronisasi CMS responsif dengan Google Sheets, serta kalibrasi Google & Meta Search Ads berbasis niat beli lokal.',
    imageUrl: '/src/assets/images/portfolio_digital_campaign_1795655952843.jpg',
    location: 'Tangerang Raya & Nasional',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: 'branding-aurum-stone-2025',
    title: 'Sistem Identitas Visual & Katalog Digital Ritel',
    client: 'Kapabilitas Proyek · Branding',
    category: 'Branding & Identitas',
    metricLabel: 'Panduan Merek Terpadu',
    summary:
      'Perancangan sistem identitas visual merek, standar kemasan komersial, serta katalog digital responsif untuk membantu merek tampil konsisten di kanal offline dan online.',
    challenge:
      'Produk ritel lokal kerap kalah bersaing di level persepsi karena aset visual antara kemasan fisik, profil media sosial, dan situs web belum seragam.',
    solution:
      'Penyusunan sistem tipografi, palet warna editorial kontras tinggi, panduan kemasan cetak, serta lookbook web yang mudah diperbarui secara mandiri.',
    imageUrl: '/src/assets/images/portfolio_brand_identity_1795655950942.jpg',
    location: 'Tangerang Raya & Bandung',
    year: '2026',
    featured: false,
    published: true,
    sortOrder: 3,
  },
  {
    id: 'video-artisan-culinary-2026',
    title: 'Produksi Aset Video Komersial 4K & Format LED Vertikal',
    client: 'Kapabilitas Proyek · Video Studio',
    category: 'Produksi Video',
    metricLabel: 'Master 4K & Adaptasi 15 Detik',
    summary:
      'Produksi materi video komersial beresolusi tinggi beserta rangkaian potongan adaptasi berdurasi 15 detik untuk kebutuhan media sosial dan layar digital OOH.',
    challenge:
      'Merek membutuhkan satu sesi produksi yang efisien namun langsung menghasilkan aset siap pakai untuk kampanye iklan digital berbayar maupun layar videotron.',
    solution:
      'Perencanaan storyboard modular dengan pencahayaan sinematik serta ekspor multi-rasio (16:9 lanskap, 9:16 vertikal, dan resolusi kustom LED).',
    imageUrl: '/src/assets/images/portfolio_video_production_1795655951731.jpg',
    location: 'Tangerang Raya & Padang',
    year: '2026',
    featured: false,
    published: true,
    sortOrder: 4,
  },
];

// Kosong secara default: hanya menampilkan testimoni klien riil yang ditambahkan via CMS dengan izin publikasi.
export const SEED_TESTIMONIALS: TestimonialItem[] = [];

export const SEED_HOSTING_PARTNERS: HostingPartnerItem[] = [
  {
    id: 'hosting-edge-kampanye',
    name: 'KotoCloud Edge Kampanye',
    tier: 'Edge CDN',
    region: 'Jakarta & Singapura',
    uptimeSla: '99.99%',
    description:
      'Dirancang untuk landing page iklan bertrafik tinggi agar klik berbayar tidak terbuang akibat halaman lambat.',
    features: [
      'Node Edge CDN Indonesia (latensi < 25ms)',
      'CMS Headless Responsif siap publikasi instan',
      'SSL Enterprise & proteksi DDoS otomatis',
      'Integrasi pelacakan konversi GA4 & Meta Pixel',
    ],
    published: true,
    sortOrder: 1,
  },
  {
    id: 'hosting-dedicated-media',
    name: 'KotoCloud Studio Media',
    tier: 'Dedicated Media',
    region: 'Jakarta Tier-3 DC',
    uptimeSla: '99.95%',
    description:
      'Penyimpanan dan pengiriman aset portofolio visual 4K, video kampanye, serta microsite interaktif multi-cabang.',
    features: [
      'Transcoding aset gambar WebP/AVIF otomatis',
      'Bandwidth khusus lonjakan trafik kampanye OOH',
      'Pencadangan harian terenkripsi multi-zona',
      'Staging lingkungan pratinjau untuk persetujuan klien',
    ],
    published: true,
    sortOrder: 2,
  },
  {
    id: 'hosting-managed-cms',
    name: 'KotoCloud Managed SEO Suite',
    tier: 'Cloud Managed',
    region: 'Multi-Region ID',
    uptimeSla: '99.99%',
    description:
      'Paket partner hosting terkelola penuh dengan pemantauan Core Web Vitals, Schema.org lokal, dan pembaruan konten berkala.',
    features: [
      'Optimisasi Core Web Vitals (LCP < 1.2 detik)',
      'Generator halaman target kota SEO + GEO otomatis',
      'Dukungan teknis prioritas 24/7 via tim lokal',
      'Sinkronisasi real-time database leads terenkripsi',
    ],
    published: true,
    sortOrder: 3,
  },
];

export const GEO_REGIONS: GeoRegionProfile[] = [
  {
    id: 'tangerang-raya',
    regionLabel: 'Tangerang Raya (Basis Utama)',
    regionLabelEn: 'Greater Tangerang (Primary Hub)',
    hubCity: 'BSD City · Gading Serpong · Alam Sutera',
    oohInventoryCount: 'Koridor Mitra OOH',
    oohInventoryCountEn: 'Partner OOH Network',
    avgLoadLatency: 'Edge CDN',
    localSearchLift: 'Fokus SEO + GEO Lokal',
    localSearchLiftEn: 'Local SEO + GEO Focus',
    summary:
      'Basis operasional utama kotobatuah.com secara project-based di Tangerang Raya. Mengoordinasikan aktivasi videotron mitra di koridor BSD City, Alam Sutera, Gading Serpong, Karawaci, dan akses Bandara Soekarno-Hatta bersama optimisasi SEO + GEO lokal.',
    summaryEn:
      'Primary project-based operational hub of kotobatuah.com in Greater Tangerang. Coordinates partner LED activations across BSD City, Alam Sutera, Gading Serpong, Karawaci, and Soekarno-Hatta Airport corridors alongside local SEO + GEO targeting.',
    targetKeywords: [
      'agensi periklanan tangerang raya',
      'sewa billboard bsd alam sutera',
      'digital marketing agency tangerang selatan',
      'partner hosting & cms tangerang',
    ],
    recommendedChannels: [
      'Videotron LED Koridor BSD City, Alam Sutera & Gading Serpong',
      'Google Maps & Local Pack SEO Tangerang Selatan / Kota / Kab.',
      'Meta & Google Ads Geo-Fencing Radius Kawasan Bisnis',
    ],
    recommendedChannelsEn: [
      'LED Videotron Networks across BSD City, Alam Sutera & Gading Serpong',
      'Google Maps & Local Pack SEO across South, City & Regency Tangerang',
      'Geo-Fenced Meta & Google Search Campaigns around Commercial Corridors',
    ],
  },
  {
    id: 'jabodetabek',
    regionLabel: 'Jakarta & Jabodetabek',
    regionLabelEn: 'Greater Jakarta (Jabodetabek)',
    hubCity: 'Jakarta Raya · Koridor Bisnis',
    oohInventoryCount: 'Jaringan LED CBD',
    oohInventoryCountEn: 'CBD LED Network',
    avgLoadLatency: 'Edge CDN',
    localSearchLift: 'Skema B2B & Ritel',
    localSearchLiftEn: 'B2B & Retail Funnel',
    summary:
      'Koordinasi proyek kampanye korporasi B2B, peluncuran produk ritel nasional, dan akuisisi prospek terukur melalui aktivasi layar LED kawasan niaga serta halaman web cepat berbasis Edge CDN.',
    summaryEn:
      'Project-based coordination for B2B enterprise campaigns, national retail launches, and measurable lead acquisition via commercial LED placements and Edge CDN web pages.',
    targetKeywords: [
      'creative advertising agency jakarta',
      'billboard led sudirman thamrin',
      'lead generation b2b indonesia',
      'managed partner hosting jakarta',
    ],
    recommendedChannels: [
      'Digital OOH Koridor Sudirman, Thamrin & Gatot Subroto',
      'Google Search Ads High-Intent & LinkedIn B2B',
      'Landing Page CMS Ultra-Cepat Server Jakarta',
    ],
    recommendedChannelsEn: [
      'Digital OOH across Sudirman, Thamrin & Gatot Subroto Corridors',
      'High-Intent Google Search & B2B LinkedIn Campaigns',
      'Sub-Second CMS Landing Pages Hosted in Jakarta Edge DC',
    ],
  },
  {
    id: 'padang-sumbar',
    regionLabel: 'Padang & Sumatera Barat',
    regionLabelEn: 'Padang & West Sumatra',
    hubCity: 'Padang (Khatib Sulaiman)',
    oohInventoryCount: 'Koridor Mitra Regional',
    oohInventoryCountEn: 'Regional Partner Sites',
    avgLoadLatency: 'Edge CDN',
    localSearchLift: 'Fokus Pencarian Lokal',
    localSearchLiftEn: 'Local Search Focus',
    summary:
      'Koordinasi media proyek di Sumatera Barat yang menghubungkan penempatan billboard koridor pusat kota dengan optimisasi Google Business Profile untuk ekspansi ritel, kuliner, dan jasa daerah.',
    summaryEn:
      'Integrated regional project coordination in West Sumatra pairing city billboard corridors with Google Business Profile optimization for retail, hospitality, and regional brands.',
    targetKeywords: [
      'agensi periklanan padang',
      'sewa billboard sumatera barat',
      'jasa digital marketing padang',
    ],
    recommendedChannels: [
      'Videotron LED Koridor Sudirman & Khatib Sulaiman',
      'Google Maps & Local Pack SEO Sumatera Barat',
      'Meta Ads Radius Geo-Fencing 15 km',
    ],
    recommendedChannelsEn: [
      'LED Videotrons along Sudirman & Khatib Sulaiman Corridors',
      'West Sumatra Google Maps & Local Pack SEO',
      '15 km Radius Geo-Fenced Meta Campaigns',
    ],
  },
  {
    id: 'bandung-surabaya-medan',
    regionLabel: 'Bandung, Surabaya & Medan',
    regionLabelEn: 'Bandung, Surabaya & Medan',
    hubCity: 'Bandung · Surabaya · Medan',
    oohInventoryCount: 'Jaringan Mitra Nasional',
    oohInventoryCountEn: 'National Partner Network',
    avgLoadLatency: 'Edge CDN',
    localSearchLift: 'Halaman Cabang GEO',
    localSearchLiftEn: 'GEO Branch Pages',
    summary:
      'Ekspansi proyek lintas kota untuk sektor gaya hidup, manufaktur, jasa keuangan, dan waralaba komersial di kawasan perdagangan utama Pulau Jawa dan Sumatera.',
    summaryEn:
      'Cross-city project expansion for lifestyle, manufacturing, financial services, and commercial franchises across key trade corridors in Java and Sumatra.',
    targetKeywords: [
      'agensi iklan bandung surabaya medan',
      'media luar ruang pusat niaga',
      'seo lokal multi cabang indonesia',
    ],
    recommendedChannels: [
      'Billboard Akses Bandara & Pusat Niaga Utama',
      'Halaman Cabang Terstruktur Schema.org LocalBusiness',
      'Sistem Manajemen Leads Terpusat di Cloud',
    ],
    recommendedChannelsEn: [
      'Airport Access & Commercial District Billboards',
      'Multi-Branch Schema.org LocalBusiness City Pages',
      'Centralized Cloud Lead Management Pipeline',
    ],
  },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'strategi-videotron-tangerang-raya-qr-leads',
    slug: 'strategi-videotron-tangerang-raya-qr-leads',
    titleId: 'Cara Mengukur ROI Videotron Tangerang Raya ke Leads WhatsApp & Web',
    titleEn: 'Measuring Tangerang Raya LED Billboard ROI via QR & Fast Landing Pages',
    excerptId:
      'Pelajari bagaimana integrasi visual LED BSD–Sudirman dengan halaman tujuan sub-1,2 detik mengubah tayangan luar ruang menjadi permintaan katalog B2B terukur.',
    excerptEn:
      'See how pairing BSD–Sudirman LED screens with sub-1.2s landing pages turns outdoor impressions into trackable B2B leads.',
    contentId:
      'Banyak brand masih menganggap iklan billboard atau videotron hanya sekadar membangun kesadaran merek tanpa pelacakan angka konversi. Di koridor Tangerang Raya hingga Jakarta, pendekatan ini dapat dioptimalkan secara drastis dengan menghubungkan visual berdurasi 15 detik ke URL pendek dan QR dinamis berbasis UTM.\n\nSebagai simulasi penerapan untuk lini usaha kopi roastery B2B dari Pamulang yang menyasar kafe Jakarta, kunci utamanya adalah konsistensi pesan antara layar videotron jam sibuk dan halaman tujuan yang langsung menampilkan layanan Green Beans, Roasted Beans, serta Jasa Roasting.\n\nDidukung infrastruktur Partner Hosting Edge CDN Jakarta, halaman tujuan terbuka dalam kurang dari 1,2 detik di jaringan seluler 4G/5G sehingga lonjakan trafik saat jam pulang kantor tidak terbuang sia-sia.',
    contentEn:
      'Many brands still treat outdoor LED billboards purely as awareness media with no direct conversion tracking. Along the Greater Tangerang to Jakarta corridor, combining high-contrast 15-second motion visuals with UTM-tagged short links and QR codes turns commuter attention into measurable pipeline.\n\nAs an illustrative deployment blueprint for a Pamulang-based B2B coffee roastery targeting Jakarta cafes, the decisive factor is aligning LED artwork with a fast web destination showcasing Green Beans, Roasted Beans, and custom roasting services.\n\nHosted on our Jakarta Edge CDN Partner Hosting stack, mobile landing pages load in under 1.2 seconds during peak commute traffic spikes.',
    category: 'Strategi OOH',
    author: 'Tim Strategi OOH kotobatuah.com',
    coverImageUrl: '/src/assets/images/zafran_coffee_billboard_1795681798711.jpg',
    tags: ['Videotron BSD', 'Tangerang Raya', 'ROI Billboard'],
    seoTitle: 'Cara Mengukur ROI Videotron Tangerang Raya | Blog kotobatuah.com',
    seoDescription:
      'Panduan menghubungkan iklan videotron Tangerang Raya & Jakarta dengan landing page cepat untuk menangkap leads terukur.',
    geoCity: 'Tangerang Raya',
    readMinutes: 4,
    featured: true,
    published: true,
    publishedAt: '2026-11-24',
    source: 'cms',
  },
  {
    id: 'optimisasi-seo-geo-lokal-tangerang-jakarta',
    slug: 'optimisasi-seo-geo-lokal-tangerang-jakarta',
    titleId: 'Blueprint SEO + GEO Lokal agar Bisnis Anda Muncul Pertama di Google & AI Search',
    titleEn: 'Local SEO + GEO Blueprint to Rank First Across Google & AI Search',
    excerptId:
      'Menggabungkan Schema.org LocalBusiness, halaman kota terstruktur, dan otoritas konten Google Sheets untuk mendominasi pencarian niat beli lokal.',
    excerptEn:
      'Combine Schema.org LocalBusiness markup, city-targeted pages, and structured blog publishing to capture local buyer intent.',
    contentId:
      'Perilaku pencarian calon klien B2B kini terbagi antara Google Local Pack dan mesin jawab berbasis AI (Generative Engine Optimization / GEO). Agar bisnis Anda direkomendasikan sebagai rujukan utama di Tangerang Raya, Jakarta, maupun Padang, struktur data halaman harus jelas dan terverifikasi.\n\nPertama, pastikan entitas wilayah operasional, layanan inti, dan nomor kontak konsisten antara situs utama, Schema.org JSON-LD, dan kanal resmi Anda.\n\nKedua, terbitkan dokumentasi proyek dan artikel edukatif berbasis wilayah melalui CMS yang terhubung ke Google Sheets sehingga tim konten dapat memperbarui kata kunci lokal secara rutin tanpa menyentuh kode.',
    contentEn:
      'B2B buyer discovery now spans both Google Local Pack results and AI-assisted search engines (Generative Engine Optimization / GEO). To ensure your brand appears as a trusted regional authority across Greater Tangerang and Jakarta, page data must be machine-readable.\n\nFirst, keep your operational region, core services, and official contact phone consistent across Schema.org JSON-LD and your official channels.\n\nSecond, publish authentic project documentation and regional guides from a structured Google Sheets editorial workflow.',
    category: 'SEO & GEO',
    author: 'Divisi SEO & GEO kotobatuah.com',
    coverImageUrl: '/src/assets/images/portfolio_digital_campaign_1795655952843.jpg',
    tags: ['SEO Lokal', 'GEO AI Search', 'Schema.org'],
    seoTitle: 'Blueprint SEO + GEO Lokal Tangerang Raya & Jakarta',
    seoDescription:
      'Strategi teknis Schema.org dan konten berbasis kota untuk memenangkan peringkat Google dan pencarian AI.',
    geoCity: 'Tangerang Raya & Jakarta',
    readMinutes: 5,
    featured: false,
    published: true,
    publishedAt: '2026-11-20',
    source: 'cms',
  },
  {
    id: 'partner-hosting-edge-untuk-konversi-iklan',
    slug: 'partner-hosting-edge-untuk-konversi-iklan',
    titleId: 'Mengapa Kecepatan Server < 1,2 Detik Menentukan Biaya Per Lead Kampanye Iklan',
    titleEn: 'Why Sub-1.2s Edge Partner Hosting Cuts Paid Advertising Cost Per Lead',
    excerptId:
      'Setiap tambahan 1 detik waktu muat menurunkan konversi formulir iklan hingga 20%. Lihat arsitektur Edge CDN & CMS yang kami terapkan.',
    excerptEn:
      'Every extra second of page load drops ad conversion significantly. Explore our sub-1.2s Edge CDN and responsive CMS setup.',
    contentId:
      'Kesalahan paling mahal dalam kampanye Google Ads dan Meta Ads adalah mengirim klik berbayar ke server lambat dengan aset gambar yang belum teroptimasi. Pengunjung seluler yang menunggu lebih dari 3 detik cenderung menutup tab sebelum formulir konsultasi sempat dimuat.\n\nMelalui layanan Partner Hosting terkelola di Cloudflare Edge dan node regional Jakarta–Singapura, setiap aset statis dilayani dengan header cache immutable serta enkripsi SSL penuh.\n\nTim pemasaran tetap leluasa memperbarui konten blog dan konfigurasi promo melalui Google Sheets & CMS tanpa mengorbankan skor Core Web Vitals.',
    contentEn:
      'The most expensive mistake in Google and Meta advertising is routing paid clicks to slow origin servers. Mobile prospects waiting more than 3 seconds frequently bounce before your lead form finishes rendering.\n\nThrough our managed Partner Hosting infrastructure backed by global Edge CDN nodes in Jakarta and Singapore, static assets load instantaneously with immutable caching.\n\nMarketing teams retain full flexibility to publish blog updates from Google Sheets without sacrificing Core Web Vitals.',
    category: 'Partner Hosting',
    author: 'Tim Infrastruktur KotoCloud',
    coverImageUrl: '/src/assets/images/portfolio_brand_identity_1795655950942.jpg',
    tags: ['Edge CDN', 'Core Web Vitals', 'Partner Hosting'],
    seoTitle: 'Kecepatan Hosting & Biaya Per Lead Iklan Digital',
    seoDescription:
      'Pengaruh latency Edge CDN dan optimisasi LCP < 1,2 detik terhadap rasio konversi kampanye iklan.',
    geoCity: 'Jakarta & Singapura',
    readMinutes: 4,
    featured: false,
    published: true,
    publishedAt: '2026-11-15',
    source: 'cms',
  },
];

export const SEED_PROCEDURE_PAGES: ProcedurePage[] = [
  {
    id: 'disclaimers',
    slug: 'disclaimers',
    titleId: 'Disclaimers & Pernyataan Manajemen',
    titleEn: 'Disclaimers & Management Statement',
    summaryId:
      'Keterbukaan model kerja project-based di bawah Jaringan Akomoda Network, perwakilan manajemen resmi, penggunaan AI Optimizer, serta penayangan iklan mitra/AdSense.',
    summaryEn:
      'Official disclosure regarding project-based studio operations within Akomoda Network, Management Representative, AI optimization workflows, and advertising placements.',
    contentId:
      'Kami beroperasi dengan model kerja berbasis proyek (project-based) di bawah Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini untuk ekosistem resmi kotobatuah.com, kotobatuah.web.id, dan koto.biz.id.\n\nSebagai studio kolaborasi project-based dengan basis operasional di Tangerang Raya, koordinasi proyek berjalan secara digital/remote dan pertemuan tatap muka dijadwalkan berdasarkan perjanjian (by appointment). Seluruh showcase atau blueprint kampanye di halaman utama bersifat ilustratif atas kapabilitas layanan kecuali dinyatakan sebagai studi kasus mitra terverifikasi.\n\nSebagian ruang artikel pada kanal Blog kotobatuah.com menyediakan slot penempatan iklan pihak ketiga (termasuk Google AdSense) atau sponsor terkurasi yang terpisah secara editorial dari opini redaksi.',
    contentEn:
      'We operate on a project-based studio model within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id serving as our current Management Representative across the kotobatuah.com, kotobatuah.web.id, and koto.biz.id ecosystem.\n\nOperating from our Greater Tangerang base without walk-in retail counters, project coordination runs remotely and on-site client meetings are arranged strictly by appointment. Solution blueprints displayed on the homepage illustrate service capabilities unless explicitly marked as verified client testimonials.\n\nEditorial pages within the kotobatuah.com Blog may display third-party advertising slots (including Google AdSense) or clearly labeled partner sponsorships.',
    updatedAt: '2026-11-26',
    published: true,
    source: 'cms',
  },
  {
    id: 'tos',
    slug: 'tos',
    titleId: 'Terms of Service (Ketentuan Layanan)',
    titleEn: 'Terms of Service',
    summaryId:
      'Ketentuan penggunaan situs, pengajuan konsultasi proyek, layanan Partner Hosting, hak kekayaan intelektual, dan tata kelola kerja sama kotobatuah.com.',
    summaryEn:
      'Terms governing website access, project consultation requests, Partner Hosting SLAs, intellectual property, and service engagements.',
    contentId:
      'Dengan mengakses kotobatuah.com atau mengajukan formulir konsultasi proyek, Anda menyetujui ketentuan layanan berikut di bawah pengelolaan project-based Jaringan Akomoda Network (Management Representative: James Isa a.k.a Jimkoto.my.id).\n\n1. Ruang Lingkup Layanan: Konsultasi awal melalui situs maupun asisten KotoAI bersifat informatif. Pelaksanaan proyek periklanan OOH, manajemen iklan berbayar, serta aktivasi Partner Hosting diatur lebih rinci dalam proposal komersial dan kesepakatan proyek tertulis.\n\n2. Hak Kekayaan Intelektual: Seluruh aset merek Koto Batuah dan materi editorial dilindungi hukum hak cipta dan tidak diperkenankan digandakan untuk kepentingan komersial tanpa izin tertulis.\n\n3. Keandalan Infrastruktur: Layanan Partner Hosting menargetkan ketersediaan hingga 99,99% SLA sesuai paket yang disepakati dengan pemeliharaan terjadwal yang diinformasikan sebelumnya.',
    contentEn:
      'By accessing kotobatuah.com or submitting a project consultation request, you agree to these Terms of Service governed under the Akomoda Network project-based framework (Management Representative: James Isa a.k.a. Jimkoto.my.id).\n\n1. Scope of Engagement: Initial inquiries via web forms or KotoAI are advisory. Paid OOH placements, digital media buying, and Partner Hosting activations are governed by written project proposals.\n\n2. Intellectual Property: Koto Batuah brand assets and editorial publications remain proprietary unless explicitly licensed in project deliverables.\n\n3. Infrastructure Reliability: Managed Partner Hosting tiers target up to 99.99% uptime SLA per signed tier specifications.',
    updatedAt: '2026-11-26',
    published: true,
    source: 'cms',
  },
  {
    id: 'privacy-policy',
    slug: 'privacy-policy',
    titleId: 'Privacy Policy (Kebijakan Privasi)',
    titleEn: 'Privacy Policy',
    summaryId:
      'Bagaimana kotobatuah.com mengumpulkan, melindungi, dan memproses data formulir konsultasi, Google Workspace CMS, dan layanan iklan.',
    summaryEn:
      'How kotobatuah.com collects, secures, and processes consultation inquiry data, Workspace CMS access, and advertising analytics.',
    contentId:
      'kotobatuah.com menghargai privasi setiap pengunjung dan calon mitra bisnis sesuai prinsip perlindungan data pribadi (UU PDP Indonesia).\n\n1. Data yang Dikumpulkan: Data yang Anda kirimkan secara sukarela melalui Formulir Konsultasi (nama lengkap, perusahaan, email bisnis, nomor WhatsApp, kota target, dan ringkasan brief) disimpan secara terenkripsi di Firebase Firestore dengan kontrol akses khusus administrator resmi (yames.isa@gmail.com / Management Representative James Isa).\n\n2. Penggunaan Data: Informasi kontak hanya digunakan untuk menyusun proposal media, menghubungi Anda terkait proyek, serta koordinasi layanan kampanye. Kami tidak menjual data pribadi klien kepada pihak ketiga.\n\n3. Iklan & Pihak Ketiga: Kanal blog dapat menayangkan Google AdSense atau alat analitik yang mematuhi pengaturan persetujuan cookies browser Anda. Untuk permintaan penghapusan data, hubungi halo@kotobatuah.com.',
    contentEn:
      'kotobatuah.com is committed to protecting visitor and client inquiry data in alignment with Indonesian Personal Data Protection (UU PDP) standards.\n\n1. Information Collected: Lead details voluntarily submitted via the Consultation Form (full name, company, business email, WhatsApp number, target city, and project brief) are stored securely in Firebase Firestore with strict admin-only access.\n\n2. Purpose of Processing: Submitted contact information is used solely to prepare media proposals and respond to your inquiries. We never sell client lead data.\n\n3. Third-Party Ads & Analytics: Blog pages may display Google AdSense placements subject to your browser cookie consent preferences. Request data updates or deletion via halo@kotobatuah.com.',
    updatedAt: '2026-11-26',
    published: true,
    source: 'cms',
  },
  {
    id: 'cookies',
    slug: 'cookies',
    titleId: 'Cookie Policy (Kebijakan & Preferensi Cookies)',
    titleEn: 'Cookie Policy & Preferences',
    summaryId:
      'Penjelasan penggunaan cookies esensial, preferensi bahasa/sesi, analitik performa, serta cookies periklanan Google AdSense di kotobatuah.com.',
    summaryEn:
      'Transparency on essential functional storage, language preferences, performance telemetry, and Google AdSense advertising cookies.',
    contentId:
      'Situs kotobatuah.com menggunakan penyimpanan lokal browser dan cookies minimal untuk menjaga pengalaman browsing tetap cepat (< 1,2 detik) serta transparan.\n\n1. Cookies Esensial & Preferensi: Menyimpan pilihan bahasa antarmuka (Indonesia / English), status persetujuan cookies Anda, serta keamanan autentikasi admin CMS.\n\n2. Cookies Analitik & Performa Edge: Digunakan oleh infrastruktur jaringan Cloudflare dan pemantauan Core Web Vitals guna memastikan rute halaman termuat optimal tanpa bot spam.\n\n3. Cookies Periklanan (Google AdSense): Apabila Anda menyetujui semua cookies, mitra periklanan seperti Google dapat menggunakan cookie untuk menayangkan iklan yang relevan di halaman artikel Blog. Anda dapat memilih mode "Hanya Esensial" kapan saja melalui panel kontrol di bagian bawah situs.',
    contentEn:
      'kotobatuah.com uses lightweight browser storage and cookies to preserve sub-1.2 second performance and transparent user controls.\n\n1. Essential & Preference Storage: Remembers your active language (Indonesian / English), cookie consent selection, and secure admin authentication states.\n\n2. Edge Security & Analytics: Helps Cloudflare edge nodes protect forms against automated abuse and monitor Core Web Vitals.\n\n3. Advertising Cookies (Google AdSense): When you accept all cookies, third-party ad partners such as Google may serve relevant placements inside Blog articles. You may switch to "Essential Only" at any time using the Cookie Preferences control in the site footer.',
    updatedAt: '2026-11-26',
    published: true,
    source: 'cms',
  },
];
