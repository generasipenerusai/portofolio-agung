'use client';

import React from 'react';
import { ArrowUpRight, ExternalLink, Images, Play, Sparkles } from 'lucide-react';
import { Project } from '../types/portfolio';
import { CustomGraphicMockup } from './CustomGraphicMockups';
import { SpotlightTiltCard, ScrollReveal } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';
import { analyzeProjectLink } from '../utils/linkHelpers';
import { usePortfolio } from '../context/PortfolioContext';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
  variant?: 'default' | 'gallery';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onSelect,
  variant = 'default',
}) => {
  const { applicationsList } = usePortfolio();
  const galleryCount = project.photoGallery?.length || 0;
  const quickTags =
    project.deliverables && project.deliverables.length > 0
      ? project.deliverables.slice(0, 2)
      : (project.tags || []).slice(0, 2);

  // Smart Link Analysis: Checks projectUrl first, falls back to videoEmbedUrl if it's figma/website
  const projectLinkInfo =
    analyzeProjectLink(project.projectUrl, project.projectUrlLabel) ||
    (project.videoEmbedUrl &&
    !['youtube.com', 'youtu.be', 'vimeo.com', 'instagram.com/reel', 'tiktok.com'].some((h) =>
      project.videoEmbedUrl?.toLowerCase().includes(h)
    )
      ? analyzeProjectLink(project.videoEmbedUrl, project.projectUrlLabel)
      : null);

  const isPureVideo = Boolean(
    project.videoEmbedUrl &&
      (!projectLinkInfo || project.videoEmbedUrl !== projectLinkInfo.rawUrl)
  );

  if (variant === 'gallery') {
    return (
      <ScrollReveal delay={(index % 3) * 50} className="h-full">
        <SpotlightTiltCard
          tiltIntensity={3}
          onClick={() => {
            soundFx.playPop();
            onSelect(project);
          }}
          className="group cursor-pointer h-full bg-white dark:bg-[#191c25] border border-neutral-200/90 dark:border-neutral-700/80 rounded-2xl hover:border-neutral-400 dark:hover:border-lime-400/50 shadow-xs hover:shadow-xl transition-colors duration-200"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
            {project.customMockupUrl ? (
              <img
                src={project.customMockupUrl}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out">
                <CustomGraphicMockup type={project.mockupType} />
              </div>
            )}

            {/* Hover Vignette + Slide-Up Quick Action Strip */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
              <span className="px-2.5 py-1 rounded-md bg-lime-400 text-neutral-950 text-[11px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Lihat Detail Karya</span>
              </span>
            </div>

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 text-white text-[11px] font-medium border border-white/10">
                {project.category}
              </span>

              <div className="flex items-center gap-1.5">
                {projectLinkInfo && (
                  <a
                    href={projectLinkInfo.formattedUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playPop();
                    }}
                    title={projectLinkInfo.defaultLabel}
                    className="pointer-events-auto px-2 py-0.5 rounded-md bg-lime-400 text-neutral-950 text-[10px] font-bold hover:bg-lime-300 flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                  >
                    {projectLinkInfo.isFigma ? (
                      <Sparkles className="w-2.5 h-2.5" />
                    ) : (
                      <ExternalLink className="w-2.5 h-2.5" />
                    )}
                    <span>{projectLinkInfo.isFigma ? 'Prototype' : 'Demo'}</span>
                  </a>
                )}
                {isPureVideo && (
                  <span className="px-2 py-1 rounded-md bg-neutral-950/90 text-lime-400 text-[11px] font-medium border border-white/10 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Video</span>
                  </span>
                )}
                {galleryCount > 0 && (
                  <span className="px-2 py-1 rounded-md bg-neutral-950/90 text-white text-[11px] font-medium border border-white/10 flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    <span>+{galleryCount}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{project.client || 'Karya Personal'}</span>
                <span className="shrink-0 ml-2 font-mono">{project.year}</span>
              </div>

              <div className="flex items-start justify-between gap-2.5">
                <h3 className="text-base font-bold tracking-tight text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug">
                  {project.title}
                </h3>
                <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0 text-neutral-500 group-hover:bg-lime-400 group-hover:text-neutral-950 transition-colors duration-200">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {project.summary && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              )}
            </div>
          </div>
        </SpotlightTiltCard>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal delay={(index % 2) * 60} className="h-full">
      <SpotlightTiltCard
        tiltIntensity={3}
        onClick={() => {
          soundFx.playPop();
          onSelect(project);
        }}
        className="group cursor-pointer h-full bg-white dark:bg-[#191c25] border border-neutral-200/90 dark:border-neutral-700/80 rounded-2xl hover:border-neutral-400 dark:hover:border-lime-400/50 shadow-xs hover:shadow-xl transition-colors duration-200"
      >
        {/* Visual Cover (Large 16:10 Ratio — Visuals Speak First) */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
          {project.customMockupUrl ? (
            <img
              src={project.customMockupUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out">
              <CustomGraphicMockup type={project.mockupType} />
            </div>
          )}

          {/* Clean Top Overlay Badges (Solid High-Contrast, Zero Backdrop Blur Lag) */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 text-white text-[11px] font-medium border border-white/10">
              {project.category}
            </span>

            <div className="flex items-center gap-1.5">
              {projectLinkInfo && (
                <a
                  href={projectLinkInfo.formattedUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playPop();
                  }}
                  title={projectLinkInfo.defaultLabel}
                  className="pointer-events-auto px-2.5 py-1 rounded-md bg-lime-400 text-neutral-950 text-[11px] font-bold hover:bg-lime-300 flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                >
                  {projectLinkInfo.isFigma ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  <span>{projectLinkInfo.isFigma ? 'Prototype' : 'Live Demo'}</span>
                </a>
              )}
              {isPureVideo && (
                <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 text-lime-400 text-[11px] font-medium border border-white/10 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Video</span>
                </span>
              )}
              {galleryCount > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 text-white text-[11px] font-medium border border-white/10 flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  <span>+{galleryCount} Foto</span>
                </span>
              )}
              {project.featured && (
                <span className="px-2.5 py-1 rounded-md bg-lime-400 text-neutral-950 text-[11px] font-bold">
                  Unggulan
                </span>
              )}
            </div>
          </div>

          {/* Interactive Hover Vignette & Deliverable Preview Strip */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {quickTags.length > 0 ? (
                quickTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-neutral-950/92 border border-white/15 text-[11px] font-medium text-neutral-100 truncate max-w-[170px]"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-neutral-950/92 border border-white/15 text-[11px] font-medium text-neutral-100">
                  Klik untuk Studi Kasus Lengkap
                </span>
              )}
            </div>

            {project.impactMetrics?.[0] && (
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-lime-400 text-neutral-950 text-[11px] font-bold shrink-0">
                {project.impactMetrics[0].value} {project.impactMetrics[0].label}
              </span>
            )}
          </div>
        </div>

        {/* Concise Recruiter-Friendly Card Details */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="truncate">{project.client || 'Karya Personal'}</span>
              <span className="shrink-0 ml-2 font-mono">{project.year}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug">
                {project.title}
              </h3>
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0 text-neutral-500 group-hover:bg-lime-400 group-hover:text-neutral-950 transition-colors duration-200">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {project.summary && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {project.summary}
              </p>
            )}
          </div>

          {/* Footer: My Role + Link + Software Icons */}
          <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">
                Peran
              </span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                {project.myRole?.title || 'Lead Designer'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {projectLinkInfo && (
                <a
                  href={projectLinkInfo.formattedUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playPop();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-850 hover:bg-lime-400 hover:text-black dark:hover:bg-lime-400 dark:hover:text-black text-[11px] font-mono font-medium text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>{projectLinkInfo.isFigma ? 'Prototype' : 'Live'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {project.toolsUsed.slice(0, 4).map((tool, idx) => {
                    const matchedApp = applicationsList?.find(
                      (a) =>
                        a.name.toLowerCase() === tool.name.toLowerCase() ||
                        a.shortCode.toLowerCase() === tool.code?.toLowerCase()
                    );
                    const iconUrl = tool.iconUrl || matchedApp?.iconUrl;

                    return iconUrl ? (
                      <div
                        key={idx}
                        title={`${tool.name}${tool.purpose ? ` — ${tool.purpose}` : ''}`}
                        className="w-6 h-6 rounded-md p-1 bg-neutral-900 border border-neutral-700/60 dark:border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs hover:border-lime-400/80 transition-colors"
                      >
                        <img
                          src={iconUrl}
                          alt={tool.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <span
                        key={idx}
                        title={`${tool.name}${tool.purpose ? ` — ${tool.purpose}` : ''}`}
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${tool.colorBg} ${tool.colorText} border border-current/15`}
                      >
                        {tool.code}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </SpotlightTiltCard>
    </ScrollReveal>
  );
};
