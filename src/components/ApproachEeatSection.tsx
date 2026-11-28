import { ArrowUpRight } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale, TestimonialItem } from '../types/domain';

interface ApproachEeatSectionProps {
  lang: Locale;
  testimonials?: TestimonialItem[];
}

export function ApproachEeatSection({ lang, testimonials = [] }: ApproachEeatSectionProps) {
  const t = COPY[lang].approach;

  return (
    <section
      id="pendekatan"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.pillars.map((pillar, idx) => (
            <article
              key={pillar.title}
              className="flex flex-col justify-between bg-[#F8F7F4] border border-stone-200 rounded-xl p-6"
            >
              <div>
                <p className="font-mono-tabular text-[11px] font-semibold tracking-wider text-[#1D4ED8] mb-3">
                  {pillar.num}
                </p>
                <h3 className="font-display text-lg font-bold text-[#0D1117] mb-2.5 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">{pillar.body}</p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-2">
                {idx === 2 ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-stone-600">
                    <a
                      href="https://kotobatuah.web.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#1D4ED8] transition-colors"
                    >
                      <span>kotobatuah.web.id</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <a
                      href="https://koto.biz.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#1D4ED8] transition-colors"
                    >
                      <span>koto.biz.id</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-stone-500">{pillar.meta}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="mt-12 pt-10 border-t border-stone-200">
            <h3 className="font-display text-lg font-bold text-[#0D1117] mb-5">
              {t.verifiedReviewsHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <blockquote
                  key={item.id}
                  className="flex flex-col justify-between bg-[#F8F7F4] border border-stone-200 rounded-xl p-6"
                >
                  <div>
                    {item.outcome && (
                      <p className="font-mono-tabular text-xs font-semibold text-[#1D4ED8] mb-3">
                        {item.outcome}
                      </p>
                    )}
                    <p className="text-sm text-stone-800 leading-relaxed mb-5">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-sm font-semibold text-[#0D1117]">{item.clientName}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.role} · {item.company}
                    </p>
                    {item.city && <p className="text-xs text-stone-400 mt-0.5">{item.city}</p>}
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
