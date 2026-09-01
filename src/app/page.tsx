'use client';

import { useAppStore, type Page } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import ProgramsPage from '@/components/ProgramsPage';
import AdmissionsPage from '@/components/AdmissionsPage';
import TrackApplicationPage from '@/components/TrackApplicationPage';
import AdminLoginPage from '@/components/AdminLoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import PortalKeyGate from '@/components/PortalKeyGate';
import StudentPortalPage from '@/components/StudentPortalPage';
import StudentLoginPage from '@/components/StudentLoginPage';
import OnlineLearningPage from '@/components/OnlineLearningPage';
import EventsPage from '@/components/EventsPage';
import GalleryPage from '@/components/GalleryPage';
import NewsPage from '@/components/NewsPage';
import AboutPage from '@/components/AboutPage';
import AlumniPage from '@/components/AlumniPage';
import AlumniRegisterPage from '@/components/AlumniRegisterPage';
import GraduationPage from '@/components/GraduationPage';
import AdmissionsEnrolledPage from '@/components/AdmissionsEnrolledPage';
import TvetApplicationForm from '@/components/TvetApplicationForm';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const PAGE_COMPONENTS: Record<Page, React.ComponentType> = {
  home: HomePage,
  programs: ProgramsPage,
  admissions: AdmissionsPage,
  'track-application': TrackApplicationPage,
  'student-portal': StudentPortalPage,
  'student-login': StudentLoginPage,
  'online-learning': OnlineLearningPage,
  events: EventsPage,
  news: NewsPage,
  gallery: GalleryPage,
  contact: HomePage, // Contact section is part of HomePage
  'portal-key': PortalKeyGate,
  'staff-portal-8x7q': AdminLoginPage,
  'admin-login': PortalKeyGate, // Old route now redirects to key gate
  'admin-dashboard': AdminDashboard,
  about: AboutPage,
  alumni: AlumniPage,
  'alumni-register': AlumniRegisterPage,
  graduation: GraduationPage,
  'enrolled-students': AdmissionsEnrolledPage,
  'tvet-form': TvetApplicationForm,
};

const PAGE_CONFIG: Record<Page, { showNav: boolean; fullWidth: boolean; requiresPortalKey: boolean }> = {
  home: { showNav: true, fullWidth: false, requiresPortalKey: false },
  programs: { showNav: true, fullWidth: false, requiresPortalKey: false },
  admissions: { showNav: true, fullWidth: false, requiresPortalKey: false },
  'track-application': { showNav: true, fullWidth: false, requiresPortalKey: false },
  'student-portal': { showNav: true, fullWidth: false, requiresPortalKey: false },
  'student-login': { showNav: true, fullWidth: false, requiresPortalKey: false },
  'online-learning': { showNav: true, fullWidth: false, requiresPortalKey: false },
  events: { showNav: true, fullWidth: false, requiresPortalKey: false },
  news: { showNav: true, fullWidth: false, requiresPortalKey: false },
  gallery: { showNav: true, fullWidth: false, requiresPortalKey: false },
  contact: { showNav: true, fullWidth: false, requiresPortalKey: false },
  'portal-key': { showNav: false, fullWidth: true, requiresPortalKey: false },
  'staff-portal-8x7q': { showNav: false, fullWidth: true, requiresPortalKey: true },
  'admin-login': { showNav: false, fullWidth: true, requiresPortalKey: false },
  'admin-dashboard': { showNav: false, fullWidth: true, requiresPortalKey: false },
  about: { showNav: true, fullWidth: false, requiresPortalKey: false },
  alumni: { showNav: true, fullWidth: false, requiresPortalKey: false },
  'alumni-register': { showNav: false, fullWidth: true, requiresPortalKey: false },
  graduation: { showNav: true, fullWidth: false, requiresPortalKey: false },
  'enrolled-students': { showNav: true, fullWidth: false, requiresPortalKey: false },
  'tvet-form': { showNav: true, fullWidth: false, requiresPortalKey: false },
};

export default function MainApp() {
  const { currentPage, toasts, removeToast, adminUser, setAdminUser, setCurrentPage, portalVerified } = useAppStore();

  // Restore session from cookie on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.data) {
            setAdminUser({
              id: data.data.userId,
              email: data.data.email,
              name: data.data.name,
              role: data.data.role,
              isDemo: false,
              session: true,
            });
            // If on login or portal key page, redirect to dashboard
            const current = useAppStore.getState().currentPage;
            if (current === 'staff-portal-8x7q' || current === 'portal-key' || current === 'admin-login') {
              setCurrentPage('admin-dashboard');
            }
          }
        }
      } catch {
        // Session check failed silently
      }
    })();
  }, []);

  // Check URL hash on mount for navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && Object.keys(PAGE_COMPONENTS).includes(hash)) {
      useAppStore.getState().setCurrentPage(hash as Page);
    }
  }, []);

  // Enforce portal key gate for protected pages
  const effectivePage = useMemo(() => {
    const config = PAGE_CONFIG[currentPage];
    if (config?.requiresPortalKey && !portalVerified) {
      // Redirect to portal key gate
      return 'portal-key' as Page;
    }
    return currentPage;
  }, [currentPage, portalVerified]);

  const config = PAGE_CONFIG[effectivePage];
  const PageComponent = PAGE_COMPONENTS[effectivePage];
  const isFullScreen = config.fullWidth && !config.showNav;

  return (
    <div className={isFullScreen ? '' : 'min-h-screen bg-white'}>
      {config.showNav && <Navigation />}

      <AnimatePresence mode="wait">
        <motion.div
          key={effectivePage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <PageComponent />
        </motion.div>
      </AnimatePresence>

      {/* Custom Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              {toast.type === 'success' && <CheckCircle size={18} className="mt-0.5 shrink-0" />}
              {toast.type === 'error' && <AlertCircle size={18} className="mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Info size={18} className="mt-0.5 shrink-0" />}
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
