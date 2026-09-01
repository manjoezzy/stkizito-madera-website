import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAdmissionRef, generateSchoolPayCode } from '@/lib/schoolpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      surname, otherNames, nationality, dob, sex,
      homeDistrict, county, subCounty, religion, email,
      parish, village, telephone,
      parentGuardianName, parentTelephone, parentTelephone2, parentNIN,
      pleSchoolName, pleYearSitting, pleIndexNumber, pleTotalAggregates, pleDivision, pleSubjects,
      olevelSchoolName, olevelYearSitting, olevelIndexNumber, olevelSubjects,
      ujtcInstitution, ujtcYearSitting, ujtcCourseName, ujtcIndexNumber, ujtcGrade, ujtcSubjects,
      otherQuals,
      workRecords, sportsGames, chronicDisease,
      institutionChoices, reasonForCourse,
      declarationName, declarationDate,
      passportPhotoUrl,
      documents,
    } = body;

    const fullName = `${surname || ''} ${otherNames || ''}`.trim();
    if (!fullName || !telephone || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, telephone, email' },
        { status: 400 }
      );
    }

    const programme = institutionChoices?.[0]?.courseI || 'TVET Programme';

    const referenceNumber = generateAdmissionRef();
    const schoolpayCode = generateSchoolPayCode({
      fullName,
      phone: telephone,
      email,
      programme,
      referenceNumber,
    });

    // Store comprehensive TVET data as JSON in the grades field
    // alongside actual grades data. Map matching fields to existing columns.
    const tvetData = {
      type: 'TVET',
      sectionA: {
        surname, otherNames, nationality, dob, sex,
        homeDistrict, county, subCounty, religion,
        parish, village,
        parentGuardianName, parentTelephone, parentTelephone2, parentNIN,
        passportPhotoUrl: passportPhotoUrl || null,
      },
      sectionB: {
        ple: { schoolName: pleSchoolName, yearSitting: pleYearSitting, indexNumber: pleIndexNumber, totalAggregates: pleTotalAggregates, division: pleDivision, subjects: pleSubjects },
        olevel: { schoolName: olevelSchoolName, yearSitting: olevelYearSitting, indexNumber: olevelIndexNumber, subjects: olevelSubjects },
        ujtc: { institution: ujtcInstitution, yearSitting: ujtcYearSitting, courseName: ujtcCourseName, indexNumber: ujtcIndexNumber, grade: ujtcGrade, subjects: ujtcSubjects },
        otherQuals,
      },
      sectionC: {
        workRecords, sportsGames, chronicDisease,
        institutionChoices, reasonForCourse,
      },
      sectionD: {
        declarationName, declarationDate,
      },
    };

    const application = await db.admissionApplication.create({
      data: {
        referenceNumber,
        schoolpayCode,
        fullName,
        dob: dob || null,
        gender: sex || null,
        nationality: nationality || null,
        religion: religion || null,
        nin: parentNIN || null,
        phone: telephone,
        email,
        district: homeDistrict || null,
        address: `${parish || ''}, ${village || ''}, ${county || ''}, ${subCounty || ''}`.replace(/^[,\s]+|[,\s]+$/g, ''),
        nextOfKin: parentGuardianName || null,
        nextOfKinPhone: parentTelephone || null,
        lastSchool: olevelSchoolName || pleSchoolName || null,
        yearCompleted: olevelYearSitting || pleYearSitting || null,
        qualification: 'TVET Application',
        institutionLevel: 'TVET',
        grades: JSON.stringify(tvetData),
        programme,
        intakeYear: new Date().getFullYear().toString(),
      },
      include: { documents: true },
    });

    // Create admission document records from base64 data URLs
    if (Array.isArray(documents) && documents.length > 0) {
      for (const doc of documents) {
        if (doc.dataUrl && doc.fileName) {
          await db.admissionDocument.create({
            data: {
              applicationId: application.id,
              fileName: doc.fileName,
              fileUrl: doc.dataUrl,
              fileSize: 0,
              documentType: doc.type || 'other',
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'TVET application submitted successfully',
      data: {
        id: application.id,
        referenceNumber: application.referenceNumber,
        schoolpayCode: application.schoolpayCode,
        programme,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('TVET admission submission error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to submit TVET application. Please try again.' },
      { status: 500 }
    );
  }
}
