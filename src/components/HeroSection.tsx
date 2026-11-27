import { ArrowRight } from 'lucide-react';
import heroStudioImage from '../assets/images/hero_advertising_studio_1795655950660.jpg';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';
import { MediaImage } from './MediaImage';

interface HeroSectionProps {
  lang: Locale;
  onChangeLang: (lang: Locale) => void;
  siteSettings: SiteSettings;
  onStartConsultation: () => void;
  onExplorePortfolio: () => void;
}

export function HeroSection({
  lang,
  onChangeLang,
  siteSettings,
  onStartConsultation,
  onExplorePortfolio,
}: HeroSectionProps) {
  const t = COPY[lang].hero;
  const tagline = lang === 'en' ? siteSettings.taglineEn : siteSettings.taglineId;

  return (
    <section id="beranda" className="border-b border-stone-200 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Proposition Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="text-sm font-medium text-stone-600">{tagline}</p>

                <div
                  role="group"
                  aria-label={lang === 'en' ? 'Language switcher' : 'Pilih bahasa'}
                  className="inline-flex items-center p-0.5 bg-white border border-stone-300 rounded-lg shrink-0"
                >
                  <button
                    type="button"
                    aria-pressed={lang === 'id'}
                    onClick={() => onChangeLang('id')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      lang === 'id'
                        ? 'bg-[#0D1117] text-white'
                        : 'text-stone-600 hover:text-[#0D1117]'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    aria-pressed={lang === 'en'}
                    onClick={() => onChangeLang('en')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      lang === 'en'
                        ? 'bg-[#0D1117] text-white'
                        : 'text-stone-600 hover:text-[#0D1117]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold tracking-tight text-[#0D1117] leading-[1.08] [text-wrap:balance] mb-6">
                {t.h1}
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl mb-8">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartConsultation}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExplorePortfolio}
                className="inline-flex items-center px-5 py-3.5 border border-stone-300 bg-white hover:bg-stone-100 text-[#0D1117] text-sm sm:text-base font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                {t.secondaryCta}
              </button>
            </div>
          </div>

          {/* Right Architectural Visual Anchor */}
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] rounded-xl overflow-hidden border border-stone-200 bg-stone-900">
              <MediaImage
                src={heroStudioImage}
                alt={
                  lang === 'en'
                    ? 'kotobatuah.com creative advertising & media strategy studio'
                    : 'Studio kreatif dan ruang strategi kampanye kotobatuah.com'
                }
                fallbackTitle="Studio Strategi & Produksi kotobatuah.com"
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <p className="text-xs font-medium text-stone-300 mb-1">
                  {t.studioLabel}
                </p>
                <p className="text-sm sm:text-base font-medium text-white">
                  {t.studioCaption}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Quantitative Proof Strip */}
        <div className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#0D1117] tracking-tight">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-snug">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
