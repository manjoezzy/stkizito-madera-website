'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Globe,
  Briefcase,
  Network,
  MessageCircle,
  Award,
  CalendarHeart,
  ArrowRight,
  Quote,
  Building2,
  Car,
  Zap,
  Scissors,
  Landmark,
  Lightbulb,
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

const ALUMNI = [
  {
    name: 'James Otim',
    year: 2018,
    programme: 'Diploma in Building Construction',
    position: 'Site Engineer, Uganda National Roads Authority (UNRA)',
    quote: 'SKTIM gave me the hands-on skills that textbooks alone could never provide. I walked into my first job already knowing how to read blueprints and manage a construction site.',
  },
  {
    name: 'Grace Akello',
    year: 2019,
    programme: 'Certificate in Fashion Design & Garment Technology',
    position: 'Founder & Lead Designer, Akello Fashions, Soroti',
    quote: 'The fashion programme taught me not just sewing, but the business of fashion. Today I employ 8 people and supply boutiques across Eastern Uganda.',
  },
  {
    name: 'Simon Peter Elobu',
    year: 2017,
    programme: 'Diploma in Automotive Mechanics',
    position: 'Workshop Manager, Toyota Uganda – Soroti Branch',
    quote: 'From the workshop floor at SKTIM to managing a major dealership’s service centre. The practical training I received was world-class and immediately applicable.',
  },
  {
    name: 'Betty Amongin',
    year: 2020,
    programme: 'Certificate in Electrical Installation',
    position: 'Electrical Supervisor, Umeme Limited',
    quote: 'Every day I use the troubleshooting techniques I learned at SKTIM. The instructors were patient, knowledgeable, and genuinely invested in our success.',
  },
  {
    name: 'Francis Okello',
    year: 2016,
    programme: 'Diploma in Building Construction',
    position: 'District Engineer, Soroti City Council',
    quote: 'SKTIM prepared me for leadership in the construction industry. The technical foundation I built here has been the cornerstone of my career in public service.',
  },
  {
    name: 'Sarah Apio',
    year: 2021,
    programme: 'Certificate in Fashion Design & Garment Technology',
    position: 'Quality Control Officer, Apex Textiles, Kampala',
    quote: 'The industry exposure and internship placements at SKTIM opened doors I never imagined. I graduated with both a certificate and a job offer.',
  },
];

const INDUSTRIES = [
  { label: 'Construction & Engineering', icon: Building2, count: '120+', color: '#1e40af' },
  { label: 'Automotive & Transport', icon: Car, count: '85+', color: '#047857' },
  { label: 'Electrical & Energy', icon: Zap, count: '95+', color: '#b45309' },
  { label: 'Fashion & Textiles', icon: Scissors, count: '60+', color: '#7c3aed' },
  { label: 'Government & Public Service', icon: Landmark, count: '45+', color: '#be123c' },
  { label: 'Entrepreneurship', icon: Lightbulb, count: '150+', color: '#0d9488' },
];

const BENEFITS = [
  {
    icon: Network,
    title: 'Networking Opportunities',
    description: 'Connect with over 1,000 alumni working across Uganda and East Africa. Access an exclusive professional network that opens doors.',
  },
  {
    icon: MessageCircle,
    title: 'Mentorship Programme',
    description: 'Give back by mentoring current students, or receive guidance from experienced alumni in your field of work.',
  },
  {
    icon: Briefcase,
    title: 'Career Support',
    description: 'Access job listings, career fairs, and referral programmes exclusively available to registered alumni members.',
  },
  {
    icon: CalendarHeart,
    title: 'Alumni Events',
    description: 'Attend annual reunions, homecoming events, workshops, and professional development seminars throughout the year.',
  },
];

const STATS = [
  { label: 'Total Alumni', value: '1,200+', icon: Users },
  { label: 'Countries Represented', value: '8', icon: Globe },
  { label: 'Industries', value: '25+', icon: Briefcase },
];

export default function AlumniPage() {
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
            <Users className="mx-auto mb-6 w-14 h-14 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Alumni Network
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Join a thriving community of skilled professionals making an impact across Uganda and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Hero / Join CTA ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Join Our Alumni Network
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              As a graduate of St. Kizito&apos;s Technical Institute &ndash; Madera, you are part of a proud
              legacy of skilled professionals. Stay connected, share your journey, and help shape the
              future of technical education in Uganda.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <Card className="border border-gray-100 shadow-sm text-center py-8">
                    <CardContent className="p-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-3xl font-bold" style={{ color: PRIMARY }}>{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Alumni Testimonials ── */}
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
              Featured Alumni Stories
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hear from graduates who are transforming their communities and industries.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {ALUMNI.map((a) => (
              <motion.div key={a.name} variants={itemVariants}>
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        {a.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{a.name}</h3>
                        <p className="text-xs text-gray-400">Class of {a.year}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold mb-3" style={{ color: PRIMARY }}>{a.programme}</p>
                    <p className="text-xs text-gray-500 mb-4 font-medium">{a.position}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <Quote className="w-4 h-4 mb-2" style={{ color: GOLD }} />
                      <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{a.quote}&rdquo;</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Where Are They Now? (By Industry) ── */}
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
              Where Are They Now?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our alumni are making a difference across a wide range of industries.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              return (
                <motion.div key={ind.label} variants={itemVariants}>
                  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: ind.color + '15' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: ind.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{ind.label}</h3>
                        <p className="text-lg font-bold mt-0.5" style={{ color: ind.color }}>{ind.count} alumni</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Alumni Benefits ── */}
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
              Why Join the Alumni Association?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Membership comes with exclusive benefits to support your continued growth.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1.5">{b.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Registration CTA ── */}
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
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Register as an Alumnus
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                  Stay connected with SKTIM and fellow graduates. Register today to access networking
                  events, mentorship opportunities, and career resources.
                </p>
                <Button
                  onClick={() => setCurrentPage('alumni-register')}
                  size="lg"
                  className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: GOLD, color: PRIMARY }}
                >
                  Register Now
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
