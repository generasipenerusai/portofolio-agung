import { PortfolioSection, ProjectCreationStep } from '../types/portfolio';

export interface DesignThinkingStageInfo {
  step: string;
  phase: string;
  subtitle: string;
  description: string;
  deliverable: string;
}

export const DESIGN_THINKING_STAGES: DesignThinkingStageInfo[] = [
  {
    step: '01',
    phase: 'Empathize',
    subtitle: 'Riset & Empati Pengguna',
    description:
      'Memahami konteks, kebiasaan, serta kendala nyata (pain points) pengguna sebelum merancang solusi.',
    deliverable: 'User Insight',
  },
  {
    step: '02',
    phase: 'Define',
    subtitle: 'Rumusan Masalah Inti',
    description:
      'Menyusun user persona, problem statement, dan skala prioritas kebutuhan produk secara terukur.',
    deliverable: 'Persona & Brief',
  },
  {
    step: '03',
    phase: 'Ideate',
    subtitle: 'Arsitektur & Solusi',
    description:
      'Merancang information architecture, alur navigasi (user flow), serta eksplorasi wireframe.',
    deliverable: 'User Flow & Lo-Fi',
  },
  {
    step: '04',
    phase: 'Prototype',
    subtitle: 'UI System & Interaksi',
    description:
      'Membangun design system yang konsisten, visual high-fidelity, dan prototipe interaktif.',
    deliverable: 'Interactive UI',
  },
  {
    step: '05',
    phase: 'Test',
    subtitle: 'Validasi & Iterasi',
    description:
      'Menguji kemudahan penggunaan (usability testing) dan menyempurnakan alur berdasarkan evaluasi.',
    deliverable: 'Validated UX',
  },
];

const UI_UX_PATTERN =
  /\b(ui\s*\/?\s*ux|ux\s*\/?\s*ui|ui\s*design(?:er)?|ux\s*design(?:er)?|user\s*experience|user\s*interface|product\s*design(?:er)?|interaction\s*design)\b/i;

export function isUiUxTitle(text?: string | null): boolean {
  if (!text) return false;
  return UI_UX_PATTERN.test(text);
}

export function isUiUxSection(section?: PortfolioSection | null): boolean {
  if (!section) return false;
  if (typeof section.showDesignThinking === 'boolean') {
    return section.showDesignThinking;
  }
  return isUiUxTitle(`${section.title || ''} ${section.eyebrow || ''}`);
}

export function createDefaultUiUxSteps(): ProjectCreationStep[] {
  return [
    {
      stepNumber: '01',
      title: 'Empathize — Riset Pengguna & Konteks',
      duration: 'Tahap 1',
      toolUsed: 'FigJam / User Interview',
      description:
        'Menggali kebutuhan, perilaku, dan kendala utama (pain points) pengguna terhadap produk atau alur layanan.',
      keyMilestone: 'User Insight & Pain Points',
    },
    {
      stepNumber: '02',
      title: 'Define — Perumusan Masalah & Persona',
      duration: 'Tahap 2',
      toolUsed: 'FigJam / Notion',
      description:
        'Menyintesis temuan riset menjadi User Persona, User Journey Map, dan Problem Statement yang fokus.',
      keyMilestone: 'User Persona & Problem Statement',
    },
    {
      stepNumber: '03',
      title: 'Ideate — User Flow & Wireframing',
      duration: 'Tahap 3',
      toolUsed: 'Figma / Whimsical',
      description:
        'Menyusun Information Architecture, alur navigasi (User Flow), dan sketsa tata letak Low-Fidelity Wireframe.',
      keyMilestone: 'User Flow & Wireframe',
    },
    {
      stepNumber: '04',
      title: 'Prototype — UI Design System & Interaksi',
      duration: 'Tahap 4',
      toolUsed: 'Figma',
      description:
        'Membangun komponen Design System, antarmuka High-Fidelity, serta prototipe interaktif yang siap diuji.',
      keyMilestone: 'UI System & Interactive Prototype',
    },
    {
      stepNumber: '05',
      title: 'Test — Usability Testing & Iterasi',
      duration: 'Tahap 5',
      toolUsed: 'Figma Prototype / Maze',
      description:
        'Menguji skenario penggunaan bersama pengguna untuk memvalidasi kemudahan alur dan menyempurnakan detail UX.',
      keyMilestone: 'Validated Final UI/UX',
    },
  ];
}
