import React from 'react';
import { Camera, ArrowUp, Instagram, Mail, Phone, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { ContactData } from '../types';

interface FooterProps {
  contact: ContactData;
  onOpenBooking: () => void;
  onOpenEditor: () => void;
  onOpenOwnerLogin?: () => void;
  isOwner?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  contact,
  onOpenBooking,
  onOpenEditor,
  onOpenOwnerLogin,
  isOwner,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const instagramHandle = contact.instagram ? contact.instagram.replace(/^@/, '') : '';

  return (
    <footer className="bg-[#060606] border-t border-white/10 pt-16 pb-12 px-5 sm:px-8 text-[#99958e]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#d6aa4f]/50 flex items-center justify-center text-[#d6aa4f] font-display font-semibold text-xs tracking-wider">
                SK
              </div>
              <div className="leading-tight">
                <span className="font-semibold tracking-[0.22em] text-sm text-[#f5f3ef] uppercase block">
                  SK Small King
                </span>
                <span className="text-[9px] tracking-[0.32em] text-[#d6aa4f] uppercase block font-medium -mt-0.5">
                  World wide
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#bdb9b2] max-w-sm leading-relaxed mb-6 font-normal">
              Smallking Photography_001 — High-end editorial portraits, luxury product stills, and timeless documentary event
              coverage. Guided, relaxed, and focused on honest imagery.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={onOpenEditor}
                className="inline-flex items-center gap-1.5 text-xs text-[#99958e] hover:text-[#d6aa4f] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Site Customizer</span>
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d6aa4f] mb-4">
              Navigation
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#portfolio" className="hover:text-[#f5f3ef] transition-colors">
                  Portfolio Works
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#f5f3ef] transition-colors">
                  Creative Services
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#f5f3ef] transition-colors">
                  Shoot Catalog
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#f5f3ef] transition-colors">
                  About Aliyu Idris
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#f5f3ef] transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#f5f3ef] transition-colors">
                  Book a Shoot
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d6aa4f] mb-4">
              Direct Contact
            </div>
            <ul className="space-y-3 text-xs">
              {contact.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#d6aa4f]" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#f5f3ef] transition-colors truncate"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <>
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#d6aa4f]" />
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="hover:text-[#f5f3ef] transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <a
                      href={contact.whatsappCatalog || 'https://wa.me/c/2349016226828'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#55f28f] transition-colors"
                    >
                      WhatsApp Catalog
                    </a>
                  </li>
                </>
              )}
              {instagramHandle && (
                <li className="flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-[#d6aa4f]" />
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#f5f3ef] transition-colors"
                  >
                    @{instagramHandle}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-xs text-[#a69f8c]">
                Looking for something else?{' '}
                <a
                  href="https://wa.me/2349016226828?text=Hello%20Smallking%20Photography_001,%20I%20have%20a%20custom%20shoot%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d6aa4f] font-semibold hover:underline"
                >
                  Message Smallking Photography_001
                </a>
              </p>
              <div>
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#d6aa4f] text-[#111111] hover:bg-[#e4bb60] transition-all"
                >
                  Inquire for Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {currentYear} Smallking Photography_001. All rights reserved. Directed by Aliyu Idris.
          </div>

          <div className="flex items-center gap-4">
            {onOpenOwnerLogin && (
              <button
                onClick={onOpenOwnerLogin}
                className="text-[11px] text-[#a69f8c] hover:text-[#d6aa4f] transition-colors underline underline-offset-4"
              >
                {isOwner ? 'Owner Mode Active (PIN: 0001)' : 'Owner login'}
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-[#99958e] hover:text-[#d6aa4f] transition-colors"
              aria-label="Scroll to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
