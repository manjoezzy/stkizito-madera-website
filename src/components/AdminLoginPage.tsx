'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
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
  const [showForgot, setShowForgot] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

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

      if (res.status === 429) {
        setError(data.message || 'Too many failed attempts. Please wait 15 minutes before trying again.');
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || `Login failed (${res.status}). Please try again.`);
        return;
      }

      setAdminUser({ ...data.data, session: true });
      addToast('Welcome back!', 'success');
      setCurrentPage('admin-dashboard');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setResetSuccess(true);
      } else {
        setResetError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setResetError('Network error. Please check your connection and try again.');
    } finally {
      setResetLoading(false);
    }
  }

  function switchToForgot() {
    setError('');
    setResetEmail(email);
    setResetSuccess(false);
    setResetError('');
    setShowForgot(true);
  }

  function switchToLogin() {
    setResetSuccess(false);
    setResetError('');
    setResetEmail('');
    setShowForgot(false);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, #1e4d8a 100%)`,
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-10"
          style={{ background: GOLD, filter: 'blur(80px)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[400px] mx-4"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1.5 shrink-0"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GOLD}, ${PRIMARY})` }}
          />

          <CardContent className="px-6 py-5">
            {/* Header — icon + title + divider in one tight block */}
            <div className="text-center mb-3">
              <motion.div
                key={showForgot ? 'forgot' : 'login'}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-2.5"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                  boxShadow: `0 4px 16px ${PRIMARY}40`,
                }}
              >
                {showForgot ? (
                  <KeyRound className="w-5 h-5 text-white" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-white" />
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                {showForgot ? (
                  <motion.div
                    key="forgot-header"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-lg font-bold text-gray-900">Reset Password</h1>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Enter your email to receive reset instructions
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-header"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      St. Kizito&apos;s Technical Institute &mdash; Madera
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="mx-auto mt-2.5 mb-3 h-0.5 w-16 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
            </div>

            <AnimatePresence mode="wait">
              {!showForgot ? (
                /* ══════════ LOGIN FORM ══════════ */
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">{error}</p>
                    </motion.div>
                  )}

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

                  <div className="flex items-center justify-center gap-4 pt-0.5">
                    <button
                      type="button"
                      onClick={switchToForgot}
                      className="text-[11px] font-medium hover:underline transition-colors"
                      style={{ color: PRIMARY }}
                    >
                      Forgot Password?
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('home')}
                      className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to Website
                    </button>
                  </div>
                </motion.form>
              ) : resetSuccess ? (
                /* ══════════ RESET SUCCESS ══════════ */
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                    className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                    style={{ backgroundColor: '#ecfdf5' }}
                  >
                    <AlertCircle className="w-7 h-7" style={{ color: '#059669' }} />
                  </motion.div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">Check Your Email</h3>
                  <p className="text-xs text-gray-500 mb-5">
                    If an account exists with <span className="font-medium text-gray-700">{resetEmail}</span>,
                    you will receive password reset instructions shortly.
                  </p>
                  <Button
                    type="button"
                    onClick={switchToLogin}
                    className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                      color: 'white',
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </motion.div>
              ) : (
                /* ══════════ FORGOT PASSWORD FORM ══════════ */
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-3"
                >
                  {resetError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">{resetError}</p>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email" className="text-xs font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="admin@stkizitos.edu"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10 h-10 text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Enter the email address associated with your admin account.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full h-10 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                    }}
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium hover:underline transition-colors"
                      style={{ color: PRIMARY }}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to Login
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-white/30 mt-3">
          St. Kizito&apos;s Technical Institute &mdash; Madera
        </p>
      </motion.div>
    </div>
  );
}
