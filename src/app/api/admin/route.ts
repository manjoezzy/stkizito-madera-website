import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashSync, compareSync } from 'bcrypt-ts';

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@stkizitos.edu',
  password: hashSync('admin123', 10),
  name: 'System Administrator',
  role: 'super-admin',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Login
    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Check demo admin
      if (email === DEMO_ADMIN.email && compareSync(password, DEMO_ADMIN.password)) {
        return NextResponse.json({
          success: true,
          message: 'Login successful',
          data: {
            id: 'demo-admin',
            email: DEMO_ADMIN.email,
            name: DEMO_ADMIN.name,
            role: DEMO_ADMIN.role,
            isDemo: true,
          },
        });
      }

      // Check DB admins
      const admin = await db.admin.findUnique({ where: { email } });
      if (admin && compareSync(password, admin.password)) {
        return NextResponse.json({
          success: true,
          message: 'Login successful',
          data: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            isDemo: false,
          },
        });
      }

      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Seed demo admin
    if (action === 'seed') {
      const existing = await db.admin.findUnique({ where: { email: DEMO_ADMIN.email } });
      if (!existing) {
        await db.admin.create({
          data: { email: DEMO_ADMIN.email, password: DEMO_ADMIN.password, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role },
        });
      }
      return NextResponse.json({ success: true, message: 'Demo admin seeded' });
    }

    // Create admin
    if (action === 'create') {
      const { email, password, name, role } = body;
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, message: 'Email, password, and name required' },
          { status: 400 }
        );
      }

      const existing = await db.admin.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Admin with this email already exists' },
          { status: 409 }
        );
      }

      const admin = await db.admin.create({
        data: { email, password: hashSync(password, 10), name, role: role || 'admin' },
      });

      return NextResponse.json({
        success: true,
        message: 'Admin created successfully',
        data: { id: admin.id, email: admin.email, name: admin.name },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin API error:', msg);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
