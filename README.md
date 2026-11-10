# Avant-Garde Graphic Designer & Art Director Portfolio

Portofolio web modern, estetis, dan imersif khusus untuk **Graphic Designer, Type Designer, & Art Director**, dibangun dengan **Next.js (App Router)**, **Tailwind CSS**, dan **Lucide Icons**.

Dirancang dengan prinsip estetika **Swiss Modernism & Brutalist Editorial**: kontras tinggi, kedisiplinan modular grid, kebebasan ekspresi tipografis, dan simulasi materialitas cetak fisik (*tactile print finishing*).

---

## ✨ Fitur & Keunggulan Khusus Desainer Grafis

1. **🎨 Estetika Studio & Editorial Tingkat Tinggi**:
   - Skema warna ganda: **Obsidian Black Studio Mode** (default atmosferik gelap) & **Raw Cotton Gallery Mode** (putih kertas galeri seni).
   - Tipografi dinamis dengan micro-grid data, koordinat studio, dan indikator status ketersediaan komisi real-time.

2. **🔤 Interactive Typography & Specimen Studio (Type Lab)**:
   - Laboratorium tipografi interaktif langsung di peramban:
     - Uji coba headline dengan input teks kustom live.
     - Kontrol *Optical Size* slider (24px - 96px) dan *Kerning / Letter-spacing* slider (-6px hingga +12px).
     - Preset font style: *Brutalist Avant-Garde*, *Heritage Serif*, *Swiss Grotesk*, dan *Technical Mono*.
     - 4 Skema tema warna tipografi (*Obsidian & Acid Lime*, *Raw Cotton & Ink*, *Midnight & Fluo*, *Titanium Monolith*).
     - Tombol satu klik **Copy CSS Rule** untuk desainer.

3. **📦 Mockup Grafis Vektor Kustom (Tanpa Gambar Dummy Buram)**:
   - Visual karya disajikan dengan komponen SVG & CSS murni beresolusi tajam:
     - **Aura Botanica**: Botol pipet kaca ambar dengan label foil emas Kurz Luxor & boks kosmetik ramah lingkungan.
     - **Kroma Foundry**: Lembaran koran broadsheet A1 lipat tangan dengan ink traps tajam dan aksen hijau fluo.
     - **Neo-Tokyo Jazz**: Trilogi poster sablon 3 lapis dengan grafis frekuensi sonik dan warna risograph neon.
     - **Atelier Noir Horlogerie**: Bentangan buku monografi editorial terbuka dengan diagram skematik mesin jam tangan.
     - **Solaris Aperitivo**: Botol minuman dengan label berpotongan die-cut antik, segel lilin, dan foil tembaga.
     - **Mono Archive Vol. 08**: Buku bersampul linen kasar dengan tipografi blind deboss brutalis.

4. **🔍 Case Study Deep-Dive Modal**:
   - **Spesifikasi Material & Cetak Fisik (*Tactile Specs*)**: Detail jenis kertas (Fedrigoni 360gsm, G.F Smith Colorplan, Munken Pure), teknik cetak (Offset Litho, Silkscreen, Rotary Flexo), hingga finishing (Kurz Gold Foil, Blind Deboss 3D, Soft-touch Varnish).
   - **Harmoni Warna & Kode Pantone**: Kartu swatch warna interaktif lengkap dengan nilai HEX, CMYK, dan formula Pantone Solid Coated.
   - **Arsitektur Tipografi**: Pasangan font Display vs Body vs Monospace microgrid.
   - **Metrik Dampak Nyata**: Peningkatan penjualan, kuota cetak terjual habis, dan kutipan kurator/klien.

5. **🔊 Tactile Micro-Interactions (Web Audio API)**:
   - Efek suara sintetis klik & pop halus saat tombol disentuh (dapat diaktifkan/dinonaktifkan kapan saja dengan tombol suara di navbar).

6. **🛠️ Disiplin Layanan & Toolkit Lengkap**:
   - Rincian layanan: *Brand Systems*, *Tactile Packaging*, *Editorial & Books*, serta *Typography & Custom Lettering*.
   - Kurasi toolkit: Adobe Illustrator, InDesign, Glyphs 3, Photoshop, Blender 3D, Figma, Risograph & Silkscreen.

7. **🏆 Penghargaan, Arsip Pameran & Testimonial**:
   - Tokyo Type Directors Club (TDC), Graphis Design Annual, Brand New Feature, dan eksibisi galeri internasional.
   - Testimonial terpercaya dari kurator museum dan direktur kreatif global.

8. **📬 Interactive Commission Desk**:
   - Formulir inisiasi proyek dengan selektor disiplin & estimasi anggaran.
   - Tombol satu klik **Salin Email Studio** dengan notifikasi toast.
   - Tautan dossier portofolio PDF dan kanal sosial lengkap (Behance, Instagram, Dribbble, Are.na, ReadCV, LinkedIn).

---

## 🚀 Cara Menjalankan di Komputer Lokal

Masuk ke folder proyek dan jalankan development server:

```bash
cd /Users/mac/.gemini/antigravity/scratch/graphic-design-portfolio
npm run dev
```

Buka peramban di `http://localhost:3000`.

Untuk membuild versi produksi:
```bash
npm run build
npm run start
```

---

## ✏️ Cara Mengubah Data Portofolio Anda

Seluruh konten (nama, bio, foto karya, deskripsi proyek, spesifikasi cetak, penghargaan, dan kontak) tersimpan rapi dan mudah diubah di:

📂 `src/data/portfolioData.ts`

- **Profil Desainer**: Ubah data di objek `designerProfile` (nama, headline, statistik, media sosial).
- **Proyek & Studi Kasus**: Tambahkan atau ubah data di array `projectsData`.
- **Layanan Desain**: Ubah di array `servicesData`.
- **Metodologi**: Sesuaikan di array `processSteps`.
- **Penghargaan & Eksibisi**: Sesuaikan di `awardsData` dan `exhibitionsData`.
