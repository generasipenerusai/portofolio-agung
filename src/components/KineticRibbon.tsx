'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const KineticRibbon: React.FC = () => {
  const { designerProfile } = usePortfolio();

  const defaultItems = [
    'DIGITAL DESIGN',
    'UI/UX INTERFACE',
    'BRAND IDENTITY',
    'MOTION GRAPHICS',
    'FOTOGRAFI',
    'VIDEOGRAFI',
  ];

  // If runningText was explicitly saved by user in Admin:
  // - Empty array [] hides the ribbon completely
  // - Non-empty array renders exact user-defined items
  // - Undefined falls back to subRoles (or defaultItems)
  const rawItems = Array.isArray(designerProfile.runningText)
    ? designerProfile.runningText
    : designerProfile.subRoles && designerProfile.subRoles.length > 0
      ? designerProfile.subRoles
      : defaultItems;

  const cleanedItems = rawItems.map((r) => r.trim().toUpperCase()).filter(Boolean);

  if (cleanedItems.length === 0) {
    return null;
  }

  // Repeat inside each half if few items exist so wide monitors never show a gap
  let singleHalf = [...cleanedItems];
  while (singleHalf.length < 8) {
    singleHalf = [...singleHalf, ...cleanedItems];
  }

  return (
    <div
      aria-label="Disiplin Kreatif Utama"
      className="relative z-20 border-y-2 border-neutral-900 dark:border-lime-400/35 bg-neutral-950 dark:bg-[#0f130d] text-white overflow-hidden py-3.5 select-none"
    >
      {/* Subtle edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-neutral-950 dark:from-[#0f130d] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-neutral-950 dark:from-[#0f130d] to-transparent z-10" />

      <div className="animate-marquee flex items-center">
        {[0, 1].map((halfIdx) => (
          <div key={halfIdx} className="flex shrink-0 items-center">
            {singleHalf.map((item, idx) => (
              <div key={`${halfIdx}-${idx}`} className="flex items-center gap-6 px-3">
                <span className="text-xs sm:text-[13px] font-mono font-semibold tracking-[0.14em] text-neutral-200 hover:text-lime-400 transition-colors whitespace-nowrap">
                  {item}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-lime-400/80 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
