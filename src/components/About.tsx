import React from 'react';
import { AboutData } from '../types';

interface AboutProps {
  data: AboutData;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  // Render headline with italicized highlight for text surrounded by *asterisks*
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

  const paragraphs = data.text ? data.text.split(/\n\s*\n/).filter(Boolean) : [];

  return (
    <section id="about" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#090909]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photo Column */}
          {data.image && (
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border border-white/10 aspect-[4/5] shadow-2xl">
                <img
                  src={data.image}
                  alt="Aliyu Idris — Principal photographer in studio holding professional camera"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-xs text-[#99958e] tracking-wider uppercase">
                  <span>Small King Photography Studio</span>
                  <span className="mx-2">·</span>
                  <span className="text-[#ead5b4]">Behind The Lens</span>
                </div>
              </div>
            </div>
          )}

          {/* Text Content Column */}
          <div className={`${data.image ? 'lg:col-span-7' : 'lg:col-span-12'} order-1 lg:order-2`}>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-3">
              ABOUT SMALL KING PHOTOGRAPHY
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal leading-tight tracking-tight mb-8 text-balance">
              {renderEmphasizedTitle(data.title)}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#bdb9b2] font-normal leading-relaxed mb-8 max-w-2xl">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Signature */}
            {data.signature && (
              <div className="mb-10 font-display text-xl sm:text-2xl text-[#ead5b4] italic font-medium">
                {data.signature}
              </div>
            )}

            {/* Quantitative Rigor Stats Row */}
            {data.stats && data.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {data.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="font-display text-2xl sm:text-3xl font-medium text-[#f5f3ef] tabular-nums mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#99958e] tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
