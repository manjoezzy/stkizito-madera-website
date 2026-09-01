import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/auth';
import { sendResetPasswordEmail, isEmailConfigured } from '@/lib/email';

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

    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const { allowed } = checkRateLimit(`reset:${ip}`, 3);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many reset requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Look up the admin by email (case-insensitive)
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Security best practice: always return success regardless of whether email exists
    if (admin) {
      // Generate a cryptographically secure 32-byte random reset token
      const token = crypto.randomBytes(32).toString('hex');
      const key = `password_reset_${token}`;

      // Store the token in SiteSetting with a 15-minute expiry reference
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

      // Attempt to send the reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/#staff-portal-8x7q?reset=${token}`;
      const emailSent = isEmailConfigured();

      if (emailSent) {
        const result = await sendResetPasswordEmail({
          to: admin.email,
          name: admin.name,
          resetUrl,
        });
        if (!result.success) {
          console.error('[reset-password] Failed to send reset email:', result.error);
        }
      } else {
        // Fallback: log to console when email is not configured
        console.log('═══════════════════════════════════════');
        console.log('PASSWORD RESET EMAIL (simulated - SMTP not configured):');
        console.log('═══════════════════════════════════════');
        console.log(`To: ${admin.email}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Token: ${token}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('═══════════════════════════════════════');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
