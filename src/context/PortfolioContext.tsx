'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Project,
  PortfolioSection,
  DesignerProfile,
  ApplicationTool,
  ServiceItem,
  ProcessStep,
  AwardItem,
  ExhibitionItem,
  InquiryMessage,
  TactileHighlight,
  AdminAuthSettings,
} from '../types/portfolio';
import graphicDb from '@/data/db.json';
import photographerDb from '@/data/photographer_db.json';

const getInitialData = (type: 'graphic' | 'photographer') => {
  return type === 'photographer' ? (photographerDb as any) : (graphicDb as any);
};

interface ClientItem {
  name: string;
  city: string;
  category: string;
}

interface TestimonialItem {
  quote: string;
  client: string;
  role: string;
  company: string;
  avatarUrl?: string;
}

interface PortfolioContextType {
  designerProfile: DesignerProfile;
  portfolioSections: PortfolioSection[];
  projectsData: Project[];
  applicationsList: ApplicationTool[];
  servicesData: ServiceItem[];
  processSteps: ProcessStep[];
  awardsData: AwardItem[];
  exhibitionsData: ExhibitionItem[];
  clientRoster: ClientItem[];
  testimonials: TestimonialItem[];
  tactileSpecs: TactileHighlight[];
  inquiries: InquiryMessage[];
  isLoading: boolean;
  portfolioType: 'graphic' | 'photographer';
  switchPortfolioUrl: string;
  adminSwitchUrl: string;

  // Portfolio Sections CRUD
  addPortfolioSection: (section: PortfolioSection, targetIndex?: number) => Promise<boolean>;
  updatePortfolioSection: (section: PortfolioSection, targetIndex?: number) => Promise<boolean>;
  deletePortfolioSection: (id: string) => Promise<boolean>;
  reorderPortfolioSection: (id: string, direction: 'up' | 'down') => Promise<boolean>;

  // Projects CRUD
  addProject: (project: Project) => Promise<boolean>;
  updateProject: (project: Project) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleProjectFeatured: (id: string) => Promise<boolean>;

  // Profile CRUD
  updateProfile: (profile: Partial<DesignerProfile>) => Promise<boolean>;

  // Applications CRUD
  addApplication: (tool: ApplicationTool) => Promise<boolean>;
  updateApplication: (tool: ApplicationTool) => Promise<boolean>;
  deleteApplication: (id: string) => Promise<boolean>;

  // Services CRUD
  addService: (service: ServiceItem) => Promise<boolean>;
  updateService: (service: ServiceItem) => Promise<boolean>;
  deleteService: (number: string) => Promise<boolean>;

  // Process Steps CRUD
  updateProcessStep: (step: ProcessStep) => Promise<boolean>;

  // Awards CRUD
  addAward: (award: AwardItem, positionIndex?: number) => Promise<boolean>;
  updateAward: (award: AwardItem, index: number, newPositionIndex?: number) => Promise<boolean>;
  deleteAward: (index: number) => Promise<boolean>;
  reorderAward: (index: number, direction: 'up' | 'down') => Promise<boolean>;

  // Exhibitions CRUD
  addExhibition: (exhibition: ExhibitionItem) => Promise<boolean>;
  updateExhibition: (exhibition: ExhibitionItem, index: number) => Promise<boolean>;
  deleteExhibition: (index: number) => Promise<boolean>;

  // Clients CRUD
  addClient: (client: ClientItem) => Promise<boolean>;
  deleteClient: (index: number) => Promise<boolean>;

  // Testimonials CRUD
  addTestimonial: (t: TestimonialItem) => Promise<boolean>;
  updateTestimonial: (index: number, t: TestimonialItem) => Promise<boolean>;
  deleteTestimonial: (index: number) => Promise<boolean>;

  // Tactile Specs CRUD
  addTactileHighlight: (item: TactileHighlight) => Promise<boolean>;
  updateTactileHighlight: (index: number, item: TactileHighlight) => Promise<boolean>;
  deleteTactileHighlight: (index: number) => Promise<boolean>;

  // Inquiries / Inbox
  addInquiry: (inquiry: Omit<InquiryMessage, 'id' | 'createdAt' | 'read'>) => Promise<boolean>;
  toggleInquiryRead: (id: string) => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;

  // Admin Authentication
  adminAuth: AdminAuthSettings;
  updateAdminAuth: (auth: AdminAuthSettings) => Promise<boolean>;

  // Reset & Import
  importDatabase: (jsonData: any) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
}

const fallbackAdminAuth: AdminAuthSettings = {
  username: 'admin',
  password: 'admin',
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{
  children: React.ReactNode;
  portfolioType?: 'graphic' | 'photographer';
}> = ({ children, portfolioType: explicitType }) => {
  const pathname = usePathname();
  const resolvedType: 'graphic' | 'photographer' =
    explicitType || (pathname && pathname.startsWith('/photographer') ? 'photographer' : 'graphic');

  const switchPortfolioUrl = resolvedType === 'photographer' ? '/' : '/photographer';
  const adminSwitchUrl = resolvedType === 'photographer' ? '/admin' : '/photographer/admin';

  const initialData = getInitialData(resolvedType);

  const [adminAuth, setAdminAuth] = useState<AdminAuthSettings>(initialData.adminAuth);
  const [designerProfile, setDesignerProfile] = useState<DesignerProfile>(initialData.designerProfile);
  const [portfolioSections, setPortfolioSections] = useState<PortfolioSection[]>(initialData.portfolioSections || []);
  const [projectsData, setProjectsData] = useState<Project[]>(initialData.projectsData || []);
  const [applicationsList, setApplicationsList] = useState<ApplicationTool[]>(initialData.applicationsList || []);
  const [servicesData, setServicesData] = useState<ServiceItem[]>(initialData.servicesData || []);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(initialData.processSteps || []);
  const [awardsData, setAwardsData] = useState<AwardItem[]>(initialData.awardsData || []);
  const [exhibitionsData, setExhibitionsData] = useState<ExhibitionItem[]>(initialData.exhibitionsData || []);
  const [clientRoster, setClientRoster] = useState<ClientItem[]>(initialData.clientRoster || []);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialData.testimonials || []);
  const [tactileSpecs, setTactileSpecs] = useState<TactileHighlight[]>(initialData.tactileSpecs || []);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(initialData.inquiries || []);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from API on mount or when resolvedType changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const storageKey = `portfolio_backup_${resolvedType}`;

    // 1. Pulihkan dari localStorage HANYA jika data valid dan BUKAN template lama
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const hasStaleDummyData = parsed.projectsData?.some((p: any) =>
            [
              'Aura Botanica',
              'KROMA Display Specimen',
              'Neo-Tokyo Avant-Garde Jazz',
              'Atelier Noir Horlogerie',
            ].includes(p.title)
          );

          if (hasStaleDummyData) {
            // Hapus cache basi template lama agar tidak pernah tampil lagi
            localStorage.removeItem(storageKey);
          } else {
            if (parsed.designerProfile) setDesignerProfile(parsed.designerProfile);
            if (Array.isArray(parsed.portfolioSections) && parsed.portfolioSections.length > 0) {
              setPortfolioSections(parsed.portfolioSections);
            }
            if (Array.isArray(parsed.projectsData)) {
              setProjectsData(parsed.projectsData);
            }
            if (Array.isArray(parsed.applicationsList)) {
              setApplicationsList(parsed.applicationsList);
            }
            if (Array.isArray(parsed.servicesData)) {
              setServicesData(parsed.servicesData);
            }
            if (Array.isArray(parsed.awardsData)) {
              setAwardsData(parsed.awardsData);
            }
            if (Array.isArray(parsed.clientRoster)) {
              setClientRoster(parsed.clientRoster);
            }
            if (Array.isArray(parsed.testimonials)) {
              setTestimonials(parsed.testimonials);
            }
          }
        }
      } catch {
        // Abaikan jika cache kosong / gagal dibaca
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/portfolio?type=${resolvedType}&_t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;
          if (data.adminAuth && data.adminAuth.username && data.adminAuth.password) {
            setAdminAuth(data.adminAuth);
          }
          if (data.designerProfile) setDesignerProfile(data.designerProfile);
          if (Array.isArray(data.portfolioSections) && data.portfolioSections.length > 0) {
            setPortfolioSections(data.portfolioSections);
          }
          if (data.projectsData) setProjectsData(data.projectsData);
          if (data.applicationsList) setApplicationsList(data.applicationsList);
          if (data.servicesData) setServicesData(data.servicesData);
          if (data.processSteps) setProcessSteps(data.processSteps);
          if (data.awardsData) setAwardsData(data.awardsData);
          if (data.exhibitionsData) setExhibitionsData(data.exhibitionsData);
          if (data.clientRoster) setClientRoster(data.clientRoster);
          if (data.testimonials) setTestimonials(data.testimonials);
          if (data.tactileSpecs) setTactileSpecs(data.tactileSpecs);
          if (data.inquiries) setInquiries(data.inquiries);

          // Update backup cache dengan data server terbaru
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(storageKey, JSON.stringify(data));
            } catch {
              // Ignore localStorage quota
            }
          }
        }
      } catch (err) {
        console.warn(`Using seeded data as fallback for ${resolvedType}:`, err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [resolvedType]);

  // Save changes to API & LocalStorage
  const persistChanges = async (updates: Partial<{
    adminAuth: AdminAuthSettings;
    designerProfile: DesignerProfile;
    portfolioSections: PortfolioSection[];
    projectsData: Project[];
    applicationsList: ApplicationTool[];
    servicesData: ServiceItem[];
    processSteps: ProcessStep[];
    awardsData: AwardItem[];
    exhibitionsData: ExhibitionItem[];
    clientRoster: ClientItem[];
    testimonials: TestimonialItem[];
    tactileSpecs: TactileHighlight[];
    inquiries: InquiryMessage[];
  }>) => {
    try {
      const payload = {
        adminAuth: updates.adminAuth ?? adminAuth,
        designerProfile: updates.designerProfile ?? designerProfile,
        portfolioSections: updates.portfolioSections ?? portfolioSections,
        projectsData: updates.projectsData ?? projectsData,
        applicationsList: updates.applicationsList ?? applicationsList,
        servicesData: updates.servicesData ?? servicesData,
        processSteps: updates.processSteps ?? processSteps,
        awardsData: updates.awardsData ?? awardsData,
        exhibitionsData: updates.exhibitionsData ?? exhibitionsData,
        clientRoster: updates.clientRoster ?? clientRoster,
        testimonials: updates.testimonials ?? testimonials,
        tactileSpecs: updates.tactileSpecs ?? tactileSpecs,
        inquiries: updates.inquiries ?? inquiries,
      };

      const serialized = JSON.stringify(payload);

      const res = await fetch(`/api/portfolio?type=${resolvedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
      });

      if (typeof window !== 'undefined') {
        const storageKey = `portfolio_backup_${resolvedType}`;
        setTimeout(() => {
          try {
            if (serialized.length < 2 * 1024 * 1024) {
              localStorage.setItem(storageKey, serialized);
            }
          } catch {
            // Ignore localStorage quota limits so UI never stalls
          }
        }, 0);
      }

      return res.ok;
    } catch (err) {
      console.error('Failed to persist changes:', err);
      return false;
    }
  };

  // Portfolio Sections CRUD
  const addPortfolioSection = async (section: PortfolioSection, targetIndex?: number) => {
    let updated: PortfolioSection[];
    if (
      typeof targetIndex === 'number' &&
      targetIndex >= 0 &&
      targetIndex <= portfolioSections.length
    ) {
      updated = [...portfolioSections];
      updated.splice(targetIndex, 0, section);
    } else {
      updated = [...portfolioSections, section];
    }
    setPortfolioSections(updated);
    return await persistChanges({ portfolioSections: updated });
  };

  const updatePortfolioSection = async (section: PortfolioSection, targetIndex?: number) => {
    let updated = [...portfolioSections];
    const currentIndex = updated.findIndex((s) => s.id === section.id);
    if (currentIndex !== -1) {
      if (
        typeof targetIndex === 'number' &&
        targetIndex >= 0 &&
        targetIndex < updated.length &&
        targetIndex !== currentIndex
      ) {
        updated.splice(currentIndex, 1);
        updated.splice(targetIndex, 0, section);
      } else {
        updated[currentIndex] = section;
      }
    } else {
      updated = [...portfolioSections, section];
    }
    setPortfolioSections(updated);
    return await persistChanges({ portfolioSections: updated });
  };

  const deletePortfolioSection = async (id: string) => {
    if (portfolioSections.length <= 1) return false;
    const updatedSections = portfolioSections.filter((s) => s.id !== id);
    const fallbackId = updatedSections[0]?.id || 'main';
    const updatedProjects = projectsData.map((p) =>
      p.sectionId === id ? { ...p, sectionId: fallbackId } : p
    );
    setPortfolioSections(updatedSections);
    setProjectsData(updatedProjects);
    return await persistChanges({
      portfolioSections: updatedSections,
      projectsData: updatedProjects,
    });
  };

  const reorderPortfolioSection = async (id: string, direction: 'up' | 'down') => {
    const idx = portfolioSections.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= portfolioSections.length) return false;

    const updated = [...portfolioSections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setPortfolioSections(updated);
    return await persistChanges({ portfolioSections: updated });
  };

  // Projects CRUD
  const addProject = async (project: Project) => {
    const updated = [project, ...projectsData];
    setProjectsData(updated);
    return await persistChanges({ projectsData: updated });
  };

  const updateProject = async (project: Project) => {
    const updated = projectsData.map((p) => (p.id === project.id ? project : p));
    setProjectsData(updated);
    return await persistChanges({ projectsData: updated });
  };

  const deleteProject = async (id: string) => {
    const updated = projectsData.filter((p) => p.id !== id);
    setProjectsData(updated);
    return await persistChanges({ projectsData: updated });
  };

  const toggleProjectFeatured = async (id: string) => {
    const updated = projectsData.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setProjectsData(updated);
    return await persistChanges({ projectsData: updated });
  };

  // Admin Authentication
  const updateAdminAuth = async (auth: AdminAuthSettings) => {
    const updated = { ...auth, updatedAt: new Date().toISOString() };
    setAdminAuth(updated);
    return await persistChanges({ adminAuth: updated });
  };

  // Profile
  const updateProfile = async (updates: Partial<DesignerProfile>) => {
    const updated: DesignerProfile = { ...designerProfile, ...updates };
    setDesignerProfile(updated);
    return await persistChanges({ designerProfile: updated });
  };

  // Applications
  const addApplication = async (tool: ApplicationTool) => {
    const updated = [...applicationsList, tool];
    setApplicationsList(updated);
    return await persistChanges({ applicationsList: updated });
  };

  const updateApplication = async (tool: ApplicationTool) => {
    const updated = applicationsList.map((t) => (t.id === tool.id ? tool : t));
    setApplicationsList(updated);
    return await persistChanges({ applicationsList: updated });
  };

  const deleteApplication = async (id: string) => {
    const updated = applicationsList.filter((t) => t.id !== id);
    setApplicationsList(updated);
    return await persistChanges({ applicationsList: updated });
  };

  // Services
  const addService = async (service: ServiceItem) => {
    const updated = [...servicesData, service];
    setServicesData(updated);
    return await persistChanges({ servicesData: updated });
  };

  const updateService = async (service: ServiceItem) => {
    const updated = servicesData.map((s) => (s.number === service.number ? service : s));
    setServicesData(updated);
    return await persistChanges({ servicesData: updated });
  };

  const deleteService = async (number: string) => {
    const updated = servicesData.filter((s) => s.number !== number);
    setServicesData(updated);
    return await persistChanges({ servicesData: updated });
  };

  // Process Steps
  const updateProcessStep = async (step: ProcessStep) => {
    const updated = processSteps.map((p) => (p.number === step.number ? step : p));
    setProcessSteps(updated);
    return await persistChanges({ processSteps: updated });
  };

  // Awards / Certifications
  const addAward = async (award: AwardItem, positionIndex?: number) => {
    const updated = [...awardsData];
    const insertAt =
      typeof positionIndex === 'number'
        ? Math.max(0, Math.min(positionIndex, updated.length))
        : 0;
    updated.splice(insertAt, 0, award);
    setAwardsData(updated);
    return await persistChanges({ awardsData: updated });
  };

  const updateAward = async (award: AwardItem, index: number, newPositionIndex?: number) => {
    const updated = [...awardsData];
    if (index < 0 || index >= updated.length) return false;

    if (typeof newPositionIndex === 'number' && newPositionIndex !== index) {
      updated.splice(index, 1);
      const targetIdx = Math.max(0, Math.min(newPositionIndex, updated.length));
      updated.splice(targetIdx, 0, award);
    } else {
      updated[index] = award;
    }

    setAwardsData(updated);
    return await persistChanges({ awardsData: updated });
  };

  const deleteAward = async (index: number) => {
    const updated = awardsData.filter((_, i) => i !== index);
    setAwardsData(updated);
    return await persistChanges({ awardsData: updated });
  };

  const reorderAward = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || index >= awardsData.length || targetIdx < 0 || targetIdx >= awardsData.length) {
      return false;
    }
    const updated = [...awardsData];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setAwardsData(updated);
    return await persistChanges({ awardsData: updated });
  };

  // Exhibitions
  const addExhibition = async (ex: ExhibitionItem) => {
    const updated = [ex, ...exhibitionsData];
    setExhibitionsData(updated);
    return await persistChanges({ exhibitionsData: updated });
  };

  const updateExhibition = async (ex: ExhibitionItem, index: number) => {
    const updated = [...exhibitionsData];
    updated[index] = ex;
    setExhibitionsData(updated);
    return await persistChanges({ exhibitionsData: updated });
  };

  const deleteExhibition = async (index: number) => {
    const updated = exhibitionsData.filter((_, i) => i !== index);
    setExhibitionsData(updated);
    return await persistChanges({ exhibitionsData: updated });
  };

  // Clients
  const addClient = async (client: ClientItem) => {
    const updated = [...clientRoster, client];
    setClientRoster(updated);
    return await persistChanges({ clientRoster: updated });
  };

  const deleteClient = async (index: number) => {
    const updated = clientRoster.filter((_, i) => i !== index);
    setClientRoster(updated);
    return await persistChanges({ clientRoster: updated });
  };

  // Testimonials
  const addTestimonial = async (t: TestimonialItem) => {
    const updated = [...testimonials, t];
    setTestimonials(updated);
    return await persistChanges({ testimonials: updated });
  };

  const updateTestimonial = async (index: number, t: TestimonialItem) => {
    const updated = [...testimonials];
    updated[index] = t;
    setTestimonials(updated);
    return await persistChanges({ testimonials: updated });
  };

  const deleteTestimonial = async (index: number) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
    return await persistChanges({ testimonials: updated });
  };

  // Tactile Specs CRUD
  const addTactileHighlight = async (item: TactileHighlight) => {
    const updated = [...tactileSpecs, item];
    setTactileSpecs(updated);
    return await persistChanges({ tactileSpecs: updated });
  };

  const updateTactileHighlight = async (index: number, item: TactileHighlight) => {
    const updated = [...tactileSpecs];
    updated[index] = item;
    setTactileSpecs(updated);
    return await persistChanges({ tactileSpecs: updated });
  };

  const deleteTactileHighlight = async (index: number) => {
    const updated = tactileSpecs.filter((_, i) => i !== index);
    setTactileSpecs(updated);
    return await persistChanges({ tactileSpecs: updated });
  };

  // Inquiries / Inbox
  const addInquiry = async (inquiryData: Omit<InquiryMessage, 'id' | 'createdAt' | 'read'>) => {
    const newInquiry: InquiryMessage = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    return await persistChanges({ inquiries: updated });
  };

  const toggleInquiryRead = async (id: string) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, read: !inq.read } : inq
    );
    setInquiries(updated);
    return await persistChanges({ inquiries: updated });
  };

  const deleteInquiry = async (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    return await persistChanges({ inquiries: updated });
  };

  // Import Database
  const importDatabase = async (jsonData: any) => {
    if (jsonData.designerProfile) setDesignerProfile(jsonData.designerProfile);
    if (Array.isArray(jsonData.portfolioSections) && jsonData.portfolioSections.length > 0) {
      setPortfolioSections(jsonData.portfolioSections);
    }
    if (jsonData.projectsData) setProjectsData(jsonData.projectsData);
    if (jsonData.applicationsList) setApplicationsList(jsonData.applicationsList);
    if (jsonData.servicesData) setServicesData(jsonData.servicesData);
    if (jsonData.processSteps) setProcessSteps(jsonData.processSteps);
    if (jsonData.awardsData) setAwardsData(jsonData.awardsData);
    if (jsonData.exhibitionsData) setExhibitionsData(jsonData.exhibitionsData);
    if (jsonData.clientRoster) setClientRoster(jsonData.clientRoster);
    if (jsonData.testimonials) setTestimonials(jsonData.testimonials);
    if (jsonData.tactileSpecs) setTactileSpecs(jsonData.tactileSpecs);
    if (jsonData.inquiries) setInquiries(jsonData.inquiries);

    return await persistChanges(jsonData);
  };

  // Reset to default
  const resetToDefault = async () => {
    if (resolvedType === 'photographer') {
      try {
        const pRes = await fetch('/api/portfolio?type=photographer');
        if (pRes.ok) {
          const pData = await pRes.json();
          setDesignerProfile(pData.designerProfile);
          setPortfolioSections(pData.portfolioSections);
          setProjectsData(pData.projectsData);
          setApplicationsList(pData.applicationsList);
          setServicesData(pData.servicesData);
          setProcessSteps(pData.processSteps);
          setAwardsData(pData.awardsData);
          setExhibitionsData(pData.exhibitionsData);
          setClientRoster(pData.clientRoster);
          setTestimonials(pData.testimonials);
          setTactileSpecs(pData.tactileSpecs);
          setInquiries(pData.inquiries || []);
          return await persistChanges(pData);
        }
      } catch (err) {
        console.error('Failed to reset photographer portfolio:', err);
      }
    }

    const defaultData = getInitialData(resolvedType);
    setDesignerProfile(defaultData.designerProfile);
    setPortfolioSections(defaultData.portfolioSections);
    setProjectsData(defaultData.projectsData);
    setApplicationsList(defaultData.applicationsList);
    setServicesData(defaultData.servicesData);
    setProcessSteps(defaultData.processSteps);
    setAwardsData(defaultData.awardsData);
    setExhibitionsData(defaultData.exhibitionsData);
    setClientRoster(defaultData.clientRoster);
    setTestimonials(defaultData.testimonials);
    setTactileSpecs(defaultData.tactileSpecs);
    setInquiries(defaultData.inquiries);

    return await persistChanges(defaultData);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioType: resolvedType,
        switchPortfolioUrl,
        adminSwitchUrl,
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
        isLoading,
        adminAuth,
        updateAdminAuth,
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
        addInquiry,
        toggleInquiryRead,
        deleteInquiry,
        importDatabase,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
