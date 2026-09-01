import { create } from 'zustand';

export type Page = 'home' | 'about' | 'programs' | 'admissions' | 'track-application' | 'student-portal' | 'student-login' | 'online-learning' | 'events' | 'news' | 'admin-login' | 'admin-dashboard' | 'portal-key' | 'staff-portal-8x7q' | 'contact' | 'gallery' | 'alumni' | 'alumni-register' | 'graduation' | 'enrolled-students' | 'tvet-form';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isDemo: boolean;
  session?: boolean;
}

export interface StudentUser {
  id: string;
  email: string;
  name: string;
  role: 'student';
  studentNumber?: string;
}

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  isAdminLoggedIn: boolean;

  studentUser: StudentUser | null;
  setStudentUser: (user: StudentUser | null) => void;
  isStudentLoggedIn: boolean;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  focusEventId: string | null;
  setFocusEventId: (id: string | null) => void;

  portalVerified: boolean;
  setPortalVerified: (verified: boolean) => void;

  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>; 
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ currentPage: page, mobileMenuOpen: false });
  },

  adminUser: null,
  setAdminUser: (user) => set({ adminUser: user, isAdminLoggedIn: !!user }),
  isAdminLoggedIn: false,

  studentUser: null,
  setStudentUser: (user) => set({ studentUser: user, isStudentLoggedIn: !!user }),
  isStudentLoggedIn: false,

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  focusEventId: null,
  setFocusEventId: (id) => set({ focusEventId: id }),

  portalVerified: typeof window !== 'undefined' && sessionStorage.getItem('sktim_portal_verified') === 'true',
  setPortalVerified: (verified) => {
    if (typeof window !== 'undefined') {
      if (verified) sessionStorage.setItem('sktim_portal_verified', 'true');
      else sessionStorage.removeItem('sktim_portal_verified');
    }
    set({ portalVerified: verified });
  },

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
