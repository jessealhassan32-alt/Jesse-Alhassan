import React from 'react';
import { User, Box, Camera, Sparkles, Heart, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  onBookService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onBookService }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'user':
        return <User className="w-6 h-6 text-[#d7b98e]" />;
      case 'box':
        return <Box className="w-6 h-6 text-[#d7b98e]" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-[#d7b98e]" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-[#d7b98e]" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-[#d7b98e]" />;
      default:
        return <Camera className="w-6 h-6 text-[#d7b98e]" />;
    }
  };

  return (
    <section id="services" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#090909]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-3">
              WHAT WE DO
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal tracking-tight text-balance">
              Photography with purpose.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#99958e] max-w-md font-normal leading-relaxed">
            Whether it is one powerful portrait or an entire visual campaign, every frame is created
            to communicate authenticity, distinction, and enduring value.
          </p>
        </div>

        {/* 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 border-t border-white/10 pt-12">
          {services.map((service, index) => (
            <article
              key={service.id || index}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#121212] border border-white/5 hover:border-white/15 transition-all duration-300 group"
            >
              <div>
                {/* Clean Editorial Index */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-xl sm:text-2xl text-[#d7b98e] font-light tabular-nums">
                    0{index + 1}.
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-[#f5f3ef] font-medium mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-[#bdb9b2] leading-relaxed mb-6 font-normal">
                  {service.text}
                </p>

                {/* Deliverables / Inclusions */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <ul className="space-y-2 mb-6 pt-4 border-t border-white/5">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-[#99958e]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d7b98e] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                {service.timeline && (
                  <span className="text-xs text-[#99958e] tracking-wide font-normal">
                    {service.timeline}
                  </span>
                )}
                <button
                  onClick={() => onBookService(service.title)}
                  className="text-xs font-semibold uppercase tracking-wider text-[#d7b98e] hover:text-[#ead5b4] transition-colors ml-auto"
                >
                  Book Session →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
