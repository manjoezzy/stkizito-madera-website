import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Look up the token in SiteSetting
    const key = `password_reset_${token}`;
    const setting = await db.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired (1 hour = 3600000 ms)
    const now = new Date();
    const updatedAt = new Date(setting.updatedAt);
    const oneHourMs = 60 * 60 * 1000;

    if (now.getTime() - updatedAt.getTime() > oneHourMs) {
      // Token expired - delete it
      await db.siteSetting.delete({ where: { key } });
      return NextResponse.json(
        { success: false, message: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Get the admin email from the setting value
    const adminEmail = setting.value;

    // Update the admin's password (store as plain text for demo)
    const admin = await db.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      // Delete token and return error
      await db.siteSetting.delete({ where: { key } });
      return NextResponse.json(
        { success: false, message: 'Admin account not found' },
        { status: 400 }
      );
    }

    await db.admin.update({
      where: { email: adminEmail },
      data: { password: newPassword },
    });

    // Delete the used token
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
