'use client';

import React from 'react';
import { ArrowDown, MessageCircle, FileText, MapPin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BackgroundMotif } from './BackgroundMotif';
import { SpotlightTiltCard, ScrollReveal, AnimatedCounter } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';

export const Hero: React.FC = () => {
  const { designerProfile } = usePortfolio();

  const personalPhone = designerProfile.phone || '+62 851-5687-7792';
  const waCleanNumber = personalPhone.replace(/[^0-9]/g, '');
  const hasExternalCv =
    designerProfile.portfolioPdfUrl &&
    designerProfile.portfolioPdfUrl !== '#kontak' &&
    designerProfile.portfolioPdfUrl.trim() !== '';

  const cleanLocation = (designerProfile.location || 'Tangerang Selatan, Indonesia')
    .split('·')[0]
    .trim();

  const primaryBio =
    designerProfile.bioParagraphs?.[0] ||
    'Desainer visual & digital dengan fokus pada perancangan identitas brand, UI/UX antarmuka web, motion graphics, dan konten kreatif berdampak tinggi.';

  const coreRoles = (designerProfile.subRoles || []).slice(0, 6);

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#f8f7f4] dark:bg-[#08080b]">
      <BackgroundMotif variant="blueprint" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Portrait Column (Clean, Dignified, Aligned Frame) */}
          <ScrollReveal direction="scale" className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative w-64 sm:w-72 lg:w-full max-w-[300px] group/stage">
              <SpotlightTiltCard
                tiltIntensity={4}
                onMouseEnter={() => soundFx.playTick()}
                className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-gradient-to-b from-neutral-200/80 via-neutral-100 to-neutral-200 dark:from-neutral-800/80 dark:via-neutral-900 dark:to-neutral-950 shadow-xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.6),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_28%,rgba(163,230,53,0.14),transparent_70%)] pointer-events-none" />

                <div className="relative aspect-[4/5] w-full flex items-end justify-center overflow-hidden">
                  <img
                    src={designerProfile.photoUrl || '/images/agung-sabdo.png'}
                    alt={designerProfile.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/agung-sabdo.png';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover/stage:scale-[1.03]"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/92 border border-white/15 text-white shadow-md">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="truncate">{cleanLocation}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-lime-400 shrink-0 ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                      {designerProfile.availability?.status || 'Available'}
                    </span>
                  </div>
                </div>
              </SpotlightTiltCard>
            </div>
          </ScrollReveal>

          {/* Executive Bio & Actions Column */}
          <ScrollReveal delay={50} className="lg:col-span-8 space-y-5 text-center lg:text-left">
            {/* Role Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300/80 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400" />
              <span>{designerProfile.primaryRole}</span>
            </div>

            {/* Name & Value Headline */}
            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.06]">
                {designerProfile.name}
              </h1>
              <p className="text-sm sm:text-base font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto lg:mx-0">
                {designerProfile.headline}
              </p>
            </div>

            {/* Single Crisp Bio Paragraph */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {primaryBio}
            </p>

            {/* Core Skills Pills */}
            {coreRoles.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {coreRoles.map((role, idx) => (
                  <a
                    key={idx}
                    href="#keahlian"
                    onClick={() => soundFx.playTick()}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-lime-500/60 dark:hover:border-lime-400/50 dark:hover:text-lime-300 transition-colors"
                  >
                    {role}
                  </a>
                ))}
              </div>
            )}

            {/* Harmonious Recruiter Action Buttons (Single Lime Accent + Clean Neutral Secondary) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#karya"
                onClick={() => soundFx.playPop()}
                className="group relative overflow-hidden h-11 px-5 rounded-xl bg-neutral-950 text-white dark:bg-lime-400 dark:text-neutral-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform duration-200 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="cta-shimmer pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <span className="relative z-10">Lihat Karya Pilihan</span>
                <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href={`https://wa.me/${waCleanNumber}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playPop()}
                className="h-11 px-5 rounded-xl bg-white dark:bg-neutral-900 hover:border-lime-500/60 dark:hover:border-lime-400/60 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Chat WhatsApp</span>
              </a>

              <a
                href={hasExternalCv ? designerProfile.portfolioPdfUrl : '#kontak'}
                target={hasExternalCv ? '_blank' : undefined}
                rel={hasExternalCv ? 'noreferrer' : undefined}
                onClick={() => soundFx.playPop()}
                className="h-11 px-5 rounded-xl bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 font-medium text-xs sm:text-sm inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span>{hasExternalCv ? 'Unduh CV (PDF)' : 'Info Kontak & CV'}</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Uniform-Height Highlights Bar */}
        {designerProfile.statistics && designerProfile.statistics.length > 0 && (
          <ScrollReveal delay={80} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
            {designerProfile.statistics.map((stat, idx) => (
              <div
                key={idx}
                className="h-full px-5 py-4 rounded-xl bg-white dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-800 hover:border-lime-500/50 dark:hover:border-lime-400/45 transition-colors flex flex-col justify-center"
              >
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                  <AnimatedCounter value={stat.number} />
                </div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-0.5 truncate">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            ))}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
