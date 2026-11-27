import { COPY } from '../i18n/translations';
import type { Locale, TestimonialItem } from '../types/domain';

interface TestimonialsSectionProps {
  lang: Locale;
  items: TestimonialItem[];
}

export function TestimonialsSection({ lang, items }: TestimonialsSectionProps) {
  const t = COPY[lang].testimonials;

  if (items.length === 0) {
    return (
      <section id="testimoni" className="py-16 lg:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              {t.projectModelKicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance]">
              {t.projectModelHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.projectPillars.map((pillar) => (
              <article
                key={pillar.tag}
                className="flex flex-col justify-between bg-[#F8F7F4] border border-stone-200 rounded-xl p-6 sm:p-7"
              >
                <div>
                  <p className="font-mono-tabular text-xs font-semibold text-[#1D4ED8] mb-3">
                    {pillar.tag}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#0D1117] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed mb-6">
                    {pillar.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <p className="text-xs font-medium text-stone-600">{pillar.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimoni" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance]">
            {t.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col justify-between bg-[#F8F7F4] border border-stone-200 rounded-xl p-6 sm:p-7"
            >
              <div>
                <p className="font-mono-tabular text-xs font-semibold text-[#1D4ED8] mb-4">
                  {item.outcome}
                </p>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <p className="font-display text-sm font-bold text-[#0D1117]">
                  {item.clientName}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  {item.role} · {item.company}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{item.city}</p>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
