import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasMinRole, unauthorized, forbidden } from '@/lib/auth';

// Types that require admin authentication
const PROTECTED_TYPES = ['gallery', 'event', 'graduation', 'banner', 'settings'];

// Allowed MIME types and max file sizes
const FILE_LIMITS: Record<string, { maxSize: number; mimeTypes: string[] }> = {
  gallery: {
    maxSize: 10 * 1024 * 1024, // 10MB
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'],
  },
  event: {
    maxSize: 5 * 1024 * 1024, // 5MB
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  admission: {
    maxSize: 1.5 * 1024 * 1024, // 1.5MB
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  settings: {
    maxSize: 5 * 1024 * 1024, // 5MB
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  graduation: {
    maxSize: 10 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'],
  },
};

const DEFAULT_LIMIT = {
  maxSize: 5 * 1024 * 1024,
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Auth check for protected types
    if (PROTECTED_TYPES.includes(type)) {
      const session = await getSession();
      if (!session) return unauthorized();
      if (!hasMinRole(session, 'admissions-staff')) return forbidden();
    }

    // Get limits for this type
    const limits = FILE_LIMITS[type] || DEFAULT_LIMIT;

    // Validate file size
    if (file.size > limits.maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum ${Math.round(limits.maxSize / 1024 / 1024)}MB allowed.` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!limits.mimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Accepted: ${limits.mimeTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert to base64 data URL (Vercel-compatible — no local filesystem)
    const buffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Upload error:', msg);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
