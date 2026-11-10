'use client';

import React from 'react';
import { Printer, Sparkles, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const DEFAULT_HIGHLIGHTS = [
  {
    title: 'Kertas Seni & Tekstur Taktil',
    description: 'Bekerja dengan pabrik kertas terkemuka dunia seperti Fedrigoni (Italia), G.F Smith Colorplan (UK), dan Munken (Swedia). Menyesuaikan serat katun, gramatur 120gsm hingga 700gsm duplex.',
    badge: 'FEDRIGONI & G.F SMITH',
  },
  {
    title: 'Hot Foil Stamping & Deboss 3D',
    description: 'Aplikasi foil cap panas mikro Kurz Luxor, pigment foil matte, dan blind debossing dengan kedalaman presisi hingga 1.2mm untuk menghadirkan kontras bayangan fisik yang dramatis.',
    badge: 'KURZ GERMANY PRECISION',
  },
  {
    title: 'Sistem Warna Pantone & Fluoresens',
    description: 'Kalibrasi warna solid spot-color Pantone Formula Guide, tinta neon fluoresen berpigmen tinggi, dan tinta metalik perak/tembaga untuk mencegah distorsi warna cetak massal.',
    badge: 'PANTONE MATCHING SYSTEM',
  },
  {
    title: 'Supervisi Pre-Press & Uji Mesin',
    description: 'Pemeriksaan langsung di fasilitas percetakan (press-check), penyesuaian register silinder cetak, trap ketajaman vektor, dan proofing FOGRA39 tersertifikasi ISO 12647-2.',
    badge: 'PRESS-CHECK SUPERVISION',
  },
];

export const TactileSpecs: React.FC = () => {
  const { tactileSpecs } = usePortfolio();
  const list = tactileSpecs && tactileSpecs.length > 0 ? tactileSpecs : DEFAULT_HIGHLIGHTS;

  return (
    <section className="py-20 bg-neutral-900 text-neutral-100 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-lime-400 font-mono text-xs uppercase tracking-widest">
              <Printer className="w-4 h-4" />
              <span>MATERIALITAS CETAK & STANDAR SENI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Obsesi Pada Presisi Fisik & Kertas
            </h2>
          </div>
          <p className="text-sm font-mono text-neutral-400 max-w-md">
            Desain grafis bukan sekadar piksel di layar kaca. Kekuatan sejati sebuah karya lahir saat jemari menyentuh tekstur kertas dan mengamati kilau tinta di bawah cahaya alami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-950/80 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between hover:border-lime-400/40 transition-colors group"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20 font-bold">
                  {item.badge}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Standar Mutu Kolektor</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
