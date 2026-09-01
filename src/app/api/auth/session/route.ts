import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// ─── GET session ─────────────────────────────────────
// Returns the current authenticated user from the JWT cookie.
// Used by the SPA on page load to restore session.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    authenticated: true,
    data: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
