'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../../types/portfolio';
import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { KineticRibbon } from '../../components/KineticRibbon';
import { ProjectGallery } from '../../components/ProjectGallery';
import { ServicesSkills } from '../../components/ServicesSkills';
import { ExhibitionsAwards } from '../../components/ExhibitionsAwards';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';
import { CaseStudyModal } from '../../components/CaseStudyModal';

export default function PhotographerHomePage() {
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] text-neutral-900 dark:bg-[#08080b] dark:text-neutral-100 selection:bg-lime-400 selection:text-neutral-950 transition-colors duration-300">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* 1. Ringkasan Profil Photographer & Videographer */}
        <Hero />

        {/* Divider Kinetik Disiplin Visual Fotografi & Video */}
        <KineticRibbon />

        {/* 2. Galeri Foto & Video Komersial, Event & Produk */}
        <ProjectGallery onSelectProject={(project) => setSelectedProject(project)} />

        {/* 3. Bidang Keahlian, Gear Kamera & Software Finishing */}
        <ServicesSkills />

        {/* 4. Rekam Jejak, Klien Brand & Penghargaan Sinematografi */}
        <ExhibitionsAwards />

        {/* 5. Kontak Booking Sesi Foto/Video & Proposal */}
        <ContactSection />
      </main>

      <Footer />

      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
