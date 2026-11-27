import { ArrowLeft, Building2, Cookie, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { COPY } from '../i18n/translations';
import {
  PROCEDURE_SLUGS,
  type Locale,
  type ProcedurePage,
  type ProcedureSlug,
  type SiteSettings,
} from '../types/domain';

interface ProcedurePageViewProps {
  lang: Locale;
  activeSlug: ProcedureSlug;
  pages: ProcedurePage[];
  siteSettings: SiteSettings;
  onSelectSlug: (slug: ProcedureSlug) => void;
  onBackHome: () => void;
  onOpenCookiePreferences: () => void;
}

const SLUG_LABELS: Record<ProcedureSlug, { id: string; en: string }> = {
  disclaimers: { id: 'Disclaimers', en: 'Disclaimers' },
  tos: { id: 'Terms of Service (ToS)', en: 'Terms of Service' },
  'privacy-policy': { id: 'Privacy Policy', en: 'Privacy Policy' },
  cookies: { id: 'Kebijakan Cookies', en: 'Cookie Policy' },
};

export function ProcedurePageView({
  lang,
  activeSlug,
  pages,
  siteSettings,
  onSelectSlug,
  onBackHome,
  onOpenCookiePreferences,
}: ProcedurePageViewProps) {
  const t = COPY[lang].procedure;
  const activePage = pages.find((p) => p.slug === activeSlug) ?? pages[0];

  const title = activePage
    ? lang === 'en'
      ? activePage.titleEn || activePage.titleId
      : activePage.titleId
    : SLUG_LABELS[activeSlug][lang];

  const summary = activePage
    ? lang === 'en'
      ? activePage.summaryEn || activePage.summaryId
      : activePage.summaryId
    : '';

  const content = activePage
    ? lang === 'en'
      ? activePage.contentEn || activePage.contentId
      : activePage.contentId
    : '';

  const disclaimerText =
    lang === 'en'
      ? siteSettings.managementDisclaimerEn ||
        'We operate within the Akomoda Network, with James Isa a.k.a. Jimkoto.my.id serving as our current Management Representative.'
      : siteSettings.managementDisclaimerId ||
        'Kami berkantor di Jaringan Akomoda Network, dan James Isa a.k.a Jimkoto.my.id adalah Management Representative saat ini.';

  return (
    <section
      aria-labelledby="procedure-page-title"
      className="py-12 lg:py-16 bg-[#F8F7F4] min-h-[70vh]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-xs sm:text-sm font-medium text-[#0D1117] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.backHome}</span>
          </button>

          <span className="font-mono-tabular text-xs text-stone-500">
            kotobatuah.com/procedure/{activeSlug}
          </span>
        </div>

        {/* Procedure Switcher Navigation */}
        <nav
          aria-label={t.navTitle}
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-stone-200 rounded-xl"
        >
          {PROCEDURE_SLUGS.map((slug) => {
            const isActive = slug === activeSlug;
            return (
              <a
                key={slug}
                href={`/procedure/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSlug(slug);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#0D1117] text-white'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-[#0D1117]'
                }`}
              >
                {SLUG_LABELS[slug][lang]}
              </a>
            );
          })}
        </nav>

        {/* Main Document Card */}
        <article className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 space-y-6">
          <header className="space-y-3 pb-6 border-b border-stone-200">
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                {t.kicker}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                {activePage?.source === 'google_sheets' ? t.sourceSheets : t.sourceCms}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {t.updatedLabel}: {activePage?.updatedAt ?? '2026-11-26'}
              </span>
            </div>

            <h1
              id="procedure-page-title"
              className="font-display text-2xl sm:text-4xl font-bold text-[#0D1117] tracking-tight [text-wrap:balance]"
            >
              {title}
            </h1>

            {summary && <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{summary}</p>}
          </header>

          <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
            {content
              .split(/\n{2,}/)
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph.trim()}</p>
              ))}
          </div>

          {activeSlug === 'cookies' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenCookiePreferences}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Cookie className="w-4 h-4" aria-hidden="true" />
                <span>{t.openCookiesPrefs}</span>
              </button>
            </div>
          )}

          {/* Management & Akomoda Network Callout */}
          <div className="p-5 bg-[#F8F7F4] border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <Building2 className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>{t.officeHeading}</span>
            </div>
            <p className="text-sm text-[#0D1117] leading-relaxed font-medium">
              {disclaimerText}
            </p>
            <p className="text-xs text-stone-600 font-mono-tabular">
              {siteSettings.primaryHubName}: {siteSettings.primaryAddress} ·{' '}
              {lang === 'en' ? 'Coverage' : 'Cakupan'}: {siteSettings.secondaryAddress} ·{' '}
              {siteSettings.contactEmail} · {siteSettings.contactPhone}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
