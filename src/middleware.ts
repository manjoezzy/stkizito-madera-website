import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Public GET routes (only when specific conditions met)
const PUBLIC_GET_PATHS = ['/api/events', '/api/gallery', '/api/graduation', '/api/alumni', '/api/settings', '/api/settings/bulk', '/api/auth/session'];

// Public POST routes (no auth required)
const PUBLIC_POST_PATHS = ['/api/contact', '/api/admissions/tvet', '/api/admin', '/api/admin/reset-password', '/api/admin/reset-password/confirm', '/api/alumni/register', '/api/portal-verify'];

// Admin-only route prefixes (require super-admin or admissions-staff)
const ADMIN_PATHS = ['/api/admin', '/api/admissions', '/api/upload', '/api/payments', '/api/alumni/export'];

function isExactPath(pathname: string, paths: string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isPublicRequest(request: NextRequest, pathname: string): boolean {
  // Health check
  if (pathname === '/api/') return true;

  // GET requests
  if (request.method === 'GET') {
    // Exact public paths
    if (isExactPath(pathname, PUBLIC_GET_PATHS)) {
      // Events/gallery/graduation/alumni: only public without ?admin=true
      const adminPaths = ['/api/events', '/api/gallery', '/api/graduation', '/api/alumni'];
      if (adminPaths.some((p) => pathname.startsWith(p))) {
        const url = new URL(request.url);
        if (url.searchParams.get('admin') === 'true') return false;
      }
      return true;
    }

    // Admissions tracking: public if ?ref= param exists
    if (pathname === '/api/admissions') {
      const url = new URL(request.url);
      if (url.searchParams.get('ref')) return true;
    }
  }

  // POST requests
  if (request.method === 'POST') {
    if (isExactPath(pathname, PUBLIC_POST_PATHS)) return true;

    // Admissions POST (non-TVET) is public (application submission)
    if (pathname === '/api/admissions') return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRequest(request, pathname)) {
    return NextResponse.next();
  }

  // All other routes require authentication
  const token = request.cookies.get('sktim_session')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Session expired. Please log in again.' },
      { status: 401 }
    );
  }

  // Admin routes require admin role
  if (ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    if (session.role !== 'super-admin' && session.role !== 'admissions-staff') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  }

  // Inject session info into request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-session-user-id', session.userId);
  requestHeaders.set('x-session-role', session.role);
  requestHeaders.set('x-session-email', session.email);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
