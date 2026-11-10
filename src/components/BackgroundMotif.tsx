'use client';

import React from 'react';

interface SectionMotifProps {
  variant?: 'blueprint' | 'dots' | 'grid' | 'diagonal';
}

/**
 * Ultra-Lightweight Section-Attached CSS Motif
 * Uses GPU-cached tiny CSS background tiles (zero SVG DOM nodes, zero scroll paint overhead).
 */
export const BackgroundMotif: React.FC<SectionMotifProps> = ({ variant = 'blueprint' }) => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    >
      {variant === 'blueprint' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(163, 230, 53, 0.08), transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.065] dark:opacity-[0.055]"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.11] dark:opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </>
      )}

      {variant === 'dots' && (
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.085]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1.15px, transparent 1.15px)',
            backgroundSize: '26px 26px',
          }}
        />
      )}

      {variant === 'grid' && (
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      )}

      {variant === 'diagonal' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle 520px at 85% 20%, rgba(163, 230, 53, 0.06), transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.045] dark:opacity-[0.038]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 18px)',
            }}
          />
        </>
      )}
    </div>
  );
};
