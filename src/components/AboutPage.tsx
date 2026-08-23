'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Target,
  Heart,
  Network,
  Landmark,
  Music,
  ChevronDown,
  Award,
  Users,
  BookOpen,
  Shield,
  Lightbulb,
  Handshake,
  Globe,
  Cross,
  GraduationCap,
  Clock,
  Star,
  CheckCircle,
  Briefcase,
  ClipboardList,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

/* ──────────────── section data ──────────────── */

const ABOUT_SECTIONS = [
  {
    id: 'vision',
    label: 'Our Vision',
    icon: Eye,
    color: PRIMARY,
  },
  {
    id: 'mission',
    label: 'Our Mission',
    icon: Target,
    color: PRIMARY_LIGHT,
  },
  {
    id: 'values',
    label: 'Core Values',
    icon: Heart,
    color: '#e11d48',
  },
  {
    id: 'organogram',
    label: 'Organogram',
    icon: Network,
    color: '#0d9488',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Landmark,
    color: '#7c3aed',
  },
  {
    id: 'anthem',
    label: 'School Anthem',
    icon: Music,
    color: GOLD,
  },
];

/* ──────────────── values data ──────────────── */

const CORE_VALUES = [
  {
    icon: Cross,
    title: 'Faith & Prayer',
    description: 'Rooted in Catholic Christian values, we nurture spiritual growth and moral integrity alongside academic excellence.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace modern technology and creative problem-solving to prepare students for a rapidly evolving workforce.',
  },
  {
    icon: Handshake,
    title: 'Integrity',
    description: 'Honesty, transparency, and ethical conduct are the foundation of every interaction within our institution.',
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'Collaborative learning and mutual respect define our community, preparing students for professional environments.',
  },
  {
    icon: Globe,
    title: 'Excellence',
    description: 'We pursue the highest standards in technical education, producing graduates who stand out in their fields.',
  },
  {
    icon: Shield,
    title: 'Discipline',
    description: 'A structured and disciplined environment fosters focus, responsibility, and professional work habits.',
  },
];

/* ──────────────── governance data ──────────────── */

const GOVERNANCE_BODY = [
  {
    role: 'Board of Governors',
    description: 'The supreme governing body that provides strategic direction, policy oversight, and ensures the institution meets its mandate as a government-aided TVET centre.',
    icon: Landmark,
  },
  {
    role: 'Principal',
    description: 'The chief executive of the institute responsible for day-to-day academic and administrative operations, implementation of board decisions, and staff management.',
    icon: GraduationCap,
  },
  {
    role: 'Deputy Principal',
    description: 'Assists the Principal in academic coordination, curriculum implementation, and student welfare across all programmes.',
    icon: BookOpen,
  },
  {
    role: 'Director of Studies',
    description: 'Oversees curriculum development, examination coordination, academic standards, and ensures compliance with DIT/UBTEB requirements.',
    icon: ClipboardList,
  },
  {
    role: 'Bursar',
    description: 'Manages the institute\'s financial operations including budgeting, fee collection, procurement, and financial reporting to the Board.',
    icon: Briefcase,
  },
];

/* ──────────────── organogram data ──────────────── */

const ORGANOGRAM_DATA = {
  top: { title: 'Board of Governors', icon: Landmark },
  second: { title: 'Principal', icon: GraduationCap },
  third: [
    { title: 'Deputy Principal', icon: BookOpen },
    { title: 'Bursar', icon: Briefcase },
  ],
  fourth: [
    { title: 'Director of Studies', icon: ClipboardList },
    { title: 'Dean of Students', icon: Users },
    { title: 'Head of Departments', icon: Briefcase },
  ],
  fifth: [
    'Building Construction',
    'Automotive Mechanics',
    'Electrical Installation',
    'Plumbing',
    'Machining & Fitting',
    'Woodwork Technology',
    'Fashion & Design',
  ],
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */

export default function AboutPage() {
  const [openSection, setOpenSection] = useState<string | null>('vision');

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ═══════════ PAGE HEADER ═══════════ */}
      <header
        className="pt-24 pb-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 50%, ${PRIMARY} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 size-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              About Us
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Discover the heritage, purpose, and structure of St. Kizito&apos;s Technical Institute - Madera.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ═══════════ BRIEF HISTORY ═══════════ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: GOLD }}>
                <Clock className="h-4 w-4" />
                Established 1947
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: PRIMARY }}>
                A Legacy of Over 77 Years in Technical Education
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed">
                St. Kizito&apos;s Technical Institute - Madera was founded in 1947 in Soroti City, Eastern Uganda, as a government-aided institution under the Catholic Church. For over seven decades, the institute has been a beacon of technical and vocational education, producing skilled graduates who contribute significantly to Uganda&apos;s construction, automotive, electrical, and hospitality industries.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Affiliated with the Directorate of Industrial Training (DIT) and the Uganda Business and Technical Examinations Board (UBTEB), SKTM offers nationally recognised certificate programmes that equip students with practical, market-ready skills.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/about-workshop.png"
                    alt="Students in workshop at SKTM"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}20` }}>
                    <Award className="h-6 w-6" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: PRIMARY }}>77+</p>
                    <p className="text-xs text-slate-500">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ ACCORDION SECTIONS ═══════════ */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold" style={{ color: PRIMARY }}>
              Explore Our Institution
            </h2>
            <p className="mt-2 text-slate-500">Click each section to learn more about who we are</p>
          </motion.div>

          <div className="space-y-3">
            {ABOUT_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              const isOpen = openSection === section.id;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggle(section.id)}
                      className="w-full flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${section.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: section.color }} />
                        </div>
                        <span className="text-base font-semibold text-slate-800">{section.label}</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <CardContent className="px-6 pb-6 pt-0">
                            {renderSectionContent(section.id)}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ KEY FACTS ═══════════ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '1947', label: 'Year Founded', icon: Clock },
              { value: 'TVET', label: 'Institution Type', icon: GraduationCap },
              { value: 'DIT & UBTEB', label: 'Affiliations', icon: Award },
              { value: 'Soroti City', label: 'Location', icon: Globe },
            ].map((fact, i) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="text-center p-6 border-0 shadow-sm">
                    <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `${PRIMARY}10` }}>
                      <Icon className="h-6 w-6" style={{ color: PRIMARY }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: PRIMARY }}>{fact.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{fact.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION CONTENT RENDERERS
   ══════════════════════════════════════════════════════ */

function renderSectionContent(id: string) {
  switch (id) {
    case 'vision':
      return <VisionContent />;
    case 'mission':
      return <MissionContent />;
    case 'values':
      return <ValuesContent />;
    case 'organogram':
      return <OrganogramContent />;
    case 'governance':
      return <GovernanceContent />;
    case 'anthem':
      return <AnthemContent />;
    default:
      return null;
  }
}

/* ──── VISION ──── */
function VisionContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 p-5 rounded-xl" style={{ background: `${PRIMARY}08` }}>
        <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${PRIMARY}15` }}>
          <Eye className="h-7 w-7" style={{ color: PRIMARY }} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2" style={{ color: PRIMARY }}>Our Vision</h3>
          <p className="text-slate-700 leading-relaxed text-base">
            &ldquo;To be a centre of excellence in Technical and Vocational Education and Training (TVET), producing competent, skilled, and morally upright professionals who contribute to national development.&rdquo;
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">
        Since our founding in 1947, we have worked tirelessly towards this vision, adapting to the evolving needs of Uganda&apos;s economy while maintaining our commitment to holistic education that develops both the hands and the heart.
      </p>
    </div>
  );
}

/* ──── MISSION ──── */
function MissionContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 p-5 rounded-xl" style={{ background: `${PRIMARY_LIGHT}08` }}>
        <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${PRIMARY_LIGHT}15` }}>
          <Target className="h-7 w-7" style={{ color: PRIMARY_LIGHT }} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2" style={{ color: PRIMARY_LIGHT }}>Our Mission</h3>
          <p className="text-slate-700 leading-relaxed text-base">
            &ldquo;To provide quality, practical, and inclusive technical education that empowers individuals with market-relevant skills, grounded in Christian values, for sustainable livelihoods and national development.&rdquo;
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          'Provide hands-on, competence-based training',
          'Foster moral and spiritual development',
          'Produce graduates ready for the labour market',
          'Promote innovation and entrepreneurship',
          'Serve the community through outreach programmes',
          'Maintain partnerships with industry and government',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
            <p className="text-sm text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──── CORE VALUES ──── */
function ValuesContent() {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 leading-relaxed">
        At St. Kizito&apos;s Technical Institute - Madera, our core values guide every aspect of institutional life, from classroom instruction to community engagement.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {CORE_VALUES.map((value, i) => {
          const Icon = value.icon;
          return (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50">
                  <Icon className="h-4 w-4 text-red-500" />
                </div>
                <h4 className="font-semibold text-sm text-slate-800">{value.title}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{value.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ──── ORGANOGRAM ──── */
function OrganogramContent() {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 leading-relaxed">
        The organisational structure of St. Kizito&apos;s Technical Institute - Madera ensures clear lines of authority, effective communication, and efficient management of academic and administrative functions.
      </p>

      <div className="flex flex-col items-center py-4 space-y-3">
        {/* Top level - Board */}
        <OrgNode title={ORGANOGRAM_DATA.top.title} icon={ORGANOGRAM_DATA.top.icon} variant="primary" />
        <OrgConnector />

        {/* Second level - Principal */}
        <OrgNode title={ORGANOGRAM_DATA.second.title} icon={ORGANOGRAM_DATA.second.icon} variant="gold" />
        <OrgConnector />

        {/* Third level */}
        <div className="flex items-start gap-12">
          {ORGANOGRAM_DATA.third.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <OrgNode title={item.title} icon={item.icon} variant="default" />
              <OrgConnector />
              {/* Fourth level items under this third-level node */}
              <div className="flex flex-col items-center gap-3">
                {ORGANOGRAM_DATA.fourth
                  .filter((_, idx) => {
                    if (item.title.includes('Deputy')) return idx < 2;
                    return idx >= 2;
                  })
                  .map((fourth) => (
                    <OrgNode key={fourth.title} title={fourth.title} icon={fourth.icon} variant="small" />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Departments - shown under Head of Departments */}
        <div className="w-full mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">Departments</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ORGANOGRAM_DATA.fifth.map((dept) => (
              <span
                key={dept}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 bg-white"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgNode({ title, icon: Icon, variant }: { title: string; icon: React.ElementType; variant: 'primary' | 'gold' | 'default' | 'small' }) {
  const styles = {
    primary: `px-6 py-3 text-white font-bold text-sm ${PRIMARY}`,
    gold: `px-5 py-2.5 font-bold text-sm border-2 ${GOLD} ${PRIMARY}`,
    default: `px-4 py-2 font-semibold text-xs bg-white border border-slate-200 text-slate-700`,
    small: `px-3 py-1.5 font-medium text-xs bg-slate-50 border border-slate-200 text-slate-600`,
  };
  return (
    <div className={`flex items-center gap-2 rounded-xl shadow-sm ${styles[variant]}`}>
      <Icon className={variant === 'primary' ? 'h-5 w-5' : variant === 'gold' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      <span>{title}</span>
    </div>
  );
}

function OrgConnector() {
  return <div className="w-px h-6 bg-slate-300" />;
}

/* ──── GOVERNANCE ──── */
function GovernanceContent() {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 leading-relaxed">
        The governance of St. Kizito&apos;s Technical Institute - Madera operates within the framework established by the Ministry of Education and Sports for government-aided institutions. Our governance structure ensures accountability, transparency, and effective management.
      </p>
      <div className="space-y-3">
        {GOVERNANCE_BODY.map((role, i) => {
          const Icon = role.icon;
          return (
            <div key={role.role} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${PRIMARY}10` }}>
                <Icon className="h-5 w-5" style={{ color: PRIMARY }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-800">{role.role}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-2">
          <Star className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Board Meetings</strong> are held quarterly to review institutional performance, approve budgets, and set strategic priorities. The Board includes representatives from the Ministry of Education, the founding religious body, parents, and the local community.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──── SCHOOL ANTHEM ──── */
function AnthemContent() {
  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl text-center" style={{ background: `linear-gradient(135deg, ${PRIMARY}08, ${GOLD}08)` }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${GOLD}20` }}>
          <Music className="h-8 w-8" style={{ color: GOLD }} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">St. Kizito&apos;s Technical Institute - Madera</p>
        <div className="max-w-lg mx-auto space-y-3 text-slate-700 leading-relaxed italic text-base">
          <p>
            St. Kizito&apos;s our great institute,
          </p>
          <p>
            Built on faith and solid ground,
          </p>
          <p>
            Madera stands with pride and honour,
          </p>
          <p>
            Where true skills and knowledge abound.
          </p>
          <br />
          <p>
            With hands and hearts we work together,
          </p>
          <p>
            In harmony and love united,
          </p>
          <p>
            To build our nation strong and brighter,
          </p>
          <p>
            Through technical skills, we are ignited.
          </p>
          <br />
          <p className="font-semibold not-italic" style={{ color: PRIMARY }}>
            Forward ever, backward never,
          </p>
          <p className="font-semibold not-italic" style={{ color: PRIMARY }}>
            St. Kizito&apos;s, we pledge to thee,
          </p>
          <p className="font-semibold not-italic" style={{ color: PRIMARY }}>
            Excellence in all we endeavour,
          </p>
          <p className="font-semibold not-italic" style={{ color: PRIMARY }}>
            For God and country, we are free.
          </p>
        </div>
        <p className="mt-6 text-xs text-slate-400">The school anthem is sung during official assemblies and ceremonies.</p>
      </div>
    </div>
  );
}
