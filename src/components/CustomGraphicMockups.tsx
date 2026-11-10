import React from 'react';

interface MockupProps {
  type:
    | 'bottle-packaging'
    | 'font-specimen'
    | 'risograph-poster'
    | 'luxury-editorial'
    | 'botanical-spirits'
    | 'monograph-book'
    | 'motion-reel'
    | 'photo-editorial'
    | 'cinema-video';
  className?: string;
  isHero?: boolean;
}

export const CustomGraphicMockup: React.FC<MockupProps> = ({ type, className = '', isHero = false }) => {
  switch (type) {
    case 'bottle-packaging':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#181714] via-[#12110e] to-[#0a0a08] p-6 select-none ${className}`}>
          {/* Subtle noise and radial luxury glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(215,206,178,0.12),transparent_70%)] pointer-events-none" />
          
          {/* Studio floor shadow */}
          <div className="absolute bottom-8 w-48 h-6 bg-black/60 rounded-full blur-md" />

          {/* Luxury Cosmetic Box (Behind) */}
          <div className="absolute left-8 bottom-12 w-28 h-56 bg-[#21201b] border border-[#d7ceb2]/20 rounded-sm shadow-2xl flex flex-col justify-between p-3 transform -rotate-6 transition-transform duration-500 group-hover:-rotate-8">
            <div className="text-[7px] tracking-[0.25em] text-[#d7ceb2]/50 font-mono">KYOTO · 50ML</div>
            <div className="space-y-1 text-center">
              <div className="text-amber-200/80 font-serif text-xs tracking-widest uppercase">AURA</div>
              <div className="text-[6px] tracking-[0.2em] text-[#d7ceb2]/60 font-mono">BOTANICA</div>
              <div className="w-6 h-[1px] bg-amber-400/40 mx-auto my-1" />
              <div className="text-[5px] text-stone-400 font-serif italic">Huile Rituelle</div>
            </div>
            <div className="border-t border-[#d7ceb2]/10 pt-1 text-[5px] text-[#d7ceb2]/40 font-mono text-center">
              LOT 2025/B
            </div>
          </div>

          {/* Apothecary Amber Glass Dropper Bottle (Front) */}
          <div className="relative z-10 w-28 flex flex-col items-center filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105">
            {/* Rubber pipette bulb */}
            <div className="w-9 h-7 bg-[#1c1b18] rounded-t-full border border-stone-700/40 shadow-inner" />
            {/* Gold foil collar ring */}
            <div className="w-11 h-3 bg-gradient-to-r from-[#8a6b24] via-[#f7d98c] to-[#997728] border-y border-amber-200/40 shadow-md" />
            
            {/* Amber Glass Body with translucent reflections */}
            <div className="relative w-24 h-48 bg-gradient-to-r from-[#291708] via-[#4d280b] to-[#241407] rounded-b-xl rounded-t-sm border border-amber-900/30 overflow-hidden flex flex-col items-center pt-5 shadow-2xl">
              {/* Glass glare highlight */}
              <div className="absolute left-2 top-0 bottom-0 w-2 bg-gradient-to-r from-white/20 to-transparent blur-[1px]" />
              <div className="absolute right-3 top-0 bottom-0 w-1 bg-gradient-to-l from-white/10 to-transparent" />
              
              {/* Tactile Textured Paper Label */}
              <div className="relative z-10 w-20 bg-[#f4f1e8] text-stone-900 px-2 py-4 shadow-lg border border-stone-300 flex flex-col items-center justify-between min-h-[110px]">
                <div className="text-[6px] tracking-[0.25em] text-stone-600 font-mono uppercase">
                  № 04 RITUAL
                </div>
                
                <div className="text-center my-1">
                  <div className="font-serif text-[11px] font-bold tracking-widest text-stone-900">
                    AURA
                  </div>
                  <div className="text-[6px] tracking-[0.3em] font-sans text-stone-700 uppercase -mt-0.5">
                    BOTANICA
                  </div>
                  <div className="w-5 h-[1px] bg-stone-400 mx-auto my-1" />
                  <div className="text-[5.5px] font-serif italic text-stone-600">
                    Botanical Elixir
                  </div>
                </div>

                <div className="w-full flex justify-between items-end text-[4.5px] font-mono text-stone-500 pt-1 border-t border-stone-300">
                  <span>50ML</span>
                  <span className="font-bold text-amber-700">1.7 FL.OZ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pantone Chip Badge */}
          <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 p-2 rounded text-[8px] font-mono text-stone-300 shadow-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c29b38] inline-block shadow-sm" />
              <span className="font-semibold text-amber-300">KURZ GOLD 220</span>
            </div>
            <div className="text-[7px] text-stone-400">PAPER: 360GSM GESSO</div>
          </div>
        </div>
      );

    case 'font-specimen':
      return (
        <div className={`relative w-full h-full flex flex-col justify-between bg-[#0e0e10] p-6 text-white overflow-hidden select-none border border-neutral-800 ${className}`}>
          {/* Subtle Graphic Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
          
          {/* Header Specimen Meta */}
          <div className="relative z-10 flex justify-between items-start border-b border-neutral-800 pb-3">
            <div>
              <span className="bg-[#ccff00] text-black font-mono font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider">
                SPECIMEN NO. 4
              </span>
              <div className="text-[9px] font-mono text-neutral-400 mt-1">KROMA VARIABLE · 9 MASTERS</div>
            </div>
            <div className="text-right font-mono text-[8px] text-neutral-500">
              <div>OT_FEATURES: [AALT, LIGA]</div>
              <div className="text-lime-400">WEIGHT: 100 — 950</div>
            </div>
          </div>

          {/* Giant Display Letterforms with Architectural Ink-Traps */}
          <div className="relative z-10 my-auto py-2">
            <div className="flex items-baseline justify-between font-black tracking-tighter leading-none select-none">
              <span className="text-6xl md:text-8xl text-white font-sans transition-transform duration-300 group-hover:scale-105 group-hover:text-lime-300">
                K
              </span>
              <span className="text-5xl md:text-7xl text-neutral-600 font-sans italic">
                R
              </span>
              <span className="text-6xl md:text-8xl text-[#ccff00] font-sans">
                Ω
              </span>
              <span className="text-5xl md:text-7xl text-white font-mono font-light">
                04
              </span>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-b border-neutral-800/80 py-1.5">
              <span>ABCDEFGHIJKLM</span>
              <span className="text-lime-400">NOPQRSTUVWXYZ</span>
              <span>0123456789</span>
            </div>
          </div>

          {/* Broadsheet Newspaper Fold Simulation */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[8px] font-mono text-neutral-500">
            <div className="flex gap-2">
              <span className="text-white font-bold">TYPE DIRECTORS CLUB</span>
              <span>·</span>
              <span>ZURICH KUNSTHAUS</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-lime-400 font-semibold">VARIABLE AXIS ACTIVE</span>
            </div>
          </div>
        </div>
      );

    case 'risograph-poster':
      return (
        <div className={`relative w-full h-full flex flex-col justify-between bg-[#0a0e27] p-6 text-white overflow-hidden select-none ${className}`}>
          {/* Halftone / grain illusion */}
          <div className="absolute inset-0 bg-[radial-gradient(#ff5426_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none" />
          
          {/* Poster Top Grid */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="border-l-2 border-[#ff5426] pl-2">
              <div className="text-[10px] font-mono tracking-widest text-[#ff5426] font-bold">
                TOKYO AVANT-GARDE
              </div>
              <div className="text-[8px] font-mono text-slate-400">
                FREE JAZZ EXPERIMENT 2024
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold font-serif text-white tracking-widest">
                東京
              </div>
              <div className="text-[8px] font-mono text-slate-400">SHIBUYA STREAM</div>
            </div>
          </div>

          {/* Sonic Kinetic Poster Graphic */}
          <div className="relative z-10 my-4 flex flex-col items-center">
            {/* Dynamic wave curves / rings */}
            <div className="relative w-full h-28 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border-2 border-[#ff5426] opacity-80 animate-ping duration-1000" />
              <div className="absolute w-24 h-24 rounded-full border border-blue-400/60" />
              <div className="absolute w-16 h-16 rounded-full bg-[#ff5426] flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-[0_0_20px_#ff5426]">
                LIVE
              </div>
              {/* Waveform lines */}
              <div className="w-full flex justify-between items-center px-4 opacity-70">
                {[12, 32, 60, 24, 75, 45, 80, 50, 90, 65, 30, 85, 40, 20].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1 rounded-full ${i % 3 === 0 ? 'bg-[#ff5426]' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
                SYNCOPATION
              </h4>
              <p className="text-[8px] font-mono tracking-[0.2em] text-[#ff5426] mt-0.5">
                3-COLOR SCREENPRINT · LIMITED 150 EDITIONS
              </p>
            </div>
          </div>

          {/* Poster Footer Ticket Grid */}
          <div className="relative z-10 flex justify-between items-end border-t border-slate-800 pt-2 text-[8px] font-mono text-slate-400">
            <div>
              <span className="text-white font-semibold">NOV 14—17</span> / 19:30 JST
            </div>
            <div className="bg-[#ff5426]/10 text-[#ff5426] border border-[#ff5426]/30 px-1.5 py-0.5 rounded text-[7px] font-bold">
              COLORPLAN 270GSM
            </div>
          </div>
        </div>
      );

    case 'luxury-editorial':
      return (
        <div className={`relative w-full h-full flex items-center justify-center bg-[#111113] p-6 overflow-hidden select-none ${className}`}>
          {/* Subtle luxury vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05),transparent_70%)]" />

          {/* Open Monograph Spread Illusion */}
          <div className="relative z-10 w-full max-w-sm aspect-[16/10] bg-[#fbfbfa] text-stone-900 rounded-sm shadow-2xl flex border border-stone-300 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
            {/* Center Book Spine Shadow */}
            <div className="absolute inset-y-0 left-1/2 -ml-3 w-6 bg-gradient-to-r from-stone-400/20 via-stone-800/20 to-stone-400/20 z-20 pointer-events-none" />

            {/* Left Page (Typography & Editorial Essay) */}
            <div className="w-1/2 p-4 flex flex-col justify-between border-r border-stone-200">
              <div className="flex justify-between items-center text-[6px] font-mono text-stone-400 border-b border-stone-200 pb-1">
                <span>ATELIER NOIR</span>
                <span>VOL. I · P. 42</span>
              </div>
              <div className="my-2">
                <div className="text-[7px] font-mono text-stone-500 uppercase tracking-widest">CHAPTER II</div>
                <div className="font-serif italic text-sm font-semibold text-stone-900 leading-tight mt-0.5">
                  The Architecture of Seconds
                </div>
                <div className="space-y-1 mt-2 text-[5.5px] text-stone-600 leading-relaxed">
                  <div className="w-full h-1 bg-stone-200 rounded-sm" />
                  <div className="w-11/12 h-1 bg-stone-200 rounded-sm" />
                  <div className="w-4/5 h-1 bg-stone-200 rounded-sm" />
                </div>
              </div>
              <div className="text-[5px] font-mono text-stone-400">GENÈVE · SWISS MADE</div>
            </div>

            {/* Right Page (Technical Watch Schematics & Minimal Photography) */}
            <div className="w-1/2 p-4 bg-stone-950 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center text-[6px] font-mono text-stone-400 border-b border-stone-800 pb-1">
                <span>CALIBRE AN-01</span>
                <span>54 JEWELS</span>
              </div>
              
              {/* Mechanical Watch Skeleton Diagram */}
              <div className="my-auto flex items-center justify-center relative py-1">
                <div className="w-16 h-16 rounded-full border border-stone-600/60 flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full border border-dashed border-amber-300/40 animate-[spin_12s_linear_infinite]" />
                  <div className="w-6 h-6 rounded-full border border-stone-400 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                  </div>
                  {/* Axis crosshairs */}
                  <div className="absolute inset-x-0 h-[0.5px] bg-stone-700/60" />
                  <div className="absolute inset-y-0 w-[0.5px] bg-stone-700/60" />
                </div>
              </div>

              <div className="text-[5.5px] font-mono text-stone-400 flex justify-between">
                <span>MUNKEN KRISTALL</span>
                <span className="text-amber-200">28,800 VPH</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'botanical-spirits':
      return (
        <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a140a] via-[#1a0e08] to-[#0c0704] p-6 select-none ${className}`}>
          {/* Amber warm atmospheric back-glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(184,93,54,0.18),transparent_65%)]" />

          {/* Premium Spirits Bottle Silhouette */}
          <div className="relative z-10 w-36 flex flex-col items-center filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500">
            {/* Wooden cap with wax stamp */}
            <div className="w-10 h-7 bg-[#422818] rounded-t-md border-b-2 border-amber-700/60 shadow-inner flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#8c3e1e] flex items-center justify-center text-[7px] text-amber-200 font-serif font-bold">
                S
              </div>
            </div>
            
            {/* Bottle neck with copper foil seal */}
            <div className="w-8 h-10 bg-amber-950/80 border-x border-amber-800/30 flex items-center justify-center">
              <div className="w-full h-5 bg-gradient-to-r from-[#944f2b] via-[#e5986c] to-[#803e1b] flex items-center justify-center">
                <span className="text-[5px] font-mono tracking-widest text-black font-bold uppercase">BOTANICO</span>
              </div>
            </div>

            {/* Heavy Glass Spirits Body with Scalloped Die-Cut Label */}
            <div className="w-32 h-44 bg-gradient-to-b from-amber-900/60 via-amber-950/90 to-black rounded-b-2xl border border-amber-700/30 p-2.5 flex items-center justify-center relative overflow-hidden">
              {/* Liquid reflection line */}
              <div className="absolute left-1 top-0 bottom-0 w-2 bg-gradient-to-r from-amber-500/20 to-transparent blur-[1px]" />
              
              {/* Die-Cut Antiqued Label */}
              <div className="relative w-full bg-[#f4ece1] text-stone-900 rounded-sm p-2.5 shadow-xl border-2 border-[#b85d36]/40 flex flex-col items-center justify-between min-h-[135px]">
                <div className="text-[6px] tracking-[0.25em] text-[#b85d36] font-mono font-bold uppercase">
                  FIRENZE · ITALIA
                </div>

                <div className="text-center my-1">
                  <div className="text-[6px] font-serif italic text-stone-600">Aperitivo Artigianale</div>
                  <div className="font-serif text-sm font-black tracking-wider text-stone-900 uppercase">
                    SOLARIS
                  </div>
                  <div className="w-8 h-[1px] bg-[#b85d36] mx-auto my-0.5" />
                  <div className="text-[5.5px] font-mono tracking-widest text-stone-700 uppercase">
                    24 ERBE BOTANICHE
                  </div>
                </div>

                {/* Botanical filigree engraving representation */}
                <div className="w-full flex justify-between items-center text-[5px] font-mono text-stone-500 border-t border-stone-300 pt-1">
                  <span>25% VOL</span>
                  <span className="font-bold text-[#b85d36]">750 ML</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'monograph-book':
      return (
        <div className={`relative w-full h-full flex items-center justify-center bg-[#171719] p-6 select-none ${className}`}>
          {/* Hardcover Monograph with Debossed Cover */}
          <div className="relative z-10 w-44 aspect-[3/4] bg-[#27272a] rounded-sm shadow-[0_25px_35px_rgba(0,0,0,0.8)] border border-neutral-700/50 p-4 flex flex-col justify-between transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
            {/* Raw Linen Texture feel via subtle border & inset */}
            <div className="flex justify-between items-start">
              <span className="bg-neutral-800 text-neutral-400 font-mono text-[7px] px-1.5 py-0.5 rounded-sm">
                ARCHIVE // 08
              </span>
              <span className="text-[7px] font-mono text-neutral-500">280 PAGES</span>
            </div>

            {/* Brutalist Blind Foil Debossed Title */}
            <div className="my-auto space-y-1">
              <div className="text-[8px] font-mono text-neutral-400 tracking-widest uppercase">
                FONDATION D’ARCHITECTURE
              </div>
              <div className="text-xl font-black font-sans tracking-tight text-neutral-100 uppercase leading-tight">
                CONCRETE
                <br />
                MONOLITHS
              </div>
              <div className="text-[7px] font-mono text-neutral-400">1955 — 1984 EASTERN BLOC</div>
            </div>

            {/* Book Spine Detail & Spec */}
            <div className="border-t border-neutral-700 pt-2 flex justify-between items-center text-[6px] font-mono text-neutral-400">
              <span>MUNKEN PURE 130GSM</span>
              <span className="text-neutral-200">AIGA 50 COVERS</span>
            </div>
          </div>
        </div>
      );

    // ==============================================================
    // NEW: MOTION GRAPHICS REEL MOCKUP
    // ==============================================================
    case 'motion-reel':
      return (
        <div className={`relative w-full h-full flex flex-col justify-between bg-[#08080a] p-5 text-white overflow-hidden select-none border border-neutral-800 ${className}`}>
          {/* Neon 3D glow atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8A3FFC_0%,transparent_60%)] opacity-20 pointer-events-none" />

          {/* Motion UI Header */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-red-400">MOTION RENDER</span>
              <span className="text-neutral-500">· 60 FPS</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="text-purple-400 font-bold">OCTANE 3D</span>
              <span>4K DCI (4096 x 2160)</span>
            </div>
          </div>

          {/* 3D Motion Sphere & Kinetic Wireframe Orbits */}
          <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer 3D Gyro Rings */}
              <div className="absolute inset-0 rounded-full border border-purple-500/40 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 animate-[spin_6s_linear_infinite_reverse]" />
              <div className="absolute inset-6 rounded-full border-2 border-lime-400/60 transform rotate-45" />

              {/* Glowing Core Sphere */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-300 shadow-[0_0_30px_rgba(168,85,247,0.7)] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              {/* Orbital particles */}
              <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute -bottom-1 left-2 w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
            </div>

            <div className="text-center mt-3">
              <div className="text-xs font-mono tracking-widest text-purple-300 font-bold uppercase">
                VORTEX KINETIC // 3D LOOP
              </div>
              <div className="text-[8px] font-mono text-neutral-400 mt-0.5">
                AFTER EFFECTS COMPOSITING · BEATS BY VANGUARD
              </div>
            </div>
          </div>

          {/* Timeline Scrubber & Frame Counter */}
          <div className="relative z-10 space-y-1.5 border-t border-neutral-800 pt-2">
            <div className="flex justify-between items-center text-[8px] font-mono text-neutral-400">
              <span className="text-lime-400 font-bold">FRAME: 0144 / 0360</span>
              <span className="text-purple-300">00:02.40s</span>
            </div>
            {/* Timeline bar */}
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden flex">
              <div className="w-2/5 bg-gradient-to-r from-purple-500 to-lime-400 rounded-full" />
            </div>
          </div>
        </div>
      );

    // ==============================================================
    // NEW: EDITORIAL PHOTOGRAPHY MOCKUP
    // ==============================================================
    case 'photo-editorial':
      return (
        <div className={`relative w-full h-full flex flex-col justify-between bg-[#121110] p-5 text-white overflow-hidden select-none border border-neutral-800 ${className}`}>
          {/* Subtle warm film grain texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_75%)] pointer-events-none" />

          {/* Camera Viewfinder Overlay Header */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono border-b border-neutral-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-bold">HASSELBLAD H6D-100C</span>
            </div>
            <div className="text-neutral-400">
              RAW 16-BIT · 100MP
            </div>
          </div>

          {/* Center Editorial Photo Frame with Viewfinder Brackets */}
          <div className="relative z-10 my-auto py-2 flex items-center justify-center">
            <div className="relative w-full max-w-[260px] aspect-[4/3] bg-neutral-900 border border-neutral-700/80 rounded-sm overflow-hidden flex items-center justify-center shadow-2xl group">
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

              {/* Center Focusing Crosshairs */}
              <div className="absolute w-6 h-6 border border-white/40 flex items-center justify-center">
                <div className="w-1 h-1 bg-amber-400 rounded-full" />
              </div>

              {/* Architectural Monochrome Silhouette */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-800 to-stone-900 flex items-end p-3">
                <div className="space-y-0.5">
                  <div className="text-[7px] font-mono text-stone-400 tracking-widest uppercase">
                    SERI FOTOGRAFI MONOLIT
                  </div>
                  <div className="text-xs font-serif italic text-stone-100 font-bold">
                    Solitude & Shadow
                  </div>
                </div>
              </div>

              {/* Golden hour sunlight beam simulation */}
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
            </div>
          </div>

          {/* Bottom EXIF Camera Settings Strip */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-2">
            <div className="flex gap-2">
              <span className="text-white font-bold">80MM F/2.8</span>
              <span>·</span>
              <span>1/500S</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">ISO 64</span>
            </div>
            <div className="text-neutral-500">
              KODAK PORTRA 160 LOOK
            </div>
          </div>
        </div>
      );

    // ==============================================================
    // NEW: CINEMA & VIDEOGRAPHY MOCKUP
    // ==============================================================
    case 'cinema-video':
      return (
        <div className={`relative w-full h-full flex flex-col justify-between bg-[#07090e] p-5 text-white overflow-hidden select-none border border-neutral-800 ${className}`}>
          {/* Anamorphic blue flare simulation */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[1px] pointer-events-none" />

          {/* Cinema Record HUD */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-black text-red-500 tracking-wider">REC ● 24.00 FPS</span>
            </div>
            <div className="text-neutral-400">
              ARRI ALEXA MINI · 2.39:1
            </div>
          </div>

          {/* 2.39:1 Anamorphic Widescreen Letterbox Video Container */}
          <div className="relative z-10 my-auto py-2">
            <div className="relative w-full aspect-[21/9] bg-gradient-to-r from-[#030611] via-[#0b172a] to-[#040817] rounded-sm border border-neutral-700/80 overflow-hidden flex flex-col justify-between p-3 shadow-2xl">
              {/* Film Title Watermark */}
              <div className="flex justify-between items-start text-[7px] font-mono text-cyan-300/80">
                <span>SCENE: 04 / TAKE: 02</span>
                <span className="text-white font-bold">4K PRORES 4444 XQ</span>
              </div>

              {/* Center Play Button Simulator */}
              <div className="my-auto flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-cyan-500/80 transition-all">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                </div>
              </div>

              {/* Color grade tag */}
              <div className="flex justify-between items-end text-[6.5px] font-mono text-neutral-400">
                <span className="text-cyan-400 font-bold">KODAK 2383 PRINT LUT</span>
                <span>DAVINCI RESOLVE COLOR</span>
              </div>
            </div>
          </div>

          {/* Bottom Audio VU Meters & Timecode */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono text-neutral-400 border-t border-neutral-800 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">TC: 00:03:42:18</span>
              <span>·</span>
              <span className="text-neutral-500">CH1/CH2 -18dB</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-2 bg-emerald-500 rounded-xs" />
              <span className="w-1 h-3 bg-emerald-500 rounded-xs" />
              <span className="w-1 h-2 bg-yellow-500 rounded-xs" />
              <span className="w-1 h-1 bg-neutral-700 rounded-xs" />
              <span className="text-[7px] text-neutral-400 ml-1">AUDIO OK</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
