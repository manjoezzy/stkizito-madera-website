import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hasMinRole, forbidden, unauthorized } from '@/lib/auth';
import { sendReplyEmail, isEmailConfigured } from '@/lib/email';

// ===================== POST: Public submit contact message =====================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }
    const msg = await db.contactMessage.create({
      data: { name, email, phone, subject, message, status: 'unread' },
    });
    return NextResponse.json({ success: true, message: 'Message sent successfully!', data: { id: msg.id } });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact error:', m);
    return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
  }
}

// ===================== GET: Admin fetch messages =====================
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // all, unread, read, replied, replied-sent

    const where: Record<string, unknown> = {};
    if (filter === 'unread') where.status = 'unread';
    else if (filter === 'read') where.status = 'read';
    else if (filter === 'replied') { where.OR = [{ status: 'replied' }, { status: 'replied-sent' }]; }
    else if (filter === 'replied-sent') where.status = 'replied-sent';

    if (search) {
      const searchClause = {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { subject: { contains: search } },
          { message: { contains: search } },
        ],
      };
      if (where.OR) {
        where.AND = [where.OR, searchClause];
        delete where.OR;
      } else {
        Object.assign(where, searchClause);
      }
    }

    const messages = await db.contactMessage.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const counts = {
      unread: await db.contactMessage.count({ where: { status: 'unread' } }),
      read: await db.contactMessage.count({ where: { status: 'read' } }),
      replied: await db.contactMessage.count({ where: { status: { in: ['replied', 'replied-sent'] } } }),
      total: await db.contactMessage.count(),
    };

    return NextResponse.json({ success: true, data: messages, counts });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact fetch error:', m);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

// ===================== PATCH: Mark read, reply, bulk actions =====================
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { ids, action, id, isRead } = body;

    // ---- Single message update ----
    if (id) {
      if (action === 'reply') {
        // Save reply draft without sending
        const { replyText } = body;
        if (!replyText || !replyText.trim()) {
          return NextResponse.json({ success: false, message: 'Reply text is required' }, { status: 400 });
        }
        const updated = await db.contactMessage.update({
          where: { id },
          data: {
            status: 'replied',
            replyText: replyText.trim(),
            repliedAt: new Date(),
            repliedBy: session.email || session.userId || 'admin',
          },
        });
        return NextResponse.json({ success: true, data: updated, message: 'Reply saved as draft' });
      }

      if (action === 'send-reply') {
        const { replyText } = body;
        if (!replyText || !replyText.trim()) {
          return NextResponse.json({ success: false, message: 'Reply text is required' }, { status: 400 });
        }
        const original = await db.contactMessage.findUnique({ where: { id } });
        if (!original) return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });

        // Attempt to send email
        const emailResult = await sendReplyEmail({
          to: original.email,
          subject: `Re: ${original.subject || 'Your inquiry'}`,
          replyBody: replyText.trim(),
          originalName: original.name,
          originalMessage: original.message,
          originalSubject: original.subject || undefined,
        });

        const updated = await db.contactMessage.update({
          where: { id },
          data: {
            status: emailResult.success ? 'replied-sent' : 'replied',
            replyText: replyText.trim(),
            repliedAt: new Date(),
            repliedBy: session.email || session.userId || 'admin',
          },
        });

        if (emailResult.success) {
          return NextResponse.json({ success: true, data: updated, message: 'Reply sent via email' });
        } else {
          return NextResponse.json({
            success: true,
            data: updated,
            message: `Reply saved but email failed: ${emailResult.error}. Email not configured?`,
            emailSent: false,
          });
        }
      }

      // Toggle read status (legacy support)
      const updateData: Record<string, unknown> = {};
      if (typeof isRead === 'boolean') {
        updateData.isRead = isRead;
        updateData.status = isRead ? 'read' : 'unread';
      }
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
      }
      const updated = await db.contactMessage.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // ---- Bulk operations ----
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'IDs array is required for bulk operations' }, { status: 400 });
    }

    if (action === 'mark-read') {
      const result = await db.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true, status: 'read' },
      });
      return NextResponse.json({ success: true, message: `${result.count} message(s) marked as read`, updated: result.count });
    }

    if (action === 'mark-unread') {
      const result = await db.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: false, status: 'unread' },
      });
      return NextResponse.json({ success: true, message: `${result.count} message(s) marked as unread`, updated: result.count });
    }

    if (action === 'delete') {
      const result = await db.contactMessage.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, message: `${result.count} message(s) deleted`, deleted: result.count });
    }

    if (action === 'mark-all-read') {
      const result = await db.contactMessage.updateMany({
        where: { status: 'unread' },
        data: { isRead: true, status: 'read' },
      });
      return NextResponse.json({ success: true, message: `${result.count} message(s) marked as read`, updated: result.count });
    }

    return NextResponse.json({ success: false, message: 'Unknown bulk action' }, { status: 400 });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact PATCH error:', m);
    return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 });
  }
}

// ===================== DELETE: Single message =====================
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Message ID required' }, { status: 400 });
    }
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact DELETE error:', m);
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
