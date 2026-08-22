import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ success: true, data: events });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Events error:', msg);
    return NextResponse.json({ success: false, message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, eventDate, eventTime, location, isPublished } = body;
    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }
    const event = await db.event.create({
      data: { title, description, category: category || 'general', eventDate, eventTime, location, isPublished: isPublished ?? true },
    });
    return NextResponse.json({ success: true, data: event });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Create event error:', msg);
    return NextResponse.json({ success: false, message: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await db.event.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete event error:', msg);
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
