'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

export default function AdminLoginPage() {
  const { setCurrentPage, setAdminUser, addToast } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }

      setAdminUser(data.data);
      addToast('Welcome back!', 'success');
      setCurrentPage('admin-dashboard');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, #1e4d8a 100%)`,
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(100px)' }}
        />\n        <div
          className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(80px)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <Card className="border-0 shadow-2xl overflow-hidden max-h-[96dvh] flex flex-col">
          {/* Top accent bar */}
          <div
            className="h-1.5 shrink-0"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GOLD}, ${PRIMARY})` }}
          />

          <CardContent className="p-4 sm:p-5 overflow-y-auto">
            {/* School Badge */}
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                  boxShadow: `0 4px 20px ${PRIMARY}40`,
                }}
              >
                <ShieldCheck className="w-6 h-6 text-white" />
              </motion.div>

              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                St. Kizito&apos;s Technical Institute — Madera
              </p>

              {/* Gold divider */}
              <div
                className="mx-auto mt-3 mb-4 h-0.5 w-20 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@stkizitos.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>

            {/* Demo credentials - compact */}
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-amber-700">Demo Credentials</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">
                    Email: <span className="font-mono font-medium">admin@stkizitos.edu</span>
                  </p>
                  <p className="text-[11px] text-amber-600">
                    Password: <span className="font-mono font-medium">admin123</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Links - compact */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Website
              </button>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage('student-portal')}
                  className="text-xs font-medium hover:underline transition-colors"
                  style={{ color: PRIMARY }}
                >
                  Student Portal
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setCurrentPage('admissions')}
                  className="text-xs font-medium hover:underline transition-colors"
                  style={{ color: PRIMARY }}
                >
                  Admissions
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer branding */}
        <p className="text-center text-[10px] text-white/50 mt-3">
          <Image src="/images/institute-logo.jpg" alt="SKTM" width={14} height={14} className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
          St. Kizito&apos;s Technical Institute — Madera
        </p>
      </motion.div>
    </div>
  );
}
