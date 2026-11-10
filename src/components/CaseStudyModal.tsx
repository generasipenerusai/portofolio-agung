'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Play,
  Quote,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Project } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { CustomGraphicMockup } from './CustomGraphicMockups';
import { isUiUxSection, isUiUxTitle } from '../utils/designThinking';
import { analyzeProjectLink } from '../utils/linkHelpers';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
}

function parseVideoEmbed(rawUrl?: string): {
  embedUrl: string | null;
  isVerticalReel: boolean;
} {
  if (!rawUrl || !rawUrl.trim()) return { embedUrl: null, isVerticalReel: false };
  const url = rawUrl.trim();

  // Instagram Reel / Post
  const igMatch = url.match(/instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  if (igMatch) {
    const type = igMatch[1].toLowerCase() === 'p' ? 'p' : 'reel';
    return {
      embedUrl: `https://www.instagram.com/${type}/${igMatch[2]}/embed`,
      isVerticalReel: type === 'reel',
    };
  }

  // YouTube Watch / Share / Shorts
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (ytWatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytWatch[1]}`,
      isVerticalReel: false,
    };
  }
  const ytShorts = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i);
  if (ytShorts) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytShorts[1]}`,
      isVerticalReel: true,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && !url.includes('player.vimeo.com')) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isVerticalReel: false,
    };
  }

  // Google Drive video preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i);
  if (driveMatch) {
    return {
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isVerticalReel: false,
    };
  }

  // Already an embed URL or direct video URL
  return { embedUrl: url, isVerticalReel: false };
}

export const CaseStudyModal: React.FC<ModalProps> = ({ project, onClose }) => {
  const { portfolioSections } = usePortfolio();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const validSectionIds = new Set(portfolioSections.map((s) => s.id));
  const primarySectionId = portfolioSections[0]?.id || 'main';
  const resolvedSectionId =
    project.sectionId && validSectionIds.has(project.sectionId)
      ? project.sectionId
      : primarySectionId;
  const parentSection = portfolioSections.find((s) => s.id === resolvedSectionId);
  const isUiUxProject = isUiUxSection(parentSection) || isUiUxTitle(project.category);

  // Smart Link Analysis: Checks projectUrl first, falls back to videoEmbedUrl if it's actually a figma/website link
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

  const { embedUrl, isVerticalReel } = isPureVideo
    ? parseVideoEmbed(project.videoEmbedUrl)
    : { embedUrl: null, isVerticalReel: false };

  const hasNarrative = Boolean(
    project.summary ||
      project.designBrief ||
      project.conceptPhilosophy ||
      (project.creationProcess && project.creationProcess.length > 0)
  );
  const showCoverMockup = Boolean(project.customMockupUrl || !embedUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Clean Editorial Case Study Container */}
      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-[#111114] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Minimal Sticky Top Bar */}
        <div className="px-5 sm:px-7 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#111114]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-md bg-lime-400/15 text-lime-700 dark:text-lime-400 text-xs font-semibold shrink-0">
              {project.category}
            </span>
            {isUiUxProject && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-lime-500/30 bg-lime-500/10 text-[11px] font-mono text-lime-700 dark:text-lime-300 shrink-0">
                <Sparkles className="w-3 h-3" />
                <span>Design Thinking</span>
              </span>
            )}
            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {project.client} · {project.year}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {projectLinkInfo && (
              <a
                href={projectLinkInfo.formattedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 text-neutral-950 text-xs font-bold hover:bg-lime-300 transition-colors shadow-2xs"
              >
                {projectLinkInfo.isFigma ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
                <span>{projectLinkInfo.defaultLabel}</span>
              </a>
            )}

            {isPureVideo && project.videoEmbedUrl && (
              <a
                href={project.videoEmbedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-semibold hover:border-lime-400 transition-colors"
              >
                <Play className="w-3 h-3 fill-current text-lime-400" />
                <span>Tonton Video Asli</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={onClose}
              aria-label="Tutup"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Title & Lead Summary */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-medium">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Primary Cover Showcase */}
          {showCoverMockup && (
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 aspect-[16/9] max-h-[440px] flex items-center justify-center">
              {project.customMockupUrl ? (
                <img
                  src={project.customMockupUrl}
                  alt={project.title}
                  className="w-full h-full object-contain bg-neutral-950"
                />
              ) : (
                <CustomGraphicMockup type={project.mockupType} isHero={true} />
              )}
            </div>
          )}

          {/* Embedded Video / Reel Showcase (if available) */}
          {embedUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                  Pratinjau Video / Motion
                </span>
                <a
                  href={project.videoEmbedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-lime-600 dark:text-lime-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Buka di Tab Baru</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div
                className={`rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black mx-auto ${
                  isVerticalReel ? 'max-w-sm aspect-[9/16]' : 'w-full aspect-video'
                }`}
              >
                <iframe
                  src={embedUrl}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Extra Gallery Images (if uploaded in Admin) */}
          {project.photoGallery && project.photoGallery.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
                Galeri Foto ({project.photoGallery.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.photoGallery.map((img, idx) => (
                  <figure
                    key={idx}
                    className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 flex flex-col"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `${project.title} - ${idx + 1}`}
                      className="w-full max-h-80 object-contain bg-neutral-950"
                    />
                    {img.caption && (
                      <figcaption className="px-3.5 py-2 text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#111114] border-t border-neutral-200 dark:border-neutral-800">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Two-Column Executive Breakdown */}
          <div
            className={`grid grid-cols-1 ${
              hasNarrative ? 'lg:grid-cols-12' : ''
            } gap-8 pt-2`}
          >
            {/* Left Column: Narrative & Workflow (7 cols) */}
            {hasNarrative && (
              <div className="lg:col-span-7 space-y-6">
              {project.summary && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    Ringkasan Proyek
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              )}

              {project.designBrief && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    {isUiUxProject
                      ? 'Empathize & Define · Masalah & Kebutuhan Pengguna'
                      : 'Kebutuhan & Tantangan'}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {project.designBrief}
                  </p>
                </div>
              )}

              {project.conceptPhilosophy && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    {isUiUxProject
                      ? 'Ideate & Prototype · Solusi Arsitektur UI/UX'
                      : 'Solusi & Pendekatan Visual'}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {project.conceptPhilosophy}
                  </p>
                </div>
              )}

              {/* Compact Creation Process Timeline */}
              {project.creationProcess && project.creationProcess.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                    {isUiUxProject ? (
                      <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                    ) : (
                      <Layers className="w-3.5 h-3.5 text-lime-500" />
                    )}
                    <span>
                      {isUiUxProject ? 'Alur Kerja Design Thinking' : 'Tahapan Pengerjaan'}
                    </span>
                  </h3>
                  <div className="space-y-2.5">
                    {project.creationProcess.map((step, idx) => {
                      const showStepTool =
                        step.toolUsed && step.toolUsed.trim() && step.toolUsed.trim() !== 'Alat';
                      const showStepMilestone =
                        step.keyMilestone &&
                        step.keyMilestone.trim() &&
                        step.keyMilestone.trim() !== 'Output terverifikasi';

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 flex gap-3.5"
                        >
                          <span className="text-xs font-mono font-bold text-lime-600 dark:text-lime-400 pt-0.5 shrink-0">
                            {step.stepNumber || `0${idx + 1}`}
                          </span>
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                                {step.title}
                              </h4>
                              {step.duration && (
                                <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            {step.description && (
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {step.description}
                              </p>
                            )}
                            {(showStepTool || showStepMilestone) && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {showStepTool && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                                    <Wrench className="w-2.5 h-2.5 text-neutral-400" />
                                    <span>{step.toolUsed}</span>
                                  </span>
                                )}
                                {showStepMilestone && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-lime-400/15 text-[11px] font-mono font-medium text-lime-700 dark:text-lime-400">
                                    <span>Output: {step.keyMilestone}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Right Column: Recruiter Quick-Scan Sidebar (5 cols or full grid) */}
            <div
              className={
                hasNarrative
                  ? 'lg:col-span-5 space-y-5'
                  : 'grid grid-cols-1 sm:grid-cols-2 gap-5'
              }
            >
              {/* Direct Project Link / Figma Prototype Card */}
              {projectLinkInfo && (
                <div className="p-5 rounded-xl bg-lime-400/10 border border-lime-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-lime-700 dark:text-lime-400 font-bold">
                      {projectLinkInfo.isFigma ? 'Prototype Interaktif' : 'Tautan Proyek'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/20 text-lime-800 dark:text-lime-300 font-bold">
                      {projectLinkInfo.domainName}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {projectLinkInfo.isFigma
                      ? 'Buka prototipe interaktif langsung di Figma untuk melihat interaksi tombol, alur navigasi, dan komponen antarmuka.'
                      : 'Kunjungi demo atau website aktif proyek ini untuk melihat implementasi langsung.'}
                  </p>
                  <a
                    href={projectLinkInfo.formattedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>{projectLinkInfo.defaultLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Role & Responsibilities Card */}
              <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    Peran Saya
                  </span>
                  <div className="text-base font-bold text-neutral-950 dark:text-white mt-0.5">
                    {project.myRole?.title || 'Lead Designer'}
                  </div>
                  {project.myRole?.contributionType && (
                    <span className="inline-block mt-1 text-xs text-lime-700 dark:text-lime-400 font-medium">
                      {project.myRole.contributionType}
                    </span>
                  )}
                </div>

                {project.myRole?.responsibilities &&
                  project.myRole.responsibilities.filter(Boolean).length > 0 && (
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Tanggung Jawab
                      </span>
                      <ul className="space-y-1.5">
                        {project.myRole.responsibilities.filter(Boolean).map((resp, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-lime-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Software Used */}
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    Software yang Digunakan
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.toolsUsed.map((tool, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${tool.colorBg} ${tool.colorText}`}
                        >
                          {tool.code}
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {project.deliverables && project.deliverables.filter(Boolean).length > 0 && (
                <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    Hasil Akhir (Deliverables)
                  </span>
                  <ul className="space-y-1.5">
                    {project.deliverables.filter(Boolean).map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compact Color Swatches */}
              {project.colorPalette && project.colorPalette.length > 0 && (
                <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Palet Warna
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Klik untuk salin HEX
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.colorPalette.map((color, idx) => {
                      const isCopied = copiedHex === color.hex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(color.hex);
                              setCopiedHex(color.hex);
                              setTimeout(() => setCopiedHex(null), 1600);
                            }
                          }}
                          title={`Salin ${color.hex}`}
                          className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-lime-500/60 dark:hover:border-lime-400/50 transition-colors cursor-pointer text-left"
                        >
                          <span
                            style={{ backgroundColor: color.hex }}
                            className="w-4 h-4 rounded-full border border-black/10 dark:border-white/15 shrink-0"
                          />
                          <div className="leading-tight">
                            {color.name && (
                              <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 block">
                                {color.name}
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block">
                              {isCopied ? 'Tersalin!' : color.hex}
                            </span>
                          </div>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-lime-500 shrink-0" />
                          ) : (
                            <Copy className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Testimonial if attached to project */}
          {project.testimonial && project.testimonial.quote && (
            <div className="p-5 rounded-xl bg-lime-500/5 border border-lime-500/20 flex items-start gap-3">
              {project.testimonial.avatarUrl ? (
                <img
                  src={project.testimonial.avatarUrl}
                  alt={project.testimonial.author}
                  className="w-10 h-10 rounded-full object-cover border border-lime-500/30 shrink-0 mt-0.5"
                />
              ) : (
                <Quote className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </p>
                <div className="text-xs text-neutral-500">
                  <strong className="text-neutral-900 dark:text-white">
                    {project.testimonial.author}
                  </strong>{' '}
                  — {project.testimonial.role}, {project.testimonial.organization}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
