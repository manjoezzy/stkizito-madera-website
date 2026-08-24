import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Look up the admin by email (case-insensitive)
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Security best practice: always return success regardless of whether email exists
    if (admin) {
      // Generate a random reset token
      const token = crypto.randomBytes(32).toString('hex');
      const key = `password_reset_${token}`;

      // Store the token in SiteSetting with 1-hour expiry reference
      // We store the admin email as the value and use updatedAt to check expiry
      await db.siteSetting.upsert({
        where: { key },
        update: {
          value: admin.email,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: admin.email,
        },
      });

      // Simulate sending a password reset email (console.log since SMTP is not configured)
      const resetDetails = {
        email: admin.email,
        token,
        message: 'Password reset link (would be sent via email)',
        resetUrl: `This is a demo. Token: ${token}`,
      };
      console.log('═══════════════════════════════════════');
      console.log('PASSWORD RESET EMAIL (simulated):');
      console.log('═══════════════════════════════════════');
      console.log(`To: ${resetDetails.email}`);
      console.log(`Token: ${resetDetails.token}`);
      console.log(`═══════════════════════════════════════`);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to your email',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
