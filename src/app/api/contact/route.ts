import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    const unread = await db.contactMessage.count({ where: { isRead: false } });
    return NextResponse.json({ success: true, data: messages, unread });
  } catch (error: unknown) {
    const m = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact fetch error:', m);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}
