'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Copy,
  FileText,
  User,
  BookOpen,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Eye,
  CircleCheckBig,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/schoolpay';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

interface ApplicationData {
  referenceNumber: string;
  fullName: string;
  programme: string | null;
  intakeYear: string | null;
  status: string;
  schoolpayCode: string | null;
  paymentStatus: string;
  paymentAmount: number | null;
  createdAt: string;
  phone: string;
  email: string;
  documents: Array<{
    id: string;
    fileName: string;
    documentType: string;
    createdAt: string;
  }>;
  grades: string | null;
}

const STATUS_STEPS = [
  { key: 'applied', label: 'Applied' },
  { key: 'documents_verified', label: 'Documents Verified' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'decision', label: 'Approved / Rejected' },
  { key: 'enrolled', label: 'Enrolled' },
];

function getStatusStepIndex(status: string): number {
  switch (status) {
    case 'pending': return 0;
    case 'approved': return 3;
    case 'rejected': return 3;
    case 'enrolled': return 4;
    default: return 0;
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
    case 'approved':
      return { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' };
    case 'rejected':
      return { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' };
    case 'enrolled':
      return { label: 'Enrolled', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-200', dot: 'bg-gray-500' };
  }
}

export default function TrackApplicationPage() {
  const { addToast, setCurrentPage } = useAppStore();

  const [searchInput, setSearchInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      addToast('Enter a reference number or phone number', 'error');
      return;
    }

    setSearching(true);
    setNotFound(false);
    setApplication(null);

    try {
      const isRef = query.startsWith('SKT-');
      const url = isRef
        ? `/api/admissions?ref=${encodeURIComponent(query)}`
        : `/api/admissions?search=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.data) {
        const app = Array.isArray(data.data) ? data.data[0] : data.data;
        if (app) {
          setApplication(app);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch {
      addToast('Network error. Please try again.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast('Copied to clipboard!', 'success');
    }).catch(() => {
      addToast('Failed to copy', 'error');
    });
  };

  const statusConfig = application ? getStatusConfig(application.status) : null;
  const currentStepIdx = application ? getStatusStepIndex(application.status) : -1;
  const parsedGrades = application?.grades
    ? (() => { try { return JSON.parse(application.grades); } catch { return null; } })()
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="pt-[104px] lg:pt-[108px] pb-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, ${PRIMARY} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 size-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              className="mb-4 text-xs font-semibold px-4 py-1.5"
              style={{ background: GOLD, color: PRIMARY, borderColor: 'transparent' }}
            >
              <Eye className="size-3.5 mr-1.5" />
              Application Tracking
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Track Your Application
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Enter your application reference number or phone number to check the status of your admission.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-lg border-gray-100">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label htmlFor="search-input" className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Reference Number or Phone Number
                    </Label>
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="e.g. SKT-2025-12345 or 0771234567"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-11"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      disabled={searching}
                      className="h-11 px-6 cursor-pointer"
                      style={{ background: PRIMARY }}
                    >
                      {searching ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="size-4 mr-2" />
                          Track Application
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Not Found */}
          <AnimatePresence>
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto size-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <XCircle className="size-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Application Not Found</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                      We couldn't find an application matching your search. Please check your reference number or phone number and try again.
                    </p>
                    <Button
                      onClick={() => setCurrentPage('admissions')}
                      variant="outline"
                      className="mt-4 cursor-pointer"
                    >
                      <ArrowLeft className="size-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Application Dashboard */}
          <AnimatePresence>
            {application && statusConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Reference Number & Status */}
                <Card className="shadow-lg border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reference Number</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: PRIMARY }}>
                            {application.referenceNumber}
                          </p>
                          <button
                            onClick={() => copyToClipboard(application.referenceNumber)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Copy reference"
                          >
                            <Copy className="size-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <Badge className={`${statusConfig.color} border text-sm px-4 py-1.5 font-semibold`}>
                        <span className={`size-2 rounded-full mr-2 ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Timeline */}
                <Card className="shadow-lg border-gray-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="size-4" style={{ color: PRIMARY }} />
                      Application Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="flex items-center gap-0 overflow-x-auto pb-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const isRejected = application.status === 'rejected' && idx === 3;

                        return (
                          <div key={step.key} className="flex items-center">
                            <div className="flex flex-col items-center min-w-[80px]">
                              <div
                                className={`size-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? 'border-green-400 bg-green-50'
                                    : isCurrent && isRejected
                                    ? 'border-red-400 bg-red-50'
                                    : isCurrent
                                    ? 'border-amber-400 bg-amber-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="size-5 text-green-500" />
                                ) : isCurrent && isRejected ? (
                                  <XCircle className="size-5 text-red-500" />
                                ) : isCurrent ? (
                                  <div className={`size-3 rounded-full animate-pulse ${isRejected ? 'bg-red-400' : 'bg-amber-400'}`} />
                                ) : (
                                  <div className="size-2 rounded-full bg-gray-300" />
                                )}
                              </div>
                              <span
                                className={`text-xs mt-2 text-center font-medium ${
                                  isCompleted
                                    ? 'text-green-700'
                                    : isCurrent
                                    ? isRejected ? 'text-red-700' : 'text-amber-700'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`h-0.5 w-8 sm:w-12 mx-1 mb-5 rounded transition-colors ${
                                  idx < currentStepIdx ? 'bg-green-400' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info Summary */}
                <Card className="shadow-lg border-gray-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <User className="size-4" style={{ color: PRIMARY }} />
                      Applicant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Full Name</p>
                          <p className="text-sm font-semibold text-gray-900">{application.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookOpen className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Programme</p>
                          <p className="text-sm font-semibold text-gray-900">{application.programme || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Date Applied</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(application.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <GraduationCap className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Intake Year</p>
                          <p className="text-sm font-semibold text-gray-900">{application.intakeYear || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-sm font-semibold text-gray-900">{application.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="size-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm font-semibold text-gray-900">{application.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SchoolPay Code & Payment */}
                {(application.schoolpayCode || application.paymentStatus) && (
                  <Card className="shadow-lg border-gray-100">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="size-4" style={{ color: PRIMARY }} />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6 space-y-4">
                      {application.schoolpayCode && (
                        <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200">
                          <div>
                            <p className="text-xs text-amber-600 font-medium">SchoolPay Code</p>
                            <p className="text-xl font-extrabold font-mono tracking-wider" style={{ color: PRIMARY }}>
                              {application.schoolpayCode}
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(application.schoolpayCode!)}
                            className="p-2 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="size-5 text-amber-600" />
                          </button>
                        </div>
                      )}

                      {application.paymentStatus && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">Payment Status</span>
                          <Badge
                            className={`${
                              application.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : application.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            } border text-xs font-semibold`}
                          >
                            {application.paymentStatus.charAt(0).toUpperCase() + application.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                      )}

                      {application.paymentAmount != null && application.paymentAmount > 0 && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">Amount Paid</span>
                          <span className="text-sm font-bold" style={{ color: GOLD }}>
                            {formatCurrency(application.paymentAmount)}
                          </span>
                        </div>
                      )}

                      {application.schoolpayCode && application.paymentStatus !== 'paid' && (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                          <p className="text-xs text-blue-700">
                            <ShieldCheck className="size-3.5 inline-block mr-1" />
                            Dial <span className="font-bold font-mono">*210#</span> on MTN or <span className="font-bold font-mono">*185#</span> on Airtel, enter the code above, and follow prompts.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Grades */}
                {parsedGrades && Array.isArray(parsedGrades) && parsedGrades.length > 0 && (
                  <Card className="shadow-lg border-gray-100">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <ClipboardList className="size-4" style={{ color: PRIMARY }} />
                        Academic Grades
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-2 gap-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {parsedGrades.map((g: { subject: string; grade: string }, idx: number) => (
                            <div key={idx} className="grid grid-cols-2 gap-0 px-4 py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-sm text-gray-700">{g.subject}</span>
                              <span className="text-sm font-semibold text-gray-900">{g.grade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Uploaded Documents */}
                {application.documents && application.documents.length > 0 && (
                  <Card className="shadow-lg border-gray-100">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="size-4" style={{ color: PRIMARY }} />
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="space-y-2">
                        {application.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                          >
                            <CircleCheckBig className="size-4 text-green-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                              <p className="text-xs text-gray-400 capitalize">{doc.documentType.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button
                    onClick={() => setCurrentPage('admissions')}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Admissions
                  </Button>
                  <Button
                    onClick={() => setCurrentPage('home')}
                    style={{ background: PRIMARY }}
                    className="cursor-pointer"
                  >
                    Back to Home
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
