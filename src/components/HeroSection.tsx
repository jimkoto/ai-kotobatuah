import { ArrowDown, CheckCircle2, MessageCircle } from 'lucide-react';
import heroStudioImage from '../assets/images/hero_advertising_studio_1795655950660.jpg';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { MediaImage } from './MediaImage';

interface HeroSectionProps {
  lang: Locale;
  onChangeLang: (lang: Locale) => void;
  siteSettings: SiteSettings;
  onExplorePackages: () => void;
}

export function HeroSection({
  lang,
  onChangeLang,
  siteSettings,
  onExplorePackages,
}: HeroSectionProps) {
  const t = COPY[lang].hero;
  const waHref = buildWhatsAppUrl(siteSettings.contactPhone, t.primaryWaMessage);

  return (
    <section id="beranda" className="border-b border-stone-200 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Proposition Column */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white border border-stone-300 rounded-md max-w-full">
                  <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0" aria-hidden="true" />
                  <span className="font-mono-tabular text-[10.5px] sm:text-xs font-semibold tracking-[0.02em] sm:tracking-[0.08em] text-[#0D1117] whitespace-nowrap">
                    {t.badge}
                  </span>
                </div>

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

              <h1 className="font-display text-[clamp(2rem,3.6vw,3.35rem)] font-bold tracking-tight text-[#0D1117] leading-[1.1] [text-wrap:balance] mb-5">
                {t.h1}
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mb-7">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.primaryCta}</span>
              </a>

              <button
                type="button"
                onClick={onExplorePackages}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-stone-300 bg-white hover:bg-stone-100 text-[#0D1117] text-sm sm:text-base font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <span>{t.secondaryCta}</span>
                <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Architectural Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-xl overflow-hidden border border-stone-200 bg-stone-900">
              <MediaImage
                src={heroStudioImage}
                alt={
                  lang === 'en'
                    ? 'kotobatuah.com digital studio & strategy workspace'
                    : 'Studio digital dan ruang eksekusi strategi kotobatuah.com'
                }
                fallbackTitle="Studio Eksekusi Digital kotobatuah.com"
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
                <p className="text-xs font-medium text-stone-300 mb-1">{t.studioLabel}</p>
                <p className="text-sm sm:text-base font-medium text-white leading-snug">
                  {t.studioCaption}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Advantage Strip */}
        <div className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {t.highlights.map((item) => (
            <div key={item.code} className="flex items-start gap-3">
              <CheckCircle2
                className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#0D1117] leading-snug">
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
