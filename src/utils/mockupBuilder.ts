import type { Locale } from '../types/domain';
import { buildWhatsAppUrl } from './whatsapp';

export type MockupTemplateId = 'umkm' | 'properti' | 'jasa' | 'komunitas';
export type ConsultationModeId = 'none' | 'online' | 'onsite';
export type Package2027Id =
  | 'paket-website-kilat'
  | 'paket-audit-optimasi'
  | 'paket-retainer-bulanan';

export interface MockupFormInput {
  templateId: MockupTemplateId;
  businessName: string;
  tagline: string;
  city: string;
  businessWhatsapp: string;
  highlightsText: string;
}

export interface MockupTemplateMeta {
  id: MockupTemplateId;
  labelId: string;
  labelEn: string;
  accentHex: string;
  surfaceBgClass: string;
  badgeClass: string;
  buttonClass: string;
  heroButtonClass: string;
  defaultBusiness: string;
  defaultTaglineId: string;
  defaultTaglineEn: string;
  defaultHighlightsId: string;
  defaultHighlightsEn: string;
}

export const MOCKUP_TEMPLATES: MockupTemplateMeta[] = [
  {
    id: 'umkm',
    labelId: 'UMKM & Kuliner',
    labelEn: 'SME & F&B Retail',
    accentHex: '#B45309',
    surfaceBgClass: 'bg-amber-950 text-amber-50',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    heroButtonClass: 'bg-amber-500 hover:bg-amber-400 text-amber-950',
    defaultBusiness: 'Zafran Coffee Roastery',
    defaultTaglineId:
      'Suplai biji kopi sangrai segar, green beans pilihan, dan jasa roasting profesional langsung dari Pamulang.',
    defaultTaglineEn:
      'Fresh roasted coffee beans, curated green beans, and precision custom roasting straight from Pamulang.',
    defaultHighlightsId: 'Green Beans Pilihan, Roasted Beans Harian, Jasa Giling & Roasting',
    defaultHighlightsEn: 'Curated Green Beans, Fresh Daily Roast, Custom Grinding & Roasting',
  },
  {
    id: 'properti',
    labelId: 'Properti & Hunian',
    labelEn: 'Property & Real Estate',
    accentHex: '#0F172A',
    surfaceBgClass: 'bg-slate-900 text-slate-50',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    heroButtonClass: 'bg-white hover:bg-stone-100 text-slate-900',
    defaultBusiness: 'Harmoni Residence Serpong',
    defaultTaglineId:
      'Hunian modern siap huni dekat akses tol & stasiun dengan skema KPR fleksibel dan survei lokasi harian.',
    defaultTaglineEn:
      'Move-in ready modern residences near toll & commuter access with flexible financing and daily site tours.',
    defaultHighlightsId: 'Lokasi Strategis 10 Menit Tol, Legalitas SHM Siap KPR, Jadwal Survei Harian',
    defaultHighlightsEn: '10 Mins to Toll Gate, Verified Freehold Title, Daily Viewing Schedule',
  },
  {
    id: 'jasa',
    labelId: 'Jasa & Praktisi',
    labelEn: 'Services & Practitioners',
    accentHex: '#1D4ED8',
    surfaceBgClass: 'bg-[#0D1117] text-white',
    badgeClass: 'bg-blue-50 text-[#1D4ED8] border-blue-200',
    buttonClass: 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white',
    heroButtonClass: 'bg-[#2563EB] hover:bg-[#3B82F6] text-white',
    defaultBusiness: 'Klinik & Konsultan Mandiri',
    defaultTaglineId:
      'Layanan konsultasi terpercaya dengan reservasi online cepat, jadwal transparan, dan pendampingan terstruktur.',
    defaultTaglineEn:
      'Trusted advisory & specialist practice with fast online booking, transparent schedules, and clear outcomes.',
    defaultHighlightsId: 'Reservasi Jadwal Cepat, Konsultasi Online & Tatap Muka, Laporan Hasil Jelas',
    defaultHighlightsEn: 'Fast Slot Booking, Online & In-Person Sessions, Clear Action Reports',
  },
  {
    id: 'komunitas',
    labelId: 'Komunitas & Lembaga',
    labelEn: 'Community & Organization',
    accentHex: '#047857',
    surfaceBgClass: 'bg-emerald-950 text-emerald-50',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    heroButtonClass: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950',
    defaultBusiness: 'Forum Wirausaha Tangerang',
    defaultTaglineId:
      'Wadah kolaborasi, agenda pelatihan rutin, direktori anggota, dan pendaftaran program komunitas terbuka.',
    defaultTaglineEn:
      'Collaborative hub featuring routine workshops, member directories, and seamless program registration.',
    defaultHighlightsId: 'Agenda & Pendaftaran Event, Direktori Profil Anggota, Publikasi Program Resmi',
    defaultHighlightsEn: 'Event Registration Hub, Member Directory, Official Program Updates',
  },
];

export interface PackagePricingSpec {
  id: Package2027Id;
  minIdr: number;
  maxIdr: number;
  isMonthly?: boolean;
  includedOnlineSessions: number;
}

export const PACKAGE_PRICING_SPECS: Record<Package2027Id, PackagePricingSpec> = {
  'paket-website-kilat': {
    id: 'paket-website-kilat',
    minIdr: 1_500_000,
    maxIdr: 2_900_000,
    includedOnlineSessions: 1,
  },
  'paket-audit-optimasi': {
    id: 'paket-audit-optimasi',
    minIdr: 1_800_000,
    maxIdr: 3_500_000,
    includedOnlineSessions: 1,
  },
  'paket-retainer-bulanan': {
    id: 'paket-retainer-bulanan',
    minIdr: 1_250_000,
    maxIdr: 3_500_000,
    isMonthly: true,
    includedOnlineSessions: 1,
  },
};

export const CONSULTATION_ADDONS: Record<
  ConsultationModeId,
  { minAddIdr: number; maxAddIdr: number }
> = {
  none: { minAddIdr: 0, maxAddIdr: 0 },
  online: { minAddIdr: 250_000, maxAddIdr: 250_000 },
  onsite: { minAddIdr: 500_000, maxAddIdr: 1_000_000 },
};

export function formatIdrCompact(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function calculateEstimatedTotalRange(
  packageId: Package2027Id,
  consultationMode: ConsultationModeId
): {
  minTotal: number;
  maxTotal: number;
  addonMin: number;
  addonMax: number;
  isMonthly: boolean;
} {
  const pkg = PACKAGE_PRICING_SPECS[packageId];
  const addon = CONSULTATION_ADDONS[consultationMode];
  return {
    minTotal: pkg.minIdr + addon.minAddIdr,
    maxTotal: pkg.maxIdr + addon.maxAddIdr,
    addonMin: addon.minAddIdr,
    addonMax: addon.maxAddIdr,
    isMonthly: Boolean(pkg.isMonthly),
  };
}

export function parseMockupHighlights(highlightsText: string, fallback: string[]): string[] {
  const parsed = highlightsText
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);
  return parsed.length > 0 ? parsed : fallback;
}

export function buildMockupPreviewSlug(businessName: string): string {
  const slug = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'bisnis-anda';
}

export function buildMockupOrderWhatsAppUrl(
  contactPhone: string,
  input: MockupFormInput,
  lang: Locale,
  consultationMode: ConsultationModeId = 'none'
): string {
  const tpl = MOCKUP_TEMPLATES.find((t) => t.id === input.templateId) ?? MOCKUP_TEMPLATES[0];
  const business = input.businessName.trim() || tpl.defaultBusiness;
  const city = input.city.trim() || 'Tangerang Raya';
  const highlights = parseMockupHighlights(
    input.highlightsText,
    (lang === 'en' ? tpl.defaultHighlightsEn : tpl.defaultHighlightsId).split(', ')
  );
  const templateName = lang === 'en' ? tpl.labelEn : tpl.labelId;
  const consultLabel =
    consultationMode === 'onsite'
      ? lang === 'en'
        ? 'On-site meeting (+IDR 500k–1M)'
        : 'Tatap muka / On-site (+Rp 500rb–1jt)'
      : consultationMode === 'online'
        ? lang === 'en'
          ? 'Extra online session (+IDR 250k)'
          : 'Konsultasi online tambahan (+Rp 250rb)'
        : lang === 'en'
          ? 'Standard WhatsApp & 1x brief session (included)'
          : 'Koordinasi WA + 1x brief awal (sudah termasuk)';

  if (lang === 'en') {
    const msg = `Hello Koto Batuah, I just generated a Website Mockup for Package 1 (Express Website 2027):
- Template: ${templateName}
- Business Name: ${business}
- City/Area: ${city}
- Key Offers: ${highlights.join(' | ')}
- Consultation Mode: ${consultLabel}
Please share the exact cost & nearest production slot.`;
    return buildWhatsAppUrl(contactPhone, msg);
  }

  const msg = `Halo Koto Batuah, saya baru membuat Mockup Website untuk Paket 1 (Website Bisnis Kilat 2027):
- Template: ${templateName}
- Nama Usaha: ${business}
- Kota/Area: ${city}
- Poin Utama: ${highlights.join(' | ')}
- Opsi Konsultasi: ${consultLabel}
Mohon info total biaya final, alur DP, dan slot pengerjaan terdekatnya.`;
  return buildWhatsAppUrl(contactPhone, msg);
}
