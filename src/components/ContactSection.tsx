'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  Download,
  ArrowUpRight,
  MessageCircle,
  MapPin,
  FileText,
  Globe,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BackgroundMotif } from './BackgroundMotif';
import { ScrollReveal } from './InteractivePrimitives';
import { soundFx } from '../utils/soundEffects';

export const ContactSection: React.FC = () => {
  const { designerProfile } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [localTime, setLocalTime] = useState<string>('');

  // Safe client-only live WIB clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setLocalTime(`${formatted} WIB`);
      } catch {
        setLocalTime('WIB (GMT+7)');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  const personalEmail = designerProfile.email || 'agung.sabdo.w@gmail.com';
  const personalPhone = designerProfile.phone || '+62 851-5687-7792';
  const waCleanNumber = personalPhone.replace(/[^0-9]/g, '');

  const hasExternalCv =
    designerProfile.portfolioPdfUrl &&
    designerProfile.portfolioPdfUrl !== '#kontak' &&
    designerProfile.portfolioPdfUrl.trim() !== '';

  const isAvailable = designerProfile?.availability?.status === 'Available';

  const handleCopyEmail = () => {
    soundFx.playPop();
    navigator.clipboard.writeText(personalEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    soundFx.playPop();
    navigator.clipboard.writeText(personalPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section
      id="kontak"
      className="relative py-16 md:py-24 border-t-2 border-neutral-300/90 dark:border-neutral-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] bg-[#f6f5f0] dark:bg-[#08090d] overflow-hidden scroll-mt-20"
    >
      <BackgroundMotif variant="blueprint" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clean Symmetrical Section Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-semibold block">
              Kontak Langsung
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              Tertarik Bekerja Sama?
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Terbuka untuk peluang kerja full-time, kontrak, maupun proyek freelance desain digital & visual.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#11141c] border border-neutral-200/90 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse" />
              {isAvailable ? 'Available' : designerProfile?.availability?.status || 'Aktif'}
            </span>
            {localTime && (
              <>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="font-mono text-neutral-500 dark:text-neutral-400">
                  {localTime}
                </span>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Unified Architectural Contact Panel (Strict Grid Alignment) */}
        <ScrollReveal
          delay={50}
          className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800"
        >
          {/* Row 1: Primary Direct Channels (50% | 50% Split) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
            {/* Left Column: WhatsApp Pribadi */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-xs font-semibold text-lime-600 dark:text-lime-400 block">
                    Respon Tercepat
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    WhatsApp Pribadi
                  </h3>
                  <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 pt-0.5">
                    {personalPhone}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-lime-400/15 border border-lime-500/25 text-lime-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={`https://wa.me/${waCleanNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playPop()}
                  className="group flex-1 h-11 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Chat via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <button
                  onClick={handleCopyPhone}
                  title="Salin Nomor WhatsApp"
                  className={`h-11 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    copiedPhone
                      ? 'border-lime-500/50 bg-lime-400/15 text-lime-700 dark:text-lime-400'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-4 h-4 text-lime-500" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Email Pribadi */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
                    Korespondensi Resmi & HRD
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    Email Pribadi
                  </h3>
                  <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 pt-0.5 truncate">
                    {personalEmail}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={`mailto:${personalEmail}?subject=Peluang%20Kerja%20/%20Proyek%20Desain%20—%20Agung%20Sabdo`}
                  onClick={() => soundFx.playPop()}
                  className="group flex-1 h-11 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity"
                >
                  <span>Kirim Email</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <button
                  onClick={handleCopyEmail}
                  title="Salin Alamat Email"
                  className={`h-11 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    copiedEmail
                      ? 'border-lime-500/50 bg-lime-400/15 text-lime-700 dark:text-lime-400'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-lime-500" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Domicile & Curriculum Vitae (Aligned on Exact Same 50% | 50% Center Axis) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 bg-neutral-50/70 dark:bg-[#0d1017]">
            {/* Domicile Cell */}
            <div className="px-6 py-5 sm:px-8 flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#171b26] border border-neutral-200 dark:border-neutral-800 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Domisili
                </div>
                <p className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                  {designerProfile.studioAddress || 'Pamulang, Tangerang Selatan, Banten'}
                </p>
              </div>
            </div>

            {/* Curriculum Vitae Cell */}
            <div className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#171b26] border border-neutral-200 dark:border-neutral-800 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Dokumen Resmi
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    Curriculum Vitae & Portofolio PDF
                  </div>
                </div>
              </div>

              {hasExternalCv ? (
                <a
                  href={designerProfile.portfolioPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playPop()}
                  className="group px-4 py-2.5 rounded-xl bg-white dark:bg-[#171b26] border border-neutral-200 dark:border-neutral-700/80 hover:border-lime-400 text-xs font-bold text-neutral-900 dark:text-white inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-lime-500" />
                  <span>Unduh CV (PDF)</span>
                </a>
              ) : (
                <a
                  href={`https://wa.me/${waCleanNumber}?text=Halo%20Agung,%20boleh%20minta%20dokumen%20CV%20terbaru%20Anda?`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playPop()}
                  className="group px-4 py-2.5 rounded-xl bg-white dark:bg-[#171b26] border border-neutral-200 dark:border-neutral-700/80 hover:border-lime-400 text-xs font-bold text-neutral-900 dark:text-white inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <span>Minta CV via WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-lime-400 transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Row 3: Full-Width Balanced Social Network Bar */}
          {designerProfile.socials && designerProfile.socials.length > 0 && (
            <div className="px-6 py-4 sm:px-8 bg-neutral-100/60 dark:bg-[#0a0c12] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 shrink-0">
                <Globe className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Jejaring & Sosial Media</span>
              </div>

              <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2">
                {designerProfile.socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundFx.playPop()}
                    className="group px-3 py-1.5 rounded-lg bg-white dark:bg-[#141822] border border-neutral-200/90 dark:border-neutral-800 hover:border-lime-400/60 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-lime-300 inline-flex items-center justify-between sm:justify-center gap-1.5 transition-colors"
                  >
                    <span className="truncate">{s.platform}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 shrink-0 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};
