import type { BlogCategory, Locale, PortfolioCategory } from '../types/domain';

export function translateCategory(category: PortfolioCategory | 'Semua', lang: Locale): string {
  if (lang === 'id') return category;
  switch (category) {
    case 'Semua':
      return 'All';
    case 'OOH & Billboard':
      return 'OOH & Billboards';
    case 'Kampanye Digital':
      return 'Digital Campaigns';
    case 'Branding & Identitas':
      return 'Brand Identity';
    case 'Produksi Video':
      return 'Video Production';
  }
}

export function translateBlogCategory(category: BlogCategory | 'Semua', lang: Locale): string {
  if (lang === 'id') return category;
  switch (category) {
    case 'Semua':
      return 'All';
    case 'Strategi OOH':
      return 'OOH Strategy';
    case 'SEO & GEO':
      return 'SEO & GEO';
    case 'Performance Ads':
      return 'Performance Ads';
    case 'Partner Hosting':
      return 'Partner Hosting';
  }
}

export const COPY = {
  id: {
    nav: {
      masalahSolusi: 'Masalah & Solusi',
      paket: 'Paket 2027',
      pendekatan: 'Pendekatan',
      faq: 'FAQ',
      blog: 'Blog',
      konsultasi: 'Brief Proyek',
      portofolio: 'Portofolio',
      layanan: 'Layanan',
      hosting: 'Partner Hosting',
      testimoni: 'Pendekatan',
      seoGeo: 'SEO & GEO',
      cta: 'Chat WhatsApp',
      openMenu: 'Buka menu navigasi',
      closeMenu: 'Tutup menu navigasi',
    },
    hero: {
      badge: 'SIAP AKSELERASI DIGITAL 2027 • KOTO BATUAH',
      h1: 'Bangun & Optimalkan Aset Digital Bisnis Anda Sebelum 2027 — Cepat, Ringan, dan Siap Menghasilkan.',
      subtitle:
        'Solusi pembuatan website bisnis, optimasi SEO & GEO, serta manajemen aset digital praktis untuk UMKM, profesional, properti, dan komunitas. Eksekusi terarah tanpa proses berbelit.',
      primaryCta: 'Chat WhatsApp Sekarang',
      primaryWaMessage:
        'Halo Koto Batuah, saya ingin konsultasi persiapan aset digital untuk 2027. Boleh info alur dan slot terdekatnya?',
      secondaryCta: 'Lihat Paket Siap 2027',
      studioLabel: 'Studio Berbasis Proyek · Jaringan Akomoda Network',
      studioCaption:
        'Eksekusi website kilat, optimasi SEO + GEO, dan manajemen aset digital siap menghasilkan menuju 2027.',
      highlights: [
        {
          code: '01',
          title: 'Akses cepat & arsitektur ringan',
          caption: 'Struktur kode bersih untuk loading responsif di mobile & desktop.',
        },
        {
          code: '02',
          title: 'Terstruktur untuk pencarian web & AI (SEO + GEO)',
          caption: 'Siap terbaca Google Search, Maps, dan ringkasan mesin pencari AI.',
        },
        {
          code: '03',
          title: 'Pendampingan langsung & transparan',
          caption: 'Komunikasi praktis via WhatsApp dengan milestone eksekusi jelas.',
        },
      ],
    },
    problems: {
      kicker: 'Masalah & Solusi Cepat',
      heading: 'Kenapa Banyak Bisnis Tertinggal Saat Pergantian Tahun?',
      items: [
        {
          num: '01',
          text: 'Website ada, tapi lambat, tampilannya usang, atau tidak mengarahkan pengunjung untuk menghubungi Anda.',
        },
        {
          num: '02',
          text: 'Promosi masih tersebar tanpa halaman utama yang jelas untuk meyakinkan calon klien atau pembeli.',
        },
        {
          num: '03',
          text: 'Persiapan konten dan kanal digital sering tertunda karena kesibukan operasional harian.',
        },
      ],
      transition:
        'Koto Batuah membantu merapikan fondasi digital Anda dengan cepat—fokus pada hal yang paling berdampak pada kredibilitas dan peluang transaksi.',
      transitionCta: 'Lihat Paket Siap 2027',
    },
    packages2027: {
      kicker: 'Tiga Paket Utama Cepat Menghasilkan',
      heading: 'Pilih langkah tercepat untuk menyiapkan aset digital bisnis Anda sebelum 2027.',
      subtitle:
        'Setiap paket disusun ringkas agar Anda bisa langsung eksekusi tanpa birokrasi berbelit. Klik paket yang sesuai untuk langsung terhubung ke WhatsApp.',
      items: [
        {
          id: 'paket-website-kilat',
          code: 'Paket 1',
          badge: 'Siap Mulai Cepat',
          featured: true,
          title: 'Website Bisnis Kilat 2027',
          audience:
            'Cocok untuk UMKM, jasa lokal, agen/tim properti, praktisi, dan komunitas yang butuh alamat resmi online cepat sebelum tahun baru.',
          features: [
            'Halaman profil / landing page responsif',
            'Struktur value, layanan/produk, keunggulan, FAQ, dan tombol kontak langsung',
            'Integrasi WhatsApp dengan pesan otomatis & pengaturan dasar SEO/GEO',
          ],
          estimateLabel: 'Estimasi',
          estimate: 'Pengerjaan kilat 3–5 hari kerja (setelah materi/brief lengkap).',
          ctaLabel: 'Pesan Paket Website Kilat',
          waMessage:
            'Halo Koto Batuah, saya tertarik dengan Paket Website Bisnis Kilat 2027 untuk usaha/proyek saya. Mohon info detail paket, estimasi waktu, dan DP-nya.',
        },
        {
          id: 'paket-audit-optimasi',
          code: 'Paket 2',
          badge: 'SEO + GEO Ready',
          featured: false,
          title: 'Audit & Optimasi Web + SEO/GEO',
          audience:
            'Cocok untuk pemilik website yang ingin situsnya lebih cepat, rapi secara struktur, dan mudah dipahami mesin pencari maupun ringkasan AI.',
          features: [
            'Evaluasi kecepatan, struktur halaman, keterbacaan konten, dan jalur konversi (CTA)',
            'Perapihan heading, ringkasan jawaban/FAQ, dan metadata agar lebih kuat di SEO & GEO',
            'Rekomendasi prioritas perbaikan yang bisa langsung dieksekusi',
          ],
          estimateLabel: 'Estimasi',
          estimate: '2–4 hari kerja.',
          ctaLabel: 'Ajukan Audit & Optimasi',
          waMessage:
            'Halo Koto Batuah, saya ingin mengajukan Audit & Optimasi Web + SEO/GEO untuk situs saya. Boleh kirimkan info langkah awalnya?',
        },
        {
          id: 'paket-retainer-bulanan',
          code: 'Paket 3',
          badge: 'Perawatan Rutin',
          featured: false,
          title: 'Retainer Perawatan & Konten Bulanan',
          audience:
            'Cocok untuk bisnis atau pengelola kanal yang ingin aset web, pembaruan informasi, dan konten rutin tetap jalan tanpa harus mengurus teknis sendiri.',
          features: [
            'Pembaruan halaman/promo/informasi berkala dan pengecekan kesehatan tautan/halaman',
            'Penyusunan draf artikel/konten terarah berbasis sudut pandang bisnis & kebutuhan audiens',
            'Prioritas respons pembaruan teknis sesuai kesepakatan paket',
          ],
          estimateLabel: 'Estimasi',
          estimate: 'Skema bulanan / kontrak tahunan.',
          ctaLabel: 'Diskusi Paket Retainer',
          waMessage:
            'Halo Koto Batuah, saya tertarik membahas Paket Retainer Perawatan & Konten Bulanan untuk kebutuhan rutin ke depan.',
        },
      ],
    },
    approach: {
      kicker: 'Bukti & Pendekatan Kerja (E-E-A-T)',
      heading: 'Pendekatan Praktis Berbasis Eksekusi Nyata',
      pillars: [
        {
          num: '01 · FOKUS EKSEKUSI',
          title: 'Fokus Hasil & Kecepatan',
          body: 'Mengutamakan halaman yang jelas tujuannya, ringan diakses, dan mudah digunakan calon pelanggan.',
          meta: 'Arsitektur Web Bersih & Cepat',
        },
        {
          num: '02 · LINTAS SEKTOR',
          title: 'Pengalaman Lintas Sektor',
          body: 'Terbiasa menangani kebutuhan digital usaha lokal/UMKM, properti, komunitas, serta pengelolaan konten dan ekosistem web.',
          meta: 'UMKM · Properti · Praktisi · Komunitas',
        },
        {
          num: '03 · EKOSISTEM KOTO BATUAH',
          title: 'Ekosistem Terarah',
          body: 'Terhubung dengan kanal pendukung Koto Batuah (kotobatuah.web.id untuk catatan & publikasi, koto.biz.id untuk kemitraan/afiliasi) sesuai kebutuhan pengembangan jangka panjang.',
          meta: 'kotobatuah.com · kotobatuah.web.id · koto.biz.id',
        },
      ],
      verifiedReviewsHeading: 'Ulasan Mitra Terverifikasi',
    },
    faqClosing: {
      kicker: 'FAQ Singkat',
      heading: 'Pertanyaan Umum Sebelum Memulai Proyek 2027',
      items: [
        {
          q: 'Berapa lama proses pengerjaannya?',
          a: 'Untuk paket website kilat atau optimasi terfokus, estimasinya beberapa hari kerja setelah kebutuhan dan materi awal disepakati.',
        },
        {
          q: 'Bagaimana alur mulai dan pembayarannya?',
          a: 'Mulai dari diskusi singkat kebutuhan via WhatsApp, penentuan ruang lingkup & jadwal, pembayaran DP awal untuk memulai pengerjaan, lalu pelunasan saat serah terima sesuai kesepakatan.',
        },
        {
          q: 'Apakah saya bisa mengupdate informasi setelah selesai?',
          a: 'Bisa. Struktur halaman dibuat rapi dan mudah disesuaikan, dan Anda juga bisa mengambil paket perawatan jika ingin pembaruan rutin ditangani.',
        },
      ],
      closingKicker: 'Langkah Berikutnya',
      closingHeading: 'Siap memulai langkah digital bisnis Anda untuk 2027?',
      closingBody:
        'Slot pengerjaan akhir tahun dibatasi agar setiap proyek tetap terjaga kualitasnya.',
      closingCta: 'Konsultasi & Amankan Slot via WhatsApp',
      closingSecondaryCta: 'Kirim Brief Tertulis',
      closingWaMessage:
        'Halo Koto Batuah, saya ingin konsultasi persiapan aset digital untuk 2027 dan mengamankan slot pengerjaan terdekat.',
    },
    portfolio: {
      kicker: 'Kapabilitas & Showcase Proyek',
      heading: 'Konsep kampanye terukur yang dirancang untuk daya ingat dan konversi.',
      emptyTitle: 'Belum ada showcase pada kategori ini.',
      emptyBody: 'Pilih kategori lain atau lihat seluruh blueprint kapabilitas kotobatuah.com.',
      showAll: 'Tampilkan Semua',
      caseStudyBtn: 'Detail Konsep',
      measuredResult: 'Fokus Deliverable:',
      clientChallenge: 'Kebutuhan Bisnis',
      ourSolution: 'Pendekatan & Eksekusi kotobatuah.com',
      backBtn: 'Kembali ke Showcase',
      consultSimilar: 'Konsultasikan Konsep Serupa',
    },
    services: {
      kicker: 'Layanan Inti kotobatuah.com',
      heading: 'Dari konsep kreatif hingga infrastruktur web yang menampung lonjakan leads.',
      outputPrefix: 'Output utama:',
      discuss: 'Diskusikan',
      list: [
        {
          num: '01.',
          title: 'Periklanan OOH & Videotron Strategis',
          serviceType: 'OOH & Billboard' as const,
          description:
            'Penempatan billboard, baliho korporat, dan videotron LED di koridor utama Tangerang Raya, Jabodetabek, dan kota besar dengan pelacakan QR real-time.',
          deliverable:
            'Audit titik lokasi, perizinan tayang, desain visual kontras tinggi, dan laporan impresi.',
        },
        {
          num: '02.',
          title: 'Kampanye Digital & Akuisisi Leads',
          serviceType: 'Kampanye Digital' as const,
          description:
            'Pengelolaan iklan pencarian Google, Meta Ads, dan TikTok Ads yang diarahkan ke halaman penawaran berkecepatan tinggi agar setiap klik berujung prospek.',
          deliverable:
            'Riset niat beli lokal, optimisasi CPL harian, dan dasbor konversi transparan.',
        },
        {
          num: '03.',
          title: 'Branding, Identitas & Produksi Video',
          serviceType: 'Branding & Identitas' as const,
          description:
            'Perancangan identitas visual merek, kemasan komersial, serta produksi film iklan 4K yang membangun kredibilitas di benak pelanggan.',
          deliverable:
            'Panduan merek lengkap, materi iklan cetak & digital, serta master video sinematik.',
        },
        {
          num: '04.',
          title: 'CMS Responsif & Partner Hosting Terkelola',
          serviceType: 'Partner Hosting & CMS' as const,
          description:
            'Sistem manajemen konten responsif untuk menerbitkan portofolio, studi kasus, dan halaman promo secara mandiri di atas server Partner Hosting berlatensi rendah.',
          deliverable:
            'Editor konten real-time, optimisasi Core Web Vitals, dan SLA Uptime hingga 99.99%.',
        },
      ],
    },
    hosting: {
      kicker: 'Partner Hosting & Sistem Manajemen Konten (CMS)',
      heading: 'Performa server berkecepatan tinggi agar anggaran iklan Anda tidak terbuang sia-sia.',
      subtitle:
        'Setiap klik dari iklan berbayar atau QR billboard diarahkan ke CMS responsif di atas jaringan Partner Hosting kami dengan waktu muat di bawah 1,2 detik.',
      serverRegion: 'Server Region:',
      chooseBtn: 'Pilih Paket Hosting',
    },
    testimonials: {
      kicker: 'Testimoni & Ulasan Terverifikasi',
      heading: 'Ulasan mitra bisnis yang telah memberikan persetujuan publikasi resmi.',
      projectModelKicker: 'Model Kerja Project-Based & Tata Kelola',
      projectModelHeading:
        'Struktur kolaborasi fleksibel tanpa beban kantor fisik konvensional—fokus penuh pada hasil proyek Anda.',
      projectPillars: [
        {
          tag: '01 · PROJECT-BASED AGILITY',
          title: 'Berbasis Proyek, Efisien & Terukur',
          body: 'Kami bekerja berdasarkan kebutuhan tiap proyek dari basis operasional Tangerang Raya bersama Jaringan Akomoda Network. Anggaran klien dialokasikan langsung ke kualitas strategi, produksi, dan performa media—bukan overhead sewa gedung.',
          meta: 'Koordinasi Remote & Meeting By Appointment',
        },
        {
          tag: '02 · TRANSPARANSI & KEPEMILIKAN',
          title: 'Aset Digital Tetap Milik Penuh Klien',
          body: 'Domain, akun iklan Google/Meta, database leads terenkripsi, hingga Google Sheets CMS tetap berada di bawah kendali Anda. Setiap tahap kerja memiliki milestone, laporan progres, serta serah terima yang jelas.',
          meta: 'Perjanjian Proyek Tertulis & Terdokumentasi',
        },
        {
          tag: '03 · VERIFIKASI PUBLIKASI',
          title: 'Hanya Ulasan Klien Nyata & Terverifikasi',
          body: 'Kolom testimoni di situs ini hanya menampilkan ulasan mitra nyata yang telah memberikan persetujuan tertulis. Pengelolaan manajemen dikoordinasikan melalui James Isa a.k.a Jimkoto.my.id.',
          meta: 'Management Representative · Akomoda Network',
        },
      ],
    },
    seoGeo: {
      kicker: 'Optimisasi SEO + GEO Lokal',
      heading: 'Dominasi pencarian lokal di kota target pelanggan Anda.',
      subtitle:
        'Kami menyinkronkan struktur data Schema.org, halaman kota dinamis pada CMS, serta penempatan media OOH agar brand Anda muncul pertama kali saat calon pembeli mencari solusi di wilayah mereka.',
      hubPrefix: 'Pusat Jaringan',
      visibilityLabel: 'Proyeksi Visibilitas',
      keywordsTitle: 'Klaster Kata Kunci SEO Lokal',
      channelsTitle: 'Kanal Terpadu yang Direkomendasikan',
      latencyLabel: 'Latensi Edge CDN',
      inventoryLabel: 'Inventori Media',
      auditBtn: 'Audit SEO Lokal Wilayah Ini',
    },
    lead: {
      kicker: 'Mulai Konsultasi Kampanye',
      heading: 'Dapatkan proposal media, estimasi ROI, dan rekomendasi hosting dalam 24 jam.',
      subtitle:
        'Ceritakan target pasar dan kota prioritas Anda. Konsultan media senior kotobatuah.com akan menyiapkan peta titik iklan, proyeksi akuisisi leads, serta skema CMS yang paling efisien.',
      primaryOffice: 'Basis Operasional (Project-Based)',
      secondaryOffice: 'Cakupan & Mekanisme Kerja',
      directContact: 'Kontak Langsung',
      successTitle: 'Permintaan Konsultasi Tersimpan',
      successBody1: 'Terima kasih,',
      successBody2: 'Kebutuhan Anda untuk layanan',
      successBody3: 'telah masuk ke sistem CRM kotobatuah.com.',
      refLabel: 'Kode Referensi:',
      sendAnother: 'Kirim Permintaan Baru',
      fullName: 'Nama Lengkap *',
      company: 'Perusahaan / Brand *',
      email: 'Email Bisnis *',
      whatsapp: 'Nomor WhatsApp Aktif *',
      serviceType: 'Layanan Utama *',
      budgetRange: 'Estimasi Anggaran *',
      city: 'Kota Target *',
      brief: 'Ringkasan Kebutuhan Kampanye *',
      briefPlaceholder:
        'Jelaskan target audiens, jadwal peluncuran, atau kebutuhan CMS/Partner Hosting Anda...',
      privacyNote: 'Data terenkripsi dan hanya diakses oleh konsultan kotobatuah.com.',
      submitBtn: 'Ajukan Proposal Sekarang',
      submittingBtn: 'Mengirim Data...',
    },
    footer: {
      description:
        'Agensi periklanan terpadu, produksi visual komersial, optimisasi SEO + GEO lokal, serta infrastruktur Partner Hosting & CMS responsif untuk pertumbuhan leads bisnis di Indonesia.',
      ecosystem: 'Ekosistem Resmi:',
      navTitle: 'Navigasi',
      studioTitle: 'Studio & Pengelolaan',
      askAi: 'Tanya Konsultan AI',
      manageCms: 'Kelola Konten (CMS)',
      rights: 'Hak cipta dilindungi.',
      cities: 'Tangerang Raya · Jakarta · Bandung · Padang · Surabaya · Medan',
      legalTitle: 'Prosedur & Kebijakan',
      disclaimers: 'Disclaimers',
      tos: 'ToS',
      privacyPolicy: 'Privacy Policy',
      cookies: 'Cookies',
      cookiePreferences: 'Preferensi Cookies',
    },
    chat: {
      launcher: 'Tanya KotoAI',
      title: 'KotoAI · Layanan Klien',
      subtitle: 'Konsultasi & Asisten Informasi kotobatuah.com',
      welcome:
        'Halo, saya KotoAI dari kotobatuah.com (basis utama Tangerang Raya · Jaringan Akomoda Network). Silakan tanya seputar billboard OOH, iklan digital, SEO + GEO lokal, Partner Hosting, atau ketik kata kunci topik Anda.',
      typing: 'KotoAI sedang menyiapkan jawaban...',
      placeholder: 'Ketik pertanyaan atau kata kunci (misal: billboard, seo, hosting, kontak)...',
      handoff: 'Lanjut ke Form Konsultasi',
      fallbackCaption: 'Mode panduan cepat otomatis · Info lengkap via WhatsApp/Form Konsultasi',
      quickPrompts: [
        'Estimasi biaya billboard di Tangerang Raya & Jakarta',
        'Keunggulan Partner Hosting & CMS responsif',
        'Info kantor Jaringan Akomoda Network & Jimkoto',
      ],
    },
    blog: {
      kicker: 'Jurnal & Wawasan Strategi',
      heading: 'Artikel riset periklanan, SEO + GEO lokal, dan arsitektur konversi.',
      subtitle:
        'Artikel dapat dikelola langsung dari Google Sheets CMS kami dan disinkronkan secara real-time ke kotobatuah.com.',
      showAll: 'Semua Artikel',
      emptyTitle: 'Belum ada artikel pada kategori ini.',
      emptyBody: 'Pilih kategori lain atau tampilkan seluruh artikel terbaru.',
      readArticle: 'Baca Artikel',
      minRead: 'mnt baca',
      sourceSheets: 'Google Sheets CMS',
      sourceCms: 'Editorial Studio',
      backToBlog: 'Kembali ke Blog',
      consultTopic: 'Konsultasikan Topik Ini',
      tagsLabel: 'Topik Terkait',
      adLabel: 'Ruang Iklan & Mitra Media',
      adPlaceholderTitle: 'Slot Iklan Google AdSense & Sponsor Editorial Siap Tayang',
      adPlaceholderBody:
        'Aktifkan kode Publisher ID AdSense Anda melalui CMS atau Google Sheets tab Site_Config untuk monetisasi otomatis pada halaman artikel ini.',
      adConsultCta: 'Pasang Iklan Mitra',
    },
    procedure: {
      kicker: 'Tata Kelola & Dokumen Prosedur Resmi',
      backHome: 'Kembali ke Beranda',
      updatedLabel: 'Pembaruan Terakhir',
      sourceSheets: 'Disinkronkan dari Google Sheets',
      sourceCms: 'Dokumen Resmi kotobatuah.com',
      officeHeading: 'Informasi Operasional & Perwakilan Manajemen',
      navTitle: 'Dokumen Prosedur',
      openCookiesPrefs: 'Atur Preferensi Cookies',
    },
    cookieBanner: {
      title: 'Privasi & Preferensi Cookies',
      description:
        'kotobatuah.com memakai cookies esensial untuk kecepatan situs serta analitik & dukungan penayangan iklan relevan di artikel Blog.',
      acceptAll: 'Terima Semua',
      essentialOnly: 'Hanya Esensial',
      learnMore: 'Detail (/procedure/cookies)',
    },
  },
  en: {
    nav: {
      masalahSolusi: 'Challenges & Solution',
      paket: '2027 Packages',
      pendekatan: 'Approach',
      faq: 'FAQ',
      blog: 'Blog',
      konsultasi: 'Project Brief',
      portofolio: 'Portfolio',
      layanan: 'Services',
      hosting: 'Partner Hosting',
      testimoni: 'Approach',
      seoGeo: 'SEO & GEO',
      cta: 'Chat on WhatsApp',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      badge: 'READY FOR 2027 DIGITAL ACCELERATION • KOTO BATUAH',
      h1: 'Build & Optimize Your Business Digital Assets Before 2027 — Fast, Lightweight, and Ready to Convert.',
      subtitle:
        'Practical business website creation, SEO & GEO optimization, and digital asset management tailored for SMEs, professionals, property teams, and communities. Focused execution without unnecessary delays.',
      primaryCta: 'Chat WhatsApp Now',
      primaryWaMessage:
        'Hello Koto Batuah, I would like to consult on preparing digital assets for 2027. Could you share the workflow and nearest available slots?',
      secondaryCta: 'View 2027-Ready Packages',
      studioLabel: 'Project-Based Studio · Akomoda Network',
      studioCaption:
        'Rapid business website launches, SEO + GEO structuring, and conversion-focused digital asset execution for 2027.',
      highlights: [
        {
          code: '01',
          title: 'Fast access & lightweight architecture',
          caption: 'Clean codebase built for rapid loading across mobile and desktop.',
        },
        {
          code: '02',
          title: 'Structured for web & AI search (SEO + GEO)',
          caption: 'Clear headings, FAQ schema, and metadata ready for search engines and AI answers.',
        },
        {
          code: '03',
          title: 'Direct & transparent guidance',
          caption: 'Streamlined WhatsApp coordination with clear delivery milestones.',
        },
      ],
    },
    problems: {
      kicker: 'Challenges & Fast Solution',
      heading: 'Why Many Businesses Fall Behind at the Turn of the Year?',
      items: [
        {
          num: '01',
          text: 'You have a website, but it loads slowly, looks dated, or fails to guide visitors to contact you.',
        },
        {
          num: '02',
          text: 'Promotions stay scattered across channels without a clear primary page that persuades prospects or buyers.',
        },
        {
          num: '03',
          text: 'Content preparation and digital channel updates keep getting delayed by daily operational demands.',
        },
      ],
      transition:
        'Koto Batuah helps streamline your digital foundation quickly—focusing directly on what drives credibility and real transaction opportunities.',
      transitionCta: 'View 2027-Ready Packages',
    },
    packages2027: {
      kicker: 'Three Core Conversion Packages',
      heading: 'Pick the fastest path to get your digital assets working before 2027.',
      subtitle:
        'Every package is structured for swift execution with direct WhatsApp coordination.',
      items: [
        {
          id: 'paket-website-kilat',
          code: 'Package 1',
          badge: 'Fast-Track Launch',
          featured: true,
          title: 'Express Business Website 2027',
          audience:
            'Built for SMEs, local services, property agents/teams, practitioners, and communities needing an official online presence fast before the new year.',
          features: [
            'Responsive company profile or landing page',
            'Clear value proposition, service/product blocks, strengths, FAQ, and direct contact buttons',
            'Prefilled WhatsApp integration & foundational SEO/GEO setup',
          ],
          estimateLabel: 'Timeline',
          estimate: 'Express delivery in 3–5 business days (once brief & materials are complete).',
          ctaLabel: 'Order Express Website',
          waMessage:
            'Hello Koto Batuah, I am interested in the Express Business Website 2027 package for my business/project. Please share package details, timeline, and deposit steps.',
        },
        {
          id: 'paket-audit-optimasi',
          code: 'Package 2',
          badge: 'SEO + GEO Ready',
          featured: false,
          title: 'Web Audit & SEO/GEO Optimization',
          audience:
            'Ideal for website owners seeking faster speed, cleaner structure, and stronger visibility across search engines and AI summaries.',
          features: [
            'Evaluation of page speed, layout structure, content readability, and CTA conversion paths',
            'Heading cleanup, answer/FAQ summaries, and metadata tuning for SEO & GEO clarity',
            'Prioritized action roadmap ready for immediate execution',
          ],
          estimateLabel: 'Timeline',
          estimate: '2–4 business days.',
          ctaLabel: 'Request Audit & Optimization',
          waMessage:
            'Hello Koto Batuah, I would like to request a Web Audit & SEO/GEO Optimization for my site. Could you share the initial steps?',
        },
        {
          id: 'paket-retainer-bulanan',
          code: 'Package 3',
          badge: 'Ongoing Care',
          featured: false,
          title: 'Monthly Care & Content Retainer',
          audience:
            'Designed for businesses or channel managers wanting regular updates, content publishing, and site upkeep handled without technical hassle.',
          features: [
            'Scheduled page/promo/information updates and routine link/page health checks',
            'Targeted article & content drafts aligned with business angles and audience questions',
            'Priority technical update response based on agreed retainer scope',
          ],
          estimateLabel: 'Schedule',
          estimate: 'Monthly retainer / annual agreement.',
          ctaLabel: 'Discuss Retainer Plan',
          waMessage:
            'Hello Koto Batuah, I would like to discuss the Monthly Care & Content Retainer for ongoing website and content needs.',
        },
      ],
    },
    approach: {
      kicker: 'Proof & Working Approach (E-E-A-T)',
      heading: 'Practical Approach Built on Real Execution',
      pillars: [
        {
          num: '01 · EXECUTION FOCUS',
          title: 'Focused on Outcomes & Speed',
          body: 'Prioritizing pages with a clear goal, fast mobile loading, and frictionless usability for prospective customers.',
          meta: 'Clean & Lightweight Web Architecture',
        },
        {
          num: '02 · CROSS-SECTOR EXPERIENCE',
          title: 'Cross-Sector Field Experience',
          body: 'Hands-on experience supporting local SMEs, property teams, communities, and ongoing web & content ecosystems.',
          meta: 'SMEs · Property · Practitioners · Communities',
        },
        {
          num: '03 · CONNECTED ECOSYSTEM',
          title: 'Structured Ecosystem',
          body: 'Connected to Koto Batuah supporting channels (kotobatuah.web.id for notes & publications, koto.biz.id for partnerships/affiliates) as your long-term needs grow.',
          meta: 'kotobatuah.com · kotobatuah.web.id · koto.biz.id',
        },
      ],
      verifiedReviewsHeading: 'Verified Partner Reviews',
    },
    faqClosing: {
      kicker: 'Quick FAQ',
      heading: 'Common Questions Before Starting Your 2027 Project',
      items: [
        {
          q: 'How long does execution take?',
          a: 'For express websites or focused optimization packages, turnaround is typically a few business days once requirements and initial materials are confirmed.',
        },
        {
          q: 'How do onboarding and payments work?',
          a: 'We start with a quick WhatsApp consultation, align on scope and schedule, confirm an initial deposit to begin work, and settle the balance upon handover as agreed.',
        },
        {
          q: 'Can I update information after launch?',
          a: 'Yes. The page structure is kept clean and easy to maintain, and you can also choose a monthly retainer if you prefer ongoing updates handled for you.',
        },
      ],
      closingKicker: 'Next Step',
      closingHeading: 'Ready to launch your digital momentum for 2027?',
      closingBody:
        'Year-end production slots are limited so every project receives dedicated quality control.',
      closingCta: 'Consult & Reserve Slot via WhatsApp',
      closingSecondaryCta: 'Send Written Project Brief',
      closingWaMessage:
        'Hello Koto Batuah, I would like to consult on my 2027 digital assets and reserve the nearest available slot.',
    },
    portfolio: {
      kicker: 'Capabilities & Project Showcase',
      heading: 'Campaign blueprints structured for brand recall and measurable conversion.',
      emptyTitle: 'No published showcase in this category yet.',
      emptyBody: 'Select another filter or view all capability blueprints from kotobatuah.com.',
      showAll: 'Show All',
      caseStudyBtn: 'View Blueprint',
      measuredResult: 'Key Deliverable:',
      clientChallenge: 'Business Need',
      ourSolution: 'kotobatuah.com Approach & Execution',
      backBtn: 'Back to Showcase',
      consultSimilar: 'Discuss Similar Project',
    },
    services: {
      kicker: 'Core Capabilities',
      heading: 'From creative direction to the web infrastructure capturing every surge in leads.',
      outputPrefix: 'Key deliverable:',
      discuss: 'Discuss',
      list: [
        {
          num: '01.',
          title: 'Strategic OOH & LED Billboard Media',
          serviceType: 'OOH & Billboard' as const,
          description:
            'High-traffic LED videotron and corporate billboard placements across Greater Tangerang, Greater Jakarta, and major Indonesian hubs with real-time QR attribution.',
          deliverable:
            'Location traffic audits, media permits, high-contrast creative, and impression reporting.',
        },
        {
          num: '02.',
          title: 'Digital Campaigns & Lead Acquisition',
          serviceType: 'Kampanye Digital' as const,
          description:
            'Google Search, Meta, and TikTok performance campaigns routed directly to sub-second landing pages so ad spend converts into qualified sales inquiries.',
          deliverable:
            'Local buyer-intent research, daily CPL optimization, and transparent conversion tracking.',
        },
        {
          num: '03.',
          title: 'Brand Identity & Commercial Video',
          serviceType: 'Branding & Identitas' as const,
          description:
            'Tactile brand identity systems, commercial packaging, and 4K cinema-grade advertising films built to command trust across print and digital touchpoints.',
          deliverable:
            'Comprehensive brand guidelines, retail/digital collateral, and 4K master commercials.',
        },
        {
          num: '04.',
          title: 'Responsive CMS & Managed Partner Hosting',
          serviceType: 'Partner Hosting & CMS' as const,
          description:
            'A responsive content management system allowing instant portfolio, case study, and landing page publishing on low-latency Partner Hosting servers.',
          deliverable:
            'Real-time content editor, Core Web Vitals tuning, and up to 99.99% uptime SLA.',
        },
      ],
    },
    hosting: {
      kicker: 'Partner Hosting & Responsive CMS',
      heading: 'High-velocity edge servers so paid clicks never stall on slow pages.',
      subtitle:
        'Every paid ad click and billboard QR scan lands on a responsive CMS powered by our Partner Hosting edge network with sub-1.2 second load times.',
      serverRegion: 'Server Region:',
      chooseBtn: 'Select Hosting Tier',
    },
    testimonials: {
      kicker: 'Verified Client Reviews',
      heading: 'Endorsements published strictly with written client permission.',
      projectModelKicker: 'Project-Based Operations & Governance',
      projectModelHeading:
        'An agile project-based studio without bloated physical-office overhead—focused directly on campaign delivery.',
      projectPillars: [
        {
          tag: '01 · PROJECT-BASED AGILITY',
          title: 'Built Around Your Project Scope',
          body: 'We assemble dedicated media, SEO + GEO, and engineering specialists per engagement from our Greater Tangerang base within the Akomoda Network. Budgets go straight into deliverables and media performance.',
          meta: 'Remote Coordination & By-Appointment Meetings',
        },
        {
          tag: '02 · FULL ASSET OWNERSHIP',
          title: 'Clients Keep 100% Control of Assets',
          body: 'Your domains, ad accounts, encrypted lead records, and Google Sheets CMS remain strictly yours. Every milestone includes written deliverables and transparent reporting.',
          meta: 'Written Project Proposals & Clear Milestones',
        },
        {
          tag: '03 · VERIFIED ENDORSEMENTS ONLY',
          title: 'Zero Fabricated Testimonials',
          body: 'This section publishes only genuine client testimonials approved in writing. Studio governance is overseen by James Isa a.k.a. Jimkoto.my.id as Management Representative.',
          meta: 'Management Representative · Akomoda Network',
        },
      ],
    },
    seoGeo: {
      kicker: 'Local SEO + GEO Optimization',
      heading: 'Own local search intent across your priority Indonesian markets.',
      subtitle:
        'We synchronize Schema.org structured data, dynamic city pages in your CMS, and strategic OOH placements so your brand ranks first when local buyers search.',
      hubPrefix: 'Network Hub',
      visibilityLabel: 'Projected Visibility',
      keywordsTitle: 'Local SEO Keyword Clusters',
      channelsTitle: 'Recommended Integrated Channels',
      latencyLabel: 'Edge CDN Latency',
      inventoryLabel: 'Media Inventory',
      auditBtn: 'Request Local SEO Audit',
    },
    lead: {
      kicker: 'Start a Campaign Consultation',
      heading: 'Receive a tailored media plan, ROI projection, and hosting setup within 24 hours.',
      subtitle:
        'Share your target market and priority cities. Our senior media strategists will prepare an OOH placement map, lead projection, and CMS blueprint.',
      primaryOffice: 'Operational Base (Project-Based)',
      secondaryOffice: 'Service Coverage & Meetings',
      directContact: 'Direct Contact',
      successTitle: 'Consultation Request Saved',
      successBody1: 'Thank you,',
      successBody2: 'Your inquiry for',
      successBody3: 'has been recorded in the kotobatuah.com CRM.',
      refLabel: 'Reference Code:',
      sendAnother: 'Submit Another Request',
      fullName: 'Full Name *',
      company: 'Company / Brand *',
      email: 'Business Email *',
      whatsapp: 'Active WhatsApp Number *',
      serviceType: 'Primary Service *',
      budgetRange: 'Estimated Budget *',
      city: 'Target City *',
      brief: 'Campaign Brief *',
      briefPlaceholder:
        'Describe your target audience, launch timeline, or CMS/Partner Hosting requirements...',
      privacyNote: 'Encrypted and accessible solely to kotobatuah.com strategists.',
      submitBtn: 'Request Proposal Now',
      submittingBtn: 'Submitting...',
    },
    footer: {
      description:
        'Integrated advertising agency, commercial visual production, local SEO + GEO optimization, and managed Partner Hosting & CMS infrastructure driving measurable leads.',
      ecosystem: 'Official Ecosystem:',
      navTitle: 'Navigation',
      studioTitle: 'Studios & Management',
      askAi: 'Ask AI Consultant',
      manageCms: 'Manage Content (CMS)',
      rights: 'All rights reserved.',
      cities: 'Greater Tangerang · Jakarta · Bandung · Padang · Surabaya · Medan',
      legalTitle: 'Procedures & Governance',
      disclaimers: 'Disclaimers',
      tos: 'ToS',
      privacyPolicy: 'Privacy Policy',
      cookies: 'Cookies',
      cookiePreferences: 'Cookie Preferences',
    },
    chat: {
      launcher: 'Ask KotoAI',
      title: 'KotoAI · Client Desk',
      subtitle: 'Information & Consultation · kotobatuah.com',
      welcome:
        'Hello, I am KotoAI from kotobatuah.com (Greater Tangerang · Akomoda Network). Ask me about OOH billboards, digital lead campaigns, local SEO + GEO, Partner Hosting, or type any keyword.',
      typing: 'KotoAI is preparing an answer...',
      placeholder: 'Type a question or keyword (e.g. billboard, seo, hosting, office)...',
      handoff: 'Continue to Consultation Form',
      fallbackCaption: 'Instant knowledge assistant · Reach our team via WhatsApp or Consultation Form',
      quickPrompts: [
        'Billboard pricing in Tangerang Raya & Jakarta',
        'Partner Hosting & responsive CMS benefits',
        'Akomoda Network office & Jimkoto representative',
      ],
    },
    blog: {
      kicker: 'Editorial Journal & Insights',
      heading: 'Playbooks on OOH advertising, local SEO + GEO, and conversion hosting.',
      subtitle:
        'Editorial articles can be authored in our connected Google Sheets CMS and synced live to kotobatuah.com.',
      showAll: 'All Articles',
      emptyTitle: 'No published articles in this category yet.',
      emptyBody: 'Select another topic filter or view all editorial posts.',
      readArticle: 'Read Article',
      minRead: 'min read',
      sourceSheets: 'Google Sheets CMS',
      sourceCms: 'Studio Editorial',
      backToBlog: 'Back to Blog',
      consultTopic: 'Discuss This Topic',
      tagsLabel: 'Related Topics',
      adLabel: 'AdSense & Media Partner Slot',
      adPlaceholderTitle: 'Google AdSense & Editorial Sponsorship Placement Ready',
      adPlaceholderBody:
        'Configure your Google AdSense Publisher & Slot IDs in CMS Settings or Google Sheets Site_Config to monetize editorial traffic automatically.',
      adConsultCta: 'Sponsor Placement',
    },
    procedure: {
      kicker: 'Official Governance & Site Procedures',
      backHome: 'Back to Home',
      updatedLabel: 'Last Updated',
      sourceSheets: 'Synced from Google Sheets',
      sourceCms: 'kotobatuah.com Official Document',
      officeHeading: 'Operations & Management Representative Disclosure',
      navTitle: 'Procedure Documents',
      openCookiesPrefs: 'Manage Cookie Preferences',
    },
    cookieBanner: {
      title: 'Privacy & Cookie Preferences',
      description:
        'kotobatuah.com uses essential storage for fast loading plus optional analytics and advertising cookies on editorial Blog pages.',
      acceptAll: 'Accept All',
      essentialOnly: 'Essential Only',
      learnMore: 'Details (/procedure/cookies)',
    },
  },
} as const;
