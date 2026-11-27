import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale } from '../types/domain';
import { KotoLogo } from './KotoLogo';

interface NavbarProps {
  lang: Locale;
  onNavigateSection: (sectionId: string) => void;
  onStartConsultation: () => void;
}

export function Navbar({ lang, onNavigateSection, onStartConsultation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = COPY[lang].nav;

  const navLinks = [
    { id: 'portofolio', label: t.portofolio },
    { id: 'layanan', label: t.layanan },
    { id: 'partner-hosting', label: t.hosting },
    { id: 'testimoni', label: t.testimoni },
    { id: 'seo-geo', label: t.seoGeo },
    { id: 'blog', label: t.blog },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-element brand lockup */}
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('beranda');
          }}
          className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-[#0D1117] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
        >
          <KotoLogo className="w-8 h-8 shrink-0" />
          <span>kotobatuah.com</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label={lang === 'en' ? 'Primary navigation' : 'Navigasi utama'}
          className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-stone-700"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className="py-1 border-b border-transparent hover:border-[#0D1117] hover:text-[#0D1117] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary CTA + Mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onStartConsultation();
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {t.cta}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-stone-300 text-[#0D1117] hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label={lang === 'en' ? 'Mobile navigation' : 'Navigasi mobile'}
          className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className="block px-3 py-3 text-base font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartConsultation();
              }}
              className="w-full px-4 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              {t.cta}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
