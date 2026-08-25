'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, User, Mail, Phone, Calendar, BookOpen,
  Briefcase, Building2, MapPin, FileText, CheckCircle,
  ArrowLeft, Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const PROGRAMMES = [
  'Electrical Installation',
  'Plumbing',
  'Carpentry & Joinery',
  'Bricklaying & Concrete Practice',
  'Motor Vehicle Mechanics',
  'Welding & Fabrication',
  'Fashion & Design',
  'Cosmetology',
  'Other',
] as const;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  graduationYear: string;
  programme: string;
  occupation: string;
  employer: string;
  district: string;
  biography: string;
}

const INITIAL: FormData = {
  fullName: '',
  email: '',
  phone: '',
  graduationYear: '',
  programme: '',
  occupation: '',
  employer: '',
  district: '',
  biography: '',
};

export default function AlumniRegisterPage() {
  const { setCurrentPage } = useAppStore();
  const [form, setForm] = useState<FormData>({ ...INITIAL });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function update(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.graduationYear.trim()) {
      setError('Please enter your year of completion.');
      return;
    }
    const yr = parseInt(form.graduationYear);
    if (isNaN(yr) || yr < 1970 || yr > new Date().getFullYear()) {
      setError('Please enter a valid graduation year.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/alumni/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const dbg = data.debug ? ` [${data.debug}]` : '';
        setError((data.message || 'Registration failed.') + dbg);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (success) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, #1e4d8a 100%)` }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(100px)' }} />
          <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(80px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GOLD}, ${PRIMARY})` }} />
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
                style={{ backgroundColor: '#ecfdf5' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: '#059669' }} />
              </motion.div>
              <h2 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>Registration Submitted!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Thank you, <span className="font-semibold text-gray-700">{form.fullName}</span>! Your alumni registration has been received.
                The school administration will review your information before it appears on the alumni page.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setCurrentPage('alumni')}
                  className="font-medium"
                  style={{ backgroundColor: PRIMARY, color: 'white' }}
                >
                  Back to Alumni Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage('home')}
                >
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Registration form
  const fieldClass = 'h-10 text-sm';
  const labelClass = 'text-xs font-medium text-gray-700';

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-10"
      style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, #1e4d8a 100%)` }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(80px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GOLD}, ${PRIMARY})` }} />
          <CardContent className="px-6 py-6">
            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`, boxShadow: `0 4px 16px ${PRIMARY}40` }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-lg font-bold text-gray-900">Alumni Registration</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                St. Kizito&apos;s Technical Institute &mdash; Madera
              </p>
              <div className="mx-auto mt-2.5 h-0.5 w-16 rounded-full" style={{ backgroundColor: GOLD }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="fullName" placeholder="e.g. James Otim" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={`pl-10 ${fieldClass}`} />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={labelClass}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="name@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} className={`pl-10 ${fieldClass}`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="phone" placeholder="e.g. 0771234567" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={`pl-10 ${fieldClass}`} />
                  </div>
                </div>
              </div>

              {/* Graduation Year & Programme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gradYear" className={labelClass}>
                    Year of Completion <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="gradYear" placeholder="e.g. 2020" required value={form.graduationYear} onChange={(e) => update('graduationYear', e.target.value)} className={`pl-10 ${fieldClass}`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Programme</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <Select value={form.programme} onValueChange={(v) => update('programme', v)}>
                      <SelectTrigger className={`pl-10 ${fieldClass}`}>
                        <SelectValue placeholder="Select programme" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAMMES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Occupation & Employer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="occupation" className={labelClass}>Current Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="occupation" placeholder="e.g. Electrician" value={form.occupation} onChange={(e) => update('occupation', e.target.value)} className={`pl-10 ${fieldClass}`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="employer" className={labelClass}>Employer / Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="employer" placeholder="e.g. Umeme Ltd" value={form.employer} onChange={(e) => update('employer', e.target.value)} className={`pl-10 ${fieldClass}`} />
                  </div>
                </div>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <Label htmlFor="district" className={labelClass}>District of Residence</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="district" placeholder="e.g. Soroti" value={form.district} onChange={(e) => update('district', e.target.value)} className={`pl-10 ${fieldClass}`} />
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className={labelClass}>Brief Biography / Achievements</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your journey after SKTIM..."
                    value={form.biography}
                    onChange={(e) => update('biography', e.target.value)}
                    rows={3}
                    className="pl-10 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Registration'
                )}
              </Button>

              {/* Back link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentPage('alumni')}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Alumni Page
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-white/30 mt-3">
          St. Kizito&apos;s Technical Institute &mdash; Madera
        </p>
      </motion.div>
    </div>
  );
}
