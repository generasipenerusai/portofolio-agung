'use client';

import React from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const DesignProcess: React.FC = () => {
  const { processSteps } = usePortfolio();
  return (
    <section id="metode" className="py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                03 // METODOLOGI & CARA KERJA
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Proses Dari Konsep Hingga Benda Fisik
            </h2>
          </div>

          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 max-w-sm">
            Setiap karya dirancang secara metodis melalui 4 fase berurutan tanpa jalan pintas demi menjamin orisinalitas tinggi.
          </p>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-lime-400/50 transition-colors group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-black font-mono text-neutral-400 dark:text-neutral-600 group-hover:text-lime-400 transition-colors">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase">
                    FASE 0{step.number}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-lime-600 dark:text-lime-400 tracking-widest uppercase">
                    {step.phase}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Methodology tags */}
                <div className="pt-2 space-y-1.5">
                  {step.methodology.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      <span className="w-1 h-1 rounded-full bg-lime-400" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">HASIL FASE:</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {step.deliverableHighlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
