import type { Metadata } from 'next';
import './globals.css';
import { PortfolioProvider } from '../context/PortfolioContext';

export const metadata: Metadata = {
  title: 'Agung Sabdo Wicaksono — Desainer Grafis & Digital Designer',
  description:
    'Portofolio resmi Agung Sabdo Wicaksono: Desainer Grafis, Digital & UI/UX Designer spesialisasi identitas jenama (branding), desain digital, motion graphics, fotografi, dan produksi visual.',
  keywords: [
    'Agung Sabdo Wicaksono',
    'Graphic Designer',
    'Digital Designer',
    'UI/UX Designer',
    'Motion Graphics',
    'Fotografi',
    'Videografi',
    'Packaging Design',
    'Brand Identity',
    'Portfolio CMS',
  ],
  authors: [{ name: 'Agung Sabdo Wicaksono' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#f8f7f4] text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100 antialiased selection:bg-lime-400 selection:text-neutral-950 transition-colors duration-300">
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
