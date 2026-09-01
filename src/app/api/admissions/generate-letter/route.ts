import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSchoolPayCode, getProgrammeFee } from '@/lib/schoolpay';
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

    // Ensure SchoolPay code exists
    let schoolpayCode = app.schoolpayCode;
    if (!schoolpayCode) {
      schoolpayCode = generateSchoolPayCode({
        fullName: app.fullName,
        phone: app.phone,
        email: app.email,
        programme: app.programme || '',
        referenceNumber: app.referenceNumber,
      });
      await db.admissionApplication.update({
        where: { id: app.id },
        data: { schoolpayCode },
      });
    }

    const { html, text, schoolpayCode: spCode, fee } = buildAdmissionLetter({
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
      schoolpayCode,
      paymentAmount: app.paymentAmount,
    });

    return NextResponse.json({
      success: true,
      data: {
        referenceNumber: app.referenceNumber,
        applicantName: app.fullName,
        email: app.email,
        schoolpayCode: spCode,
        fee,
        letterHtml: html,
        letterText: text,
        documents: app.documents.map((d) => ({
          type: d.documentType,
          name: d.fileName,
        })),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Generate letter error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to generate admission letter' },
      { status: 500 },
    );
  }
}
