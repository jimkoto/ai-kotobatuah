import { useMemo, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { COPY, translateCategory } from '../i18n/translations';
import {
  PORTFOLIO_CATEGORIES,
  type LeadServiceType,
  type Locale,
  type PortfolioCategory,
  type PortfolioItem,
} from '../types/domain';
import { filterPortfolioByCategory } from '../utils/validation';
import { MediaImage } from './MediaImage';

interface PortfolioSectionProps {
  lang: Locale;
  items: PortfolioItem[];
  loading: boolean;
  onConsultService: (service: LeadServiceType, contextTitle?: string) => void;
}

export function PortfolioSection({
  lang,
  items,
  loading,
  onConsultService,
}: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'Semua'>('Semua');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const t = COPY[lang].portfolio;

  const filteredItems = useMemo(
    () => filterPortfolioByCategory(items, activeCategory),
    [items, activeCategory]
  );

  return (
    <section id="portofolio" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance]">
              {t.heading}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'en' ? 'Portfolio category filter' : 'Filter kategori portofolio'}
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-lg border border-stone-200"
          >
            {(['Semua', ...PORTFOLIO_CATEGORIES] as const).map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0D1117] text-white'
                      : 'text-stone-700 hover:text-[#0D1117] hover:bg-stone-200/70'
                  }`}
                >
                  {translateCategory(category, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && filteredItems.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-96 rounded-xl border border-stone-200 bg-stone-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center border border-stone-200 rounded-xl bg-[#F8F7F4]">
            <p className="text-base font-medium text-[#0D1117] mb-2">
              {t.emptyTitle}
            </p>
            <p className="text-sm text-stone-600 mb-4">
              {t.emptyBody}
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('Semua')}
              className="px-4 py-2 bg-[#0D1117] text-white text-sm font-medium rounded-lg cursor-pointer"
            >
              {t.showAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {filteredItems.map((item, idx) => {
              const isWide = activeCategory === 'Semua' && idx === 0;
              const colClass = isWide ? 'md:col-span-7' : idx === 1 && activeCategory === 'Semua' ? 'md:col-span-5' : 'md:col-span-6';
              return (
                <article
                  key={item.id}
                  className={`${colClass} group flex flex-col justify-between border border-stone-200 rounded-xl overflow-hidden bg-[#F8F7F4] transition-colors duration-150 hover:border-stone-400`}
                >
                  <div>
                    <div className="h-64 sm:h-72 lg:h-80 overflow-hidden bg-stone-900 relative">
                      <MediaImage
                        src={item.imageUrl}
                        alt={`${item.title} — ${item.client}`}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-6">
                      {/* Unboxed clean metadata with typographic separator */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-2">
                        <span className="font-medium text-stone-800">
                          {translateCategory(item.category, lang)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{item.year}</span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#0D1117] tracking-tight mb-2 [text-wrap:balance]">
                        {item.title}
                      </h3>

                      <p className="text-sm text-stone-700 leading-relaxed mb-4">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-stone-500">{item.client}</p>
                      <p className="font-mono-tabular text-sm font-semibold text-[#1D4ED8]">
                        {item.metricLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`${t.caseStudyBtn}: ${item.title}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 bg-white hover:bg-[#0D1117] hover:text-white hover:border-[#0D1117] text-[#0D1117] text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{t.caseStudyBtn}</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] bg-stone-900 relative overflow-hidden">
              <MediaImage
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                fallbackTitle={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label={lang === 'en' ? 'Close case study' : 'Tutup detail studi kasus'}
                className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-black/75 text-white hover:bg-black flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-2">
                <span className="font-semibold text-[#1D4ED8]">
                  {translateCategory(selectedItem.category, lang)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedItem.client}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedItem.location}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{selectedItem.year}</span>
              </div>

              <h3
                id="case-study-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[#0D1117] tracking-tight mb-3"
              >
                {selectedItem.title}
              </h3>

              <p className="font-mono-tabular text-base font-semibold text-[#1D4ED8] mb-6">
                {t.measuredResult} {selectedItem.metricLabel}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 border-y border-stone-200 mb-6">
                <div>
                  <h4 className="text-xs font-semibold tracking-wide text-stone-500 mb-2">
                    {t.clientChallenge}
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {selectedItem.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wide text-stone-500 mb-2">
                    {t.ourSolution}
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {selectedItem.solution}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-[#0D1117] cursor-pointer"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cat = selectedItem.category;
                    const title = selectedItem.title;
                    setSelectedItem(null);
                    onConsultService(cat as LeadServiceType, title);
                  }}
                  className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {t.consultSimilar}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
