import { Check, ArrowRight } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { HostingPartnerItem, LeadServiceType, Locale } from '../types/domain';

interface ServicesAndHostingSectionProps {
  lang: Locale;
  hostingPartners: HostingPartnerItem[];
  onSelectService: (service: LeadServiceType, contextNote?: string) => void;
}

export function ServicesAndHostingSection({
  lang,
  hostingPartners,
  onSelectService,
}: ServicesAndHostingSectionProps) {
  const s = COPY[lang].services;
  const h = COPY[lang].hosting;

  return (
    <>
      {/* Numbered Services Section */}
      <section id="layanan" className="py-16 lg:py-24 bg-[#F8F7F4] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              {s.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance]">
              {s.heading}
            </h2>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {s.list.map((svc) => (
              <div
                key={svc.num}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-5 flex items-baseline gap-4">
                  <span className="font-mono-tabular text-sm font-semibold text-[#1D4ED8] shrink-0">
                    {svc.num}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1117] tracking-tight">
                    {svc.title}
                  </h3>
                </div>

                <div className="lg:col-span-5 space-y-2">
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                    {svc.description}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {s.outputPrefix} {svc.deliverable}
                  </p>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <button
                    type="button"
                    onClick={() => onSelectService(svc.serviceType, svc.title)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D1117] hover:text-[#1D4ED8] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{s.discuss}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Partner Hosting & Responsive CMS Infrastructure Section */}
      <section
        id="partner-hosting"
        className="py-16 lg:py-24 bg-[#0D1117] text-stone-100 border-b border-stone-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#60A5FA] mb-2">
                {h.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                {h.heading}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-stone-300 max-w-md leading-relaxed">
              {h.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hostingPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col justify-between bg-[#161B22] border border-stone-800 rounded-xl p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs text-stone-400 mb-3">
                    <span>{partner.tier}</span>
                    <span className="font-mono-tabular text-[#60A5FA] font-semibold">
                      SLA {partner.uptimeSla}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white tracking-tight mb-2">
                    {partner.name}
                  </h3>

                  <p className="text-xs text-stone-400 mb-4">
                    {h.serverRegion} {partner.region}
                  </p>

                  <p className="text-sm text-stone-300 leading-relaxed mb-6">
                    {partner.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {partner.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-200">
                        <Check
                          className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectService(
                      'Partner Hosting & CMS',
                      lang === 'en'
                        ? `Interested in ${partner.name} (${partner.tier} - ${partner.region})`
                        : `Tertarik paket ${partner.name} (${partner.tier} - ${partner.region})`
                    )
                  }
                  className="w-full py-2.5 px-4 bg-white text-[#0D1117] hover:bg-stone-200 text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  {h.chooseBtn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
