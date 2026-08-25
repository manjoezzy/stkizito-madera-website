import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashSync, compareSync } from 'bcrypt-ts';
import {
  createToken,
  getSession,
  isSuperAdmin,
  hasMinRole,
  unauthorized,
  forbidden,
} from '@/lib/auth';
import { getSessionCookieName } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';

const VALID_ROLES: UserRole[] = ['super-admin', 'admissions-staff'];

// ─── Rate-limited login map ───────────────────────────
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function isLoginLocked(email: string): { locked: boolean; retryAfterMs: number } {
  const entry = loginAttempts.get(email);
  if (!entry) return { locked: false, retryAfterMs: 0 };
  const now = Date.now();
  if (now < entry.lockedUntil) {
    return { locked: true, retryAfterMs: entry.lockedUntil - now };
  }
  loginAttempts.delete(email);
  return { locked: false, retryAfterMs: 0 };
}

function recordFailedLogin(email: string) {
  const entry = loginAttempts.get(email);
  if (!entry) {
    loginAttempts.set(email, { count: 1, lockedUntil: 0 });
    return;
  }
  entry.count++;
  // Lock after 5 failed attempts for 15 minutes
  if (entry.count >= 5) {
    entry.lockedUntil = Date.now() + 15 * 60 * 1000;
  }
}

function clearFailedLogins(email: string) {
  loginAttempts.delete(email);
}

// ─── POST handler ─────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── LOGIN (public, no auth required) ──
    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Check rate limit / lockout
      const { locked, retryAfterMs } = isLoginLocked(email);
      if (locked) {
        const mins = Math.ceil(retryAfterMs / 60000);
        return NextResponse.json(
          { success: false, message: `Account temporarily locked. Try again in ${mins} minute(s).` },
          { status: 429 }
        );
      }

      const admin = await db.admin.findUnique({ where: { email: email.toLowerCase() } });

      if (!admin || !compareSync(password, admin.password)) {
        recordFailedLogin(email);
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if account is disabled
      if (admin.disabled === true) {
        return NextResponse.json(
          { success: false, message: 'This account has been disabled. Contact the system administrator.' },
          { status: 403 }
        );
      }

      clearFailedLogins(email);

      // Determine role (use stored or default)
      const role = (admin.role || 'admissions-staff') as UserRole;
      if (!VALID_ROLES.includes(role)) {
        await db.admin.update({ where: { id: admin.id }, data: { role: 'admissions-staff' } });
      }

      // Create JWT and set cookie directly on the response
      const token = await createToken({
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: VALID_ROLES.includes(role) ? role : 'admissions-staff',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: VALID_ROLES.includes(role) ? role : 'admissions-staff',
        },
      });

      response.cookies.set(getSessionCookieName(), token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 8 * 60 * 60, // 8 hours
      });

      // Update last login (non-blocking — don't fail login if column missing)
      try {
        await db.admin.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() },
        });
      } catch {
        // Ignore — lastLogin is informational only
      }

      return response;
    }

    // ── LOGOUT ──
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.delete(getSessionCookieName());
      return response;
    }

    // ── CREATE ADMIN (super-admin only) ──
    if (action === 'create') {
      const session = await getSession();
      if (!session || !isSuperAdmin(session)) {
        return forbidden('Only super-admin can create admin accounts');
      }

      const { email, password, name, role } = body;
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, message: 'Email, password, and name are required' },
          { status: 400 }
        );
      }
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }
      if (role && !VALID_ROLES.includes(role)) {
        return NextResponse.json(
          { success: false, message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
          { status: 400 }
        );
      }

      const existing = await db.admin.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      const newAdmin = await db.admin.create({
        data: {
          email: email.toLowerCase(),
          password: hashSync(password, 10),
          name,
          role: (role || 'admissions-staff') as UserRole,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Admin account created',
        data: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name },
      });
    }

    // ── SEED (super-admin only, for initial setup) ──
    if (action === 'seed') {
      const session = await getSession();
      if (!session || !isSuperAdmin(session)) {
        return forbidden('Only super-admin can seed accounts');
      }

      const { email, password, name, role } = body;
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, message: 'Email, password, and name required' },
          { status: 400 }
        );
      }

      const existing = await db.admin.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Account already exists' },
          { status: 409 }
        );
      }

      await db.admin.create({
        data: {
          email: email.toLowerCase(),
          password: hashSync(password, 10),
          name,
          role: (role || 'admissions-staff') as UserRole,
        },
      });

      return NextResponse.json({ success: true, message: 'Admin seeded' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin API error:', msg, error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── GET handler (dashboard stats - admin only) ───────
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const [
      totalApplications,
      totalStudents,
      totalPayments,
      totalRevenue,
      pendingApplications,
      recentApplications,
      recentPayments,
    ] = await Promise.all([
      db.admissionApplication.count(),
      db.student.count(),
      db.payment.count(),
      db.payment.aggregate({ where: { status: 'successful' }, _sum: { amount: true } }),
      db.admissionApplication.count({ where: { status: 'pending' } }),
      db.admissionApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      db.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const paymentsByMonth = await db.payment.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true,
    });

    const appsByStatus = await db.admissionApplication.groupBy({
      by: ['status'],
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalApplications,
          totalStudents,
          totalPayments,
          totalRevenue: totalRevenue._sum.amount || 0,
          pendingApplications,
        },
        recentApplications,
        recentPayments,
        paymentsByMonth,
        appsByStatus,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin dashboard error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
