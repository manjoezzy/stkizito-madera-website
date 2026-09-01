'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Building2,
  Wrench,
  Zap,
  Droplets,
  Cog,
  TreePine,
  Scissors,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Tag,
  Send,
  ChevronRight,
  ChevronLeft,
  Star,
  Quote,
  Facebook,
  Twitter,
  Youtube,
  CheckCircle,
  Sparkles,
  Target,
  Award,
  Shield,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppStore, type Page } from '@/store/useAppStore';
import Image from 'next/image';
import { type HeroEventItem } from '@/components/HeroNewsTicker';

/* ──────────────────── programme data ──────────────────── */
const PROGRAMS = [
  { name: 'Building Construction', icon: Building2 },
  { name: 'Automotive Mechanics', icon: Wrench },
  { name: 'Electrical Installation', icon: Zap },
  { name: 'Plumbing', icon: Droplets },
  { name: 'Machining and Fitting', icon: Cog },
  { name: 'Woodwork Technology', icon: TreePine },
  { name: 'Fashion and Design', icon: Scissors },
] as const;

/* ──────────────────── stats data ──────────────────── */
const STATS = [
  { value: 77, suffix: '+', label: 'Years of Excellence', icon: Award },
  { value: 2000, suffix: '+', label: 'Graduates', icon: Users },
  { value: 6, suffix: '+', label: 'Programs Offered', icon: BookOpen },
  { value: 95, suffix: '%', label: 'Employment Rate', icon: TrendingUp },
] as const;

/* ──────────────────── testimonials ──────────────────── */
const TESTIMONIALS = [
  {
    name: 'James Otim',
    program: 'Building Construction',
    year: 'Class of 2022',
    photo: '/images/testimonial-male1.png',
    quote:
      'St. Kizito\'s gave me the practical skills I needed to start my own construction business. Today I employ 12 people and have worked on major projects across Eastern Uganda.',
  },
  {
    name: 'Grace Akello',
    program: 'Fashion and Design',
    year: 'Class of 2023',
    photo: '/images/testimonial-female1.png',
    quote:
      'The hands-on training in fashion design transformed my passion into a profession. I now run a successful tailoring workshop in Soroti town, serving clients across the region.',
  },
  {
    name: 'Simon Peter Elobu',
    program: 'Automotive Mechanics',
    year: 'Class of 2021',
    photo: '/images/testimonial-male2.png',
    quote:
      'The quality of instruction at St. Kizito\'s is unmatched. Within three months of graduating, I was employed at a leading garage in Kampala. The foundation I received here is invaluable.',
  },
];

/* ──────────────────── hero rotation ──────────────────── */
const HERO_SLIDE_MS = 15000;

/* ──────────────────── quick links ──────────────────── */
const QUICK_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Programs', page: 'programs' },
  { label: 'Admissions', page: 'admissions' },
  { label: 'Student Portal', page: 'student-portal' },
  { label: 'Events', page: 'events' },
  { label: 'Contact', page: 'contact' },
];

/* ══════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ══════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return count;
}

/* ══════════════════════════════════════════════════════
   SECTION WRAPPER - shared fade-in animation
   ══════════════════════════════════════════════════════ */
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function HomePage() {
  const { currentPage, setCurrentPage, addToast, setFocusEventId } = useAppStore();
  const [statsVisible, setStatsVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [heroEvents, setHeroEvents] = useState<HeroEventItem[]>([]);
  const [heroPhotos, setHeroPhotos] = useState<string[]>([]);

  // Hero slide rotation state
  const [heroSlide, setHeroSlide] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroTimerStartRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build slides array: default first, then banner-flagged events, then most recent (max 5)
  const heroSlides = (() => {
    const defaultSlide = { type: 'default' as const };
    const eventSlides = [...heroEvents]
      .sort((a, b) => (b.isBanner ? 1 : 0) - (a.isBanner ? 1 : 0))
      .filter(e => e.bannerUrl || heroPhotos.length > 0)
      .slice(0, 5)
      .map((e, i) => ({
        type: 'event' as const,
        event: e,
        // Use event's bannerUrl, or cycle through gallery photos
        bgImage: e.bannerUrl || heroPhotos[i % heroPhotos.length] || '/images/campus.png',
      }));
    return [defaultSlide, ...eventSlides];
  })();
  const totalHeroSlides = heroSlides.length;

  // Safeguard: reset slide if out of bounds
  useEffect(() => {
    if (heroSlide >= totalHeroSlides) setHeroSlide(0);
  }, [heroSlide, totalHeroSlides]);

  const restartHeroTimer = () => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    if (heroTimerStartRef.current) clearTimeout(heroTimerStartRef.current);
    heroTimerStartRef.current = setTimeout(() => {
      heroTimerRef.current = setInterval(() => {
        setHeroSlide(prev => (prev + 1) % totalHeroSlides);
      }, HERO_SLIDE_MS);
    }, HERO_SLIDE_MS);
  };

  const goHeroSlide = (index: number) => {
    setHeroSlide((index + totalHeroSlides) % totalHeroSlides);
    restartHeroTimer();
  };

  // Auto-rotate slides
  useEffect(() => {
    if (totalHeroSlides <= 1) return;
    restartHeroTimer();
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      if (heroTimerStartRef.current) clearTimeout(heroTimerStartRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalHeroSlides]);

  // Fetch latest published events/news
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setHeroEvents(data.data);
          }
        }
      } catch {
        // Silent fail
      }
    })();
  }, []);

  // Fetch gallery images for fallback backgrounds
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const urls = data.data
              .filter((g: { imageUrl: string }) => !!g.imageUrl)
              .map((g: { imageUrl: string }) => g.imageUrl);
            if (urls.length > 0) setHeroPhotos(urls);
          }
        }
      } catch {
        // Silent fail
      }
    })();
  }, []);

  // Scroll to contact section when navigating to 'contact' page
  useEffect(() => {
    if (currentPage === 'contact') {
      const timer = setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Trigger stats counter animation when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stat0 = useCountUp(STATS[0].value, 2000, statsVisible);
  const stat1 = useCountUp(STATS[1].value, 2200, statsVisible);
  const stat2 = useCountUp(STATS[2].value, 1800, statsVisible);
  const stat3 = useCountUp(STATS[3].value, 2000, statsVisible);
  const counts = [stat0, stat1, stat2, stat3];

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        addToast('Message sent successfully! We will get back to you soon.', 'success');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        addToast('Failed to send message. Please try again.', 'error');
      }
    } catch {
      addToast('Network error. Please check your connection.', 'error');
    } finally {
      setContactSubmitting(false);
    }
  };

  /* ──────────── floating circles ──────────── */
  const floatingCircles = [
    { size: 320, x: '10%', y: '20%', delay: 0, duration: 18 },
    { size: 200, x: '80%', y: '10%', delay: 2, duration: 22 },
    { size: 260, x: '70%', y: '65%', delay: 4, duration: 20 },
    { size: 140, x: '20%', y: '75%', delay: 1, duration: 16 },
    { size: 100, x: '50%', y: '40%', delay: 3, duration: 24 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ─────────────────────────────────────────────────
          1. HERO SECTION — Makerere-style: default + full-bleed event slides
          ───────────────────────────────────────────────── */}
      <section id="hero-section" className="relative min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides[heroSlide]?.type === 'default' ? (
            /* ─── DEFAULT SLIDE ─── */
            <motion.div
              key="default-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pt-[100px] lg:pt-[112px]"
            >
              {/* dark gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #0d1b2a 0%, #1a3a6b 40%, #2756a0 70%, #1a3a6b 100%)',
                }}
              />
              {/* animated floating decorative circles */}
              {floatingCircles.map((c, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: c.size,
                    height: c.size,
                    left: c.x,
                    top: c.y,
                    background: `radial-gradient(circle, rgba(245,197,24,${0.06 + i * 0.02}) 0%, transparent 70%)`,
                  }}
                  animate={{
                    y: [0, -30, 10, -20, 0],
                    x: [0, 15, -10, 20, 0],
                    scale: [1, 1.05, 0.95, 1.02, 1],
                  }}
                  transition={{
                    duration: c.duration,
                    repeat: Infinity,
                    delay: c.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
              {/* subtle grid overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />
              {/* campus photo underlay */}
              <div className="absolute inset-0 opacity-40">
                <Image src="/images/campus.png" alt="SKTM Campus" fill className="object-cover" priority />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/50 via-[#1a3a6b]/30 to-[#0d1b2a]/60" />

              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 border border-[#f5c518]/30 bg-[#f5c518]/10"
                >
                  <Sparkles className="h-4 w-4 text-[#f5c518]" />
                  <span className="text-[#f5c518] text-sm font-medium tracking-wide">
                    Government-Aided TVET Institution
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]"
                >
                  Building Skills,
                  <br />
                  <span className="text-[#f5c518]">Transforming Lives</span>
                  <br />
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold opacity-90">
                    St. Kizito&apos;s Technical Institute - Madera
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-6 text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
                >
                  Empowering the next generation with quality Technical and Vocational
                  Education and Training (TVET) - grounded in excellence, faith, and
                  practical skill development.
                </motion.p>
              </div>
            </motion.div>
          ) : (
            /* ─── EVENT SLIDE (Makerere-style: full-bleed photo + dark overlay + text at bottom) ─── */
            <motion.div
              key={heroSlides[heroSlide]?.event?.id || `event-${heroSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Full-bleed background photo */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${heroSlides[heroSlide]?.bgImage})`,
                }}
              />
              {/* Dark gradient overlay (heavier at bottom for text readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-[#0a0f1a]/30" />
              {/* Additional bottom gradient for text area */}
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-24">
                <div className="max-w-4xl">
                  {/* Category badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {heroSlides[heroSlide]?.event?.eventDate &&
                      new Date(heroSlides[heroSlide].event.eventDate) >= new Date() && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          <Calendar className="size-3" /> Upcoming
                        </span>
                      )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#f5c518]/25 text-[#f5c518] px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <Tag className="size-3" /> {heroSlides[heroSlide]?.event?.category === 'general' || heroSlides[heroSlide]?.event?.category === 'news' ? 'News' : heroSlides[heroSlide]?.event?.category}
                    </span>
                    {heroSlides[heroSlide]?.event?.eventDate && (
                      <span className="text-[11px] text-white/60 flex items-center gap-1">
                        <Clock className="size-3" /> {heroSlides[heroSlide].event.eventDate}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                    {heroSlides[heroSlide]?.event?.title}
                  </h2>

                  {/* Description */}
                  {heroSlides[heroSlide]?.event?.description && (
                    <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl mb-5 line-clamp-2">
                      {heroSlides[heroSlide].event.description.length > 200
                        ? heroSlides[heroSlide].event.description.slice(0, 200) + '...'
                        : heroSlides[heroSlide].event.description}
                    </p>
                  )}

                  {/* Read More button on the right */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        const evt = heroSlides[heroSlide]?.event;
                        if (!evt) return;
                        setFocusEventId(evt.id);
                        setCurrentPage('news');
                      }}
                      className="pointer-events-auto inline-flex items-center gap-2 bg-[#f5c518] hover:bg-[#f5c518]/90 text-[#0d1b2a] font-semibold px-6 py-2.5 rounded-lg transition-all hover:scale-105 text-sm"
                    >
                      Read More
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation dots */}
        {totalHeroSlides > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((slide, i) => (
              <button
                key={i}
                onClick={() => goHeroSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === heroSlide
                    ? 'w-8 bg-[#f5c518]'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* scroll hint — only on default slide */}
        {heroSlide === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-[#f5c518] rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Side click zones — prev / next slide */}
        {totalHeroSlides > 1 && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => goHeroSlide(heroSlide - 1)}
              className="absolute left-0 top-0 bottom-0 w-1/4 z-[5] group flex items-center"
            >
              <ChevronLeft className="size-7 sm:size-9 text-white/30 group-hover:text-white/90 transition-colors ml-1 sm:ml-3" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => goHeroSlide(heroSlide + 1)}
              className="absolute right-0 top-0 bottom-0 w-1/4 z-[5] group flex items-center justify-end"
            >
              <ChevronRight className="size-7 sm:size-9 text-white/30 group-hover:text-white/90 transition-colors mr-1 sm:mr-3" />
            </button>
          </>
        )}
      </section>

      {/* ─────────────────────────────────────────────────
          2. STATS SECTION
          ───────────────────────────────────────────────── */}
      <section id="stats-section" className="relative -mt-16 z-20 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="bg-white rounded-xl shadow-xl shadow-black/10 p-4 md:p-5 text-center border border-slate-100">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1a3a6b]/10 mb-2">
                      <Icon className="h-5 w-5 text-[#1a3a6b]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#1a3a6b]">
                      {counts[i]}
                      <span className="text-[#f5c518]">{stat.suffix}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          3. WELCOME / ABOUT SECTION
          ───────────────────────────────────────────────── */}
      <Section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* left - campus photo */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#1a3a6b]/20">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#1a3a6b] to-[#f5c518] rounded-3xl opacity-20 blur-sm" />
              <div className="relative aspect-[4/3] max-w-md mx-auto">
                <Image
                  src="/images/about-workshop.png"
                  alt="Students in the workshop at St. Kizito's Technical Institute - Madera"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
            {/* floating accent card */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f5c518]/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-[#f5c518]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a3a6b]">77+</p>
                  <p className="text-xs text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>

          {/* right - text */}
          <div>
            <div className="inline-flex items-center gap-2 text-[#f5c518] font-semibold text-sm uppercase tracking-widest mb-4">
              <Heart className="h-4 w-4" />
              Welcome to SKTM
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b] leading-tight">
              A Legacy of Excellence in Technical Education
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-base">
              Established in <strong className="text-[#1a3a6b]">1947</strong>, St. Kizito&apos;s
              Technical Institute - Madera is a government-aided technical institute
              anchored on Christian principles. We are committed to providing
              quality Technical and Vocational Education and Training (TVET) that
              equips learners with practical, market-relevant skills.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base">
              Located in Soroti City, Eastern Uganda, we have produced
              thousands of skilled professionals who are driving development across
              Uganda and beyond. Our programs are designed to meet the demands of
              today&apos;s labour market while nurturing ethical, responsible citizens.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {[Target, Shield, Award, Users].map((Icon, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#1a3a6b]" />
                  </div>
                  <span className="text-sm font-medium text-[#1a3a6b]">
                    {['Practical Training', 'Christian Values', 'Certified', 'Industry Ready'][i]}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setCurrentPage('about')}
              className="mt-8 bg-[#1a3a6b] hover:bg-[#2756a0] text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          4. PROGRAMS SHOWCASE
          ───────────────────────────────────────────────── */}
      <Section className="py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#f5c518] font-semibold text-sm uppercase tracking-widest mb-3">
              <BookOpen className="h-4 w-4" />
              Our Programs
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b]">
              Explore Our TVET Programs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Industry-aligned certificate and diploma programs designed to give
              you the hands-on skills employers demand.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div
                  key={prog.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Card className="group h-full border border-slate-200/80 rounded-2xl hover:border-[#1a3a6b]/20 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                    {/* top accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#1a3a6b] via-[#2756a0] to-[#f5c518]" />
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a3a6b] to-[#2756a0] flex items-center justify-center shadow-lg shadow-[#1a3a6b]/20 mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-[#f5c518]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1a3a6b] mb-1">
                        {prog.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        Comprehensive hands-on training leading to a recognized
                        TVET qualification.
                      </p>
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-[#f5c518] font-semibold uppercase tracking-wider">
                            Fees
                          </p>
                          <p className="text-sm font-medium text-muted-foreground">
                            Contact Administration
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setCurrentPage('admissions')}
                          className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white font-semibold rounded-lg transition-all hover:scale-105"
                        >
                          Apply
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage('programs')}
              className="border-2 border-[#1a3a6b]/20 text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              View All Programs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          5. CAMPUS PHOTO STRIP
          ───────────────────────────────────────────────── */}
      <Section className="py-12 md:py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#f5c518] font-semibold text-sm uppercase tracking-widest mb-3">
              <Heart className="h-4 w-4" />
              Life at SKTM
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b]">
              Our Campus in Pictures
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/campus.png', alt: 'Campus grounds' },
              { src: '/images/graduation.png', alt: 'Graduation ceremony' },
              { src: '/images/gallery-openday.png', alt: 'Open day celebrations' },
              { src: '/images/gallery-outreach.png', alt: 'Community outreach' },
            ].map((img, i) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                onClick={() => setCurrentPage('gallery')}
              >
                <div className={`relative ${i === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{img.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage('gallery')}
              className="border-2 border-[#1a3a6b]/20 text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              View Full Gallery
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          6. ADMISSIONS CTA BANNER
          ───────────────────────────────────────────────── */}
      <Section className="px-4 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden px-6 py-14 sm:px-12 sm:py-20 text-center"
            style={{
              background:
                'linear-gradient(135deg, #1a3a6b 0%, #2756a0 50%, #1a3a6b 100%)',
            }}
          >
            {/* decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#f5c518]/5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#f5c518]/5 translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 right-10 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 overflow-hidden">
                <Image src="/images/institute-logo.jpg" alt="SKTM" width={64} height={64} className="object-contain w-full h-full" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Build Your Future?
              </h2>
              <p className="mt-4 text-blue-100/80 max-w-xl mx-auto text-lg">
                Applications are now open for the {new Date().getFullYear()} intake.
                Secure your spot and start your journey toward a rewarding career.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('admissions')}
                  className="bg-[#f5c518] hover:bg-[#e0b300] text-[#1a3a6b] font-bold text-base px-8 py-6 rounded-lg shadow-lg shadow-[#f5c518]/20 transition-all hover:scale-105"
                >
                  Start Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentPage('contact')}
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 rounded-lg transition-all"
                >
                  Ask a Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          6. TESTIMONIALS
          ───────────────────────────────────────────────── */}
      <Section className="py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#f5c518] font-semibold text-sm uppercase tracking-widest mb-3">
              <Star className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b]">
              What Our Graduates Say
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Hear from the men and women whose lives were transformed through
              training at St. Kizito&apos;s.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border border-slate-200/80 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="h-10 w-10 text-[#f5c518]/40 mb-4" />
                    <p className="text-muted-foreground leading-relaxed flex-1 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={t.photo}
                          alt={t.name}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a3a6b] text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.program} &middot; {t.year}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          7. CONTACT SECTION
          ───────────────────────────────────────────────── */}
      <Section className="py-20 md:py-28 px-4" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#f5c518] font-semibold text-sm uppercase tracking-widest mb-3">
              <Mail className="h-4 w-4" />
              Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b]">
              Contact Us
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            {/* contact info - 2 cols */}
            <div className="md:col-span-2 space-y-6">
              {[
                {
                  icon: MapPin,
                  label: 'Address',
                  value: 'P.O. Box 320, Soroti City,\nUganda',
                },
                {
                  icon: Phone,
                  label: 'Institute Lines',
                  value: '+256 752 309 660\n+256 772 309 660',
                },
                {
                  icon: Phone,
                  label: 'Principal',
                  value: '+256 772 383 391',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'stkizitmad@gmail.com',
                },
                {
                  icon: Clock,
                  label: 'Office Hours',
                  value: 'Mon - Fri: 8:00 AM - 5:00 PM',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[#1a3a6b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a3a6b]">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* contact form - 3 cols */}
            <div className="md:col-span-3">
              <Card className="border border-slate-200/80 rounded-2xl shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-sm font-medium text-[#1a3a6b]">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-name"
                          placeholder="John Doe"
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm((f) => ({ ...f, name: e.target.value }))
                          }
                          className="rounded-lg border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-sm font-medium text-[#1a3a6b]">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((f) => ({ ...f, email: e.target.value }))
                          }
                          className="rounded-lg border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="text-sm font-medium text-[#1a3a6b]">
                          Phone Number
                        </Label>
                        <Input
                          id="contact-phone"
                          placeholder="+256 7XX XXX XXX"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          className="rounded-lg border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject" className="text-sm font-medium text-[#1a3a6b]">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-subject"
                          placeholder="How can we help?"
                          required
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm((f) => ({ ...f, subject: e.target.value }))
                          }
                          className="rounded-lg border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-sm font-medium text-[#1a3a6b]">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Tell us more about your inquiry..."
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="rounded-lg border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full sm:w-auto bg-[#1a3a6b] hover:bg-[#2756a0] text-white font-semibold px-8 py-3 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-60"
                    >
                      {contactSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────
          8. FOOTER
          ───────────────────────────────────────────────── */}
      <footer className="mt-auto bg-[#0d1b2a] text-white relative overflow-hidden">
        {/* Footer background image underlay */}
        <div className="absolute inset-0">
          <Image src="/images/campus.png" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-[#0d1b2a]/65" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* brand column */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <Image src="/images/institute-logo.jpg" alt="SKTM Logo" width={40} height={40} className="object-contain w-full h-full" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight text-white">
                    St. Kizito&apos;s
                  </h3>
                  <p className="text-xs text-blue-100">Technical Institute - Madera</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">
                Building skills and transforming lives since 1947. A government-aided
                TVET institution anchored on Christian principles in Soroti City,
                Eastern Uganda.
              </p>
              {/* social links */}
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#f5c518] hover:text-[#1a3a6b] flex items-center justify-center transition-all duration-200"
                    aria-label="Social media"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* quick links */}
            <div>
              <h4 className="font-semibold text-base mb-5 text-[#f5c518]">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="flex items-center gap-2 text-sm text-blue-100 hover:text-[#f5c518] transition-colors group"
                    >
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* programs column */}
            <div>
              <h4 className="font-semibold text-base mb-5 text-[#f5c518]">
                Our Programs
              </h4>
              <ul className="space-y-3">
                {PROGRAMS.map((prog) => (
                  <li key={prog.name}>
                    <button
                      onClick={() => setCurrentPage('programs')}
                      className="flex items-center gap-2 text-sm text-blue-100 hover:text-[#f5c518] transition-colors group"
                    >
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {prog.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-blue-100">
              &copy; {new Date().getFullYear()} St. Kizito&apos;s Technical Institute - Madera.
              All rights reserved.
            </p>
            <p className="text-xs text-blue-100/80">
              Crafted with <Heart className="inline h-3 w-3 text-[#f5c518]" /> for
              excellence in TVET education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
