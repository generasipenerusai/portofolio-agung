import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const LEGACY_DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const PHOTOGRAPHER_DB_PATH = path.join(DATA_DIR, 'photographer_db.json');
const LEGACY_PHOTOGRAPHER_DB_PATH = path.join(process.cwd(), 'src', 'data', 'photographer_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function persistDataUriIfNeeded(val: string | undefined, prefix: string): Promise<string> {
  if (!val || !val.startsWith('data:image/')) return val || '';
  const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return val;
  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${prefix}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(UPLOADS_DIR, filename), Buffer.from(match[2], 'base64'));
  return `/uploads/${filename}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'photographer' ? 'photographer' : 'graphic';
    const primaryPath = type === 'photographer' ? PHOTOGRAPHER_DB_PATH : DB_PATH;
    const fallbackPath = type === 'photographer' ? LEGACY_PHOTOGRAPHER_DB_PATH : LEGACY_DB_PATH;

    let fileContent: string;
    try {
      fileContent = await fs.readFile(primaryPath, 'utf-8');
    } catch {
      fileContent = await fs.readFile(fallbackPath, 'utf-8');
    }
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read db.json:', error);
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'photographer' ? 'photographer' : 'graphic';
    const targetPath = type === 'photographer' ? PHOTOGRAPHER_DB_PATH : DB_PATH;

    const updatedData = await request.json();

    if (!updatedData.designerProfile || !Array.isArray(updatedData.projectsData)) {
      return NextResponse.json(
        { error: 'Invalid data schema. designerProfile and projectsData are required.' },
        { status: 400 }
      );
    }

    // Automatically convert any base64 images to real static files so JSON stays tiny & fast
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

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(targetPath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: `Data (${type}) saved successfully` });
  } catch (error) {
    console.error('Failed to write database:', error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
