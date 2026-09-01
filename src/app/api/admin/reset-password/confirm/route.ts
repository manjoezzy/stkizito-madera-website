import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashSync } from 'bcrypt-ts';
import { checkRateLimit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const { allowed } = checkRateLimit(`reset-confirm:${ip}`, 5);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Look up the token in SiteSetting
    const key = `password_reset_${token}`;
    const setting = await db.siteSetting.findUnique({ where: { key } });

    if (!setting) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired (15 minutes)
    const now = new Date();
    const updatedAt = new Date(setting.updatedAt);
    const fifteenMinMs = 15 * 60 * 1000;

    if (now.getTime() - updatedAt.getTime() > fifteenMinMs) {
      // Token expired — delete it
      await db.siteSetting.delete({ where: { key } });
      return NextResponse.json(
        { success: false, message: 'Reset token has expired (15-minute window). Please request a new one.' },
        { status: 400 }
      );
    }

    const adminEmail = setting.value;

    const admin = await db.admin.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      // Admin account no longer exists — clean up token
      await db.siteSetting.delete({ where: { key } });
      return NextResponse.json(
        { success: false, message: 'Admin account not found' },
        { status: 400 }
      );
    }

    // Hash the new password with bcrypt (cost 10)
    await db.admin.update({
      where: { email: adminEmail },
      data: { password: hashSync(newPassword, 10) },
    });

    // Immediately invalidate the token (single-use)
    await db.siteSetting.delete({ where: { key } });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
