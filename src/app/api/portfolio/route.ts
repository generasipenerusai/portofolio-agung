import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bundledGraphicDb from '@/data/db.json';
import bundledPhotographerDb from '@/data/photographer_db.json';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const PHOTOGRAPHER_DB_PATH = path.join(DATA_DIR, 'photographer_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Cloud storage credentials (if configured in Vercel environment variables)
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
const GITHUB_REPO = (process.env.GITHUB_REPO || 'generasipenerusai/portofolio-agung')
  .replace(/^https?:\/\/github\.com\//, '')
  .replace(/\.git$/, '');
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

async function getFromKv(key: string) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
  } catch (err) {
    console.warn('Failed to get from KV:', err);
    return null;
  }
}

async function setToKv(key: string, data: any): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(typeof data === 'string' ? data : JSON.stringify(data)),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to set to KV:', err);
    return false;
  }
}

async function getFromGithub(filePath: string) {
  if (!GITHUB_TOKEN) return null;
  try {
    // Menggunakan endpoint GitHub contents dengan header raw agar mengembalikan JSON asli
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'antigravity-portfolio',
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text);
    }
  } catch (err) {
    console.warn('Failed to fetch latest data from GitHub API:', err);
  }
  return null;
}

async function commitToGithub(filePath: string, contentStr: string, commitMsg: string): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'antigravity-portfolio',
      },
      cache: 'no-store',
    });

    let sha: string | undefined = undefined;
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'antigravity-portfolio',
      },
      body: JSON.stringify({
        message: commitMsg,
        content: Buffer.from(contentStr).toString('base64'),
        sha,
        branch: GITHUB_BRANCH,
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.error('Failed to commit to GitHub:', err);
    return false;
  }
}

async function persistDataUriIfNeeded(val: string | undefined, prefix: string): Promise<string> {
  if (!val || !val.startsWith('data:image/')) return val || '';
  const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return val;
  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';
  const filename = `${prefix}-${Date.now()}.${ext}`;
  const base64Content = match[2];

  // 1. Jika GITHUB_TOKEN tersedia di Vercel, simpan gambar ke GitHub public/uploads
  if (GITHUB_TOKEN) {
    try {
      const filePath = `public/uploads/${filename}`;
      const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'antigravity-portfolio',
        },
        body: JSON.stringify({
          message: `Upload media: ${filename} [skip ci]`,
          content: base64Content,
          branch: GITHUB_BRANCH,
        }),
      });

      if (putRes.ok) {
        return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/uploads/${filename}`;
      }
    } catch (err) {
      console.warn('Failed to upload image to GitHub:', err);
    }
  }

  // 2. Coba simpan ke disk lokal (untuk laptop localhost)
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, filename), Buffer.from(base64Content, 'base64'));
    return `/uploads/${filename}`;
  } catch {
    // 3. Fallback: pertahankan base64
    return val;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'photographer' ? 'photographer' : 'graphic';
    const kvKey = `portfolio_db_${type}`;
    const defaultBundled = type === 'photographer' ? bundledPhotographerDb : bundledGraphicDb;

    // 1. Cek KV / Upstash jika terkonfigurasi
    if (KV_URL && KV_TOKEN) {
      const kvData = await getFromKv(kvKey);
      if (kvData && kvData.designerProfile) {
        return NextResponse.json(kvData);
      }
    }

    // 2. Cek GitHub live commit jika GITHUB_TOKEN terkonfigurasi (mengambil data tersimpan terbaru)
    const gitFilePath = type === 'photographer' ? 'data/photographer_db.json' : 'data/db.json';
    if (GITHUB_TOKEN) {
      const ghData = await getFromGithub(gitFilePath);
      if (ghData && ghData.designerProfile) {
        return NextResponse.json(ghData);
      }
    }

    // 3. Coba baca file lokal jika di laptop (localhost)
    try {
      const primaryPath = type === 'photographer' ? PHOTOGRAPHER_DB_PATH : DB_PATH;
      const fileContent = await fs.readFile(primaryPath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      if (parsed && parsed.designerProfile) {
        return NextResponse.json(parsed);
      }
    } catch {
      // Abaikan jika di cloud serverless
    }

    // 4. Fallback ke data internal bawaan (selalu berhasil & berisi 11 karya asli)
    return NextResponse.json(defaultBundled);
  } catch (error) {
    console.error('Failed to read database:', error);
    return NextResponse.json(bundledGraphicDb);
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'photographer' ? 'photographer' : 'graphic';
    const kvKey = `portfolio_db_${type}`;
    const gitFilePath = type === 'photographer' ? 'data/photographer_db.json' : 'data/db.json';
    const targetPath = type === 'photographer' ? PHOTOGRAPHER_DB_PATH : DB_PATH;

    const updatedData = await request.json();

    if (!updatedData.designerProfile || !Array.isArray(updatedData.projectsData)) {
      return NextResponse.json(
        { error: 'Invalid data schema. designerProfile and projectsData are required.' },
        { status: 400 }
      );
    }

    // Safely attempt converting base64 images to static files if local disk is writable
    if (updatedData.designerProfile?.photoUrl?.startsWith('data:image/')) {
      updatedData.designerProfile.photoUrl = await persistDataUriIfNeeded(
        updatedData.designerProfile.photoUrl,
        `${type}-profile`
      );
    }

    for (let i = 0; i < updatedData.projectsData.length; i++) {
      const p = updatedData.projectsData[i];
      if (p.customMockupUrl?.startsWith('data:image/')) {
        p.customMockupUrl = await persistDataUriIfNeeded(p.customMockupUrl, `${type}-cover-${i}`);
      }
      if (Array.isArray(p.photoGallery)) {
        for (let g = 0; g < p.photoGallery.length; g++) {
          if (p.photoGallery[g]?.url?.startsWith('data:image/')) {
            p.photoGallery[g].url = await persistDataUriIfNeeded(
              p.photoGallery[g].url,
              `${type}-gallery-${i}-${g}`
            );
          }
        }
      }
    }

    const jsonString = JSON.stringify(updatedData, null, 2);
    let saved = false;

    // A. If Vercel KV / Upstash Redis is connected
    if (KV_URL && KV_TOKEN) {
      const kvOk = await setToKv(kvKey, updatedData);
      if (kvOk) saved = true;
    }

    // B. If GITHUB_TOKEN is configured in Vercel Environment Variables
    if (GITHUB_TOKEN) {
      const gitOk = await commitToGithub(
        gitFilePath,
        jsonString,
        `Update ${type} portfolio via Web Admin CMS [skip ci]`
      );
      if (gitOk) saved = true;
    }

    // C. Always attempt local file save (for local laptop development)
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(targetPath, jsonString, 'utf-8');
      saved = true;
    } catch (fsErr: any) {
      if (!saved && (fsErr?.code === 'EROFS' || fsErr?.code === 'EACCES')) {
        return NextResponse.json(
          {
            error: 'READ_ONLY_ENVIRONMENT',
            message:
              'Hosting Vercel bersifat Read-Only. Tambahkan GITHUB_TOKEN di Settings agar dapat menyimpan langsung dari web.',
          },
          { status: 503 }
        );
      }
    }

    if (saved) {
      return NextResponse.json({ success: true, message: `Data (${type}) saved successfully` });
    }

    return NextResponse.json({ error: 'Gagal menyimpan data ke database.' }, { status: 500 });
  } catch (error) {
    console.error('Failed to write database:', error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
