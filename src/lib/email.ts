import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const user = process.env.GMAIL_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass || pass === 'your-app-password-here') {
    console.warn('[email] Gmail credentials not configured. Email sending disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  return transporter;
}

export interface SendReplyOptions {
  to: string;
  subject: string;
  replyBody: string;
  originalName: string;
  originalMessage: string;
  originalSubject?: string;
}

export async function sendReplyEmail(opts: SendReplyOptions): Promise<{ success: boolean; error?: string }> {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email not configured. Set GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env' };
  }

  const fromName = 'St. Kizito\'s Technical Institute - Madera';
  const emailSubject = opts.originalSubject
    ? `Re: ${opts.originalSubject}`
    : opts.subject;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a3a6b; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">${fromName}</h2>
        <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">Soroti City, Uganda</p>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="color: #334155; margin-bottom: 16px;">Dear ${opts.originalName},</p>
        <div style="color: #1e293b; line-height: 1.7; white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #1a3a6b;">${opts.replyBody}</div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">--- Original Message ---</p>
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;"><strong>From:</strong> ${opts.originalName} &lt;${opts.to}&gt;</p>
          ${opts.originalSubject ? `<p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;"><strong>Subject:</strong> ${opts.originalSubject}</p>` : ''}
          <p style="color: #94a3b8; font-size: 13px; white-space: pre-wrap; margin: 8px 0 0; padding: 12px; background: #f1f5f9; border-radius: 6px;">${opts.originalMessage}</p>
        </div>
      </div>
      <div style="background: #f8fafc; padding: 16px 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">${fromName} | Soroti City, Uganda</p>
        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Tel: +256 752 309 660 | Email: stkizitmad@gmail.com</p>
      </div>
    </div>
  `;

  try {
    await transport.sendMail({
      from: `"${fromName}" <${process.env.GMAIL_ADDRESS}>`,
      to: opts.to,
      subject: emailSubject,
      html: htmlBody,
      replyTo: process.env.GMAIL_ADDRESS,
    });
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[email] Failed to send reply:', msg);
    return { success: false, error: msg };
  }
}

export function isEmailConfigured(): boolean {
  const pass = process.env.GMAIL_APP_PASSWORD;
  return !!(process.env.GMAIL_ADDRESS && pass && pass !== 'your-app-password-here');
}
