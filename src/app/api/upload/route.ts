import { NextRequest, NextResponse } from 'next/server';
import { getSession, unauthorized } from '@/lib/auth';

// Vercel-compatible upload: returns base64 data URLs (no filesystem writes needed)
// This works in serverless environments where /public is read-only.

const TYPE_CONFIG: Record<string, { maxSize: number; allowedMime: string[]; subfolder: string }> = {
  event: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    subfolder: 'events',
  },
  gallery: {
    maxSize: 10 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'],
    subfolder: 'gallery',
  },
  admission: {
    maxSize: 2 * 1024 * 1024, // 2MB for admission docs
    allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    subfolder: 'admissions',
  },
  graduation: {
    maxSize: 10 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'],
    subfolder: 'graduation',
  },
  form: {
    maxSize: 5 * 1024 * 1024, // 5MB for form PDFs
    allowedMime: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    subfolder: 'forms',
  },
  general: {
    maxSize: 10 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    subfolder: 'general',
  },
};

// Fallback for unknown types
const DEFAULT_CONFIG = {
  maxSize: 10 * 1024 * 1024,
  allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  subfolder: 'uploads',
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // data:mime;base64,...
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function getFileName(file: File): string {
  const ext = file.name.split('.').pop() || 'bin';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}.${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const config = TYPE_CONFIG[type] || DEFAULT_CONFIG;

    // Validate file type
    const mimeToCheck = file.type || `application/octet-stream`;
    if (!config.allowedMime.includes(mimeToCheck)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${config.allowedMime.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > config.maxSize) {
      const maxMB = (config.maxSize / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxMB}MB` },
        { status: 400 }
      );
    }

    // Convert to base64 data URL for Vercel compatibility (no filesystem writes)
    const base64Url = await fileToBase64(file);
    const fileName = getFileName(file);

    return NextResponse.json({
      url: base64Url,
      fileName,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      type,
      subfolder: config.subfolder,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
