'use client';

import React from 'react';

const MARQUEE_ITEMS = [
  'BRAND ARCHITECTURE',
  'TACTILE PACKAGING',
  'CUSTOM TYPEFACES',
  'EDITORIAL MONOGRAPHS',
  'SCREENPRINTED POSTERS',
  'PANTONE SOLID COATED',
  'SWISS GRID SYSTEMS',
  'HOT FOIL STAMPING',
  'BLIND DEBOSSING',
  'ART DIRECTION',
];

export const Marquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 text-neutral-100 py-3.5 border-y border-neutral-800 select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 text-xs sm:text-sm font-mono tracking-widest font-bold">
            <span className="text-lime-400">✦</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
