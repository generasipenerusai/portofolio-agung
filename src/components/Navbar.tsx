'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowUpRight, Menu, X, Camera, Palette } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/soundEffects';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, onToggleTheme }) => {
  const { designerProfile, portfolioType } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const maxScrollRef = useRef(1);

  const initials = (designerProfile?.name || 'AS')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Zero-reflow scroll handler + IntersectionObserver for active section spy
  useEffect(() => {
    let rafId: number | null = null;

    const recalcMaxScroll = () => {
      maxScrollRef.current = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
    };

    const updateOnScroll = () => {
      const scrollTop = window.scrollY;
      const nextScrolled = scrollTop > 20;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (progressBarRef.current) {
        const ratio = Math.min(Math.max(scrollTop / maxScrollRef.current, 0), 1);
        progressBarRef.current.style.transform = `scaleX(${ratio.toFixed(3)})`;
      }
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateOnScroll();
      });
    };

    recalcMaxScroll();
    updateOnScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', recalcMaxScroll, { passive: true });

    // Lightweight IntersectionObserver for active section highlight (zero getBoundingClientRect on scroll)
    const sectionIds = ['karya', 'keahlian', 'rekam-jejak', 'kontak'];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', recalcMaxScroll);
      sectionObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const navLinks = [
    { label: 'Karya', href: '#karya' },
    { label: 'Keahlian & Tools', href: '#keahlian' },
    { label: 'Klien & Sertifikasi', href: '#rekam-jejak' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const isAvailable = designerProfile?.availability?.status === 'Available';
  const customSwitcherLabel = designerProfile?.portfolioSwitcherLabel?.trim();
  const defaultSwitcherLabel =
    portfolioType === 'photographer' ? 'Portofolio Desain' : 'Portofolio Foto & Video';
  const effectiveSwitcherLabel = customSwitcherLabel || defaultSwitcherLabel;
  const showSwitcher = !designerProfile?.hidePortfolioSwitcher;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#f8f7f4]/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Identity Brand */}
        <a
          href="#"
          onClick={() => soundFx.playTick()}
          className="group flex items-center gap-3 text-neutral-900 dark:text-neutral-100"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-black flex items-center justify-center text-xs tracking-tight group-hover:bg-lime-400 group-hover:text-neutral-950 transition-colors duration-200">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-tight group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {designerProfile?.name || 'Agung Sabdo Wicaksono'}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
              {designerProfile?.primaryRole || 'Digital & UI/UX Designer'}
            </span>
          </div>
        </a>

        {/* Clean 4-Item Desktop Navigation with Active Section Pill */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-900/90 border border-neutral-300/60 dark:border-neutral-800">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => soundFx.playPop()}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-950 text-white dark:bg-lime-400 dark:text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800/70'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 dark:bg-neutral-950" />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Dual-Portfolio Switcher Badge */}
          {showSwitcher && (
            <Link
              href={portfolioType === 'photographer' ? '/' : '/photographer'}
              onClick={() => soundFx.playPop()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 hover:border-lime-500 dark:hover:border-lime-400 bg-white/80 dark:bg-neutral-900/90 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-all shadow-2xs group"
              title={
                portfolioType === 'photographer'
                  ? 'Beralih ke Portofolio Desain Grafis & UI/UX'
                  : 'Beralih ke Portofolio Fotografi & Videografi'
              }
            >
              {portfolioType === 'photographer' ? (
                <Palette className="w-3.5 h-3.5 text-lime-500" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-lime-500" />
              )}
              <span>{effectiveSwitcherLabel}</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-lime-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}

          {isAvailable && (
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open to Work</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => {
              soundFx.playPop();
              onToggleTheme();
            }}
            aria-label="Ubah Tema Terang/Gelap"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/70 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Direct Recruiter CTA */}
          <a
            href="#kontak"
            onClick={() => soundFx.playPop()}
            className="group hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-neutral-900 text-white dark:bg-lime-400 dark:text-neutral-950 hover:-translate-y-0.5 transition-transform"
          >
            <span>Hubungi Saya</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              soundFx.playPop();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Buka Menu"
            className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Live Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden pointer-events-none">
        <div
          ref={progressBarRef}
          style={{ transform: 'scaleX(0)' }}
          className="h-full w-full origin-left bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-300"
        />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f8f7f4] dark:bg-[#09090b] border-b border-neutral-200 dark:border-neutral-800 px-4 py-5 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    soundFx.playPop();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm font-medium py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-lime-400/15 text-lime-700 dark:text-lime-400 font-bold'
                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-lime-400" />}
                </a>
              );
            })}
          </div>

          {/* Mobile Dual-Portfolio Switcher */}
          {showSwitcher && (
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href={portfolioType === 'photographer' ? '/' : '/photographer'}
                onClick={() => {
                  soundFx.playPop();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-lime-400"
              >
                <div className="flex items-center gap-2">
                  {portfolioType === 'photographer' ? (
                    <Palette className="w-4 h-4 text-lime-500" />
                  ) : (
                    <Camera className="w-4 h-4 text-lime-500" />
                  )}
                  <span>Buka {effectiveSwitcherLabel}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 text-center text-xs font-bold bg-neutral-900 text-white dark:bg-lime-400 dark:text-neutral-950 rounded-lg flex items-center justify-center gap-1.5"
            >
              <span>Hubungi Saya Langsung</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
