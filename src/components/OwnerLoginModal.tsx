import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, KeyRound } from 'lucide-react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string) => void;
}

// Configured default PIN for Smallking Photography_001
export const OWNER_PIN = '0001';

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === OWNER_PIN) {
      onSuccess();
      onShowToast('Owner mode activated');
      onClose();
    } else {
      setError(true);
      onShowToast('Incorrect PIN. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Owner PIN Login"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#16140f] border border-[#d6aa4f]/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#a69f8c] hover:text-[#f3eee3] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#d6aa4f]/15 border border-[#d6aa4f]/30 flex items-center justify-center mx-auto mb-4 text-[#d6aa4f]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="font-display text-xl text-[#f3eee3] font-medium text-center mb-1">
          Owner Verification
        </h3>
        <p className="text-xs text-[#a69f8c] text-center mb-6 leading-relaxed">
          Enter your 4-digit PIN to enable photo uploads and catalog editing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (Default: 0001)"
              className={`w-full px-4 py-3 rounded-lg bg-[#0c0b09] border text-center font-mono text-lg tracking-[0.3em] text-[#f3eee3] focus:outline-none transition-colors ${
                error ? 'border-red-500' : 'border-[#2f2a1e] focus:border-[#d6aa4f]'
              }`}
            />
            {error && (
              <p className="text-red-400 text-[11px] text-center mt-1.5">
                Incorrect PIN. Default PIN is <span className="font-bold">0001</span>.
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#2f2a1e] text-xs uppercase tracking-wider text-[#a69f8c] hover:text-[#f3eee3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#d6aa4f] text-[#1c1506] text-xs font-semibold uppercase tracking-wider hover:bg-[#e4bb60] transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
