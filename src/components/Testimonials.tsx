import React from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section id="reviews" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0c0c0c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-3">
              CLIENT TESTIMONIALS
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal tracking-tight text-balance">
              Words from Behind the Lens.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#99958e] max-w-md font-normal leading-relaxed">
            Every client relationship is rooted in collaboration, relaxed creative direction, and
            timeless deliverables.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-2xl bg-[#141414] border border-white/5 flex flex-col justify-between hover:border-white/15 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-[#d7b98e]/40 mb-6" />
                <p className="text-sm sm:text-base text-[#d4d0ca] leading-relaxed italic font-normal mb-8">
                  "{t.quote}"
                </p>
              </div>

              {/* Attribution (No Pills) */}
              <div className="pt-6 border-t border-white/10">
                <div className="font-semibold text-sm text-[#f5f3ef]">{t.clientName}</div>
                <div className="text-xs text-[#99958e] mt-1 flex items-center gap-2">
                  <span>{t.role}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#ead5b4]">{t.projectType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
