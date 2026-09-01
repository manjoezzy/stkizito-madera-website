'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Loader2,
  ArrowLeft,
  GraduationCap,
  Info,
  CheckCircle,
  Headphones,
  MonitorPlay,
  IdCard,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const STEPS = [
  'Visit the institute admissions office or contact us by phone.',
  'Provide your details to receive your student number and initial password.',
  'Log in here to activate your account and set up your profile.',
  'Access your portal dashboard with academic and financial information.',
];

export default function StudentLoginPage() {
  const { setCurrentPage } = useAppStore();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Simulate a short delay then show the connection message
    await new Promise((r) => setTimeout(r, 1200));
    setMessage(
      'Student authentication is being connected. Please contact the institute for account activation.'
    );
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, #1e4d8a 100%)`,
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(80px)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl"
      >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Login Form */}
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div
            className="h-1.5"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GOLD}, ${PRIMARY})` }}
          />
          <CardContent className="p-6 sm:p-8">
            {/* Student Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                  boxShadow: `0 4px 20px ${PRIMARY}40`,
                }}
              >
                <IdCard className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-900">Student Login</h1>
              <p className="text-sm text-gray-500 mt-1">
                St. Kizito&apos;s Technical Institute — Madera
              </p>

              <div
                className="mx-auto mt-4 mb-6 h-0.5 w-24 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
            </div>

            {/* Connection message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">{message}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id" className="text-sm font-medium text-gray-700">
                  Student Number / Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="student-id"
                    type="text"
                    placeholder="e.g. SKT-2024-12345"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student-password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Back link */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors py-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Website
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card
            className="h-full border-0 shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(160deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 60%, #1e4d8a 100%)`,
            }}
          >
            <CardContent className="p-6 sm:p-8 text-white h-full flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Need an Account?</h2>
              <p className="text-white/70 text-sm mb-6">
                Follow these steps to get your student portal credentials:
              </p>

              <div className="flex-1 space-y-4">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: GOLD, color: PRIMARY }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed pt-0.5">{step}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick links */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <button
                  onClick={() => setCurrentPage('student-portal')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/10"
                >
                  <MonitorPlay className="w-5 h-5" style={{ color: GOLD }} />
                  <div className="text-left">
                    <p className="text-sm font-medium">Student Portal</p>
                    <p className="text-xs text-white/50">View portal features</p>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/10"
                >
                  <Headphones className="w-5 h-5" style={{ color: GOLD }} />
                  <div className="text-left">
                    <p className="text-sm font-medium">Contact Support</p>
                    <p className="text-xs text-white/50">Get help with your account</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer branding */}
      <p className="text-center text-xs text-white/50 mt-6">
        <Image src="/images/institute-logo.jpg" alt="SKTM" width={16} height={16} className="w-4 h-4 inline-block mr-1 -mt-0.5" />
        St. Kizito&apos;s Technical Institute — Madera
      </p>
      </motion.div>
    </div>
  );
}
