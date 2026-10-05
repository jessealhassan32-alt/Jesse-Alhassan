import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenEditor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenEditor }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'portfolio', 'services', 'catalog', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#portfolio', id: 'portfolio' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Catalog', href: '#catalog', id: 'catalog' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090909]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#090909]/80 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa4f] rounded-md"
          >
            <div className="w-9 h-9 rounded-full border border-[#d6aa4f]/50 flex items-center justify-center text-[#d6aa4f] group-hover:border-[#d6aa4f] transition-colors font-display font-semibold text-xs tracking-wider">
              SK
            </div>
            <div className="leading-tight">
              <span className="block font-semibold tracking-[0.22em] text-sm text-[#f5f3ef] uppercase">
                SK Small King
              </span>
              <span className="block text-[9px] tracking-[0.32em] text-[#d6aa4f] uppercase -mt-0.5 font-medium">
                World wide
              </span>
            </div>
          </a>

          {/* Zone 2: Clean 4–6 text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.16em]">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  activeSection === link.id
                    ? 'text-[#ead5b4]'
                    : 'text-[#bdb9b2] hover:text-[#f5f3ef]'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#d7b98e] rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#d7b98e]/10"
            >
              <span>Book a Shoot</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#f5f3ef] hover:text-[#d7b98e] transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#090909]/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-8 pt-20 pb-12 transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-display font-medium text-[#f5f3ef] hover:text-[#d7b98e] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111]"
              >
                Book a Shoot
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEditor();
                }}
                className="w-full py-2.5 rounded-full text-xs tracking-wider text-[#99958e] border border-white/10"
              >
                Manage Site Content
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
