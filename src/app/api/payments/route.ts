import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initiateDemoPayment, verifyDemoPayment, generateTransactionRef } from '@/lib/schoolpay';
import { getSession, hasMinRole, forbidden, unauthorized } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, referenceNumber, fullName, phone, email, amount, programme, intakeYear } = body;

    if (action === 'initiate') {
      if (!referenceNumber || !fullName || !phone || !amount) {
        return NextResponse.json(
          { success: false, message: 'Missing required payment fields' },
          { status: 400 }
        );
      }

      const transactionRef = generateTransactionRef();

      // Create payment record in DB
      await db.payment.create({
        data: {
          transactionRef,
          applicationRef: referenceNumber,
          fullName,
          phone,
          email: email || '',
          amount,
          status: 'pending',
          paymentMethod: 'schoolpay',
          schoolpayTxRef: null,
          schoolpayStatus: 'initiated',
        },
      });

      // Initiate SchoolPay payment (demo mode)
      const schoolpayResult = await initiateDemoPayment({
        fullName,
        phone,
        email: email || '',
        amount,
        referenceNumber,
        programme: programme || '',
        intakeYear: intakeYear || '',
      });

      // Update payment with SchoolPay ref
      await db.payment.update({
        where: { transactionRef },
        data: {
          schoolpayTxRef: schoolpayResult.transactionRef,
        },
      });

      return NextResponse.json({
        success: true,
        message: schoolpayResult.message,
        isDemoMode: schoolpayResult.isDemoMode,
        demoMessage: schoolpayResult.demoMessage,
        data: {
          transactionRef,
          paymentUrl: schoolpayResult.paymentUrl,
          schoolpayTxRef: schoolpayResult.transactionRef,
          amount,
          referenceNumber,
        },
      });
    }

    if (action === 'verify') {
      const { transactionRef: txRef } = body;
      if (!txRef) {
        return NextResponse.json(
          { success: false, message: 'Transaction reference is required' },
          { status: 400 }
        );
      }

      const result = await verifyDemoPayment(txRef);

      // Update payment record
      if (result.success) {
        await db.payment.update({
          where: { transactionRef: txRef },
          data: {
            status: 'successful',
            schoolpayStatus: 'successful',
            paidAt: new Date(),
          },
        });

        // Update application payment status
        if (body.referenceNumber) {
          await db.admissionApplication.updateMany({
            where: { referenceNumber: body.referenceNumber },
            data: {
              paymentStatus: 'paid',
              paymentRef: txRef,
              paidAt: new Date(),
              paymentMethod: 'schoolpay',
            },
          });
        }
      } else {
        await db.payment.update({
          where: { transactionRef: txRef },
          data: {
            status: 'failed',
            schoolpayStatus: 'failed',
          },
        });
      }

      return NextResponse.json({
        success: result.success,
        status: result.status,
        message: result.success
          ? 'Payment verified successfully! Your admission is confirmed.'
          : 'Payment verification failed. Please try again or contact admissions.',
      });
    }

    // SchoolPay callback (webhook from SchoolPay in production)
    if (action === 'callback') {
      console.warn('[PAYMENT CALLBACK] Webhook signature verification not implemented. Requiring auth as fallback.');
      const session = await getSession();
      if (!session) return unauthorized();

      const { transactionRef: cbTxRef, status: cbStatus, amount: cbAmount } = body;

      const payment = await db.payment.findUnique({
        where: { transactionRef: cbTxRef },
      });

      if (!payment) {
        return NextResponse.json(
          { success: false, message: 'Payment not found' },
          { status: 404 }
        );
      }

      await db.payment.update({
        where: { transactionRef: cbTxRef },
        data: {
          status: cbStatus === 'success' ? 'successful' : 'failed',
          schoolpayStatus: cbStatus,
          paidAt: cbStatus === 'success' ? new Date() : null,
        },
      });

      if (cbStatus === 'success' && payment.applicationRef) {
        await db.admissionApplication.updateMany({
          where: { referenceNumber: payment.applicationRef },
          data: {
            paymentStatus: 'paid',
            paymentRef: cbTxRef,
            paymentAmount: cbAmount || payment.amount,
            paidAt: new Date(),
            paymentMethod: 'schoolpay',
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Callback processed' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action. Use: initiate, verify, or callback' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment error:', msg);
    return NextResponse.json(
      { success: false, message: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!hasMinRole(session, 'admissions-staff')) return forbidden();

    const payments = await db.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalRevenue = payments
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      success: true,
      data: payments,
      summary: {
        total: payments.length,
        successful: payments.filter(p => p.status === 'successful').length,
        failed: payments.filter(p => p.status === 'failed').length,
        pending: payments.filter(p => p.status === 'pending').length,
        totalRevenue,
        totalPending,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch payments error:', msg);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
