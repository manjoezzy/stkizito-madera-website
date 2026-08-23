import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/settings?key=xxx — get a setting value
export async function GET(req: NextRequest) {
  try {
    const key = new URL(req.url).searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    const setting = await db.siteSetting.findUnique({ where: { key } });
    return NextResponse.json({ key, value: setting?.value || null });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

// PUT /api/settings — upsert a setting
export async function PUT(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    const setting = await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
