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
      portofolio: 'Portofolio',
      layanan: 'Layanan',
      hosting: 'Partner Hosting',
      blog: 'Blog',
      testimoni: 'Model Kerja',
      seoGeo: 'SEO & GEO',
      cta: 'Mulai Konsultasi',
      openMenu: 'Buka menu navigasi',
      closeMenu: 'Tutup menu navigasi',
    },
    hero: {
      h1: 'Kampanye periklanan yang mengubah perhatian lokal menjadi leads terukur.',
      subtitle:
        'kotobatuah.com memadukan kekuatan media luar ruang (OOH), iklan digital, produksi visual berkarakter, optimisasi SEO + GEO lokal, serta CMS responsif di atas infrastruktur partner hosting berkecepatan tinggi.',
      primaryCta: 'Mulai Konsultasi Gratis',
      secondaryCta: 'Lihat Kapabilitas Proyek',
      studioLabel: 'Studio Berbasis Proyek · Jaringan Akomoda Network',
      studioCaption:
        'Kolaborasi media OOH, akuisisi leads digital, dan hosting kampanye berbasis target proyek.',
      metrics: [
        { value: 'Project-Based', label: 'Tim spesialis terdedikasi per kampanye' },
        { value: '99.99%', label: 'Target uptime infrastruktur partner hosting' },
        { value: 'SEO + GEO', label: 'Optimisasi visibilitas Tangerang Raya & ID' },
        { value: '< 1.2s', label: 'Target muat halaman CMS Edge CDN' },
      ],
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
      portofolio: 'Portfolio',
      layanan: 'Services',
      hosting: 'Partner Hosting',
      blog: 'Blog',
      testimoni: 'Work Model',
      seoGeo: 'SEO & GEO',
      cta: 'Start Consultation',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      h1: 'Advertising campaigns engineered to turn local attention into measurable leads.',
      subtitle:
        'kotobatuah.com unifies outdoor OOH media, performance digital ads, commercial visual production, local SEO + GEO optimization, and a responsive CMS running on high-speed partner hosting.',
      primaryCta: 'Book Free Consultation',
      secondaryCta: 'Explore Capabilities',
      studioLabel: 'Project-Based Studio · Akomoda Network',
      studioCaption:
        'Flexible OOH media planning, digital lead acquisition, and campaign hosting built per project.',
      metrics: [
        { value: 'Project-Based', label: 'Dedicated specialist squad per campaign' },
        { value: '99.99%', label: 'Partner hosting uptime target' },
        { value: 'SEO + GEO', label: 'Greater Tangerang & Indonesia coverage' },
        { value: '< 1.2s', label: 'Edge CDN CMS load speed target' },
      ],
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
