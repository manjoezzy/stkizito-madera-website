'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  PenLine,
  FileCheck,
  SearchCheck,
  CreditCard,
  GraduationCap,
  CheckCircle,
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
  Plus,
  Copy,
  Upload,
  Search,
  Users,
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
import { formatCurrency } from '@/lib/schoolpay';
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
  { id: 4, label: 'Programme & Documents', icon: Briefcase },
  { id: 5, label: 'SchoolPay Code', icon: Wallet },
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

const GRADE_OPTIONS = [
  'D1', 'D2', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'P7', 'P8', 'F9', 'U',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'Distinction', 'Credit', 'Pass', 'Fail',
];

const INSTITUTION_LEVELS = [
  'Primary',
  'O-Level (UCE)',
  'A-Level (UACE)',
  'Tertiary/College',
  'Other',
];

const DOCUMENT_TYPES = [
  { key: 'national_id', label: 'National ID / Passport', required: true },
  { key: 'academic_transcript', label: 'Academic Transcripts / Certificates', required: true },
  { key: 'passport_photo', label: 'Passport Photo', required: true },
  { key: 'recommendation_letter', label: 'Recommendation Letter', required: false },
  { key: 'medical_certificate', label: 'Medical Certificate', required: false },
  { key: 'other_certificate', label: 'Other Certificates (e.g. short course certs)', required: false },
] as const;

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
  institutionLevel: string;
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
  institutionLevel: '',
  programme: '',
  intakeYear: '2025/2026',
};

interface GradeRow {
  subject: string;
  grade: string;
}

interface UploadedDoc {
  key: string;
  label: string;
  file: File;
  preview: string;
}

/* ──────────────── component ──────────────── */

export default function AdmissionsPage() {
  const { addToast, setCurrentPage } = useAppStore();

  const [nonFormalFormUrl, setNonFormalFormUrl] = useState<string | null>(null);
  const [tvetFormUrl, setTvetFormUrl] = useState<string | null>(null);
  const [applicationFee, setApplicationFee] = useState<number>(50000);
  useEffect(() => {
    Promise.all([
      fetch('/api/settings?key=non_formal_form_url').then((r) => r.json()),
      fetch('/api/settings?key=tvet_form_url').then((r) => r.json()),
      fetch('/api/settings?key=application_fee').then((r) => r.json()),
    ]).then(([nf, tf, af]) => {
      if (nf.value) setNonFormalFormUrl(nf.value);
      if (tf.value) setTvetFormUrl(tf.value);
      if (af.value) setApplicationFee(parseInt(af.value, 10) || 50000);
    }).catch(() => {});
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [grades, setGrades] = useState<GradeRow[]>([{ subject: '', grade: '' }]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [schoolpayCode, setSchoolpayCode] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  /* ──────── grades management ──────── */

  const addGradeRow = () => {
    setGrades((prev) => [...prev, { subject: '', grade: '' }]);
  };

  const removeGradeRow = (index: number) => {
    setGrades((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGrade = (index: number, field: 'subject' | 'grade', value: string) => {
    setGrades((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  /* ──────── document management ──────── */

  const handleFileSelect = (docType: string, label: string, file: File | null) => {
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      addToast(`File too large. Maximum size is 1.5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`, 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Invalid file type. Upload images, PDFs, or Word documents only.', 'error');
      return;
    }

    setUploadedDocs((prev) => {
      const filtered = prev.filter((d) => d.key !== docType);
      return [...filtered, { key: docType, label, file, preview: `${file.name} (${(file.size / 1024).toFixed(0)} KB)` }];
    });
    setDocErrors((prev) => {
      const next = { ...prev };
      delete next[docType];
      return next;
    });
  };

  const removeDoc = (docType: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.key !== docType));
    if (fileInputRefs.current[docType]) {
      fileInputRefs.current[docType]!.value = '';
    }
  };

  /* ──────── validation ──────── */

  const validateStep = (step: number): boolean => {
    const e: Partial<Record<keyof FormData | string, string>> = {};

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
      if (!form.institutionLevel) e.institutionLevel = 'Select institution level';
    }

    if (step === 4) {
      if (!form.programme) e.programme = 'Select a programme';
      if (!form.intakeYear) e.intakeYear = 'Select intake year';

      // Validate documents (only required ones)
      const de: Record<string, string> = {};
      DOCUMENT_TYPES.forEach((dt) => {
        if (dt.required && !uploadedDocs.find((d) => d.key === dt.key)) {
          de[dt.key] = `${dt.label} is required`;
        }
      });
      setDocErrors(de);
      if (Object.keys(de).length > 0) {
        e._docs = 'Please upload all required documents';
      }
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
      // 1. Upload all files first
      const uploadedUrls: Array<{ fileName: string; fileUrl: string; fileSize: number; documentType: string }> = [];

      for (const doc of uploadedDocs) {
        const formData = new FormData();
        formData.append('file', doc.file);
        formData.append('type', 'admission');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errData.error || `Failed to upload ${doc.label}`);
        }

        const uploadData = await uploadRes.json();
        uploadedUrls.push({
          fileName: uploadData.fileName,
          fileUrl: uploadData.url,
          fileSize: uploadData.fileSize,
          documentType: doc.key,
        });
      }

      // 2. Submit application with form data + grades + uploaded documents
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          grades: grades.filter((g) => g.subject.trim() && g.grade),
          uploadedDocuments: uploadedUrls,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReferenceNumber(data.data.referenceNumber);
        setSchoolpayCode(data.data.schoolpayCode || '');
        setCurrentStep(5);
        addToast('Application submitted successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to submit application', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };


  /* ──────── copy to clipboard ──────── */

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast('Copied to clipboard!', 'success');
    }).catch(() => {
      addToast('Failed to copy', 'error');
    });
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
                    <SelectItem value="Soroti">Soroti</SelectItem>
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

            {renderField('lastSchool', 'Last School Attended', 'text', "e.g. St. Joseph's College Layibi")}

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

            {/* ── Institution Level ── */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Institution Level *</Label>
              <Select value={form.institutionLevel} onValueChange={(v) => updateField('institutionLevel', v)}>
                <SelectTrigger className={`${fieldClass} ${errors.institutionLevel ? 'border-red-400' : ''}`}>
                  <SelectValue placeholder="Select institution level" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.institutionLevel && <p className="text-xs text-red-500 mt-1">{errors.institutionLevel}</p>}
            </div>

            {/* ── Grades Table ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Grades / Results</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGradeRow}
                  className="cursor-pointer text-xs"
                >
                  <Plus className="size-3.5 mr-1" />
                  Add Subject
                </Button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-[1fr_140px_40px] gap-0 bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</span>
                  <span></span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {grades.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_140px_40px] gap-0 border-b border-gray-100 last:border-b-0">
                      <div className="px-1 py-1">
                        <Input
                          placeholder="e.g. Mathematics"
                          value={row.subject}
                          onChange={(e) => updateGrade(idx, 'subject', e.target.value)}
                          className="h-9 text-sm border-0 focus-visible:ring-1 shadow-none"
                        />
                      </div>
                      <div className="px-1 py-1">
                        <Select value={row.grade} onValueChange={(v) => updateGrade(idx, 'grade', v)}>
                          <SelectTrigger className="h-9 text-sm border-0 shadow-none">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_OPTIONS.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-center">
                        {grades.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGradeRow(idx)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">Add your subjects and corresponding grades. This is optional but helps us assess your application.</p>
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
                className="rounded-lg border border-blue-200 bg-blue-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Selected Programme</p>
                    <p className="text-lg font-bold mt-1" style={{ color: PRIMARY }}>
                      {form.programme}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Application Fee</p>
                    <p className="text-xl font-bold" style={{ color: GOLD }}>
                      {formatCurrency(applicationFee)}
                    </p>
                    <p className="text-[10px] text-blue-500 mt-0.5">Non-refundable</p>
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

            {/* ── Document Upload Section ── */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <FileText className="size-4" style={{ color: PRIMARY }} />
                Upload Documents
              </h4>
              <p className="text-xs text-gray-400 mb-4">Upload images, PDFs, or Word documents. Maximum 1.5MB per file. Required documents are marked with *.</p>

              {errors._docs && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                  {errors._docs}
                </div>
              )}

              <div className="space-y-4">
                {DOCUMENT_TYPES.map((dt) => {
                  const existing = uploadedDocs.find((d) => d.key === dt.key);
                  return (
                    <div key={dt.key} className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">
                        {dt.label} {dt.required && <span className="text-red-500">*</span>}
                        {!dt.required && <span className="text-xs text-gray-400 font-normal ml-1.5">(optional)</span>}
                      </Label>

                      {existing ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <CheckCircle className="size-4 text-green-500 shrink-0" />
                          <span className="text-sm text-green-800 flex-1 truncate">{existing.preview}</span>
                          <button
                            type="button"
                            onClick={() => removeDoc(dt.key)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                              docErrors[dt.key] ? 'border-red-300 bg-red-50 hover:border-red-400' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                            onClick={() => fileInputRefs.current[dt.key]?.click()}
                          >
                            <Upload className="size-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Click to upload {dt.label.toLowerCase()}
                            </span>
                            <input
                              ref={(el) => { fileInputRefs.current[dt.key] = el; }}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileSelect(dt.key, dt.label, file);
                              }}
                            />
                          </div>
                          {docErrors[dt.key] && <p className="text-xs text-red-500">{docErrors[dt.key]}</p>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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
            {/* Success icon */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto size-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#dcfce7' }}
              >
                <CheckCircle className="size-12 text-green-500" strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Application Submitted!</h3>
              <p className="text-gray-500 mt-2">
                Your application has been received. Use the SchoolPay code below to pay the application fee.
              </p>
            </div>

            {/* Reference Number */}
            <div className="mx-auto max-w-md rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
              <p className="text-sm text-green-700 font-medium">Your Admission Reference</p>
              <p className="text-3xl font-extrabold font-mono mt-2" style={{ color: PRIMARY }}>
                {referenceNumber}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Save this reference number for all future correspondence.
              </p>
            </div>

            {/* SchoolPay Code Card */}
            <div
              className="rounded-xl border-2 shadow-lg overflow-hidden"
              style={{ borderColor: GOLD }}
            >
              <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                    <CreditCard className="size-5" style={{ color: PRIMARY }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">SchoolPay Payment Code</p>
                    <p className="text-xs opacity-80">Complete payment to finalize your application</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4 bg-white">
                {/* SchoolPay Code */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div>
                    <p className="text-xs text-amber-600 font-medium">Payment Code</p>
                    <p className="text-2xl font-extrabold font-mono tracking-wider" style={{ color: PRIMARY }}>
                      {schoolpayCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(schoolpayCode)}
                    className="p-2 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    <Copy className="size-5 text-amber-600" />
                  </button>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Applicant</span>
                  <span className="font-medium text-sm text-gray-900">{form.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Programme</span>
                  <span className="font-medium text-sm text-gray-900">{form.programme}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-base font-bold text-gray-900">Amount to Pay</span>
                  <span className="text-2xl font-extrabold" style={{ color: GOLD }}>
                    {formatCurrency(applicationFee)}
                  </span>
                </div>

                {/* Instructions */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-800">How to Pay:</p>
                  <p className="text-sm text-blue-700">
                    Dial <span className="font-bold font-mono">*210#</span> on MTN or <span className="font-bold font-mono">*185#</span> on Airtel, enter this code, and follow prompts.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-600">
                    <BadgeCheck className="size-3.5 inline-block mr-1 text-gray-400" />
                    This code has been sent to your email. Complete payment to finalize your application.
                  </p>
                </div>
              </CardContent>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setCurrentPage('track-application')}
                style={{ background: PRIMARY }}
                className="cursor-pointer"
              >
                <Search className="size-4 mr-2" />
                Track Application
              </Button>
              <Button
                onClick={() => setCurrentPage('enrolled-students')}
                variant="outline"
                className="cursor-pointer"
                style={{ borderColor: GOLD, color: '#92640a' }}
              >
                <Users className="size-4 mr-2" />
                View Enrolled Students
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setCurrentPage('home')}
                variant="ghost"
                className="cursor-pointer text-gray-500"
              >
                <Home className="size-4 mr-1" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  /* ──────── completed step indicator for sidebar ──────── */

  const isStepCompleted = (step: number) => {
    if (step === 1) return !!(form.fullName && form.dob && form.gender);
    if (step === 2) return !!(form.phone && form.email);
    if (step === 3) return !!(form.qualification && form.institutionLevel);
    if (step === 4) return !!(form.programme && form.intakeYear);
    if (step === 5) return !!referenceNumber;
    return false;
  };

  /* ──────── main render ──────── */

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══════════ PAGE HEADER ═══════════ */}
      <header
        className="pt-[104px] lg:pt-[108px] pb-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, ${PRIMARY} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 size-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ ENTRY REQUIREMENTS ═══════════ */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                    <div className="mt-6 space-y-2">
                      {tvetFormUrl ? (
                        <a
                          href={tvetFormUrl}
                          download
                          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                        >
                          <Download className="w-4 h-4" />
                          Download TVET Form (PDF)
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
                    <div className="mt-6 space-y-2">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Online Application Form</h2>
              <p className="text-gray-500 mt-2">Complete all steps to submit your application</p>

              {/* TVET Formal Application CTA */}
              <div className="mt-6 max-w-xl mx-auto">
                <button
                  onClick={() => setCurrentPage('tvet-form')}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Apply for TVET Programmes (Formal)
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-gray-400 mt-2">Official Ministry of Education TVET application form for National Certificates & Diplomas</p>
              </div>
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
                  {currentStep < 5 && (
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
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ NEED HELP SECTION ═══════════ */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
    </div>
  );
}
