'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  Clock,
  GraduationCap,
  Wrench,
  Award,
  Users,
  Phone,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  eventDate?: string | null;
  eventTime?: string | null;
  location?: string | null;
}

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  academic: { label: 'Academic', bg: '#eef2ff', text: '#1a3a6b' },
  showcase: { label: 'Showcase', bg: '#ecfdf5', text: '#065f46' },
  assessment: { label: 'Assessment', bg: '#fffbeb', text: '#92400e' },
  campus: { label: 'Campus', bg: '#f5f3ff', text: '#5b21b6' },
  general: { label: 'General', bg: '#f8fafc', text: '#475569' },
};

const PLACEHOLDER_EVENTS: EventItem[] = [
  {
    id: 'placeholder-1',
    title: 'Reporting & Orientation',
    description:
      'New student reporting day and orientation programme. Meet your instructors, tour the workshops, and get familiar with campus life at SKTIM.',
    category: 'academic',
    eventDate: '2025-02-10',
    eventTime: '08:00 AM',
    location: 'Main Hall, SKTIM Campus',
  },
  {
    id: 'placeholder-2',
    title: 'Skills Exhibition',
    description:
      'Annual exhibition showcasing student projects in building construction, automotive mechanics, electrical installation, plumbing, welding, and fashion design.',
    category: 'showcase',
    eventDate: '2025-06-15',
    eventTime: '09:00 AM',
    location: 'Workshop Grounds, SKTIM',
  },
  {
    id: 'placeholder-3',
    title: 'Assessment Milestones',
    description:
      'UVTAB/UBTEB theory and practical examinations. Students should ensure all registration requirements are completed before the deadline.',
    category: 'assessment',
    eventDate: '2025-08-20',
    eventTime: '08:30 AM',
    location: 'Examination Hall',
  },
  {
    id: 'placeholder-4',
    title: 'Community Activities',
    description:
      'Community outreach programmes including free repairs, health camps, and skills demonstrations for the local Madera community.',
    category: 'campus',
    eventDate: '2025-10-05',
    eventTime: '10:00 AM',
    location: 'SKTIM Campus & Madera Community',
  },
];

const PLACEHOLDER_ICONS: Record<string, React.ElementType> = {
  'placeholder-1': GraduationCap,
  'placeholder-2': Wrench,
  'placeholder-3': Award,
  'placeholder-4': Users,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'TBD';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'TBD';
  }
}

export default function EventsPage() {
  const { setCurrentPage } = useAppStore();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setEvents(json.data);
        } else {
          setEvents(PLACEHOLDER_EVENTS);
        }
      } catch {
        setEvents(PLACEHOLDER_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  function getCategoryStyle(cat: string) {
    return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.general;
  }

  function getEventIcon(ev: EventItem): React.ElementType {
    if (PLACEHOLDER_ICONS[ev.id]) return PLACEHOLDER_ICONS[ev.id];
    switch (ev.category) {
      case 'academic':
        return GraduationCap;
      case 'showcase':
        return Wrench;
      case 'assessment':
        return Award;
      case 'campus':
        return Users;
      default:
        return CalendarDays;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative py-20 md:py-28 px-4 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-10 left-10 w-64 h-64 rounded-full"
            style={{ background: GOLD, filter: 'blur(80px)' }}
          />\n          <div
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
            <CalendarDays className="mx-auto mb-6 w-14 h-14 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Upcoming Events
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Stay informed about academic calendar dates, exhibitions, assessments, and campus
              activities at SKTIM.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Events Grid ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: PRIMARY }} />
              <p className="text-sm text-gray-400">Loading events...</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {events.map((ev) => {
                const Icon = getEventIcon(ev);
                const catStyle = getCategoryStyle(ev.category);
                return (
                  <motion.div key={ev.id} variants={itemVariants}>
                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                      <CardContent className="p-6">
                        {/* Header row */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                            style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                            style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                          >
                            {catStyle.label}
                          </Badge>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{ev.title}</h3>
                        {ev.description && (
                          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                            {ev.description}
                          </p>
                        )}

                        {/* Meta info */}
                        <div className="space-y-2 pt-3 border-t border-gray-50">
                          {ev.eventDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                              {formatDate(ev.eventDate)}
                            </div>
                          )}
                          {ev.eventTime && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                              {ev.eventTime}
                            </div>
                          )}
                          {ev.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                              {ev.location}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA / Support Section ── */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
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
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Contact Us for Event Information
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                  Have questions about upcoming events, want to participate, or need more details?
                  Reach out to our administration team.
                </p>
                <Button
                  onClick={() => setCurrentPage('contact')}
                  size="lg"
                  className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: GOLD, color: PRIMARY }}
                >
                  Get in Touch
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
