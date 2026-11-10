export type ProjectCategory =
  | 'All'
  | 'Branding'
  | 'Packaging'
  | 'Editorial'
  | 'Typography'
  | 'Poster Series'
  | 'Motion Graphics'
  | 'Fotografi'
  | 'Videografi'
  | 'Art Direction'
  | (string & {});

export interface PrintSpecs {
  paperStock?: string;
  finishing?: string[];
  pantone?: string[];
  dimensions?: string;
  binding?: string;
  technique?: string;
}

export interface PhotoSpecs {
  camera?: string;
  lens?: string;
  settings?: string;
  location?: string;
  filmSimulation?: string;
  lighting?: string;
}

export interface VideoSpecs {
  aspectRatio?: string;
  resolution?: string;
  frameRate?: string;
  colorGrade?: string;
  cameraBody?: string;
  audioSpec?: string;
  runtime?: string;
}

export interface ColorSwatch {
  hex: string;
  name: string;
  pantone?: string;
  cmyk?: string;
}

export interface TypographySpec {
  role: string;
  fontName: string;
  category: 'Serif' | 'Grotesque' | 'Display' | 'Monospace';
  sampleText: string;
}

export interface ProjectCreationStep {
  stepNumber: string;
  title: string;
  duration: string;
  toolUsed: string;
  description: string;
  keyMilestone: string;
}

export interface ProjectToolUsage {
  name: string;
  code: string;
  purpose: string;
  colorBg: string;
  colorText: string;
}

export interface ProjectGalleryImage {
  url: string;
  caption: string;
  aspect?: 'square' | 'wide' | 'portrait';
}

export interface PortfolioSection {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  layout?: 'grid-2' | 'gallery-3';
  showDesignThinking?: boolean;
}

export interface Project {
  id: string;
  sectionId?: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  category: ProjectCategory;
  mediaType?: 'graphic' | 'photo' | 'video' | 'motion';
  tags: string[];
  featured: boolean;
  aspectRatio: 'standard' | 'tall' | 'wide';
  mockupType:
    | 'bottle-packaging'
    | 'font-specimen'
    | 'risograph-poster'
    | 'luxury-editorial'
    | 'botanical-spirits'
    | 'monograph-book'
    | 'motion-reel'
    | 'photo-editorial'
    | 'cinema-video';
  heroTheme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    tagBg: string;
  };
  summary: string;
  designBrief: string;
  conceptPhilosophy: string;
  
  // Peran Desainer dalam Proyek Ini
  myRole: {
    title: string;
    responsibilities: string[];
    contributionType: string;
  };

  // Aplikasi & Software yang digunakan untuk proyek ini
  toolsUsed: ProjectToolUsage[];

  // Proses Pembuatan Step-by-Step
  creationProcess: ProjectCreationStep[];

  deliverables: string[];
  
  // Spesifikasi Khusus Berdasarkan Media
  printSpecs?: PrintSpecs;
  photoSpecs?: PhotoSpecs;
  videoSpecs?: VideoSpecs;
  
  // Media & Tautan Langsung Proyek
  videoEmbedUrl?: string;
  projectUrl?: string;
  projectUrlLabel?: string;
  customMockupUrl?: string;
  photoGallery?: ProjectGalleryImage[];

  colorPalette: ColorSwatch[];
  typographyStack: TypographySpec[];
  impactMetrics: {
    label: string;
    value: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    organization: string;
    avatarUrl?: string;
  };
}

export interface TestimonialItem {
  quote: string;
  client: string;
  role: string;
  company: string;
  avatarUrl?: string;
}

export interface ApplicationTool {
  id: string;
  name: string;
  shortCode: string;
  iconUrl?: string;
  category:
    | 'Vektor & Brand'
    | 'Editorial & Layout'
    | 'Raster & Tekstur'
    | '3D & Kemasan'
    | '3D & Motion'
    | 'Huruf & Font'
    | 'Videografi & Color'
    | 'Fotografi'
    | 'Digital & Interface';
  experienceLevel: 'Primary Daily Driver' | 'Advanced Specialist' | 'Production Master';
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
  description: string;
  keyUseCases: string[];
  yearsUsed: string;
}

export interface AwardItem {
  year: string;
  award: string;
  project: string;
  institution: string;
  badge?: string;
  credentialUrl?: string;
}

export interface ExhibitionItem {
  year: string;
  title: string;
  venue: string;
  city: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  description: string;
  methodology: string[];
  deliverableHighlight: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  scopes: string[];
  budget: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface TactileHighlight {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface TypefaceSpecimen {
  id: string;
  name: string;
  category: string;
  fontClass: string;
  defaultText: string;
}

export interface AdminAuthSettings {
  username: string;
  password: string;
  updatedAt?: string;
}

export interface DesignerProfile {
  name: string;
  primaryRole: string;
  subRoles: string[];
  runningText?: string[];
  aliasTitle: string;
  photoUrl: string;
  headline: string;
  bioParagraphs: string[];
  location: string;
  timezone: string;
  email?: string;
  phone?: string;
  studioAddress?: string;
  workingHours?: string;
  responseTime?: string;
  portfolioPdfUrl?: string;
  portfolioSwitcherLabel?: string;
  hidePortfolioSwitcher?: boolean;
  availability: {
    status: 'Available' | 'Limited' | 'Booked';
    currentQuarter: string;
    note: string;
  };
  statistics: {
    number: string;
    label: string;
    sublabel: string;
  }[];
  socials: {
    platform: string;
    username: string;
    url: string;
    highlight?: boolean;
  }[];
}
