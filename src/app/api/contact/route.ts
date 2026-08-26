import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hasMinRole, forbidden, unauthorized } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }
    const msg = await db.contactMessage.create({
      data: { name, email, phone, subject, message },
    });
    return NextResponse.json({ success: true, message: 'Message sent successfully!', data: { id: msg.id } });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact error:', m);
    return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // all, unread, read

    const where: Record<string, unknown> = {};
    if (filter === 'unread') where.isRead = false;
    if (filter === 'read') where.isRead = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const messages = await db.contactMessage.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    const unread = await db.contactMessage.count({ where: { isRead: false } });
    return NextResponse.json({ success: true, data: messages, unread });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact fetch error:', m);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { ids, action, id, isRead } = body;

    // Single message update
    if (id) {
      const updateData: Record<string, unknown> = {};
      if (typeof isRead === 'boolean') updateData.isRead = isRead;
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
      }
      const updated = await db.contactMessage.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Bulk operation
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'IDs array is required for bulk operations' }, { status: 400 });
    }

    if (action === 'mark-read') {
      const result = await db.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: `${result.count} message(s) marked as read`, updated: result.count });
    }

    if (action === 'mark-unread') {
      const result = await db.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: false },
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
        where: { isRead: false },
        data: { isRead: true },
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
