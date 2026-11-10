import { ColorSwatch } from '../types/portfolio';

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function guessIndonesianColorName(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const d = max - min;

  if (l < 0.14) return 'Hitam Pekat';
  if (l > 0.9) return 'Putih Bersih';
  if (d < 0.1) return l < 0.45 ? 'Abu Gelap' : 'Abu Netral';

  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;

  if (h < 18 || h >= 345) return 'Merah Aksentuasi';
  if (h < 42) return l < 0.45 ? 'Cokelat Hangat' : 'Oranye Hangat';
  if (h < 68) return 'Kuning Cerah';
  if (h < 165) return l < 0.38 ? 'Hijau Tua' : 'Hijau Segar';
  if (h < 200) return 'Toska / Cyan';
  if (h < 255) return l < 0.38 ? 'Biru Navy' : 'Biru Utama';
  if (h < 300) return 'Ungu Visual';
  return 'Magenta / Pink';
}

export function normalizeHexForPicker(hex?: string): string {
  if (!hex) return '#A3E635';
  const cleaned = hex.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) return cleaned;
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) return `#${cleaned}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(cleaned)) {
    const [, c1, c2, c3] = cleaned.split('');
    return `#${c1}${c1}${c2}${c2}${c3}${c3}`;
  }
  return '#A3E635';
}

export async function extractPaletteFromImage(
  imageUrl: string,
  maxColors = 4
): Promise<ColorSwatch[]> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets = new Map<
          string,
          { count: number; score: number; rSum: number; gSum: number; bSum: number }
        >();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 140) continue;

          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;

          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
          // Slightly favor chromatic brand colors over flat white/black margins
          const weight = 1 + sat * 1.6;

          const existing = buckets.get(key);
          if (existing) {
            existing.count += 1;
            existing.score += weight;
            existing.rSum += r;
            existing.gSum += g;
            existing.bSum += b;
          } else {
            buckets.set(key, {
              count: 1,
              score: weight,
              rSum: r,
              gSum: g,
              bSum: b,
            });
          }
        }

        const sorted = Array.from(buckets.values())
          .sort((a, b) => b.score - a.score)
          .map((b) => ({
            r: Math.round(b.rSum / b.count),
            g: Math.round(b.gSum / b.count),
            b: Math.round(b.bSum / b.count),
          }));

        const chosen: { r: number; g: number; b: number }[] = [];
        for (const candidate of sorted) {
          if (chosen.length >= maxColors) break;
          const tooClose = chosen.some((c) => {
            const dist = Math.hypot(c.r - candidate.r, c.g - candidate.g, c.b - candidate.b);
            return dist < 58;
          });
          if (!tooClose) {
            chosen.push(candidate);
          }
        }

        const swatches: ColorSwatch[] = chosen.map((c) => ({
          hex: rgbToHex(c.r, c.g, c.b),
          name: guessIndonesianColorName(c.r, c.g, c.b),
        }));

        resolve(swatches);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Gagal memuat gambar sampul untuk ekstraksi warna.'));
    img.src = imageUrl;
  });
}
