import { useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { COPY } from '../i18n/translations';
import type { Locale } from '../types/domain';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { KotoLogo } from './KotoLogo';

interface NavbarProps {
  lang: Locale;
  contactPhone: string;
  onNavigateSection: (sectionId: string) => void;
}

export function Navbar({ lang, contactPhone, onNavigateSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = COPY[lang].nav;
  const waHref = buildWhatsAppUrl(contactPhone, COPY[lang].hero.primaryWaMessage);

  const navLinks = [
    { id: 'masalah-solusi', label: t.masalahSolusi },
    { id: 'paket-2027', label: t.paket },
    { id: 'pendekatan', label: t.pendekatan },
    { id: 'faq', label: t.faq },
    { id: 'blog', label: t.blog },
    { id: 'konsultasi', label: t.konsultasi },
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

        {/* Zone 3: Direct WhatsApp CTA + Mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.cta}</span>
          </a>

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
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.cta}</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
