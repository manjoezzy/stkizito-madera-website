'use client';

import { useAppStore, type Page } from '@/store/useAppStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Menu, X, Home, BookOpen, ClipboardList,
  User, LogIn, Calendar, Phone, Shield, ChevronDown, Laptop, ImageIcon
} from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS: { label: string; page: Page; icon?: React.ReactNode }[] = [
  { label: 'Home', page: 'home', icon: <Home size={16} /> },
  { label: 'Programs', page: 'programs', icon: <BookOpen size={16} /> },
  { label: 'Admissions', page: 'admissions', icon: <ClipboardList size={16} /> },
  { label: 'Gallery', page: 'gallery', icon: <ImageIcon size={16} /> },
  { label: 'Events', page: 'events', icon: <Calendar size={16} /> },
  { label: 'Contact', page: 'contact', icon: <Phone size={16} /> },
];

const DROPDOWN_ITEMS: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Student Portal', page: 'student-portal', icon: <User size={15} /> },
  { label: 'Student Login', page: 'student-login', icon: <LogIn size={15} /> },
  { label: 'Online Learning', page: 'online-learning', icon: <Laptop size={15} /> },
  { label: 'Admin Login', page: 'admin-login', icon: <Shield size={15} /> },
];

export default function Navigation() {
  const { currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
    : currentPage !== 'home'
      ? 'bg-white shadow-sm'
      : 'bg-transparent';

  const textColor = scrolled || currentPage !== 'home' ? 'text-slate-900' : 'text-white';
  const logoColor = scrolled || currentPage !== 'home' ? 'text-[#1a3a6b]' : 'text-white';

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${scrolled || currentPage !== 'home' ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'} transition-all`}>
                <Image src="/images/institute-logo.jpg" alt="SKTM Logo" width={40} height={40} className="object-contain w-full h-full" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-sm lg:text-base font-bold leading-tight ${logoColor} transition-colors`}>
                  St. Kizito&apos;s Technical Institute - Madera
                </h1>
                <p className={`text-[10px] lg:text-xs font-medium ${scrolled || currentPage !== 'home' ? 'text-[#f5c518]' : 'text-amber-300'} transition-colors`}>
                  Building Skills, Transforming Lives
                </p>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    currentPage === item.page
                      ? (scrolled || currentPage !== 'home' ? 'bg-[#1a3a6b]/10 text-[#1a3a6b]' : 'bg-white/15 text-white')
                      : `${textColor} hover:bg-black/5 dark:hover:bg-white/10`
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Dropdown */}
              <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${textColor} hover:bg-black/5`}> 
                  Portals <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
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

              <button
                onClick={() => setCurrentPage('admissions')}
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-[#1a3a6b] to-[#2756a0] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#1a3a6b]/25 hover:-translate-y-0.5 transition-all"
              >
                Apply Now
              </button>
            </nav>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${textColor}`}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
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
                <div className="border-t border-slate-100 my-3 pt-3">
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
                  className="w-full mt-3 px-5 py-3 bg-gradient-to-r from-[#1a3a6b] to-[#2756a0] text-white rounded-lg text-sm font-semibold"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
