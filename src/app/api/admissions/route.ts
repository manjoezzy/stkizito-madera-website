import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAdmissionRef, generateTransactionRef, getProgrammeFee } from '@/lib/schoolpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName, dob, gender, nationality, religion, nin,
      phone, email, district, address, nextOfKin, nextOfKinPhone,
      lastSchool, yearCompleted, qualification,
      programme, intakeYear,
    } = body;

    if (!fullName || !phone || !email || !programme) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: fullName, phone, email, programme' },
        { status: 400 }
      );
    }

    const referenceNumber = generateAdmissionRef();
    const fee = getProgrammeFee(programme);

    const application = await db.admissionApplication.create({
      data: {
        referenceNumber,
        fullName,
        dob: dob || null,
        gender: gender || null,
        nationality: nationality || null,
        religion: religion || null,
        nin: nin || null,
        phone,
        email,
        district: district || null,
        address: address || null,
        nextOfKin: nextOfKin || null,
        nextOfKinPhone: nextOfKinPhone || null,
        lastSchool: lastSchool || null,
        yearCompleted: yearCompleted || null,
        qualification: qualification || null,
        programme,
        intakeYear: intakeYear || new Date().getFullYear().toString(),
        paymentAmount: fee,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application.id,
        referenceNumber: application.referenceNumber,
        fee,
        programme,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admission submission error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { referenceNumber: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const applications = await db.admissionApplication.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const counts = {
      total: await db.admissionApplication.count(),
      pending: await db.admissionApplication.count({ where: { status: 'pending' } }),
      approved: await db.admissionApplication.count({ where: { status: 'approved' } }),
      rejected: await db.admissionApplication.count({ where: { status: 'rejected' } }),
      enrolled: await db.admissionApplication.count({ where: { status: 'enrolled' } }),
    };

    return NextResponse.json({ success: true, data: applications, counts });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch applications error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    const application = await db.admissionApplication.update({
      where: { id },
      data: { status, ...updates, updatedAt: new Date() },
    });

    // If approved and status is 'enrolled', create student record
    if (status === 'enrolled') {
      const existingStudent = await db.student.findUnique({
        where: { applicationId: id },
      });
      if (!existingStudent) {
        const seq = Math.floor(Math.random() * 90000) + 10000;
        const year = new Date().getFullYear();
        await db.student.create({
          data: {
            studentNumber: `SKT/${year}/${seq}`,
            applicationId: id,
            fullName: application.fullName,
            phone: application.phone,
            email: application.email,
            programme: application.programme || 'N/A',
            intakeYear: application.intakeYear || year.toString(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Update application error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to update application' },
      { status: 500 }
    );
  }
}
