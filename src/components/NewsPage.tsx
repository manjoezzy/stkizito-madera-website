'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  CalendarDays,
  MapPin,
  Clock,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Camera,
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
  isBanner?: boolean;
  bannerUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  academic: { label: 'Academic', bg: '#eef2ff', text: '#1a3a6b' },
  showcase: { label: 'Showcase', bg: '#ecfdf5', text: '#065f46' },
  assessment: { label: 'Assessment', bg: '#fffbeb', text: '#92400e' },
  campus: { label: 'Campus', bg: '#f5f3ff', text: '#5b21b6' },
  openday: { label: 'Open Day', bg: '#fef3c7', text: '#92400e' },
  general: { label: 'General', bg: '#f8fafc', text: '#475569' },
  news: { label: 'News', bg: '#fef2f2', text: '#991b1b' },
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

export default function NewsPage() {
  const { setCurrentPage } = useAppStore();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [featuredExpanded, setFeaturedExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, galleryRes] = await Promise.all([
          fetch('/api/events?published=true'),
          fetch('/api/gallery?published=true'),
        ]);

        const eventsJson = await eventsRes.json();
        const galleryJson = await galleryRes.json();

        if (eventsJson.success && Array.isArray(eventsJson.data)) {
          setEvents(eventsJson.data);
        }
        if (galleryJson.success && Array.isArray(galleryJson.data)) {
          setGalleryItems(galleryJson.data);
        }
      } catch {
        // Silently fail - empty state will show
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build a map of event IDs to gallery images (using matching by category/date or just latest)
  const galleryImageMap = new Map<string, string>();
  galleryItems.forEach((item) => {
    if (item.imageUrl) {
      if (!galleryImageMap.has(item.category)) {
        galleryImageMap.set(item.category, item.imageUrl);
      }
    }
  });

  // Get image for an event: bannerUrl first, then matching gallery image
  function getEventImage(event: EventItem): string | null {
    if (event.bannerUrl) return event.bannerUrl;
    // Try to find a gallery image with matching category
    if (galleryImageMap.has(event.category)) {
      return galleryImageMap.get(event.category)!;
    }
    // Use first gallery image as fallback
    if (galleryItems.length > 0) {
      return galleryItems[0].imageUrl;
    }
    return null;
  }

  // Featured events: most recent 3 with images
  const eventsWithImages = events.filter((e) => getEventImage(e) !== null);
  const featuredEvents = eventsWithImages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // All events sorted by date
  const allEventsSorted = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Recent gallery items (last 6)
  const recentGallery = [...galleryItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  function getCategoryStyle(cat: string) {
    return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.general;
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFeaturedExpanded(id: string) {
    setFeaturedExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero / Header ── */}
      <section
        className="relative pt-[104px] lg:pt-[108px] pb-16 px-4 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
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
            <Badge
              className="mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
              style={{ backgroundColor: GOLD, color: PRIMARY }}
            >
              Latest News &amp; Updates
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              News &amp; Events
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Stay informed about the latest happenings, academic updates, and campus activities at
              St. Kizito&apos;s Technical Institute — Madera.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Empty State ── */}
      {events.length === 0 && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${PRIMARY}10` }}
              >
                <Newspaper className="w-10 h-10" style={{ color: PRIMARY, opacity: 0.5 }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No News Yet</h2>
              <p className="text-gray-500 mb-6">
                There are no published news or events at this time. Check back soon for the latest
                updates from St. Kizito&apos;s Technical Institute.
              </p>
              <Button
                onClick={() => setCurrentPage('home')}
                className="font-semibold"
                style={{ backgroundColor: PRIMARY, color: 'white' }}
              >
                Return to Home
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Featured News Section ── */}
      {featuredEvents.length > 0 && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured News</h2>
              <p className="text-gray-500 mt-2">The latest and most important updates from SKTIM.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, idx) => {
                const img = getEventImage(event);
                const catStyle = getCategoryStyle(event.category);
                const isExpanded = featuredExpanded.has(event.id);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      {/* Image */}
                      {img && (
                        <div className="relative w-full h-52 overflow-hidden">
                          <img
                            src={img}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          <Badge
                            className="absolute top-3 left-3 text-xs font-semibold shadow-sm"
                            style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                          >
                            {catStyle.label}
                          </Badge>
                        </div>
                      )}

                      <CardContent className="p-5">
                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(event.eventDate || event.createdAt)}
                          {event.location && (
                            <>
                              <span className="mx-1">·</span>
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[120px]">{event.location}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <div className="relative">
                          <p
                            className={`text-sm text-gray-500 leading-relaxed ${
                              isExpanded ? '' : 'line-clamp-3'
                            }`}
                          >
                            {event.description || 'No additional details available.'}
                          </p>
                        </div>

                        {/* Read More / Read Less */}
                        {event.description && event.description.length > 150 && (
                          <button
                            onClick={() => toggleFeaturedExpanded(event.id)}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                            style={{ color: PRIMARY }}
                          >
                            {isExpanded ? (
                              <>
                                Read Less <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Read More <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── All News Grid ── */}
      {events.length > 0 && (
        <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">All News &amp; Updates</h2>
              <p className="text-gray-500 mt-2">Browse all published news and event updates.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {allEventsSorted.map((event) => {
                const img = getEventImage(event);
                const catStyle = getCategoryStyle(event.category);
                const isExpanded = expandedIds.has(event.id);

                return (
                  <motion.div key={event.id} variants={itemVariants}>
                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      {/* Image or Placeholder */}
                      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
                        {img ? (
                          <img
                            src={img}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-300 mb-1" />
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Badge
                          className="absolute top-3 left-3 text-[11px] font-semibold shadow-sm"
                          style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                        >
                          {catStyle.label}
                        </Badge>
                      </div>

                      <CardContent className="p-4">
                        {/* Date & Meta */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(event.eventDate || event.createdAt)}
                          {event.eventTime && (
                            <>
                              <span className="mx-1">·</span>
                              <Clock className="w-3.5 h-3.5" />
                              {event.eventTime}
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <div>
                          <p
                            className={`text-sm text-gray-500 leading-relaxed ${
                              isExpanded ? '' : 'line-clamp-2'
                            }`}
                          >
                            {event.description || 'No additional details available.'}
                          </p>
                        </div>

                        {/* Read More / Read Less */}
                        {event.description && event.description.length > 100 && (
                          <button
                            onClick={() => toggleExpanded(event.id)}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
                            style={{ color: PRIMARY }}
                          >
                            {isExpanded ? (
                              <>
                                Read Less <ChevronUp className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                Read More <ChevronDown className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Photo Gallery Section ── */}
      {recentGallery.length > 0 && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Photo Gallery</h2>
                <p className="text-gray-500 mt-2">Recent photos from campus life and events.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage('gallery')}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {recentGallery.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => setCurrentPage('gallery')}
                    className="w-full text-left group"
                  >
                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                      </div>
                      {/* Camera icon overlay */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="w-4 h-4" style={{ color: PRIMARY }} />
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </p>
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile View All button */}
            <div className="mt-6 text-center sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage('gallery')}
                className="font-semibold"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                View Full Gallery
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
