'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  AlertCircle,
  FolderOpen,
  User,
  Wrench,
  Download,
  Upload,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  Camera,
  Film,
  Video,
  Eye,
  X,
  Award,
  Globe,
  Briefcase,
  Quote,
  Sliders,
  CheckCircle2,
  Calendar,
  Clock,
  Mail,
  Inbox,
  MessageSquare,
  Star,
  Printer,
  Phone,
  MapPin,
  Building,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
  BadgeCheck,
  CheckCheck,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  LogOut,
  EyeOff,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Project,
  PortfolioSection,
  ProjectCategory,
  ApplicationTool,
  ProjectCreationStep,
  ServiceItem,
  ProcessStep,
  AwardItem,
  ExhibitionItem,
  TactileHighlight,
  InquiryMessage,
} from '../../types/portfolio';
import { soundFx } from '../../utils/soundEffects';
import {
  createDefaultUiUxSteps,
  isUiUxSection,
  isUiUxTitle,
} from '../../utils/designThinking';
import {
  extractPaletteFromImage,
  normalizeHexForPicker,
} from '../../utils/colorExtractor';
import {
  formatExternalUrl,
  analyzeProjectLink,
} from '../../utils/linkHelpers';

export default function AdminPage() {
  const {
    portfolioType,
    designerProfile,
    portfolioSections,
    projectsData,
    applicationsList,
    servicesData,
    processSteps,
    awardsData,
    exhibitionsData,
    clientRoster,
    testimonials,
    tactileSpecs,
    inquiries,
    addPortfolioSection,
    updatePortfolioSection,
    deletePortfolioSection,
    reorderPortfolioSection,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectFeatured,
    updateProfile,
    addApplication,
    updateApplication,
    deleteApplication,
    addService,
    updateService,
    deleteService,
    updateProcessStep,
    addAward,
    updateAward,
    deleteAward,
    reorderAward,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    addClient,
    deleteClient,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addTactileHighlight,
    updateTactileHighlight,
    deleteTactileHighlight,
    toggleInquiryRead,
    deleteInquiry,
    importDatabase,
    resetToDefault,
    adminAuth,
    updateAdminAuth,
  } = usePortfolio();

  type AdminTab =
    | 'projects'
    | 'profile'
    | 'tools'
    | 'services'
    | 'awards'
    | 'tactile'
    | 'inbox'
    | 'backup'
    | 'security';

  const [activeTab, setActiveTabState] = useState<AdminTab>('projects');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security & Credentials Form State
  const [securityForm, setSecurityForm] = useState({
    username: 'admin',
    newPassword: '',
    confirmPassword: '',
  });
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);

  // Sync security form when adminAuth is ready
  React.useEffect(() => {
    if (adminAuth?.username) {
      setSecurityForm((prev) => ({
        ...prev,
        username: adminAuth.username,
      }));
    }
  }, [adminAuth]);

  // Check authentication session on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
      if (isAuth) {
        setIsAuthenticated(true);
      }
      setAuthChecked(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validUser = (adminAuth?.username || 'admin').trim().toLowerCase();
    const validPass = adminAuth?.password || 'admin';

    const inputUser = loginUsername.trim().toLowerCase();
    const inputPass = loginPassword;

    if (inputUser === validUser && inputPass === validPass) {
      soundFx.playPop();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_authenticated', 'true');
      }
      setIsAuthenticated(true);
      setLoginPassword('');
      setLoginError(null);
      showToast('Berhasil masuk ke Dashboard Admin!');
    } else {
      soundFx.playTick();
      setLoginError('Username atau Password yang Anda masukkan tidak sesuai.');
    }
  };

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar dari Dashboard Admin?')) {
      soundFx.playPop();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_authenticated');
      }
      setIsAuthenticated(false);
      setLoginPassword('');
      setLoginError(null);
      showToast('Anda telah keluar dari Dashboard Admin.');
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    if (!securityForm.username.trim()) {
      alert('Username tidak boleh kosong.');
      return;
    }

    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 4) {
        alert('Password baru minimal harus 4 karakter.');
        return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        alert('Konfirmasi Password baru tidak sesuai dengan Password baru.');
        return;
      }
    }

    const payload = {
      username: securityForm.username.trim(),
      password: securityForm.newPassword ? securityForm.newPassword : adminAuth.password,
    };

    const success = await updateAdminAuth(payload);
    if (success) {
      setSecurityForm((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
      showToast('Username & Password admin berhasil diperbarui!');
    } else {
      alert('Gagal memperbarui pengaturan login. Silakan coba lagi.');
    }
  };

  // Sub-tabs for Section 5 (Awards, Exhibitions, Clients, Testimonials)
  const [recognitionSubTab, setRecognitionSubTabState] = useState<'awards' | 'exhibitions' | 'clients' | 'testimonials'>('awards');

  // Sub-tabs for Section 4 (Services vs Methodology)
  const [servicesSubTab, setServicesSubTabState] = useState<'services' | 'methodology'>('services');

  // Persistent Tab Switcher: keeps active tab in URL hash and sessionStorage/localStorage
  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_active_tab', tab);
      localStorage.setItem('admin_active_tab', tab);
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  const setRecognitionSubTab = (sub: 'awards' | 'exhibitions' | 'clients' | 'testimonials') => {
    setRecognitionSubTabState(sub);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_rec_subtab', sub);
    }
  };

  const setServicesSubTab = (sub: 'services' | 'methodology') => {
    setServicesSubTabState(sub);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_serv_subtab', sub);
    }
  };

  // Restore active tabs, subtabs, and scroll position on load
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as AdminTab;
      const validTabs: AdminTab[] = [
        'projects',
        'profile',
        'tools',
        'services',
        'awards',
        'tactile',
        'inbox',
        'backup',
        'security',
      ];
      const savedTab = (sessionStorage.getItem('admin_active_tab') || localStorage.getItem('admin_active_tab')) as AdminTab;

      if (hash && validTabs.includes(hash)) {
        setActiveTabState(hash);
      } else if (savedTab && validTabs.includes(savedTab)) {
        setActiveTabState(savedTab);
        window.history.replaceState(null, '', `#${savedTab}`);
      }

      const savedRec = sessionStorage.getItem('admin_rec_subtab');
      if (savedRec && ['awards', 'clients', 'testimonials'].includes(savedRec)) {
        setRecognitionSubTabState(savedRec as any);
      }

      const savedServ = sessionStorage.getItem('admin_serv_subtab');
      if (savedServ && ['services', 'methodology'].includes(savedServ)) {
        setServicesSubTabState(savedServ as any);
      }
    }
  }, []);

  // Project Modal State & Active Tab
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [modalFormTab, setModalFormTab] = useState<'basic' | 'role' | 'tools' | 'process' | 'deliverables'>('basic');

  // Project Search, Section & Category Filter
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>('All');
  const [projectFilterSection, setProjectFilterSection] = useState<string>('All');

  // Portfolio Section Modal State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDtManualOverride, setSectionDtManualOverride] = useState(false);
  const [sectionPositionIndex, setSectionPositionIndex] = useState<number>(0);
  const [sectionForm, setSectionForm] = useState<PortfolioSection>({
    id: '',
    eyebrow: 'Keahlian Tambahan',
    title: '',
    subtitle: '',
    layout: 'gallery-3',
    showDesignThinking: false,
  });
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  // Tool Modal State
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [isQuickAddToolOpen, setIsQuickAddToolOpen] = useState(false);
  const [quickToolForm, setQuickToolForm] = useState({
    name: '',
    shortCode: '',
    iconUrl: '',
    purpose: '',
  });
  const [toolForm, setToolForm] = useState<Partial<ApplicationTool>>({
    name: '',
    shortCode: 'Nw',
    iconUrl: '',
    category: 'Vektor & Brand',
    experienceLevel: 'Primary Daily Driver',
    yearsUsed: '5+ Tahun',
    description: '',
    color: {
      bg: 'bg-neutral-800',
      text: 'text-white',
      border: 'border-neutral-700',
      badge: 'bg-lime-400 text-black',
    },
    keyUseCases: ['Fungsi utama 1', 'Fungsi utama 2'],
  });

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceNumber, setEditingServiceNumber] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    number: '05',
    title: '',
    tagline: '',
    description: '',
    deliverables: ['Deliverable 1', 'Deliverable 2'],
  });

  // Award / Certification Modal State
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [awardPositionIndex, setAwardPositionIndex] = useState<number>(0);
  const [awardForm, setAwardForm] = useState<AwardItem>({
    year: '2025',
    award: '',
    project: '',
    institution: '',
    badge: '',
    credentialUrl: '',
  });

  // Exhibition Modal State
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [editingExhibitionIndex, setEditingExhibitionIndex] = useState<number | null>(null);
  const [exhibitionForm, setExhibitionForm] = useState<ExhibitionItem>({
    year: '2025',
    title: '',
    venue: '',
    city: '',
  });

  // Client Modal State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', city: '', category: '' });

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    quote: '',
    client: '',
    role: '',
    company: '',
    avatarUrl: '',
  });

  // Tactile Modal State
  const [isTactileModalOpen, setIsTactileModalOpen] = useState(false);
  const [editingTactileIndex, setEditingTactileIndex] = useState<number | null>(null);
  const [tactileForm, setTactileForm] = useState<TactileHighlight>({
    id: 'tactile-1',
    title: '',
    badge: '',
    description: '',
  });

  // Inbox & Inquiries State
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryMessage | null>(null);

  // File Import Ref
  const importFileRef = useRef<HTMLInputElement>(null);

  // Client-side auto-compression using Canvas (reduces 10MB down to ~200KB instantly)
  const compressImageFile = async (file: File, maxDim = 1920, quality = 0.85): Promise<File> => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressedFile = new File([blob], cleanName, { type: 'image/jpeg' });
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Upload gambar lokal dengan kompresi otomatis & dukungan cloud / fallback
  const handleLocalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (uploadedUrl: string) => void
  ) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;
    e.target.value = '';

    showToast('Mengoptimasi & mengunggah gambar...');

    try {
      // 1. Kompresi gambar di browser agar ringan & hemat kuota
      const compressedFile = await compressImageFile(originalFile, 1920, 0.85);

      const formData = new FormData();
      formData.append('file', compressedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.urls?.[0]) {
          callback(data.urls[0]);
          soundFx.playPop();
          showToast('Gambar berhasil diunggah!');
          return;
        }
      }
    } catch (err) {
      console.warn('API upload error, switching to direct preview:', err);
    }

    // 2. Fallback langsung bila serverless read-only
    try {
      const compressedFile = await compressImageFile(originalFile, 1600, 0.8);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          soundFx.playPop();
          showToast('Gambar berhasil diunggah!');
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      alert('Gagal memproses berkas gambar.');
    }
  };

  // Upload Handler for CV / Portfolio PDF Document
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Harap pilih berkas dokumen berformat PDF.');
      return;
    }

    setIsUploadingPdf(true);
    showToast('Mengunggah berkas CV (PDF)...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.urls?.[0]) {
          setProfileForm((prev) => ({ ...prev, portfolioPdfUrl: data.urls[0] }));
          soundFx.playPop();
          showToast('Berkas CV (PDF) berhasil diunggah!');
          setIsUploadingPdf(false);
          return;
        }
      }
    } catch (err) {
      console.error('PDF upload failed:', err);
    }

    // Fallback Data URI jika offline / direct
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileForm((prev) => ({ ...prev, portfolioPdfUrl: reader.result as string }));
          soundFx.playPop();
          showToast('Berkas CV (PDF) berhasil dipasang!');
        }
        setIsUploadingPdf(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Gagal mengunggah berkas CV. Silakan coba lagi atau gunakan tautan Google Drive.');
      setIsUploadingPdf(false);
    }
  };

  // Form State for Project
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    subtitle: '',
    client: '',
    year: '2026',
    category: 'Branding',
    mediaType: 'graphic',
    featured: false,
    customMockupUrl: '',
    videoEmbedUrl: '',
    summary: '',
    designBrief: '',
    conceptPhilosophy: '',
    tags: ['Branding', 'Visual Identity'],
    aspectRatio: 'standard',
    mockupType: 'bottle-packaging',
    myRole: {
      title: 'Lead Designer',
      contributionType: 'Sole Lead & Art Director (100%)',
      responsibilities: ['Konseptualisasi ide dan sketsa awal'],
    },
    toolsUsed: [],
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Riset & Moodboard Konseptual',
        duration: 'Minggu 1',
        toolUsed: 'Figma & Sketsa Pensil',
        description: 'Menganalisis semiotika dan menyusun arah estetika awal.',
        keyMilestone: 'Dossier Arah Visual Terverifikasi',
      },
    ],
    deliverables: ['Identitas Visual Lengkap'],
    colorPalette: [
      { hex: '#0C0C0E', name: 'Obsidian Black', cmyk: '75 / 65 / 65 / 90' },
      { hex: '#CCFF00', name: 'Radioactive Lime', pantone: 'Pantone 802 C' },
    ],
    typographyStack: [
      {
        role: 'Primary Display',
        fontName: 'Clash Display Bold',
        category: 'Display',
        sampleText: 'RADICAL AESTHETICS',
      },
    ],
    impactMetrics: [{ label: 'Hasil Proyek', value: '100% Selesai' }],
    printSpecs: {
      paperStock: '',
      technique: '',
      dimensions: '',
      finishing: [],
      pantone: [],
    },
    photoSpecs: {
      camera: '',
      lens: '',
      settings: '',
      location: '',
      filmSimulation: '',
      lighting: '',
    },
    videoSpecs: {
      resolution: '',
      aspectRatio: '',
      frameRate: '',
      colorGrade: '',
      runtime: '',
      audioSpec: '',
    },
  });

  // Profile Form State (Deep copy of designerProfile)
  const buildProfileForm = (dp: typeof designerProfile) => ({
    name: dp.name,
    primaryRole: dp.primaryRole,
    subRoles: (dp.subRoles || []).join(', '),
    runningText: (Array.isArray(dp.runningText) ? dp.runningText : dp.subRoles || []).join(', '),
    photoUrl: dp.photoUrl,
    headline: dp.headline,
    bio: (dp.bioParagraphs || []).join('\n\n'),
    location: dp.location,
    timezone: dp.timezone,
    email: dp.email || 'agung.sabdo.w@gmail.com',
    phone: dp.phone || '+62 851-5687-7792',
    studioAddress: dp.studioAddress || 'Jl. Benda Barat 9, Blok C 14 No. 17H, Pondok Benda, Pamulang, Tangerang Selatan',
    workingHours: dp.workingHours || 'Senin - Jumat: 09:00 - 18:00 WIB',
    responseTime: dp.responseTime || 'Dibalas dalam 1x24 jam kerja',
    portfolioPdfUrl: dp.portfolioPdfUrl || '#kontak',
    portfolioSwitcherLabel: dp.portfolioSwitcherLabel || '',
    hidePortfolioSwitcher: Boolean(dp.hidePortfolioSwitcher),
    availabilityStatus: dp.availability?.status || 'Available',
    availabilityQuarter: dp.availability?.currentQuarter || '',
    availabilityNote: dp.availability?.note || '',
    stats: JSON.parse(JSON.stringify(dp.statistics || [])),
    socials: JSON.parse(JSON.stringify(dp.socials || [])),
  });

  const [profileForm, setProfileForm] = useState(() => buildProfileForm(designerProfile));

  React.useEffect(() => {
    setProfileForm(buildProfileForm(designerProfile));
  }, [designerProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload banyak foto galeri sekaligus dengan kompresi otomatis & fallback
  const handleMultiGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;
    e.target.value = '';

    showToast(`Mengoptimasi ${rawFiles.length} foto...`);

    const uploadedUrls: string[] = [];

    for (const rawFile of rawFiles) {
      // 1. Coba upload via API dengan gambar terkompresi
      let added = false;
      try {
        const compressed = await compressImageFile(rawFile, 1920, 0.85);
        const formData = new FormData();
        formData.append('file', compressed);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.urls?.[0]) {
            uploadedUrls.push(data.urls[0]);
            added = true;
          }
        }
      } catch {
        // Fallback ke pembacaan data URI lokal
      }

      // 2. Fallback kompresi data URI jika API gagal / offline
      if (!added) {
        try {
          const compressed = await compressImageFile(rawFile, 1600, 0.8);
          const dataUrl = await new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(compressed);
          });
          if (dataUrl) uploadedUrls.push(dataUrl);
        } catch {
          // lewati jika berkas rusak
        }
      }
    }

    if (uploadedUrls.length > 0) {
      setProjectForm((prev) => ({
        ...prev,
        photoGallery: [
          ...(prev.photoGallery || []),
          ...uploadedUrls.map((url) => ({ url, caption: '' })),
        ],
      }));
      soundFx.playPop();
      showToast(`${uploadedUrls.length} foto berhasil ditambahkan ke galeri karya!`);
    } else {
      alert('Gagal mengunggah foto. Silakan coba lagi.');
    }
  };

  // ==============================================================
  // PORTFOLIO SECTION HANDLERS (MANUAL SECTION TITLES)
  // ==============================================================
  const validSectionIds = new Set(portfolioSections.map((s) => s.id));
  const primarySectionId = portfolioSections[0]?.id || 'main';

  const getProjectSectionId = (p: Project) =>
    p.sectionId && validSectionIds.has(p.sectionId) ? p.sectionId : primarySectionId;

  const handleOpenAddSection = () => {
    soundFx.playTick();
    setEditingSectionId(null);
    setSectionDtManualOverride(false);
    setSectionPositionIndex(portfolioSections.length);
    setSectionForm({
      id: `sec-${Date.now()}`,
      eyebrow: 'Keahlian Tambahan',
      title: '',
      subtitle: '',
      layout: 'gallery-3',
      showDesignThinking: false,
    });
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec: PortfolioSection) => {
    soundFx.playTick();
    setEditingSectionId(sec.id);
    setSectionDtManualOverride(true);
    const currIdx = portfolioSections.findIndex((s) => s.id === sec.id);
    setSectionPositionIndex(currIdx !== -1 ? currIdx : 0);
    setSectionForm({
      id: sec.id,
      eyebrow: sec.eyebrow || '',
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      layout: sec.layout || 'grid-2',
      showDesignThinking: isUiUxSection(sec),
    });
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();
    if (!sectionForm.title.trim()) {
      alert('Judul Section wajib diisi.');
      return;
    }

    const payload: PortfolioSection = {
      id: editingSectionId || sectionForm.id || `sec-${Date.now()}`,
      eyebrow: sectionForm.eyebrow?.trim() || '',
      title: sectionForm.title.trim(),
      subtitle: sectionForm.subtitle?.trim() || '',
      layout: sectionForm.layout || 'grid-2',
      showDesignThinking: Boolean(sectionForm.showDesignThinking),
    };

    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    const success = editingSectionId
      ? await updatePortfolioSection(payload, sectionPositionIndex)
      : await addPortfolioSection(payload, sectionPositionIndex);

    if (success) {
      setIsSectionModalOpen(false);
      showToast(
        editingSectionId
          ? `Judul & urutan section "${payload.title}" berhasil diperbarui!`
          : `Section baru "${payload.title}" berhasil dibuat!`
      );
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteSection = async (sec: PortfolioSection) => {
    if (portfolioSections.length <= 1) {
      alert('Minimal harus terdapat 1 section portofolio utama.');
      return;
    }
    const count = projectsData.filter((p) => getProjectSectionId(p) === sec.id).length;
    const msg =
      count > 0
        ? `Hapus section "${sec.title}"? (${count} karya di dalamnya tidak akan terhapus, melainkan dipindahkan ke section pertama).`
        : `Hapus section "${sec.title}"?`;
    if (confirm(msg)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      const success = await deletePortfolioSection(sec.id);
      if (success) {
        if (projectFilterSection === sec.id) setProjectFilterSection('All');
        showToast(`Section "${sec.title}" telah dihapus.`);
        if (typeof window !== 'undefined') {
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
        }
      }
    }
  };

  const handleMoveSection = async (id: string, dir: 'up' | 'down') => {
    soundFx.playTick();
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    const success = await reorderPortfolioSection(id, dir);
    if (success) {
      showToast('Urutan section portofolio diperbarui!');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // PROJECT HANDLERS
  // ==============================================================
  const handleOpenAddProject = (presetSectionId?: string) => {
    soundFx.playTick();
    setEditingProjectId(null);
    setModalFormTab('basic');
    setNewGalleryUrlInput('');

    const targetSectionId =
      typeof presetSectionId === 'string' && presetSectionId
        ? presetSectionId
        : projectFilterSection !== 'All'
        ? projectFilterSection
        : primarySectionId;

    const targetSec = portfolioSections.find((s) => s.id === targetSectionId);
    const isUiUxSec = isUiUxSection(targetSec);
    const secTitleLower = (targetSec?.title || '').toLowerCase();
    const isPhotoSec =
      !isUiUxSec && (secTitleLower.includes('foto') || secTitleLower.includes('photo'));
    const isVideoSec =
      !isUiUxSec &&
      !isPhotoSec &&
      (secTitleLower.includes('video') ||
        secTitleLower.includes('sinema') ||
        secTitleLower.includes('reel'));

    const figmaApp = applicationsList.find((a) => a.name.toLowerCase().includes('figma'));

    setProjectForm({
      id: `project-${Date.now()}`,
      sectionId: targetSectionId,
      title: '',
      subtitle: '',
      client: '',
      year: '2026',
      category: isUiUxSec
        ? 'UI/UX Design'
        : isPhotoSec
        ? 'Fotografi'
        : isVideoSec
        ? 'Videografi'
        : 'Branding',
      mediaType: isPhotoSec ? 'photo' : isVideoSec ? 'video' : 'graphic',
      summary: '',
      designBrief: '',
      conceptPhilosophy: '',
      tags: isUiUxSec
        ? ['UI/UX Design', 'Design Thinking', 'Figma']
        : isPhotoSec
        ? ['Fotografi']
        : isVideoSec
        ? ['Videografi']
        : ['Branding'],
      aspectRatio: 'standard',
      mockupType: isPhotoSec
        ? 'photo-editorial'
        : isVideoSec
        ? 'cinema-video'
        : isUiUxSec
        ? 'monograph-book'
        : 'bottle-packaging',
      photoGallery: [],
      projectUrl: '',
      projectUrlLabel: isUiUxSec ? 'Buka Prototype Figma' : '',
      videoEmbedUrl: '',
      myRole: {
        title: isUiUxSec
          ? 'UI/UX Designer'
          : isPhotoSec
          ? 'Photographer & Retoucher'
          : isVideoSec
          ? 'Videographer & Video Editor'
          : 'Lead Designer',
        contributionType: isUiUxSec
          ? 'End-to-End Product Design'
          : '100% Eksekusi Mandiri',
        responsibilities: isUiUxSec
          ? [
              'Riset pengguna, perumusan masalah & User Persona (Empathize & Define)',
              'Penyusunan Information Architecture, User Flow & Wireframe (Ideate)',
              'Perancangan UI Design System, Interactive Prototype & Usability Testing (Prototype & Test)',
            ]
          : [
              'Konseptualisasi ide dan arah visual',
              'Eksekusi produksi dan penyuntingan akhir',
            ],
      },
      toolsUsed: isUiUxSec
        ? [
            {
              name: figmaApp?.name || 'Figma',
              code: figmaApp?.shortCode || 'Fg',
              purpose: 'Wireframing, UI Design System & Interactive Prototyping',
              colorBg: figmaApp?.color.bg || 'bg-[#A259FF]/15',
              colorText: figmaApp?.color.text || 'text-[#A259FF]',
            },
          ]
        : isPhotoSec
        ? [
            {
              name: 'Adobe Lightroom & Photoshop',
              code: 'Lr',
              purpose: 'Color grading dan retouching foto',
              colorBg: 'bg-[#31A8FF]/10',
              colorText: 'text-[#31A8FF]',
            },
          ]
        : isVideoSec
        ? [
            {
              name: 'Premiere Pro / DaVinci',
              code: 'Pr',
              purpose: 'Penyuntingan video dan color grading',
              colorBg: 'bg-[#9999FF]/10',
              colorText: 'text-[#9999FF]',
            },
          ]
        : [
            {
              name: 'Adobe Illustrator',
              code: 'Ai',
              purpose: 'Desain identitas visual dan aset grafis',
              colorBg: 'bg-[#FF9A00]/10',
              colorText: 'text-[#FF9A00]',
            },
          ],
      creationProcess: isUiUxSec ? createDefaultUiUxSteps() : [],
      deliverables: isUiUxSec
        ? ['User Persona & User Flow', 'UI Design System', 'Interactive Figma Prototype']
        : ['Aset Visual Resolusi Tinggi'],
      colorPalette: [],
      typographyStack: [],
      impactMetrics: [],
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    soundFx.playTick();
    setEditingProjectId(p.id);
    setModalFormTab('basic');
    setNewGalleryUrlInput('');
    const cloned = JSON.parse(JSON.stringify(p));
    cloned.sectionId = getProjectSectionId(p);
    cloned.photoGallery = cloned.photoGallery || [];
    cloned.projectUrl = cloned.projectUrl || '';
    cloned.projectUrlLabel = cloned.projectUrlLabel || '';
    cloned.videoEmbedUrl = cloned.videoEmbedUrl || '';
    setProjectForm(cloned);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    if (!projectForm.title || !projectForm.title.trim()) {
      setModalFormTab('basic');
      alert('Judul Karya wajib diisi. Silakan isi judul karya pada tab "1. Info Dasar & Media".');
      return;
    }

    const payload: Project = {
      id: projectForm.id || `project-${Date.now()}`,
      sectionId: projectForm.sectionId || primarySectionId,
      title: projectForm.title.trim(),
      subtitle: projectForm.subtitle || '',
      client: projectForm.client?.trim() || 'Karya Personal',
      year: projectForm.year || '2026',
      category: (projectForm.category as ProjectCategory) || 'Branding',
      mediaType: projectForm.mediaType || 'graphic',
      tags: projectForm.tags || ['Desain'],
      featured: projectForm.featured || false,
      customMockupUrl: projectForm.customMockupUrl || '',
      projectUrl: formatExternalUrl(projectForm.projectUrl),
      projectUrlLabel: projectForm.projectUrlLabel?.trim() || '',
      videoEmbedUrl: formatExternalUrl(projectForm.videoEmbedUrl),
      photoGallery: (projectForm.photoGallery || []).filter((img) => img.url && img.url.trim()),
      aspectRatio: projectForm.aspectRatio || 'standard',
      mockupType: projectForm.mockupType || 'bottle-packaging',
      heroTheme: projectForm.heroTheme || {
        bg: 'from-neutral-900 to-black',
        text: 'text-white',
        accent: 'text-lime-400',
        border: 'border-lime-400/30',
        tagBg: 'bg-lime-400/10 text-lime-400',
      },
      summary: projectForm.summary || '',
      designBrief: projectForm.designBrief || '',
      conceptPhilosophy: projectForm.conceptPhilosophy || '',
      myRole: projectForm.myRole || {
        title: 'Lead Designer',
        contributionType: '100% Eksekusi Mandiri',
        responsibilities: ['Eksekusi desain'],
      },
      toolsUsed: projectForm.toolsUsed || [],
      creationProcess: projectForm.creationProcess || [],
      deliverables: projectForm.deliverables || ['File Master'],
      colorPalette: projectForm.colorPalette || [],
      typographyStack: projectForm.typographyStack || [],
      impactMetrics: projectForm.impactMetrics || [],
      printSpecs: projectForm.printSpecs,
      photoSpecs: projectForm.photoSpecs,
      videoSpecs: projectForm.videoSpecs,
    };

    let success = false;
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    if (editingProjectId) {
      success = await updateProject(payload);
      showToast(`Karya "${payload.title}" berhasil diperbarui!`);
    } else {
      success = await addProject(payload);
      showToast(`Karya baru "${payload.title}" berhasil ditambahkan!`);
    }

    if (success) {
      setIsProjectModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    } else {
      alert(
        'Gagal menyimpan ke server.\n\n' +
        '💡 Untuk mengaktifkan tombol Simpan langsung di website live Vercel:\n' +
        'Masukkan GITHUB_TOKEN di Vercel Dashboard -> Settings -> Environment Variables.\n\n' +
        'Atau kelola sementara melalui laptop Anda di http://localhost:3000/asw2026 lalu lakukan git push.'
      );
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus karya "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      const success = await deleteProject(id);
      if (success) {
        showToast(`Karya "${title}" telah dihapus.`);
        if (typeof window !== 'undefined') {
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
        }
      }
    }
  };

  const handleToggleFeatured = async (id: string, title: string) => {
    soundFx.playPop();
    const success = await toggleProjectFeatured(id);
    if (success) {
      showToast(`Status unggulan untuk "${title}" diperbarui!`);
    }
  };

  // Filtered projects
  const filteredProjects = projectsData.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearchQuery.toLowerCase());
    const matchesSection =
      projectFilterSection === 'All' ? true : getProjectSectionId(p) === projectFilterSection;
    const matchesCategory =
      projectFilterCategory === 'All'
        ? true
        : projectFilterCategory === 'Featured'
        ? p.featured
        : p.category === projectFilterCategory;
    return matchesSearch && matchesSection && matchesCategory;
  });

  // ==============================================================
  // PROFILE HANDLERS
  // ==============================================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    const subRolesArray = profileForm.subRoles
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const runningTextArray = profileForm.runningText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const bioArray = profileForm.bio
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const success = await updateProfile({
      name: profileForm.name,
      primaryRole: profileForm.primaryRole,
      subRoles: subRolesArray,
      runningText: runningTextArray,
      photoUrl: profileForm.photoUrl,
      headline: profileForm.headline,
      bioParagraphs: bioArray,
      location: profileForm.location,
      timezone: profileForm.timezone,
      email: profileForm.email,
      phone: profileForm.phone,
      studioAddress: profileForm.studioAddress,
      workingHours: profileForm.workingHours,
      responseTime: profileForm.responseTime,
      portfolioPdfUrl: profileForm.portfolioPdfUrl,
      portfolioSwitcherLabel: profileForm.portfolioSwitcherLabel?.trim() || '',
      hidePortfolioSwitcher: Boolean(profileForm.hidePortfolioSwitcher),
      availability: {
        ...designerProfile.availability,
        status: profileForm.availabilityStatus as 'Available' | 'Limited' | 'Booked',
        currentQuarter: profileForm.availabilityQuarter,
        note: profileForm.availabilityNote,
      },
      statistics: profileForm.stats,
      socials: profileForm.socials,
    });

    if (success) {
      showToast('Profil & Kontak Pribadi berhasil diperbarui!');
    }
  };

  // ==============================================================
  // TACTILE SPECS HANDLERS
  // ==============================================================
  const handleOpenAddTactile = () => {
    soundFx.playTick();
    setEditingTactileIndex(null);
    setTactileForm({
      id: `tactile-${Date.now()}`,
      title: '',
      badge: 'STANDAR MATERIAL',
      description: '',
    });
    setIsTactileModalOpen(true);
  };

  const handleOpenEditTactile = (item: TactileHighlight, idx: number) => {
    soundFx.playTick();
    setEditingTactileIndex(idx);
    setTactileForm(JSON.parse(JSON.stringify(item)));
    setIsTactileModalOpen(true);
  };

  const handleSaveTactile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();
    if (!tactileForm.title) {
      alert('Judul standar cetak wajib diisi.');
      return;
    }
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    let success = false;
    if (editingTactileIndex !== null) {
      success = await updateTactileHighlight(editingTactileIndex, tactileForm);
      showToast(`Standar "${tactileForm.title}" berhasil diperbarui!`);
    } else {
      success = await addTactileHighlight(tactileForm);
      showToast(`Standar baru "${tactileForm.title}" berhasil ditambahkan!`);
    }
    if (success) {
      setIsTactileModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteTactile = async (idx: number, title: string) => {
    if (confirm(`Yakin ingin menghapus standar cetak "${title}"?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      const success = await deleteTactileHighlight(idx);
      if (success) {
        showToast(`Standar cetak "${title}" telah dihapus.`);
        if (typeof window !== 'undefined') {
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
        }
      }
    }
  };

  // ==============================================================
  // INBOX & INQUIRIES HANDLERS
  // ==============================================================
  const unreadCount = inquiries.filter((inq) => !inq.read).length;

  const filteredInquiries = inquiries.filter((inq) => {
    if (inboxFilter === 'unread') return !inq.read;
    if (inboxFilter === 'read') return inq.read;
    return true;
  });

  const handleToggleRead = async (id: string) => {
    soundFx.playTick();
    await toggleInquiryRead(id);
  };

  const handleDeleteInquiryMessage = async (id: string, name: string) => {
    if (confirm(`Hapus pesan permohonan dari "${name}"?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteInquiry(id);
      showToast(`Pesan dari "${name}" telah dihapus.`);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // APPLICATION TOOL HANDLERS
  // ==============================================================
  const handleOpenAddTool = () => {
    soundFx.playTick();
    setEditingToolId(null);
    setToolForm({
      id: `tool-${Date.now()}`,
      name: '',
      shortCode: 'Nw',
      iconUrl: '',
      category: 'Vektor & Brand',
      experienceLevel: 'Primary Daily Driver',
      yearsUsed: '5+ Tahun',
      description: '',
      color: {
        bg: 'bg-neutral-800',
        text: 'text-white',
        border: 'border-neutral-700',
        badge: 'bg-lime-400 text-black',
      },
      keyUseCases: ['Fungsi kapabilitas 1', 'Fungsi kapabilitas 2'],
    });
    setIsToolModalOpen(true);
  };

  const handleOpenEditTool = (t: ApplicationTool) => {
    soundFx.playTick();
    setEditingToolId(t.id);
    setToolForm(JSON.parse(JSON.stringify(t)));
    setIsToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    if (!toolForm.name || !toolForm.shortCode) {
      alert('Nama aplikasi dan singkatan ikon wajib diisi.');
      return;
    }

    const payload: ApplicationTool = {
      id: toolForm.id || `tool-${Date.now()}`,
      name: toolForm.name || '',
      shortCode: toolForm.shortCode || 'Ai',
      iconUrl: (toolForm.iconUrl || '').trim() || undefined,
      category: toolForm.category || 'Vektor & Brand',
      experienceLevel: toolForm.experienceLevel || 'Primary Daily Driver',
      yearsUsed: toolForm.yearsUsed || '5+ Tahun',
      description: toolForm.description || '',
      color: toolForm.color || {
        bg: 'bg-neutral-800',
        text: 'text-white',
        border: 'border-neutral-700',
        badge: 'bg-lime-400 text-black',
      },
      keyUseCases: toolForm.keyUseCases || [],
    };

    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    let success = false;
    if (editingToolId) {
      success = await updateApplication(payload);
      showToast(`Aplikasi "${payload.name}" berhasil diperbarui!`);
    } else {
      success = await addApplication(payload);
      showToast(`Aplikasi baru "${payload.name}" berhasil ditambahkan!`);
    }

    if (success) {
      setIsToolModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteTool = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus software "${name}" dari daftar?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      const success = await deleteApplication(id);
      if (success) {
        showToast(`Software "${name}" telah dihapus.`);
        if (typeof window !== 'undefined') {
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
        }
      }
    }
  };

  // Quick-Add Tool directly from Project Modal (Tab 3)
  const POPULAR_SOFTWARE_PRESETS = [
    {
      name: 'Adobe Illustrator',
      code: 'Ai',
      icon: '/icons/software/illustrator.svg',
      defaultPurpose: 'Desain identitas visual dan aset grafis vektor',
    },
    {
      name: 'Adobe Photoshop',
      code: 'Ps',
      icon: '/icons/software/photoshop.svg',
      defaultPurpose: 'Penyusunan mockup fotorealistik beresolusi tinggi',
    },
    {
      name: 'Figma',
      code: 'Fg',
      icon: '/icons/software/figma.svg',
      defaultPurpose: 'Wireframe, user interface, & prototipe digital interaktif',
    },
    {
      name: 'DaVinci Resolve Studio',
      code: 'Dv',
      icon: '/icons/software/davinci-resolve.svg',
      defaultPurpose: 'Color grading, editing video sinematik, & master audio',
    },
    {
      name: 'Cinema 4D & Octane',
      code: 'C4',
      icon: '/icons/software/cinema4d.svg',
      defaultPurpose: 'Modeling produk 3D & render packaging fotorealistik',
    },
    {
      name: 'Blender',
      code: 'Bl',
      icon: '/icons/software/blender.svg',
      defaultPurpose: 'Modeling objek 3D, animasi ruang, & simulasi material',
    },
    {
      name: 'Adobe Premiere Pro',
      code: 'Pr',
      icon: '/icons/software/premiere.svg',
      defaultPurpose: 'Penyuntingan video ritmis & visual storytelling',
    },
    {
      name: 'Adobe After Effects',
      code: 'Ae',
      icon: '/icons/software/aftereffects.svg',
      defaultPurpose: 'Animasi motion graphic, logo bumper, & efek visual',
    },
    {
      name: 'Adobe InDesign',
      code: 'Id',
      icon: '/icons/software/indesign.svg',
      defaultPurpose: 'Tata letak editorial majalah, booklet, & berkas siap cetak',
    },
    {
      name: 'Adobe Lightroom',
      code: 'Lr',
      icon: '/icons/software/lightroom.svg',
      defaultPurpose: 'Color grading kurasi foto RAW beresolusi tinggi',
    },
    {
      name: 'Glyphs 3',
      code: 'Gl',
      icon: '/icons/software/glyphs.svg',
      defaultPurpose: 'Gambar kurva bezier font tipografi kustom & kerning',
    },
    {
      name: 'CapCut',
      code: 'Ct',
      icon: '/icons/software/capcut.svg',
      defaultPurpose: 'Editing video cepat vertikal & konten media sosial',
    },
    {
      name: 'HTML5',
      code: 'HTML',
      icon: '/icons/software/html.svg',
      defaultPurpose: 'Struktur semantik & markup antarmuka web modern',
    },
    {
      name: 'CSS3',
      code: 'CSS',
      icon: '/icons/software/css.svg',
      defaultPurpose: 'Styling layout responsif, animasi, & desain web',
    },
    {
      name: 'JavaScript',
      code: 'JS',
      icon: '/icons/software/javascript.svg',
      defaultPurpose: 'Logika interaktivitas dinamis & integrasi aplikasi web',
    },
  ];

  const handleQuickAddAndCheckTool = async () => {
    if (!quickToolForm.name.trim()) {
      alert('Nama software wajib diisi.');
      return;
    }

    const trimmedName = quickToolForm.name.trim();
    const shortCode =
      quickToolForm.shortCode.trim() ||
      trimmedName.slice(0, 2).toUpperCase() ||
      'SW';
    const purpose =
      quickToolForm.purpose.trim() || 'Pembuatan aset & pengerjaan proyek';

    // Cek jika software sudah ada di applicationsList
    const existing = applicationsList.find(
      (a) => a.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) {
      const updatedToolsUsed = [
        ...(projectForm.toolsUsed || []).filter(
          (t) => t.name.toLowerCase() !== existing.name.toLowerCase()
        ),
        {
          name: existing.name,
          code: existing.shortCode,
          purpose: purpose || existing.keyUseCases?.[0] || 'Pembuatan aset proyek',
          colorBg: existing.color?.bg || 'bg-neutral-800',
          colorText: existing.color?.text || 'text-white',
          iconUrl: existing.iconUrl,
        },
      ];
      setProjectForm((prev) => ({ ...prev, toolsUsed: updatedToolsUsed }));
      setIsQuickAddToolOpen(false);
      setQuickToolForm({ name: '', shortCode: '', iconUrl: '', purpose: '' });
      soundFx.playPop();
      showToast(`Software "${existing.name}" sudah ada dan langsung diceklis!`);
      return;
    }

    const newApp: ApplicationTool = {
      id: `tool-${Date.now()}`,
      name: trimmedName,
      shortCode,
      iconUrl: quickToolForm.iconUrl.trim() || undefined,
      category: 'Vektor & Brand',
      experienceLevel: 'Primary Daily Driver',
      yearsUsed: '3+ Tahun',
      description: `Perangkat lunak untuk ${purpose.toLowerCase()}`,
      color: {
        bg: 'bg-neutral-800',
        text: 'text-white',
        border: 'border-neutral-700',
        badge: 'bg-lime-400 text-black',
      },
      keyUseCases: [purpose],
    };

    // 1. Tambah ke Software Sehari-hari (applicationsList)
    await addApplication(newApp);

    // 2. Otomatis ceklis di form karya yang sedang diisi
    const updatedToolsUsed = [
      ...(projectForm.toolsUsed || []).filter(
        (t) => t.name.toLowerCase() !== newApp.name.toLowerCase()
      ),
      {
        name: newApp.name,
        code: newApp.shortCode,
        purpose,
        colorBg: newApp.color.bg,
        colorText: newApp.color.text,
        iconUrl: newApp.iconUrl,
      },
    ];
    setProjectForm((prev) => ({ ...prev, toolsUsed: updatedToolsUsed }));

    setQuickToolForm({ name: '', shortCode: '', iconUrl: '', purpose: '' });
    setIsQuickAddToolOpen(false);
    soundFx.playPop();
    showToast(`Software "${newApp.name}" berhasil ditambahkan ke Software Sehari-hari & diceklis!`);
  };

  // ==============================================================
  // SERVICES HANDLERS
  // ==============================================================
  const handleOpenAddService = () => {
    soundFx.playTick();
    setEditingServiceNumber(null);
    setServiceForm({
      number: `0${servicesData.length + 1}`,
      title: '',
      tagline: '',
      description: '',
      deliverables: ['Deliverable 1', 'Deliverable 2'],
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (s: ServiceItem) => {
    soundFx.playTick();
    setEditingServiceNumber(s.number);
    setServiceForm(JSON.parse(JSON.stringify(s)));
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    const cleanDeliverables = (serviceForm.deliverables || [])
      .map((d) => d.trim())
      .filter(Boolean);
    const payload = {
      ...serviceForm,
      tagline: (serviceForm.tagline || '').trim(),
      description: (serviceForm.description || '').trim(),
      deliverables: cleanDeliverables,
    };

    let success = false;
    if (editingServiceNumber) {
      success = await updateService(payload);
      showToast(`Layanan "${payload.title}" berhasil diperbarui!`);
    } else {
      success = await addService(payload);
      showToast(`Layanan baru "${payload.title}" berhasil ditambahkan!`);
    }

    if (success) {
      setIsServiceModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteService = async (number: string, title: string) => {
    if (confirm(`Yakin ingin menghapus layanan "${title}"?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteService(number);
      showToast(`Layanan "${title}" telah dihapus.`);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // CERTIFICATIONS (AWARDS) HANDLERS
  // ==============================================================
  const handleOpenAddAward = () => {
    soundFx.playTick();
    setEditingAwardIndex(null);
    setAwardPositionIndex(0);
    setAwardForm({
      year: '2026',
      award: '',
      project: '',
      institution: '',
      badge: 'Terverifikasi',
      credentialUrl: '',
    });
    setIsAwardModalOpen(true);
  };

  const handleOpenEditAward = (a: AwardItem, idx: number) => {
    soundFx.playTick();
    setEditingAwardIndex(idx);
    setAwardPositionIndex(idx);
    setAwardForm({ ...a, credentialUrl: a.credentialUrl || '' });
    setIsAwardModalOpen(true);
  };

  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    let success = false;
    if (editingAwardIndex !== null) {
      success = await updateAward(awardForm, editingAwardIndex, awardPositionIndex);
      showToast('Sertifikasi & urutan berhasil diperbarui!');
    } else {
      success = await addAward(awardForm, awardPositionIndex);
      showToast('Sertifikasi baru berhasil ditambahkan!');
    }

    if (success) {
      setIsAwardModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleMoveAward = async (idx: number, dir: 'up' | 'down') => {
    soundFx.playTick();
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    const success = await reorderAward(idx, dir);
    if (success) {
      showToast('Urutan sertifikasi diperbarui!');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteAward = async (idx: number, name: string) => {
    if (confirm(`Hapus sertifikasi "${name}"?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteAward(idx);
      showToast('Sertifikasi telah dihapus.');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // EXHIBITIONS HANDLERS
  // ==============================================================
  const handleOpenAddExhibition = () => {
    soundFx.playTick();
    setEditingExhibitionIndex(null);
    setExhibitionForm({ year: '2026', title: '', venue: '', city: '' });
    setIsExhibitionModalOpen(true);
  };

  const handleSaveExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();

    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    let success = false;
    if (editingExhibitionIndex !== null) {
      success = await updateExhibition(exhibitionForm, editingExhibitionIndex);
      showToast('Pameran berhasil diperbarui!');
    } else {
      success = await addExhibition(exhibitionForm);
      showToast('Pameran baru berhasil ditambahkan!');
    }

    if (success) {
      setIsExhibitionModalOpen(false);
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  const handleDeleteExhibition = async (idx: number) => {
    if (confirm('Hapus pameran ini?')) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteExhibition(idx);
      showToast('Pameran telah dihapus.');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // CLIENT HANDLERS
  // ==============================================================
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();
    if (!clientForm.name) return;
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    await addClient(clientForm);
    setClientForm({ name: '', city: '', category: '' });
    setIsClientModalOpen(false);
    showToast('Klien baru berhasil ditambahkan!');
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
    }
  };

  const handleDeleteClient = async (idx: number, name?: string) => {
    if (confirm(`Hapus klien ${name ? `"${name}"` : 'ini'}?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteClient(idx);
      showToast('Klien telah dihapus.');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // TESTIMONIAL HANDLERS
  // ==============================================================
  const handleOpenAddTestimonial = () => {
    soundFx.playTick();
    setEditingTestimonialIndex(null);
    setTestimonialForm({ quote: '', client: '', role: '', company: '', avatarUrl: '' });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: any, idx: number) => {
    soundFx.playTick();
    setEditingTestimonialIndex(idx);
    setTestimonialForm({
      quote: t.quote || '',
      client: t.client || '',
      role: t.role || '',
      company: t.company || '',
      avatarUrl: t.avatarUrl || '',
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPop();
    if (!testimonialForm.quote || !testimonialForm.client) return;
    const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    const payload = {
      quote: testimonialForm.quote.trim(),
      client: testimonialForm.client.trim(),
      role: testimonialForm.role.trim(),
      company: testimonialForm.company.trim(),
      avatarUrl: (testimonialForm.avatarUrl || '').trim() || undefined,
    };
    if (editingTestimonialIndex !== null) {
      await updateTestimonial(editingTestimonialIndex, payload);
      showToast('Testimonial berhasil diperbarui!');
    } else {
      await addTestimonial(payload);
      showToast('Testimonial baru berhasil ditambahkan!');
    }
    setTestimonialForm({ quote: '', client: '', role: '', company: '', avatarUrl: '' });
    setEditingTestimonialIndex(null);
    setIsTestimonialModalOpen(false);
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
    }
  };

  const handleDeleteTestimonial = async (idx: number, client?: string) => {
    if (confirm(`Hapus testimoni dari ${client ? `"${client}"` : 'ini'}?`)) {
      soundFx.playPop();
      const scrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
      await deleteTestimonial(idx);
      showToast('Testimoni telah dihapus.');
      if (typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 20);
      }
    }
  };

  // ==============================================================
  // BACKUP & RESTORE
  // ==============================================================
  const handleExportBackup = () => {
    soundFx.playPop();
    const data = {
      designerProfile,
      portfolioSections,
      projectsData,
      applicationsList,
      servicesData,
      processSteps,
      awardsData,
      exhibitionsData,
      clientRoster,
      testimonials,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-full-database-${Date.now()}.json`;
    a.click();
    showToast('Database lengkap JSON berhasil diunduh!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFx.playPop();
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed.designerProfile && parsed.projectsData) {
            await importDatabase(parsed);
            showToast('Database berhasil dipulihkan dari file JSON!');
          } else {
            alert('Format file JSON tidak valid. Pastikan file backup resmi portofolio.');
          }
        } catch (err) {
          alert('Gagal membaca file JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = async () => {
    if (confirm('PERINGATAN: Seluruh data karya, foto, layanan, dan profil akan dikembalikan ke setelan awal portofolio. Lanjutkan?')) {
      soundFx.playPop();
      await resetToDefault();
      showToast('Database berhasil direset ke data default.');
    }
  };

  // If session is checking
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-lime-400 selection:text-black">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-lime-400 text-black px-5 py-3 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Subtle background motif */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>PORTOFOLIO ADMIN CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Masuk ke Dashboard
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Masukkan kredensial admin untuk mengelola portofolio Anda.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold block">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Masukkan username..."
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-mono"
                  />
                  <User className="w-4 h-4 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-300 font-bold block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-[11px] font-mono text-neutral-400 hover:text-lime-400 cursor-pointer"
                  >
                    {showLoginPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-mono pr-10"
                  />
                  <Key className="w-4 h-4 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs font-mono transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-800/80">
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                  <span>Kredensial Bawaan Pertama Kali:</span>
                </div>
                <p>
                  Username: <code className="text-lime-400 font-bold">admin</code> · Password: <code className="text-lime-400 font-bold">admin</code>
                </p>
                <p className="text-[10px] text-neutral-500">
                  (Dapat Anda atur/ganti kapan saja di tab Pengaturan setelah masuk).
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={portfolioType === 'photographer' ? '/photographer' : '/'}
              className="text-xs font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Portofolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const liveWebHref = portfolioType === 'photographer' ? '/photographer' : '/';

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 font-sans selection:bg-lime-400 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-lime-400 text-black px-5 py-3 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-neutral-800 bg-neutral-950 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={liveWebHref}
            onClick={() => soundFx.playTick()}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Web Portofolio</span>
          </Link>
          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
            <span className="font-bold text-sm font-mono tracking-wider">
              PORTOFOLIO ADMIN CMS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20 font-bold hidden sm:inline">
              {portfolioType === 'photographer' ? '📷 FOTOGRAFI & VIDEO' : '🎨 DESAIN GRAFIS'}
            </span>
          </div>

          {/* Quick Dual-Portfolio Switcher in Admin Header */}
          <div className="hidden lg:flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono">
            <Link
              href="/asw2026"
              className={`px-2.5 py-1 rounded transition-colors ${
                portfolioType === 'graphic'
                  ? 'bg-lime-400 text-black font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Kelola Portofolio Desain Grafis & UI/UX"
            >
              🎨 Desain Grafis
            </Link>
            <Link
              href="/photographer/asw2026"
              className={`px-2.5 py-1 rounded transition-colors ${
                portfolioType === 'photographer'
                  ? 'bg-lime-400 text-black font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Kelola Portofolio Fotografi & Videografi"
            >
              📷 Fotografi & Video
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playTick();
              setActiveTab('security');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-lime-400 text-black border-lime-400 font-bold'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title="Pengaturan Akun & Password"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pengaturan Login</span>
          </button>

          <Link
            href={liveWebHref}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Lihat Web Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            title="Keluar dari Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Executive Studio Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => setActiveTab('projects')}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all space-y-1"
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Total Karya</span>
              <FolderOpen className="w-3.5 h-3.5 text-lime-400" />
            </div>
            <div className="text-xl font-black text-white">{projectsData.length}</div>
            <div className="text-[10px] text-lime-400 font-mono">
              ★ {projectsData.filter((p) => p.featured).length} Unggulan
            </div>
          </div>

          <div
            onClick={() => setActiveTab('tools')}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all space-y-1"
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Software</span>
              <Wrench className="w-3.5 h-3.5 text-lime-400" />
            </div>
            <div className="text-xl font-black text-white">{applicationsList.length}</div>
            <div className="text-[10px] text-neutral-400 font-mono">Arsenal Desain</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('awards');
              setRecognitionSubTab('awards');
            }}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all space-y-1"
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Sertifikasi</span>
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">{awardsData.length}</div>
            <div className="text-[10px] text-amber-400 font-mono">Kompetensi & Lisensi</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('awards');
              setRecognitionSubTab('clients');
            }}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all space-y-1"
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Daftar Klien</span>
              <Building className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-white">{clientRoster.length}</div>
            <div className="text-[10px] text-cyan-400 font-mono">Brand & Institusi</div>
          </div>

          <div
            onClick={() => setActiveTab('projects')}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all space-y-1"
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Section Karya</span>
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">{portfolioSections.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Judul Manual</div>
          </div>

          <div
            onClick={() => setActiveTab('inbox')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
              unreadCount > 0
                ? 'bg-lime-400/10 border-lime-400/40 shadow-lg animate-pulse'
                : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
              <span>Kotak Masuk</span>
              <Inbox className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-lime-400' : 'text-neutral-400'}`} />
            </div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span>{inquiries.length}</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-lime-400 text-black">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            <div className={`text-[10px] font-mono ${unreadCount > 0 ? 'text-lime-400 font-bold' : 'text-neutral-400'}`}>
              {unreadCount > 0 ? 'Ada pesan masuk!' : 'Semua terbaca'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-4 overflow-x-auto scrollbar-none w-full">
          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('projects');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'projects'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Karya & Portofolio ({projectsData.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('profile');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Kontak Pribadi</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('tools');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'tools'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Aplikasi & Software ({applicationsList.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setServicesSubTab('services');
              setActiveTab('services');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'services'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Bidang Keahlian ({servicesData.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('awards');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'awards'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>Klien, Sertifikasi & Testimoni</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('backup');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'backup'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Cadangan & Impor JSON</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTick();
              setActiveTab('security');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'security'
                ? 'bg-neutral-100 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-lime-400" />
            <span>Akun & Keamanan Login</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: MANAJEMEN SECTION & KARYA (SECTIONS + PROJECTS CRUD) */}
        {/* ============================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* PANEL MANAJEMEN SECTION PORTOFOLIO (JUDUL MANUAL) */}
            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-lime-400" />
                    <h2 className="text-lg font-black text-white">
                      Manajemen Section Portofolio (Judul Manual)
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Kelola judul, tata letak, dan urutan section portofolio Anda di halaman web. Gunakan tombol <strong className="text-lime-400">↑ Naik</strong> / <strong className="text-lime-400">↓ Turun</strong> pada tiap kartu atau tentukan posisi saat mengedit section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddSection}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-100 text-black font-mono text-xs font-bold hover:bg-white transition-colors shadow self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Buat Section Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {portfolioSections.map((sec, idx) => {
                  const secCount = projectsData.filter((p) => getProjectSectionId(p) === sec.id).length;
                  const isFirst = idx === 0;
                  const isLast = idx === portfolioSections.length - 1;
                  const posBadgeLabel = isFirst
                    ? 'Paling Atas'
                    : isLast
                    ? 'Paling Bawah'
                    : `Tengah (#${idx + 1})`;
                  return (
                    <div
                      key={sec.id}
                      className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/15 border border-lime-400/30 text-lime-400 font-bold">
                              #{idx + 1} · {posBadgeLabel}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              {sec.layout === 'gallery-3' ? '3 Kolom Galeri Foto/Video' : '2 Kolom Studi Kasus'}
                            </span>
                            {isUiUxSection(sec) && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/15 border border-lime-400/30 text-lime-300 font-bold">
                                ✦ Design Thinking Aktif
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-neutral-400">
                              · {secCount} Karya
                            </span>
                          </div>
                          {sec.eyebrow && (
                            <div className="text-[11px] font-mono uppercase tracking-wider text-lime-400/90 pt-1">
                              {sec.eyebrow}
                            </div>
                          )}
                          <h3 className="text-base font-bold text-white leading-snug">
                            {sec.title}
                          </h3>
                          {sec.subtitle && (
                            <p className="text-xs text-neutral-400 line-clamp-2">{sec.subtitle}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800 shadow-xs">
                          <span className="text-[10px] font-mono text-neutral-400 px-1 hidden sm:inline">
                            Urutan:
                          </span>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveSection(sec.id, 'up')}
                            title="Naikkan posisi section ke atas"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-lime-400 text-neutral-200 hover:text-white hover:bg-neutral-800 disabled:opacity-20 disabled:pointer-events-none text-xs font-mono font-bold transition-all"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-lime-400" />
                            <span>Naik</span>
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveSection(sec.id, 'down')}
                            title="Turunkan posisi section ke bawah"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-lime-400 text-neutral-200 hover:text-white hover:bg-neutral-800 disabled:opacity-20 disabled:pointer-events-none text-xs font-mono font-bold transition-all"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-lime-400" />
                            <span>Turun</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAddProject(sec.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400/15 hover:bg-lime-400 text-lime-300 hover:text-black border border-lime-400/30 font-mono text-[11px] font-bold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Karya di Section Ini</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSection(sec)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1 hover:border-lime-400/50 transition-colors"
                            title="Ubah Judul, Deskripsi & Posisi Urutan Section"
                          >
                            <Edit3 className="w-3 h-3 text-lime-400" />
                            <span>Edit Judul & Posisi</span>
                          </button>
                          {portfolioSections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSection(sec)}
                              className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-red-400 hover:bg-red-500/20"
                              title="Hapus Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HEADER DAFTAR KARYA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-xl border border-neutral-800">
              <div>
                <h2 className="text-xl font-black text-white">Daftar Seluruh Hasil Karya</h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Mendukung Desain Grafis, UI/UX, Motion Graphics, Fotografi (Multi-Foto), dan Videografi.
                </p>
              </div>

              <button
                onClick={() => handleOpenAddProject()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-lg self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Karya Baru</span>
              </button>
            </div>

            {/* Filter Section Pills (shown when >1 section or always clear) */}
            {portfolioSections.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-mono text-neutral-500 shrink-0">Filter Section:</span>
                <button
                  type="button"
                  onClick={() => setProjectFilterSection('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                    projectFilterSection === 'All'
                      ? 'bg-lime-400 text-black font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  Semua Section ({projectsData.length})
                </button>
                {portfolioSections.map((sec) => {
                  const cnt = projectsData.filter((p) => getProjectSectionId(p) === sec.id).length;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setProjectFilterSection(sec.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                        projectFilterSection === sec.id
                          ? 'bg-lime-400 text-black font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {sec.title} ({cnt})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <input
                type="text"
                placeholder="Cari karya berdasarkan judul, klien, atau kategori..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none w-full sm:max-w-md"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {Array.from(
                  new Set([
                    'All',
                    'Featured',
                    'Branding',
                    'Packaging',
                    'Motion Graphics',
                    'Fotografi',
                    'Videografi',
                    'Editorial',
                    'Typography',
                    'Poster Series',
                    ...projectsData.map((p) => p.category).filter(Boolean),
                  ])
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all whitespace-nowrap shrink-0 ${
                      projectFilterCategory === cat
                        ? 'bg-neutral-100 text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat === 'Featured' ? '★ Unggulan' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const secObj = portfolioSections.find((s) => s.id === getProjectSectionId(project));
                return (
                <div
                  key={project.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20 font-bold">
                          {project.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project.id, project.title)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
                            project.featured
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold'
                              : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-white'
                          }`}
                          title="Klik untuk ubah status Unggulan"
                        >
                          <Star className={`w-3 h-3 ${project.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span className="text-[9px]">{project.featured ? 'UNGGULAN' : 'Standar'}</span>
                        </button>
                      </div>
                      <span className="text-neutral-400 shrink-0">{project.year}</span>
                    </div>

                    {secObj && (
                      <div className="text-[10px] font-mono text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded flex items-center justify-between gap-2">
                        <span className="truncate">Section: <strong className="text-neutral-200">{secObj.title}</strong></span>
                        {project.photoGallery && project.photoGallery.length > 0 && (
                          <span className="text-lime-400 shrink-0">+{project.photoGallery.length} Foto</span>
                        )}
                      </div>
                    )}

                    {project.customMockupUrl && (
                      <div className="w-full h-28 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                        <img src={project.customMockupUrl} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">{project.title}</h3>
                      {project.subtitle && (
                        <p className="text-xs text-neutral-400 italic font-serif mt-0.5">{project.subtitle}</p>
                      )}
                    </div>

                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono space-y-1">
                      <div className="text-[10px] text-neutral-500 uppercase">PERAN:</div>
                      <div className="font-bold text-neutral-200 truncate">{project.myRole?.title}</div>
                      <div className="text-[10px] text-lime-400">{project.myRole?.contributionType}</div>
                    </div>

                    {project.summary && (
                      <div className="text-xs text-neutral-400 line-clamp-2">{project.summary}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-[140px]">
                      {project.client || 'Karya Personal'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProject(project)}
                        className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Edit Karya"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        className="p-2 rounded-lg bg-neutral-900 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        title="Hapus Karya"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PROFIL, FOTO & STATISTIK */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-neutral-950 p-6 sm:p-8 rounded-xl border border-neutral-800 max-w-4xl space-y-8">
            <div>
              <h2 className="text-xl font-black text-white">Edit Profil Desainer, Foto & Statistik</h2>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Data ini akan langsung memperbarui bagian Hero, Bio, Statistik Angka, dan Sosial Media di halaman depan.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Foto Profil & Pratinjau */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={profileForm.photoUrl}
                  alt="Avatar Preview"
                  className="w-24 h-28 object-cover rounded-xl border border-neutral-700 shadow-md shrink-0"
                />
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-neutral-400 block">URL Foto Profil *</label>
                    <label className="cursor-pointer text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1.5 bg-lime-400/10 px-2.5 py-1 rounded border border-lime-400/30">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah dari Komputer</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleLocalImageUpload(e, (base64) =>
                            setProfileForm({ ...profileForm, photoUrl: base64 })
                          )
                        }
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={
                      profileForm.photoUrl?.startsWith('data:')
                        ? 'Foto tersimpan dari komputer (atau tempel URL baru)'
                        : 'https://... atau /uploads/...'
                    }
                    value={profileForm.photoUrl?.startsWith('data:') ? '' : profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                  />
                  <div className="text-[11px] font-mono text-neutral-500">
                    Masukkan URL foto Anda atau klik &apos;Unggah dari Komputer&apos; untuk memilih foto dari hard disk perangkat.
                  </div>
                </div>
              </div>

              {/* Nama & Profesi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Profesi Utama *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.primaryRole}
                    onChange={(e) => setProfileForm({ ...profileForm, primaryRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  />
                </div>
              </div>

              {/* Sub-spesialisasi */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">
                  Sub-Spesialisasi di Bagian Hero (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={profileForm.subRoles}
                  onChange={(e) => setProfileForm({ ...profileForm, subRoles: e.target.value })}
                  placeholder="e.g. Digital Designer, UI/UX Designer, Motion Graphics"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                />
              </div>

              {/* Running Text / Pita Teks Berjalan */}
              <div className="p-4 rounded-xl bg-lime-400/5 border border-lime-400/25 space-y-2">
                <label className="text-xs font-mono text-lime-400 font-bold block">
                  Running Text / Teks Berjalan di Pita Pembatas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={profileForm.runningText}
                  onChange={(e) => setProfileForm({ ...profileForm, runningText: e.target.value })}
                  placeholder="Contoh: DIGITAL DESIGNER, UI/UX DESIGNER, MOTION GRAPHICS, FOTOGRAFI, VIDEOGRAFI"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                />
                <div className="text-[11px] font-mono text-neutral-400">
                  Tulis kata atau kalimat yang ingin ditampilkan pada pita teks berjalan (pisahkan tiap poin dengan tanda koma <span className="text-lime-400">,</span>). Kosongkan kolom ini jika ingin menyembunyikan pita running text.
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Headline Pernyataan Desainer</label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">
                  Bio Paragraf (Pisahkan tiap paragraf dengan 2x Enter)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none resize-none"
                />
              </div>

              {/* Lokasi & Ketersediaan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Domisili / Lokasi</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Status Ketersediaan</label>
                  <select
                    value={profileForm.availabilityStatus}
                    onChange={(e) => setProfileForm({ ...profileForm, availabilityStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  >
                    <option value="Available">Available (Terbuka untuk Proyek)</option>
                    <option value="Limited">Limited (Slot Terbatas)</option>
                    <option value="Booked">Booked (Penuh)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Slot Kuartal (Quarter)</label>
                  <input
                    type="text"
                    value={profileForm.availabilityQuarter}
                    onChange={(e) => setProfileForm({ ...profileForm, availabilityQuarter: e.target.value })}
                    placeholder="e.g. Q1 / Q2 2026"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  />
                </div>
              </div>

              {/* KONTAK PRIBADI DESAINER */}
              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                  <Mail className="w-4 h-4" />
                  <span>KONTAK PRIBADI DESAINER</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">Email Pribadi Desainer *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. agung.sabdo.w@gmail.com"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">Nomor WhatsApp / HP Pribadi</label>
                    <input
                      type="text"
                      placeholder="e.g. +62 851-5687-7792"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-mono text-neutral-400">Alamat / Domisili Pribadi</label>
                    <input
                      type="text"
                      placeholder="e.g. Jl. Benda Barat 9, Pondok Benda, Pamulang, Tangerang Selatan"
                      value={profileForm.studioAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, studioAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">Waktu Aktif / Jam Kerja Personal</label>
                    <input
                      type="text"
                      placeholder="e.g. Senin - Jumat: 09:00 - 18:00 WIB"
                      value={profileForm.workingHours}
                      onChange={(e) => setProfileForm({ ...profileForm, workingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">Perkiraan Respon Pesan</label>
                    <input
                      type="text"
                      placeholder="e.g. Dibalas dalam 1x24 jam kerja"
                      value={profileForm.responseTime}
                      onChange={(e) => setProfileForm({ ...profileForm, responseTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-lime-400" />
                        <span>Dokumen Portofolio / CV (Format PDF)</span>
                      </label>
                      {profileForm.portfolioPdfUrl &&
                        profileForm.portfolioPdfUrl !== '#kontak' &&
                        profileForm.portfolioPdfUrl.trim() !== '' && (
                          <a
                            href={profileForm.portfolioPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-lime-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Lihat / Tes Buka Dokumen</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Tempel link Google Drive / Dropbox, atau unggah file PDF langsung 👉"
                          value={profileForm.portfolioPdfUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, portfolioPdfUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700/80 text-sm text-white focus:border-lime-400 outline-none"
                        />
                      </div>
                      <label
                        className={`px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 shadow-sm ${
                          isUploadingPdf ? 'opacity-60 cursor-wait' : ''
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 text-lime-400" />
                        <span>{isUploadingPdf ? 'Mengunggah...' : 'Unggah File PDF'}</span>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          disabled={isUploadingPdf}
                          onChange={handlePdfUpload}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      💡 Anda bisa <strong>mengunggah file PDF langsung dari laptop/HP</strong>, atau menempelkan tautan dokumen dari <strong>Google Drive / Dropbox</strong> (pastikan izin aksesnya diatur ke <em>"Siapa saja yang memiliki link"</em>).
                    </p>
                  </div>
                </div>
              </div>

              {/* EDIT 4 KOTAK STATISTIK PRIBADI */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                  4 KOTAK STATISTIK PENCAPAIAN DESAINER
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileForm.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
                      <div className="text-[10px] font-mono text-neutral-400">KOTAK #{idx + 1}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Nilai (e.g. 54+)"
                          value={stat.number}
                          onChange={(e) => {
                            const updated = [...profileForm.stats];
                            updated[idx].number = e.target.value;
                            setProfileForm({ ...profileForm, stats: updated });
                          }}
                          className="px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-lime-400 font-mono font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Label Utama"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...profileForm.stats];
                            updated[idx].label = e.target.value;
                            setProfileForm({ ...profileForm, stats: updated });
                          }}
                          className="px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white col-span-2"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Keterangan Sublabel"
                        value={stat.sublabel}
                        onChange={(e) => {
                          const updated = [...profileForm.stats];
                          updated[idx].sublabel = e.target.value;
                          setProfileForm({ ...profileForm, stats: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* EDIT DAFTAR AKUN SOSIAL MEDIA */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                    AKUN SOSIAL MEDIA & PORTAL KREATIF
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForm({
                        ...profileForm,
                        socials: [
                          ...profileForm.socials,
                          { platform: 'Platform', username: '@user', url: 'https://' },
                        ],
                      });
                    }}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-800 text-lime-400 hover:bg-neutral-700"
                  >
                    + Tambah Akun
                  </button>
                </div>

                <div className="space-y-2">
                  {profileForm.socials.map((social: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Platform (e.g. Behance)"
                        value={social.platform}
                        onChange={(e) => {
                          const updated = [...profileForm.socials];
                          updated[idx].platform = e.target.value;
                          setProfileForm({ ...profileForm, socials: updated });
                        }}
                        className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white w-28"
                      />
                      <input
                        type="text"
                        placeholder="Username (e.g. @kaelen)"
                        value={social.username}
                        onChange={(e) => {
                          const updated = [...profileForm.socials];
                          updated[idx].username = e.target.value;
                          setProfileForm({ ...profileForm, socials: updated });
                        }}
                        className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 w-36"
                      />
                      <input
                        type="url"
                        placeholder="URL Tautan (https://...)"
                        value={social.url}
                        onChange={(e) => {
                          const updated = [...profileForm.socials];
                          updated[idx].url = e.target.value;
                          setProfileForm({ ...profileForm, socials: updated });
                        }}
                        className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = profileForm.socials.filter((_: any, i: number) => i !== idx);
                          setProfileForm({ ...profileForm, socials: updated });
                        }}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PENGATURAN TOMBOL SWITCHER NAVBAR (TAUTAN PORTOFOLIO KEDUA) */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                    TOMBOL SWITCHER NAVBAR (TAUTAN KE PORTOFOLIO KEDUA)
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Atur teks tombol di pojok kanan atas Navbar untuk berpindah antar portofolio.
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-mono text-neutral-300 font-bold block">
                    Teks Label Tombol Switcher
                  </label>
                  <input
                    type="text"
                    placeholder={
                      portfolioType === 'photographer'
                        ? 'Bawaan: Portofolio Desain'
                        : 'Bawaan: Portofolio Foto & Video'
                    }
                    value={profileForm.portfolioSwitcherLabel || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, portfolioSwitcherLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                  />
                  <div className="text-[10px] font-mono text-neutral-500">
                    Kosongkan jika ingin menggunakan teks bawaan ({portfolioType === 'photographer' ? '"Portofolio Desain"' : '"Portofolio Foto & Video"'}).
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(profileForm.hidePortfolioSwitcher)}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, hidePortfolioSwitcher: e.target.checked })
                    }
                    className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
                  />
                  <span className="text-xs font-mono text-neutral-300">
                    Sembunyikan tombol switcher portofolio ini dari Navbar
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold uppercase hover:bg-lime-300 transition-colors shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Data Profil & Statistik</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: APLIKASI & SOFTWARE (FULL CRUD) */}
        {/* ============================================================== */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Kelola Software Arsenal</h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Tambah software baru (Blender, DaVinci, Premiere, Cinema 4D, Capture One, dll.), edit dan hapus.
                </p>
              </div>

              <button
                onClick={handleOpenAddTool}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-lg self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Software Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicationsList.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {tool.iconUrl ? (
                        <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 shrink-0">
                          <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg ${tool.color.badge}`}
                        >
                          {tool.shortCode}
                        </div>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                        {tool.yearsUsed}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-lg">{tool.name}</h4>
                      <div className="text-xs font-mono text-lime-400">{tool.category}</div>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-3">{tool.description}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-500 text-[11px]">{tool.experienceLevel}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditTool(tool)}
                        className="p-1.5 rounded bg-neutral-900 text-neutral-300 hover:text-white"
                        title="Edit Software"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTool(tool.id, tool.name)}
                        className="p-1.5 rounded bg-neutral-900 text-red-400 hover:bg-red-500/20"
                        title="Hapus Software"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: LAYANAN & METODOLOGI */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {servicesSubTab !== 'methodology' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Bidang Keahlian & Layanan</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Cakupan keahlian desain dan hasil akhir (deliverables) yang Anda kerjakan.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddService}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Keahlian Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {servicesData.map((service) => (
                    <div
                      key={service.number}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-lime-400 font-bold font-mono text-sm">[{service.number}]</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditService(service)}
                              className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.number, service.title)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-white">{service.title}</h4>
                        <p className="text-xs italic font-serif text-neutral-400">&ldquo;{service.tagline}&rdquo;</p>
                        <p className="text-xs text-neutral-300 font-sans leading-relaxed">{service.description}</p>
                      </div>

                      <div className="pt-3 border-t border-neutral-800 space-y-1">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase">Deliverables:</div>
                        {service.deliverables.map((d, i) => (
                          <div key={i} className="text-xs text-neutral-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {servicesSubTab === 'methodology' && (
              <div className="space-y-4">
                <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <h3 className="text-lg font-bold text-white">4 Tahapan Metodologi Studio</h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Ubah narasi cara kerja Anda dari konsep hingga benda fisik/master file.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {processSteps.map((step, idx) => (
                    <div key={step.number} className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-lime-400 font-bold text-base">FASE {step.number}</span>
                        <span className="text-neutral-500">{step.phase}</span>
                      </div>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const updated = { ...step, title: e.target.value };
                          updateProcessStep(updated);
                        }}
                        className="w-full font-bold text-white bg-neutral-900 px-3 py-2 rounded border border-neutral-800 text-sm"
                      />
                      <textarea
                        rows={3}
                        value={step.description}
                        onChange={(e) => {
                          const updated = { ...step, description: e.target.value };
                          updateProcessStep(updated);
                        }}
                        className="w-full text-xs text-neutral-300 bg-neutral-900 px-3 py-2 rounded border border-neutral-800 resize-none font-sans"
                      />
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase">HASIL FASE:</div>
                        <input
                          type="text"
                          value={step.deliverableHighlight}
                          onChange={(e) => {
                            const updated = { ...step, deliverableHighlight: e.target.value };
                            updateProcessStep(updated);
                          }}
                          className="w-full text-xs text-lime-400 font-bold bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: KLIEN, SERTIFIKASI & TESTIMONI */}
        {/* ============================================================== */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setRecognitionSubTab('clients')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  recognitionSubTab === 'clients'
                    ? 'bg-neutral-100 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Daftar Klien ({clientRoster.length})
              </button>
              <button
                onClick={() => setRecognitionSubTab('awards')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  recognitionSubTab === 'awards'
                    ? 'bg-neutral-100 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sertifikasi ({awardsData.length})
              </button>
              <button
                onClick={() => setRecognitionSubTab('testimonials')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  recognitionSubTab === 'testimonials'
                    ? 'bg-neutral-100 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Testimonial ({testimonials.length})
              </button>
            </div>

            {/* Sub-tab 1: Certifications */}
            {recognitionSubTab === 'awards' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Sertifikasi &amp; Lisensi Keahlian</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Daftar sertifikasi kursus, lisensi profesi, bootcamp, atau uji kompetensi keahlian Anda.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAward}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Sertifikasi Baru</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-800 bg-neutral-950 rounded-xl border border-neutral-800 p-4">
                  {awardsData.map((award, idx) => {
                    const posLabel =
                      idx === 0
                        ? 'Atas'
                        : idx === awardsData.length - 1
                        ? 'Bawah'
                        : 'Tengah';
                    return (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-bold">
                              #{idx + 1} · {posLabel}
                            </span>
                            <span className="font-bold text-sm text-white">{award.award}</span>
                            {award.badge && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
                                {award.badge}
                              </span>
                            )}
                            {award.credentialUrl && (
                              <a
                                href={award.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>Bukti Sertifikat</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-neutral-400">
                            Penerbit: <span className="text-neutral-200">{award.institution}</span>
                            {award.project ? ` · Bidang/ID: ${award.project}` : ''} ({award.year})
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveAward(idx, 'up')}
                            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            title="Geser ke Atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === awardsData.length - 1}
                            onClick={() => handleMoveAward(idx, 'down')}
                            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            title="Geser ke Bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditAward(award, idx)}
                            className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
                            title="Edit Sertifikasi"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAward(idx, award.award)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            title="Hapus Sertifikasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {awardsData.length === 0 && (
                    <div className="py-8 text-center text-xs font-mono text-neutral-500">
                      Belum ada data sertifikasi. Klik &ldquo;+ Sertifikasi Baru&rdquo; untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Exhibitions */}
            {recognitionSubTab === 'exhibitions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pameran & Eksibisi Seni</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Arsip eksibisi poster dan pameran galeri desain internasional.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddExhibition}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Pameran Baru</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-800 bg-neutral-950 rounded-xl border border-neutral-800 p-4">
                  {exhibitionsData.map((ex, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm text-white">{ex.title}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {ex.venue}, {ex.city} ({ex.year})
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteExhibition(idx)}
                        className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Clients */}
            {recognitionSubTab === 'clients' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Daftar Klien & Kolaborator Jenama</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Logo & nama jenama yang tampil di dinding klien website portofolio.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsClientModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Klien</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {clientRoster.map((client, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 flex justify-between items-start"
                    >
                      <div>
                        <div className="font-bold text-xs text-white uppercase">{client.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          {client.category} · {client.city}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClient(idx, client.name)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Testimonials */}
            {recognitionSubTab === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Testimonial Klien & Kurator</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Ulasan autentik dari direktur kreatif, kurator, dan pendiri jenama.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddTestimonial}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Testimonial Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-3"
                    >
                      <p className="text-xs italic font-serif text-neutral-300 leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt={t.client}
                              className="w-8 h-8 rounded-full object-cover border border-neutral-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center text-[10px] shrink-0 border border-lime-400/30">
                              {t.client ? t.client.slice(0, 2).toUpperCase() : 'CL'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{t.client}</div>
                            <div className="text-[11px] text-neutral-500">
                              {t.role}{t.company ? `, ${t.company}` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTestimonial(t, idx)}
                            className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800"
                            title="Edit Testimonial"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(idx, t.client)}
                            className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                            title="Hapus Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: STANDAR MATERIALITAS & PRESISE CETAK (TACTILE SPECS) */}
        {/* ============================================================== */}
        {activeTab === 'tactile' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-xl border border-neutral-800">
              <div>
                <h2 className="text-xl font-black text-white">Standar Materialitas & Presisi Cetak</h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Bagian &quot;Obsesi Pada Presisi Fisik & Kertas&quot; di halaman beranda. Kelola standar kertas, foil stamping, sistem Pantone, dan supervisi mesin cetak.
                </p>
              </div>

              <button
                onClick={handleOpenAddTactile}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-lg self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Standar Cetak</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tactileSpecs.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20 font-bold">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">STANDAR #{idx + 1}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">{item.description}</p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-lime-400" />
                      <span>Tampil Aktif di Beranda</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditTactile(item, idx)}
                        className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Edit Standar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTactile(idx, item.title)}
                        className="p-2 rounded-lg bg-neutral-900 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        title="Hapus Standar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: KOTAK MASUK PESAN PRIBADI (INBOX / INQUIRIES) */}
        {/* ============================================================== */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-xl border border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Kotak Masuk Pesan Pribadi</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-lime-400 text-black text-[10px] font-bold font-mono animate-pulse">
                      {unreadCount} Pesan Baru
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Seluruh pesan dan pertanyaan yang dikirimkan melalui formulir &quot;Mari Terhubung & Berbincang&quot; tersimpan di sini.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs font-mono self-start sm:self-auto">
                <button
                  onClick={() => setInboxFilter('all')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    inboxFilter === 'all'
                      ? 'bg-neutral-100 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Semua ({inquiries.length})
                </button>
                <button
                  onClick={() => setInboxFilter('unread')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    inboxFilter === 'unread'
                      ? 'bg-lime-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Belum Dibaca ({unreadCount})
                </button>
                <button
                  onClick={() => setInboxFilter('read')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    inboxFilter === 'read'
                      ? 'bg-neutral-100 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sudah Dibaca ({inquiries.length - unreadCount})
                </button>
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-neutral-500 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Tidak Ada Pesan</h3>
                <p className="text-xs text-neutral-400 font-mono max-w-sm mx-auto">
                  {inboxFilter === 'unread'
                    ? 'Bagus! Semua pesan kontak pribadi telah Anda baca.'
                    : 'Belum ada pesan masuk dalam arsip ini.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-6 rounded-xl border transition-all ${
                      inq.read
                        ? 'bg-neutral-950/70 border-neutral-800/80'
                        : 'bg-neutral-950 border-lime-400/50 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
                      <div className="flex items-center gap-3">
                        {!inq.read ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lime-400 text-black text-[10px] font-bold font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                            PESAN BARU
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-500 uppercase px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                            TERBACA
                          </span>
                        )}
                        <h3 className="font-black text-base text-white">{inq.name}</h3>
                        <span className="text-xs text-neutral-400 font-mono">{inq.company || 'Independen'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(inq.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="py-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="text-neutral-500 uppercase text-[10px]">Disiplin:</span>
                        {inq.scopes && inq.scopes.length > 0 ? (
                          inq.scopes.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 text-lime-300 border border-neutral-800 text-[11px]">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-neutral-500">Umum</span>
                        )}

                        <span className="text-neutral-500 uppercase text-[10px] ml-2">Anggaran:</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-800 text-[11px] font-bold">
                          {inq.budget || 'Menyesuaikan'}
                        </span>
                      </div>

                      <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800/80 text-sm text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
                        {inq.message}
                      </div>

                      <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-lime-400" />
                        <span>Email Pengirim:</span>
                        <a href={`mailto:${inq.email}`} className="text-white hover:underline font-bold">
                          {inq.email}
                        </a>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(inq.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{inq.read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</span>
                        </button>

                        <a
                          href={`mailto:${inq.email}?subject=Tanggapan Pesan - ${encodeURIComponent(designerProfile.name)}&body=Halo ${encodeURIComponent(inq.name)},%0D%0A%0D%0ATerima kasih telah menghubungi saya langsung mengenai kebutuhan desain Anda.%0D%0A%0D%0ASalam hangat,%0D%0A${encodeURIComponent(designerProfile.name)}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black text-xs font-mono font-bold transition-colors shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Balas via Email</span>
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteInquiryMessage(inq.id, inq.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-xs font-mono transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Pesan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: CADANGAN & IMPOR/EKSPOR */}
        {/* ============================================================== */}
        {activeTab === 'backup' && (
          <div className="bg-neutral-950 p-6 sm:p-8 rounded-xl border border-neutral-800 max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Cadangan, Ekspor & Pemulihan</h2>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Unduh file cadangan seluruh karya, section portofolio, foto, keahlian, dan sertifikasi Anda dalam format JSON untuk keamanan data.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Ekspor JSON */}
              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Ekspor Seluruh Database JSON</div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5">
                    Unduh file lengkap portofolio Anda ke komputer.
                  </div>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-100 text-black font-mono text-xs font-bold hover:bg-white transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File JSON</span>
                </button>
              </div>

              {/* Impor JSON */}
              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Impor & Pulihkan dari File JSON</div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5">
                    Unggah file backup JSON untuk mengganti isi database.
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    ref={importFileRef}
                    onChange={handleImportBackup}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => importFileRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File Backup</span>
                  </button>
                </div>
              </div>

              {/* Reset to Factory Default */}
              <div className="p-5 rounded-xl bg-red-950/20 border border-red-900/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-red-300">Reset ke Setelan Awal Portofolio</div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5">
                    Kembalikan seluruh karya dan profil ke data contoh bawaan portofolio.
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Database</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: PENGATURAN AKUN & KEAMANAN LOGIN */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-lime-400" />
                    <h2 className="text-xl font-black text-white">
                      Pengaturan Akun & Keamanan Login Admin
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Atur username dan password yang digunakan untuk mengakses halaman manajemen portofolio ini.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Admin</span>
                </button>
              </div>

              {/* Form Ubah Kredensial */}
              <form onSubmit={handleSaveSecuritySettings} className="max-w-xl space-y-5">
                <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300 font-bold block">
                      Username Admin *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin atau agung"
                      value={securityForm.username}
                      onChange={(e) => setSecurityForm({ ...securityForm, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-mono"
                    />
                    <p className="text-[11px] font-mono text-neutral-500">
                      Username saat ini: <span className="text-lime-400 font-bold">{adminAuth.username || 'admin'}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-neutral-300 font-bold block">
                        Ganti Password Baru <span className="text-neutral-500 font-normal">(Kosongkan jika tetap password lama)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                        className="text-[11px] font-mono text-lime-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showSecurityPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showSecurityPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400">
                          Password Baru
                        </label>
                        <input
                          type={showSecurityPassword ? 'text' : 'password'}
                          placeholder="Ketik password baru jika ingin mengubah..."
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-mono"
                        />
                      </div>

                      {securityForm.newPassword && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">
                            Konfirmasi Ulang Password Baru *
                          </label>
                          <input
                            type={showSecurityPassword ? 'text' : 'password'}
                            required
                            placeholder="Ketik ulang password baru..."
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-lime-400/5 border border-lime-400/20 space-y-2">
                  <div className="text-xs font-bold font-mono text-lime-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Catatan Keamanan:</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Kredensial ini akan langsung aktif. Setiap kali Anda membuka halaman <code>/asw2026</code> dari peramban baru atau setelah mengklik <strong>Keluar</strong>, Anda akan diminta memasukkan username dan password ini.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Login</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: FORMULIR DETAIL TAMBAH / EDIT KARYA LENGKAP */}
      {/* ============================================================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                <h3 className="font-black text-white text-base">
                  {editingProjectId ? `Edit Karya: ${projectForm.title}` : 'Tambah Karya Multidisiplin Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-1 px-6 py-2.5 bg-neutral-900/60 border-b border-neutral-800 overflow-x-auto scrollbar-none text-xs font-mono">
              {[
                { id: 'basic', label: '1. Info Dasar & Media' },
                { id: 'role', label: '2. Peran Desainer' },
                { id: 'tools', label: '3. Software yang Digunakan' },
                { id: 'process', label: '4. Proses Step-by-Step' },
                { id: 'deliverables', label: '5. Deliverables & Warna' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalFormTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                    modalFormTab === tab.id
                      ? 'bg-lime-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
              {/* TAB A: INFO DASAR */}
              {modalFormTab === 'basic' && (
                <div className="space-y-5">
                  {/* PILIH SECTION PORTOFOLIO */}
                  <div className="p-4 rounded-xl bg-lime-400/5 border border-lime-400/25 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-mono text-lime-400 font-bold flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Tampilkan Karya Ini pada Section Portofolio:</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleOpenAddSection}
                        className="text-[11px] font-mono text-lime-300 hover:text-lime-200 underline"
                      >
                        + Buat Judul Section Baru
                      </button>
                    </div>
                    <select
                      value={projectForm.sectionId || primarySectionId}
                      onChange={(e) => {
                        const nextSecId = e.target.value;
                        const nextSec = portfolioSections.find((s) => s.id === nextSecId);
                        const nextIsUiUx = isUiUxSection(nextSec);

                        if (
                          !editingProjectId &&
                          nextIsUiUx &&
                          (!projectForm.creationProcess || projectForm.creationProcess.length === 0)
                        ) {
                          const figmaApp = applicationsList.find((a) =>
                            a.name.toLowerCase().includes('figma')
                          );
                          setProjectForm({
                            ...projectForm,
                            sectionId: nextSecId,
                            category: 'UI/UX Design',
                            mediaType: 'graphic',
                            mockupType: 'monograph-book',
                            myRole: {
                              title: 'UI/UX Designer',
                              contributionType: 'End-to-End Product Design',
                              responsibilities: [
                                'Riset pengguna, perumusan masalah & User Persona (Empathize & Define)',
                                'Penyusunan Information Architecture, User Flow & Wireframe (Ideate)',
                                'Perancangan UI Design System, Interactive Prototype & Usability Testing (Prototype & Test)',
                              ],
                            },
                            toolsUsed: [
                              {
                                name: figmaApp?.name || 'Figma',
                                code: figmaApp?.shortCode || 'Fg',
                                purpose: 'Wireframing, UI Design System & Interactive Prototyping',
                                colorBg: figmaApp?.color.bg || 'bg-[#A259FF]/15',
                                colorText: figmaApp?.color.text || 'text-[#A259FF]',
                              },
                            ],
                            projectUrlLabel: projectForm.projectUrlLabel || 'Buka Prototype Figma',
                            creationProcess: createDefaultUiUxSteps(),
                          });
                        } else {
                          setProjectForm({ ...projectForm, sectionId: nextSecId });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-semibold"
                    >
                      {portfolioSections.map((sec, idx) => (
                        <option key={sec.id} value={sec.id}>
                          Section #{idx + 1}: {sec.title}{' '}
                          ({sec.layout === 'gallery-3' ? '3 Kolom Galeri' : '2 Kolom Studi Kasus'}
                          {isUiUxSection(sec) ? ' · Design Thinking' : ''})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Judul Karya *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dokumentasi Event / Potret Editorial / Brand Identity"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">
                        Nama Klien / Lembaga <span className="text-neutral-500">(Opsional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Kosongkan jika Karya Personal / Eksplorasi Pribadi"
                        value={projectForm.client}
                        onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Kategori Disiplin (Bisa Ketik Manual / Pilih Preset) & Tahun */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-neutral-300 font-bold">
                          Kategori Disiplin * <span className="text-lime-400 font-normal">(Bisa Ketik Manual)</span>
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Ketik bebas atau klik preset
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          list="category-suggestions"
                          placeholder="Ketik manual (e.g. Ilustrasi Digital, 3D Art, UI/UX, Kemasan Kopi...)"
                          value={projectForm.category || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const lower = val.toLowerCase();
                            let suggestedMediaType = projectForm.mediaType || 'graphic';
                            let suggestedMockup = projectForm.mockupType || 'bottle-packaging';

                            if (lower.includes('motion') || lower.includes('3d') || lower.includes('animasi')) {
                              suggestedMediaType = 'motion';
                              suggestedMockup = 'motion-reel';
                            } else if (lower.includes('foto') || lower.includes('photo')) {
                              suggestedMediaType = 'photo';
                              suggestedMockup = 'photo-editorial';
                            } else if (lower.includes('video') || lower.includes('cinema') || lower.includes('film') || lower.includes('sinema')) {
                              suggestedMediaType = 'video';
                              suggestedMockup = 'cinema-video';
                            }

                            setProjectForm({
                              ...projectForm,
                              category: val,
                              mediaType: suggestedMediaType,
                              mockupType: suggestedMockup,
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-sans"
                        />

                        <datalist id="category-suggestions">
                          <option value="Branding" />
                          <option value="Packaging" />
                          <option value="Motion Graphics" />
                          <option value="Fotografi" />
                          <option value="Videografi" />
                          <option value="Editorial" />
                          <option value="Typography" />
                          <option value="Poster Series" />
                          <option value="Ilustrasi Digital" />
                          <option value="3D Art & CGI" />
                          <option value="UI/UX & Web Design" />
                          <option value="Fashion Editorial" />
                          <option value="Kemasan Produk" />
                          <option value="Art Direction" />
                          {Array.from(new Set(projectsData.map((p) => p.category)))
                            .filter(Boolean)
                            .map((cat) => (
                              <option key={cat} value={cat} />
                            ))}
                        </datalist>
                      </div>

                      {/* Quick Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-neutral-500 mr-0.5">Preset:</span>
                        {[
                          'Branding',
                          'UI/UX Design',
                          'Packaging',
                          'Motion Graphics',
                          'Fotografi',
                          'Videografi',
                          'Editorial',
                          'Typography',
                          'Poster Series',
                          'Ilustrasi',
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              soundFx.playTick();
                              const lower = preset.toLowerCase();
                              setProjectForm({
                                ...projectForm,
                                category: preset,
                                mediaType:
                                  lower.includes('motion')
                                    ? 'motion'
                                    : lower.includes('foto')
                                    ? 'photo'
                                    : lower.includes('video')
                                    ? 'video'
                                    : 'graphic',
                                mockupType:
                                  lower.includes('motion')
                                    ? 'motion-reel'
                                    : lower.includes('foto')
                                    ? 'photo-editorial'
                                    : lower.includes('video')
                                    ? 'cinema-video'
                                    : 'bottle-packaging',
                              });
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              projectForm.category === preset
                                ? 'bg-lime-400 text-black font-bold'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="text-xs font-mono text-neutral-400">Tahun Produksi</label>
                      <input
                        type="text"
                        value={projectForm.year}
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Tipe Media & Sub-Judul Karya */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Tipe Media Disiplin</label>
                      <select
                        value={projectForm.mediaType || 'graphic'}
                        onChange={(e) => {
                          const nextMedia = e.target.value as 'graphic' | 'photo' | 'video' | 'motion';
                          const autoMockup =
                            nextMedia === 'motion'
                              ? 'motion-reel'
                              : nextMedia === 'photo'
                              ? 'photo-editorial'
                              : nextMedia === 'video'
                              ? 'cinema-video'
                              : 'monograph-book';
                          setProjectForm({
                            ...projectForm,
                            mediaType: nextMedia,
                            mockupType: autoMockup,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      >
                        <option value="graphic">Desain Grafis / UI-UX / Visual 2D</option>
                        <option value="photo">Fotografi</option>
                        <option value="video">Videografi & Sinematografi</option>
                        <option value="motion">Motion Graphics & Animasi 3D</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">
                        Sub-Judul / Tagline Karya <span className="text-neutral-500">(Opsional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Identitas Visual & Desain Kemasan"
                        value={projectForm.subtitle}
                        onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">
                      Ringkasan Singkat Karya <span className="text-neutral-500">(Opsional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Deskripsi singkat tentang foto, video, atau proyek desain ini..."
                      value={projectForm.summary}
                      onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none resize-none font-sans"
                    />
                  </div>

                  {(() => {
                    const selectedSec = portfolioSections.find(
                      (s) => s.id === (projectForm.sectionId || primarySectionId)
                    );
                    const isUiUxForm =
                      isUiUxSection(selectedSec) || isUiUxTitle(projectForm.category);

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neutral-400">
                            {isUiUxForm
                              ? 'Empathize & Define — Masalah & Kebutuhan Pengguna (Opsional)'
                              : 'Design Brief & Tantangan (Opsional)'}
                          </label>
                          <textarea
                            rows={2}
                            placeholder={
                              isUiUxForm
                                ? 'Jelaskan kendala (pain points) pengguna dan rumusan masalah produk...'
                                : undefined
                            }
                            value={projectForm.designBrief}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, designBrief: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neutral-400">
                            {isUiUxForm
                              ? 'Ideate & Prototype — Solusi Arsitektur UI/UX (Opsional)'
                              : 'Solusi & Pendekatan Visual (Opsional)'}
                          </label>
                          <textarea
                            rows={2}
                            placeholder={
                              isUiUxForm
                                ? 'Jelaskan pendekatan alur navigasi, wireframe, dan sistem UI yang dirancang...'
                                : undefined
                            }
                            value={projectForm.conceptPhilosophy}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, conceptPhilosophy: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* KARYA UNGGULAN & TAUTAN */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={projectForm.featured || false}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
                    />
                    <label htmlFor="featured-checkbox" className="text-xs font-mono text-white cursor-pointer select-none flex items-center gap-2">
                      <Star className={`w-4 h-4 ${projectForm.featured ? 'fill-amber-400 text-amber-400' : 'text-neutral-500'}`} />
                      <span>Karya Unggulan (Tampilkan Badge & Prioritas)</span>
                    </label>
                  </div>

                  {/* SECTION TAUTAN PROYEK & FIGMA PROTOTYPE */}
                  {(() => {
                    const detectedLink = analyzeProjectLink(projectForm.projectUrl);
                    return (
                      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <label className="text-xs font-mono text-white font-bold flex items-center gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
                              <span>Tautan Langsung Proyek (Figma Prototype / Live Website)</span>
                            </label>
                            <p className="text-[11px] font-mono text-neutral-400">
                              Masukkan link Figma prototype atau website live agar tombol aksi muncul di halaman portofolio & studi kasus.
                            </p>
                          </div>
                          {detectedLink && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/15 border border-lime-400/30 text-lime-300 font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Terdeteksi: {detectedLink.isFigma ? 'Prototype Figma' : detectedLink.domainName}</span>
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-7 space-y-1">
                            <label className="text-[11px] font-mono text-neutral-400">
                              URL Proyek / Prototype Figma
                            </label>
                            <input
                              type="text"
                              placeholder="https://www.figma.com/proto/... atau https://sipam.id"
                              value={projectForm.projectUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const nextAnalysis = analyzeProjectLink(val);
                                const autoLabel =
                                  !projectForm.projectUrlLabel && nextAnalysis
                                    ? nextAnalysis.defaultLabel
                                    : projectForm.projectUrlLabel;
                                setProjectForm({
                                  ...projectForm,
                                  projectUrl: val,
                                  projectUrlLabel: autoLabel,
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-[11px] font-mono text-neutral-400">
                              Teks Tombol (Opsional)
                            </label>
                            <input
                              type="text"
                              placeholder={detectedLink ? detectedLink.defaultLabel : 'e.g. Buka Prototype Figma'}
                              value={projectForm.projectUrlLabel || ''}
                              onChange={(e) => setProjectForm({ ...projectForm, projectUrlLabel: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                            />
                          </div>
                        </div>

                        {/* Quick Preset Buttons for Link Label */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono text-neutral-500 mr-1">Preset Label:</span>
                          {[
                            'Buka Prototype Figma',
                            'Kunjungi Website Live',
                            'Buka Desain di Figma',
                            'Lihat Studi Kasus Behance',
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                soundFx.playTick();
                                setProjectForm({ ...projectForm, projectUrlLabel: preset });
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-lime-400 transition-colors cursor-pointer"
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* LINK VIDEO / REEL TAMBAHAN */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">
                      Link Video / Reel Tambahan (Opsional — Instagram Reels, YouTube, Vimeo, GDrive)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.instagram.com/reel/... atau YouTube / Vimeo"
                      value={projectForm.videoEmbedUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, videoEmbedUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-mono"
                    />
                  </div>

                  {/* UPLOAD BERKAS GAMBAR UTAMA / COVER */}
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-mono text-white font-bold block">
                          Foto Sampul Utama / Cover Karya
                        </label>
                        <p className="text-[11px] font-mono text-neutral-400">
                          Unggah foto utama karya atau thumbnail video Anda dari komputer.
                        </p>
                      </div>
                      <label className="cursor-pointer text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1.5 bg-lime-400/10 px-3 py-1.5 rounded-lg border border-lime-400/30 font-bold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Sampul dari PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleLocalImageUpload(e, (base64) =>
                              setProjectForm({ ...projectForm, customMockupUrl: base64 })
                            )
                          }
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder={
                        projectForm.customMockupUrl?.startsWith('data:')
                          ? 'Gambar tersimpan dari komputer (atau tempel URL baru)'
                          : 'Atau tempel URL gambar sampul (https://...)'
                      }
                      value={
                        projectForm.customMockupUrl?.startsWith('data:')
                          ? ''
                          : projectForm.customMockupUrl || ''
                      }
                      onChange={(e) => setProjectForm({ ...projectForm, customMockupUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                    />

                    {projectForm.customMockupUrl && (
                      <div className="flex items-center gap-4 p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                        <img
                          src={projectForm.customMockupUrl}
                          alt="Cover Preview"
                          className="w-24 h-16 object-cover rounded border border-neutral-700"
                        />
                        <div className="flex-1 text-xs font-mono text-neutral-400">
                          <span className="text-emerald-400 font-bold">✓ Foto sampul aktif</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, customMockupUrl: '' })}
                          className="text-xs font-mono text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10"
                        >
                          Hapus Sampul
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GALERI MULTI-FOTO TAMBAHAN (IDEAL UNTUK SERI FOTOGRAFI / DOKUMENTASI) */}
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-mono text-white font-bold flex items-center gap-1.5">
                          <Images className="w-3.5 h-3.5 text-lime-400" />
                          <span>Galeri Foto Tambahan (Opsional — Cocok untuk Seri Fotografi)</span>
                        </label>
                        <p className="text-[11px] font-mono text-neutral-400">
                          Bisa memilih banyak foto sekaligus dari komputer untuk ditampilkan di dalam detail karya.
                        </p>
                      </div>
                      <label className="cursor-pointer text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1.5 bg-lime-400/10 px-3 py-1.5 rounded-lg border border-lime-400/30 font-bold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Unggah Banyak Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleMultiGalleryUpload}
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Atau tempel URL foto tambahan (https://...)"
                        value={newGalleryUrlInput}
                        onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newGalleryUrlInput.trim()) return;
                          setProjectForm({
                            ...projectForm,
                            photoGallery: [
                              ...(projectForm.photoGallery || []),
                              { url: newGalleryUrlInput.trim(), caption: '' },
                            ],
                          });
                          setNewGalleryUrlInput('');
                        }}
                        className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white shrink-0"
                      >
                        + Tambah URL
                      </button>
                    </div>

                    {projectForm.photoGallery && projectForm.photoGallery.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {projectForm.photoGallery.map((img, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800"
                          >
                            <img
                              src={img.url}
                              alt={`Galeri ${gIdx + 1}`}
                              className="w-14 h-14 object-cover rounded border border-neutral-800 shrink-0"
                            />
                            <input
                              type="text"
                              placeholder="Keterangan foto (opsional)"
                              value={img.caption || ''}
                              onChange={(e) => {
                                const updated = [...(projectForm.photoGallery || [])];
                                updated[gIdx] = { ...updated[gIdx], caption: e.target.value };
                                setProjectForm({ ...projectForm, photoGallery: updated });
                              }}
                              className="flex-1 min-w-0 px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-lime-400"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (projectForm.photoGallery || []).filter(
                                  (_, idx) => idx !== gIdx
                                );
                                setProjectForm({ ...projectForm, photoGallery: updated });
                              }}
                              className="p-1.5 rounded text-red-400 hover:bg-red-500/20 shrink-0"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB B: PERAN DESAINER */}
              {modalFormTab === 'role' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Judul Peran Anda *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead 3D Motion Director / Cinematographer / Packaging Designer"
                        value={projectForm.myRole?.title}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            myRole: { ...projectForm.myRole!, title: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-400">Tipe Kontribusi *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sole Art Direction & Animation (100%)"
                        value={projectForm.myRole?.contributionType}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            myRole: { ...projectForm.myRole!, contributionType: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono text-neutral-400 uppercase">
                        Daftar Tanggung Jawab Utama:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(projectForm.myRole?.responsibilities || []), ''];
                          setProjectForm({
                            ...projectForm,
                            myRole: { ...projectForm.myRole!, responsibilities: updated },
                          });
                        }}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-800 text-lime-400"
                      >
                        + Tambah Tanggung Jawab
                      </button>
                    </div>

                    <div className="space-y-2">
                      {projectForm.myRole?.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={resp}
                            onChange={(e) => {
                              const updated = [...projectForm.myRole!.responsibilities];
                              updated[idx] = e.target.value;
                              setProjectForm({
                                ...projectForm,
                                myRole: { ...projectForm.myRole!, responsibilities: updated },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = projectForm.myRole!.responsibilities.filter((_, i) => i !== idx);
                              setProjectForm({
                                ...projectForm,
                                myRole: { ...projectForm.myRole!, responsibilities: updated },
                              });
                            }}
                            className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB C: SOFTWARE YANG DIGUNAKAN */}
              {modalFormTab === 'tools' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <div className="text-xs font-mono text-neutral-300">
                      Pilih software yang digunakan untuk karya ini. Software baru otomatis tersimpan ke <span className="text-lime-400 font-bold">Software Sehari-hari</span>:
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsQuickAddToolOpen(!isQuickAddToolOpen)}
                      className="px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 hover:bg-lime-400/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isQuickAddToolOpen ? 'Tutup Form Tambah' : '+ Tambah Software Baru'}</span>
                    </button>
                  </div>

                  {/* Panel Cepat Tambah Software Langsung dari Tab Ini */}
                  {isQuickAddToolOpen && (
                    <div className="p-4 rounded-xl bg-neutral-900 border border-lime-400/30 space-y-3.5 shadow-xl animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-lime-400 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Tambah Software Baru (Logo Resmi & Ceklis):</span>
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Tersimpan otomatis ke Software Sehari-hari
                        </span>
                      </div>

                      {/* Pilihan Preset Logo Cepat dengan Icon Asli */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                          Pilih Cepat Logo Software Populer:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_SOFTWARE_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setQuickToolForm({
                                  name: preset.name,
                                  shortCode: preset.code,
                                  iconUrl: preset.icon,
                                  purpose: preset.defaultPurpose,
                                });
                              }}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                                quickToolForm.name === preset.name
                                  ? 'bg-lime-400/20 border-lime-400 text-lime-400 font-bold shadow-xs'
                                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                              }`}
                            >
                              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                <img src={preset.icon} alt={preset.name} className="w-full h-full object-contain" />
                              </div>
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">Nama Software *</label>
                          <input
                            type="text"
                            placeholder="e.g. Blender, Cinema 4D, Canva, Corel..."
                            value={quickToolForm.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuickToolForm((prev) => ({
                                ...prev,
                                name: val,
                                shortCode: prev.shortCode || (val.slice(0, 2).toUpperCase() || 'SW'),
                              }));
                            }}
                            className="w-full px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-mono"
                          />
                        </div>

                        {/* Pratinjau Icon Software */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">Logo Icon Terpilih</label>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {quickToolForm.iconUrl ? (
                                <img src={quickToolForm.iconUrl} alt="Logo" className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-xs font-bold text-neutral-500">?</span>
                              )}
                            </div>
                            <label className="cursor-pointer text-[11px] font-mono text-lime-400 hover:text-lime-300 bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded">
                              Unggah Icon
                              <input
                                type="file"
                                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                                className="hidden"
                                onChange={(e) =>
                                  handleLocalImageUpload(e, (url) =>
                                    setQuickToolForm((prev) => ({ ...prev, iconUrl: url }))
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400">
                          Peran / Fungsi Spesifik di Proyek Ini (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Modeling kemasan 3D & render visual fotorealistik"
                          value={quickToolForm.purpose}
                          onChange={(e) => setQuickToolForm({ ...quickToolForm, purpose: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setIsQuickAddToolOpen(false)}
                          className="px-3 py-1 text-xs font-mono text-neutral-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleQuickAddAndCheckTool}
                          className="px-4 py-1.5 rounded bg-lime-400 text-black text-xs font-mono font-bold hover:bg-lime-300 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambahkan ke Sehari-hari & Ceklis</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grid Checkbox Software dengan Logo Resmi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {applicationsList.map((app) => {
                      const isUsed = projectForm.toolsUsed?.some((t) => t.name === app.name);
                      const currentPurpose =
                        projectForm.toolsUsed?.find((t) => t.name === app.name)?.purpose || '';

                      return (
                        <div
                          key={app.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isUsed ? 'bg-neutral-900 border-lime-400/50 shadow-sm' : 'bg-neutral-950 border-neutral-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isUsed}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const updated = [
                                      ...(projectForm.toolsUsed || []).filter((t) => t.name !== app.name),
                                      {
                                        name: app.name,
                                        code: app.shortCode,
                                        purpose: app.keyUseCases?.[0] || 'Pembuatan aset proyek',
                                        colorBg: app.color?.bg || 'bg-neutral-800',
                                        colorText: app.color?.text || 'text-white',
                                        iconUrl: app.iconUrl,
                                      },
                                    ];
                                    setProjectForm({ ...projectForm, toolsUsed: updated });
                                  } else {
                                    const updated = projectForm.toolsUsed?.filter((t) => t.name !== app.name);
                                    setProjectForm({ ...projectForm, toolsUsed: updated });
                                  }
                                }}
                                className="accent-lime-400 w-4 h-4 rounded shrink-0"
                              />

                              {/* Logo Resmi Software */}
                              <div className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
                                {app.iconUrl ? (
                                  <img
                                    src={app.iconUrl}
                                    alt={app.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="text-xs font-mono font-bold text-lime-400">
                                    {app.shortCode}
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs text-white block truncate">{app.name}</span>
                                <span className="text-[10px] font-mono text-neutral-400 block truncate">{app.category}</span>
                              </div>
                            </label>
                          </div>

                          {isUsed && (
                            <input
                              type="text"
                              placeholder="Jelaskan peran spesifik aplikasi di proyek ini..."
                              value={currentPurpose}
                              onChange={(e) => {
                                const updated = projectForm.toolsUsed?.map((t) =>
                                  t.name === app.name ? { ...t, purpose: e.target.value } : t
                                );
                                setProjectForm({ ...projectForm, toolsUsed: updated });
                              }}
                              className="w-full px-2.5 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono focus:border-lime-400 outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB D: PROSES PEMBUATAN STEP-BY-STEP */}
              {modalFormTab === 'process' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="text-xs font-mono text-neutral-400">
                      Rincian fase tahapan pengerjaan proyek:
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            projectForm.creationProcess &&
                            projectForm.creationProcess.length > 0 &&
                            !confirm(
                              'Ganti tahapan saat ini dengan 5 tahap standar Design Thinking (Empathize, Define, Ideate, Prototype, Test)?'
                            )
                          ) {
                            return;
                          }
                          soundFx.playPop();
                          setProjectForm({
                            ...projectForm,
                            creationProcess: createDefaultUiUxSteps(),
                          });
                        }}
                        className="text-xs font-mono px-3 py-1.5 rounded bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/40 text-lime-300 font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Isi 5 Tahap Design Thinking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextNum = `0${(projectForm.creationProcess?.length || 0) + 1}`;
                          const updated = [
                            ...(projectForm.creationProcess || []),
                            {
                              stepNumber: nextNum,
                              title: 'Tahap Baru',
                              duration: 'Minggu 1',
                              toolUsed: 'Alat',
                              description: 'Deskripsi langkah',
                              keyMilestone: 'Output terverifikasi',
                            },
                          ];
                          setProjectForm({ ...projectForm, creationProcess: updated });
                        }}
                        className="text-xs font-mono px-3 py-1.5 rounded bg-lime-400 text-black font-bold"
                      >
                        + Tambah Fase Proses
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {projectForm.creationProcess?.map((step, idx) => (
                      <div key={idx} className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-lime-400">
                            FASE {step.stepNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Durasi"
                              value={step.duration}
                              onChange={(e) => {
                                const updated = [...projectForm.creationProcess!];
                                updated[idx].duration = e.target.value;
                                setProjectForm({ ...projectForm, creationProcess: updated });
                              }}
                              className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white w-28 text-right"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = projectForm.creationProcess!.filter((_, i) => i !== idx);
                                setProjectForm({ ...projectForm, creationProcess: updated });
                              }}
                              className="p-1 rounded text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Judul Fase (e.g. Riset Semiotika & Storyboard)"
                            value={step.title}
                            onChange={(e) => {
                              const updated = [...projectForm.creationProcess!];
                              updated[idx].title = e.target.value;
                              setProjectForm({ ...projectForm, creationProcess: updated });
                            }}
                            className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Perangkat & Software yang Digunakan"
                            value={step.toolUsed}
                            onChange={(e) => {
                              const updated = [...projectForm.creationProcess!];
                              updated[idx].toolUsed = e.target.value;
                              setProjectForm({ ...projectForm, creationProcess: updated });
                            }}
                            className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Deskripsi langkah konkret pengerjaan..."
                          value={step.description}
                          onChange={(e) => {
                            const updated = [...projectForm.creationProcess!];
                            updated[idx].description = e.target.value;
                            setProjectForm({ ...projectForm, creationProcess: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 resize-none font-sans"
                        />

                        <input
                          type="text"
                          placeholder="Output / Deliverable Kunci (e.g. Rendering 3D Master)"
                          value={step.keyMilestone}
                          onChange={(e) => {
                            const updated = [...projectForm.creationProcess!];
                            updated[idx].keyMilestone = e.target.value;
                            setProjectForm({ ...projectForm, creationProcess: updated });
                          }}
                          className="w-full px-3 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs text-lime-400 font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB E: DELIVERABLES & WARNA */}
              {modalFormTab === 'deliverables' && (
                <div className="space-y-5">
                  {/* Deliverables List */}
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                        DAFTAR DELIVERABLES KARYA
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(projectForm.deliverables || []), ''];
                          setProjectForm({ ...projectForm, deliverables: updated });
                        }}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-800 text-lime-400"
                      >
                        + Tambah Deliverable
                      </button>
                    </div>

                    <div className="space-y-2">
                      {projectForm.deliverables?.map((deliv, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={deliv}
                            onChange={(e) => {
                              const updated = [...projectForm.deliverables!];
                              updated[idx] = e.target.value;
                              setProjectForm({ ...projectForm, deliverables: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = projectForm.deliverables!.filter((_, i) => i !== idx);
                              setProjectForm({ ...projectForm, deliverables: updated });
                            }}
                            className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Swatch Warna */}
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
                          PALET WARNA UTAMA
                        </div>
                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          Klik kotak warna untuk memakai pipet/color picker, ketik kode HEX, atau ekstrak otomatis dari sampul.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {projectForm.customMockupUrl && (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                soundFx.playPop();
                                const extracted = await extractPaletteFromImage(
                                  projectForm.customMockupUrl!,
                                  4
                                );
                                if (extracted.length > 0) {
                                  setProjectForm({
                                    ...projectForm,
                                    colorPalette: extracted,
                                  });
                                  showToast(
                                    `${extracted.length} warna dominan berhasil diambil dari foto sampul!`
                                  );
                                } else {
                                  alert('Tidak dapat mendeteksi warna dari gambar ini. Silakan klik + Tambah Warna.');
                                }
                              } catch {
                                alert(
                                  'Gambar sampul berasal dari link eksternal yang membatasi akses piksel. Silakan gunakan tombol + Tambah Warna.'
                                );
                              }
                            }}
                            className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/40 text-lime-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ambil Otomatis dari Sampul</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playTick();
                            const defaultSwatches = [
                              '#A3E635',
                              '#10B981',
                              '#F59E0B',
                              '#3B82F6',
                              '#EC4899',
                              '#171717',
                            ];
                            const currentLen = projectForm.colorPalette?.length || 0;
                            const nextHex = defaultSwatches[currentLen % defaultSwatches.length];
                            const updated = [
                              ...(projectForm.colorPalette || []),
                              { hex: nextHex, name: '' },
                            ];
                            setProjectForm({ ...projectForm, colorPalette: updated });
                          }}
                          className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Warna</span>
                        </button>
                      </div>
                    </div>

                    {projectForm.colorPalette && projectForm.colorPalette.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {projectForm.colorPalette.map((color, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 relative group"
                          >
                            <div className="flex items-center gap-1.5">
                              <label
                                title="Klik untuk membuka Color Picker / Pipet Warna"
                                style={{ backgroundColor: color.hex || '#000000' }}
                                className="relative flex-1 h-9 rounded-lg border border-white/15 cursor-pointer overflow-hidden flex items-center justify-center"
                              >
                                <input
                                  type="color"
                                  value={normalizeHexForPicker(color.hex)}
                                  onChange={(e) => {
                                    const updated = [...projectForm.colorPalette!];
                                    updated[idx] = {
                                      ...updated[idx],
                                      hex: e.target.value.toUpperCase(),
                                    };
                                    setProjectForm({ ...projectForm, colorPalette: updated });
                                  }}
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                                <span className="px-1.5 py-0.5 rounded bg-black/55 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  Pilih Warna
                                </span>
                              </label>

                              <button
                                type="button"
                                title="Hapus warna ini"
                                onClick={() => {
                                  const updated = projectForm.colorPalette!.filter(
                                    (_, i) => i !== idx
                                  );
                                  setProjectForm({ ...projectForm, colorPalette: updated });
                                }}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 border border-neutral-800 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              placeholder="#A3E635"
                              value={color.hex}
                              onChange={(e) => {
                                let val = e.target.value;
                                if (val && !val.startsWith('#') && /^[0-9A-Fa-f]{1,6}$/.test(val)) {
                                  val = `#${val}`;
                                }
                                const updated = [...projectForm.colorPalette!];
                                updated[idx] = { ...updated[idx], hex: val.toUpperCase() };
                                setProjectForm({ ...projectForm, colorPalette: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 focus:border-lime-400 outline-none text-white font-mono"
                            />
                            <input
                              type="text"
                              placeholder="Nama warna (opsional)"
                              value={color.name}
                              onChange={(e) => {
                                const updated = [...projectForm.colorPalette!];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setProjectForm({ ...projectForm, colorPalette: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 focus:border-lime-400 outline-none text-neutral-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-5 px-4 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/60 text-center text-xs font-mono text-neutral-400">
                        Belum ada palet warna pada karya ini. Klik{' '}
                        {projectForm.customMockupUrl ? (
                          <strong className="text-lime-400">Ambil Otomatis dari Sampul</strong>
                        ) : (
                          <strong className="text-lime-400">+ Tambah Warna</strong>
                        )}{' '}
                        di kanan atas untuk menambahkan warna identitas karya.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-xs font-mono text-neutral-500">
                  Tab Aktif: {modalFormTab.toUpperCase()}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Karya ke Database</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT SOFTWARE APLIKASI */}
      {/* ============================================================== */}
      {isToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">
                {editingToolId ? 'Edit Software' : 'Tambah Software Baru'}
              </h3>
              <button onClick={() => setIsToolModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Nama Software *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DaVinci Resolve"
                    value={toolForm.name}
                    onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Kode Ikon *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dv"
                    value={toolForm.shortCode}
                    onChange={(e) => setToolForm({ ...toolForm, shortCode: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-sm text-lime-400 font-bold text-center"
                  />
                </div>
              </div>

              {/* Icon Asli Software */}
              <div className="space-y-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-300 font-bold">
                    Icon Software Asli (Logo Asli)
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">Opsional (PNG/SVG)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                    {toolForm.iconUrl ? (
                      <img
                        src={toolForm.iconUrl}
                        alt="Preview Icon"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold text-lime-400">
                        {toolForm.shortCode || 'FX'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded bg-lime-400 hover:bg-lime-300 text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Gambar Icon</span>
                        <input
                          type="file"
                          accept="image/png,image/svg+xml,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) =>
                            handleLocalImageUpload(e, (url: string) =>
                              setToolForm((prev) => ({ ...prev, iconUrl: url }))
                            )
                          }
                        />
                      </label>
                      {toolForm.iconUrl && (
                        <button
                          type="button"
                          onClick={() => setToolForm((prev) => ({ ...prev, iconUrl: '' }))}
                          className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 text-xs font-mono"
                        >
                          Hapus Icon
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Atau masukkan tautan URL icon (SVG/PNG)..."
                      value={toolForm.iconUrl || ''}
                      onChange={(e) => setToolForm({ ...toolForm, iconUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-white focus:border-lime-400 outline-none"
                    />
                  </div>
                </div>

                {/* Preset Cepat Icon Populer */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <div className="text-[10px] font-mono text-neutral-400 mb-1.5">Preset Cepat Logo Populer:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Illustrator', icon: '/icons/software/illustrator.svg' },
                      { name: 'Photoshop', icon: '/icons/software/photoshop.svg' },
                      { name: 'Premiere', icon: '/icons/software/premiere.svg' },
                      { name: 'After Effects', icon: '/icons/software/aftereffects.svg' },
                      { name: 'InDesign', icon: '/icons/software/indesign.svg' },
                      { name: 'Lightroom', icon: '/icons/software/lightroom.svg' },
                      { name: 'Figma', icon: '/icons/software/figma.svg' },
                      { name: 'CapCut', icon: '/icons/software/capcut.svg' },
                      { name: 'DaVinci Resolve', icon: '/icons/software/davinci-resolve.svg' },
                      { name: 'Cinema 4D', icon: '/icons/software/cinema4d.svg' },
                      { name: 'Glyphs', icon: '/icons/software/glyphs.svg' },
                      { name: 'Blender', icon: '/icons/software/blender.svg' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setToolForm((prev) => ({ ...prev, iconUrl: preset.icon }))}
                        className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-lime-400 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Kategori</label>
                  <select
                    value={toolForm.category}
                    onChange={(e) => setToolForm({ ...toolForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  >
                    <option value="Vektor & Brand">Vektor & Brand</option>
                    <option value="3D & Motion">3D & Motion</option>
                    <option value="Fotografi">Fotografi</option>
                    <option value="Videografi & Color">Videografi & Color</option>
                    <option value="Editorial & Layout">Editorial & Layout</option>
                    <option value="Raster & Tekstur">Raster & Tekstur</option>
                    <option value="Huruf & Font">Huruf & Font</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Level Kemahiran</label>
                  <select
                    value={toolForm.experienceLevel}
                    onChange={(e) => setToolForm({ ...toolForm, experienceLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  >
                    <option value="Primary Daily Driver">Primary Daily Driver</option>
                    <option value="Production Master">Production Master</option>
                    <option value="Advanced Specialist">Advanced Specialist</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Tahun Pengalaman</label>
                <input
                  type="text"
                  placeholder="e.g. 6+ Tahun"
                  value={toolForm.yearsUsed}
                  onChange={(e) => setToolForm({ ...toolForm, yearsUsed: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Deskripsi Kegunaan</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsikan peran software ini dalam pekerjaan Anda..."
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                Simpan Software
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT LAYANAN */}
      {/* ============================================================== */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">
                {editingServiceNumber ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Nomor</label>
                  <input
                    type="text"
                    value={serviceForm.number}
                    onChange={(e) => setServiceForm({ ...serviceForm, number: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-lime-400 font-bold"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Judul Layanan *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Tagline Layanan</label>
                <input
                  type="text"
                  value={serviceForm.tagline}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white resize-none"
                />
              </div>

              {/* Editor Deliverables / Poin-Poin Hasil Kerja */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-mono text-lime-400 font-bold block">
                      Daftar Deliverables (Poin-poin Hasil Kerja)
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Poin-poin yang tampil saat kartu keahlian diklik/dibuka
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(serviceForm.deliverables || []), ''];
                      setServiceForm({ ...serviceForm, deliverables: updated });
                    }}
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-lime-400 border border-neutral-750 font-bold"
                  >
                    + Tambah Poin
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(serviceForm.deliverables || []).map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-lime-400 font-bold shrink-0 w-4 text-center">
                        •
                      </span>
                      <input
                        type="text"
                        value={deliv}
                        placeholder="Contoh: Logotype & Simbol Monogram Custom"
                        onChange={(e) => {
                          const updated = [...(serviceForm.deliverables || [])];
                          updated[idx] = e.target.value;
                          setServiceForm({ ...serviceForm, deliverables: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (serviceForm.deliverables || []).filter((_, i) => i !== idx);
                          setServiceForm({ ...serviceForm, deliverables: updated });
                        }}
                        className="p-1.5 rounded hover:bg-red-500/20 text-neutral-500 hover:text-red-400 shrink-0"
                        title="Hapus poin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!serviceForm.deliverables || serviceForm.deliverables.length === 0) && (
                    <div className="text-[11px] font-mono text-neutral-500 italic py-2 text-center bg-neutral-900/50 rounded border border-dashed border-neutral-800">
                      Belum ada poin deliverables. Klik &ldquo;+ Tambah Poin&rdquo; di atas untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                Simpan Layanan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT SERTIFIKASI */}
      {/* ============================================================== */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">
                {editingAwardIndex !== null ? 'Edit Sertifikasi' : 'Tambah Sertifikasi Baru'}
              </h3>
              <button onClick={() => setIsAwardModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Nama Sertifikasi / Lisensi *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google UX Design Certificate / Adobe Visual Design"
                  value={awardForm.award}
                  onChange={(e) => setAwardForm({ ...awardForm, award: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Lembaga Penerbit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coursera / Adobe / BNSP / Dicoding"
                  value={awardForm.institution}
                  onChange={(e) => setAwardForm({ ...awardForm, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Bidang Keahlian / ID Kredensial</label>
                <input
                  type="text"
                  placeholder="e.g. UI/UX, Prototyping & Design System / ID: CERT-2025"
                  value={awardForm.project}
                  onChange={(e) => setAwardForm({ ...awardForm, project: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Tahun</label>
                  <input
                    type="text"
                    value={awardForm.year}
                    onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Label Status (Opsional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Terverifikasi / Resmi"
                    value={awardForm.badge || ''}
                    onChange={(e) => setAwardForm({ ...awardForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-lime-400 focus:border-lime-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">
                  Link Bukti Sertifikat / Google Drive (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... atau link kredensial"
                  value={awardForm.credentialUrl || ''}
                  onChange={(e) => setAwardForm({ ...awardForm, credentialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              {/* Pilihan Posisi Urutan (Atas / Tengah / Bawah) */}
              {(editingAwardIndex !== null ? awardsData.length > 1 : awardsData.length > 0) && (
                <div className="p-3 rounded-lg bg-lime-400/5 border border-lime-400/25 space-y-1">
                  <label className="text-xs font-mono text-lime-400 font-bold block">
                    Posisi Urutan Tampilan (Atas / Tengah / Bawah)
                  </label>
                  <select
                    value={awardPositionIndex}
                    onChange={(e) => setAwardPositionIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-semibold"
                  >
                    {Array.from({
                      length:
                        editingAwardIndex !== null ? awardsData.length : awardsData.length + 1,
                    }).map((_, slotIdx) => {
                      const totalSlots =
                        editingAwardIndex !== null ? awardsData.length : awardsData.length + 1;
                      const posDesc =
                        slotIdx === 0
                          ? 'Paling Atas'
                          : slotIdx === totalSlots - 1
                          ? 'Paling Bawah'
                          : `Tengah (Baris ke-${slotIdx + 1})`;
                      return (
                        <option key={slotIdx} value={slotIdx}>
                          Urutan #{slotIdx + 1} — {posDesc}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                Simpan Sertifikasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH PAMERAN */}
      {/* ============================================================== */}
      {isExhibitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">Pameran & Eksibisi</h3>
              <button onClick={() => setIsExhibitionModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExhibition} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Tahun</label>
                  <input
                    type="text"
                    value={exhibitionForm.year}
                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Kota</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={exhibitionForm.city}
                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Judul Pameran *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinetic Dimensions: 3D Motion Art"
                  value={exhibitionForm.title}
                  onChange={(e) => setExhibitionForm({ ...exhibitionForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Galeri / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Tate Modern Tanks"
                  value={exhibitionForm.venue}
                  onChange={(e) => setExhibitionForm({ ...exhibitionForm, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                Simpan Pameran
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH KLIEN */}
      {/* ============================================================== */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">Tambah Klien Baru</h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Nama Jenama / Klien *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Music / Kinfolk"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Kategori Industri</label>
                <input
                  type="text"
                  placeholder="e.g. High Fashion / Electronic Music"
                  value={clientForm.category}
                  onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Kota / Negara</label>
                <input
                  type="text"
                  placeholder="e.g. Paris / Tokyo"
                  value={clientForm.city}
                  onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                Tambah ke Dinding Klien
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH TESTIMONIAL */}
      {/* ============================================================== */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">
                {editingTestimonialIndex !== null ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
              </h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              {/* Foto Klien / Pemberi Testimoni */}
              <div className="space-y-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-300 font-bold">
                    Foto Pemberi Testimoni
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">Opsional (JPG/PNG/WebP)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {testimonialForm.avatarUrl ? (
                      <img
                        src={testimonialForm.avatarUrl}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lime-400/10 text-lime-400 font-bold text-sm">
                        {testimonialForm.client ? testimonialForm.client.slice(0, 2).toUpperCase() : 'FT'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded bg-lime-400 hover:bg-lime-300 text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleLocalImageUpload(e, (url: string) =>
                              setTestimonialForm((prev) => ({ ...prev, avatarUrl: url }))
                            )
                          }
                        />
                      </label>
                      {testimonialForm.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setTestimonialForm((prev) => ({ ...prev, avatarUrl: '' }))}
                          className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 text-xs font-mono"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Atau tempel URL foto orangnya..."
                      value={testimonialForm.avatarUrl || ''}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-white focus:border-lime-400 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Kutipan Testimonial *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Kutipan rekomendasi dari klien atau kurator..."
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Nama Pemberi Testimonial *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claire de Montmirail"
                  value={testimonialForm.client}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, client: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Jabatan / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Creative Director"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Perusahaan / Institusi</label>
                  <input
                    type="text"
                    placeholder="e.g. Maison Éthérée Paris"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300"
              >
                {editingTestimonialIndex !== null ? 'Perbarui Testimonial' : 'Simpan Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT STANDAR CETAK (TACTILE SPECS) */}
      {/* ============================================================== */}
      {isTactileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">
                {editingTactileIndex !== null ? 'Edit Standar Materialitas' : 'Tambah Standar Materialitas Baru'}
              </h3>
              <button onClick={() => setIsTactileModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTactile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Judul Standar Material *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kertas Seni & Tekstur Taktil"
                  value={tactileForm.title}
                  onChange={(e) => setTactileForm({ ...tactileForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Badge Pabrikan / Sistem *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FEDRIGONI & G.F SMITH / KURZ GERMANY"
                  value={tactileForm.badge}
                  onChange={(e) => setTactileForm({ ...tactileForm, badge: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Deskripsi Spesifikasi Teknis *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan spesifikasi material, gramatur, teknik finis, atau metode kalibrasi..."
                  value={tactileForm.description}
                  onChange={(e) => setTactileForm({ ...tactileForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-md"
              >
                {editingTactileIndex !== null ? 'Perbarui Standar Cetak' : 'Simpan Standar Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: BUAT / EDIT SECTION PORTOFOLIO (JUDUL MANUAL) */}
      {/* ============================================================== */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-lime-400" />
                <h3 className="font-bold text-white text-base">
                  {editingSectionId ? 'Edit Judul Section Portofolio' : 'Buat Section Portofolio Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              {/* Quick Suggestion Chips (Optional 1-Click Fill, Still 100% Manual Editable) */}
              {!editingSectionId && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    Contoh Cepat (Klik untuk mengisi otomatis, lalu sesuaikan bebas):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        eyebrow: 'UI/UX & Product Design',
                        title: 'UI/UX Designer',
                        subtitle:
                          'Perancangan antarmuka aplikasi, website, dan sistem desain berbasis riset pengguna (Design Thinking).',
                        layout: 'grid-2' as const,
                        showDesignThinking: true,
                      },
                      {
                        eyebrow: 'Desain Digital',
                        title: 'UI/UX Design',
                        subtitle:
                          'Studi kasus problem-solving pengalaman pengguna mulai dari riset hingga prototipe interaktif.',
                        layout: 'grid-2' as const,
                        showDesignThinking: true,
                      },
                      {
                        eyebrow: 'Keahlian Tambahan',
                        title: 'Fotografi & Videografi',
                        subtitle: 'Dokumentasi visual, potret editorial, sinematografi, dan penyuntingan video.',
                        layout: 'gallery-3' as const,
                        showDesignThinking: false,
                      },
                      {
                        eyebrow: 'Produksi Video & Motion',
                        title: 'Videografi & Motion Reel',
                        subtitle: 'Karya video komersial, reels media sosial, dan animasi 3D.',
                        layout: 'gallery-3' as const,
                        showDesignThinking: false,
                      },
                    ].map((preset) => (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => {
                          setSectionDtManualOverride(true);
                          setSectionForm({
                            ...sectionForm,
                            eyebrow: preset.eyebrow,
                            title: preset.title,
                            subtitle: preset.subtitle,
                            layout: preset.layout,
                            showDesignThinking: preset.showDesignThinking,
                          });
                        }}
                        className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-mono text-lime-400 transition-colors"
                      >
                        + {preset.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300 font-bold">
                  Judul Section (Tulis Manual) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: UI/UX Designer atau Fotografi & Videografi"
                  value={sectionForm.title}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    const autoDt = sectionDtManualOverride
                      ? sectionForm.showDesignThinking
                      : isUiUxTitle(`${nextTitle} ${sectionForm.eyebrow || ''}`);
                    const autoLayout =
                      !editingSectionId && isUiUxTitle(nextTitle) ? 'grid-2' : sectionForm.layout;
                    setSectionForm({
                      ...sectionForm,
                      title: nextTitle,
                      layout: autoLayout,
                      showDesignThinking: autoDt,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:border-lime-400 outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">
                  Label Kecil di Atas Judul <span className="text-neutral-500">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keahlian Tambahan / Galeri Visual"
                  value={sectionForm.eyebrow || ''}
                  onChange={(e) => {
                    const nextEyebrow = e.target.value;
                    const autoDt = sectionDtManualOverride
                      ? sectionForm.showDesignThinking
                      : isUiUxTitle(`${sectionForm.title} ${nextEyebrow}`);
                    setSectionForm({
                      ...sectionForm,
                      eyebrow: nextEyebrow,
                      showDesignThinking: autoDt,
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-lime-400 focus:border-lime-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">
                  Deskripsi Singkat di Bawah Judul <span className="text-neutral-500">(Opsional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan singkat mengenai kumpulan karya di section ini..."
                  value={sectionForm.subtitle || ''}
                  onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Gaya Tata Letak Kartu Karya
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSectionForm({ ...sectionForm, layout: 'grid-2' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sectionForm.layout !== 'gallery-3'
                        ? 'bg-lime-400/10 border-lime-400 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">2 Kolom Besar (Studi Kasus)</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Menampilkan peran, software & ringkasan. Cocok untuk Desain/UI/Branding.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSectionForm({ ...sectionForm, layout: 'gallery-3' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sectionForm.layout === 'gallery-3'
                        ? 'bg-lime-400/10 border-lime-400 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">3 Kolom Ringkas (Galeri Visual)</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Fokus penuh pada foto & video. Sangat cocok untuk Fotografi & Videografi.
                    </div>
                  </button>
                </div>
              </div>

              <label
                htmlFor="section-dt-checkbox"
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all select-none ${
                  sectionForm.showDesignThinking
                    ? 'bg-lime-400/10 border-lime-400/60'
                    : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <input
                  id="section-dt-checkbox"
                  type="checkbox"
                  checked={Boolean(sectionForm.showDesignThinking)}
                  onChange={(e) => {
                    setSectionDtManualOverride(true);
                    setSectionForm({
                      ...sectionForm,
                      showDesignThinking: e.target.checked,
                    });
                  }}
                  className="w-4 h-4 mt-0.5 accent-lime-400 rounded cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    <span>Tampilkan Metodologi Design Thinking (Khusus UI/UX)</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Otomatis aktif saat Anda membuat section <strong className="text-neutral-300">UI/UX Designer</strong> / <strong className="text-neutral-300">UI/UX Design</strong>. Menampilkan alur <em>Empathize → Define → Ideate → Prototype → Test</em> khusus di section ini saja.
                  </p>
                </div>
              </label>

              {/* Pilihan Posisi Urutan Tampilan Section (Atas / Tengah / Bawah) */}
              {(editingSectionId ? portfolioSections.length > 1 : portfolioSections.length > 0) && (
                <div className="p-3.5 rounded-xl bg-lime-400/5 border border-lime-400/25 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-lime-400 font-bold block">
                      Posisi Urutan Tampilan Section di Web
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Total: {editingSectionId ? portfolioSections.length : portfolioSections.length + 1} Section
                    </span>
                  </div>
                  <select
                    value={sectionPositionIndex}
                    onChange={(e) => setSectionPositionIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-semibold cursor-pointer"
                  >
                    {Array.from({
                      length:
                        editingSectionId ? portfolioSections.length : portfolioSections.length + 1,
                    }).map((_, slotIdx) => {
                      const totalSlots =
                        editingSectionId ? portfolioSections.length : portfolioSections.length + 1;
                      const posDesc =
                        slotIdx === 0
                          ? 'Paling Atas (Section Pertama di Web)'
                          : slotIdx === totalSlots - 1
                          ? 'Paling Bawah (Section Terakhir di Web)'
                          : `Tengah (Urutan ke-${slotIdx + 1})`;
                      return (
                        <option key={slotIdx} value={slotIdx}>
                          Urutan #{slotIdx + 1} — {posDesc}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Pilih urutan letak section ini pada halaman utama portofolio (misal: memindahkan Keahlian Tambahan ke paling bawah).
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-lime-400 text-black font-mono text-xs font-bold hover:bg-lime-300 transition-colors shadow-md"
              >
                {editingSectionId ? 'Simpan Perubahan Judul & Urutan' : 'Buat Section Portofolio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
