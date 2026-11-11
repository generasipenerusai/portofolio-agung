import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
const GITHUB_REPO = (process.env.GITHUB_REPO || 'generasipenerusai/portofolio-agung')
  .replace(/^https?:\/\/github\.com\//, '')
  .replace(/\.git$/, '');
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

async function uploadToGithub(filename: string, buffer: Buffer): Promise<string | null> {
  if (!GITHUB_TOKEN) return null;
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
        message: `Upload media: ${filename} via Web Admin [skip ci]`,
        content: buffer.toString('base64'),
        branch: GITHUB_BRANCH,
      }),
    });

    if (putRes.ok) {
      // Use raw.githubusercontent.com for high reliability and immediate availability
      return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/uploads/${filename}`;
    } else {
      const errJson = await putRes.json().catch(() => ({}));
      console.warn('GitHub file upload failed:', errJson);
      return null;
    }
  } catch (err) {
    console.error('Failed to upload file to GitHub:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entries = formData.getAll('files');
    const single = formData.get('file');
    const files: File[] = [
      ...entries.filter((item): item is File => item instanceof File),
      ...(single instanceof File ? [single] : []),
    ];

    if (files.length === 0) {
      return NextResponse.json({ error: 'Tidak ada berkas yang diunggah.' }, { status: 400 });
    }

    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
      const baseName =
        file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .slice(0, 40) || 'image';

      const filename = `${Date.now()}-${i}-${baseName}.${ext}`;

      // A. Try GitHub API upload first if GITHUB_TOKEN is configured (for Vercel live site)
      if (GITHUB_TOKEN) {
        const ghUrl = await uploadToGithub(filename, buffer);
        if (ghUrl) {
          urls.push(ghUrl);
          continue;
        }
      }

      // B. Try local file write next (works on local laptop)
      let writtenLocally = false;
      try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        const filePath = path.join(UPLOADS_DIR, filename);
        await fs.writeFile(filePath, buffer);
        urls.push(`/uploads/${filename}`);
        writtenLocally = true;
      } catch {
        // Read-only serverless disk on Vercel without GitHub Token
      }

      // C. Fallback: Base64 Data URI if neither disk nor GitHub token is available
      if (!writtenLocally && urls.length <= i) {
        const mime = file.type || 'image/jpeg';
        const base64 = buffer.toString('base64');
        urls.push(`data:${mime};base64,${base64}`);
      }
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ error: 'Gagal mengunggah berkas gambar.' }, { status: 500 });
  }
}
