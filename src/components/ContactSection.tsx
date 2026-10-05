import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Copy, Check, ArrowUpRight, Send, MessageCircle } from 'lucide-react';
import { ContactData } from '../types';

interface ContactSectionProps {
  data: ContactData;
  onOpenBooking: () => void;
  onShowToast: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  data,
  onOpenBooking,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    shootType: 'Portrait',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    if (!data.email) return;
    navigator.clipboard.writeText(data.email).then(
      () => {
        setCopied(true);
        onShowToast('Email address copied to clipboard');
        setTimeout(() => setCopied(false), 2500);
      },
      () => {
        onShowToast('Could not copy email');
      }
    );
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    // Build mailto fallback
    const subject = encodeURIComponent(`Shoot Inquiry: ${formState.shootType} - ${formState.name}`);
    const body = encodeURIComponent(
      `Hello Small King Photography,\n\nMy name is ${formState.name}.\nEmail: ${formState.email}\nShoot Type: ${formState.shootType}\n\nVision & Details:\n${formState.message}\n\nLooking forward to hearing from you!`
    );

    setSubmitted(true);
    onShowToast('Inquiry recorded! Opening email client...');

    setTimeout(() => {
      window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  // Render title with emphasis
  const renderEmphasizedTitle = (text: string) => {
    const parts = text.split(/\*([^*]+)\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <em key={i} className="text-[#ead5b4] not-italic font-display italic">
          {part}
        </em>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const instagramHandle = data.instagram ? data.instagram.replace(/^@/, '') : '';

  return (
    <section id="contact" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#090909]">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-[#141210] via-[#0e0e0e] to-[#121212] border border-white/10 relative overflow-hidden">
          {/* Subtle radial warmth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d7b98e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Direct Links & Phone */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-4">
                  GET IN TOUCH
                </div>

                <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal leading-tight tracking-tight mb-6 text-balance">
                  {renderEmphasizedTitle(data.title)}
                </h2>

                <p className="text-sm sm:text-base text-[#99958e] leading-relaxed mb-8 max-w-lg font-normal">
                  Ready to book your portrait, brand campaign, or special event? Reach out directly
                  or schedule a shoot consultation with Small King Photography.
                </p>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                {data.email && (
                  <>
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] transition-all"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#d7b98e]" />
                      )}
                      <span>{data.email}</span>
                    </button>

                    <a
                      href={`mailto:${data.email}?subject=Photography%20Booking%20Inquiry`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all"
                    >
                      <span>Write Email</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}

                {data.phone && (
                  <>
                    <a
                      href={data.whatsappCatalog || 'https://wa.me/c/2349016226828'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#25D366]/15 border border-[#25D366]/40 text-[#55f28f] hover:bg-[#25D366]/25 transition-all shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp Catalog</span>
                      <ArrowUpRight className="w-3 h-3 text-[#55f28f]" />
                    </a>

                    <a
                      href={`https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=Hello%20Small%20King%20Photography,%20I%20am%20interested%20in%20booking%20a%20shoot.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-[#f5f3ef] hover:border-[#25D366] hover:text-[#55f28f] transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${data.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#d7b98e]" />
                      <span>{data.phone}</span>
                    </a>
                  </>
                )}

                {instagramHandle && (
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#d7b98e]" />
                    <span>@{instagramHandle}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#99958e]" />
                  </a>
                )}

                {data.location && (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border border-white/10 text-[#99958e]">
                    <MapPin className="w-3.5 h-3.5 text-[#d7b98e]" />
                    <span>{data.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Direct Quick Message Form */}
            <div className="lg:col-span-6 bg-[#161616] p-8 sm:p-10 rounded-2xl border border-white/10">
              <h3 className="font-display text-2xl text-[#f5f3ef] font-medium mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-[#99958e] mb-6">
                Tell us about your upcoming project or shoot requirements.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#111111] border border-[#d7b98e]/40 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#d7b98e]/20 text-[#d7b98e] flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-lg text-[#f5f3ef] font-medium mb-1">
                    Thank You for Reaching Out
                  </h4>
                  <p className="text-xs text-[#99958e] leading-relaxed mb-4">
                    Your message has been initiated. If your mail client did not open automatically,
                    you can email us directly at {data.email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#d7b98e] hover:text-[#ead5b4]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1.5 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Aliyu"
                        className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1.5 font-medium">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1.5 font-medium">
                      Session Type
                    </label>
                    <select
                      value={formState.shootType}
                      onChange={(e) => setFormState({ ...formState, shootType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] transition-colors"
                    >
                      <option value="Portrait">Editorial & Portrait Session</option>
                      <option value="Brand">Commercial Brand Visuals</option>
                      <option value="Product">Product & E-Commerce Photography</option>
                      <option value="Event">Weddings & Celebration Event</option>
                      <option value="Other">Custom Commercial Production</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1.5 font-medium">
                      Project Vision / Date / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Share details about location, dates, or visual mood..."
                      className="w-full px-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] placeholder-[#555] focus:outline-none focus:border-[#d7b98e] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all"
                    >
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="text-xs text-[#bdb9b2] hover:text-[#d7b98e] transition-colors underline underline-offset-4"
                    >
                      Or open detailed booking form
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
