import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Calendar, User, Eye } from 'lucide-react';
import { PortfolioItem } from '../types';

interface LightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505]/96 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto py-2">
        <div className="flex items-center gap-3 text-xs text-[#99958e]">
          <span className="font-medium text-[#ead5b4] uppercase tracking-wider">
            {currentItem.category}
          </span>
          <span className="text-white/20">·</span>
          <span className="tabular-nums">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.year && (
            <>
              <span className="text-white/20">·</span>
              <span className="tabular-nums">{currentItem.year}</span>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#d7b98e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b98e]"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-3 min-h-0">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
            className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#d7b98e] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b98e]"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Central Media Container */}
        <div className="max-w-5xl max-h-full flex items-center justify-center p-2">
          <img
            src={currentItem.src}
            alt={`${currentItem.title} — High-resolution ${currentItem.category.toLowerCase()} photography by Small King Photography`}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % items.length)}
            className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#d7b98e] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b98e]"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Editorial Caption & Metadata */}
      <div className="max-w-4xl mx-auto w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-[#f5f3ef] font-medium mb-1">
            {currentItem.title}
          </h2>
          {currentItem.description && (
            <p className="text-xs sm:text-sm text-[#bdb9b2] max-w-xl font-normal leading-relaxed">
              {currentItem.description}
            </p>
          )}
        </div>

        {/* EXIF Data / Client details */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#99958e]">
          {currentItem.client && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#d7b98e]" />
              <span>{currentItem.client}</span>
            </div>
          )}

          {currentItem.exif && (
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <Camera className="w-3.5 h-3.5 text-[#d7b98e]" />
              <span className="font-mono tabular-nums">
                {[currentItem.exif.camera, currentItem.exif.lens, currentItem.exif.aperture, currentItem.exif.shutter]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
