import React, { useState } from 'react';
import { Eye, ArrowUpRight, Camera } from 'lucide-react';
import { PortfolioItem, Category } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
  onSelectItem: (item: PortfolioItem, index: number) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ items, onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Portrait', 'Brand', 'Product', 'Event'];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="portfolio" className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0e0e0e] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d7b98e] mb-3">
              SELECTED WORK
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f5f3ef] font-normal tracking-tight text-balance">
              The Portfolio
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#99958e] max-w-md font-normal leading-relaxed">
            A curated collection of portraits, products, and authentic moments captured with a keen
            focus on character, atmosphere, and clean composition.
          </p>
        </div>

        {/* Category Filters (Clean Segmented Controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#161616] border border-white/10 rounded-xl w-fit mb-10 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#d7b98e] text-[#111111] font-semibold shadow-md'
                  : 'text-[#bdb9b2] hover:text-[#f5f3ef] hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? 'All Works' : cat}
            </button>
          ))}
        </div>

        {/* Portfolio Bento Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl p-8">
            <Camera className="w-8 h-8 text-[#99958e] mx-auto mb-3 opacity-60" />
            <p className="text-sm text-[#99958e]">No photographs found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
            {filteredItems.map((item, index) => {
              // Asymmetric bento grid styling
              const isCol7 = index % 4 === 0 || index % 4 === 3;
              const colSpan = isCol7 ? 'lg:col-span-7' : 'lg:col-span-5';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item, index)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#181818] border border-white/10 cursor-pointer min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-[#d7b98e]/50 ${colSpan}`}
                >
                  {/* Photo Layer with Zoom */}
                  <img
                    src={item.src}
                    alt={`${item.title} — ${item.category.toLowerCase()} photography session by Small King Photography`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Right Quick Action */}
                  <div className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#f5f3ef] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Eye className="w-4 h-4 text-[#ead5b4]" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10">
                    {/* Unboxed Metadata (Zero Pill Rule) */}
                    <div className="flex items-center gap-2 text-xs text-[#ead5b4] tracking-[0.18em] uppercase font-medium mb-1.5">
                      <span>{item.category}</span>
                      {item.year && (
                        <>
                          <span className="text-white/30">·</span>
                          <span className="tabular-nums text-[#bdb9b2]">{item.year}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl text-[#f5f3ef] font-normal leading-tight group-hover:text-[#ead5b4] transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2 text-xs sm:text-sm text-[#bdb9b2] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
