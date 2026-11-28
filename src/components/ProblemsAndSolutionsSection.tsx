import { AlertTriangle, ArrowDown } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale } from '../types/domain';

interface ProblemsAndSolutionsSectionProps {
  lang: Locale;
  onExplorePackages: () => void;
}

export function ProblemsAndSolutionsSection({
  lang,
  onExplorePackages,
}: ProblemsAndSolutionsSectionProps) {
  const t = COPY[lang].problems;

  return (
    <section
      id="masalah-solusi"
      className="border-b border-stone-200 bg-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1D4ED8] mb-2">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1117] tracking-tight leading-[1.15] [text-wrap:balance]">
            {t.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.items.map((item) => (
            <article
              key={item.num}
              className="flex flex-col justify-between bg-[#F8F7F4] border border-stone-200 rounded-xl p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono-tabular text-xs font-semibold text-stone-500">
                    {item.num}
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-[#0D1117] text-white rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-400 mb-2">
              {lang === 'en' ? 'Fast Solution' : 'Solusi Terarah'}
            </p>
            <p className="text-base sm:text-lg font-medium text-stone-100 leading-relaxed">
              {t.transition}
            </p>
          </div>
          <button
            type="button"
            onClick={onExplorePackages}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>{t.transitionCta}</span>
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
