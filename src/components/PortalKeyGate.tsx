'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

export default function PortalKeyGate() {
  const { setCurrentPage, setPortalVerified } = useAppStore();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!key.trim()) {
      setError('Please enter the portal key.');
      return;
    }

    if (attempts >= 5) {
      setError('Too many failed attempts. Please close this page and try again later.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/portal-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim() }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setError(data.message || 'Too many attempts. Please wait before trying again.');
        setAttempts(99);
        return;
      }

      if (!res.ok || !data.valid) {
        setAttempts((prev) => prev + 1);
        setError('Invalid portal key. Access denied.');
        setKey('');
        return;
      }

      // Key verified — store in sessionStorage and navigate to login
      setPortalVerified(true);
      setCurrentPage('staff-portal-8x7q');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
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
            {/* Header */}
            <div className="text-center mb-3">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-2.5"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                  boxShadow: `0 4px 16px ${PRIMARY}40`,
                }}
              >
                <ShieldAlert className="w-5 h-5 text-white" />
              </motion.div>

              <h1 className="text-lg font-bold text-gray-900">Staff Portal</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Enter the portal key to continue
              </p>

              <div
                className="mx-auto mt-2.5 mb-3 h-0.5 w-16 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
            </div>

            {/* Key entry form */}
            <form onSubmit={handleSubmit} className="space-y-3">
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
                <Label htmlFor="portal-key" className="text-xs font-medium text-gray-700">
                  Portal Key
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="portal-key"
                    type="password"
                    placeholder="Enter the secret portal key"
                    required
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="pl-10 h-10 text-sm"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Authorized personnel only. Contact administration if you need access.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || attempts >= 5}
                className="w-full h-10 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Verify & Continue
                  </>
                )}
              </Button>

              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage('home')}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Website
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
