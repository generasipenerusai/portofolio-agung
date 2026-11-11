import graphicDb from './db.json';
import {
  Project,
  PortfolioSection,
  DesignerProfile,
  ApplicationTool,
  ServiceItem,
  ProcessStep,
  AwardItem,
  ExhibitionItem,
} from '../types/portfolio';

export const defaultPortfolioSections: PortfolioSection[] = graphicDb.portfolioSections as PortfolioSection[];
export const designerProfile: DesignerProfile = graphicDb.designerProfile as DesignerProfile;
export const applicationsList: ApplicationTool[] = graphicDb.applicationsList as ApplicationTool[];
export const projectsData: Project[] = graphicDb.projectsData as Project[];
export const servicesData: ServiceItem[] = graphicDb.servicesData as ServiceItem[];
export const processSteps: ProcessStep[] = graphicDb.processSteps as ProcessStep[];
export const awardsData: AwardItem[] = graphicDb.awardsData as AwardItem[];
export const exhibitionsData: ExhibitionItem[] = (graphicDb.exhibitionsData || []) as ExhibitionItem[];
export const clientRoster = graphicDb.clientRoster || [];
export const testimonials = graphicDb.testimonials || [];
export const tactileSpecs = graphicDb.tactileSpecs || [];
export const initialInquiries = graphicDb.inquiries || [];
