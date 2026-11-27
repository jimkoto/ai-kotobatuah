import { useEffect, useState, type FormEvent, type RefObject } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { COPY } from '../i18n/translations';
import {
  LEAD_BUDGET_RANGES,
  LEAD_SERVICES,
  type LeadBudgetRange,
  type LeadServiceType,
  type LeadSource,
  type Locale,
  type SiteSettings,
} from '../types/domain';
import { validateLeadInquiry } from '../utils/validation';
import { submitLeadInquiry } from '../services/firestoreService';

interface LeadCaptureSectionProps {
  lang: Locale;
  siteSettings: SiteSettings;
  prefillService?: LeadServiceType;
  prefillBrief?: string;
  prefillCity?: string;
  prefillSource?: LeadSource;
  nameInputRef?: RefObject<HTMLInputElement | null>;
}

export function LeadCaptureSection({
  lang,
  siteSettings,
  prefillService,
  prefillBrief,
  prefillCity,
  prefillSource = 'homepage_form',
  nameInputRef,
}: LeadCaptureSectionProps) {
  const t = COPY[lang].lead;

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [serviceType, setServiceType] = useState<LeadServiceType>('OOH & Billboard');
  const [budgetRange, setBudgetRange] = useState<LeadBudgetRange>('Rp 25 - 75 Juta');
  const [city, setCity] = useState(siteSettings.primaryHubName);
  const [brief, setBrief] = useState('');
  const [source, setSource] = useState<LeadSource>(prefillSource);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<{
    referenceCode: string;
    fullName: string;
    serviceType: LeadServiceType;
  } | null>(null);

  useEffect(() => {
    if (prefillService) setServiceType(prefillService);
  }, [prefillService]);

  useEffect(() => {
    if (prefillBrief) setBrief(prefillBrief);
  }, [prefillBrief]);

  useEffect(() => {
    if (prefillCity) {
      setCity(prefillCity);
    } else if (!city) {
      setCity(siteSettings.primaryHubName);
    }
  }, [prefillCity, siteSettings.primaryHubName, city]);

  useEffect(() => {
    if (prefillSource) setSource(prefillSource);
  }, [prefillSource]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validation = validateLeadInquiry({
      fullName,
      company,
      email,
      whatsapp,
      serviceType,
      budgetRange,
      city,
      brief,
      source,
    });

    if (!validation.valid || !validation.sanitized) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await submitLeadInquiry(validation.sanitized);
      setSubmittedRef({
        referenceCode: res.referenceCode,
        fullName: validation.sanitized.fullName,
        serviceType: validation.sanitized.serviceType,
      });
      setFullName('');
      setCompany('');
      setEmail('');
      setWhatsapp('');
      setBrief('');
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : lang === 'en'
          ? 'Failed to submit consultation request. Please check your connection and try again.'
          : 'Gagal mengirim data konsultasi. Silakan periksa koneksi Anda dan coba kembali.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="konsultasi" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Conversion Argument */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance] mb-4">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-8">
              {t.subtitle}
            </p>

            <div className="space-y-4 border-t border-stone-200 pt-6">
              <div>
                <p className="text-xs font-semibold text-stone-500">
                  {t.primaryOffice} · {siteSettings.primaryHubName}
                </p>
                <p className="text-sm text-[#0D1117] mt-0.5">
                  {siteSettings.primaryAddress}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">{t.secondaryOffice}</p>
                <p className="text-sm text-[#0D1117] mt-0.5">
                  {siteSettings.secondaryAddress}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">{t.directContact}</p>
                <p className="font-mono-tabular text-sm text-[#0D1117] mt-0.5">
                  {siteSettings.contactEmail} · {siteSettings.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#F8F7F4] border border-stone-200 rounded-xl p-6 sm:p-8">
            {submittedRef ? (
              <div className="py-8 text-center">
                <CheckCircle2
                  className="w-12 h-12 text-emerald-700 mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="font-display text-2xl font-bold text-[#0D1117] mb-2">
                  {t.successTitle}
                </h3>
                <p className="text-sm text-stone-700 max-w-md mx-auto mb-4 leading-relaxed">
                  {t.successBody1} <strong>{submittedRef.fullName}</strong>. {t.successBody2}{' '}
                  <strong>{submittedRef.serviceType}</strong> {t.successBody3}
                </p>
                <p className="font-mono-tabular text-xs text-stone-600 mb-6">
                  {t.refLabel} {submittedRef.referenceCode}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="px-5 py-2.5 bg-[#0D1117] text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lead-fullName"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.fullName}
                    </label>
                    <input
                      ref={nameInputRef}
                      id="lead-fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Budi Santoso' : 'Contoh: Budi Santoso'}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-700 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lead-company"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.company}
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. PT Kopi Nusantara' : 'Contoh: PT Kopi Nusantara'}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                      required
                    />
                    {errors.company && (
                      <p className="text-xs text-red-700 mt-1">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lead-email"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.email}
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.co.id"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-700 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lead-whatsapp"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.whatsapp}
                    </label>
                    <input
                      id="lead-whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                      required
                    />
                    {errors.whatsapp && (
                      <p className="text-xs text-red-700 mt-1">{errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="lead-service"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.serviceType}
                    </label>
                    <select
                      id="lead-service"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as LeadServiceType)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                    >
                      {LEAD_SERVICES.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lead-budget"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.budgetRange}
                    </label>
                    <select
                      id="lead-budget"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value as LeadBudgetRange)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                    >
                      {LEAD_BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lead-city"
                      className="block text-xs font-semibold text-stone-800 mb-1.5"
                    >
                      {t.city}
                    </label>
                    <input
                      id="lead-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Tangerang Raya / Jakarta"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                      required
                    />
                    {errors.city && (
                      <p className="text-xs text-red-700 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-brief"
                    className="block text-xs font-semibold text-stone-800 mb-1.5"
                  >
                    {t.brief}
                  </label>
                  <textarea
                    id="lead-brief"
                    rows={4}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder={t.briefPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-[#0D1117] focus:outline-none focus:border-[#1D4ED8]"
                    required
                  />
                  {errors.brief && (
                    <p className="text-xs text-red-700 mt-1">{errors.brief}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-stone-500">
                    {t.privacyNote}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
                  >
                    {submitting ? t.submittingBtn : t.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
