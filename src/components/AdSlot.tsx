import { useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale, SiteSettings } from '../types/domain';

interface AdSlotProps {
  lang: Locale;
  siteSettings: SiteSettings;
  variant: 'leaderboard' | 'in-article';
  onConsultSponsor?: () => void;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSlot({
  lang,
  siteSettings,
  variant,
  onConsultSponsor,
}: AdSlotProps) {
  const t = COPY[lang].blog;
  const clientId = (siteSettings.adsenseClientId ?? '').trim();
  const slotId =
    variant === 'leaderboard'
      ? (siteSettings.adsenseBlogSlotId ?? '').trim()
      : (siteSettings.adsenseArticleSlotId ?? '').trim();

  const isLiveAdSense = Boolean(clientId.startsWith('ca-pub-') && slotId.length >= 6);

  useEffect(() => {
    if (!isLiveAdSense) return;

    const scriptId = 'koto-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        clientId
      )}`;
      document.head.appendChild(script);
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore AdSense push timing errors in preview environments
    }
  }, [isLiveAdSense, clientId, slotId]);

  if (isLiveAdSense) {
    return (
      <aside
        aria-label={t.adLabel}
        data-testid={`ad-slot-${variant}`}
        className="my-6 p-4 bg-white border border-stone-200 rounded-xl text-center"
      >
        <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-stone-400 mb-2">
          {t.adLabel}
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: variant === 'leaderboard' ? '90px' : '120px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={variant === 'in-article' ? 'fluid' : 'auto'}
          data-ad-layout={variant === 'in-article' ? 'in-article' : undefined}
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside
      aria-label={t.adLabel}
      data-testid={`ad-slot-${variant}`}
      className={`rounded-xl border border-dashed border-stone-300 bg-white/85 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        variant === 'in-article' ? 'my-6 bg-[#F8F7F4]' : 'mt-8'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-[#0D1117] text-white flex items-center justify-center shrink-0">
          <Megaphone className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-stone-500">
            {t.adLabel} · {variant === 'in-article' ? 'In-Article AdSense' : 'Leaderboard 728x90 / Responsive'}
          </p>
          <p className="font-display text-sm font-bold text-[#0D1117] mt-0.5">
            {t.adPlaceholderTitle}
          </p>
          <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
            {t.adPlaceholderBody}
          </p>
        </div>
      </div>

      {onConsultSponsor && (
        <button
          type="button"
          onClick={onConsultSponsor}
          className="px-3.5 py-2 border border-stone-300 bg-[#F8F7F4] hover:bg-[#0D1117] hover:text-white hover:border-[#0D1117] text-xs font-semibold text-[#0D1117] rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer"
        >
          {t.adConsultCta}
        </button>
      )}
    </aside>
  );
}
