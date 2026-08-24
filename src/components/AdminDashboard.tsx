'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  Settings,
  UserPlus,
  GraduationCap,
  School,
  Banknote,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Menu,
  X,
  ImageIcon,
  Upload,
  Paperclip,
  Download,
  Copy,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/schoolpay';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

// ===================== TYPES =====================

type Section =
  | 'dashboard'
  | 'applications'
  | 'students'
  | 'payments'
  | 'events'
  | 'gallery'
  | 'messages'
  | 'settings';

interface DashboardStats {
  totalApplications: number;
  totalStudents: number;
  totalPayments: number;
  totalRevenue: number;
  pendingApplications: number;
}

interface Application {
  id: string;
  referenceNumber: string;
  status: string;
  fullName: string;
  dob: string | null;
  gender: string | null;
  nationality: string | null;
  religion: string | null;
  nin: string | null;
  phone: string;
  email: string;
  district: string | null;
  address: string | null;
  nextOfKin: string | null;
  nextOfKinPhone: string | null;
  lastSchool: string | null;
  yearCompleted: string | null;
  qualification: string | null;
  institutionLevel: string | null;
  grades: string | null;
  programme: string | null;
  intakeYear: string | null;
  schoolpayCode: string | null;
  paymentStatus: string;
  paymentRef: string | null;
  paymentAmount: number | null;
  paymentMethod: string | null;
  paidAt: string | null;
  documents: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    documentType: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  transactionRef: string;
  applicationRef: string | null;
  fullName: string;
  phone: string;
  email: string;
  amount: number;
  status: string;
  paymentMethod: string;
  schoolpayTxRef: string | null;
  schoolpayStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  id: string;
  studentNumber: string;
  applicationId: string | null;
  fullName: string;
  phone: string;
  email: string;
  programme: string;
  intakeYear: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  eventDate: string | null;
  eventTime: string | null;
  location: string | null;
  isBanner: boolean;
  bannerUrl: string;
  attachmentUrl: string;
  attachmentName: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

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

// ===================== CONSTANTS =====================

const NAV_ITEMS: { section: Section; label: string; icon: React.ElementType }[] = [
  { section: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'applications', label: 'Applications', icon: FileText },
  { section: 'students', label: 'Students', icon: Users },
  { section: 'payments', label: 'Payments', icon: CreditCard },
  { section: 'events', label: 'Events', icon: Calendar },
  { section: 'gallery', label: 'Gallery', icon: ImageIcon },
  { section: 'messages', label: 'Messages', icon: MessageSquare },
  { section: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_BADGE: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  pending: { variant: 'outline', className: 'border-amber-400 text-amber-700 bg-amber-50' },
  approved: { variant: 'default', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  enrolled: { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  successful: { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  failed: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  paid: { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  active: { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
};

const EVENT_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'academic', label: 'Academic' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'campus', label: 'Campus' },
];

const GALLERY_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'sports', label: 'Sports' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'campus', label: 'Campus Life' },
  { value: 'openday', label: 'Open Day' },
];

// ===================== ANIMATION VARIANTS =====================

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// ===================== MAIN COMPONENT =====================

export default function AdminDashboard() {
  const { adminUser, setAdminUser, setCurrentPage, addToast } = useAppStore();

  // ---- State ----
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [paymentsByStatus, setPaymentsByStatus] = useState<
    { status: string; _sum: { amount: number | null }; _count: number }[]
  >([]);
  const [appsByStatus, setAppsByStatus] = useState<
    { status: string; _count: number }[]
  >([]);

  // Full lists
  const [applications, setApplications] = useState<Application[]>([]);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<Record<string, number>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Dialogs
  const [viewApplicant, setViewApplicant] = useState<Application | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<ContactMsg | null>(null);
  const [expandedApp, setExpandedApp] = useState<Application | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'general',
    eventDate: '',
  });

  // Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'general',
    eventDate: '',
    eventTime: '',
    location: '',
    isBanner: false,
    bannerUrl: '',
    attachmentUrl: '',
    attachmentName: '',
  });

  // Loading
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ---- Data Fetching ----
  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (json.success) {
        setStats(json.data.stats);
        setRecentApps(json.data.recentApplications);
        setRecentPayments(json.data.recentPayments);
        setPaymentsByStatus(json.data.paymentsByMonth || []);
        setAppsByStatus(json.data.appsByStatus || []);
      }
    } catch {
      addToast('Failed to load dashboard data', 'error');
    }
  };

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (appStatusFilter && appStatusFilter !== 'all') params.set('status', appStatusFilter);
      if (appSearch) params.set('search', appSearch);
      const res = await fetch(`/api/admissions?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
        setAppCounts(json.counts || {});
      }
    } catch {
      addToast('Failed to load applications', 'error');
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const json = await res.json();
      if (json.success) {
        setAllPayments(json.data);
        setPaymentSummary(json.summary);
      }
    } catch {
      addToast('Failed to load payments', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admissions?status=enrolled');
      const json = await res.json();
      if (json.success) {
        const enrolled = json.data || [];
        setStudents(
          enrolled.map((app: Application) => ({
            id: app.id,
            studentNumber: `SKT/${app.intakeYear || new Date().getFullYear()}/${app.referenceNumber.slice(-5)}`,
            applicationId: app.id,
            fullName: app.fullName,
            phone: app.phone,
            email: app.email,
            programme: app.programme || 'N/A',
            intakeYear: app.intakeYear || 'N/A',
            status: 'active',
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
          }))
        );
      }
    } catch {
      addToast('Failed to load students', 'error');
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?admin=true');
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch {
      addToast('Failed to load events', 'error');
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
        setUnreadCount(json.unread || 0);
      }
    } catch {
      addToast('Failed to load messages', 'error');
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/admin').then((r) => r.json()),
      fetch('/api/admissions').then((r) => r.json()),
      fetch('/api/payments').then((r) => r.json()),
      fetch('/api/admissions?status=enrolled').then((r) => r.json()),
      fetch('/api/events?admin=true').then((r) => r.json()),
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/gallery?admin=true').then((r) => r.json()),
    ]).then(([adminJson, admissionsJson, paymentsJson, enrolledJson, eventsJson, contactJson, galleryJson]) => {
      if (cancelled) return;
      if (adminJson.success) {
        setStats(adminJson.data.stats);
        setRecentApps(adminJson.data.recentApplications);
        setRecentPayments(adminJson.data.recentPayments);
        setPaymentsByStatus(adminJson.data.paymentsByMonth || []);
        setAppsByStatus(adminJson.data.appsByStatus || []);
      }
      if (admissionsJson.success) {
        setApplications(admissionsJson.data);
        setAppCounts(admissionsJson.counts || {});
      }
      if (paymentsJson.success) {
        setAllPayments(paymentsJson.data);
        setPaymentSummary(paymentsJson.summary);
      }
      if (enrolledJson.success) {
        const enrolled = enrolledJson.data || [];
        setStudents(
          enrolled.map((app: Application) => ({
            id: app.id,
            studentNumber: `SKT/${app.intakeYear || new Date().getFullYear()}/${app.referenceNumber.slice(-5)}`,
            applicationId: app.id,
            fullName: app.fullName,
            phone: app.phone,
            email: app.email,
            programme: app.programme || 'N/A',
            intakeYear: app.intakeYear || 'N/A',
            status: 'active',
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
          }))
        );
      }
      if (eventsJson.success) {
        setEvents(eventsJson.data);
      }
      if (Array.isArray(galleryJson)) {
        setGalleryItems(galleryJson);
      }
      if (contactJson.success) {
        setMessages(contactJson.data);
        setUnreadCount(contactJson.unread || 0);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        addToast('Failed to load some data', 'error');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  // ---- Actions ----
  const updateApplicationStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success) {
        addToast(`Application ${status} successfully`, 'success');
        fetchApplications();
        fetchDashboard();
        if (status === 'enrolled') fetchStudents();
      } else {
        addToast(json.message || 'Action failed', 'error');
      }
    } catch {
      addToast('Failed to update application', 'error');
    }
    setActionLoading(null);
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        addToast('Event deleted', 'success');
        fetchEvents();
      } else {
        addToast('Failed to delete event', 'error');
      }
    } catch {
      addToast('Failed to delete event', 'error');
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery?admin=true');
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      }
    } catch {
      // silent
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        addToast('Gallery item deleted', 'success');
        fetchGallery();
      } else {
        addToast('Failed to delete gallery item', 'error');
      }
    } catch {
      addToast('Failed to delete gallery item', 'error');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setGalleryForm((f) => ({ ...f, imageUrl: data.url }));
        setUploadPreview(data.url);
        addToast('Photo uploaded successfully', 'success');
      } else {
        addToast('Upload failed. Try again or use a URL.', 'error');
      }
    } catch {
      addToast('Upload failed. Try again or use a URL.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const createGalleryItem = async () => {
    if (!galleryForm.title.trim() || !galleryForm.imageUrl.trim()) {
      addToast('Title and image are required. Upload a photo or provide a URL.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      });
      if (res.ok) {
        addToast('Gallery item added successfully', 'success');
        setGalleryForm({ title: '', description: '', imageUrl: '', category: 'general', eventDate: '' });
        setUploadPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setGalleryDialogOpen(false);
        fetchGallery();
      } else {
        addToast('Failed to add gallery item', 'error');
      }
    } catch {
      addToast('Failed to add gallery item', 'error');
    }
  };

  const toggleGalleryPublish = async (item: GalleryItem) => {
    try {
      await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
      });
      fetchGallery();
    } catch {
      addToast('Failed to update gallery item', 'error');
    }
  };

  const createEvent = async () => {
    if (!eventForm.title.trim()) {
      addToast('Event title is required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      const json = await res.json();
      if (json.success) {
        addToast('Event created successfully', 'success');
        setEventForm({ title: '', description: '', category: 'general', eventDate: '', eventTime: '', location: '', isBanner: false, bannerUrl: '', attachmentUrl: '', attachmentName: '' });
        setEventDialogOpen(false);
        fetchEvents();
      } else {
        addToast(json.message || 'Failed to create event', 'error');
      }
    } catch {
      addToast('Failed to create event', 'error');
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    setCurrentPage('home');
    addToast('Logged out successfully', 'info');
  };

  const navigateTo = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // ---- Helpers ----
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_BADGE[status] || { variant: 'outline' as const, className: '' };
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      successful: { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
      pending: { variant: 'outline', className: 'border-amber-400 text-amber-700 bg-amber-50' },
      failed: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
      initiated: { variant: 'outline', className: 'border-blue-400 text-blue-700 bg-blue-50' },
    };
    const config = map[status] || map.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Revenue chart max for scaling
  const maxRevenueBar = Math.max(
    ...(paymentsByStatus.map((p) => p._sum.amount || 0)),
    1
  );

  const unreadMessages = messages.filter((m) => !m.isRead);

  // ===================== RENDER =====================

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex-shrink-0
          bg-gradient-to-b from-[#0f2347] to-[#1a3a6b]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f5c518] flex items-center justify-center font-bold text-[#0f2347] text-lg">
                SK
              </div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">SKTIM</h1>
                <p className="text-white/50 text-xs">Madera Admin</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <p className="text-white/30 text-xs uppercase tracking-wider px-3 mb-2 font-semibold">
              Main Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.section;
              const Icon = item.icon;
              return (
                <button
                  key={item.section}
                  onClick={() => navigateTo(item.section)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5
                    ${
                      isActive
                        ? 'bg-white/10 text-[#f5c518] border-l-[3px] border-[#f5c518]'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                    }
                  `}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.section === 'messages' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#f5c518] flex items-center justify-center text-[#0f2347] font-bold text-sm">
                {adminUser?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-white/40 text-xs truncate">{adminUser?.email || 'admin@stkizitos.edu'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-300 hover:text-red-100 hover:bg-red-500/10 text-sm gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-h-screen flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {NAV_ITEMS.find((n) => n.section === activeSection)?.label || 'Dashboard'}
                </h2>
                <p className="text-xs text-slate-400 hidden sm:block">
                  St. Kizito&apos;s Technical Institute — Madera
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search anything..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-9 w-64 h-9 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-xs">
                {adminUser?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {loading ? (
                <DashboardSkeleton />
              ) : activeSection === 'dashboard' ? (
                <DashboardSection
                  stats={stats}
                  recentApps={recentApps}
                  recentPayments={recentPayments}
                  paymentsByStatus={paymentsByStatus}
                  appsByStatus={appsByStatus}
                  maxRevenueBar={maxRevenueBar}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  getPaymentStatusBadge={getPaymentStatusBadge}
                  formatCurrency={formatCurrency}
                  onViewApplicant={setViewApplicant}
                  onApprove={updateApplicationStatus}
                  onReject={updateApplicationStatus}
                  actionLoading={actionLoading}
                />
              ) : activeSection === 'applications' ? (
                <ApplicationsSection
                  applications={applications}
                  appCounts={appCounts}
                  appSearch={appSearch}
                  appStatusFilter={appStatusFilter}
                  setAppSearch={setAppSearch}
                  setAppStatusFilter={setAppStatusFilter}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  onViewApplicant={setViewApplicant}
                  onExpand={setExpandedApp}
                  onApprove={updateApplicationStatus}
                  onReject={updateApplicationStatus}
                  onEnroll={updateApplicationStatus}
                  actionLoading={actionLoading}
                />
              ) : activeSection === 'payments' ? (
                <PaymentsSection
                  payments={allPayments}
                  summary={paymentSummary}
                  formatDate={formatDate}
                  getPaymentStatusBadge={getPaymentStatusBadge}
                  formatCurrency={formatCurrency}
                />
              ) : activeSection === 'students' ? (
                <StudentsSection students={students} formatDate={formatDate} getStatusBadge={getStatusBadge} />
              ) : activeSection === 'events' ? (
                <EventsSection
                  events={events}
                  onCreateNew={() => setEventDialogOpen(true)}
                  onDelete={deleteEvent}
                  formatDate={formatDate}
                />
              ) : activeSection === 'gallery' ? (
                <GallerySection
                  items={galleryItems}
                  onCreateNew={() => setGalleryDialogOpen(true)}
                  onDelete={deleteGalleryItem}
                  onTogglePublish={toggleGalleryPublish}
                  formatDate={formatDate}
                />
              ) : activeSection === 'messages' ? (
                <MessagesSection
                  messages={messages}
                  unreadCount={unreadCount}
                  onExpand={setExpandedMessage}
                  formatDate={formatDate}
                />
              ) : activeSection === 'settings' ? (
                <SettingsSection />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ===== APPLICANT VIEW DIALOG ===== */}
      <Dialog open={!!viewApplicant} onOpenChange={() => setViewApplicant(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a3a6b]">
              Applicant Details
            </DialogTitle>
            <DialogDescription>
              Full information for application {viewApplicant?.referenceNumber}
            </DialogDescription>
          </DialogHeader>
          {viewApplicant && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{viewApplicant.fullName}</h3>
                  <p className="text-sm text-slate-500 mt-1">{viewApplicant.referenceNumber}</p>
                </div>
                {getStatusBadge(viewApplicant.status)}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickInfo icon={Phone} label="Phone" value={viewApplicant.phone} />
                <QuickInfo icon={Mail} label="Email" value={viewApplicant.email} />
                <QuickInfo icon={GraduationCap} label="Programme" value={viewApplicant.programme || 'N/A'} />
                <QuickInfo icon={Calendar} label="Intake" value={viewApplicant.intakeYear || 'N/A'} />
              </div>

              {/* Personal Details */}
              <DetailCard title="Personal Information">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Date of Birth" value={viewApplicant.dob} />
                  <DetailRow label="Gender" value={viewApplicant.gender} />
                  <DetailRow label="Nationality" value={viewApplicant.nationality} />
                  <DetailRow label="Religion" value={viewApplicant.religion} />
                  <DetailRow label="NIN" value={viewApplicant.nin} />
                </div>
              </DetailCard>

              {/* Contact Details */}
              <DetailCard title="Contact & Address">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="District" value={viewApplicant.district} />
                  <DetailRow label="Address" value={viewApplicant.address} />
                  <DetailRow label="Next of Kin" value={viewApplicant.nextOfKin} />
                  <DetailRow label="Kin Phone" value={viewApplicant.nextOfKinPhone} />
                </div>
              </DetailCard>

              {/* Academic Details */}
              <DetailCard title="Academic Background">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Last School" value={viewApplicant.lastSchool} />
                  <DetailRow label="Year Completed" value={viewApplicant.yearCompleted} />
                  <DetailRow label="Qualification" value={viewApplicant.qualification} />
                </div>
              </DetailCard>

              {/* Payment Info */}
              <DetailCard title="Payment Information">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Payment Status" value={viewApplicant.paymentStatus} />
                  <DetailRow
                    label="Amount"
                    value={viewApplicant.paymentAmount ? formatCurrency(viewApplicant.paymentAmount) : 'N/A'}
                  />
                  <DetailRow label="Payment Ref" value={viewApplicant.paymentRef} />
                  <DetailRow label="Payment Method" value={viewApplicant.paymentMethod} />
                  <DetailRow label="Paid At" value={viewApplicant.paidAt ? formatDate(viewApplicant.paidAt) : 'N/A'} />
                </div>
              </DetailCard>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {viewApplicant.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        updateApplicationStatus(viewApplicant.id, 'approved');
                        setViewApplicant(null);
                      }}
                      disabled={!!actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateApplicationStatus(viewApplicant.id, 'rejected');
                        setViewApplicant(null);
                      }}
                      disabled={!!actionLoading}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {viewApplicant.status === 'approved' && (
                  <Button
                    onClick={() => {
                      updateApplicationStatus(viewApplicant.id, 'enrolled');
                      setViewApplicant(null);
                    }}
                    disabled={!!actionLoading}
                    className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Enroll Student
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setViewApplicant(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== EXPANDED MESSAGE DIALOG ===== */}
      <Dialog open={!!expandedMessage} onOpenChange={() => setExpandedMessage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a3a6b]">
              {expandedMessage?.subject || 'Message'}
            </DialogTitle>
            <DialogDescription>
              From {expandedMessage?.name} on {expandedMessage ? formatDate(expandedMessage.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          {expandedMessage && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {expandedMessage.email}
                </span>
                {expandedMessage.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {expandedMessage.phone}
                  </span>
                )}
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{expandedMessage.message}</p>
              </div>
              <Button variant="outline" onClick={() => setExpandedMessage(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== EXPANDED APPLICANT DIALOG ===== */}
      <Dialog open={!!expandedApp} onOpenChange={() => setExpandedApp(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a3a6b]">
              Applicant Details
            </DialogTitle>
            <DialogDescription>
              Full application information
            </DialogDescription>
          </DialogHeader>
          {expandedApp && (
            <div className="space-y-6">
              {/* Header with ref + status */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-2xl font-mono font-bold text-[#1a3a6b] tracking-wide">{expandedApp.referenceNumber}</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{expandedApp.fullName}</h3>
                </div>
                {getStatusBadge(expandedApp.status)}
              </div>

              {/* Payment Status Indicator */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${expandedApp.paymentStatus === 'successful' || expandedApp.paymentStatus === 'paid' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`w-3 h-3 rounded-full ${expandedApp.paymentStatus === 'successful' || expandedApp.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-sm font-medium">
                  Payment: {expandedApp.paymentStatus === 'successful' || expandedApp.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  {expandedApp.paymentAmount ? ` — ${formatCurrency(expandedApp.paymentAmount)}` : ''}
                </span>
              </div>

              {/* Personal Info */}
              <DetailCard title="Personal Information">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Date of Birth" value={expandedApp.dob} />
                  <DetailRow label="Gender" value={expandedApp.gender} />
                  <DetailRow label="Nationality" value={expandedApp.nationality} />
                  <DetailRow label="Religion" value={expandedApp.religion} />
                  <DetailRow label="NIN" value={expandedApp.nin} />
                </div>
              </DetailCard>

              {/* Contact Info */}
              <DetailCard title="Contact Information">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Phone" value={expandedApp.phone} />
                  <DetailRow label="Email" value={expandedApp.email} />
                  <DetailRow label="District" value={expandedApp.district} />
                  <DetailRow label="Address" value={expandedApp.address} />
                </div>
              </DetailCard>

              {/* Next of Kin */}
              <DetailCard title="Next of Kin">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Name" value={expandedApp.nextOfKin} />
                  <DetailRow label="Phone" value={expandedApp.nextOfKinPhone} />
                </div>
              </DetailCard>

              {/* Academic Background */}
              <DetailCard title="Academic Background">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Last School" value={expandedApp.lastSchool} />
                  <DetailRow label="Year Completed" value={expandedApp.yearCompleted} />
                  <DetailRow label="Qualification" value={expandedApp.qualification} />
                </div>
              </DetailCard>

              {/* Programme Selection */}
              <DetailCard title="Programme Selection">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Programme" value={expandedApp.programme} />
                  <DetailRow label="Intake Year" value={expandedApp.intakeYear} />
                  <DetailRow label="Applied On" value={formatDate(expandedApp.createdAt)} />
                </div>
              </DetailCard>

              {/* Grades / Academic Performance */}
              {expandedApp.grades && (
                <DetailCard title="Grades / Academic Performance">
                  <div className="space-y-3">
                    {expandedApp.institutionLevel && (
                      <Badge variant="secondary" className="bg-[#1a3a6b]/10 text-[#1a3a6b] font-medium">
                        {expandedApp.institutionLevel.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                    )}
                    {(() => {
                      try {
                        const parsed = JSON.parse(expandedApp.grades);
                        if (!Array.isArray(parsed) || parsed.length === 0) return null;
                        return (
                          <div className="rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {parsed.map((g: { subject: string; grade: string }, i: number) => (
                                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                    <td className="px-3 py-2 text-slate-700">{g.subject}</td>
                                    <td className="px-3 py-2">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D1', 'D2'].some(p => g.grade?.toUpperCase().startsWith(p))
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : ['C-', 'D', 'D3', 'D4'].some(p => g.grade?.toUpperCase().startsWith(p))
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {g.grade}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      } catch {
                        return <p className="text-sm text-slate-400">Could not parse grades data</p>;
                      }
                    })()}
                  </div>
                </DetailCard>
              )}

              {/* Documents */}
              {expandedApp.documents && expandedApp.documents.length > 0 && (
                <DetailCard title="Uploaded Documents">
                  <div className="space-y-2">
                    {expandedApp.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-[#1a3a6b]/30 hover:bg-[#1a3a6b]/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center flex-shrink-0">
                            <FileCheck className="w-4 h-4 text-[#1a3a6b]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate group-hover:text-[#1a3a6b] transition-colors">{doc.fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-500">
                                {doc.documentType.replace(/_/g, ' ')}
                              </Badge>
                              <span className="text-[10px] text-slate-400">
                                {(doc.fileSize / 1024).toFixed(doc.fileSize > 1024 * 100 ? 0 : 1)} KB
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(doc.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-300 group-hover:text-[#1a3a6b] transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </DetailCard>
              )}

              {/* SchoolPay Code */}
              {expandedApp.schoolpayCode && (
                <DetailCard title="SchoolPay Payment Code">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#f5c518]/10 border-2 border-dashed border-[#f5c518]/40 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-500 mb-1 font-medium">Payment Reference Code</p>
                      <p className="text-2xl font-mono font-bold text-[#1a3a6b] tracking-widest">{expandedApp.schoolpayCode}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 h-10 w-10"
                      onClick={() => {
                        navigator.clipboard.writeText(expandedApp.schoolpayCode!);
                        addToast('SchoolPay code copied to clipboard', 'success');
                      }}
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </DetailCard>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(expandedApp.status === 'pending' || expandedApp.status === 'rejected') && (
                  <Button
                    onClick={() => {
                      updateApplicationStatus(expandedApp.id, 'approved');
                      setExpandedApp(null);
                    }}
                    disabled={!!actionLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                {(expandedApp.status === 'pending' || expandedApp.status === 'approved') && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateApplicationStatus(expandedApp.id, 'rejected');
                      setExpandedApp(null);
                    }}
                    disabled={!!actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                )}
                {expandedApp.status === 'approved' && (
                  <Button
                    onClick={() => {
                      updateApplicationStatus(expandedApp.id, 'enrolled');
                      setExpandedApp(null);
                    }}
                    disabled={!!actionLoading}
                    className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Enroll Student
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setExpandedApp(null)}
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== CREATE EVENT DIALOG ===== */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a3a6b]">Create New Event</DialogTitle>
            <DialogDescription>Add a new event to the school calendar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <Input
                placeholder="Event title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <Input
                placeholder="Brief description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select
                  value={eventForm.category}
                  onValueChange={(v) => setEventForm({ ...eventForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <Input
                  type="time"
                  value={eventForm.eventTime}
                  onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <Input
                  placeholder="Event location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                />
              </div>
            </div>
            {/* Banner Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <label htmlFor="isBanner" className="text-sm font-medium text-slate-700 cursor-pointer">
                Banner Event (shows as large banner on Events page)
              </label>
              <Switch
                id="isBanner"
                checked={eventForm.isBanner}
                onCheckedChange={(checked) => setEventForm({ ...eventForm, isBanner: checked, bannerUrl: checked ? eventForm.bannerUrl : '' })}
              />
            </div>
            {/* Banner Image Upload */}
            {eventForm.isBanner && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banner Image *</label>
                <div
                  onClick={() => document.getElementById('bannerFileInput')?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#1a3a6b] hover:bg-[#1a3a6b]/5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    id="bannerFileInput"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('type', 'event');
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        if (res.ok) {
                          const data = await res.json();
                          setEventForm((f) => ({ ...f, bannerUrl: data.url }));
                          addToast('Banner image uploaded', 'success');
                        } else {
                          addToast('Banner upload failed', 'error');
                        }
                      } catch {
                        addToast('Banner upload failed', 'error');
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading ? (
                    <p className="text-sm text-slate-500">Uploading...</p>
                  ) : eventForm.bannerUrl ? (
                    <div className="space-y-2">
                      <img src={eventForm.bannerUrl} alt="Banner preview" className="max-h-32 mx-auto rounded-lg object-contain" />
                      <p className="text-xs text-emerald-600 font-medium">Banner uploaded - click to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="text-sm text-slate-600 font-medium">Click to upload banner image</p>
                      <p className="text-xs text-slate-400">JPG, PNG, GIF or WebP</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" /> Attachment (optional)
                </span>
              </label>
              <div
                onClick={() => document.getElementById('attachmentFileInput')?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#1a3a6b] hover:bg-[#1a3a6b]/5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  id="attachmentFileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('type', 'event');
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      if (res.ok) {
                        const data = await res.json();
                        setEventForm((f) => ({ ...f, attachmentUrl: data.url, attachmentName: data.fileName || file.name }));
                        addToast('Attachment uploaded', 'success');
                      } else {
                        addToast('Attachment upload failed', 'error');
                      }
                    } catch {
                      addToast('Attachment upload failed', 'error');
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                {uploading ? (
                  <p className="text-sm text-slate-500">Uploading...</p>
                ) : eventForm.attachmentUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <Paperclip className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium max-w-[200px] truncate">{eventForm.attachmentName || 'Attached file'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEventForm((f) => ({ ...f, attachmentUrl: '', attachmentName: '' }));
                        const inp = document.getElementById('attachmentFileInput') as HTMLInputElement | null;
                        if (inp) inp.value = '';
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">Click to attach a file</p>
                    <p className="text-xs text-slate-400">PDF, DOCX, JPG or PNG</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={createEvent}
                disabled={eventForm.isBanner && !eventForm.bannerUrl}
                className="flex-1 bg-[#1a3a6b] hover:bg-[#2756a0] text-white disabled:opacity-50"
              >
                Create Event
              </Button>
              <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== GALLERY DIALOG ===== */}
      <Dialog open={galleryDialogOpen} onOpenChange={(open) => {
        if (!open) { setUploadPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }
        setGalleryDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a3a6b]">Add Gallery Photo</DialogTitle>
            <DialogDescription>Upload a photo directly or paste an image URL.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <Input
                placeholder="Photo title"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <Input
                placeholder="Short note about this photo"
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
              />
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Photo *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-[#1a3a6b] hover:bg-[#1a3a6b]/5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,.jfif"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-3 border-[#1a3a6b]/30 border-t-[#1a3a6b] rounded-full" />
                    <p className="text-sm text-slate-500">Uploading...</p>
                  </div>
                ) : uploadPreview || galleryForm.imageUrl ? (
                  <div className="space-y-2">
                    <img src={uploadPreview || galleryForm.imageUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-emerald-600 font-medium">Photo uploaded - click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload a photo</p>
                    <p className="text-xs text-slate-400">JPG, PNG, GIF or WebP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback URL input */}
            {!uploadPreview && !galleryForm.imageUrl && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center z-10">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-xs text-slate-400 bg-white">or enter URL</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>
                <div className="pt-5">
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={galleryForm.imageUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select
                  value={galleryForm.category}
                  onValueChange={(v) => setGalleryForm({ ...galleryForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
                <Input
                  type="date"
                  value={galleryForm.eventDate}
                  onChange={(e) => setGalleryForm({ ...galleryForm, eventDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={createGalleryItem}
                disabled={uploading}
                className="flex-1 bg-[#1a3a6b] hover:bg-[#2756a0] text-white disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Add Photo'}
              </Button>
              <Button variant="outline" onClick={() => setGalleryDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== SUB-COMPONENTS =====================

// ---- Skeleton Loader ----
function DashboardSkeleton() {
  return (
    <motion.div
      variants={staggerContainer}
      animate="animate"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ---- Dashboard Overview Section ----
interface DashboardProps {
  stats: DashboardStats | null;
  recentApps: Application[];
  recentPayments: Payment[];
  paymentsByStatus: { status: string; _sum: { amount: number | null }; _count: number }[];
  appsByStatus: { status: string; _count: number }[];
  maxRevenueBar: number;
  formatDate: (s: string) => string;
  getStatusBadge: (s: string) => React.ReactNode;
  getPaymentStatusBadge: (s: string) => React.ReactNode;
  formatCurrency: (n: number) => string;
  onViewApplicant: (app: Application) => void;
  onApprove: (id: string, status: string) => Promise<void>;
  onReject: (id: string, status: string) => Promise<void>;
  actionLoading: string | null;
}

function DashboardSection({
  stats,
  recentApps,
  recentPayments,
  paymentsByStatus,
  appsByStatus,
  maxRevenueBar,
  formatDate,
  getStatusBadge,
  getPaymentStatusBadge,
  formatCurrency,
  onViewApplicant,
  onApprove,
  onReject,
  actionLoading,
}: DashboardProps) {
  const statCards = [
    {
      label: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
      trend: '+12%',
    },
    {
      label: 'Pending Review',
      value: stats?.pendingApplications ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
      trend: 'Needs attention',
    },
    {
      label: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: GraduationCap,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
      trend: '+5%',
    },
    {
      label: 'Revenue Collected',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: Banknote,
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100',
      trend: '+18%',
    },
    {
      label: 'Upcoming Events',
      value: appsByStatus.find((a) => a.status === 'approved')?._count ?? 0,
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      trend: 'This term',
    },
  ];

  return (
    <motion.div variants={staggerContainer} animate="animate" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={staggerItem}>
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`${card.iconBg} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${card.color.split(' ')[1]}`} />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <ArrowUpRight className="w-3 h-3" />
                      {card.trend}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Bar Chart */}
      {paymentsByStatus.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1a3a6b]" />
                Revenue by Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentsByStatus.map((p) => {
                  const barWidth = maxRevenueBar > 0 ? ((p._sum.amount || 0) / maxRevenueBar) * 100 : 0;
                  const colorMap: Record<string, string> = {
                    successful: 'bg-emerald-500',
                    pending: 'bg-amber-400',
                    failed: 'bg-red-400',
                  };
                  const barColor = colorMap[p.status] || 'bg-slate-400';
                  return (
                    <div key={p.status}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 font-medium capitalize">{p.status}</span>
                        <span className="text-slate-500">
                          {formatCurrency(p._sum.amount || 0)} ({p._count} txns)
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(barWidth, 2)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Two-column tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1a3a6b]" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentApps.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No applications yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="text-xs text-slate-500">Ref#</TableHead>
                        <TableHead className="text-xs text-slate-500">Name</TableHead>
                        <TableHead className="text-xs text-slate-500 hidden sm:table-cell">Programme</TableHead>
                        <TableHead className="text-xs text-slate-500">Status</TableHead>
                        <TableHead className="text-xs text-slate-500 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentApps.map((app) => (
                        <TableRow key={app.id} className="border-slate-50">
                          <TableCell className="text-xs font-mono text-slate-600">
                            {app.referenceNumber.slice(-8)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-slate-800">
                            {app.fullName}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 hidden sm:table-cell">
                            {app.programme || 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-[#1a3a6b]"
                                onClick={() => onViewApplicant(app)}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600"
                                    disabled={!!actionLoading}
                                    onClick={() => onApprove(app.id, 'approved')}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                                    disabled={!!actionLoading}
                                    onClick={() => onReject(app.id, 'rejected')}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Payments */}
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1a3a6b]" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No payments yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="text-xs text-slate-500">Txn Ref</TableHead>
                        <TableHead className="text-xs text-slate-500">Name</TableHead>
                        <TableHead className="text-xs text-slate-500">Amount</TableHead>
                        <TableHead className="text-xs text-slate-500">Status</TableHead>
                        <TableHead className="text-xs text-slate-500 hidden sm:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayments.map((pay) => (
                        <TableRow key={pay.id} className="border-slate-50">
                          <TableCell className="text-xs font-mono text-slate-600">
                            {pay.transactionRef.slice(-10)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-slate-800">
                            {pay.fullName}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-slate-700">
                            {formatCurrency(pay.amount)}
                          </TableCell>
                          <TableCell>{getPaymentStatusBadge(pay.status)}</TableCell>
                          <TableCell className="text-xs text-slate-500 hidden sm:table-cell">
                            {formatDate(pay.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---- Applications Section ----
interface ApplicationsProps {
  applications: Application[];
  appCounts: Record<string, number>;
  appSearch: string;
  appStatusFilter: string;
  setAppSearch: (s: string) => void;
  setAppStatusFilter: (s: string) => void;
  formatDate: (s: string) => string;
  getStatusBadge: (s: string) => React.ReactNode;
  onViewApplicant: (app: Application) => void;
  onExpand: (app: Application) => void;
  onApprove: (id: string, status: string) => Promise<void>;
  onReject: (id: string, status: string) => Promise<void>;
  onEnroll: (id: string, status: string) => Promise<void>;
  actionLoading: string | null;
}

function ApplicationsSection({
  applications,
  appCounts,
  appSearch,
  appStatusFilter,
  setAppSearch,
  setAppStatusFilter,
  formatDate,
  getStatusBadge,
  onViewApplicant,
  onExpand,
  onApprove,
  onReject,
  onEnroll,
  actionLoading,
}: ApplicationsProps) {
  return (
    <div className="space-y-4">
      {/* Summary Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-slate-600 border-slate-300 px-3 py-1">
          All: {appCounts.total ?? 0}
        </Badge>
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 px-3 py-1">
          Pending: {appCounts.pending ?? 0}
        </Badge>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
          Approved: {appCounts.approved ?? 0}
        </Badge>
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-3 py-1">
          Rejected: {appCounts.rejected ?? 0}
        </Badge>
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3 py-1">
          Enrolled: {appCounts.enrolled ?? 0}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, ref#, email or phone..."
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-white">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {applications.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No applications found</p>
              <p className="text-slate-300 text-sm mt-1">
                {appSearch || appStatusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Applications will appear here once submitted'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500">Ref#</TableHead>
                    <TableHead className="text-xs text-slate-500">Full Name</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden lg:table-cell">Programme</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden sm:table-cell">Payment</TableHead>
                    <TableHead className="text-xs text-slate-500">Status</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-xs text-slate-500 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="border-slate-50 cursor-pointer hover:bg-slate-50" onClick={() => onExpand(app)}>
                      <TableCell className="text-xs font-mono text-slate-600">
                        {app.referenceNumber.slice(-8)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-800">
                        {app.fullName}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 hidden md:table-cell">
                        {app.phone}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 hidden lg:table-cell">
                        {app.programme || 'N/A'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(app.paymentStatus)}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-xs text-slate-500 hidden md:table-cell">
                        {formatDate(app.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-[#1a3a6b]"
                            onClick={() => onExpand(app)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {app.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600"
                                disabled={!!actionLoading}
                                onClick={() => onApprove(app.id, 'approved')}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                                disabled={!!actionLoading}
                                onClick={() => onReject(app.id, 'rejected')}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          {app.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-slate-400 hover:text-[#1a3a6b]"
                              disabled={!!actionLoading}
                              onClick={() => onEnroll(app.id, 'enrolled')}
                            >
                              <UserPlus className="w-3.5 h-3.5 mr-1" />
                              Enroll
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Payments Section ----
interface PaymentsProps {
  payments: Payment[];
  summary: Record<string, number>;
  formatDate: (s: string) => string;
  getPaymentStatusBadge: (s: string) => React.ReactNode;
  formatCurrency: (n: number) => string;
}

function PaymentsSection({
  payments,
  summary,
  formatDate,
  getPaymentStatusBadge,
  formatCurrency,
}: PaymentsProps) {
  const summaryCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue || 0),
      icon: Banknote,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Successful',
      value: summary.successful ?? 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Pending',
      value: summary.pending ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Failed',
      value: summary.failed ?? 0,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${card.iconBg} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">{card.value}</p>
                    <p className="text-xs text-slate-500">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payments Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#1a3a6b]" />
            All Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="py-16 text-center">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No payments yet</p>
              <p className="text-slate-300 text-sm mt-1">Payments will appear here once processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500">Transaction Ref</TableHead>
                    <TableHead className="text-xs text-slate-500">Applicant</TableHead>
                    <TableHead className="text-xs text-slate-500">Amount</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden sm:table-cell">Method</TableHead>
                    <TableHead className="text-xs text-slate-500">Status</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((pay) => (
                    <TableRow key={pay.id} className="border-slate-50">
                      <TableCell className="text-xs font-mono text-slate-600">
                        {pay.transactionRef.slice(-12)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-800">
                        {pay.fullName}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-700">
                        {formatCurrency(pay.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 hidden sm:table-cell capitalize">
                        {pay.paymentMethod}
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(pay.status)}</TableCell>
                      <TableCell className="text-xs text-slate-500 hidden md:table-cell">
                        {formatDate(pay.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Students Section ----
interface StudentsProps {
  students: Student[];
  formatDate: (s: string) => string;
  getStatusBadge: (s: string) => React.ReactNode;
}

function StudentsSection({ students, formatDate, getStatusBadge }: StudentsProps) {
  return (
    <div className="space-y-4">
      {/* Count Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1a3a6b] to-[#2756a0]">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{students.length}</p>
            <p className="text-white/70 text-sm">Total Enrolled Students</p>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1a3a6b]" />
            Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {students.length === 0 ? (
            <div className="py-16 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No enrolled students yet</p>
              <p className="text-slate-300 text-sm mt-1">
                Students will appear here once applications are enrolled
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500">Student No.</TableHead>
                    <TableHead className="text-xs text-slate-500">Name</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden md:table-cell">Programme</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden sm:table-cell">Intake</TableHead>
                    <TableHead className="text-xs text-slate-500">Status</TableHead>
                    <TableHead className="text-xs text-slate-500 hidden md:table-cell">Enrolled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="border-slate-50">
                      <TableCell className="text-xs font-mono text-slate-600">
                        {student.studentNumber}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-800">
                        {student.fullName}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 hidden md:table-cell">
                        {student.programme}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 hidden sm:table-cell">
                        {student.intakeYear}
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-xs text-slate-500 hidden md:table-cell">
                        {formatDate(student.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Events Section ----
interface EventsProps {
  events: EventItem[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  formatDate: (s: string) => string;
}

function EventsSection({ events, onCreateNew, onDelete, formatDate }: EventsProps) {
  const categoryColors: Record<string, string> = {
    general: 'bg-slate-100 text-slate-600',
    academic: 'bg-blue-100 text-blue-600',
    showcase: 'bg-purple-100 text-purple-600',
    assessment: 'bg-amber-100 text-amber-600',
    campus: 'bg-green-100 text-green-600',
  };

  const upcoming = events
    .filter((e) => e.eventDate && new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime());

  const past = events
    .filter((e) => e.eventDate && new Date(e.eventDate) < new Date())
    .sort((a, b) => new Date(b.eventDate!).getTime() - new Date(a.eventDate!).getTime());

  const upcomingRegular = upcoming.filter((e) => !e.isBanner);
  const upcomingBanners = upcoming.filter((e) => e.isBanner);
  const pastRegular = past.filter((e) => !e.isBanner);
  const pastBanners = past.filter((e) => e.isBanner);

  const renderEventCard = (event: EventItem, isPast: boolean) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow group ${isPast ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={categoryColors[event.category] || categoryColors.general}
              >
                {event.category}
              </Badge>
              {event.attachmentUrl && (
                <a
                  href={event.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-[#1a3a6b] transition-colors"
                  title={event.attachmentName ? `Download: ${event.attachmentName}` : 'Download attachment'}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="text-xs max-w-[120px] truncate">{event.attachmentName || 'Attachment'}</span>
                </a>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 text-slate-300 hover:text-red-500 ${isPast ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <h4 className={`font-semibold mb-1 line-clamp-2 ${isPast ? 'text-slate-600' : 'text-slate-800'}`}>{event.title}</h4>
          {event.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            {event.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(event.eventDate)}
              </span>
            )}
            {event.eventTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {event.eventTime}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderBannerCard = (event: EventItem, isPast: boolean) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative rounded-xl overflow-hidden shadow-sm group ${isPast ? 'opacity-60' : ''}`}
        style={{
          backgroundImage: event.bannerUrl ? `url(${event.bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '180px',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col justify-end h-full" style={{ minHeight: '180px' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {event.category}
              </Badge>
              <Badge className="bg-[#f5c518]/90 text-[#0f2347] font-semibold">Banner</Badge>
              {event.attachmentUrl && (
                <a
                  href={event.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                  title={event.attachmentName ? `Download: ${event.attachmentName}` : 'Download attachment'}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Paperclip className="w-4 h-4" />
                  {event.attachmentName && <span className="text-xs max-w-[100px] truncate">{event.attachmentName}</span>}
                </a>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 text-white/50 hover:text-red-400 hover:bg-white/10 ${isPast ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <h4 className="text-xl font-bold text-white mt-3 line-clamp-2">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-white/80 line-clamp-2 mt-1">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-white/60 mt-3">
            {event.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(event.eventDate)}
              </span>
            )}
            {event.eventTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {event.eventTime}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Manage school events and calendar</p>
        </div>
        <Button
          onClick={onCreateNew}
          className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No events yet</p>
          <p className="text-slate-300 text-sm mt-1">Create your first event to get started</p>
        </div>
      ) : (
        <>
          {/* Upcoming Banner Events */}
          {upcomingBanners.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Upcoming Banners
              </h3>
              <div className="space-y-4">
                {upcomingBanners.map((event) => renderBannerCard(event, false))}
              </div>
            </div>
          )}

          {/* Upcoming Regular Events */}
          {upcomingRegular.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Upcoming Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {upcomingRegular.map((event) => renderEventCard(event, false))}
              </div>
            </div>
          )}

          {/* Past Banner Events */}
          {pastBanners.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Past Banners
              </h3>
              <div className="space-y-4">
                {pastBanners.map((event) => renderBannerCard(event, true))}
              </div>
            </div>
          )}

          {/* Past Regular Events */}
          {pastRegular.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Past Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pastRegular.map((event) => renderEventCard(event, true))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---- Messages Section ----
interface MessagesProps {
  messages: ContactMsg[];
  unreadCount: number;
  onExpand: (msg: ContactMsg | null) => void;
  formatDate: (s: string) => string;
}

function MessagesSection({ messages, unreadCount, onExpand, formatDate }: MessagesProps) {
  return (
    <div className="space-y-4">
      {/* Unread count banner */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800">{unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}</p>
            <p className="text-sm text-amber-600">Click on a message to read it</p>
          </div>
        </div>
      )}

      {/* Messages List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#1a3a6b]" />
            Contact Messages
            <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
              {messages.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No messages yet</p>
              <p className="text-slate-300 text-sm mt-1">
                Contact messages will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => onExpand(msg)}
                  className={`
                    w-full text-left p-4 hover:bg-slate-50 transition-colors
                    ${!msg.isRead ? 'bg-blue-50/40' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold
                        ${!msg.isRead ? 'bg-[#1a3a6b] text-white' : 'bg-slate-200 text-slate-500'}
                      `}
                    >
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}
                        >
                          {msg.name}
                          {!msg.isRead && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />
                          )}
                        </p>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {msg.subject || 'No subject'}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-1">{msg.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Settings Section ----
function SettingsSection() {
  const [formFile, setFormFile] = useState<File | null>(null);
  const [uploading, setFormUploading] = useState(false);
  const [currentFormUrl, setCurrentFormUrl] = useState<string | null>(null);
  const [tvetFormFile, setTvetFormFile] = useState<File | null>(null);
  const [tvetUploading, setTvetUploading] = useState(false);
  const [appFee, setAppFee] = useState('50000');
  const [savingFee, setSavingFee] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings?key=non_formal_form_url').then((r) => r.json()),
      fetch('/api/settings?key=application_fee').then((r) => r.json()),
    ]).then(([nf, af]) => {
      if (nf.value) setCurrentFormUrl(nf.value);
      if (af.value) setAppFee(af.value);
    }).catch(() => {});
  }, []);

  const saveApplicationFee = async () => {
    setSavingFee(true);
    setFeeSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'application_fee', value: appFee }),
      });
      setFeeSaved(true);
      setTimeout(() => setFeeSaved(false), 3000);
    } catch {} finally { setSavingFee(false); }
  };

  const uploadNonFormalForm = async () => {
    if (!formFile) return;
    setFormUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', formFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'non_formal_form_url', value: data.url }),
        });
        setCurrentFormUrl(data.url);
        setFormFile(null);
      }
    } catch {} finally { setFormUploading(false); }
  };

  const uploadTvetForm = async () => {
    if (!tvetFormFile) return;
    setTvetUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', tvetFormFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'tvet_form_url', value: data.url }),
        });
        setTvetFormFile(null);
      }
    } catch {} finally { setTvetUploading(false); }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#1a3a6b]" />
            Institution Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* School Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Institution Name</label>
              <Input defaultValue="St. Kizito&apos;s Technical Institute - Madera" disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Short Code</label>
              <Input defaultValue="SKTIM" disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <Input defaultValue="Madera, Soroti City, Uganda" disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Academic Year</label>
              <Input defaultValue={new Date().getFullYear().toString()} disabled className="bg-slate-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Application Fee ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#1a3a6b]" />
            Application Fee Setting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-400 mb-4">
            Set the non-refundable application fee paid via SchoolPay when students submit their online application. This fee is separate from tuition.
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">UGX</span>
              <Input
                type="number"
                value={appFee}
                onChange={(e) => setAppFee(e.target.value)}
                className="pl-12"
                min="0"
              />
            </div>
            <Button
              onClick={saveApplicationFee}
              disabled={savingFee}
              style={{ backgroundColor: '#f5c518', color: '#1a3a6b' }}
              className="shrink-0 disabled:opacity-50 hover:opacity-90 font-semibold"
            >
              {savingFee ? 'Saving...' : feeSaved ? 'Saved!' : 'Save Fee'}
            </Button>
          </div>
          {feeSaved && (
            <p className="text-xs text-emerald-600 mt-2 font-medium">Application fee updated successfully.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Application Form Management ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1a3a6b]" />
            Admission Form Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TVET Form */}
          <div className="p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Formal Admission Form (TVET)</h4>
            <p className="text-xs text-slate-400 mb-4">The official TVET admission form provided by the Ministry of Education &amp; Sports for national certificate and diploma programmes.</p>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setTvetFormFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-slate-200 hover:border-[#1a3a6b] hover:bg-[#1a3a6b]/5 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600">
                      {tvetFormFile ? tvetFormFile.name : 'Click to select TVET form (PDF/DOC)'}
                    </p>
                    {tvetFormFile && <p className="text-xs text-slate-400">{(tvetFormFile.size / 1024).toFixed(1)} KB</p>}
                  </div>
                </div>
              </label>
              <Button
                onClick={uploadTvetForm}
                disabled={!tvetFormFile || tvetUploading}
                className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white shrink-0 disabled:opacity-50"
              >
                {tvetUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>

          {/* Non-Formal Form */}
          <div className="p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Non-Formal Admission Form (School)</h4>
            <p className="text-xs text-slate-400 mb-4">The institute&apos;s own application form for short courses and vocational skills programmes.</p>
            {currentFormUrl && (
              <p className="text-xs text-emerald-600 mb-3 font-medium">Current file uploaded. Students can now download this form.</p>
            )}
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-slate-200 hover:border-[#f5c518] hover:bg-[#f5c518]/5 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600">
                      {formFile ? formFile.name : 'Click to select non-formal form (PDF/DOC)'}
                    </p>
                    {formFile && <p className="text-xs text-slate-400">{(formFile.size / 1024).toFixed(1)} KB</p>}
                  </div>
                </div>
              </label>
              <Button
                onClick={uploadNonFormalForm}
                disabled={!formFile || uploading}
                style={{ backgroundColor: '#f5c518', color: '#1a3a6b' }}
                className="shrink-0 disabled:opacity-50 hover:opacity-90"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">System Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Version</span>
              <span className="text-slate-700 font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Payment Gateway</span>
              <span className="text-slate-700 font-medium">SchoolPay (Demo)</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Database</span>
              <span className="text-slate-700 font-medium">SQLite</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Framework</span>
              <span className="text-slate-700 font-medium">Next.js 16</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Helper Sub-Components ----

function QuickInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 font-medium truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value || 'Not provided'}</p>
    </div>
  );
}

// ---- Gallery Section ----
function GallerySection({
  items,
  onCreateNew,
  onDelete,
  onTogglePublish,
  formatDate,
}: {
  items: GalleryItem[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onTogglePublish: (item: GalleryItem) => void;
  formatDate: (d: string) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Photo Gallery</h2>
          <p className="text-sm text-slate-500">Manage photos displayed on the public gallery page.</p>
        </div>
        <Button onClick={onCreateNew} className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Photo
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500">No gallery items yet. Add your first photo.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => onTogglePublish(item)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.isPublished
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-400 text-white'
                    }`}
                    title={item.isPublished ? 'Published' : 'Draft'}
                  >
                    {item.isPublished ? '✓' : '✕'}
                  </button>
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {item.eventDate && (
                  <p className="text-xs text-slate-400 mt-1.5">{item.eventDate}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
