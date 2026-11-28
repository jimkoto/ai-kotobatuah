import { useState } from 'react';
import { ChevronDown, FileText, MessageCircle } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FaqClosingSectionProps {
  lang: Locale;
  siteSettings: SiteSettings;
  onOpenWrittenBrief: () => void;
}

export function FaqClosingSection({
  lang,
  siteSettings,
  onOpenWrittenBrief,
}: FaqClosingSectionProps) {
  const t = COPY[lang].faqClosing;
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const closingWaHref = buildWhatsAppUrl(siteSettings.contactPhone, t.closingWaMessage);

  return (
    <section
      id="faq"
      className="border-b border-stone-200 bg-[#F8F7F4] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Concise FAQ Accordion */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1D4ED8] mb-2">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1117] tracking-tight leading-[1.15] [text-wrap:balance] mb-6">
              {t.heading}
            </h2>

            <div className="space-y-3">
              {t.items.map((item, idx) => {
                const isOpen = openIndices.includes(idx);
                return (
                  <div
                    key={item.q}
                    className="bg-white border border-stone-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleIndex(idx)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm sm:text-base font-semibold text-[#0D1117] hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Closing Conversion Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0D1117] text-white border border-stone-800 rounded-xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-400 mb-2">
                {t.closingKicker}
              </p>
              <h3 className="font-display text-2xl font-bold text-white leading-snug mb-3">
                {t.closingHeading}
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
                {t.closingBody}
              </p>

              <div className="space-y-3">
                <a
                  href={closingWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.closingCta}</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenWrittenBrief}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-stone-700 hover:border-stone-500 text-stone-200 hover:text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.closingSecondaryCta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
