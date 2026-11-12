'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { designerProfile, portfolioType } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const otherPortfolioHref = portfolioType === 'photographer' ? '/' : '/photographer';
  const otherPortfolioLabel =
    portfolioType === 'photographer' ? '🎨 Portofolio Desain Grafis & UI/UX' : '📷 Portofolio Fotografi & Videografi';

  return (
    <footer className="relative z-10 py-8 border-t-2 border-neutral-300 dark:border-neutral-800 bg-[#e2dfd7] dark:bg-[#050507] text-xs text-neutral-600 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="font-semibold text-neutral-900 dark:text-neutral-200">
            {designerProfile.name}
          </span>{' '}
          · © 2026
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {!designerProfile?.hidePortfolioSwitcher && (
            <Link
              href={otherPortfolioHref}
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-lime-400 font-mono transition-colors"
            >
              <span>{otherPortfolioLabel}</span>
            </Link>
          )}

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
