import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { PricingPackage } from '../types';

interface PackagesProps {
  packages: PricingPackage[];
  onSelectPackage: (pkg: PricingPackage) => void;
}

export const Packages: React.FC<PackagesProps> = ({ packages, onSelectPackage }) => {
  return (
    <section id="packages" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0c0c0c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-3">
              INVESTMENT & PACKAGES
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal tracking-tight text-balance">
              Transparent Session Rates.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#99958e] max-w-md font-normal leading-relaxed">
            Every session is treated with high craftsmanship, precision lighting, and tailored color
            grading. No hidden post-production fees.
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.recommended
                  ? 'bg-[#151515] border-2 border-[#d7b98e] shadow-2xl shadow-[#d7b98e]/5'
                  : 'bg-[#121212] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Optional editorial recommendation marker (clean text, no garish pill) */}
              {pkg.recommended && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#d7b98e] text-[#111111] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-2xl text-[#f5f3ef] font-semibold mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#99958e] leading-relaxed min-h-[32px]">
                      {pkg.subtitle}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-6 py-6 border-y border-white/10 flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-medium text-[#f5f3ef] tabular-nums tracking-tight">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-[#99958e] uppercase tracking-wider font-medium">
                    / session
                  </span>
                </div>

                {/* Duration & Turnaround details */}
                <div className="flex items-center gap-4 text-xs text-[#bdb9b2] mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d7b98e]" />
                    <span>{pkg.duration}</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span>Turnaround: {pkg.turnaround}</span>
                </div>

                {/* Deliverables List */}
                <ul className="space-y-3 mb-8">
                  {pkg.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#c1bdb6]">
                      <Check className="w-4 h-4 text-[#d7b98e] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPackage(pkg)}
                className={`w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  pkg.recommended
                    ? 'bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] shadow-lg shadow-[#d7b98e]/10'
                    : 'border border-white/20 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4]'
                }`}
              >
                Select Package
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
