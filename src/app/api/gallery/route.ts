import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/gallery — public: only published items; admin: all items
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category');

    const where: Record<string, unknown> = admin ? {} : { isPublished: true };
    if (category && category !== 'all') {
      where.category = category;
    }

    const items = await db.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST /api/gallery — create a new gallery item (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, category, eventDate, isPublished } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const item = await db.galleryItem.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || 'general',
        eventDate: eventDate || null,
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// PATCH /api/gallery — update a gallery item (admin)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const item = await db.galleryItem.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Gallery PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE /api/gallery — delete a gallery item (admin)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
