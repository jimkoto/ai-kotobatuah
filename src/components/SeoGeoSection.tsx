import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { GEO_REGIONS } from '../data/seedData';
import { COPY } from '../i18n/translations';
import type { LeadServiceType, Locale } from '../types/domain';

interface SeoGeoSectionProps {
  lang: Locale;
  onConsultGeo: (service: LeadServiceType, contextNote: string, city: string) => void;
}

export function SeoGeoSection({ lang, onConsultGeo }: SeoGeoSectionProps) {
  const [selectedRegionId, setSelectedRegionId] = useState(GEO_REGIONS[0].id);
  const activeRegion =
    GEO_REGIONS.find((r) => r.id === selectedRegionId) ?? GEO_REGIONS[0];
  const t = COPY[lang].seoGeo;

  const activeRegionLabel =
    lang === 'en' ? activeRegion.regionLabelEn : activeRegion.regionLabel;
  const activeInventory =
    lang === 'en' ? activeRegion.oohInventoryCountEn : activeRegion.oohInventoryCount;
  const activeSearchLift =
    lang === 'en' ? activeRegion.localSearchLiftEn : activeRegion.localSearchLift;
  const activeSummary =
    lang === 'en' ? activeRegion.summaryEn : activeRegion.summary;
  const activeChannels =
    lang === 'en' ? activeRegion.recommendedChannelsEn : activeRegion.recommendedChannels;

  return (
    <section id="seo-geo" className="py-16 lg:py-24 bg-[#F8F7F4] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Explanatory & Region Selector */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance] mb-4">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-6">
              {t.subtitle}
            </p>

            <div
              className="space-y-2"
              role="tablist"
              aria-label={lang === 'en' ? 'Select target SEO GEO region' : 'Pilih wilayah target SEO GEO'}
            >
              {GEO_REGIONS.map((region) => {
                const isSelected = region.id === activeRegion.id;
                const rLabel = lang === 'en' ? region.regionLabelEn : region.regionLabel;
                const rInv = lang === 'en' ? region.oohInventoryCountEn : region.oohInventoryCount;
                return (
                  <button
                    key={region.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border transition-colors duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0D1117] text-white border-[#0D1117]'
                        : 'bg-white text-[#0D1117] border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{rLabel}</span>
                    </span>
                    <span
                      className={`font-mono-tabular text-xs ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {rInv}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Regional Coverage Matrix */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <p className="text-xs font-medium text-stone-500">
                  {t.hubPrefix} · {activeRegion.hubCity}
                </p>
                <h3 className="font-display text-2xl font-bold text-[#0D1117] tracking-tight mt-1">
                  {activeRegionLabel}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-stone-500">{t.visibilityLabel}</p>
                <p className="font-mono-tabular text-lg font-bold text-[#1D4ED8]">
                  {activeSearchLift}
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed py-6 border-b border-stone-200">
              {activeSummary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-200">
              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-3">
                  {t.keywordsTitle}
                </h4>
                <ul className="space-y-2 text-sm text-stone-800">
                  {activeRegion.targetKeywords.map((kw) => (
                    <li key={kw} className="font-mono-tabular text-xs sm:text-sm text-stone-700">
                      • {kw}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-3">
                  {t.channelsTitle}
                </h4>
                <ul className="space-y-2 text-sm text-stone-800">
                  {activeChannels.map((ch) => (
                    <li key={ch} className="text-xs sm:text-sm text-stone-700">
                      • {ch}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-stone-500">{t.latencyLabel}</p>
                  <p className="font-mono-tabular text-base font-bold text-[#0D1117]">
                    {activeRegion.avgLoadLatency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t.inventoryLabel}</p>
                  <p className="font-mono-tabular text-base font-bold text-[#0D1117]">
                    {activeInventory}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onConsultGeo(
                    'Kampanye Digital',
                    lang === 'en'
                      ? `Local SEO + GEO audit request for ${activeRegionLabel}`
                      : `Permintaan audit SEO + GEO Lokal untuk wilayah ${activeRegionLabel}`,
                    activeRegion.hubCity
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <span>{t.auditBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
