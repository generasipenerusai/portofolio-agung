'use client';

import React from 'react';
import { BadgeCheck, Building2, ExternalLink, Quote } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BackgroundMotif } from './BackgroundMotif';
import { ScrollReveal } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';

export const ExhibitionsAwards: React.FC = () => {
  const { awardsData, clientRoster, testimonials } = usePortfolio();

  const hasClients = clientRoster && clientRoster.length > 0;
  const hasCertifications = awardsData && awardsData.length > 0;
  const hasTestimonials = testimonials && testimonials.length > 0;

  if (!hasClients && !hasCertifications && !hasTestimonials) {
    return null;
  }

  return (
    <section
      id="rekam-jejak"
      className="relative py-16 md:py-24 border-t-2 border-neutral-300/90 dark:border-neutral-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] bg-[#edeae2] dark:bg-[#14161e] overflow-hidden scroll-mt-20"
    >
      <BackgroundMotif variant="dots" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <ScrollReveal className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-semibold block">
            Kredibilitas & Kompetensi
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
            Klien & Sertifikasi
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Institusi dan brand yang pernah berkolaborasi, beserta sertifikasi kompetensi profesional.
          </p>
        </ScrollReveal>

        {/* 1. Real Clients & Collaborators */}
        {hasClients && (
          <ScrollReveal delay={40} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Klien, Brand & Institusi</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {clientRoster.map((client, idx) => (
                <div
                  key={idx}
                  className="group min-h-[84px] p-4 rounded-xl bg-white dark:bg-[#1b1e28] border border-neutral-200 dark:border-neutral-700/80 hover:border-lime-500/50 dark:hover:border-lime-400/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors leading-snug">
                      {client.name}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 group-hover:text-lime-500 transition-colors shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 truncate">
                    {client.category} · {client.city}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* 2. Certifications — Full-Width Vertical Stack */}
        {hasCertifications && (
          <ScrollReveal delay={70} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Sertifikasi & Lisensi Keahlian</span>
            </h3>

            <div className="w-full rounded-2xl bg-white dark:bg-[#1b1e28] border border-neutral-200 dark:border-neutral-700/80 divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-2xs">
              {awardsData.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative py-4 sm:py-5 px-5 sm:px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 hover:bg-neutral-50/90 dark:hover:bg-[#222634] transition-colors duration-200"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-lime-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center"
                  />

                  <div className="min-w-0 flex items-start gap-3.5 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-500/20 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0 group-hover:bg-lime-400 group-hover:text-neutral-950 transition-colors">
                      <BadgeCheck className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
                          {item.award}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-lime-400/15 text-lime-700 dark:text-lime-400 font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                          {item.institution}
                        </span>
                        {item.project ? ` — ${item.project}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 pl-11 sm:pl-0">
                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => soundFx.playPop()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-lime-700 dark:text-lime-400 hover:bg-lime-400 hover:text-neutral-950 hover:border-lime-400 transition-colors"
                      >
                        <span>Lihat Sertifikat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                      {item.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* 3. Testimonials with Consistent Section Subheading */}
        {hasTestimonials && (
          <ScrollReveal delay={90} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-2">
              <Quote className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Ulasan & Rekomendasi Kolaborator</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="group h-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1b1e28] border border-neutral-200 dark:border-neutral-700/80 hover:border-lime-500/45 dark:hover:border-lime-400/45 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="pt-3.5 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-3">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.client}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 shadow-2xs"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-lime-400/20 text-lime-700 dark:text-lime-400 font-bold flex items-center justify-center text-xs shrink-0 border border-lime-400/30">
                        {t.client ? t.client.slice(0, 2).toUpperCase() : 'CL'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {t.client}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {t.role}{t.company ? `, ${t.company}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
