import { create } from 'zustand';

export type Page = 'home' | 'about' | 'programs' | 'admissions' | 'student-portal' | 'student-login' | 'online-learning' | 'events' | 'admin-login' | 'admin-dashboard' | 'contact' | 'gallery';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isDemo: boolean;
}

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  isAdminLoggedIn: boolean;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

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

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

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
