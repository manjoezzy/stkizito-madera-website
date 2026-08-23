'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Camera,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const CATEGORIES = [
  { value: 'all', label: 'All Photos' },
  { value: 'outreach', label: 'Outreaches' },
  { value: 'sports', label: 'Sports' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'campus', label: 'Campus Life' },
  { value: 'openday', label: 'Open Day' },
  { value: 'general', label: 'General' },
];

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  eventDate: string | null;
  isPublished: boolean;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.set('category', activeCategory);
      const res = await fetch(`/api/gallery?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items;

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setSelectedIndex(filteredItems.findIndex((i) => i.id === item.id));
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % filteredItems.length
      : (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative pt-[104px] lg:pt-[108px] pb-16 md:pb-24 px-4 text-center overflow-hidden"
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
            <Camera className="mx-auto mb-6 w-14 h-14 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Photo Gallery
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Moments captured from our events, outreaches, graduation ceremonies,
              and daily life at St. Kizito&apos;s Technical Institute - Madera.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={
                  activeCategory === cat.value
                    ? { background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }
                    : undefined
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No Photos Yet
              </h3>
              <p className="text-slate-400">
                Check back soon as we upload photos from our latest events and activities.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeCategory}
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-white/80 text-xs line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          color: PRIMARY,
                        }}
                      >
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev button */}
            {filteredItems.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
                className="absolute left-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Next button */}
            {filteredItems.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
                className="absolute right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Image + Info */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[70vh]">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  width={1200}
                  height={800}
                  className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-white text-lg font-semibold">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="text-white/70 text-sm mt-1">
                    {selectedItem.description}
                  </p>
                )}
                <div className="flex items-center justify-center gap-4 mt-3 text-white/50 text-xs">
                  {selectedItem.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {selectedItem.eventDate}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${GOLD}33`,
                        color: GOLD,
                        borderColor: 'transparent',
                      }}
                    >
                      {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                    </Badge>
                  </span>
                </div>
                <p className="text-white/30 text-xs mt-2">
                  {selectedIndex + 1} of {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
