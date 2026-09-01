import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hasMinRole, unauthorized, forbidden } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const { searchParams } = request.nextUrl;
    const format = searchParams.get('format') || 'xlsx';
    const year = searchParams.get('year') || '';
    const programme = searchParams.get('programme') || '';

    // Build where clause
    const where: Record<string, unknown> = {};
    if (year) where.graduationYear = year;
    if (programme) where.programme = programme;

    // Fetch all matching alumni (no pagination for export)
    const alumni = await db.alumni.findMany({
      where,
      orderBy: [{ graduationYear: 'desc' }, { fullName: 'asc' }],
    });

    if (alumni.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No alumni data to export.' },
        { status: 404 }
      );
    }

    const subtitle = year ? `Class of ${year}` : programme ? programme : 'All Alumni';
    const safeName = subtitle.replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'pdf') {
      const pdfBuffer = await buildPDF(alumni, subtitle);
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="SKTIM_Alumni_${safeName}.pdf"`,
        },
      });
    }

    // Default: xlsx
    const xlsxBuffer = buildExcel(alumni, subtitle);
    return new NextResponse(xlsxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="SKTIM_Alumni_${safeName}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Alumni export error:', error);
    return NextResponse.json(
      { success: false, message: 'Export failed.' },
      { status: 500 }
    );
  }
}

// ─── Excel Builder ────────────────────────────────────
function buildExcel(alumni: any[], subtitle: string): Buffer {
  const rows = alumni.map((a, i) => ({
    '#': i + 1,
    'Full Name': a.fullName,
    'Email': a.email || '',
    'Phone': a.phone || '',
    'Graduation Year': a.graduationYear || '',
    'Programme': a.programme || '',
    'Occupation': a.occupation || '',
    'Employer': a.employer || '',
    'District': a.district || '',
    'Status': a.isPublished ? 'Published' : 'Draft',
    'Registered': a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-UG') : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 4 }, { wch: 25 }, { wch: 28 }, { wch: 16 },
    { wch: 16 }, { wch: 28 }, { wch: 25 }, { wch: 25 },
    { wch: 16 }, { wch: 10 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, subtitle);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

// ─── PDF Builder ──────────────────────────────────────
async function buildPDF(alumni: any[], subtitle: string): Promise<Buffer> {
  // Dynamic import to avoid issues with pdfkit in edge/serverless
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      info: {
        Title: `SKTIM Alumni - ${subtitle}`,
        Author: "St. Kizito's Technical Institute - Madera",
      },
    });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(16).font('Helvetica-Bold')
      .text("St. Kizito's Technical Institute - Madera", { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(12).font('Helvetica')
      .text(`Alumni Directory - ${subtitle}`, { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor('#666666')
      .text(`Generated: ${new Date().toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}  |  Total: ${alumni.length} alumni`, { align: 'center' });
    doc.moveDown(0.5);

    // Divider line
    doc.strokeColor('#1a3a6b').lineWidth(1.5)
      .moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);

    // Table column positions and headers
    const colX = [40, 58, 190, 280, 320, 390, 445];
    const colHeaders = ['#', 'Full Name', 'Programme', 'Year', 'Occupation', 'Phone', 'District'];
    const rowH = 20;
    const tableW = 515;

    // Draw header row
    const hdrY = doc.y;
    doc.fillColor('#1a3a6b').rect(40, hdrY, tableW, rowH).fill();
    doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');
    colHeaders.forEach((h, i) => {
      doc.text(h, colX[i], hdrY + 5, {
        width: (colX[i + 1] || 555) - colX[i] - 4,
        height: rowH,
        lineBreak: false,
        ellipsis: true,
      });
    });
    doc.y = hdrY + rowH;

    // Data rows
    doc.font('Helvetica').fontSize(6.5);
    alumni.forEach((a, idx) => {
      // New page if needed
      if (doc.y > 730) {
        doc.addPage();
        const ny = doc.y;
        doc.fillColor('#1a3a6b').rect(40, ny, tableW, rowH).fill();
        doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');
        colHeaders.forEach((h, i) => {
          doc.text(h, colX[i], ny + 5, {
            width: (colX[i + 1] || 555) - colX[i] - 4,
            height: rowH,
            lineBreak: false,
            ellipsis: true,
          });
        });
        doc.y = ny + rowH;
        doc.font('Helvetica').fontSize(6.5);
      }

      // Alternating row bg
      const rY = doc.y;
      if (idx % 2 === 1) {
        doc.save().fillColor('#f3f4f6').rect(40, rY, tableW, rowH).fill().restore();
      }

      doc.fillColor('#333333');
      const row = [
        String(idx + 1),
        a.fullName || '',
        a.programme || '',
        a.graduationYear || '',
        a.occupation || '',
        a.phone || '',
        a.district || '',
      ];
      row.forEach((cell, i) => {
        doc.text(cell, colX[i], rY + 5, {
          width: (colX[i + 1] || 555) - colX[i] - 4,
          height: rowH,
          lineBreak: false,
          ellipsis: true,
        });
      });
      doc.y = rY + rowH;
    });

    // Footer
    doc.moveDown(1.5);
    doc.strokeColor('#cccccc').lineWidth(0.5)
      .moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fillColor('#999999').fontSize(7)
      .text('This document was generated from the SKTIM Alumni Database.', { align: 'center' });

    doc.end();
  });
}
