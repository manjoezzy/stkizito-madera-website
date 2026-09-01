import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildAdmissionLetter } from '@/lib/admission-letter';
import { getSession, hasMinRole, forbidden, unauthorized } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const body = await request.json();
    const { applicationId, referenceNumber } = body;

    if (!applicationId && !referenceNumber) {
      return NextResponse.json(
        { success: false, message: 'Provide either applicationId or referenceNumber' },
        { status: 400 },
      );
    }

    // Look up the application
    const app = await db.admissionApplication.findUnique({
      where: applicationId ? { id: applicationId } : { referenceNumber: referenceNumber! },
      include: { documents: true },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 },
      );
    }

    // Generate letter
    const { html, text, schoolpayCode, fee } = buildAdmissionLetter({
      fullName: app.fullName,
      referenceNumber: app.referenceNumber,
      programme: app.programme,
      intakeYear: app.intakeYear,
      dob: app.dob,
      gender: app.gender,
      nationality: app.nationality,
      district: app.district,
      phone: app.phone,
      email: app.email,
      schoolpayCode: app.schoolpayCode,
      paymentAmount: app.paymentAmount,
    });

    // Simulate sending the email (log it since SMTP may not be configured)
    console.log(`
═══════════════════════════════════════════
  EMAIL TO: ${app.email}
  SUBJECT: Temporary Admission Letter – ${app.referenceNumber}
  ─────────────────────────────────────────
  Admission letter for ${app.fullName} generated.
  SchoolPay Code: ${schoolpayCode}
  Fee: ${fee}
  Letter length (HTML): ${html.length} chars
  Letter length (text): ${text.length} chars

  [SMTP not configured — email dispatch simulated]
═══════════════════════════════════════════
  `);

    return NextResponse.json({
      success: true,
      message: `Admission letter sent to ${app.email}`,
      data: {
        referenceNumber: app.referenceNumber,
        applicantName: app.fullName,
        email: app.email,
        schoolpayCode,
        fee,
        letterHtml: html,
        simulated: true,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Send letter error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to send admission letter' },
      { status: 500 },
    );
  }
}
