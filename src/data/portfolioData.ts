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

export const defaultPortfolioSections: PortfolioSection[] = [
  {
    id: 'main',
    eyebrow: 'Portofolio Utama',
    title: 'Karya Desain & Studi Kasus',
    subtitle: 'Klik pada karya untuk melihat detail kontribusi, proses pengerjaan, dan hasil akhir.',
    layout: 'grid-2',
  },
];

export const designerProfile: DesignerProfile = {
  name: 'Agung Sabdo Wicaksono',
  primaryRole: 'Digital Designer / UI UX Designer',
  subRoles: [
    'Digital Designer',
    'UI/UX Designer',
    'Web Designer',
    'Motion Graphics',
    'Photo & Video Editor',
    'Cinematography & Color Grading',
    'Custom Typography',
  ],
  aliasTitle: 'Desainer Grafis & Visual Artist',
  photoUrl: '/images/agung-sabdo.png',
  headline: 'CREATING DESIGNS FOR ALL DIGITAL CREATIVE NEEDS',
  bioParagraphs: [
    'Halo! Saya Agung Sabdo Wicaksono, Digital Designer dan UI/UX Designer dengan pengalaman membuat design digital, desain web/UI, motion graphics, fotografi editorial, video editorial dan konten visual kreatif.',
    'Bagi saya, desain adalah seni memecahkan masalah sekaligus menyampaikan narasi visual yang berkarakter, memadukan ketepatan fungsi dengan nilai estetika yang kuat.',
    'Setiap proyek dikerjakan secara personal dan mendalam: dari riset konsep, eksplorasi visual, hingga eksekusi akhir yang presisi dan berkualitas tinggi.',
  ],
  location: 'South Tangerang, Indonesia · Available',
  timezone: 'GMT+7 (WIB)',
  email: 'agung.sabdo.w@gmail.com',
  phone: '+62 851-5687-7792',
  studioAddress: 'Jl. Benda Barat 9, Blok C 14 No. 17H, Pondok Benda, Pamulang, Tangerang Selatan',
  workingHours: 'Senin - Jumat: 09:00 - 18:00 WIB',
  responseTime: 'Dibalas dalam 1x24 jam kerja',
  portfolioPdfUrl: '#kontak',
  availability: {
    status: 'Available',
    currentQuarter: 'Q1 / Q2 2026',
    note: 'Terbuka untuk pekerjaan freelance, proyek desain grafis, digital, dan konsultasi kreatif personal.',
  },
  statistics: [
    { number: '54+', label: 'Proyek Selesai', sublabel: 'Grafis, Motion & Video' },
    { number: '4+', label: 'Sertifikasi Keahlian', sublabel: 'UI/UX, Desain Visual & Motion' },
    { number: '8+', label: 'Tahun Pengalaman', sublabel: 'Desainer & Kreatif Independen' },
    { number: '100%', label: 'Komitmen Kualitas', sublabel: 'Tepat waktu & berorientasi solusi' },
  ],
  socials: [
    { platform: 'Behance', username: 'agung.sabdo', url: 'https://behance.net', highlight: true },
    { platform: 'Instagram', username: '@agung.sabdo.studio', url: 'https://instagram.com', highlight: true },
    { platform: 'Vimeo', username: 'agung.sabdo-motion', url: 'https://vimeo.com', highlight: true },
    { platform: 'Dribbble', username: 'agungsabdo', url: 'https://dribbble.com' },
    { platform: 'Are.na', username: 'agung.sabdo-archive', url: 'https://are.na' },
    { platform: 'LinkedIn', username: 'agung.sabdo', url: 'https://linkedin.com' },
  ],
};

export const applicationsList: ApplicationTool[] = [
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    shortCode: 'Ai',
    category: 'Vektor & Brand',
    experienceLevel: 'Primary Daily Driver',
    yearsUsed: '8+ Tahun',
    color: {
      bg: 'bg-[#FF9A00]/10',
      text: 'text-[#FF9A00]',
      border: 'border-[#FF9A00]/30',
      badge: 'bg-[#FF9A00] text-black',
    },
    description:
      'Perangkat utama untuk menggambar logomark vektor dengan kurva bezier presisi mikron, membangun sistem grid identitas, serta merancang struktur pola potong (dieline) kemasan botol dan boks karton.',
    keyUseCases: [
      'Konstruksi Geometri Vektor & Monogram',
      'Desain Dieline & Pisau Potong Kemasan Box',
      'Tipografi Kustom & Penyesuaian Kerning Vektor',
      'Asset Master Siap Cetak (Separasi Warna & Trap)',
    ],
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    shortCode: 'Ps',
    category: 'Raster & Tekstur',
    experienceLevel: 'Primary Daily Driver',
    yearsUsed: '8+ Tahun',
    color: {
      bg: 'bg-[#31A8FF]/10',
      text: 'text-[#31A8FF]',
      border: 'border-[#31A8FF]/30',
      badge: 'bg-[#31A8FF] text-white',
    },
    description:
      'Digunakan untuk manipulasi tekstur kertas seni (paper grain), komposisi fotografi produk, simulasi efek fisik foil emas dan debossing 3D, serta koreksi warna kuratorial FOGRA39.',
    keyUseCases: [
      'Penyusunan Mockup Fotorealistik Beresolusi Tinggi',
      'Tekstur Taktil Kertas (Cotton, Linen, Gesso)',
      'Simulasi Kilau Foil Emas & Emboss Tiga Dimensi',
      'Retouching Foto Editorial & Pemisahan Kanal Tinta',
    ],
  },
  {
    id: 'indesign',
    name: 'Adobe InDesign',
    shortCode: 'Id',
    category: 'Editorial & Layout',
    experienceLevel: 'Production Master',
    yearsUsed: '7+ Tahun',
    color: {
      bg: 'bg-[#FF3366]/10',
      text: 'text-[#FF3366]',
      border: 'border-[#FF3366]/30',
      badge: 'bg-[#FF3366] text-white',
    },
    description:
      'Pilar utama untuk arsitektur publikasi buku seni, monografi sampul keras, pedoman manual jenama (brand guidelines), dan majalah dengan kedisiplinan modular grid Swiss.',
    keyUseCases: [
      'Tata Letak Buku Monografi & Publikasi Multi-Halaman',
      'Penyusunan Brand Architecture & Guidelines Book',
      'Manajemen Master Pages, Baseline Grid & Style Sheets',
      'Kompilasi File Pre-Press PDF/X-1a dengan Bleed & Slugs',
    ],
  },
  {
    id: 'blender',
    name: 'Blender 3D',
    shortCode: 'Bl',
    category: '3D & Kemasan',
    experienceLevel: 'Advanced Specialist',
    yearsUsed: '4+ Tahun',
    color: {
      bg: 'bg-[#EA7600]/10',
      text: 'text-[#EA7600]',
      border: 'border-[#EA7600]/30',
      badge: 'bg-[#EA7600] text-white',
    },
    description:
      'Membangun model tiga dimensi dari botol kaca ambar, jar kosmetik, dan struktur kotak lipat untuk memvisualisasikan interaksi cahaya alami dengan tekstur kertas sebelum masuk lini produksi massal.',
    keyUseCases: [
      'Pemodelan Botol Kaca, Pipet & Tutup Kayu 3D',
      'Simulasi Pencahayaan Studio Foto Virtual (Raytracing)',
      'Uji Ergonomi Sudut Pandang Ritel Kemasan Produk',
      'Rendering Animasi Rotasi 360 Derajat untuk Presentasi Klien',
    ],
  },
  {
    id: 'glyphs',
    name: 'Glyphs 3',
    shortCode: 'Gl',
    category: 'Huruf & Font',
    experienceLevel: 'Advanced Specialist',
    yearsUsed: '5+ Tahun',
    color: {
      bg: 'bg-[#8A3FFC]/10',
      text: 'text-[#A56EFF]',
      border: 'border-[#8A3FFC]/30',
      badge: 'bg-[#8A3FFC] text-white',
    },
    description:
      'Perangkat lunak khusus tipografi untuk merancang karakter huruf rupa dari nol, memahat kurva glif optikal, menyusun fitur OpenType, dan menggenerasikan font variabel 9 bobot.',
    keyUseCases: [
      'Desain Glif Huruf Abjad Alfabet & Angka Karakteristik',
      'Pengaturan Metrik Spasi Huruf & Tabel Kerning Presisi',
      'Pemrograman Fitur OpenType (Ligatur, Alternates)',
      'Ekspor Font Siap Pakai Format OTF, TTF & WOFF2',
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    shortCode: 'Fg',
    category: 'Digital & Interface',
    experienceLevel: 'Primary Daily Driver',
    yearsUsed: '6+ Tahun',
    color: {
      bg: 'bg-[#0ACF83]/10',
      text: 'text-[#0ACF83]',
      border: 'border-[#0ACF83]/30',
      badge: 'bg-[#0ACF83] text-black',
    },
    description:
      'Platform kolaboratif untuk mempresentasikan arah seni visual kepada klien secara real-time, menyusun sistem token desain digital, serta membuat prototipe panduan identitas interaktif.',
    keyUseCases: [
      'Presentasi Papan Konsep & Moodboard Interaktif',
      'Penyusunan Sistem Aset Digital Brand Guidelines',
      'Uji Skalabilitas Logo pada Berbagai Ukuran Layar',
      'Handoff Aset Vektor Beresolusi Tinggi ke Tim Pengembang',
    ],
  },
  {
    id: 'aftereffects',
    name: 'Adobe After Effects',
    shortCode: 'Ae',
    category: 'Vektor & Brand',
    experienceLevel: 'Advanced Specialist',
    yearsUsed: '5+ Tahun',
    color: {
      bg: 'bg-[#9999FF]/10',
      text: 'text-[#9999FF]',
      border: 'border-[#9999FF]/30',
      badge: 'bg-[#9999FF] text-black',
    },
    description:
      'Menghidupkan identitas visual melalui animasi tipografi kinetik, bumper logo dinamis, dan materi video pameran seni untuk media sosial maupun layar instalasi galeri.',
    keyUseCases: [
      'Kinetic Typography & Animasi Huruf Display',
      'Motion Bumper Induk Identitas Jenama',
      'Simulasi Dinamis Poster Bergerak (Animated Posters)',
      'Video Presentasi Studi Kasus Eksibisi',
    ],
  },
  {
    id: 'procreate',
    name: 'Procreate / Sketsa Manual',
    shortCode: 'Pr',
    category: 'Vektor & Brand',
    experienceLevel: 'Primary Daily Driver',
    yearsUsed: '8+ Tahun',
    color: {
      bg: 'bg-[#FF5500]/10',
      text: 'text-[#FF5500]',
      border: 'border-[#FF5500]/30',
      badge: 'bg-[#FF5500] text-white',
    },
    description:
      'Garis pertahanan pertama proses kreatif. Dari goresan pensil di buku sketsa fisik hingga ilustrasi tangan digital untuk eksplorasi bentuk awal sebelum dipindahkan ke vektor komputer.',
    keyUseCases: [
      'Sketsa Thumbnail Komposisi Poster & Kemasan',
      'Eksplorasi Kaligrafi Tangan & Bentuk Huruf Awal',
      'Ilustrasi Botani & Ornamen Vintage untuk Label',
      'Penyusunan Mindmapping Konsep Visual Cepat',
    ],
  },
];

export const projectsData: Project[] = [
  {
    id: 'aura-botanica',
    title: 'Aura Botanica',
    subtitle: 'Luxury Organic Ritual Skincare & Packaging System',
    client: 'Aura Botanica Kyoto',
    year: '2025',
    category: 'Packaging',
    tags: ['Packaging Design', 'Visual Identity', 'Sustainable Materials', 'Embossing'],
    featured: true,
    aspectRatio: 'standard',
    mockupType: 'bottle-packaging',
    heroTheme: {
      bg: 'from-stone-900 via-stone-950 to-black',
      text: 'text-stone-100',
      accent: 'text-amber-300',
      border: 'border-amber-300/30',
      tagBg: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
    },
    summary:
      'Sistem kemasan holistik dan identitas visual untuk jenama perawatan kulit organik premium dengan sentuhan estetika Wabi-Sabi dan kemewahan minimalis.',
    designBrief:
      'Klien membutuhkan kemasan yang mampu merefleksikan kemurnian bahan botani Jepang, mengurangi jejak karbon 100% tanpa plastik sintetis, namun tetap memancarkan prestise di rak ritel mewah Ginza dan Paris.',
    conceptPhilosophy:
      'Konsep "Subtle Whispers of Nature". Menggunakan kontras antara kaca ambar matte gelap dengan tekstur kasar kertas daur ulang berserat rami (hemp), dipadukan tipografi serif organik bertinta hitam pekat dan cap foil emas redup.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Lead Packaging & Brand Identity Designer',
      contributionType: 'Solo Art Direction & Production Supervision (100%)',
      responsibilities: [
        'Merancang arsitektur struktur boks kemasan unboxing dari nol',
        'Menggambar logotype custom serif dan monogram segel botol',
        'Mengurasi material kertas daur ulang Fedrigoni 360gsm',
        'Membuat simulasi render 3D botol kaca ambar dan label foil',
        'Melakukan uji coba cetak langsung (press-check) di fasilitas Kyoto',
      ],
    },

    // APLIKASI YANG DIGUNAKAN
    toolsUsed: [
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Vektorisasi logomark, hierarki tipografi label, dan presisi dieline pola boks',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
      {
        name: 'Adobe Photoshop',
        code: 'Ps',
        purpose: 'Simulasi tekstur kertas katun kasar, kilau foil emas Kurz, dan retouching foto produk',
        colorBg: 'bg-[#31A8FF]/10',
        colorText: 'text-[#31A8FF]',
      },
      {
        name: 'Blender 3D',
        code: 'Bl',
        purpose: 'Pemodelan botol kaca ambar 3D dan simulasi pencahayaan studio untuk visual ritel',
        colorBg: 'bg-[#EA7600]/10',
        colorText: 'text-[#EA7600]',
      },
      {
        name: 'Adobe InDesign',
        code: 'Id',
        purpose: 'Penyusunan Brand Guidelines dan lembar spesifikasi teknis cetak untuk pabrik',
        colorBg: 'bg-[#FF3366]/10',
        colorText: 'text-[#FF3366]',
      },
    ],

    // PROSES PEMBUATAN STEP-BY-STEP
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Riset Semiotika & Studi Wabi-Sabi',
        duration: 'Minggu 1 - 2',
        toolUsed: 'Procreate & Figma',
        description:
          'Mempelajari ritual kecantikan tradisional Kyoto dan filosofi ketidaksempurnaan Wabi-Sabi. Mengumpulkan sampel tekstur kertas serat rami dan kaca ambar kuno untuk moodboard taktil.',
        keyMilestone: 'Dossier Arah Visual & Moodboard Taktil',
      },
      {
        stepNumber: '02',
        title: 'Sketsa Struktur Kemasan & Dieline',
        duration: 'Minggu 3 - 4',
        toolUsed: 'Adobe Illustrator & Mockup Fisik',
        description:
          'Menggambar pola potong pisau (dieline) kotak luar berengsel tanpa lem kimia. Membuat prototipe kertas karton manual untuk menguji kenyamanan genggaman dan sensasi unboxing pembeli.',
        keyMilestone: 'Prototipe Fisik Karton Dummy 1:1',
      },
      {
        stepNumber: '03',
        title: 'Pahat Tipografi & Pemodelan 3D',
        duration: 'Minggu 5 - 6',
        toolUsed: 'Adobe Illustrator & Blender 3D',
        description:
          'Merancang huruf serif khusus dengan goresan ujung organik. Memindahkan desain ke ruang 3D Blender untuk menguji pantulan cahaya pada botol kaca ambar dan kilau cap emas Kurz.',
        keyMilestone: 'Rendering 3D Fotorealistik & Vektor Final',
      },
      {
        stepNumber: '04',
        title: 'Supervisi Cetak & Uji Pantone',
        duration: 'Minggu 7 - 8',
        toolUsed: 'Adobe InDesign & Press-Check',
        description:
          'Mempersiapkan plat cetak FOGRA39, mencocokkan formula warna Pantone 7506 C pada kertas Fedrigoni Materica, serta menguji kedalaman blind deboss 0.8mm langsung di mesin cetak.',
        keyMilestone: 'Persetujuan Cetak Proof & Produksi Massal',
      },
    ],

    deliverables: [
      'Struktur Box & Unboxing Architecture',
      'Desain Label Botol Pipet & Jar Kaca',
      'Logotype & Monogram Custom Serif',
      'Panduan Sistem Warna & Manual Cetak',
      'Stempel Segel Kering & Pita Katun Alami',
    ],
    printSpecs: {
      paperStock: 'Fedrigoni Materica Gesso 360gsm (15% serat katun, 40% daur ulang)',
      finishing: [
        'Kurz Luxor Gold Foil Hot Stamping',
        'Blind Debossing 3D kedalaman 0.8mm',
        'Soft-touch Matte Bio-Varnish',
      ],
      pantone: ['Pantone 405 C (Warm Stone Gray)', 'Pantone 7506 C (Muted Raw Silk)'],
      dimensions: 'Box Luar: 55 x 55 x 140 mm | Label Botol: 120 x 48 mm',
      technique: 'Offset Lithography 4 Warna + 2 Spot Pantone Inks',
    },
    colorPalette: [
      { hex: '#1C1B17', name: 'Obsidian Earth', pantone: 'Pantone Black 7 C', cmyk: '65 / 60 / 60 / 80' },
      { hex: '#D7CEB2', name: 'Raw Hemp Silk', pantone: 'Pantone 7506 C', cmyk: '15 / 15 / 30 / 0' },
      { hex: '#C29B38', name: 'Sunken Gold Foil', pantone: 'Kurz Luxor 220', cmyk: '20 / 35 / 90 / 5' },
      { hex: '#4A5B4E', name: 'Botanical Cedar', pantone: 'Pantone 5545 C', cmyk: '60 / 30 / 60 / 25' },
    ],
    typographyStack: [
      {
        role: 'Primary Display Logotype',
        fontName: 'Custom Aruna Serif Display',
        category: 'Serif',
        sampleText: 'AURA BOTANICA · ESSENCE DE LA TERRE',
      },
      {
        role: 'Secondary & Ingredients',
        fontName: 'Neue Haas Grotesk Light',
        category: 'Grotesque',
        sampleText: 'Camellia Sinensis Leaf Extract · 50ml e 1.7 fl.oz',
      },
    ],
    impactMetrics: [
      { label: 'Dampak Penjualan', value: '+142% Pre-Order' },
      { label: 'Pengurangan Plastik', value: '0% Single-Use' },
      { label: 'Apresiasi Kuratorial', value: 'Tokyo TDC 2025' },
    ],
    testimonial: {
      quote:
        'Agung tidak sekadar mendesain label; ia membangun sebuah pengalaman sensorial yang membuat pelanggan kami enggan membuang kotak kemasannya.',
      author: 'Emi Tanaka',
      role: 'Founder & Botanical Formulator',
      organization: 'Aura Botanica Co.',
    },
  },
  {
    id: 'kroma-foundry',
    title: 'KROMA Display Specimen',
    subtitle: 'Variable Display Typeface & Experimental Broadsheet',
    client: 'Kroma Type Foundry',
    year: '2025',
    category: 'Typography',
    tags: ['Type Design', 'Variable Font', 'Specimen Book', 'Brutalist'],
    featured: true,
    aspectRatio: 'tall',
    mockupType: 'font-specimen',
    heroTheme: {
      bg: 'from-zinc-950 via-neutral-900 to-black',
      text: 'text-zinc-100',
      accent: 'text-lime-400',
      border: 'border-lime-400/30',
      tagBg: 'bg-lime-400/10 text-lime-300 border-lime-400/20',
    },
    summary:
      'Desain huruf rupa eksperimental dengan 9 master bobot variabel, disertai publikasi broadsheet koran format besar dan web specimen interaktif.',
    designBrief:
      'Merancang typeface pameran arsitektur yang menggabungkan sudut ketajaman pahatan batu brutalist dengan ink traps hiperbolik yang mencolok pada ukuran raksasa.',
    conceptPhilosophy:
      'Menentang kelembutan tipografi digital masa kini. KROMA memancarkan ketegasan geometri murni, sudut siku tajam 45 derajat, dan proporsi monospaced optikal yang menciptakan ritme visual agresif.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Typeface Designer & Editorial Director',
      contributionType: 'Lead Typographer & Book Architect (100%)',
      responsibilities: [
        'Merancang 720 karakter glif lengkap alfabet, angka, dan ligatur',
        'Menyusun sumbu font variabel dari bobot Hairline hingga Ultra Black',
        'Menata letak publikasi poster broadsheet koran format besar A1',
        'Mengawasi cetak rotasi rotary press koran dengan tinta neon Pantone 802 C',
      ],
    },

    // APLIKASI YANG DIGUNAKAN
    toolsUsed: [
      {
        name: 'Glyphs 3',
        code: 'Gl',
        purpose: 'Pemahatan kurva bezier huruf, kalkulasi sudut 45 derajat, dan tabel kerning',
        colorBg: 'bg-[#8A3FFC]/10',
        colorText: 'text-[#A56EFF]',
      },
      {
        name: 'Adobe InDesign',
        code: 'Id',
        purpose: 'Layout editorial broadsheet format koran A1 dan katalog spesimen glif',
        colorBg: 'bg-[#FF3366]/10',
        colorText: 'text-[#FF3366]',
      },
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Eksplorasi grafis vektor pembatas, diagram arsitektur, dan cover sleeve',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
    ],

    // PROSES PEMBUATAN
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Studi Monumen Brutalis & Sketsa Karakter',
        duration: 'Bulan 1',
        toolUsed: 'Sketsa Manual Pensil & Grid 1mm',
        description:
          'Mendokumentasikan sudut beton bangunan brutalis tahun 1960-an. Menggambar huruf kunci (n, o, H, O, R, K) untuk menentukan kontras batang dan bentuk ink-traps.',
        keyMilestone: 'Karakter Induk Fondasi (Master Letters)',
      },
      {
        stepNumber: '02',
        title: 'Pemahatan Digital & Interpolasi Variabel',
        duration: 'Bulan 2 - 3',
        toolUsed: 'Glyphs 3',
        description:
          'Menggambar 720 glif pada dua kutub ekstrem (Thin 100 dan Black 950). Melakukan interpolasi kurva matematis untuk menghasilkan 7 master bobot menengah tanpa kehilangan ketajaman.',
        keyMilestone: 'File Font Variabel WOFF2 & OTF',
      },
      {
        stepNumber: '03',
        title: 'Desain Publikasi Broadsheet Koran A1',
        duration: 'Bulan 4',
        toolUsed: 'Adobe InDesign & Illustrator',
        description:
          'Merancang tata letak koran raksasa ukuran 594 x 841 mm untuk mendemonstrasikan kekuatan visual font pada ukuran 240pt hingga 6pt. Menyusun halaman lipatan poster yang dramatis.',
        keyMilestone: 'Artwork Broadsheet Siap Cetak Koran',
      },
      {
        stepNumber: '04',
        title: 'Pencetakan Rotary Press & Neon Overprint',
        duration: 'Bulan 5',
        toolUsed: 'Mesin Web Press & Sablon Neon',
        description:
          'Mencetak 2.000 lembar pada kertas koran Holmen Newsprint 65gsm, kemudian menyablon lapisan overprint dengan tinta neon fluoresen hijau Pantone 802 C pada sampul selongsong.',
        keyMilestone: 'Koleksi Spesimen Cetak Terdistribusi Global',
      },
    ],

    deliverables: [
      'Keluarga Font OTF, TTF & WOFF2 (9 Bobot Variabel)',
      'Poster Lipat Broadsheet Ukuran A1 (594 x 841 mm)',
      'Katalog Glif Eksperimental & Karakter Alternatif',
      'Micro-site Interaktif Typographic Tester',
    ],
    printSpecs: {
      paperStock: 'Holmen TRND 65gsm Uncoated Newsprint Cream',
      finishing: ['Coldset Web Press Newspaper', 'Manual Hand Cross-Fold', 'Silkscreen Fluorescent Cover Sleeve'],
      pantone: ['Pantone 802 C (Fluorescent Electric Lime)', 'Pantone Black 6 C'],
      dimensions: 'A1 Terbuka (594 x 841 mm) | Lipatan A4 (210 x 297 mm)',
      technique: 'Rotary Web Press + Screenprinted Neon Overprint',
    },
    colorPalette: [
      { hex: '#000000', name: 'Pitch Black', pantone: 'Black 6 C', cmyk: '80 / 70 / 70 / 100' },
      { hex: '#CCFF00', name: 'Radioactive Lime', pantone: 'Pantone 802 C Fluo', cmyk: '30 / 0 / 100 / 0' },
      { hex: '#EBEAE4', name: 'Raw Newsprint Pulp', pantone: 'Warm Gray 1 C', cmyk: '5 / 5 / 8 / 0' },
    ],
    typographyStack: [
      {
        role: 'Featured Headline Font',
        fontName: 'KROMA Brutal Display Black',
        category: 'Display',
        sampleText: 'ARCHITECTURAL TECTONICS & RADICAL GLYPHS',
      },
      {
        role: 'Caption & Micro Grid Data',
        fontName: 'Space Mono Regular',
        category: 'Monospace',
        sampleText: 'GLYPH_COUNT: 720 | OT_FEATURES: [aalt, liga, dlig, ss01-ss08]',
      },
    ],
    impactMetrics: [
      { label: 'Lisensi Diunduh', value: '3,800+ Desainer' },
      { label: 'Eksibisi Tipografi', value: 'Zurich Kunsthaus' },
      { label: 'Glif Karakter', value: '720 Karakter' },
    ],
  },
  {
    id: 'neo-tokyo-jazz',
    title: 'Neo-Tokyo Avant-Garde Jazz',
    subtitle: 'Screenprinted Poster Trilogy & Festival Visual Identity',
    client: 'Tokyo Arts & Music Foundation',
    year: '2024',
    category: 'Poster Series',
    tags: ['Poster Design', 'Silkscreen', 'Swiss Grid', 'Risograph Art'],
    featured: true,
    aspectRatio: 'tall',
    mockupType: 'risograph-poster',
    heroTheme: {
      bg: 'from-indigo-950 via-slate-900 to-black',
      text: 'text-indigo-100',
      accent: 'text-orange-400',
      border: 'border-orange-400/30',
      tagBg: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    },
    summary:
      'Trilogi poster sablon 3 lapis untuk festival jazz eksperimental di Shibuya, menggabungkan dekonstruksi grid Swiss dengan ritme musik improvisasi bebas.',
    designBrief:
      'Menerjemahkan bebop elektrik dan free-jazz menjadi komposisi grafis dua dimensi statis yang terasa seperti bergetar dan bergerak.',
    conceptPhilosophy:
      'Sinkopasi visual. Grid 12 kolom rasional sengaja diinterupsi oleh distorsi gelombang suara analog, memadukan kanji Jepang klasik dengan sans-serif padat.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Poster Artist & Visual Campaign Director',
      contributionType: 'Sole Graphic Designer & Printmaster (100%)',
      responsibilities: [
        'Konseptualisasi tema sinkopasi visual dan distorsi frekuensi sonik',
        'Komposisi grid modular 12 kolom dan tipografi bilingual (Jepang/Inggris)',
        'Pemisahan kanal warna sablon manual (color separation 3-layer)',
        'Pencetakan manual sablon tangan bersama studio artisan di Tokyo',
      ],
    },

    // APLIKASI YANG DIGUNAKAN
    toolsUsed: [
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Vektorisasi gelombang sonik parametrik dan struktur grid tipografi',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
      {
        name: 'Adobe Photoshop',
        code: 'Ps',
        purpose: 'Separasi warna halftone sablon (screen angle) dan tekstur grain risograph',
        colorBg: 'bg-[#31A8FF]/10',
        colorText: 'text-[#31A8FF]',
      },
      {
        name: 'Adobe After Effects',
        code: 'Ae',
        purpose: 'Animasi poster kinetik untuk layar LED panggung utama Shibuya Stream Hall',
        colorBg: 'bg-[#9999FF]/10',
        colorText: 'text-[#9999FF]',
      },
    ],

    // PROSES PEMBUATAN
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Analisis Audio Frekuensi & Eksplorasi Gelombang',
        duration: 'Minggu 1',
        toolUsed: 'Synthesizer Audio & Sketsa Manual',
        description:
          'Mendengarkan rekaman free-jazz para penampil festival. Mengonversi spektrum audio frekuensi drum dan saksofon menjadi pola gelombang vektor parametrik.',
        keyMilestone: 'Pustaka Pola Gelombang Audio Vektor',
      },
      {
        stepNumber: '02',
        title: 'Eksplorasi Grid Swiss & Tipografi Bilingual',
        duration: 'Minggu 2',
        toolUsed: 'Adobe Illustrator',
        description:
          'Menyusun 12 kolom rasional Swiss, kemudian mendistorsinya dengan gaya glitch analog. Memadukan kanji Jepang tradisional dengan sans-serif modern berbobot ekstra tebal.',
        keyMilestone: 'Komposisi Visual Vektor Final',
      },
      {
        stepNumber: '03',
        title: 'Separasi Warna Sablon & Sudut Halftone',
        duration: 'Minggu 3',
        toolUsed: 'Adobe Photoshop',
        description:
          'Memisahkan karya menjadi 3 film transparan terpisah: Lapisan Tinta Oranye Fluoresen (Pantone 805 C), Tinta Biru Gelap (Reflex Blue), dan Tinta Putih Opak dengan sudut mesh 120T.',
        keyMilestone: 'Film Positif Sablon Terkalibrasi',
      },
      {
        stepNumber: '04',
        title: 'Cetak Sablon Tangan Edisi Terbatas',
        duration: 'Minggu 4',
        toolUsed: 'Meja Sablon Manual & G.F Smith Colorplan',
        description:
          'Menarik rakel sablon secara manual lapis demi lapis di atas kertas Colorplan Dark Indigo 270gsm. Membubuhkan stempel timbul dan penomoran tangan dari nomor 001/150 hingga 150/150.',
        keyMilestone: '150 Lembar Poster Seni Bernomor Resmi',
      },
    ],

    deliverables: [
      '3 Seri Poster Kolektor Bersegel Khusus (500 x 700 mm)',
      'Identitas Tipografi Festival & Tiket Holografik',
      'Merchandise Baju Cetak Sablon Pigment Discharge',
      'Animasi Tipografi untuk Layar LED Panggung Utama',
    ],
    printSpecs: {
      paperStock: 'Colorplan Dark Indigo 270gsm by G.F Smith',
      finishing: ['Hand-Pulled 3-Color Screenprint', 'Fluorescent Orange + Reflex Blue + Opaque White Ink'],
      pantone: ['Pantone 805 C Fluo Orange', 'Pantone Reflex Blue C', 'Pantone Silver 877 C'],
      dimensions: 'Format 500 x 700 mm edisi terbatas 150 cetakan bernomor',
      technique: 'Manual Silk Screenprinting dengan mesh 120T',
    },
    colorPalette: [
      { hex: '#0D1129', name: 'Shibuya Midnight', pantone: 'Reflex Blue C', cmyk: '95 / 85 / 30 / 40' },
      { hex: '#FF5426', name: 'Fluorescent Vermilion', pantone: 'Pantone 805 C Fluo', cmyk: '0 / 80 / 85 / 0' },
      { hex: '#F0EFF4', name: 'Opaque Chalk White', pantone: 'White Pigment', cmyk: '0 / 0 / 0 / 0' },
    ],
    typographyStack: [
      {
        role: 'Festival Title',
        fontName: 'Clash Grotesk Extra Bold',
        category: 'Grotesque',
        sampleText: 'NEO-TOKYO FREE JAZZ NIGHTS 2024',
      },
      {
        role: 'Lineup & Dates Grid',
        fontName: 'JetBrains Mono Bold',
        category: 'Monospace',
        sampleText: 'SHIBUYA STREAM HALL · NOV 14-17 · 19:30 JST',
      },
    ],
    impactMetrics: [
      { label: 'Edisi Cetak Terjual', value: '100% Sold Out 4 Jam' },
      { label: 'Penghargaan', value: 'Graphis Poster Silver' },
      { label: 'Kehadiran Festival', value: '14,000+ Penikmat' },
    ],
    testimonial: {
      quote:
        'Poster karya Agung menjadi artefak koleksi yang bahkan dibeli oleh musisi dunia yang tampil di panggung kami.',
      author: 'Kenji Takahashi',
      role: 'Creative Director',
      organization: 'Tokyo Avant-Garde Arts Guild',
    },
  },
  {
    id: 'atelier-noir',
    title: 'Atelier Noir Horlogerie',
    subtitle: 'Brand Identity & Bespoke Monograph for Independent Watchmaker',
    client: 'Atelier Noir Genève',
    year: '2024',
    category: 'Branding',
    tags: ['Luxury Branding', 'Editorial Monograph', 'Blind Deboss', 'Art Direction'],
    featured: false,
    aspectRatio: 'wide',
    mockupType: 'luxury-editorial',
    heroTheme: {
      bg: 'from-stone-950 via-zinc-900 to-black',
      text: 'text-stone-100',
      accent: 'text-stone-300',
      border: 'border-stone-500/30',
      tagBg: 'bg-stone-500/10 text-stone-300 border-stone-500/20',
    },
    summary:
      'Sistem identitas jenama monokromatik dan buku monografi hardcover 160 halaman untuk pembuat jam tangan mekanis independen di Jenewa.',
    designBrief:
      'Menyajikan ketelitian mikron pengerjaan jam tangan mekanik ke dalam bahasa grafis yang abadi, sunyi, dan eksklusif tanpa ornamen berlebih.',
    conceptPhilosophy:
      'Filosofi "The Architecture of Seconds". Ruang negatif yang lapang, proporsi grid klasik Fibonacci, dan penolakan terhadap warna mencolok demi menonjolkan tekstur material murni titanium dan baja.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Editorial Architect & Brand Designer',
      contributionType: 'Lead Identity & Book Designer (100%)',
      responsibilities: [
        'Merumuskan sistem identitas jenama monokromatik dan tipografi abadi',
        'Menyusun layout 160 halaman buku monografi cetak sampul keras',
        'Menggambar diagram skematik mikron mesin jam tangan kaliber mekanik',
        'Memilih kombinasi kertas Munken Kristall dan jilid layflat benang sutra',
      ],
    },

    // APLIKASI
    toolsUsed: [
      {
        name: 'Adobe InDesign',
        code: 'Id',
        purpose: 'Penataan master grid 160 halaman buku monografi dan sistem style paragraf',
        colorBg: 'bg-[#FF3366]/10',
        colorText: 'text-[#FF3366]',
      },
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Vektorisasi logo monogram minimalis dan diagram teknis roda gigi mekanik',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
      {
        name: 'Adobe Photoshop',
        code: 'Ps',
        purpose: 'Koreksi warna monokrom fotografi makro titanium dan simulasi deboss perak',
        colorBg: 'bg-[#31A8FF]/10',
        colorText: 'text-[#31A8FF]',
      },
    ],

    // PROSES PEMBUATAN
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Observasi Workshop Jam Tangan di Jenewa',
        duration: 'Minggu 1 - 2',
        toolUsed: 'Dokumentasi Visual & Wawancara Pengrajin',
        description:
          'Mengamati langsung proses perakitan jam tangan mekanis di Jenewa. Merekam ketelitian mikron jarum dan roda gigi sebagai inspirasi proporsi grid desain.',
        keyMilestone: 'Pedoman Konseptual "Architecture of Seconds"',
      },
      {
        stepNumber: '02',
        title: 'Konstruksi Monogram & Tipografi Minimalis',
        duration: 'Minggu 3 - 4',
        toolUsed: 'Adobe Illustrator',
        description:
          'Menggambar wordmark bergaya serif klasik yang anggun dipadukan dengan tipografi monospace teknis untuk spesifikasi kaliber mesin horologi.',
        keyMilestone: 'Sistem Logo & Panduan Tipografi',
      },
      {
        stepNumber: '03',
        title: 'Arsitektur Layout Monografi 160 Halaman',
        duration: 'Minggu 5 - 7',
        toolUsed: 'Adobe InDesign',
        description:
          'Menata narasi visual buku ke dalam grid 6 kolom yang hening dan lega. Setiap halaman diperlakukan sebagai galeri pameran untuk menonjolkan foto mesin jam resolusi makro.',
        keyMilestone: 'Tata Letak Lengkap Buku Monografi',
      },
      {
        stepNumber: '04',
        title: 'Penjilidan Layflat & Cap Stempel Foil Perak',
        duration: 'Minggu 8',
        toolUsed: 'Pengawasan Pabrik Jilid Buku Swiss',
        description:
          'Mengawasi proses penjahitan benang jilid layflat (buka rata 180 derajat) dan pengecapan blind micro-embossing lambang horologi pada kain linen hitam pekat.',
        keyMilestone: '500 Buku Monografi Edisi Kolektor Cetak Sempurna',
      },
    ],

    deliverables: [
      'Buku Monografi Sampul Keras Layflat 160 Halaman',
      'Sertifikat Autentisitas dengan Nomor Seri Watermark',
      'Desain Kemasan Kotak Kayu Eboni & Karton Pelindung',
      'Pedoman Brand Identity & Guidelines 80 Halaman',
    ],
    printSpecs: {
      paperStock: 'Munken Kristall 150gsm (Isi) & Colorplan Pitch Black 350gsm (Cover)',
      finishing: ['Cloth Quarter-Bound Spine dengan Foil Perak Doff', 'Blind Micro-Embossing Lambang Horologi'],
      pantone: ['Pantone Warm Gray 1 C', 'Pantone Black 7 C', 'Pantone Silver 877 C'],
      dimensions: 'Monografi 240 x 320 mm (Format Potret Besar)',
      technique: 'Offset Printing Ultra-High Screen 240 lpi untuk detail makro mesin',
    },
    colorPalette: [
      { hex: '#0E0E10', name: 'Obsidian Noir', pantone: 'Black 7 C', cmyk: '70 / 65 / 65 / 90' },
      { hex: '#D6D6D4', name: 'Raw Titanium', pantone: 'Cool Gray 3 C', cmyk: '10 / 8 / 8 / 15' },
      { hex: '#949494', name: 'Brushed Steel', pantone: 'Silver 877 C', cmyk: '0 / 0 / 0 / 45' },
    ],
    typographyStack: [
      {
        role: 'Brand Wordmark',
        fontName: 'Instrument Serif Italic',
        category: 'Serif',
        sampleText: 'Atelier Noir — Chronométrie d’Art',
      },
      {
        role: 'Technical Specifications',
        fontName: 'Suisse Int’l Mono',
        category: 'Monospace',
        sampleText: 'CALIBRE AN-01 // 28,800 VPH // 54 JEWELS // 72H RESERVE',
      },
    ],
    impactMetrics: [
      { label: 'Eksklusivitas', value: '50 Jam Tangan Terjual' },
      { label: 'Publikasi Fitur', value: 'Hodinkee & Monocle' },
      { label: 'Penghargaan Buku', value: 'Swiss Design Awards Nominee' },
    ],
  },
  {
    id: 'solaris-aperitivo',
    title: 'Solaris Vermouth & Spirits',
    subtitle: 'Artisanal Botanical Aperitivo Packaging & Typography',
    client: 'Solaris Distillers Florence',
    year: '2023',
    category: 'Packaging',
    tags: ['Label Architecture', 'Copper Foil', 'Botanical Engraving', 'Packaging'],
    featured: false,
    aspectRatio: 'standard',
    mockupType: 'botanical-spirits',
    heroTheme: {
      bg: 'from-amber-950 via-stone-900 to-black',
      text: 'text-amber-100',
      accent: 'text-amber-400',
      border: 'border-amber-400/30',
      tagBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    summary:
      'Desain arsitektur label botol berpotongan unik dengan ilustrasi ukiran botani tangan dan foil tembaga metalik untuk minuman aperitif herbal Italia.',
    designBrief:
      'Menciptakan kembali romantisme era keemasan kafe Florence tahun 1920-an namun dengan sentuhan modernisme bersih yang memikat generasi peminum kontemporer.',
    conceptPhilosophy:
      'Harmoni antara ramuan herbal kuno dan geometri kontemporer. Label berlapis dengan potongan die-cut bergelombang khas stempel pos antik Eropa.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Beverage Packaging & Label Specialist',
      contributionType: 'Lead Label Architect & Illustrator (100%)',
      responsibilities: [
        'Menggambar ilustrasi tangan ukiran botani herbal Artemisia dan kulit jeruk',
        'Merancang pisau potong label khusus die-cut bergelombang',
        'Memadukan aplikasi foil tembaga metalik Kurz Luxor dengan kertas tahan lembap',
        'Simulasi materialitas kaca dan lilin penutup botol secara 3D',
      ],
    },

    // APLIKASI
    toolsUsed: [
      {
        name: 'Procreate / Pensil',
        code: 'Pr',
        purpose: 'Eksplorasi sketsa ilustrasi ukiran botani tanaman herbal secara manual',
        colorBg: 'bg-[#FF5500]/10',
        colorText: 'text-[#FF5500]',
      },
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Vektorisasi garis linework ukiran botani, tipografi label, dan pisau die-cut',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
      {
        name: 'Blender 3D',
        code: 'Bl',
        purpose: 'Simulasi botol kaca cairan minuman aperitif dan refleksi foil tembaga',
        colorBg: 'bg-[#EA7600]/10',
        colorText: 'text-[#EA7600]',
      },
    ],

    // PROSES PEMBUATAN
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Riset Botani & Warisan Herbal Florence',
        duration: 'Minggu 1',
        toolUsed: 'Buku Arsip Botani & Sketsa Pensil',
        description:
          'Mempelajari 24 jenis rempah herbal yang digunakan dalam distilasi minuman. Menggambar sketsa awal daun Artemisia dan bunga jeruk bergamot.',
        keyMilestone: 'Sketsa Ilustrasi Tangan Herbal Terverifikasi',
      },
      {
        stepNumber: '02',
        title: 'Vektorisasi Ukiran Garis Halus & Label Die-Cut',
        duration: 'Minggu 2 - 3',
        toolUsed: 'Adobe Illustrator',
        description:
          'Mengubah sketsa manual menjadi ribuan garis vektor halus menyerupai teknik cetak uang kertas kuno. Merancang lengkungan tepi label die-cut yang elegan.',
        keyMilestone: 'Garis Seni Vektor & Struktur Pisau Label',
      },
      {
        stepNumber: '03',
        title: 'Uji Coba Kertas Tahan Air & Foil Tembaga',
        duration: 'Minggu 4',
        toolUsed: 'Fasson Rustique Blanc & Kurz 385',
        description:
          'Menguji ketahanan kertas Fasson terhadap kondensasi es dan air kulkas. Menyesuaikan ketebalan foil tembaga agar tidak pecah saat dibubuhkan pada permukaan bertekstur.',
        keyMilestone: 'Sampel Uji Fisik Label Terpasang di Botol',
      },
      {
        stepNumber: '04',
        title: 'Produksi Flexo Roll Siap Mesin Bottling',
        duration: 'Minggu 5',
        toolUsed: 'Rotary Flexographic Press',
        description:
          'Menyiapkan roll label siap pasang untuk mesin pembotolan otomatis dengan sensor celah jarak 3mm berkecepatan 4.000 botol per jam.',
        keyMilestone: 'Roll Label Cetak Terkirim ke Pabrik Distilasi',
      },
    ],

    deliverables: [
      'Label Depan, Belakang, dan Leher Botol dengan Die-Cut Khusus',
      'Desain Segel Tutup Gabus Kayu Berembos Panas',
      'Ilustrasi Vektor Botani Artemisia & Kulit Jeruk Pahit',
      'Kotak Pengiriman Kayu Terukir Grafir Laser',
    ],
    printSpecs: {
      paperStock: 'Avery Dennison Fasson Rustique Blanc 120gsm (Water-resistant)',
      finishing: ['Kurz Luxor Copper Foil 385', 'Multi-level Sculptured Embossing', 'Matte UV Protection Varnish'],
      pantone: ['Pantone 7517 C (Warm Terracotta)', 'Pantone 7743 C (Herbal Olive)', 'Pantone 876 C (Copper)'],
      dimensions: 'Label Utama: 90 x 145 mm Die-cut berundak',
      technique: 'Rotary Flexographic Press dengan stempel foil inline',
    },
    colorPalette: [
      { hex: '#B85D36', name: 'Terracotta Sun', pantone: 'Pantone 7517 C', cmyk: '20 / 70 / 85 / 10' },
      { hex: '#C87848', name: 'Pure Burnished Copper', pantone: 'Pantone 876 C', cmyk: '25 / 55 / 80 / 5' },
      { hex: '#3B4A34', name: 'Tuscan Cypress Green', pantone: 'Pantone 7743 C', cmyk: '65 / 40 / 75 / 35' },
    ],
    typographyStack: [
      {
        role: 'Aperitivo Name',
        fontName: 'Cinzel Decorative Bold',
        category: 'Display',
        sampleText: 'SOLARIS · APERITIVO BOTANICO',
      },
      {
        role: 'Botanical Notes & Terroir',
        fontName: 'EB Garamond SemiBold Italic',
        category: 'Serif',
        sampleText: 'Infuso con 24 erbe aromatiche e scorze di bergamotto',
      },
    ],
    impactMetrics: [
      { label: 'Distribusi Global', value: '18 Negara' },
      { label: 'Penghargaan', value: 'World Whiskies & Spirits Design Gold' },
      { label: 'Liputan Desain', value: 'The Dieline Feature' },
    ],
  },
  {
    id: 'mono-archive',
    title: 'MONO ARCHIVE // Vol. 08',
    subtitle: 'Brutalist Concrete Architecture Monograph & Exhibition Identity',
    client: 'Fondation d’Architecture Contemporaine',
    year: '2023',
    category: 'Editorial',
    tags: ['Editorial Design', 'Book Design', 'Typography Grid', 'Duotone Print'],
    featured: false,
    aspectRatio: 'standard',
    mockupType: 'monograph-book',
    heroTheme: {
      bg: 'from-neutral-900 via-neutral-950 to-black',
      text: 'text-neutral-100',
      accent: 'text-neutral-300',
      border: 'border-neutral-500/30',
      tagBg: 'bg-neutral-500/10 text-neutral-300 border-neutral-500/20',
    },
    summary:
      'Monografi arsitektur setebal 280 halaman yang mendokumentasikan monumen beton brutalis di Eropa Timur dengan fotografi duotone dan grid tipografi presisi.',
    designBrief:
      'Membangun buku fisik yang memiliki bobot, tekstur kasar, dan kehadiran spasial menyerupai material beton yang dibahas di dalamnya.',
    conceptPhilosophy:
      'Katalogisasi objektif. Tipografi tanpa hierarki dekoratif, margin simetris yang ketat, dan kertas tanpa lapisan (uncoated) yang menyerap tinta pekat menghasilkan kesan puitis yang hening.',
    
    // PERAN DESAINER
    myRole: {
      title: 'Head of Book Design & Editorial Typography',
      contributionType: 'Lead Publication Architect (100%)',
      responsibilities: [
        'Merancang arsitektur grid modular 280 halaman buku monografi',
        'Mengurasi perlakuan fotografi monokrom dan pemisahan duotone hitam/abu',
        'Merancang kotak selongsong slipcase karton abu tebal 3mm',
        'Supervisi pencetakan offset duotone pada kertas Munken Pure Rough',
      ],
    },

    // APLIKASI
    toolsUsed: [
      {
        name: 'Adobe InDesign',
        code: 'Id',
        purpose: 'Tata letak 280 halaman buku, arsitektur grid buku, dan kontrol baseline',
        colorBg: 'bg-[#FF3366]/10',
        colorText: 'text-[#FF3366]',
      },
      {
        name: 'Adobe Photoshop',
        code: 'Ps',
        purpose: 'Pengolahan kurva duotone foto beton brutalis dan kalibrasi tinta hitam pekat',
        colorBg: 'bg-[#31A8FF]/10',
        colorText: 'text-[#31A8FF]',
      },
      {
        name: 'Adobe Illustrator',
        code: 'Ai',
        purpose: 'Desain denah arsitektur vektor dan tipografi blind deboss pada kain linen cover',
        colorBg: 'bg-[#FF9A00]/10',
        colorText: 'text-[#FF9A00]',
      },
    ],

    // PROSES PEMBUATAN
    creationProcess: [
      {
        stepNumber: '01',
        title: 'Katalogisasi Arsip Monumen Beton',
        duration: 'Minggu 1 - 3',
        toolUsed: 'Arsip Sejarah & Spreadsheet Skala',
        description:
          'Mengelompokkan 140 monumen beton berdasarkan koordinat geografis dan tahun pembangunan untuk membangun struktur bab buku yang kronologis.',
        keyMilestone: 'Kerangka Kerja Struktur Isi Buku',
      },
      {
        stepNumber: '02',
        title: 'Formulasi Duotone Fotografi & Grid Monolit',
        duration: 'Minggu 4 - 6',
        toolUsed: 'Adobe Photoshop & InDesign',
        description:
          'Mengonversi foto arsitektur menjadi duotone (Tinta Hitam Pekat + Abu-abu Hangat Pantone Warm Gray 8). Merancang margin simetris 35mm untuk memberikan ruang napas visual.',
        keyMilestone: 'Template Tata Letak 12 Bab Buku',
      },
      {
        stepNumber: '03',
        title: 'Konstruksi Kotak Slipcase & Kain Linen Kasar',
        duration: 'Minggu 7 - 8',
        toolUsed: 'Eska Board 3mm & Uji Emboss',
        description:
          'Membuat kotak pelindung slipcase dari karton daur ulang tebal 3mm. Menguji kedalaman foil stempel hitam matte pada kain linen cover agar menyerupai cetakan beton.',
        keyMilestone: 'Prototipe Fisik Monografi Hardcover',
      },
      {
        stepNumber: '04',
        title: 'Pencetakan Duotone & Penomoran Kolektor',
        duration: 'Minggu 9 - 10',
        toolUsed: 'Offset Heidelberg Speedmaster XL',
        description:
          'Mencetak 1.500 eksemplar di atas kertas Munken Pure Rough 130gsm. Membubuhkan stempel nomor manual dengan tinta stempel hitam permanen pada halaman kolofon.',
        keyMilestone: 'Buku Resmi Terdistribusi & Masuk Arsip MoMA Library',
      },
    ],

    deliverables: [
      'Buku Publikasi 280 Halaman Hardcover Linen',
      'Desain Kotak Selongsong Pelindung (Slipcase) Karton Abu Kasar',
      'Tipografi Judul Embos Panas pada Punggung Buku',
      'Katalog Pameran & Grafis Dinding Galeri',
    ],
    printSpecs: {
      paperStock: 'Munken Pure Rough 130gsm (Isi) & Eska Board 3mm dilapisi Kain Linen Kasar',
      finishing: ['Pemberian Nomor Seri dengan Cap Stempel Tinta Hitam Manual', 'Blind Foil Stamping pada Kain Linen'],
      pantone: ['Pantone Warm Gray 8 C', 'Pantone Black 2 C'],
      dimensions: 'Format 215 x 300 mm | Ketebalan Punggung 34 mm',
      technique: 'Offset Duotone Printing (Black + Warm Gray Ink Mix)',
    },
    colorPalette: [
      { hex: '#242426', name: 'Raw Concrete Charcoal', pantone: 'Black 2 C', cmyk: '65 / 60 / 55 / 75' },
      { hex: '#7A7A78', name: 'Aged Cement Gray', pantone: 'Warm Gray 8 C', cmyk: '45 / 38 / 40 / 10' },
      { hex: '#DEDCD3', name: 'Limestone Chalk', pantone: 'Warm Gray 1 C', cmyk: '10 / 8 / 12 / 0' },
    ],
    typographyStack: [
      {
        role: 'Monograph Headings',
        fontName: 'Syne Extra Bold',
        category: 'Display',
        sampleText: 'SPATIAL MONOLITHS // 1955–1984',
      },
      {
        role: 'Architectural Essays',
        fontName: 'Neue Haas Unica Regular',
        category: 'Grotesque',
        sampleText: 'The raw honesty of cast concrete reveals tectonic truth without ornamentation.',
      },
    ],
    impactMetrics: [
      { label: 'Cetak Edisi Pertama', value: '1,500 Eksemplar Terjual' },
      { label: 'Koleksi Permanen', value: 'MoMA Library Archive' },
      { label: 'Apresiasi', value: 'AIGA 50 Books | 50 Covers' },
    ],
  },
];

export const servicesData: ServiceItem[] = [
  {
    number: '01',
    title: 'Visual Identity & Brand Systems',
    tagline: 'Membangun identitas jenama yang berkarakter kuat dan abadi.',
    description:
      'Bukan sekadar logo, melainkan ekosistem visual menyeluruh yang mencakup arsitektur tipografi, palet warna berlisensi Pantone, aturan komposisi grid, hingga pedoman identitas brand komprehensif.',
    deliverables: [
      'Logotype & Simbol Monogram Custom',
      'Brand Architecture & Guidelines Book (PDF & Web)',
      'Sistem Tipografi & Pasangan Huruf Hirarkis',
      'Desain Stasioneri & Kartu Nama Cetak Spesial',
      'Aset Desain Media Digital & Sosial',
    ],
  },
  {
    number: '02',
    title: 'Tactile Packaging & Label Architecture',
    tagline: 'Kemasan fisik sensorial yang memikat indra sentuhan pembeli.',
    description:
      'Dari struktur unboxing kotak kardus hingga label botol kaca berpresisi tinggi. Mengintegrasikan teknik finishing foil stamping, embossing 3D, pemilihan material kertas berkelanjutan, dan pengawasan pre-press pabrik.',
    deliverables: [
      'Desain Dieline & Struktur Prototipe Kotak',
      'Labeling Botol, Kaleng, Jar & Kemasan Fleksibel',
      'Spesifikasi Material Kertas & Uji Pantone Ink',
      'File Master Siap Cetak (Pre-Press Ready Artwork)',
      'Pengawasan Supervisi Pabrik Percetakan (Print Proof)',
    ],
  },
  {
    number: '03',
    title: 'Editorial, Books & Art Monographs',
    tagline: 'Merancang publikasi cetak dengan ritme narasi spasial yang elegan.',
    description:
      'Layout majalah seni, buku monografi arsitektur, katalog pameran seni rupa, dan laporan tahunan eksklusif. Kami memperlakukan setiap lembar halaman sebagai ruang pameran dua dimensi.',
    deliverables: [
      'Konsep Struktur Grid & Desain Layout Halaman',
      'Sampul Hardcover, Jaket Deboss & Dust-Jacket',
      'Desain Tipografi Punggung Buku & Layflat Binding',
      'Koreksi Warna & Cetak Duotone Fotografi',
      'Spesifikasi Kertas & Percetakan Bernilai Koleksi',
    ],
  },
  {
    number: '04',
    title: 'Typography & Custom Lettering',
    tagline: 'Karakter huruf eksklusif yang membedakan jenama dari kompetitor.',
    description:
      'Merancang display typeface khusus, custom wordmark yang digambar secara presisi vektor manual, hingga eksplorasi kinetic typography untuk instalasi seni digital dan kampanye pameran.',
    deliverables: [
      'Bespoke Wordmarks & Huruf Display Khusus',
      'Set Glif Karakter Huruf Alfabet & Karakter Alternatif',
      'File Font Digital (OTF, TTF, WOFF, WOFF2)',
      'Poster Spesimen Huruf Fisik & Digital Specimen',
      'Lisensi Hak Cipta Kepemilikan Huruf Penuh',
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    phase: 'DISCOVER & DECONSTRUCT',
    title: 'Semiotika Visual & Eksplorasi Konseptual',
    description:
      'Menganalisis kode-kode visual, sejarah budaya industri klien, dan peta diferensiasi estetika. Menyusun moodboard taktil yang menggabungkan tekstur fisik, referensi seni sejarah, dan arah nada visual.',
    methodology: ['Semiotics & Cultural Research', 'Tactile Moodboards', 'Creative Direction Brief', 'Competitive Visual Audit'],
    deliverableHighlight: 'Dossier Arah Artistik & Hipotesis Desain',
  },
  {
    number: '02',
    phase: 'SCAFFOLD & CRAFT',
    title: 'Arsitektur Tipografi & Eksplorasi Grid',
    description:
      'Merancang sketsa dasar, proporsi matematis, dan interaksi antara ruang positif dan negatif. Menentukan apakah sebuah karya membutuhkan kedisiplinan grid Swiss atau kebebasan komposisi dekonstruktivis.',
    methodology: ['Bespoke Letterform Sketching', 'Modular Grid Construction', 'Contrast & Visual Rhythm', 'Macro/Micro Scale Testing'],
    deliverableHighlight: '3 Konsep Visual Terkurasi dengan Mockup Nyata',
  },
  {
    number: '03',
    phase: 'MATERIALIZE & CALIBRATE',
    title: 'Kurasi Material, Kertas & Uji Kromatik',
    description:
      'Memilih palet warna Pantone murni, menguji sampel kertas fisik dari produsen kertas legendaris (G.F Smith, Fedrigoni, Munken), dan menentukan detail teknik finishing seperti kedalaman deboss atau kilau foil.',
    methodology: ['Physical Paper Swatch Testing', 'Pantone Solid Color Matching', 'Finishing Simulation (Foil & Deboss)', 'Packaging Ergonomics'],
    deliverableHighlight: 'Spesifikasi Teknis Material & Prototipe Dummy Fisik',
  },
  {
    number: '04',
    phase: 'PRE-PRESS & DELIVER',
    title: 'Supervisi Produksi & Pengiriman Master Aset',
    description:
      'Menyiapkan artwork siap cetak dengan trapping, bleed, color profiles CMYK/FOGRA39 yang presisi. Berkoordinasi langsung dengan pihak percetakan untuk memastikan hasil cetak akhir 100% sempurna.',
    methodology: ['Pre-Press Artwork Calibration', 'Print House Liaison & Press Check', 'Vector Asset Sanitization', 'Comprehensive Guidelines'],
    deliverableHighlight: 'Paket Aset Master Terorganisir & Panduan Implementasi',
  },
];

export const awardsData: AwardItem[] = [
  {
    year: '2025',
    award: 'UI/UX & Digital Product Design',
    project: 'User Interface, Prototyping & Design System',
    institution: 'Sertifikasi Desain Digital',
    badge: 'Terverifikasi',
  },
  {
    year: '2024',
    award: 'Visual Design & Brand Communication',
    project: 'Adobe Illustrator, Photoshop & Identitas Visual',
    institution: 'Sertifikasi Kompetensi Desain Grafis',
    badge: 'Sertifikasi',
  },
  {
    year: '2024',
    award: '3D Animation & Motion Graphics Production',
    project: 'Blender 3D, After Effects & Visualisasi Promosi',
    institution: 'Motion & CGI Creative Program',
    badge: 'Kompetensi',
  },
  {
    year: '2023',
    award: 'Commercial Photography & Videography Editing',
    project: 'Tata Cahaya, Kamera & Color Grading',
    institution: 'Visual Production Certification',
    badge: 'Sertifikat',
  },
];

export const exhibitionsData: ExhibitionItem[] = [];

export const clientRoster = [
  { name: 'Aura Botanica', city: 'Kyoto / Paris', category: 'Luxury Skincare' },
  { name: 'Tokyo Arts Foundation', city: 'Tokyo', category: 'Cultural Arts' },
  { name: 'Atelier Noir', city: 'Geneva', category: 'Haute Horlogerie' },
  { name: 'Solaris Distillers', city: 'Florence', category: 'Botanical Spirits' },
  { name: 'Fondation Architecture', city: 'Zurich', category: 'Cultural Monograph' },
  { name: 'Kroma Type', city: 'Berlin / Jakarta', category: 'Digital Foundry' },
  { name: 'Maison Éthérée', city: 'Milan', category: 'High Fashion' },
  { name: 'Vanguard Sound', city: 'London', category: 'Independent Record Label' },
];

export const testimonials = [
  {
    quote:
      'Agung memiliki kepekaan tipografi dan material fisik yang luar biasa langka di era serba digital ini. Hasil cetak kemasan kami menjadi standar baru di industri wewangian botani.',
    client: 'Claire de Montmirail',
    role: 'Creative Director',
    company: 'Maison Éthérée Paris',
  },
  {
    quote:
      'Bekerja sama dengan Agung terasa seperti bermitra dengan kurator seni rupa. Setiap keputusan garis, spasi huruf, dan gramatur kertas memiliki landasan filosofis yang solid.',
    client: 'Kenjiro Sato',
    role: 'Principal Curator',
    company: 'Tokyo Contemporary Graphic Museum',
  },
  {
    quote:
      'Identitas buku monografi yang dirancang Agung mengubah arsip arsitektur kami menjadi benda koleksi museum yang habis terjual dalam hitungan minggu.',
    client: 'Lukas Meyer',
    role: 'Head of Architecture Publishing',
    company: 'Fondation d’Architecture Contemporaine',
  },
];

export const tactileSpecs = [
  {
    id: 'tactile-1',
    title: 'Kertas Seni & Tekstur Taktil',
    description: 'Bekerja dengan pabrik kertas terkemuka dunia seperti Fedrigoni (Italia), G.F Smith Colorplan (UK), dan Munken (Swedia). Menyesuaikan serat katun, gramatur 120gsm hingga 700gsm duplex.',
    badge: 'FEDRIGONI & G.F SMITH',
  },
  {
    id: 'tactile-2',
    title: 'Hot Foil Stamping & Deboss 3D',
    description: 'Aplikasi foil cap panas mikro Kurz Luxor, pigment foil matte, dan blind debossing dengan kedalaman presisi hingga 1.2mm untuk menghadirkan kontras bayangan fisik yang dramatis.',
    badge: 'KURZ GERMANY PRECISION',
  },
  {
    id: 'tactile-3',
    title: 'Sistem Warna Pantone & Fluoresens',
    description: 'Kalibrasi warna solid spot-color Pantone Formula Guide, tinta neon fluoresen berpigmen tinggi, dan tinta metalik perak/tembaga untuk mencegah distorsi warna cetak massal.',
    badge: 'PANTONE MATCHING SYSTEM',
  },
  {
    id: 'tactile-4',
    title: 'Supervisi Pre-Press & Uji Mesin',
    description: 'Pemeriksaan langsung di fasilitas percetakan (press-check), penyesuaian register silinder cetak, trap ketajaman vektor, dan proofing FOGRA39 tersertifikasi ISO 12647-2.',
    badge: 'PRESS-CHECK SUPERVISION',
  },
];

export const initialInquiries = [
  {
    id: 'inq-1740000001',
    name: 'Maya Sutedja',
    email: 'maya@ateliernouveau.co',
    company: 'Atelier Nouveau Paris',
    scopes: ['Identitas Jenama (Brand System)', 'Packaging & Struktur Box'],
    budget: 'Rp 50 - 100 Juta',
    message: 'Halo Mas Agung, kami sedang merencanakan peluncuran lini parfum botani baru dan sangat terkesan dengan packaging Aura Botanica. Kami ingin mendiskusikan identitas jenama dan desain botol kustom.',
    createdAt: '2026-10-27T10:15:00.000Z',
    read: false,
  },
  {
    id: 'inq-1740000002',
    name: 'Alexander Hayes',
    email: 'alex@vanguardrecords.co.uk',
    company: 'Vanguard Records London',
    scopes: ['Motion Graphics & 3D Animation', 'Sinematografi & Video Kampanye'],
    budget: '> Rp 100 Juta',
    message: 'Tertarik untuk menggarap visual album teaser dan motion visualizer untuk artis elektronik baru kami untuk rilis vinyl Q3 2026.',
    createdAt: '2026-10-26T14:40:00.000Z',
    read: true,
  },
];
