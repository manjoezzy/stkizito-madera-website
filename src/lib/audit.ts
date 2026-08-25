import { db } from '@/lib/db';
import { headers } from 'next/headers';
import type { UserRole } from './auth';

// ─── Audit log types ──────────────────────────────────
export interface AuditEntry {
  action: string;
  resource?: string;
  resourceId?: string;
  result?: 'success' | 'failure' | 'denied';
  metadata?: string;
}

// ─── Log an audit event ────────────────────────────────
// This is fire-and-forget — errors are logged but don't block
export async function auditLog(
  userId: string,
  userRole: UserRole | string,
  entry: AuditEntry
): Promise<void> {
  try {
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await db.auditLog.create({
      data: {
        userId,
        userRole,
        action: entry.action,
        resource: entry.resource || null,
        resourceId: entry.resourceId || null,
        ipAddress: ip,
        userAgent: userAgent.substring(0, 500), // Truncate to prevent DB bloat
        result: entry.result || 'success',
        metadata: entry.metadata ? JSON.stringify(entry.metadata).substring(0, 2000) : null,
      },
    });
  } catch (error) {
    // Audit logging should never break the app
    console.error('Audit log failed:', error);
  }
}

// ─── Common action constants ───────────────────────────
export const AUDIT_ACTIONS = {
  LOGIN: 'auth.login',
  LOGIN_FAILED: 'auth.login.failed',
  LOGOUT: 'auth.logout',
  PASSWORD_RESET_REQUEST: 'auth.password_reset.request',
  PASSWORD_RESET_COMPLETE: 'auth.password_reset.complete',
  ADMIN_CREATED: 'admin.created',
  APPLICATION_VIEWED: 'application.viewed',
  APPLICATION_STATUS_CHANGED: 'application.status_changed',
  APPLICATION_APPROVED: 'application.approved',
  APPLICATION_REJECTED: 'application.rejected',
  LETTER_GENERATED: 'letter.generated',
  LETTER_SENT: 'letter.sent',
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_DOWNLOADED: 'document.downloaded',
  SETTING_CHANGED: 'setting.changed',
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_DELETED: 'event.deleted',
  GALLERY_CREATED: 'gallery.created',
  GALLERY_UPDATED: 'gallery.updated',
  GALLERY_DELETED: 'gallery.deleted',
} as const;
