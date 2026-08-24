import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SIZE_LIMITS: Record<string, number> = {
  general: 1.5 * 1024 * 1024,    // 1.5MB
  gallery: 1.5 * 1024 * 1024,    // 1.5MB
  admission: 1.5 * 1024 * 1024,  // 1.5MB
  event: 1.5 * 1024 * 1024,      // 1.5MB
  graduation: 10 * 1024 * 1024,  // 10MB for photos/videos
  alumni: 1.5 * 1024 * 1024,     // 1.5MB
  hero: 2 * 1024 * 1024,         // 2MB for hero images
  banner: 3 * 1024 * 1024,       // 3MB for event banners
  document: 2 * 1024 * 1024,     // 2MB for documents
};

const ALLOWED_MIME: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
};

// Types that allow videos
const VIDEO_ALLOWED_TYPES = ['graduation', 'general'];
// Types that allow documents
const DOC_ALLOWED_TYPES = ['general', 'admission', 'document', 'banner'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine size limit
    const maxSize = SIZE_LIMITS[type] || SIZE_LIMITS.general;

    // Check file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` },
        { status: 400 }
      );
    }

    // Build allowed MIME list for this type
    const allowed: string[] = [];
    // All types allow images
    allowed.push(...(ALLOWED_MIME.image || []));
    // Some types allow documents
    if (DOC_ALLOWED_TYPES.includes(type)) {
      allowed.push(...(ALLOWED_MIME.document || []));
    }
    // Some types allow videos
    if (VIDEO_ALLOWED_TYPES.includes(type)) {
      allowed.push(...(ALLOWED_MIME.video || []));
    }

    // Check MIME type
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed for "${type}" uploads.` },
        { status: 400 }
      );
    }

    // Determine upload directory
    const subDirMap: Record<string, string> = {
      gallery: 'gallery',
      admission: 'admissions',
      event: 'events',
      graduation: 'graduation',
      alumni: 'alumni',
      hero: 'hero',
      banner: 'banners',
      document: 'documents',
      general: 'general',
    };
    const subDir = subDirMap[type] || 'general';
    const uploadDir = join(process.cwd(), 'public', 'uploads', subDir);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = join(uploadDir, uniqueName);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${subDir}/${uniqueName}`;

    return NextResponse.json({
      url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
