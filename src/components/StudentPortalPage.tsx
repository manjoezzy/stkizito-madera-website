'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  FileText,
  Wallet,
  BookOpen,
  ClipboardList,
  ArrowRight,
  User,
  LogIn,
  MonitorPlay,
  Headphones,
  Megaphone,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const FEATURE_CARDS = [
  {
    icon: FileText,
    title: 'Academic Records',
    description:
      'View your transcripts, attendance records, and academic progress throughout your programme.',
  },
  {
    icon: Wallet,
    title: 'Fee Payments',
    description:
      'Check your fee balance, view payment history, and make secure online payments via SchoolPay.',
  },
  {
    icon: BookOpen,
    title: 'Course Materials',
    description:
      'Access lecture notes, course outlines, practical manuals, and supplementary learning resources.',
  },
  {
    icon: ClipboardList,
    title: 'Exam Results',
    description:
      'View your examination results, UVTAB/UBTEB grades, and assessment scores as they are released.',
  },
];

const QUICK_LINKS = [
  { icon: FileText, title: 'Admissions', page: 'admissions' as const, description: 'Apply for a programme' },
  { icon: LogIn, title: 'Student Login', page: 'student-login' as const, description: 'Access your account' },
  { icon: MonitorPlay, title: 'Online Learning', page: 'online-learning' as const, description: 'LMS platform' },
  { icon: Headphones, title: 'Contact Support', page: 'contact' as const, description: 'Get help' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function StudentPortalPage() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-10 right-20 w-64 h-64 rounded-full"
            style={{ background: GOLD, filter: 'blur(80px)' }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GraduationCap className="mx-auto mb-6 w-14 h-14 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Student Portal
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Your central hub for academics, finances, and learning resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Welcome Section ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card
              className="border-0 shadow-md overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
            >
              <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome, Student</h2>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">
                    Log in to access your personalised dashboard with academic records, fee information,
                    course materials, and exam results.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('student-login')}
                  className="flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: GOLD, color: PRIMARY }}
                >
                  <LogIn className="w-4 h-4 mr-2 inline-block" />
                  Log In
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Portal Features
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.title} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 relative group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                          style={{
                            backgroundColor: '#fef9e7',
                            color: '#92640a',
                            borderColor: '#f5c51840',
                          }}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Coming Soon
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Quick Links
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.title} variants={itemVariants}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className="w-full text-left"
                  >
                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md hover:border-transparent transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: '#eef2ff' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: PRIMARY }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900">{link.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{link.description}</p>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
                        />
                      </CardContent>
                    </Card>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Announcement ── */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-md" style={{ backgroundColor: '#fef9e7' }}>
              <CardContent className="p-6 flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: GOLD }}
                >
                  <Megaphone className="w-5 h-5" style={{ color: PRIMARY }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Announcement</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Student portal features are being developed. Check back for updates as we roll out
                    academic records, fee management, course materials, and examination result features.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
