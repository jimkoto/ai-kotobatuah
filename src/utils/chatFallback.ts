import type { Locale, SiteSettings } from '../types/domain';

interface KnowledgeRule {
  keywords: string[];
  replyId: (s: SiteSettings) => string;
  replyEn: (s: SiteSettings) => string;
}

const KNOWLEDGE_RULES: KnowledgeRule[] = [
  {
    keywords: [
      '2027',
      'paket',
      'website',
      'kilat',
      'audit',
      'retainer',
      'bulanan',
      'umkm',
      'properti',
      'package',
      'express',
    ],
    replyId: (s) =>
      `**3 Paket Siap Akselerasi Digital 2027 — kotobatuah.com**:\n\n1. **Website Bisnis Kilat 2027** (3–5 hari kerja): Landing page/profil responsif, struktur value & FAQ, serta tombol WhatsApp otomatis + SEO/GEO dasar.\n2. **Audit & Optimasi Web + SEO/GEO** (2–4 hari kerja): Perbaikan kecepatan, heading, ringkasan jawaban AI/GEO, dan metadata.\n3. **Retainer Perawatan & Konten Bulanan** (skema bulanan/tahunan): Pembaruan promo/halaman berkala & penyusunan draf artikel terarah.\n\nHubungi WhatsApp **${s.contactPhone}** atau klik salah satu paket di halaman utama untuk mengamankan slot terdekat.`,
    replyEn: (s) =>
      `**3 Core 2027 Conversion Packages — kotobatuah.com**:\n\n1. **Express Business Website 2027** (3–5 business days): Responsive landing/profile page with WhatsApp CTA & foundational SEO/GEO.\n2. **Web Audit & SEO/GEO Optimization** (2–4 business days): Speed, heading cleanup, AI/GEO readiness, and conversion CTA tuning.\n3. **Monthly Care & Content Retainer**: Ongoing page updates, content drafts, and priority technical care.\n\nReach us on WhatsApp **${s.contactPhone}** or choose a package card to reserve a slot.`,
  },
  {
    keywords: [
      'billboard',
      'ooh',
      'videotron',
      'baliho',
      'led',
      'bsd',
      'alam sutera',
      'sudirman',
      'scbd',
      'harga',
      'biaya',
      'tarif',
      'price',
      'cost',
    ],
    replyId: (s) =>
      `**Layanan OOH & Videotron kotobatuah.com** terkoordinasi secara *project-based* bersama jaringan mitra titik strategis di **${s.primaryHubName}** (koridor BSD City, Alam Sutera, Gading Serpong & akses Bandara Soetta), koridor bisnis Jakarta, Padang, Bandung, Surabaya, dan Medan.\n\n• **Paket Aktivasi**: Disesuaikan dengan titik & durasi proyek (termasuk adaptasi visual LED, pelacakan QR UTM, dan landing page cepat).\n• Klik **"Lanjut ke Form Konsultasi"** untuk meminta ketersediaan titik mitra minggu ini.`,
    replyEn: (s) =>
      `**kotobatuah.com OOH & LED Billboard Media** coordinates campaigns on a project basis across partner screens in **${s.primaryHubName}** (BSD City, Alam Sutera, Gading Serpong & Soekarno-Hatta corridors) plus Jakarta business corridors, Bandung, Padang, Surabaya & Medan.\n\n• **Activation Scope**: Tailored by screen duration and placement tier with QR attribution landing pages.\n• Click **"Continue to Consultation Form"** below to request current partner slot availability.`,
  },
  {
    keywords: [
      'seo',
      'geo',
      'google maps',
      'local pack',
      'ranking',
      'peringkat',
      'pencarian',
      'ai search',
      'keyword',
      'kata kunci',
    ],
    replyId: (s) =>
      `**Optimisasi SEO + GEO Lokal** kami dirancang agar brand Anda terindeks rapi di Google Search, Google Maps, serta mesin jawab berbasis AI untuk target wilayah **${s.primaryHubName}**, Jabodetabek, dan nasional.\n\n• Mencakup struktur Schema.org yang jujur dan valid, halaman target kota melalui CMS/Google Sheets, serta sinkronisasi klaster kata kunci komersial sesuai kebutuhan proyek.`,
    replyEn: () =>
      `Our **Local SEO + GEO Optimization** aligns clean Schema.org structured data, city-targeted CMS landing pages, and Google Business Profile signals so buyers discover your brand across Google Search, Maps, and AI answer engines.`,
  },
  {
    keywords: [
      'hosting',
      'server',
      'cdn',
      'cloudflare',
      'cms',
      'sheets',
      'google sheets',
      'kecepatan',
      'speed',
      'uptime',
      'sla',
      'lcp',
    ],
    replyId: () =>
      `**Partner Hosting & CMS Responsif KotoCloud** memastikan klik iklan berbayar tidak terbuang sia-sia pada halaman lambat:\n\n• **Performa**: Node Edge CDN Jakarta & Singapura (**LCP < 1,2 detik**, **SLA Uptime 99,99%**).\n• **Integrasi Google Sheets**: Artikel Blog, kategori, konfigurasi situs, dan halaman prosedur legal dapat dikelola langsung lewat Google Sheets dan disinkronkan real-time ke Firestore.`,
    replyEn: () =>
      `**KotoCloud Partner Hosting & Responsive CMS** ensures paid traffic lands on sub-1.2s pages backed by Jakarta/Singapore edge nodes (**99.99% uptime SLA**).\n\n• Editorial articles, site settings, SEO/GEO keyword sheets, and /procedure/* legal pages can also be managed via our 5-tab **Google Sheets CMS**.`,
  },
  {
    keywords: [
      'digital',
      'ads',
      'iklan',
      'meta',
      'google ads',
      'tiktok',
      'leads',
      'prospek',
      'cpl',
      'adsense',
      'sponsor',
    ],
    replyId: () =>
      `**Kampanye Digital & Akuisisi Leads** menggabungkan Google Search Ads, Meta Ads, dan TikTok Ads yang langsung diarahkan ke halaman penawaran ultra-cepat dengan pelacakan konversi GA4 & Meta Pixel.\n\n• Untuk publikasi konten & monetisasi, kanal **Blog kotobatuah.com** juga menyediakan slot **Google AdSense & sponsorship media** yang terintegrasi.`,
    replyEn: () =>
      `Our **Digital Campaigns & Lead Generation** unit runs high-intent Google Search, Meta, and TikTok Ads paired with sub-second conversion landing pages.\n\n• Our **Editorial Blog** also supports **Google AdSense & sponsored media placements** configurable directly from the CMS.`,
  },
  {
    keywords: [
      'brand',
      'branding',
      'logo',
      'identitas',
      'kemasan',
      'packaging',
      'video',
      'tvc',
      'produksi',
      'film',
    ],
    replyId: () =>
      `**Branding, Identitas Visual & Produksi Video Komersial** mencakup perancangan sistem identitas merek, kemasan ritel premium, hingga film iklan 4K dan format vertikal 15 detik untuk kebutuhan media sosial dan videotron LED.`,
    replyEn: () =>
      `Our **Brand Identity & 4K Commercial Video Production** covers complete visual identity systems, premium retail packaging, and 4K/15s vertical video cuts tailored for LED screens and social feeds.`,
  },
  {
    keywords: [
      'kantor',
      'alamat',
      'kontak',
      'wa',
      'whatsapp',
      'email',
      'akomod',
      'james',
      'jimkoto',
      'representatif',
      'hubungi',
      'lokasi',
      'location',
      'address',
      'contact',
      'office',
    ],
    replyId: (s) =>
      `**Informasi Operasional & Manajemen kotobatuah.com**:\n\n• ${s.managementDisclaimerId || 'Kami beroperasi secara project-based di bawah Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini.'}\n• **Model Kerja**: Studio berbasis proyek (*Project-Based*) di **${s.primaryHubName}** dengan koordinasi jarak jauh & *meeting by appointment* (${s.secondaryAddress}).\n• **Kontak Langsung**: ${s.contactEmail} · **WhatsApp**: ${s.contactPhone}`,
    replyEn: (s) =>
      `**kotobatuah.com Operations & Management**:\n\n• ${s.managementDisclaimerEn || 'Operating as a project-based studio within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id as Management Representative.'}\n• **Operational Model**: Project-based hub in **${s.primaryHubName}** with remote coordination & by-appointment client meetings (${s.secondaryAddress}).\n• **Direct Contact**: ${s.contactEmail} · **WhatsApp**: ${s.contactPhone}`,
  },
  {
    keywords: [
      'disclaimer',
      'tos',
      'privasi',
      'privacy',
      'cookie',
      'cookies',
      'prosedur',
      'procedure',
      'legal',
      'syarat',
    ],
    replyId: () =>
      `Dokumen resmi tata kelola situs tersedia lengkap melalui menu bagian bawah pada rute:\n• **/procedure/disclaimers** (Pernyataan Manajemen & AI Optimizer)\n• **/procedure/tos** (Ketentuan Layanan)\n• **/procedure/privacy-policy** (Kebijakan Privasi UU PDP)\n• **/procedure/cookies** (Kebijakan & Preferensi Cookies)`,
    replyEn: () =>
      `Official site governance and compliance documents are available in the footer under:\n• **/procedure/disclaimers**\n• **/procedure/tos**\n• **/procedure/privacy-policy**\n• **/procedure/cookies**`,
  },
  {
    keywords: [
      'konsultasi',
      'proposal',
      'penawaran',
      'audit',
      'order',
      'pesan',
      'daftar',
      'mulai',
      'consultation',
      'quote',
    ],
    replyId: (s) =>
      `Kami menyiapkan proposal media, estimasi ROI, dan rekomendasi Partner Hosting dalam **24 jam**. Klik tombol **"Lanjut ke Form Konsultasi"** di bawah agar ringkasan pertanyaan Anda langsung masuk ke antrean prioritas tim **${s.primaryHubName}**, atau hubungi WhatsApp **${s.contactPhone}**.`,
    replyEn: (s) =>
      `We prepare tailored media proposals, ROI forecasts, and Partner Hosting blueprints within **24 hours**. Click **"Continue to Consultation Form"** below or reach us on WhatsApp **${s.contactPhone}**.`,
  },
  {
    keywords: ['halo', 'hai', 'hello', 'hi', 'pagi', 'siang', 'sore', 'malam', 'permisi'],
    replyId: (s) =>
      `Halo! Terima kasih telah menghubungi **kotobatuah.com** (Project-Based Studio · ${s.primaryHubName} · Jaringan Akomoda Network).\n\nAnda dapat menanyakan topik berikut:\n• **Billboard OOH & Videotron Mitra** (BSD, Tangerang Raya, Jakarta)\n• **SEO + GEO Lokal & AI Optimizer**\n• **Partner Hosting KotoCloud (< 1,2s) & Google Sheets CMS**\n• **Kontak & Penawaran Proposal** (${s.contactPhone})`,
    replyEn: (s) =>
      `Hello! Welcome to **kotobatuah.com** (Project-Based Studio · ${s.primaryHubName} · Akomoda Network).\n\nFeel free to ask about:\n• **Partner OOH Billboards & LED Screens** (BSD, Greater Tangerang, Jakarta)\n• **Local SEO + GEO & AI Search Optimization**\n• **KotoCloud Partner Hosting (< 1.2s) & Google Sheets CMS**\n• **Direct Contact & Proposals** (${s.contactPhone})`,
  },
];

export function generateStandardChatReply(
  query: string,
  lang: Locale,
  siteSettings: SiteSettings
): string {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return KNOWLEDGE_RULES[KNOWLEDGE_RULES.length - 1][lang === 'en' ? 'replyEn' : 'replyId'](
      siteSettings
    );
  }

  let bestRule: KnowledgeRule | null = null;
  let bestScore = 0;

  for (const rule of KNOWLEDGE_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length >= 5 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (bestRule && bestScore > 0) {
    return lang === 'en' ? bestRule.replyEn(siteSettings) : bestRule.replyId(siteSettings);
  }

  if (lang === 'en') {
    return `Thank you for your question regarding **"${query.trim().slice(0, 80)}"**.\n\n**kotobatuah.com** provides integrated **OOH LED Billboards**, **Digital Lead Campaigns**, **Local SEO + GEO Optimization**, **Branding/4K Video**, and **KotoCloud Partner Hosting (< 1.2s)** under Akomoda Network (Management Representative: James Isa / Jimkoto.my.id).\n\nType keywords such as *billboard*, *SEO*, *hosting*, *Google Sheets*, or *contact*, or click **"Continue to Consultation Form"** below (${siteSettings.contactPhone}).`;
  }

  return `Terima kasih atas pertanyaan Anda mengenai **"${query.trim().slice(0, 80)}"**.\n\n**kotobatuah.com** (Jaringan Akomoda Network) melayani **Billboard OOH & Videotron**, **Iklan Digital (Google/Meta/TikTok)**, **SEO + GEO Lokal**, **Produksi Video 4K**, serta **Partner Hosting & CMS Google Sheets (< 1,2 detik)**.\n\nKetik kata kunci seperti *billboard*, *SEO*, *hosting*, *adsense*, *prosedur*, atau *kontak*, atau tekan **"Lanjut ke Form Konsultasi"** untuk terhubung langsung ke **${siteSettings.contactPhone}**.`;
}
