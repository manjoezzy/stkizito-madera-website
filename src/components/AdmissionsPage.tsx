'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  PenLine,
  FileCheck,
  SearchCheck,
  CreditCard,
  GraduationCap,
  CheckCircle,
  CircleCheckBig,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  Check,
  User,
  Contact,
  BookOpen,
  Briefcase,
  Wallet,
  ShieldCheck,
  BadgeCheck,
  CircleDot,
  Home,
  HelpCircle,
  Building2,
  Wrench,
  Zap,
  Droplets,
  Cog,
  TreePine,
  Scissors,
  UtensilsCrossed,
  UserCheck,
  FileText,
  Download,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PROGRAMME_FEES, getProgrammeFee, formatCurrency } from '@/lib/schoolpay';
import { useAppStore } from '@/store/useAppStore';

/* ──────────────── constants ──────────────── */

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const PROCESS_STEPS = [
  { icon: ClipboardList, label: 'Obtain Form' },
  { icon: PenLine, label: 'Fill Details' },
  { icon: FileCheck, label: 'Submit Documents' },
  { icon: SearchCheck, label: 'Assessment' },
  { icon: CreditCard, label: 'Payment via SchoolPay' },
  { icon: GraduationCap, label: 'Join SKTIM' },
];

const FORM_STEPS_META = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Contact & Location', icon: Contact },
  { id: 3, label: 'Academic Background', icon: BookOpen },
  { id: 4, label: 'Programme Selection', icon: Briefcase },
  { id: 5, label: 'Payment', icon: Wallet },
];

const PROGRAMME_OPTIONS = [
  {
    group: 'National Certificates (2 years)',
    programmes: [
      { value: 'Building Construction', label: 'Building Construction', icon: Building2 },
      { value: 'Automotive Mechanics', label: 'Automotive Mechanics', icon: Wrench },
      { value: 'Electrical Installation', label: 'Electrical Installation', icon: Zap },
      { value: 'Plumbing', label: 'Plumbing', icon: Droplets },
      { value: 'Machining and Fitting', label: 'Machining and Fitting', icon: Cog },
      { value: 'Woodwork Technology', label: 'Woodwork Technology', icon: TreePine },
      { value: 'Fashion and Design', label: 'Fashion and Design', icon: Scissors },
    ],
  },
  {
    group: 'Vocational Skills (3–6 months)',
    programmes: [
      { value: 'Short Course - Electrical', label: 'Basic Electrical Skills', icon: Zap },
      { value: 'Short Course - Tailoring', label: 'Tailoring & Garment Construction', icon: Scissors },
      { value: 'Short Course - Motor Vehicle', label: 'Motor Vehicle Repair', icon: Wrench },
      { value: 'Short Course - Catering', label: 'Catering & Hotel Management', icon: UtensilsCrossed },
    ],
  },
];

interface FormData {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  religion: string;
  nin: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  lastSchool: string;
  yearCompleted: string;
  qualification: string;
  programme: string;
  intakeYear: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  dob: '',
  gender: '',
  nationality: 'Ugandan',
  religion: '',
  nin: '',
  phone: '',
  email: '',
  district: '',
  address: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  lastSchool: '',
  yearCompleted: '',
  qualification: '',
  programme: '',
  intakeYear: '2025/2026',
};

/* ──────────────── component ──────────────── */

export default function AdmissionsPage() {
  const { addToast, setCurrentPage } = useAppStore();

  const [nonFormalFormUrl, setNonFormalFormUrl] = useState<string | null>(null);
  const [tvetFormUrl, setTvetFormUrl] = useState<string>('/forms/tvet-admission-form.pdf');
  useEffect(() => {
    Promise.all([
      fetch('/api/settings?key=non_formal_form_url').then((r) => r.json()),
      fetch('/api/settings?key=tvet_form_url').then((r) => r.json()),
    ]).then(([nf, tf]) => {
      if (nf.value) setNonFormalFormUrl(nf.value);
      if (tf.value) setTvetFormUrl(tf.value);
    }).catch(() => {});
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'dialog' | 'verifying' | 'success' | 'failed'>('idle');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const selectedProgrammeFee = form.programme ? getProgrammeFee(form.programme) : 0;

  /* ──────── validation ──────── */

  const validateStep = (step: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.dob) e.dob = 'Date of birth is required';
      if (!form.gender) e.gender = 'Gender is required';
      if (!form.nationality.trim()) e.nationality = 'Nationality is required';
    }

    if (step === 2) {
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit phone number';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    }

    if (step === 3) {
      if (!form.qualification) e.qualification = 'Select your highest qualification';
    }

    if (step === 4) {
      if (!form.programme) e.programme = 'Select a programme';
      if (!form.intakeYear) e.intakeYear = 'Select intake year';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 4) {
      handleSubmitApplication();
    } else {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
  };

  const goPrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  /* ──────── submit application (step 4 → step 5) ──────── */

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setReferenceNumber(data.data.referenceNumber);
        setCurrentStep(5);
        addToast('Application submitted successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to submit application', 'error');
      }
    } catch {
      addToast('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ──────── SchoolPay payment ──────── */

  const handleInitiatePayment = async () => {
    setPaymentError('');
    setPaymentStatus('initiating');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate',
          referenceNumber,
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          amount: selectedProgrammeFee,
          programme: form.programme,
          intakeYear: form.intakeYear,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setTransactionRef(data.data.transactionRef);
        setPaymentStatus('dialog');
      } else {
        setPaymentError(data.message || 'Payment initiation failed');
        setPaymentStatus('idle');
      }
    } catch {
      setPaymentError('Network error. Please try again.');
      setPaymentStatus('idle');
    }
  };

  const handleSimulatePayment = async () => {
    setPaymentStatus('verifying');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          transactionRef,
          referenceNumber,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPaymentStatus('success');
        addToast('Payment verified! Admission confirmed.', 'success');
      } else {
        setPaymentStatus('failed');
        setPaymentError(data.message || 'Payment verification failed.');
        addToast(data.message || 'Payment verification failed.', 'error');
      }
    } catch {
      setPaymentStatus('failed');
      setPaymentError('Network error during verification.');
    }
  };

  /* ──────── form field renderer ──────── */

  const fieldClass = 'w-full';

  const renderField = (field: keyof FormData, label: string, type = 'text', placeholder = '') => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={field}
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={(e) => updateField(field, e.target.value)}
        className={`${fieldClass} ${errors[field] ? 'border-red-400 focus-visible:ring-red-200' : ''}`}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  /* ──────── step content ──────── */

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-500 mt-1">Provide your personal details as they appear on your identification documents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('fullName', 'Full Name *', 'text', 'e.g. Okello John Peter')}
              {renderField('dob', 'Date of Birth *', 'date')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                  <SelectTrigger className={`${fieldClass} ${errors.gender ? 'border-red-400' : ''}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
              </div>

              {renderField('nationality', 'Nationality *', 'text', 'e.g. Ugandan')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Religion</Label>
                <Select value={form.religion} onValueChange={(v) => updateField('religion', v)}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select religion (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Catholic">Catholic</SelectItem>
                    <SelectItem value="Anglican">Anglican</SelectItem>
                    <SelectItem value="Orthodox">Orthodox</SelectItem>
                    <SelectItem value="Pentecostal">Pentecostal</SelectItem>
                    <SelectItem value="Muslim">Muslim</SelectItem>
                    <SelectItem value="Seventh Day Adventist">Seventh Day Adventist</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderField('nin', 'National Identification Number (NIN)', 'text', 'e.g. CFXXXXXXXXXXXX')}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">Contact & Location</h3>
              <p className="text-sm text-gray-500 mt-1">How can we reach you? Provide accurate contact details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('phone', 'Phone Number *', 'tel', 'e.g. 0771234567')}
              {renderField('email', 'Email Address *', 'email', 'e.g. okello@email.com')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">District</Label>
                <Select value={form.district} onValueChange={(v) => updateField('district', v)}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select district (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amuru">Amuru</SelectItem>
                    <SelectItem value="Gulu">Gulu</SelectItem>
                    <SelectItem value="Kitgum">Kitgum</SelectItem>
                    <SelectItem value="Lamwo">Lamwo</SelectItem>
                    <SelectItem value="Nwoya">Nwoya</SelectItem>
                    <SelectItem value="Omoro">Omoro</SelectItem>
                    <SelectItem value="Pader">Pader</SelectItem>
                    <SelectItem value="Agago">Agago</SelectItem>
                    <SelectItem value="Kampala">Kampala</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderField('address', 'Physical Address', 'text', 'e.g. Pader Town Council')}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <UserCheck className="size-4" style={{ color: PRIMARY }} />
                Emergency Contact / Next of Kin
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('nextOfKin', 'Next of Kin Name', 'text', 'e.g. Atoo Mary')}
                {renderField('nextOfKinPhone', 'Next of Kin Phone', 'tel', 'e.g. 0781234567')}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">Academic Background</h3>
              <p className="text-sm text-gray-500 mt-1">Tell us about your education history.</p>
            </div>

            {renderField('lastSchool', 'Last School Attended', 'text', 'e.g. St. Joseph\'s College Layibi')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('yearCompleted', 'Year Completed', 'text', 'e.g. 2024')}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Highest Qualification *</Label>
                <Select value={form.qualification} onValueChange={(v) => updateField('qualification', v)}>
                  <SelectTrigger className={`${fieldClass} ${errors.qualification ? 'border-red-400' : ''}`}>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLE">PLE (Primary Leaving Examination)</SelectItem>
                    <SelectItem value="UCE">UCE (Uganda Certificate of Education)</SelectItem>
                    <SelectItem value="UACE">UACE (Uganda Advanced Certificate of Education)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">Programme Selection</h3>
              <p className="text-sm text-gray-500 mt-1">Choose your desired programme of study.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Programme *</Label>
              <Select value={form.programme} onValueChange={(v) => updateField('programme', v)}>
                <SelectTrigger className={`w-full ${errors.programme ? 'border-red-400' : ''}`}>
                  <SelectValue placeholder="Select a programme" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMME_OPTIONS.map((group) => (
                    <SelectGroup key={group.group}>
                      <SelectLabel className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        {group.group}
                      </SelectLabel>
                      {group.programmes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {errors.programme && <p className="text-xs text-red-500 mt-1">{errors.programme}</p>}
            </div>

            {form.programme && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-800">Selected Programme</p>
                    <p className="text-lg font-bold mt-1" style={{ color: PRIMARY }}>
                      {form.programme}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-700">Tuition Fee</p>
                    <p className="text-2xl font-bold" style={{ color: GOLD }}>
                      {formatCurrency(selectedProgrammeFee)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Intake Year *</Label>
              <Select value={form.intakeYear} onValueChange={(v) => updateField('intakeYear', v)}>
                <SelectTrigger className={`w-full ${errors.intakeYear ? 'border-red-400' : ''}`}>
                  <SelectValue placeholder="Select intake year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                </SelectContent>
              </Select>
              {errors.intakeYear && <p className="text-xs text-red-500 mt-1">{errors.intakeYear}</p>}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {paymentStatus === 'success' ? (
              renderPaymentSuccess()
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Complete Your Payment</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Pay the admission fee via SchoolPay to confirm your place.
                  </p>
                </div>

                <div className="rounded-xl border-2 shadow-lg overflow-hidden"
                  style={{ borderColor: GOLD }}
                >
                  <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                        <CreditCard className="size-5" style={{ color: PRIMARY }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">SchoolPay Payment</p>
                        <p className="text-xs opacity-80">Secure payment powered by SchoolPay Uganda</p>
                      </div>
                      <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
                        {form.intakeYear}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4 bg-white">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Reference Number</span>
                      <span className="font-mono font-bold text-sm" style={{ color: PRIMARY }}>{referenceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Applicant</span>
                      <span className="font-medium text-sm text-gray-900">{form.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Programme</span>
                      <span className="font-medium text-sm text-gray-900">{form.programme}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="font-medium text-sm text-gray-900">{form.phone}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-base font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-extrabold" style={{ color: GOLD }}>
                        {formatCurrency(selectedProgrammeFee)}
                      </span>
                    </div>

                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        {paymentError}
                      </div>
                    )}

                    {paymentStatus === 'idle' && (
                      <Button
                        onClick={handleInitiatePayment}
                        className="w-full h-12 text-base font-bold cursor-pointer"
                        style={{ background: GOLD, color: PRIMARY }}
                      >
                        <CreditCard className="size-5 mr-2" />
                        Pay with SchoolPay
                      </Button>
                    )}

                    {paymentStatus === 'initiating' && (
                      <div className="flex items-center justify-center gap-3 py-4">
                        <Loader2 className="size-5 animate-spin" style={{ color: PRIMARY }} />
                        <span className="text-sm font-medium text-gray-600">Initiating payment...</span>
                      </div>
                    )}

                    {paymentStatus === 'failed' && (
                      <Button
                        onClick={handleInitiatePayment}
                        variant="outline"
                        className="w-full cursor-pointer"
                      >
                        <ArrowRight className="size-4 mr-2" />
                        Retry Payment
                      </Button>
                    )}
                  </CardContent>
                </div>
              </>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderPaymentSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mx-auto size-24 rounded-full flex items-center justify-center"
        style={{ background: '#dcfce7' }}
      >
        <CheckCircle className="size-14 text-green-500" strokeWidth={2.5} />
      </motion.div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
        <p className="text-gray-500 mt-2">
          Your admission fee has been received. Welcome to St. Kizito's Technical Institute - Madera!
        </p>
      </div>

      <div className="mx-auto max-w-md rounded-xl border-2 border-green-200 bg-green-50 p-6">
        <p className="text-sm text-green-700 font-medium">Your Admission Reference</p>
        <p className="text-3xl font-extrabold font-mono mt-2" style={{ color: PRIMARY }}>
          {referenceNumber}
        </p>
        <p className="text-xs text-green-600 mt-2">
          Please save this reference number. You will need it for all future correspondence.
        </p>
      </div>

      <Button
        onClick={() => setCurrentPage('home')}
        className="h-12 px-8 text-base font-semibold cursor-pointer"
        style={{ background: PRIMARY }}
      >
        <Home className="size-5 mr-2" />
        Back to Home
      </Button>
    </motion.div>
  );

  /* ──────── payment simulation dialog ──────── */

  const renderPaymentDialog = () => {
    if (paymentStatus !== 'dialog') return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => {}}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                <ShieldCheck className="size-4" style={{ color: PRIMARY }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">DEMO: SchoolPay Payment Gateway</p>
                <p className="text-white/70 text-xs">Simulated payment environment</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentStatus('idle')}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500">Amount to Pay</p>
              <p className="text-3xl font-extrabold" style={{ color: GOLD }}>
                {formatCurrency(selectedProgrammeFee)}
              </p>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono font-medium text-gray-900">{referenceNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction</span>
                <span className="font-mono font-medium text-gray-900 text-xs">{transactionRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone Number</span>
                <span className="font-medium text-gray-900">{form.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Programme</span>
                <span className="font-medium text-gray-900">{form.programme}</span>
              </div>
            </div>

            <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-700">
                <BadgeCheck className="size-4 inline-block mr-1" />
                This is a demo. In production, you would be redirected to the SchoolPay gateway to complete payment via MTN MoMo, Airtel Money, or card.
              </p>
            </div>

            <Button
              onClick={handleSimulatePayment}
              disabled={paymentStatus === 'verifying'}
              className="w-full h-12 text-base font-bold cursor-pointer"
              style={{ background: GOLD, color: PRIMARY }}
            >
              {paymentStatus === 'verifying' ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="size-5 mr-2" />
                  Simulate Successful Payment
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  /* ──────── completed step indicator for sidebar ──────── */

  const isStepCompleted = (step: number) => {
    if (step === 1) return !!(form.fullName && form.dob && form.gender);
    if (step === 2) return !!(form.phone && form.email);
    if (step === 3) return !!form.qualification;
    if (step === 4) return !!(form.programme && form.intakeYear);
    if (step === 5) return paymentStatus === 'success';
    return false;
  };

  /* ──────── main render ──────── */

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══════════ PAGE HEADER ═══════════ */}
      <header
        className="pt-24 pb-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, ${PRIMARY} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 size-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              className="mb-4 text-xs font-semibold px-4 py-1.5"
              style={{ background: GOLD, color: PRIMARY, borderColor: 'transparent' }}
            >
              <GraduationCap className="size-3.5 mr-1.5" />
              Now Open for 2025/2026 Intake
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Admissions
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Begin your journey at St. Kizito&apos;s Technical Institute — Madera. Apply online, pay securely via SchoolPay, and join a legacy of excellence in technical education.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══════════ PROCESS STEPS ═══════════ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Admission Process</h2>
              <p className="text-gray-500 mt-2">Follow these simple steps to secure your admission</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className="size-16 rounded-full flex items-center justify-center relative mb-3"
                      style={{ border: `3px solid ${GOLD}`, background: `${PRIMARY}10` }}
                    >
                      <Icon className="size-6" style={{ color: PRIMARY }} />
                      <span
                        className="absolute -top-1 -right-1 size-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: GOLD, color: PRIMARY }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{step.label}</p>
                    {i < PROCESS_STEPS.length - 1 && (
                      <ChevronRight className="size-4 text-gray-300 mt-2 hidden lg:block absolute right-0 top-1/2 -translate-y-1/2" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ ENTRY REQUIREMENTS ═══════════ */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Entry Requirements</h2>
              <p className="text-gray-500 mt-2">Check the requirements for your preferred programme</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: National Certificates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="h-full border-t-4 hover:shadow-lg transition-shadow duration-300"
                  style={{ borderTopColor: PRIMARY }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${PRIMARY}15` }}>
                        <Award className="size-5" style={{ color: PRIMARY }} />
                      </div>
                      <CardTitle className="text-lg">National Certificates</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">UCE certificate with at least <strong>3 credits</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">Minimum age of <strong>16 years</strong> at time of admission</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">Duration: <strong>2 years</strong></p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 2: Vocational Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="h-full border-t-4 hover:shadow-lg transition-shadow duration-300"
                  style={{ borderTopColor: GOLD }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}20` }}>
                        <BadgeCheck className="size-5" style={{ color: GOLD }} />
                      </div>
                      <CardTitle className="text-lg">Vocational Skills</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600"><strong>Open to all</strong> — no formal academic requirements</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600"><strong>No age limit</strong> — everyone is welcome</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">Duration: <strong>3–6 months</strong></p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 3: Required Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="h-full border-t-4 hover:shadow-lg transition-shadow duration-300"
                  style={{ borderTopColor: '#e11d48' }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg flex items-center justify-center bg-red-50">
                        <FileText className="size-5 text-red-500" />
                      </div>
                      <CardTitle className="text-lg">Required Documents</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CircleDot className="size-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">Academic <strong>certificates & transcripts</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CircleDot className="size-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600"><strong>NIN</strong> or Birth Certificate</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CircleDot className="size-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600"><strong>3 passport-size</strong> photographs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CircleDot className="size-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600"><strong>Recommendation letter</strong> from former school or LC1</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ DOWNLOAD APPLICATION FORMS ═══════════ */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900">Download Application Forms</h2>
              <p className="text-gray-500 mt-2">
                Download the appropriate form, fill it in, and submit it to the admissions office.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Formal (TVET) Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">Formal Admission Form</h3>
                        <p className="text-xs text-gray-400 mt-0.5">National Certificate &amp; Diploma Programmes</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      This is the official TVET admission form for government-recognised programmes
                      (2-year certificates and diplomas). Provided by the Ministry of Education &amp; Sports.
                    </p>
                    <div className="mt-6">
                      <a
                        href={tvetFormUrl}
                        download
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <Download className="w-4 h-4" />
                        Download TVET Form (PDF)
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Non-Formal Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#fef9e7' }}
                      >
                        <FileText className="w-6 h-6" style={{ color: '#92640a' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">Non-Formal Admission Form</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Short Courses &amp; Vocational Skills</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      This form is for short courses (3–6 months) and vocational skills programmes.
                      Provided by St. Kizito&apos;s Technical Institute - Madera.
                    </p>
                    <div className="mt-6">
                      {nonFormalFormUrl ? (
                        <a
                          href={nonFormalFormUrl}
                          download
                          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                          style={{ backgroundColor: '#f5c518', color: '#1a3a6b' }}
                        >
                          <Download className="w-4 h-4" />
                          Download Non-Formal Form
                        </a>
                      ) : (
                        <div
                          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400"
                        >
                          <FileText className="w-4 h-4" />
                          Form Not Yet Available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              You may also apply online using the form below, or visit the admissions office in person.
            </p>
          </div>
        </section>

        {/* ═══════════ ONLINE APPLICATION FORM ═══════════ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Online Application Form</h2>
              <p className="text-gray-500 mt-2">Complete all steps to submit your application</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* ──── LEFT SIDEBAR: Step Indicator ──── */}
                <aside
                  className="lg:w-64 shrink-0 p-6 lg:p-8 lg:border-r border-b lg:border-b-0 border-gray-100"
                  style={{ background: `linear-gradient(180deg, ${PRIMARY}08, white)` }}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
                    Application Steps
                  </h3>
                  <nav className="space-y-1">
                    {FORM_STEPS_META.map((step) => {
                      const Icon = step.icon;
                      const active = currentStep === step.id;
                      const completed = isStepCompleted(step.id);
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => {
                            if (step.id < currentStep || completed) setCurrentStep(step.id);
                          }}
                          disabled={step.id > currentStep && !completed}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                            active
                              ? 'text-white shadow-md'
                              : completed
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-gray-400'
                          }`}
                          style={
                            active
                              ? { background: PRIMARY }
                              : undefined
                          }
                        >
                          <div
                            className={`size-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                              active
                                ? 'border-white bg-white/20'
                                : completed
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {completed && !active ? (
                              <Check className="size-4 text-green-500" />
                            ) : (
                              <Icon className={`size-3.5 ${active ? 'text-white' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <span className="text-sm font-medium leading-tight">{step.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  {/* Mobile step indicator */}
                  <div className="lg:hidden mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      {FORM_STEPS_META.map((step) => (
                        <div key={step.id} className="flex-1 flex justify-center">
                          <div
                            className={`size-3 rounded-full transition-colors ${
                              currentStep === step.id
                                ? 'ring-2 ring-offset-2'
                                : isStepCompleted(step.id)
                                ? 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                            style={
                              currentStep === step.id
                                ? { background: GOLD, ringColor: GOLD }
                                : undefined
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Step {currentStep} of 5
                    </p>
                  </div>
                </aside>

                {/* ──── RIGHT CONTENT AREA ──── */}
                <div className="flex-1 p-6 sm:p-8 lg:p-10 min-h-[480px]">
                  <AnimatePresence mode="wait">
                    {renderStepContent()}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  {paymentStatus !== 'success' && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={goPrev}
                        disabled={currentStep === 1}
                        className="cursor-pointer disabled:opacity-40"
                      >
                        <ChevronLeft className="size-4 mr-1" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {FORM_STEPS_META.map((step) => (
                          <div
                            key={step.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              step.id === currentStep
                                ? 'w-8'
                                : step.id < currentStep
                                ? 'w-4 bg-green-400'
                                : 'w-4 bg-gray-200'
                            }`}
                            style={step.id === currentStep ? { background: GOLD } : undefined}
                          />
                        ))}
                      </div>

                      {currentStep < 5 && (
                        <Button
                          onClick={goNext}
                          disabled={submitting}
                          className="cursor-pointer"
                          style={{ background: PRIMARY }}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : currentStep === 4 ? (
                            <>
                              Submit Application
                              <ArrowRight className="size-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Next
                              <ChevronRight className="size-4 ml-1" />
                            </>
                          )}
                        </Button>
                      )}
                      {currentStep === 5 && paymentStatus === 'idle' && (
                        <div />
                      )}
                      {currentStep === 5 && (paymentStatus === 'failed' || paymentStatus === 'dialog') && (
                        <div />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ NEED HELP SECTION ═══════════ */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
            >
              <div className="p-8 sm:p-12 text-center relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 size-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
                </div>
                <div className="relative z-10">
                  <div className="mx-auto size-14 rounded-full flex items-center justify-center mb-4" style={{ background: GOLD }}>
                    <HelpCircle className="size-7" style={{ color: PRIMARY }} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Need Help With Your Application?</h2>
                  <p className="text-blue-100 max-w-xl mx-auto mb-8">
                    Our admissions team is here to assist you every step of the way. Reach out to us through any of the channels below.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <Phone className="size-6 mx-auto mb-2" style={{ color: GOLD }} />
                      <p className="text-white font-semibold text-sm">Call Us</p>
                      <p className="text-blue-200 text-sm mt-1">+256 752 309 660</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <Mail className="size-6 mx-auto mb-2" style={{ color: GOLD }} />
                      <p className="text-white font-semibold text-sm">Email</p>
                      <p className="text-blue-200 text-sm mt-1">stkizitmad@gmail.com</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <MapPin className="size-6 mx-auto mb-2" style={{ color: GOLD }} />
                      <p className="text-white font-semibold text-sm">Visit Us</p>
                      <p className="text-blue-200 text-sm mt-1">Madera, Soroti City</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-6 text-blue-200 text-sm">
                    <Clock className="size-4" style={{ color: GOLD }} />
                    Office Hours: Mon–Fri, 8:00 AM – 5:00 PM
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══════════ PAYMENT DIALOG OVERLAY ═══════════ */}
      <AnimatePresence>
        {renderPaymentDialog()}
      </AnimatePresence>
    </div>
  );
}
