import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasMinRole, unauthorized, forbidden } from '@/lib/auth';
import { auditLog } from '@/lib/audit';
import { AUDIT_ACTIONS } from '@/lib/audit';

// ─── Configuration per upload type ─────────────────────────────────
const UPLOAD_CONFIG: Record<string, { maxSizeBytes: number; allowedMime: string[]; label: string }> = {
  event: {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    label: 'Event',
  },
  gallery: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    label: 'Gallery',
  },
  admission: {
    maxSizeBytes: 2 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    label: 'Admission document',
  },
  graduation: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    label: 'Graduation',
  },
  form: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB for form PDFs
    allowedMime: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    label: 'Form',
  },
  general: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    label: 'General',
  },
};

const DEFAULT_CONFIG = UPLOAD_CONFIG.general;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function POST(request: NextRequest) {
  try {
    // Auth check (middleware already verified, but double-check)
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const config = UPLOAD_CONFIG[type] || DEFAULT_CONFIG;

    // Validate file size
    if (file.size > config.maxSizeBytes) {
      const maxMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { success: false, error: `File too large. Maximum ${maxMB}MB allowed for ${config.label.toLowerCase()} uploads.` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!config.allowedMime.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type '${file.type}'. Allowed: ${config.allowedMime.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert to base64 data URL
    const buffer = await file.arrayBuffer();
    const base64 = toBase64(buffer);
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Audit log
    await auditLog(
      session.userId,
      session.role,
      {
        action: AUDIT_ACTIONS.DOCUMENT_UPLOADED,
        resource: 'upload',
        result: 'success',
        metadata: JSON.stringify({ fileName: file.name, fileSize: file.size, mimeType: file.type, uploadType: type }),
      }
    );

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
