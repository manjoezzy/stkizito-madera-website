'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Wrench,
  Zap,
  Droplets,
  Flame,
  Scissors,
  ArrowRight,
  CheckCircle,
  HandMetal,
  Award,
  Link2,
  Heart,
  GraduationCap,
  Clock,
  UtensilsCrossed,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { PROGRAMME_FEES, formatCurrency } from '@/lib/schoolpay';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

interface Programme {
  name: string;
  icon: React.ElementType;
  duration: string;
  examiningBody: string;
  feeKey: string;
  skills: string[];
}

const MAIN_PROGRAMMES: Programme[] = [
  {
    name: 'Building Construction',
    icon: Building2,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Building Construction',
    skills: [
      'Masonry & Bricklaying',
      'Concrete Technology',
      'Site Surveying & Setting Out',
      'Building Drawing & Plan Reading',
      'Cost Estimation & Quantities',
      'Safety & Site Management',
    ],
  },
  {
    name: 'Automotive Mechanics',
    icon: Wrench,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Automotive Mechanics',
    skills: [
      'Engine Diagnostics & Repair',
      'Transmission Systems',
      'Brake & Suspension Systems',
      'Electrical & Electronic Systems',
      'Fuel Injection Systems',
      'Vehicle Servicing & Maintenance',
    ],
  },
  {
    name: 'Electrical Installation',
    icon: Zap,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Electrical Installation',
    skills: [
      'Domestic & Industrial Wiring',
      'Circuit Design & Protection',
      'Motor Controls & Starters',
      'Generator & Transformer Systems',
      'Electrical Safety Standards',
      'Solar PV Installation',
    ],
  },
  {
    name: 'Plumbing',
    icon: Droplets,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Plumbing',
    skills: [
      'Pipe Fitting & Jointing',
      'Water Supply Systems',
      'Drainage & Sewer Systems',
      'Sanitary Appliances Installation',
      'Hot Water Systems',
      'Water Treatment Basics',
    ],
  },
  {
    name: 'Welding',
    icon: Flame,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Welding',
    skills: [
      'Arc Welding (SMAW)',
      'Gas Welding & Cutting',
      'MIG/TIG Welding',
      'Metal Fabrication',
      'Blueprint Reading',
      'Welding Inspection & Quality',
    ],
  },
  {
    name: 'Fashion and Design',
    icon: Scissors,
    duration: '2 Years',
    examiningBody: 'UVTAB/UBTEB',
    feeKey: 'Fashion and Design',
    skills: [
      'Pattern Making & Drafting',
      'Garment Construction',
      'Fabric Selection & Textiles',
      'Fashion Illustration',
      'Embroidery & Decorations',
      'Business of Fashion',
    ],
  },
];

interface ShortCourse {
  name: string;
  icon: React.ElementType;
  duration: string;
  feeKey: string;
  skills: string[];
}

const SHORT_COURSES: ShortCourse[] = [
  {
    name: 'Basic Electrical Skills',
    icon: Zap,
    duration: '3 Months',
    feeKey: 'Short Course - Electrical',
    skills: ['Domestic Wiring', 'Circuit Testing', 'Safety Procedures', 'Basic Repairs'],
  },
  {
    name: 'Tailoring & Garment Construction',
    icon: Scissors,
    duration: '6 Months',
    feeKey: 'Short Course - Tailoring',
    skills: ['Machine Operation', 'Pattern Drafting', 'Garment Assembly', 'Measurements & Fitting'],
  },
  {
    name: 'Motor Vehicle Repair',
    icon: Car,
    duration: '3 Months',
    feeKey: 'Short Course - Motor Vehicle',
    skills: ['Engine Servicing', 'Brake Repair', 'Electrical Systems', 'General Maintenance'],
  },
  {
    name: 'Catering & Hotel Management',
    icon: UtensilsCrossed,
    duration: '6 Months',
    feeKey: 'Short Course - Catering',
    skills: ['Food Preparation', 'Baking & Pastry', 'Hygiene & Safety', 'Customer Service'],
  },
];

const WHY_CHOOSE = [
  {
    icon: HandMetal,
    title: 'Hands-on Training',
    description: '80% practical training with real tools, equipment, and workshop environments that mirror industry standards.',
  },
  {
    icon: Award,
    title: 'Certified Qualifications',
    description: 'All programmes are examined by UVTAB and UBTEB, ensuring nationally recognised certificates upon completion.',
  },
  {
    icon: Link2,
    title: 'Industry Connections',
    description: 'Strong partnerships with local and national employers provide internship and job placement opportunities.',
  },
  {
    icon: Heart,
    title: 'Christian Values',
    description: 'Education rooted in moral integrity, discipline, and service to community - building responsible citizens.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProgramsPage() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative py-20 md:py-28 px-4 text-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-10 left-10 w-64 h-64 rounded-full"
            style={{ background: GOLD, filter: 'blur(80px)' }}
          />
          <div
            className="absolute bottom-10 right-10 w-48 h-48 rounded-full"
            style={{ background: GOLD, filter: 'blur(60px)' }}
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
              Our Programs
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Vocational and technical education designed to equip you with practical skills
              for a successful career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Programmes ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Diploma & Certificate Programmes
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              Two-year programmes examined by UVTAB/UBTEB leading to nationally recognised qualifications.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {MAIN_PROGRAMMES.map((prog) => {
              const Icon = prog.icon;
              const fee = PROGRAMME_FEES[prog.feeKey] ?? 0;
              return (
                <motion.div key={prog.name} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {prog.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                              style={{ backgroundColor: '#eef2ff', color: PRIMARY }}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {prog.duration}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                              style={{ backgroundColor: '#fef9e7', color: '#92640a' }}
                            >
                              {prog.examiningBody}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Tuition Fee</span>
                        <p className="text-lg font-bold" style={{ color: PRIMARY }}>
                          {formatCurrency(fee)}
                        </p>
                        <span className="text-xs text-gray-400">per academic year</span>
                      </div>

                      {/* Skills */}
                      <div className="flex-1 mb-5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Key Skills
                        </p>
                        <ul className="space-y-1.5">
                          {prog.skills.map((skill) => (
                            <li key={skill} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle
                                className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                                style={{ color: GOLD }}
                              />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Button */}
                      <Button
                        onClick={() => setCurrentPage('admissions')}
                        className="w-full group-hover:shadow-md transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`,
                        }}
                      >
                        Apply for this Program
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Short Courses ── */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Short Courses
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              Practical short courses ranging from 3 to 6 months for quick skill acquisition.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {SHORT_COURSES.map((course) => {
              const Icon = course.icon;
              const fee = PROGRAMME_FEES[course.feeKey] ?? 0;
              return (
                <motion.div key={course.name} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                        style={{ backgroundColor: '#fef9e7' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: '#92640a' }} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{course.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs" style={{ borderColor: GOLD, color: '#92640a' }}>
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: PRIMARY }}>
                        {formatCurrency(fee)}
                      </p>
                      <span className="text-xs text-gray-400 mb-4">per course</span>

                      <ul className="flex-1 space-y-1.5 mb-5">
                        {course.skills.map((skill) => (
                          <li key={skill} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                            {skill}
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => setCurrentPage('admissions')}
                        variant="outline"
                        className="w-full"
                        style={{ borderColor: PRIMARY, color: PRIMARY }}
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose SKTIM ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Why Choose SKTIM?
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              Discover what makes St. Kizito&apos;s Technical Institute - Madera the right choice for your education.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {WHY_CHOOSE.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
