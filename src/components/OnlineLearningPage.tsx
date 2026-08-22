'use client';

import { motion } from 'framer-motion';
import {
  MonitorPlay,
  BookOpen,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Library,
  ExternalLink,
  Info,
  Rocket,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const MAIN_FEATURES = [
  {
    icon: MonitorPlay,
    title: 'Live Sessions',
    description:
      'Attend real-time virtual classes with your instructors. Participate in demonstrations, ask questions, and engage with practical sessions streamed from our workshops.',
  },
  {
    icon: BookOpen,
    title: 'Course Materials',
    description:
      'Access lecture notes, video tutorials, workshop manuals, diagrams, and reference materials organised by module and week for each programme.',
  },
  {
    icon: ClipboardList,
    title: 'Assessments',
    description:
      'Complete quizzes, practical assignments, and mock examinations online. Get instant feedback and track your progress towards UVTAB/UBTEB certification.',
  },
];

const MORE_FEATURES = [
  {
    icon: MessageSquare,
    title: 'Discussion Forums',
    description:
      'Collaborate with classmates and instructors through topic-based discussion forums. Share ideas, ask questions, and learn together.',
  },
  {
    icon: BarChart3,
    title: 'Grade Book',
    description:
      'Track all your assessment scores, assignment grades, and overall performance in one consolidated grade book view.',
  },
  {
    icon: Library,
    title: 'Resource Library',
    description:
      'Browse a curated digital library of technical textbooks, standards documents, past papers, and industry publications.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function OnlineLearningPage() {
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
            className="absolute bottom-10 left-20 w-64 h-64 rounded-full"
            style={{ background: GOLD, filter: 'blur(80px)' }}
          />
          <div
            className="absolute top-10 right-10 w-48 h-48 rounded-full"
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
              Online Learning
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Access your courses, attend live sessions, and learn from anywhere with our
              dedicated Learning Management System.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Feature Cards ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              LMS Features
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              A comprehensive platform to support your technical education journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {MAIN_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Info Notice & Domain ── */}
      <section className="py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#fef9e7' }}
                  >
                    <Info className="w-6 h-6" style={{ color: '#92640a' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">LMS Portal Ready</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Access course materials, attend live sessions, and track your
                      academic progress through our dedicated Learning Management System.
                    </p>
                  </div>
                </div>

                {/* Domain display */}
                <div
                  className="rounded-lg p-4 flex items-center justify-between flex-wrap gap-4"
                  style={{ backgroundColor: `linear-gradient(135deg, ${PRIMARY}08, ${PRIMARY_LIGHT}08)` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">LMS Portal</p>
                      <p
                        className="text-sm sm:text-base font-mono font-semibold truncate"
                        style={{ color: PRIMARY }}
                      >
                        https://elearning.stkizitomadera.ac.ug
                      </p>
                    </div>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <a
                            href="https://elearning.stkizitomadera.ac.ug"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: PRIMARY }}
                          >
                            <Rocket className="w-4 h-4" />
                            Open LMS Portal
                          </a>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Opens the e-learning platform in a new tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── More Features ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
              Additional Features
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              More tools and resources planned for the learning platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {MORE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} variants={itemVariants}>
                  <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group relative">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: '#eef2ff' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: PRIMARY }} />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                          style={{
                            backgroundColor: '#fef9e7',
                            color: '#92640a',
                          }}
                        >
                          Coming Soon
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
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
