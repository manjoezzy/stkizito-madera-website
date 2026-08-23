'use client';

import { useAppStore, type Page } from '@/store/useAppStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Home, BookOpen, ClipboardList,
  User, Calendar, Phone, Shield, ChevronDown, Laptop, ImageIcon, Info, Users, GraduationCap
} from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS: { label: string; page: Page; icon?: React.ReactNode }[] = [
  { label: 'Home', page: 'home', icon: <Home size={15} /> },
  { label: 'Programs', page: 'programs', icon: <BookOpen size={15} /> },
  { label: 'Admissions', page: 'admissions', icon: <ClipboardList size={15} /> },
  { label: 'Gallery', page: 'gallery', icon: <ImageIcon size={15} /> },
  { label: 'Events', page: 'events', icon: <Calendar size={15} /> },
  { label: 'Alumni', page: 'alumni', icon: <Users size={15} /> },
  { label: 'Graduation', page: 'graduation', icon: <GraduationCap size={15} /> },
  { label: 'Contact', page: 'contact', icon: <Phone size={15} /> },
];

const ABOUT_DROPDOWN: { label: string; section: string }[] = [
  { label: 'Vision & Mission', section: 'vision' },
  { label: 'Core Values', section: 'values' },
  { label: 'Organogram', section: 'organogram' },
  { label: 'Governance', section: 'governance' },
  { label: 'School Anthem', section: 'anthem' },
];

const DROPDOWN_ITEMS: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Student Portal', page: 'student-portal', icon: <User size={15} /> },
  { label: 'Online Learning', page: 'online-learning', icon: <Laptop size={15} /> },
  { label: 'Admin Login', page: 'admin-login', icon: <Shield size={15} /> },
];

export default function Navigation() {
  const { currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const isTransp = !scrolled && currentPage === 'home';

  return (
    <>
      {/* ═══════════════════════════════════════════
          TOP BAR  –  Logo  +  Institute Name  +  Apply
          ═══════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
            : currentPage !== 'home'
              ? 'bg-white shadow-sm'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo + Name */}
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2.5 group shrink-0">
              <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center overflow-hidden ${scrolled || currentPage !== 'home' ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'} transition-all` }>
                <Image src="/images/institute-logo.jpg" alt="SKTM Logo" width={44} height={44} className="object-contain w-full h-full" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-sm font-bold leading-tight whitespace-nowrap ${scrolled || currentPage !== 'home' ? 'text-[#1a3a6b]' : 'text-white'} transition-colors`}>
                  St. Kizito&apos;s Technical Institute &ndash; Madera
                </h1>
                <p className={`text-[9px] lg:text-[10px] font-medium ${scrolled || currentPage !== 'home' ? 'text-[#f5c518]' : 'text-amber-300'} transition-colors`}>
                  Building Skills, Transforming Lives
                </p>
              </div>
            </button>

            {/* Apply Now – top-right */}
            <button
              onClick={() => setCurrentPage('admissions')}
              className="hidden lg:flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#1a3a6b] to-[#2756a0] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#1a3a6b]/25 hover:-translate-y-0.5 transition-all shrink-0"
            >
              <ClipboardList size={15} />
              Apply Now
            </button>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${isTransp ? 'text-white' : 'text-slate-900'}`}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════
          SECONDARY BAR  –  Nav links (left)  +  About & Portals (right)
          ═══════════════════════════════════════════ */}
      <nav
        className={`fixed top-14 lg:top-16 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.05)]'
            : currentPage !== 'home'
              ? 'bg-white border-b border-slate-100'
              : 'bg-black/20 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 lg:h-11">
            {/* Left: main nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 flex items-center gap-1 ${
                    currentPage === item.page
                      ? (isTransp ? 'bg-white/15 text-white' : 'bg-[#1a3a6b]/10 text-[#1a3a6b]')
                      : (isTransp ? 'text-white/90 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100')
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right: About dropdown + Portals dropdown */}
            <div className="hidden lg:flex items-center gap-1 ml-auto">
              {/* About Dropdown */}
              <div className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
                <button
                  className={`px-2.5 xl:px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1 transition-all ${
                    currentPage === 'about'
                      ? (isTransp ? 'bg-white/15 text-white' : 'bg-[#1a3a6b]/10 text-[#1a3a6b]')
                      : (isTransp ? 'text-white/90 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100')
                  }`}
                >
                  <Info size={14} />
                  About Us <ChevronDown size={12} className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1"
                    >
                      <button
                        onClick={() => { setCurrentPage('about'); setAboutOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#1a3a6b] hover:bg-slate-50 transition-colors"
                      >
                        <Info size={14} /> Overview
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      {ABOUT_DROPDOWN.map((item) => (
                        <button
                          key={item.section}
                          onClick={() => { setCurrentPage('about'); setAboutOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1a3a6b] transition-colors text-left"
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Portals Dropdown */}
              <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className={`px-2.5 xl:px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1 transition-all ${
                  isTransp ? 'text-white/90 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                  <Laptop size={14} />
                  Portals <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1"
                    >
                      {DROPDOWN_ITEMS.map((item) => (
                        <button
                          key={item.page}
                          onClick={() => { setCurrentPage(item.page); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1a3a6b] transition-colors"
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE MENU
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 pt-20 overflow-y-auto"
            >
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => setCurrentPage(item.page)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.page ? 'bg-[#1a3a6b]/10 text-[#1a3a6b]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage('about')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'about' ? 'bg-[#1a3a6b]/10 text-[#1a3a6b]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Info size={16} /> About Us
                </button>
                <div className="border-t border-slate-100 my-3 pt-3">
                  <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Portals</p>
                  {DROPDOWN_ITEMS.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => setCurrentPage(item.page)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item.page ? 'bg-[#1a3a6b]/10 text-[#1a3a6b]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage('admissions')}
                  className="w-full mt-3 px-5 py-3 bg-gradient-to-r from-[#1a3a6b] to-[#2756a0] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <ClipboardList size={16} /> Apply Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
