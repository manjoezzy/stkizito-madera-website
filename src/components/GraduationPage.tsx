'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  GraduationCap,
  CalendarDays,
  MapPin,
  UserCircle,
  CheckCircle2,
  Trophy,
  Star,
  Clock,
  Shirt,
  Camera,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const UPCOMING_CEREMONY = {
  date: 'Friday, 24th October 2025',
  time: '9:00 AM – 1:00 PM',
  venue: 'SKTIM Main Campus Grounds, Madera – Soroti City',
  chiefGuest: 'To Be Announced',
  theme: 'Skilled for the Future: Innovation & Excellence in Technical Education',
};

const REQUIREMENTS = [
  { label: 'Clear all tuition fees and any outstanding balances', done: false },
  { label: 'Complete all coursework and practical assessments', done: false },
  { label: 'Pass UVTAB/UBTEB final examinations', done: false },
  { label: 'Submit completed clearance form (Library, Workshop, Finance)', done: false },
  { label: 'Return all institute property (tools, books, equipment)', done: false },
  { label: 'Obtain recommendation letter from Head of Department', done: false },
  { label: 'Confirm attendance with the Academic Office by the deadline', done: false },
  { label: 'Purchase graduation gown and accessories from designated vendor', done: false },
];

const PAST_CEREMONIES = [
  { year: 2024, date: '25th October 2024', classSize: 287, chiefGuest: 'Hon. Eng. Peter Ogwang, State Minister for Education' },
  { year: 2023, date: '27th October 2023', classSize: 243, chiefGuest: 'Prof. Mary Okwakol, Former UNEB Chairperson' },
  { year: 2022, date: '21st October 2022', classSize: 198, chiefGuest: 'Eng. Dr. Isaac N. Munaabi, UBTEB Representative' },
  { year: 2021, date: '22nd October 2021', classSize: 156, chiefGuest: 'Mr. John Robert Otim, Director BTVET (MoES)' },
];

const NOTABLE_ACHIEVEMENTS = [
  { department: 'Building Construction', name: 'Emmanuel Obote', achievement: 'Best Overall Student – scored Distinction in all modules', year: 2024 },
  { department: 'Automotive Mechanics', name: 'Denis Ochieng', achievement: 'Best Practical Skills Award – 98% practical assessment score', year: 2024 },
  { department: 'Electrical Installation', name: 'Patricia Achan', achievement: 'Top Female Student in Technical Programme', year: 2024 },
  { department: 'Fashion Design & Garment Technology', name: 'Fiona Akumu', achievement: 'Best Innovation Award – designed eco-friendly collection', year: 2024 },
  { department: 'Plumbing', name: 'Samuel Egwang', achievement: 'Most Improved Student of the Year', year: 2023 },
];

const GRADUATION_TIPS = [
  { icon: Clock, title: 'Arrive Early', description: 'Be at the venue by 7:30 AM for gown fitting, line-up, and rehearsal. Latecomers may not be seated with their class.' },
  { icon: Shirt, title: 'Dress Code', description: 'Formal attire underneath the graduation gown. Gentlemen: collared shirt, dark trousers, closed shoes. Ladies: modest dress or blouse and skirt, closed shoes.' },
  { icon: Camera, title: 'Photography', description: 'Professional photographers will be available. Family photos are allowed in designated areas only during the ceremony.' },
  { icon: Heart, title: 'Invite Family', description: 'Each graduate may invite up to 4 guests. Seating is on a first-come, first-served basis. Extra chairs may be limited.' },
];

export default function GraduationPage() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative pt-[108px] lg:pt-[116px] pb-20 md:pb-28 px-4 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GraduationCap className="mx-auto mb-6 w-14 h-14 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Graduation
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Celebrating the achievements of our skilled graduates as they step into the world
              of work and service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Ceremony Info ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Upcoming Graduation Ceremony
            </h2>
            <p className="text-sm font-medium text-gray-500 italic">&ldquo;{UPCOMING_CEREMONY.theme}&rdquo;</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-gray-100 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-6 h-6 text-white/80 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Date &amp; Time</p>
                        <p className="text-white font-semibold mt-1">{UPCOMING_CEREMONY.date}</p>
                        <p className="text-white/80 text-sm mt-0.5">{UPCOMING_CEREMONY.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-white/80 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Venue</p>
                        <p className="text-white font-semibold mt-1">{UPCOMING_CEREMONY.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <UserCircle className="w-6 h-6 text-white/80 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Chief Guest</p>
                        <p className="text-white font-semibold mt-1">{UPCOMING_CEREMONY.chiefGuest}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-6 h-6 shrink-0 mt-0.5" style={{ color: GOLD }} />
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Theme</p>
                        <p className="text-white font-semibold mt-1 text-sm">Skilled for the Future</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Graduation Moments
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A glimpse of the joy and pride on graduation day at SKTIM.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/graduation.png" alt="SKTIM Graduation Ceremony" fill className="object-cover" />
            </motion.div>
            <motion.div variants={itemVariants} className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/campus.png" alt="SKTIM Campus" fill className="object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Graduation Requirements Checklist ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Graduation Requirements
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Ensure you have completed all requirements before the deadline to participate in the ceremony.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <ul className="space-y-4">
                  {REQUIREMENTS.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: PRIMARY + '12' }}
                      >
                        <CheckCircle2 className="w-4 h-4" style={{ color: PRIMARY }} />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{req.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Past Ceremonies ── */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Past Graduation Ceremonies
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A proud history of producing skilled graduates year after year.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PAST_CEREMONIES.map((ceremony) => (
              <motion.div key={ceremony.year} variants={itemVariants}>
                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                        >
                          <span className="text-white font-bold text-lg leading-none">{ceremony.year}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Graduation Ceremony {ceremony.year}</h3>
                          <p className="text-sm text-gray-500">{ceremony.date}</p>
                          <p className="text-xs text-gray-400 mt-1">Chief Guest: {ceremony.chiefGuest}</p>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-2xl font-bold" style={{ color: PRIMARY }}>{ceremony.classSize}</p>
                        <p className="text-xs text-gray-500">Graduates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Notable Achievements ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Notable Achievements
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Outstanding graduates recognised for academic excellence and practical skills.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {NOTABLE_ACHIEVEMENTS.map((a) => (
              <motion.div key={a.name} variants={itemVariants}>
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: GOLD + '25' }}
                      >
                        <Trophy className="w-5 h-5" style={{ color: '#b45309' }} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{a.name}</h3>
                        <p className="text-xs text-gray-400">Class of {a.year}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold mb-2" style={{ color: PRIMARY }}>{a.department}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{a.achievement}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Graduation Day Tips ── */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              What to Expect on Graduation Day
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything you need to know to make the most of your special day.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {GRADUATION_TIPS.map((tip) => {
              const Icon = tip.icon;
              return (
                <motion.div key={tip.title} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{tip.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="border-0 shadow-lg overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
            >
              <CardContent className="p-6 sm:p-10 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Questions About Graduation?
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                  Contact the Academic Office for information about requirements, gowns, tickets, and ceremony details.
                </p>
                <Button
                  onClick={() => setCurrentPage('contact')}
                  size="lg"
                  className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: GOLD, color: PRIMARY }}
                >
                  Contact Academic Office
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
