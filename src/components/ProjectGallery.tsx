'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { PortfolioSection, Project } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCard } from './ProjectCard';
import { BackgroundMotif } from './BackgroundMotif';
import { ScrollReveal } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';

interface GalleryProps {
  onSelectProject: (project: Project) => void;
}

const FALLBACK_SECTIONS: PortfolioSection[] = [
  {
    id: 'main',
    eyebrow: 'Portofolio Utama',
    title: 'Karya Desain & Studi Kasus',
    subtitle: 'Klik pada karya untuk melihat detail kontribusi, proses pengerjaan, dan hasil akhir.',
    layout: 'grid-2',
  },
];

export const ProjectGallery: React.FC<GalleryProps> = ({ onSelectProject }) => {
  const { projectsData, portfolioSections } = usePortfolio();
  const [activeCategories, setActiveCategories] = useState<Record<string, string>>({});

  const sectionsToRender =
    portfolioSections && portfolioSections.length > 0 ? portfolioSections : FALLBACK_SECTIONS;

  const validSectionIds = new Set(sectionsToRender.map((s) => s.id));
  const primarySectionId = sectionsToRender[0].id;

  const getProjectsForSection = (sectionId: string): Project[] => {
    return projectsData.filter((p) => {
      const targetId = p.sectionId && validSectionIds.has(p.sectionId) ? p.sectionId : primarySectionId;
      return targetId === sectionId;
    });
  };

  return (
    <div id="karya">
      {/* Optional Quick Section Jump Bar when multiple portfolio sections exist */}
      {sectionsToRender.length > 1 && (
        <div className="border-b border-neutral-300/90 dark:border-neutral-800 bg-[#e4e1d8] dark:bg-[#0d0f14]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 shrink-0 mr-1">
              <Layers className="w-3.5 h-3.5 text-lime-500" />
              <span>Section Karya:</span>
            </span>
            {sectionsToRender.map((sec) => {
              const count = getProjectsForSection(sec.id).length;
              return (
                <a
                  key={sec.id}
                  href={`#section-${sec.id}`}
                  onClick={() => soundFx.playPop()}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#161922] border border-neutral-300 dark:border-neutral-700 hover:border-lime-500 dark:hover:border-lime-400/70 hover:-translate-y-0.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all whitespace-nowrap shrink-0 shadow-2xs"
                >
                  {sec.title}
                  <span className="ml-1.5 text-[11px] font-mono text-lime-600 dark:text-lime-400">
                    ({count})
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {sectionsToRender.map((section, sectionIdx) => {
        const sectionProjects = getProjectsForSection(section.id);
        const activeCategory = activeCategories[section.id] || 'All';

        const uniqueCategories = Array.from(
          new Set(sectionProjects.map((p) => p.category).filter(Boolean))
        );

        const filteredProjects =
          activeCategory === 'All'
            ? sectionProjects
            : sectionProjects.filter((p) => p.category === activeCategory);

        const isGalleryLayout = section.layout === 'gallery-3';
        const isEven = sectionIdx % 2 === 0;

        return (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`relative py-16 md:py-24 ${
              sectionIdx > 0 ? 'border-t-2 border-neutral-300/90 dark:border-neutral-800' : ''
            } shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] scroll-mt-20 overflow-hidden ${
              isEven
                ? 'bg-[#eceae3] dark:bg-[#13151c]'
                : 'bg-[#f6f5f0] dark:bg-[#0a0c11]'
            }`}
          >
            <BackgroundMotif variant={isEven ? 'dots' : 'grid'} />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              {/* Manual Section Header + Per-Section Category Filter Pills */}
              <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  {section.eyebrow && (
                    <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-semibold block">
                      {section.eyebrow}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {section.subtitle}
                    </p>
                  )}
                </div>

                {/* Category Filter Pills (shown only if >= 2 distinct categories exist in this section) */}
                {uniqueCategories.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setActiveCategories((prev) => ({ ...prev, [section.id]: 'All' }));
                      }}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeCategory === 'All'
                          ? 'bg-neutral-950 text-white dark:bg-lime-400 dark:text-neutral-950 font-bold shadow-sm'
                          : 'bg-white/80 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300/70 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                      }`}
                    >
                      Semua
                      <span className="ml-1.5 opacity-70 text-[11px] font-mono">
                        ({sectionProjects.length})
                      </span>
                    </button>

                    {uniqueCategories.map((cat) => {
                      const count = sectionProjects.filter((p) => p.category === cat).length;
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            soundFx.playPop();
                            setActiveCategories((prev) => ({ ...prev, [section.id]: cat }));
                          }}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-neutral-950 text-white dark:bg-lime-400 dark:text-neutral-950 font-bold shadow-sm'
                              : 'bg-white/80 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300/70 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                          }`}
                        >
                          {cat}
                          <span className="ml-1.5 opacity-70 text-[11px] font-mono">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollReveal>

              {/* Section Karya Grid */}
              {filteredProjects.length > 0 ? (
                <div
                  key={`${section.id}-${activeCategory}`}
                  className={
                    isGalleryLayout
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
                      : 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'
                  }
                >
                  {filteredProjects.map((project, idx) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={idx}
                      variant={isGalleryLayout ? 'gallery' : 'default'}
                      onSelect={onSelectProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 px-6 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                  Belum ada karya pada section &ldquo;{section.title}&rdquo;.
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
