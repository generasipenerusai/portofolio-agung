'use client';

import React, { useState } from 'react';
import { ChevronDown, Layers, Cpu } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BackgroundMotif } from './BackgroundMotif';
import { ScrollReveal } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';

export const ServicesSkills: React.FC = () => {
  const { servicesData, applicationsList } = usePortfolio();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  return (
    <section
      id="keahlian"
      className="relative py-16 md:py-24 border-t-2 border-neutral-300/90 dark:border-neutral-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] bg-[#e9eee6] dark:bg-[#0c110e] overflow-hidden scroll-mt-20"
    >
      <BackgroundMotif variant="diagonal" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <ScrollReveal className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-semibold block">
            Kompetensi Utama
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
            Bidang Keahlian & Perangkat Kerja
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Cakupan pengerjaan desain dan perangkat lunak produksi sehari-hari.
          </p>
        </ScrollReveal>

        {/* 1. Core Capabilities / Services */}
        {servicesData && servicesData.length > 0 && (
          <ScrollReveal delay={40} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Cakupan Bidang Keahlian</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {servicesData.map((service) => {
                const cleanTagline = service.tagline?.trim() || '';
                const cleanDescription = service.description?.trim() || '';
                const hasTagline = cleanTagline.length > 0;
                const hasDescription = cleanDescription.length > 0;
                const hasDetails = hasTagline || hasDescription;
                const isExpanded = hasDetails && expandedService === service.number;

                const deliverablesList = Array.isArray(service.deliverables)
                  ? service.deliverables
                  : typeof service.deliverables === 'string' && (service.deliverables as string).trim()
                  ? (service.deliverables as string).split(',').map((s) => s.trim()).filter(Boolean)
                  : [];

                return (
                  <div
                    key={service.number}
                    onClick={() => {
                      if (!hasDetails) return;
                      soundFx.playPop();
                      setExpandedService((prev) =>
                        prev === service.number ? null : service.number
                      );
                    }}
                    className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141a17] border flex flex-col gap-3.5 transition-all duration-200 ${
                      hasDetails ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      isExpanded
                        ? 'border-lime-500 dark:border-lime-400/70 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-lime-400/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded transition-colors ${
                              isExpanded
                                ? 'bg-lime-400 text-neutral-950'
                                : 'bg-lime-400/15 text-lime-700 dark:text-lime-400'
                            }`}
                          >
                            {service.number}
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white leading-snug">
                              {service.title}
                            </h3>
                            {isExpanded && hasTagline && (
                              <span className="text-xs font-medium text-lime-700 dark:text-lime-400 block mt-0.5">
                                {cleanTagline}
                              </span>
                            )}
                          </div>
                        </div>

                        {hasDetails && (
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                              isExpanded
                                ? 'bg-lime-400 text-neutral-950 rotate-180'
                                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      {hasDescription && (
                        <p
                          className={`text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {cleanDescription}
                        </p>
                      )}
                    </div>

                    {deliverablesList.length > 0 && (
                      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
                        {deliverablesList.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
                          >
                            <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {/* 2. Software & Tools Stack — Clean, Uniform Flat Grid */}
        {applicationsList && applicationsList.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Software & Tools Sehari-hari</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {applicationsList.map((tool, idx) => {
                const toolColor = tool.color || {
                  bg: 'bg-lime-400/10',
                  text: 'text-lime-400',
                  border: 'border-lime-400/30',
                  badge: 'bg-lime-400 text-black',
                };
                const shortCode = tool.shortCode || (tool.name ? tool.name.slice(0, 2).toUpperCase() : 'FX');
                const yearsOrLevel = tool.yearsUsed || (tool as any).level || `${(tool as any).proficiency || 95}%`;

                return (
                  <div
                    key={tool.id || idx}
                    className="h-[68px] px-3.5 rounded-xl bg-white dark:bg-[#141a17] border border-neutral-200 dark:border-neutral-800 flex items-center gap-3"
                  >
                    {tool.iconUrl && !brokenIcons[tool.id || idx] ? (
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
                        <img
                          src={tool.iconUrl}
                          alt={tool.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={() => setBrokenIcons((prev) => ({ ...prev, [tool.id || idx]: true }))}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-lg ${toolColor.bg} ${toolColor.text} flex items-center justify-center font-black text-sm shrink-0`}
                      >
                        {shortCode}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        {tool.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {tool.category} · {yearsOrLevel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
