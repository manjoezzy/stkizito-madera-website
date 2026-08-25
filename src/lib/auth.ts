import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// ─── Types ─────────────────────────────────────────────
export type UserRole = 'super-admin' | 'admissions-staff' | 'student';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Config ────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sktim-jwt-secret-change-in-production-2026'
);

const TOKEN_EXPIRY = '8h'; // 8 hours
const COOKIE_NAME = 'sktim_session';

// ─── JWT helpers ───────────────────────────────────────
export async function createToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ────────────────────────────────────
export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Request-level auth (for API routes) ───────────────
export async function getRequestSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Auth response helpers ─────────────────────────────
export function unauthorized(message = 'Authentication required') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = 'Insufficient permissions') {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

// ─── Role checks ───────────────────────────────────────
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super-admin': 3,
  'admissions-staff': 2,
  'student': 1,
};

export function hasMinRole(session: SessionPayload, requiredRole: UserRole): boolean {
  return (ROLE_HIERARCHY[session.role] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function isAdmin(session: SessionPayload): boolean {
  return session.role === 'super-admin' || session.role === 'admissions-staff';
}

export function isSuperAdmin(session: SessionPayload): boolean {
  return session.role === 'super-admin';
}

// ─── Rate limiting (in-memory) ─────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

// Cleanup old entries periodically (called on each check)
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }, 60_000);
}

import { NextResponse } from 'next/server';
