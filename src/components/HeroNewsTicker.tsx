'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Tag, Clock, MapPin } from 'lucide-react';
import { useAppStore, type Page } from '@/store/useAppStore';

export interface HeroEventItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  eventDate: string | null;
  eventTime: string | null;
  location: string | null;
}

export default function HeroNewsTicker({ events }: { events: HeroEventItem[] }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (events.length <= 1) return;
    const delay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % events.length);
      }, 5000);
    }, 6000);
    return () => {
      clearTimeout(delay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [events.length]);

  if (events.length === 0) return null;

  const item = events[current];
  const isNews = item.category === 'general' || item.category === 'news';
  const isUpcoming = item.eventDate && new Date(item.eventDate) >= new Date();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5 }}
        className="mt-8 max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            {isUpcoming && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full">
                <Calendar className="size-3" /> Upcoming
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#f5c518]/20 text-[#f5c518] px-2.5 py-0.5 rounded-full">
              <Tag className="size-3" /> {isNews ? 'News' : item.category}
            </span>
            {item.eventDate && (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <Clock className="size-3" /> {item.eventDate}
                {item.eventTime && ` at ${item.eventTime}`}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-1.5">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-3">
              {item.description.length > 160 ? item.description.slice(0, 160) + '...' : item.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            {item.location && (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <MapPin className="size-3" /> {item.location}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              {events.length > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  {events.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current ? 'w-6 bg-[#f5c518]' : 'w-3 bg-white/25 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  const page: Page = isNews ? 'news' : 'events';
                  useAppStore.getState().setCurrentPage(page);
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#f5c518] hover:text-[#f5c518]/80 transition-colors group"
              >
                Read More
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
