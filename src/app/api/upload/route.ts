import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

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

    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
      const baseName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 40) || 'image';

      const filename = `${Date.now()}-${i}-${baseName}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ error: 'Gagal menyimpan berkas gambar.' }, { status: 500 });
  }
}
