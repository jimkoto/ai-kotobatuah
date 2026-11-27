import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale } from '../types/domain';

export const COOKIE_CONSENT_STORAGE_KEY = 'kotobatuah_cookie_consent_v1';

export type CookieConsentChoice = 'all' | 'essential';

interface CookieConsentBannerProps {
  lang: Locale;
  forceOpen?: boolean;
  onDismissForceOpen?: () => void;
  onOpenCookiesPage: () => void;
}

export function CookieConsentBanner({
  lang,
  forceOpen = false,
  onDismissForceOpen,
  onOpenCookiesPage,
}: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  const t = COPY[lang].cookieBanner;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
    }
  }, [forceOpen]);

  if (!visible) return null;

  const handleSave = (choice: CookieConsentChoice) => {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify({ choice, updatedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore private browsing localStorage failure
    }
    setVisible(false);
    onDismissForceOpen?.();
  };

  return (
    <div
      role="region"
      aria-label={t.title}
      data-testid="cookie-consent-banner"
      className="fixed bottom-3 left-3 sm:left-4 z-40 w-[calc(100vw-1.5rem)] sm:w-auto sm:max-w-[760px] bg-white/95 backdrop-blur-md border border-stone-300 rounded-xl shadow-lg px-4 py-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-[#0D1117] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-3.5 h-3.5 text-[#60A5FA]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xs font-bold text-[#0D1117] leading-tight">
              {t.title}
            </p>
            <p className="text-[11px] text-stone-600 leading-snug mt-0.5">
              {t.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSave('all')}
            className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => handleSave('essential')}
            className="px-3 py-1.5 border border-stone-300 bg-[#F8F7F4] hover:bg-stone-100 text-[#0D1117] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t.essentialOnly}
          </button>
          <a
            href="/procedure/cookies"
            onClick={(e) => {
              e.preventDefault();
              onOpenCookiesPage();
            }}
            className="px-1.5 py-1.5 text-[11px] font-medium text-[#1D4ED8] hover:underline"
          >
            {t.learnMore}
          </a>
          <button
            type="button"
            onClick={() => handleSave('essential')}
            aria-label={lang === 'en' ? 'Dismiss cookie banner' : 'Tutup pemberitahuan cookies'}
            className="w-6 h-6 rounded-md text-stone-500 hover:text-[#0D1117] hover:bg-stone-100 flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
