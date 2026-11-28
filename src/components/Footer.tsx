import { COPY } from '../i18n/translations';
import type { Locale, ProcedureSlug, SiteSettings } from '../types/domain';
import { KotoLogo } from './KotoLogo';

interface FooterProps {
  lang: Locale;
  onChangeLang: (lang: Locale) => void;
  siteSettings: SiteSettings;
  onNavigateSection: (sectionId: string) => void;
  onOpenProcedure: (slug: ProcedureSlug) => void;
  onOpenCookiePreferences: () => void;
  onOpenCms: () => void;
  onOpenChat: () => void;
}

export function Footer({
  lang,
  onChangeLang,
  siteSettings,
  onNavigateSection,
  onOpenProcedure,
  onOpenCookiePreferences,
  onOpenCms,
  onOpenChat,
}: FooterProps) {
  const f = COPY[lang].footer;
  const n = COPY[lang].nav;

  const disclaimerText =
    lang === 'en'
      ? siteSettings.managementDisclaimerEn ||
        'We operate within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id serving as our current Management Representative.'
      : siteSettings.managementDisclaimerId ||
        'Kami berkantor di Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini.';

  const procedureLinks: Array<{ slug: ProcedureSlug; label: string }> = [
    { slug: 'disclaimers', label: f.disclaimers },
    { slug: 'tos', label: f.tos },
    { slug: 'privacy-policy', label: f.privacyPolicy },
    { slug: 'cookies', label: f.cookies },
  ];

  return (
    <footer className="bg-[#0D1117] text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <KotoLogo className="w-9 h-9 shrink-0" />
              <p className="font-display text-xl font-bold text-white tracking-tight">
                kotobatuah.com
              </p>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm mb-3">
              {f.description}
            </p>
            <p className="text-xs text-stone-500">
              {f.ecosystem} kotobatuah.com · kotobatuah.web.id · koto.biz.id
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="font-semibold text-white mb-3">{f.navTitle}</p>
            {[
              { id: 'masalah-solusi', label: n.masalahSolusi },
              { id: 'paket-2027', label: n.paket },
              { id: 'pendekatan', label: n.pendekatan },
              { id: 'faq', label: n.faq },
              { id: 'blog', label: n.blog },
              { id: 'konsultasi', label: n.konsultasi },
            ].map((item) => (
              <div key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection(item.id);
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="font-semibold text-white mb-3">{f.studioTitle}</p>
            <p className="text-xs text-stone-300 leading-relaxed border-l-2 border-[#1D4ED8] pl-3 py-0.5">
              {disclaimerText}
            </p>
            <p className="text-stone-400 pt-1">
              {siteSettings.primaryHubName}: {siteSettings.primaryAddress}
            </p>
            <p className="text-stone-400">
              {lang === 'en' ? 'Coverage' : 'Cakupan'}: {siteSettings.secondaryAddress}
            </p>
            <p className="font-mono-tabular text-xs text-stone-400 pt-1">
              {siteSettings.contactEmail} · {siteSettings.contactPhone}
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenChat}
                className="px-3.5 py-2 border border-stone-700 hover:border-stone-500 text-stone-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                {f.askAi}
              </button>
              <button
                type="button"
                onClick={onOpenCms}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                {f.manageCms}
              </button>
              <div
                role="group"
                aria-label={lang === 'en' ? 'Footer language switcher' : 'Pilih bahasa footer'}
                className="inline-flex items-center p-0.5 bg-stone-900 border border-stone-700 rounded-lg"
              >
                <button
                  type="button"
                  aria-pressed={lang === 'id'}
                  onClick={() => onChangeLang('id')}
                  className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                    lang === 'id' ? 'bg-white text-[#0D1117]' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  aria-pressed={lang === 'en'}
                  onClick={() => onChangeLang('en')}
                  className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                    lang === 'en' ? 'bg-white text-[#0D1117]' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Legal Procedure Links (/procedure/*) & Cookie Preferences */}
        <div className="pt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-stone-500">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} kotobatuah.com. {f.rights}</p>
            <p>{f.cities}</p>
          </div>

          <nav
            aria-label={f.legalTitle}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-400"
          >
            {procedureLinks.map((item) => (
              <a
                key={item.slug}
                href={`/procedure/${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenProcedure(item.slug);
                }}
                className="hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                {item.label}
              </a>
            ))}
            <span aria-hidden="true" className="text-stone-700">·</span>
            <button
              type="button"
              onClick={onOpenCookiePreferences}
              className="text-stone-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              {f.cookiePreferences}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
