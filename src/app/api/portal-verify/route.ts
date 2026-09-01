import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Timing-safe comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// In-memory rate limiter for portal key attempts
const attempts = new Map<string, { count: number; firstAttempt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

function checkPortalRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Portal key is required' },
        { status: 400 }
      );
    }

    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkPortalRateLimit(ip)) {
      return NextResponse.json(
        { valid: false, message: 'Too many failed attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const secretKey = process.env.PORTAL_SECRET_KEY;
    if (!secretKey) {
      console.error('[portal-verify] PORTAL_SECRET_KEY is not configured in environment variables.');
      return NextResponse.json(
        { valid: false, message: 'Portal is not configured. Contact the administrator.' },
        { status: 500 }
      );
    }

    if (safeCompare(key.trim(), secretKey)) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json(
      { valid: false, message: 'Invalid portal key.' },
      { status: 403 }
    );
  } catch {
    return NextResponse.json(
      { valid: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Cleanup stale rate limit entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of attempts.entries()) {
      if (now - record.firstAttempt > WINDOW_MS) {
        attempts.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}
