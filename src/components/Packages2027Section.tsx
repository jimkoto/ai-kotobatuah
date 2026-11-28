import { Check, Clock, MessageCircle } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface Packages2027SectionProps {
  lang: Locale;
  siteSettings: SiteSettings;
}

export function Packages2027Section({ lang, siteSettings }: Packages2027SectionProps) {
  const t = COPY[lang].packages2027;

  return (
    <section
      id="paket-2027"
      className="border-b border-stone-200 bg-[#F8F7F4] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1D4ED8] mb-2">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1117] tracking-tight leading-[1.15] [text-wrap:balance] mb-3">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {t.items.map((pkg) => {
            const waHref = buildWhatsAppUrl(siteSettings.contactPhone, pkg.waMessage);

            return (
              <article
                key={pkg.id}
                className={`flex flex-col justify-between rounded-xl p-6 sm:p-7 border transition-colors ${
                  pkg.featured
                    ? 'bg-white border-[#1D4ED8] shadow-sm'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-stone-500">
                      {pkg.code}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                        pkg.featured
                          ? 'bg-blue-50 text-[#1D4ED8] border-blue-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0D1117] leading-snug mb-3">
                    {pkg.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed mb-5 pb-5 border-b border-stone-200">
                    {pkg.audience}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-800">
                        <Check
                          className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-stone-200 space-y-4">
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 bg-[#F8F7F4] border border-stone-200 rounded-lg px-3.5 py-2.5">
                    <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-[#0D1117]">{pkg.estimateLabel}: </span>
                      <span>{pkg.estimate}</span>
                    </div>
                  </div>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                      pkg.featured
                        ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                        : 'bg-[#0D1117] hover:bg-stone-800 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{pkg.ctaLabel}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
