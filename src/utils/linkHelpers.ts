export type ProjectLinkType = 'figma' | 'video' | 'website' | 'case-study';

export interface AnalyzedProjectLink {
  rawUrl: string;
  formattedUrl: string;
  type: ProjectLinkType;
  defaultLabel: string;
  isFigma: boolean;
  figmaEmbedUrl?: string;
  domainName: string;
}

export function formatExternalUrl(raw?: string): string {
  if (!raw || !raw.trim()) return '';
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If user pasted something like `figma.com/...` or `sipam.com`
  return `https://${trimmed}`;
}

export function analyzeProjectLink(rawUrl?: string, customLabel?: string): AnalyzedProjectLink | null {
  const formatted = formatExternalUrl(rawUrl);
  if (!formatted) return null;

  try {
    const parsed = new URL(formatted);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // Figma
    if (host.includes('figma.com')) {
      const isProto = pathname.includes('/proto');
      const defaultLabel = customLabel?.trim() || (isProto ? 'Buka Prototype Figma' : 'Buka Desain di Figma');
      const figmaEmbedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(formatted)}`;
      return {
        rawUrl: rawUrl || '',
        formattedUrl: formatted,
        type: 'figma',
        defaultLabel,
        isFigma: true,
        figmaEmbedUrl,
        domainName: 'figma.com',
      };
    }

    // Video Services
    if (
      host.includes('youtube.com') ||
      host.includes('youtu.be') ||
      host.includes('vimeo.com') ||
      host.includes('instagram.com/reel') ||
      host.includes('tiktok.com')
    ) {
      return {
        rawUrl: rawUrl || '',
        formattedUrl: formatted,
        type: 'video',
        defaultLabel: customLabel?.trim() || 'Tonton Video Asli',
        isFigma: false,
        domainName: host.replace(/^www\./, ''),
      };
    }

    // Case Study Platforms
    if (host.includes('behance.net') || host.includes('dribbble.com') || host.includes('medium.com')) {
      return {
        rawUrl: rawUrl || '',
        formattedUrl: formatted,
        type: 'case-study',
        defaultLabel: customLabel?.trim() || 'Lihat Studi Kasus Lengkap',
        isFigma: false,
        domainName: host.replace(/^www\./, ''),
      };
    }

    // Live Website / Application Demo
    return {
      rawUrl: rawUrl || '',
      formattedUrl: formatted,
      type: 'website',
      defaultLabel: customLabel?.trim() || 'Kunjungi Website / Live Demo',
      isFigma: false,
      domainName: host.replace(/^www\./, ''),
    };
  } catch {
    return {
      rawUrl: rawUrl || '',
      formattedUrl: formatted,
      type: 'website',
      defaultLabel: customLabel?.trim() || 'Kunjungi Tautan Proyek',
      isFigma: false,
      domainName: 'external',
    };
  }
}
