// SchoolPay API Integration Service for St. Kizito's Technical Institute - Madera
// Documentation: https://docs.schoolpay.co.ug

export interface SchoolPayInitRequest {
  fullName: string;
  phone: string;
  email: string;
  amount: number;
  currency?: string;
  referenceNumber: string;
  description?: string;
  programme: string;
  intakeYear: string;
}

export interface SchoolPayInitResponse {
  success: boolean;
  paymentUrl?: string;
  transactionRef: string;
 message: string;
 isError?: boolean;
 isDemoMode?: boolean;
 demoMessage?: string;
  demoData?: {
    transactionRef: string;
    paymentUrl: string;
    referenceNumber: string;
    amount: number;
    fullName: string;
    phone: string;
  };
}

export interface SchoolPayCallbackData {
  transactionRef: string;
  referenceNumber: string;
  status: 'success' | 'failed' | 'pending';
  amount?: number;
  schoolpayTxRef?: string;
  phoneNumber?: string;
  paidAt?: string;
}

export interface SchoolPayVerifyResponse {
  success: boolean;
  status: 'successful' | 'failed' | 'pending';
  amount?: number;
  transactionRef?: string;
}

// Programme fees in UGX
export const PROGRAMME_FEES: Record<string, number> = {
  'Building Construction': 850000,
  'Automotive Mechanics': 900000,
  'Electrical Installation': 850000,
  'Plumbing': 800000,
  'Machining and Fitting': 850000,
  'Woodwork Technology': 800000,
  'Fashion and Design': 750000,
  'Short Course - Electrical': 350000,
  'Short Course - Tailoring': 300000,
  'Short Course - Motor Vehicle': 400000,
  'Short Course - Catering': 350000,
};

export function getProgrammeFee(programme: string): number {
  return PROGRAMME_FEES[programme] || 500000;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' UGX';
}

// Generate unique transaction reference
export function generateTransactionRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SPY-${timestamp}-${random}`;
}

// Generate admission reference number
export function generateAdmissionRef(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 90000) + 10000;
  return `SKT-${year}-${seq}`;
}

/*
 * PRODUCTION SchoolPay API Integration
 * 
 * In production, you would:
 * 1. Set SCHOOLPAY_API_KEY and SCHOOLPAY_MERCHANT_ID in .env
 * 2. Uncomment the production code below
 * 3. Remove the demo mode fallback
 *
 * SchoolPay API endpoints:
 * - Initiate Payment: POST https://api.schoolpay.co.ug/api/v1/payments/initiate
 * - Verify Payment: GET  https://api.schoolpay.co.ug/api/v1/payments/verify/{txRef}
 * - Callback URL:    POST /api/payments/callback (configured in SchoolPay dashboard)
 */

// Production API call (uncomment for real integration)
/*
async function initiateSchoolPayPayment(request: SchoolPayInitRequest): Promise<SchoolPayInitResponse> {
  const apiKey = process.env.SCHOOLPAY_API_KEY;
  const merchantId = process.env.SCHOOLPAY_MERCHANT_ID;
  const callbackUrl = process.env.SCHOOLPAY_CALLBACK_URL || 
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`;

  if (!apiKey || !merchantId) {
    throw new Error('SchoolPay API credentials not configured');
  }

  const payload = {
    merchant_id: merchantId,
    api_key: apiKey,
    transaction_ref: request.referenceNumber,
    amount: request.amount,
    currency: request.currency || 'UGX',
    phone_number: request.phone,
    customer_name: request.fullName,
    customer_email: request.email,
    description: request.description || `Admission Fee - ${request.programme}`,
    callback_url: callbackUrl,
    redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}?page=admissions&status=complete`,
    metadata: {
      referenceNumber: request.referenceNumber,
      programme: request.programme,
      intakeYear: request.intakeYear,
      institution: 'St. Kizitos Technical Institute - Madera',
    },
  };

  const response = await fetch('https://api.schoolpay.co.ug/api/v1/payments/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`SchoolPay API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    success: true,
    paymentUrl: data.payment_url,
    transactionRef: data.transaction_ref || request.referenceNumber,
    message: 'Payment initiated successfully',
  };
}

export async function verifySchoolPayPayment(transactionRef: string): Promise<SchoolPayVerifyResponse> {
  const apiKey = process.env.SCHOOLPAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('SchoolPay API credentials not configured');
  }

  const response = await fetch(
    `https://api.schoolpay.co.ug/api/v1/payments/verify/${transactionRef}`,
    {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    }
  );

  if (!response.ok) {
    throw new Error(`SchoolPay verification error: ${response.status}`);
  }

  const data = await response.json();
  return {
    success: data.status === 'successful',
    status: data.status,
    amount: data.amount,
    transactionRef: data.transaction_ref,
  };
}
*/

// DEMO MODE: Simulates SchoolPay payment flow
// This will be used until real SchoolPay credentials are configured
export async function initiateDemoPayment(request: SchoolPayInitRequest): Promise<SchoolPayInitResponse> {
  const txRef = generateTransactionRef();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    isDemoMode: true,
    demoMessage: 'DEMODE: SchoolPay integration is in demo mode. In production, this will redirect to the real SchoolPay payment gateway for mobile money/card payment.',
    paymentUrl: `#demo-payment?tx=${txRef}&ref=${request.referenceNumber}`,
    transactionRef: txRef,
    message: 'Demo payment initiated. In production, you will be redirected to SchoolPay to complete payment via MTN MoMo, Airtel Money, or card.',
    demoData: {
      transactionRef: txRef,
      paymentUrl: `#demo-payment`,
      referenceNumber: request.referenceNumber,
      amount: request.amount,
      fullName: request.fullName,
      phone: request.phone,
    },
  };
}

export async function verifyDemoPayment(transactionRef: string): Promise<SchoolPayVerifyResponse> {
 await new Promise(resolve => setTimeout(resolve, 800));
  
  // In demo, randomly succeed 90% of the time
  const isSuccess = Math.random() > 0.1;
  return {
    success: isSuccess,
    status: isSuccess ? 'successful' : 'failed',
    amount: 0,
    transactionRef,
  };
}
