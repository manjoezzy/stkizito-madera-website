import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, graduationYear, programme, occupation, employer, district, biography } = body;

    // Validate required fields
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Full name is required (at least 2 characters).' },
        { status: 400 }
      );
    }

    // Check for duplicate email if provided
    if (email && email.trim()) {
 const existing = await db.alumni.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An alumni record with this email already exists. If this is you, please contact the school.' },
          { status: 409 }
        );
      }
    }

    const alumni = await db.alumni.create({
      data: {
        fullName: fullName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        graduationYear: graduationYear?.trim() || null,
        programme: programme?.trim() || null,
        occupation: occupation?.trim() || null,
        employer: employer?.trim() || null,
        district: district?.trim() || null,
        biography: biography?.trim() || null,
        isPublished: false, // Admin must approve before showing publicly
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! Your information will be reviewed by the school administration.',
      data: {
        id: alumni.id,
        fullName: alumni.fullName,
        email: alumni.email,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Alumni registration error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again later.', debug: msg },
      { status: 500 }
    );
  }
}
