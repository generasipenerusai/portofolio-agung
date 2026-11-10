'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/soundEffects';

const TOOL_CATEGORIES = [
  'Semua Aplikasi',
  'Vektor & Brand',
  '3D & Motion',
  'Fotografi',
  'Videografi & Color',
  'Editorial & Layout',
  'Raster & Tekstur',
  'Huruf & Font',
];

export const ApplicationsSection: React.FC = () => {
  const { applicationsList } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('Semua Aplikasi');
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  const filteredTools =
    activeCategory === 'Semua Aplikasi'
      ? applicationsList
      : applicationsList.filter((tool) => tool.category === activeCategory);

  return (
    <section id="aplikasi" className="py-20 md:py-24 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-950/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                ARSENAL APLIKASI & SOFTWARE PRODUKSI
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Aplikasi yang Digunakan
            </h2>
          </div>

          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 max-w-md">
            Perangkat lunak berstandar industri grafis internasional untuk mengeksekusi karya dari tahap sketsa kasar hingga file master siap cetak (*pre-press artwork*).
          </p>
        </div>

        {/* Category Pills: Horizontal scrollable with clean padding */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playTick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-200/60 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid: Responsive on all viewports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((tool) => {
            return (
              <div
                key={tool.id}
                className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-lime-400/60 dark:hover:border-lime-400/50 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badge Strip: ShortCode Icon or Real Image + Experience Level */}
                  <div className="flex items-center justify-between">
                    {tool.iconUrl && !brokenIcons[tool.id] ? (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                        <img
                          src={tool.iconUrl}
                          alt={tool.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={() => setBrokenIcons((prev) => ({ ...prev, [tool.id]: true }))}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl tracking-tight shadow-md shrink-0 ${tool.color.badge}`}
                      >
                        {tool.shortCode}
                      </div>
                    )}

                    <div className="text-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-bold inline-block">
                        {tool.yearsUsed}
                      </span>
                      <span className="text-[9px] font-mono text-lime-600 dark:text-lime-400 font-semibold block mt-1">
                        {tool.experienceLevel}
                      </span>
                    </div>
                  </div>

                  {/* App Name & Category */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-lime-500 transition-colors">
                      {tool.name}
                    </h3>
                    <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {tool.category}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                {/* Key use cases summary preview */}
                <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    KAPABILITAS UTAMA:
                  </div>
                  {tool.keyUseCases.map((uc, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0 mt-1.5" />
                      <span className="line-clamp-1">{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
