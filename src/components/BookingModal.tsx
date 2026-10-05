import React, { useState, useEffect } from 'react';
import { X, Calendar, Mail, Phone, MapPin, Check, Copy, ArrowUpRight, Sparkles } from 'lucide-react';
import { PricingPackage, BookingInquiry } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: PricingPackage | null;
  packages: PricingPackage[];
  contactEmail: string;
  onShowToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  packages,
  contactEmail,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shootType: 'Portrait Session',
    preferredDate: '',
    location: '',
    packageId: selectedPackage ? selectedPackage.id : '',
    visionNotes: '',
  });

  const [submittedInquiry, setSubmittedInquiry] = useState<BookingInquiry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({
        ...prev,
        packageId: selectedPackage.id,
        shootType: selectedPackage.name,
      }));
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (!isOpen) {
      setSubmittedInquiry(null);
      setCopied(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const refId = `SKP-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const inquiry: BookingInquiry = {
      id: refId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      shootType: formData.shootType,
      preferredDate: formData.preferredDate,
      location: formData.location,
      visionNotes: formData.visionNotes,
      packageId: formData.packageId,
      createdAt: new Date().toISOString(),
    };

    setSubmittedInquiry(inquiry);
    onShowToast(`Booking inquiry ${refId} created!`);
  };

  const getInquirySummaryText = (inquiry: BookingInquiry) => {
    const pkg = packages.find((p) => p.id === inquiry.packageId);
    return `Small King Photography — Booking Inquiry [${inquiry.id}]
Client: ${inquiry.fullName}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not provided'}
Service / Package: ${pkg ? `${pkg.name} (${pkg.price})` : inquiry.shootType}
Preferred Date: ${inquiry.preferredDate || 'Flexible'}
Location: ${inquiry.location || 'Studio / TBD'}
Vision Notes:
${inquiry.visionNotes || 'Standard session requirements'}`;
  };

  const handleCopySummary = () => {
    if (!submittedInquiry) return;
    const text = getInquirySummaryText(submittedInquiry);
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        onShowToast('Booking summary copied to clipboard');
        setTimeout(() => setCopied(false), 2500);
      },
      () => onShowToast('Failed to copy summary')
    );
  };

  const handleSendEmail = () => {
    if (!submittedInquiry) return;
    const summary = getInquirySummaryText(submittedInquiry);
    const subject = encodeURIComponent(
      `Booking Inquiry [${submittedInquiry.id}]: ${submittedInquiry.fullName} - ${submittedInquiry.shootType}`
    );
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Book a Photography Session"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#d7b98e] transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedInquiry ? (
          /* Confirmation Screen */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#d7b98e]/20 border border-[#d7b98e]/40 text-[#d7b98e] flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>

            <div className="text-xs uppercase tracking-[0.24em] text-[#d7b98e] font-semibold mb-2">
              Inquiry Ref: {submittedInquiry.id}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#f5f3ef] font-medium mb-3">
              We Look Forward to Framing Your Story
            </h3>

            <p className="text-xs sm:text-sm text-[#bdb9b2] leading-relaxed max-w-md mx-auto mb-8 font-normal">
              Your shoot request has been generated. To guarantee immediate delivery to Aliyu Idris at
              Small King Photography, select your preferred action below:
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={handleSendEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all shadow-lg"
              >
                <span>Email Aliyu Directly</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-medium tracking-wider uppercase border border-white/20 text-[#f5f3ef] hover:border-[#d7b98e] transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Summary Copied' : 'Copy Shoot Details'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#99958e]">
              <span>Or connect instantly:</span>
              <a
                href="https://wa.me/2349016226828"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#55f28f] hover:underline font-medium"
              >
                Chat on WhatsApp
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://wa.me/c/2349016226828"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ead5b4] hover:underline font-medium"
              >
                View WhatsApp Catalog
              </a>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-2">
              RESERVE A DATE
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-[#f5f3ef] font-normal tracking-tight mb-2">
              Book a Photography Shoot
            </h2>

            <p className="text-xs sm:text-sm text-[#99958e] leading-relaxed mb-6 font-normal">
              Share details regarding your shoot requirements. We will review availability and confirm your session.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aliyu Idris"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Session Package
                  </label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => {
                      const sel = packages.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        packageId: e.target.value,
                        shootType: sel ? sel.name : formData.shootType,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  >
                    <option value="">Custom / Not Listed</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Target Shoot Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Abuja Studio or On Location"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Shoot Vision & Creative Direction
                </label>
                <textarea
                  rows={3}
                  value={formData.visionNotes}
                  onChange={(e) => setFormData({ ...formData, visionNotes: e.target.value })}
                  placeholder="Tell us what mood, outfits, products or moments you want captured..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#99958e] hover:text-[#f5f3ef] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all shadow-lg"
                >
                  <span>Submit Shoot Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
