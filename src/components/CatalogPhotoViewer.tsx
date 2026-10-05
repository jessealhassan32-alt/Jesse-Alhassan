import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogPhotoViewerProps {
  photos: string[];
  currentIndex: number;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const CatalogPhotoViewer: React.FC<CatalogPhotoViewerProps> = ({
  photos,
  currentIndex,
  itemName,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    // Minimum swipe distance of 45px
    if (diff > 45) {
      // Swiped right -> go to previous
      onNavigate((currentIndex - 1 + photos.length) % photos.length);
    } else if (diff < -45) {
      // Swiped left -> go to next
      onNavigate((currentIndex + 1) % photos.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#060504]/96 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen photo viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 w-full max-w-5xl mx-auto py-2">
        <div className="text-xs text-[#a69f8c] font-medium truncate max-w-[70%]">
          <span className="text-[#d6aa4f]">{itemName}</span>
          <span className="mx-2 text-white/20">·</span>
          <span>Photo {currentIndex + 1} of {photos.length}</span>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa4f]"
          aria-label="Close viewer"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Stage */}
      <div className="relative flex-1 flex items-center justify-center my-2 min-h-0">
        {photos.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
            className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-all hover:scale-105"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="max-w-4xl max-h-full flex items-center justify-center p-1 select-none">
          <img
            src={currentPhoto}
            alt={`${itemName} photo ${currentIndex + 1}`}
            className="max-h-[76vh] w-auto max-w-full object-contain rounded-md shadow-2xl transition-transform duration-300"
          />
        </div>

        {photos.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-all hover:scale-105"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Counter & Nav */}
      <div className="w-full max-w-md mx-auto py-2 flex items-center justify-center gap-6 text-xs text-[#a69f8c]">
        {photos.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
            className="px-3 py-1 rounded border border-white/10 hover:border-[#d6aa4f] hover:text-[#f3eee3] transition-colors"
          >
            Previous
          </button>
        )}
        <span className="font-mono tabular-nums text-[#d6aa4f]">
          {currentIndex + 1} / {photos.length}
        </span>
        {photos.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            className="px-3 py-1 rounded border border-white/10 hover:border-[#d6aa4f] hover:text-[#f3eee3] transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
