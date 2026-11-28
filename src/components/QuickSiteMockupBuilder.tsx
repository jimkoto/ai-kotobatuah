import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  Monitor,
  RotateCcw,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';
import {
  buildMockupOrderWhatsAppUrl,
  buildMockupPreviewSlug,
  calculateEstimatedTotalRange,
  formatIdrCompact,
  MOCKUP_TEMPLATES,
  parseMockupHighlights,
  type ConsultationModeId,
  type MockupFormInput,
  type MockupTemplateId,
} from '../utils/mockupBuilder';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface QuickSiteMockupBuilderProps {
  lang: Locale;
  siteSettings: SiteSettings;
  consultationMode: ConsultationModeId;
}

function getTemplateDefaults(templateId: MockupTemplateId, lang: Locale): MockupFormInput {
  const tpl = MOCKUP_TEMPLATES.find((item) => item.id === templateId) ?? MOCKUP_TEMPLATES[0];
  return {
    templateId: tpl.id,
    businessName: tpl.defaultBusiness,
    tagline: lang === 'en' ? tpl.defaultTaglineEn : tpl.defaultTaglineId,
    city: 'Tangerang Selatan',
    businessWhatsapp: '+62 813-2441-2025',
    highlightsText: lang === 'en' ? tpl.defaultHighlightsEn : tpl.defaultHighlightsId,
  };
}

export function QuickSiteMockupBuilder({
  lang,
  siteSettings,
  consultationMode,
}: QuickSiteMockupBuilderProps) {
  const t = COPY[lang].mockupBuilder;

  const [formInput, setFormInput] = useState<MockupFormInput>(() =>
    getTemplateDefaults('umkm', lang)
  );
  const [renderedMockup, setRenderedMockup] = useState<MockupFormInput>(() =>
    getTemplateDefaults('umkm', lang)
  );
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [justGenerated, setJustGenerated] = useState(false);

  const handleSelectTemplate = (templateId: MockupTemplateId) => {
    const defaults = getTemplateDefaults(templateId, lang);
    setFormInput(defaults);
    setRenderedMockup(defaults);
    setJustGenerated(false);
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    const activeTemplate =
      MOCKUP_TEMPLATES.find((item) => item.id === formInput.templateId) ?? MOCKUP_TEMPLATES[0];
    const cleanMockup: MockupFormInput = {
      templateId: formInput.templateId,
      businessName: formInput.businessName.trim() || activeTemplate.defaultBusiness,
      tagline:
        formInput.tagline.trim() ||
        (lang === 'en' ? activeTemplate.defaultTaglineEn : activeTemplate.defaultTaglineId),
      city: formInput.city.trim() || 'Tangerang Raya',
      businessWhatsapp: formInput.businessWhatsapp.trim() || siteSettings.contactPhone,
      highlightsText:
        formInput.highlightsText.trim() ||
        (lang === 'en' ? activeTemplate.defaultHighlightsEn : activeTemplate.defaultHighlightsId),
    };
    setRenderedMockup(cleanMockup);
    setJustGenerated(true);
  };

  const activeTemplateMeta =
    MOCKUP_TEMPLATES.find((item) => item.id === renderedMockup.templateId) ?? MOCKUP_TEMPLATES[0];
  const highlights = parseMockupHighlights(
    renderedMockup.highlightsText,
    (lang === 'en'
      ? activeTemplateMeta.defaultHighlightsEn
      : activeTemplateMeta.defaultHighlightsId
    ).split(', ')
  );
  const previewSlug = buildMockupPreviewSlug(renderedMockup.businessName);
  const previewWaUrl = buildWhatsAppUrl(
    renderedMockup.businessWhatsapp,
    lang === 'en'
      ? `Hello ${renderedMockup.businessName}, I would like more information about your products/services.`
      : `Halo ${renderedMockup.businessName}, saya ingin tanya lebih lanjut mengenai produk/layanan Anda.`
  );
  const orderWaHref = buildMockupOrderWhatsAppUrl(
    siteSettings.contactPhone,
    renderedMockup,
    lang,
    consultationMode
  );
  const priceEstimate = calculateEstimatedTotalRange('paket-website-kilat', consultationMode);

  return (
    <div
      id="mockup-kilat"
      className="mt-12 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 scroll-mt-24"
    >
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1D4ED8] mb-2">
          {t.kicker}
        </p>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1117] tracking-tight mb-2">
          {t.heading}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Guided Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#0D1117] mb-2">{t.templateLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCKUP_TEMPLATES.map((tpl) => {
                const selected = formInput.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`px-3 py-2.5 text-left text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#0D1117] text-white border-[#0D1117]'
                        : 'bg-[#F8F7F4] text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {lang === 'en' ? tpl.labelEn : tpl.labelId}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="mockup-business-name"
              className="block text-xs font-semibold text-[#0D1117] mb-1.5"
            >
              {t.businessNameLabel}
            </label>
            <input
              id="mockup-business-name"
              type="text"
              value={formInput.businessName}
              onChange={(e) =>
                setFormInput((prev) => ({ ...prev, businessName: e.target.value }))
              }
              placeholder={t.businessNamePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] border border-stone-300 rounded-lg text-[#0D1117] focus:outline-2 focus:outline-[#1D4ED8]"
            />
          </div>

          <div>
            <label
              htmlFor="mockup-tagline"
              className="block text-xs font-semibold text-[#0D1117] mb-1.5"
            >
              {t.taglineLabel}
            </label>
            <textarea
              id="mockup-tagline"
              rows={2}
              value={formInput.tagline}
              onChange={(e) => setFormInput((prev) => ({ ...prev, tagline: e.target.value }))}
              placeholder={t.taglinePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] border border-stone-300 rounded-lg text-[#0D1117] focus:outline-2 focus:outline-[#1D4ED8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="mockup-city"
                className="block text-xs font-semibold text-[#0D1117] mb-1.5"
              >
                {t.cityLabel}
              </label>
              <input
                id="mockup-city"
                type="text"
                value={formInput.city}
                onChange={(e) => setFormInput((prev) => ({ ...prev, city: e.target.value }))}
                placeholder={t.cityPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] border border-stone-300 rounded-lg text-[#0D1117] focus:outline-2 focus:outline-[#1D4ED8]"
              />
            </div>
            <div>
              <label
                htmlFor="mockup-wa"
                className="block text-xs font-semibold text-[#0D1117] mb-1.5"
              >
                {t.waLabel}
              </label>
              <input
                id="mockup-wa"
                type="text"
                value={formInput.businessWhatsapp}
                onChange={(e) =>
                  setFormInput((prev) => ({ ...prev, businessWhatsapp: e.target.value }))
                }
                placeholder={t.waPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] border border-stone-300 rounded-lg text-[#0D1117] focus:outline-2 focus:outline-[#1D4ED8]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="mockup-highlights"
              className="block text-xs font-semibold text-[#0D1117] mb-1.5"
            >
              {t.highlightsLabel}
            </label>
            <input
              id="mockup-highlights"
              type="text"
              value={formInput.highlightsText}
              onChange={(e) =>
                setFormInput((prev) => ({ ...prev, highlightsText: e.target.value }))
              }
              placeholder={t.highlightsPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] border border-stone-300 rounded-lg text-[#0D1117] focus:outline-2 focus:outline-[#1D4ED8]"
            />
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.generateBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTemplate(formInput.templateId)}
              title={t.resetBtn}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.resetBtn}</span>
            </button>
          </div>

          {justGenerated && (
            <p
              role="status"
              className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 w-full"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.generatedBanner}</span>
            </p>
          )}
        </form>

        {/* Right: Live Browser Frame Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {t.previewTitle}
            </p>

            <div
              role="group"
              aria-label={t.previewTitle}
              className="inline-flex items-center p-0.5 bg-[#F8F7F4] border border-stone-300 rounded-lg"
            >
              <button
                type="button"
                aria-pressed={previewViewport === 'desktop'}
                onClick={() => setPreviewViewport('desktop')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  previewViewport === 'desktop'
                    ? 'bg-[#0D1117] text-white'
                    : 'text-stone-600 hover:text-[#0D1117]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.desktopMode}</span>
              </button>
              <button
                type="button"
                aria-pressed={previewViewport === 'mobile'}
                onClick={() => setPreviewViewport('mobile')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  previewViewport === 'mobile'
                    ? 'bg-[#0D1117] text-white'
                    : 'text-stone-600 hover:text-[#0D1117]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.mobileMode}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F8F7F4] border border-stone-200 rounded-xl p-3 sm:p-4 flex justify-center">
            <div
              className={`bg-white border border-stone-300 rounded-xl overflow-hidden shadow-sm transition-all duration-150 ${
                previewViewport === 'mobile' ? 'w-full max-w-[330px]' : 'w-full'
              }`}
            >
              {/* Simulated Browser Address Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-3 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                </div>
                <div className="flex-1 bg-white border border-stone-200 rounded px-2.5 py-1 text-[11px] font-mono-tabular text-stone-600 truncate">
                  https://{previewSlug}.kotobatuah.com
                </div>
              </div>

              {/* Simulated Generated Site Header */}
              <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between gap-2 bg-white">
                <span className="font-display text-xs sm:text-sm font-bold text-[#0D1117] truncate">
                  {renderedMockup.businessName}
                </span>
                <a
                  href={previewWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap ${activeTemplateMeta.buttonClass}`}
                >
                  WhatsApp
                </a>
              </div>

              {/* Simulated Generated Hero */}
              <div className={`px-5 py-6 ${activeTemplateMeta.surfaceBgClass}`}>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium opacity-90 mb-2">
                  <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>{renderedMockup.city}</span>
                  <span>·</span>
                  <span>
                    {lang === 'en' ? activeTemplateMeta.labelEn : activeTemplateMeta.labelId}
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-bold leading-snug mb-2">
                  {renderedMockup.businessName}
                </h4>
                <p className="text-xs sm:text-sm opacity-90 leading-relaxed mb-4">
                  {renderedMockup.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={previewWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors ${activeTemplateMeta.heroButtonClass}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{lang === 'en' ? 'Order via WhatsApp' : 'Hubungi WhatsApp'}</span>
                  </a>
                  <span className="px-3 py-2 text-xs font-medium rounded-md border border-white/25 text-white/90">
                    {lang === 'en' ? 'SEO + GEO Ready' : 'Siap SEO + GEO'}
                  </span>
                </div>
              </div>

              {/* Simulated 3 Service / Product Blocks */}
              <div className="p-4 sm:p-5 bg-white">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-3">
                  {lang === 'en' ? 'Featured Offerings' : 'Layanan & Produk Unggulan'}
                </p>
                <div
                  className={`grid gap-2.5 ${
                    previewViewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'
                  }`}
                >
                  {highlights.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="p-3 rounded-lg bg-[#F8F7F4] border border-stone-200"
                    >
                      <span className="font-mono-tabular text-[10px] font-semibold text-stone-500">
                        0{idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-[#0D1117] mt-1 leading-snug">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{renderedMockup.businessWhatsapp}</span>
                  <span>FAQ · Google Maps · Mobile Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Mockup-to-Order Conversion Bar */}
          <div className="mt-4 bg-[#F8F7F4] border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-stone-600">{t.estimatedLabel}</p>
              <p className="font-mono-tabular text-sm sm:text-base font-bold text-[#0D1117]">
                <span className="whitespace-nowrap">{formatIdrCompact(priceEstimate.minTotal)}</span>
                {' – '}
                <span className="whitespace-nowrap">{formatIdrCompact(priceEstimate.maxTotal)}</span>
              </p>
            </div>
            <a
              href={orderWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.orderWithMockupCta}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
