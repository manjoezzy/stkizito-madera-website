// Shared admission letter generation logic

import { generateSchoolPayCode, formatCurrency, getProgrammeFee } from '@/lib/schoolpay';

export interface AdmissionLetterData {
  fullName: string;
  referenceNumber: string;
  programme: string | null;
  intakeYear: string | null;
  dob: string | null;
  gender: string | null;
  nationality: string | null;
  district: string | null;
  phone: string;
  email: string;
  schoolpayCode: string | null;
  paymentAmount: number | null;
}

export function buildAdmissionLetter(app: AdmissionLetterData) {
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const fee = app.paymentAmount || getProgrammeFee(app.programme || '');
  const spCode = app.schoolpayCode || generateSchoolPayCode({
    fullName: app.fullName,
    phone: app.phone,
    email: app.email,
    programme: app.programme || '',
    referenceNumber: app.referenceNumber,
  });

  // ── HTML version ──
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Temporary Admission Letter – ${app.referenceNumber}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; border-bottom: 3px double #0f2347; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; color: #0f2347; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #475569; }
    .title { text-align: center; font-size: 22px; font-weight: 700; margin: 24px 0 8px; color: #0f2347; text-transform: uppercase; letter-spacing: 2px; }
    .meta { display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 14px; color: #64748b; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
    .greeting { font-size: 16px; margin-bottom: 20px; }
    .body-text { font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
    table.details { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    table.details th, table.details td { text-align: left; padding: 8px 12px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
    table.details th { width: 40%; color: #475569; font-weight: 600; }
    .section-title { font-size: 15px; font-weight: 700; margin: 24px 0 8px; color: #0f2347; }
    .requirements { padding-left: 20px; }
    .requirements li { margin-bottom: 6px; font-size: 14px; line-height: 1.6; }
    .payment-box { background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 8px; padding: 16px 20px; margin: 20px 0; text-align: center; }
    .payment-box .code { font-size: 26px; font-family: 'Courier New', monospace; font-weight: 700; color: #0f2347; letter-spacing: 3px; margin: 4px 0; }
    .payment-box .amount { font-size: 18px; font-weight: 600; color: #92400e; }
    .note { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; font-size: 13px; color: #991b1b; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    .footer strong { color: #0f2347; }
  </style>
</head>
<body>
  <div class="header">
    <h1>ST. KIZITO'S TECHNICAL INSTITUTE – MADERA</h1>
    <p>P.O. BOX 320, SOROTI, UGANDA</p>
    <p>Tel: +256 752 309 660 | Email: stkizitmad@gmail.com</p>
  </div>

  <div class="title">Temporary Admission Letter</div>

  <div class="meta">
    <span><strong>Reference:</strong> ${app.referenceNumber}</span>
    <span><strong>Date of Issue:</strong> ${issueDate}</span>
  </div>

  <p class="greeting">Dear ${app.fullName},</p>

  <p class="body-text">
    Congratulations! Your application to <strong>St. Kizito's Technical Institute – Madera</strong>
    has been received and is being processed. This temporary letter confirms your admission
    status pending full verification of documents and payment of the required fees.
  </p>

  <table class="details">
    <tr><th>Applicant Name</th><td>${app.fullName}</td></tr>
    <tr><th>Programme</th><td>${app.programme || 'N/A'}</td></tr>
    <tr><th>Intake Year</th><td>${app.intakeYear || 'N/A'}</td></tr>
    <tr><th>Date of Birth</th><td>${app.dob || 'N/A'}</td></tr>
    <tr><th>Gender</th><td>${app.gender || 'N/A'}</td></tr>
    <tr><th>Nationality</th><td>${app.nationality || 'Ugandan'}</td></tr>
    <tr><th>District</th><td>${app.district || 'N/A'}</td></tr>
    <tr><th>Phone</th><td>${app.phone}</td></tr>
    <tr><th>Email</th><td>${app.email}</td></tr>
  </table>

  <div class="section-title">Requirements for Verification &amp; Enrollment</div>
  <ol class="requirements">
    <li>Carry <strong>original documents</strong> for verification:
      <ul>
        <li>National ID / Passport</li>
        <li>Academic Certificates &amp; Transcripts</li>
        <li>Passport Photographs (2 copies)</li>
      </ul>
    </li>
    <li>At least <strong>60% of tuition fees</strong> must be paid before reporting.</li>
    <li>Report on the date specified in the <strong>official admission letter</strong> that will be issued after verification.</li>
  </ol>

  <div class="payment-box">
    <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#78716c;">SchoolPay Payment Code</div>
    <div class="code">${spCode}</div>
    <div class="amount">${formatCurrency(fee)}</div>
    <div style="font-size:12px; color:#78716c; margin-top:8px;">
      Dial <strong>*210#</strong> on MTN or <strong>*185#</strong> on Airtel, enter the code above, and follow the prompts.
    </div>
  </div>

  <div class="note">
    <strong>NOTE:</strong> This is a <em>temporary</em> admission letter. Your admission is subject to
    verification of submitted documents and payment of the required fees. An official
    admission letter will be issued upon successful verification.
  </div>

  <div class="footer">
    <p><strong>Issued by the Admissions Office</strong></p>
    <p>St. Kizito's Technical Institute – Madera, Soroti City, Uganda</p>
  </div>
</body>
</html>`;

  // ── Plain-text version ──
  const text = `
════════════════════════════════════════════════════════
        ST. KIZITO'S TECHNICAL INSTITUTE – MADERA
           P.O. BOX 320, SOROTI, UGANDA
     Tel: +256 752 309 660 | Email: stkizitmad@gmail.com
════════════════════════════════════════════════════════

               TEMPORARY ADMISSION LETTER

Reference Number:    ${app.referenceNumber}
Date of Issue:       ${issueDate}

Dear ${app.fullName},

Congratulations! Your application to St. Kizito's Technical
Institute – Madera has been received and is being processed.

APPLICANT DETAILS
─────────────────────────────────────────────────────────
  Full Name:      ${app.fullName}
  Programme:      ${app.programme || 'N/A'}
  Intake Year:    ${app.intakeYear || 'N/A'}
  Date of Birth:  ${app.dob || 'N/A'}
  Gender:         ${app.gender || 'N/A'}
  Nationality:    ${app.nationality || 'Ugandan'}
  District:       ${app.district || 'N/A'}
  Phone:          ${app.phone}
  Email:          ${app.email}

REQUIREMENTS FOR VERIFICATION & ENROLLMENT
─────────────────────────────────────────────────────────
1. Carry original documents for verification:
   - National ID / Passport
   - Academic Certificates & Transcripts
   - Passport Photographs (2 copies)

2. At least 60% of tuition fees must be paid before reporting.

3. Report on the date specified in the official admission letter.

PAYMENT INFORMATION
─────────────────────────────────────────────────────────
  SchoolPay Code: ${spCode}
  Amount to Pay:  ${formatCurrency(fee)}

  Dial *210# on MTN or *185# on Airtel, enter the code above,
  and follow the prompts.

NOTE: This is a TEMPORARY admission letter. Your admission
is subject to verification of submitted documents and payment
of the required fees. An official admission letter will be
issued upon successful verification.

─────────────────────────────────────────────────────────
Issued by the Admissions Office
St. Kizito's Technical Institute – Madera
Soroti City, Uganda
════════════════════════════════════════════════════════`;

  return { html, text, schoolpayCode: spCode, fee };
}
