import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hasMinRole, unauthorized, forbidden } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ref = searchParams.get('ref');

    let app;
    if (id) {
      app = await db.admissionApplication.findUnique({ where: { id }, include: { documents: true } });
    } else if (ref) {
      app = await db.admissionApplication.findUnique({ where: { referenceNumber: ref }, include: { documents: true } });
    }

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const isTvet = !!(app.grades && app.grades.length > 2);
    const html = generateFormHTML(app, isTvet);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${app.referenceNumber || 'application'}.html"`,
      },
    });
  } catch (error) {
    console.error('Download form error:', error);
    return NextResponse.json({ error: 'Failed to generate form' }, { status: 500 });
  }
}

function esc(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateFormHTML(app: any, isTvet: boolean): string {
  const grades: Array<{ subject: string; grade: string }> = (() => {
    try { return JSON.parse(app.grades || '[]'); } catch { return []; }
  })();

  const submittedDate = new Date(app.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Application Form - ${esc(app.referenceNumber)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #1a1a1a; line-height: 1.5; padding: 40px 50px; max-width: 210mm; margin: 0 auto; }
  .header { text-align: center; border-bottom: 3px double #1a3a6b; padding-bottom: 15px; margin-bottom: 20px; }
  .header h1 { font-size: 16pt; color: #1a3a6b; margin-bottom: 4px; }
  .header h2 { font-size: 12pt; color: #333; font-weight: normal; margin-bottom: 4px; }
  .header p { font-size: 9pt; color: #666; }
  .ref-bar { display: flex; justify-content: space-between; background: #f0f4f8; padding: 8px 15px; border-radius: 4px; margin-bottom: 20px; font-size: 10pt; }
  .ref-bar strong { color: #1a3a6b; }
  .section-title { background: #1a3a6b; color: white; padding: 6px 12px; font-size: 11pt; font-weight: bold; margin: 20px 0 10px 0; border-radius: 3px; }
  .section-title:first-of-type { margin-top: 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  td, th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; vertical-align: top; font-size: 11pt; }
  th { background: #f5f7fa; font-weight: 600; width: 35%; color: #333; }
  .status-badge { display: inline-block; padding: 3px 12px; border-radius: 12px; font-size: 10pt; font-weight: bold; text-transform: uppercase; }
  .status-pending { background: #fef3c7; color: #92400e; }
  .status-approved { background: #d1fae5; color: #065f46; }
  .status-rejected { background: #fee2e2; color: #991b1b; }
  .status-enrolled { background: #dbeafe; color: #1e40af; }
  .grades-table th { background: #1a3a6b; color: white; width: auto; }
  .grades-table td { text-align: center; }
  .doc-table td:first-child { font-weight: 600; }
  .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 9pt; color: #888; text-align: center; }
  .declaration { margin-top: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 4px; }
  .declaration p { margin-bottom: 8px; }
  .sig-area { display: flex; justify-content: space-between; margin-top: 40px; }
  .sig-box { text-align: center; width: 45%; }
  .sig-line { border-top: 1px solid #333; width: 200px; margin: 40px auto 5px auto; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
  .no-print { margin-bottom: 15px; }
  .no-print button { background: #1a3a6b; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-size: 11pt; }
  .no-print button:hover { background: #2756a0; }
</style>
</head>
<body>
  <div class="no-print"><button onclick="window.print()">Print / Save as PDF</button></div>

  <div class="header">
    <h1>ST. KIZITO'S TECHNICAL INSTITUTE - MADERA</h1>
    <h2>${isTvet ? 'Formal Admission Form (TVET)' : 'Application for Admission (Non-Formal)'}</h2>
    <p>P.O. Box 1, Madera, Soroti City, Uganda | Tel: +256 XXX XXX XXX</p>
  </div>

  <div class="ref-bar">
    <span>Ref: <strong>${esc(app.referenceNumber)}</strong></span>
    <span>Status: <strong class="status-badge status-${app.status}">${esc(app.status)}</strong></span>
    <span>Submitted: <strong>${submittedDate}</strong></span>
  </div>

  ${isTvet ? generateTvetSections(app, grades) : generateNonFormalSections(app)}

  ${app.documents && app.documents.length > 0 ? `
  <div class="section-title">UPLOADED DOCUMENTS</div>
  <table class="doc-table">
    <tr><th>Document Type</th><th>File Name</th><th>Size</th><th>Uploaded</th></tr>
    ${app.documents.map((d: any) => `<tr><td>${esc(d.documentType)}</td><td>${esc(d.fileName)}</td><td>${(d.fileSize / 1024).toFixed(1)} KB</td><td>${new Date(d.createdAt).toLocaleDateString('en-GB')}</td></tr>`).join('')}
  </table>` : ''}

  <div class="declaration">
    <p><strong>Declaration:</strong> I hereby declare that all information provided in this application is true and correct to the best of my knowledge. I understand that any false information may lead to disqualification or cancellation of admission.</p>
  </div>

  <div class="sig-area">
    <div class="sig-box">
      <div class="sig-line"></div>
      <p>Applicant's Signature</p>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <p>Date</p>
    </div>
  </div>

  <div class="footer">
    St. Kizito's Technical Institute - Madera | Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} | This is an official application record.
  </div>
</body>
</html>`;
}

function generateTvetSections(app: any, grades: Array<{ subject: string; grade: string }>): string {
  const pleGrades = grades.filter(g => g.subject && g.subject.startsWith('PLE_'));
  const olevelGrades = grades.filter(g => g.subject && g.subject.startsWith('OLEVEL_'));
  const otherGrades = grades.filter(g => !g.subject.startsWith('PLE_') && !g.subject.startsWith('OLEVEL_'));

  return `
  <div class="section-title">SECTION A: APPLICANT'S PARTICULARS</div>
  <table>
    <tr><th>Full Name</th><td>${esc(app.fullName)}</td></tr>
    <tr><th>Sex</th><td>${esc(app.gender)}</td></tr>
    <tr><th>Date of Birth</th><td>${esc(app.dob)}</td></tr>
    <tr><th>Nationality</th><td>${esc(app.nationality)}</td></tr>
    <tr><th>Religion</th><td>${esc(app.religion)}</td></tr>
    <tr><th>National ID No. (NIN)</th><td>${esc(app.nin)}</td></tr>
    <tr><th>Phone Number</th><td>${esc(app.phone)}</td></tr>
    <tr><th>Email Address</th><td>${esc(app.email)}</td></tr>
    <tr><th>District</th><td>${esc(app.district)}</td></tr>
    <tr><th>Address</th><td>${esc(app.address)}</td></tr>
    <tr><th>Parent/Guardian Name</th><td>${esc(app.nextOfKin)}</td></tr>
    <tr><th>Parent/Guardian Phone</th><td>${esc(app.nextOfKinPhone)}</td></tr>
  </table>

  ${pleGrades.length > 0 || olevelGrades.length > 0 ? `
  <div class="section-title">SECTION B: ACADEMIC QUALIFICATIONS</div>
  ${pleGrades.length > 0 ? `
  <p style="font-weight:bold; margin-bottom:5px;">PLE Results</p>
  <table class="grades-table">
    <tr><th>Subject</th><th>Grade</th></tr>
    ${pleGrades.map(g => `<tr><td>${esc(g.subject.replace('PLE_', ''))}</td><td>${esc(g.grade)}</td></tr>`).join('')}
  </table>` : ''}
  ${olevelGrades.length > 0 ? `
  <p style="font-weight:bold; margin: 10px 0 5px 0;">O-Level Results</p>
  <table class="grades-table">
    <tr><th>Subject</th><th>Grade</th></tr>
    ${olevelGrades.map(g => `<tr><td>${esc(g.subject.replace('OLEVEL_', ''))}</td><td>${esc(g.grade)}</td></tr>`).join('')}
  </table>` : ''}
  ${otherGrades.length > 0 ? `
  <p style="font-weight:bold; margin: 10px 0 5px 0;">Other Qualifications</p>
  <table class="grades-table">
    <tr><th>Qualification</th><th>Grade/Result</th></tr>
    ${otherGrades.map(g => `<tr><td>${esc(g.subject)}</td><td>${esc(g.grade)}</td></tr>`).join('')}
  </table>` : ''}` : ''}

  <div class="section-title">SECTION C: PROGRAMME CHOICES</div>
  <table>
    <tr><th>Programme Applied For</th><td>${esc(app.programme)}</td></tr>
    <tr><th>Intake Year</th><td>${esc(app.intakeYear)}</td></tr>
    <tr><th>Last School Attended</th><td>${esc(app.lastSchool)}</td></tr>
    <tr><th>Year Completed</th><td>${esc(app.yearCompleted)}</td></tr>
    <tr><th>Qualification</th><td>${esc(app.qualification)}</td></tr>
    <tr><th>Institution Level</th><td>${esc(app.institutionLevel)}</td></tr>
  </table>

  <div class="section-title">SECTION D: APPLICATION SUMMARY</div>
  <table>
    <tr><th>Application Status</th><td><span class="status-badge status-${app.status}">${esc(app.status)}</span></td></tr>
    <tr><th>Payment Status</th><td>${esc(app.paymentStatus)}</td></tr>
    <tr><th>SchoolPay Code</th><td>${esc(app.schoolpayCode) || 'N/A'}</td></tr>
    <tr><th>Reference Number</th><td style="font-weight:bold;">${esc(app.referenceNumber)}</td></tr>
  </table>`;
}

function generateNonFormalSections(app: any): string {
  return `
  <div class="section-title">PERSONAL INFORMATION</div>
  <table>
    <tr><th>Full Name</th><td>${esc(app.fullName)}</td></tr>
    <tr><th>Sex</th><td>${esc(app.gender)}</td></tr>
    <tr><th>Date of Birth</th><td>${esc(app.dob)}</td></tr>
    <tr><th>Nationality</th><td>${esc(app.nationality)}</td></tr>
    <tr><th>Religion</th><td>${esc(app.religion)}</td></tr>
    <tr><th>National ID No. (NIN)</th><td>${esc(app.nin)}</td></tr>
    <tr><th>Phone Number</th><td>${esc(app.phone)}</td></tr>
    <tr><th>Email Address</th><td>${esc(app.email)}</td></tr>
    <tr><th>District</th><td>${esc(app.district)}</td></tr>
    <tr><th>Address</th><td>${esc(app.address)}</td></tr>
    <tr><th>Next of Kin</th><td>${esc(app.nextOfKin)}</td></tr>
    <tr><th>Next of Kin Phone</th><td>${esc(app.nextOfKinPhone)}</td></tr>
  </table>

  <div class="section-title">ACADEMIC BACKGROUND</div>
  <table>
    <tr><th>Last School Attended</th><td>${esc(app.lastSchool)}</td></tr>
    <tr><th>Year Completed</th><td>${esc(app.yearCompleted)}</td></tr>
    <tr><th>Highest Qualification</th><td>${esc(app.qualification)}</td></tr>
    <tr><th>Institution Level</th><td>${esc(app.institutionLevel)}</td></tr>
  </table>

  <div class="section-title">PROGRAMME DETAILS</div>
  <table>
    <tr><th>Programme Applied For</th><td>${esc(app.programme)}</td></tr>
    <tr><th>Intake Year</th><td>${esc(app.intakeYear)}</td></tr>
    <tr><th>Reference Number</th><td style="font-weight:bold;">${esc(app.referenceNumber)}</td></tr>
    <tr><th>Application Status</th><td><span class="status-badge status-${app.status}">${esc(app.status)}</span></td></tr>
    <tr><th>Payment Status</th><td>${esc(app.paymentStatus)}</td></tr>
    <tr><th>SchoolPay Code</th><td>${esc(app.schoolpayCode) || 'N/A'}</td></tr>
  </table>`;
}
