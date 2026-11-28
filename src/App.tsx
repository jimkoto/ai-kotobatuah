import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SITE_SETTINGS,
  SEED_BLOG_POSTS,
  SEED_PROCEDURE_PAGES,
  SEED_TESTIMONIALS,
} from './data/seedData';
import {
  subscribePublishedBlogPosts,
  subscribePublishedProcedurePages,
  subscribePublishedTestimonials,
  subscribeSiteSettings,
} from './services/firestoreService';
import {
  PROCEDURE_SLUGS,
  type BlogPost,
  type LeadServiceType,
  type LeadSource,
  type Locale,
  type ProcedurePage,
  type ProcedureSlug,
  type SiteSettings,
  type TestimonialItem,
} from './types/domain';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemsAndSolutionsSection } from './components/ProblemsAndSolutionsSection';
import { Packages2027Section } from './components/Packages2027Section';
import { ApproachEeatSection } from './components/ApproachEeatSection';
import { FaqClosingSection } from './components/FaqClosingSection';
import { BlogSection } from './components/BlogSection';
import { LeadCaptureSection } from './components/LeadCaptureSection';
import { Footer } from './components/Footer';
import { AiChatbotWidget } from './components/AiChatbotWidget';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ProcedurePageView } from './components/ProcedurePageView';

const CmsModal = lazy(() =>
  import('./components/CmsModal').then((m) => ({ default: m.CmsModal }))
);

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param === 'en') return 'en';
  }
  return 'id';
}

function parseProcedureSlugFromPath(pathname: string): ProcedureSlug | null {
  const match = pathname.match(/^\/procedure\/([a-z0-9-]+)\/?$/i);
  if (!match?.[1]) return null;
  const candidate = match[1].toLowerCase() as ProcedureSlug;
  return PROCEDURE_SLUGS.includes(candidate) ? candidate : null;
}

function KotoBatuahApp() {
  const [lang, setLang] = useState<Locale>(getInitialLocale);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(SEED_TESTIMONIALS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(SEED_BLOG_POSTS);
  const [procedurePages, setProcedurePages] = useState<ProcedurePage[]>(SEED_PROCEDURE_PAGES);
  const [currentProcedureSlug, setCurrentProcedureSlug] = useState<ProcedureSlug | null>(() =>
    typeof window !== 'undefined' ? parseProcedureSlugFromPath(window.location.pathname) : null
  );
  const [cookieBannerForceOpen, setCookieBannerForceOpen] = useState(false);

  const [prefillService, setPrefillService] = useState<LeadServiceType | undefined>(undefined);
  const [prefillBrief, setPrefillBrief] = useState<string | undefined>(undefined);
  const [prefillCity, setPrefillCity] = useState<string | undefined>(undefined);
  const [prefillSource, setPrefillSource] = useState<LeadSource>('homepage_form');

  const [chatOpen, setChatOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  const leadNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (lang === 'en') {
        url.searchParams.set('lang', 'en');
      } else {
        url.searchParams.delete('lang');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [lang]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentProcedureSlug(parseProcedureSlugFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const unsubTestimonials = subscribePublishedTestimonials(
      (items) => setTestimonials(items),
      () => setTestimonials(SEED_TESTIMONIALS)
    );

    const unsubSettings = subscribeSiteSettings(
      (settings) => setSiteSettings(settings),
      () => setSiteSettings(DEFAULT_SITE_SETTINGS)
    );

    const unsubBlogs = subscribePublishedBlogPosts(
      (posts) => setBlogPosts(posts),
      () => setBlogPosts(SEED_BLOG_POSTS)
    );

    const unsubProcedures = subscribePublishedProcedurePages(
      (pages) => setProcedurePages(pages),
      () => setProcedurePages(SEED_PROCEDURE_PAGES)
    );

    return () => {
      unsubTestimonials();
      unsubSettings();
      unsubBlogs();
      unsubProcedures();
    };
  }, []);

  const navigateToProcedure = (slug: ProcedureSlug) => {
    setCurrentProcedureSlug(slug);
    if (typeof window !== 'undefined') {
      const suffix = lang === 'en' ? '?lang=en' : '';
      window.history.pushState({}, '', `/procedure/${slug}${suffix}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateHomeAndScroll = (sectionId?: string) => {
    const wasOnProcedure = currentProcedureSlug !== null;
    if (wasOnProcedure) {
      setCurrentProcedureSlug(null);
      if (typeof window !== 'undefined') {
        const homeUrl = lang === 'en' ? '/?lang=en' : '/';
        window.history.pushState({}, '', homeUrl);
      }
    }

    if (!sectionId || sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.setTimeout(
      () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      wasOnProcedure ? 80 : 0
    );
  };

  const focusConsultationForm = () => {
    navigateHomeAndScroll('konsultasi');
    window.setTimeout(() => {
      leadNameInputRef.current?.focus({ preventScroll: true });
    }, 350);
  };

  const handleConsultWithContext = (
    service: LeadServiceType,
    contextNote?: string,
    city?: string,
    source: LeadSource = 'homepage_form'
  ) => {
    setPrefillService(service);
    if (contextNote) setPrefillBrief(contextNote);
    if (city) setPrefillCity(city);
    setPrefillSource(source);
    focusConsultationForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#0D1117]">
      <Navbar
        lang={lang}
        contactPhone={siteSettings.contactPhone}
        onNavigateSection={navigateHomeAndScroll}
      />

      <main className="flex-1">
        {currentProcedureSlug ? (
          <ProcedurePageView
            lang={lang}
            activeSlug={currentProcedureSlug}
            pages={procedurePages}
            siteSettings={siteSettings}
            onSelectSlug={navigateToProcedure}
            onBackHome={() => navigateHomeAndScroll('beranda')}
            onOpenCookiePreferences={() => setCookieBannerForceOpen(true)}
          />
        ) : (
          <>
            <HeroSection
              lang={lang}
              onChangeLang={setLang}
              siteSettings={siteSettings}
              onExplorePackages={() => navigateHomeAndScroll('paket-2027')}
            />

            <ProblemsAndSolutionsSection
              lang={lang}
              onExplorePackages={() => navigateHomeAndScroll('paket-2027')}
            />

            <Packages2027Section lang={lang} siteSettings={siteSettings} />

            <ApproachEeatSection lang={lang} testimonials={testimonials} />

            <FaqClosingSection
              lang={lang}
              siteSettings={siteSettings}
              onOpenWrittenBrief={() => {
                setPrefillSource('homepage_form');
                focusConsultationForm();
              }}
            />

            <BlogSection
              lang={lang}
              posts={blogPosts}
              siteSettings={siteSettings}
              onConsultTopic={(svc, note, city) =>
                handleConsultWithContext(svc, note, city, 'homepage_form')
              }
            />

            <LeadCaptureSection
              lang={lang}
              siteSettings={siteSettings}
              prefillService={prefillService}
              prefillBrief={prefillBrief}
              prefillCity={prefillCity}
              prefillSource={prefillSource}
              nameInputRef={leadNameInputRef}
            />
          </>
        )}
      </main>

      <Footer
        lang={lang}
        onChangeLang={setLang}
        siteSettings={siteSettings}
        onNavigateSection={navigateHomeAndScroll}
        onOpenProcedure={navigateToProcedure}
        onOpenCookiePreferences={() => setCookieBannerForceOpen(true)}
        onOpenCms={() => setCmsOpen(true)}
        onOpenChat={() => setChatOpen(true)}
      />

      <CookieConsentBanner
        lang={lang}
        forceOpen={cookieBannerForceOpen}
        onDismissForceOpen={() => setCookieBannerForceOpen(false)}
        onOpenCookiesPage={() => navigateToProcedure('cookies')}
      />

      <AiChatbotWidget
        lang={lang}
        siteSettings={siteSettings}
        isOpen={chatOpen}
        onToggle={setChatOpen}
        onHandoffToLeadForm={(svc, summary) =>
          handleConsultWithContext(svc, summary, undefined, 'chatbot_handoff')
        }
      />

      {cmsOpen && (
        <Suspense fallback={null}>
          <CmsModal
            lang={lang}
            siteSettings={siteSettings}
            isOpen={cmsOpen}
            onClose={() => setCmsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <KotoBatuahApp />
    </ErrorBoundary>
  );
}
