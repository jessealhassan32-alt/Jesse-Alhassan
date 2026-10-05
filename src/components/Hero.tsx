import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { HeroData } from '../types';

interface HeroProps {
  data: HeroData;
  onOpenBooking: () => void;
  onOpenEditor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onOpenBooking, onOpenEditor }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = data.images && data.images.length > 0 ? data.images : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 px-5 sm:px-8"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-[#090909]">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '1200ms',
            }}
          >
            <img
              src={src}
              alt={`Small King Photography — ${
                index === 0
                  ? 'Cinematic luxury portrait session'
                  : index === 1
                  ? 'High-fashion editorial portraiture'
                  : 'Commercial brand campaign visuals'
              }`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
              onError={(e) => {
                // Graceful fallback to rich dark aesthetic background
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ))}

        {/* Cinematic Scrims ensuring high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/70 to-[#090909]/40" />
        <div className="absolute inset-0 bg-radial-[ellipse_80%_80%_at_50%_40%] from-transparent via-[#090909]/40 to-[#090909]/95" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center sm:text-left mt-6 sm:mt-0">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#d7b98e]">
          <span>PHOTOGRAPHY</span>
          <span className="text-white/30">·</span>
          <span>PORTRAITS</span>
          <span className="text-white/30">·</span>
          <span>VISUAL STORIES</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-display text-4xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[#f5f3ef] mb-6 max-w-4xl text-balance">
          {data.line1}
          {data.line2 && (
            <span className="block italic text-[#ead5b4] font-normal mt-1 sm:mt-2">
              {data.line2}
            </span>
          )}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-lg text-[#c1bdb6] max-w-xl font-normal leading-relaxed mb-8 sm:mb-10 text-balance">
          {data.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 justify-center sm:justify-start">
          <a
            href="#portfolio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all hover:-translate-y-0.5 shadow-xl shadow-[#d7b98e]/15"
          >
            <span>Explore Portfolio</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-xs font-medium tracking-[0.16em] uppercase border border-white/20 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] transition-all hover:-translate-y-0.5"
          >
            <span>Book a Shoot</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Metadata & Controls */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#99958e]">
          <div className="flex items-center gap-3">
            <span className="tracking-[0.18em] uppercase text-[11px] text-[#bdb9b2]">
              © {new Date().getFullYear()} Smallking Photography_001
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[11px] text-[#d6aa4f] font-medium tracking-wider uppercase">
              World wide
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Slide Indicators */}
            {images.length > 1 && (
              <div className="flex items-center gap-1.5" aria-label="Slideshow indicators">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-6 bg-[#d7b98e]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Quick edit drawer trigger */}
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#99958e] hover:text-[#d7b98e] transition-colors ml-2"
              title="Edit homepage and portfolio content"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize Site</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
