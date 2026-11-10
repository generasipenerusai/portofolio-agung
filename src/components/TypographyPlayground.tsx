'use client';

import React, { useState } from 'react';
import { Type, Sparkles, Sliders, Copy, Check, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface PresetStyle {
  id: string;
  name: string;
  category: string;
  fontClass: string;
  defaultText: string;
}

const PRESETS: PresetStyle[] = [
  {
    id: 'display',
    name: 'KROMA Display',
    category: 'Brutalist / Avant-Garde',
    fontClass: 'font-sans font-black tracking-tighter uppercase',
    defaultText: 'RADICAL TECTONICS',
  },
  {
    id: 'editorial',
    name: 'Aruna Heritage Serif',
    category: 'High-Fashion Editorial',
    fontClass: 'font-serif italic font-normal tracking-wide',
    defaultText: 'Subtle Whispers of Nature',
  },
  {
    id: 'grotesk',
    name: 'Neue Zurich Grotesk',
    category: 'Swiss Rationalist Grid',
    fontClass: 'font-sans font-bold tracking-tight uppercase',
    defaultText: 'SWISS RATIONALISM // 1958',
  },
  {
    id: 'mono',
    name: 'Atelier Technical Mono',
    category: 'Horology & Microprint',
    fontClass: 'font-mono font-medium tracking-normal',
    defaultText: 'CALIBRE: AN-01 [28,800 VPH]',
  },
];

const COLOR_THEMES = [
  { id: 'dark', name: 'Obsidian & Acid', bg: 'bg-[#0c0c0e]', text: 'text-[#ccff00]', border: 'border-zinc-800' },
  { id: 'cream', name: 'Raw Cotton & Ink', bg: 'bg-[#f4f2eb]', text: 'text-[#181716]', border: 'border-stone-300' },
  { id: 'neon', name: 'Midnight & Fluo', bg: 'bg-[#090d24]', text: 'text-[#ff5426]', border: 'border-indigo-900' },
  { id: 'silver', name: 'Titanium & Monolith', bg: 'bg-[#18181b]', text: 'text-[#e4e4e7]', border: 'border-zinc-700' },
];

export const TypographyPlayground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetStyle>(PRESETS[0]);
  const [inputText, setInputText] = useState(PRESETS[0].defaultText);
  const [fontSize, setFontSize] = useState<number>(56);
  const [letterSpacing, setLetterSpacing] = useState<number>(-2);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [copied, setCopied] = useState(false);

  const handlePresetChange = (preset: PresetStyle) => {
    soundFx.playTick();
    setSelectedPreset(preset);
    setInputText(preset.defaultText);
  };

  const handleThemeChange = (theme: typeof COLOR_THEMES[0]) => {
    soundFx.playTick();
    setSelectedTheme(theme);
  };

  const handleCopySpec = () => {
    soundFx.playPop();
    const spec = `font-family: "${selectedPreset.name}"; font-size: ${fontSize}px; letter-spacing: ${letterSpacing}px;`;
    navigator.clipboard.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    soundFx.playTick();
    setFontSize(56);
    setLetterSpacing(-2);
    setInputText(selectedPreset.defaultText);
  };

  return (
    <section id="type-lab" className="py-24 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                LABORATORIUM TIPOGRAFI
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Interactive Type & Specimen Studio
            </h2>
          </div>
          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 max-w-md">
            Eksplorasi proporsi huruf, skala optik, dan ritme ruang negatif secara langsung. Desain tipografi yang presisi adalah jiwa dari setiap identitas visual.
          </p>
        </div>

        {/* Playground Box Container */}
        <div className="bg-neutral-100 dark:bg-neutral-900/70 border border-neutral-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-300 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-neutral-50 dark:bg-neutral-950/60">
            {/* Presets Selector */}
            <div className="md:col-span-5 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetChange(p)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                    selectedPreset.id === p.id
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold shadow-sm'
                      : 'bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Sliders for Size & Tracking */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>UKURAN</span>
                  <span className="font-bold">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-neutral-900 dark:accent-lime-400 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>KERNING</span>
                  <span className="font-bold">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="12"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-neutral-900 dark:accent-lime-400 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Themes & Actions */}
            <div className="md:col-span-3 flex flex-wrap items-center justify-start md:justify-end gap-2 pt-2 md:pt-0">
              <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 p-1 rounded-md">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    title={theme.name}
                    onClick={() => handleThemeChange(theme)}
                    className={`w-5 h-5 rounded-sm border ${theme.bg} ${
                      selectedTheme.id === theme.id ? 'ring-2 ring-lime-400 scale-110' : 'opacity-70'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleReset}
                title="Reset Setelan"
                className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopySpec}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-mono rounded hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Copy CSS'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Display Area */}
          <div
            className={`relative min-h-[340px] flex flex-col justify-between p-8 sm:p-12 transition-colors duration-300 ${selectedTheme.bg} ${selectedTheme.text}`}
          >
            {/* Top Spec Bar */}
            <div className="flex justify-between items-center text-xs font-mono opacity-60 pb-4 border-b border-current/15">
              <span>FAMILY: {selectedPreset.name.toUpperCase()}</span>
              <span>CLASSIFICATION: {selectedPreset.category.toUpperCase()}</span>
              <span className="hidden sm:inline">KERNING: {letterSpacing}px</span>
            </div>

            {/* Editable / Live Output Text */}
            <div className="py-8 my-auto overflow-hidden">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: 1.05,
                }}
                className={`w-full bg-transparent border-none outline-none text-current ${selectedPreset.fontClass} placeholder-current/30 text-center sm:text-left`}
                placeholder="Ketik teks di sini..."
              />
            </div>

            {/* Bottom Diagnostic Spec */}
            <div className="flex flex-wrap justify-between items-end gap-2 text-[10px] font-mono opacity-50 pt-4 border-t border-current/15">
              <div>
                GRID: 12-COL MODULAR · OPENTYPE FEATURES: [ON]
              </div>
              <div className="flex items-center gap-3">
                <span>CLICK TEXT TO TYPE & EXPERIMENT</span>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
