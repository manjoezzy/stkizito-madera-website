'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  UserCheck,
  BookOpen,
  ArrowLeft,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

interface AdmissionApplication {
  id: string;
  referenceNumber: string;
  status: string;
  fullName: string;
  programme: string;
  intakeYear: string;
  createdAt: string;
  email?: string;
  phone?: string;
}

type StatusFilter = 'all' | 'approved' | 'enrolled';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdmissionsEnrolledPage() {
  const { setCurrentPage } = useAppStore();

  const [students, setStudents] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [programmeFilter, setProgrammeFilter] = useState('');
  const [showProgrammeDropdown, setShowProgrammeDropdown] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('status', 'enrolled');
      const resEnrolled = await fetch(`/api/admissions?${params.toString()}`);
      if (!resEnrolled.ok) throw new Error('Failed to fetch enrolled students');
      const dataEnrolled = await resEnrolled.json();

      const params2 = new URLSearchParams();
      params2.set('status', 'approved');
      const resApproved = await fetch(`/api/admissions?${params2.toString()}`);
      if (!resApproved.ok) throw new Error('Failed to fetch approved students');
      const dataApproved = await resApproved.json();

      const enrolled = dataEnrolled.success ? dataEnrolled.data : [];
      const approved = dataApproved.success ? dataApproved.data : [];

      // Merge, avoiding duplicates by id
      const combined = [...enrolled];
      for (const a of approved) {
        if (!combined.some((e) => e.id === a.id)) {
          combined.push(a);
        }
      }

      setStudents(combined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const programmes = useMemo(() => {
    const set = new Set(students.map((s) => s.programme).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.programme?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesProgramme = !programmeFilter || s.programme === programmeFilter;
      return matchesSearch && matchesStatus && matchesProgramme;
    });
  }, [students, searchQuery, statusFilter, programmeFilter]);

  const enrolledCount = students.filter((s) => s.status === 'enrolled').length;
  const approvedCount = students.filter((s) => s.status === 'approved').length;
  const totalProgrammes = programmes.length;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
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

  const statusBadge = (status: string) => {
    if (status === 'enrolled') {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-medium">
          Enrolled
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 font-medium">
        Approved
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <section
        className="relative pt-[104px] lg:pt-[108px] pb-16 md:pb-20 px-4 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full" style={{ background: GOLD, filter: 'blur(60px)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GraduationCap className="mx-auto mb-5 w-12 h-12 text-white/80" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Enrolled Students
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Students who have been approved and enrolled at SKTIM
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* ── Back Link ── */}
          <button
            onClick={() => setCurrentPage('admissions')}
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline transition-colors"
            style={{ color: PRIMARY }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admissions
          </button>

          {/* ── Filter Bar ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, reference, or programme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowProgrammeDropdown(!showProgrammeDropdown)}
                  className="h-11 min-w-[160px] justify-between font-normal"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {programmeFilter || 'All Programmes'}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
                {showProgrammeDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setProgrammeFilter(''); setShowProgrammeDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${!programmeFilter ? 'font-semibold' : ''}`}
                    >
                      All Programmes
                    </button>
                    {programmes.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setProgrammeFilter(p); setShowProgrammeDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${programmeFilter === p ? 'font-semibold' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(['all', 'approved', 'enrolled'] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                      statusFilter === s
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={statusFilter === s ? { backgroundColor: PRIMARY } : undefined}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, #059669, #10b981)` }}
                  >
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? <Skeleton className="h-7 w-12 inline-block" /> : enrolledCount}
                    </p>
                    <p className="text-sm text-gray-500">Total Enrolled</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? <Skeleton className="h-7 w-12 inline-block" /> : approvedCount}
                    </p>
                    <p className="text-sm text-gray-500">Total Approved</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, #d97706, #f59e0b)` }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? <Skeleton className="h-7 w-12 inline-block" /> : totalProgrammes}
                    </p>
                    <p className="text-sm text-gray-500">Total Programmes</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="border border-gray-100">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ── Error State ── */}
          {error && !loading && (
            <Card className="border border-red-100">
              <CardContent className="p-8 text-center">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <Button variant="outline" onClick={fetchStudents}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── Empty State ── */}
          {!loading && !error && filtered.length === 0 && (
            <Card className="border border-gray-100">
              <CardContent className="p-12 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: PRIMARY + '10' }}
                >
                  <Users className="w-8 h-8" style={{ color: PRIMARY }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {students.length === 0
                    ? 'There are no enrolled or approved students at this time.'
                    : 'No students match your current filters. Try adjusting your search or filter criteria.'}
                </p>
                {(searchQuery || statusFilter !== 'all' || programmeFilter) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setProgrammeFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Desktop Table ── */}
          {!loading && !error && filtered.length > 0 && (
            <>
              {/* Desktop: Table layout */}
              <div className="hidden md:block">
                <Card className="border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Programme</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intake Year</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((student, index) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.03 }}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{student.fullName}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{student.referenceNumber}</p>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-gray-700">{student.programme}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                {student.intakeYear}
                              </div>
                            </td>
                            <td className="px-5 py-4">{statusBadge(student.status)}</td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-gray-500">{formatDate(student.createdAt)}</p>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Mobile: Card layout */}
              <div className="md:hidden space-y-3">
                {filtered.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <Card className="border border-gray-100 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{student.fullName}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{student.referenceNumber}</p>
                          </div>
                          {statusBadge(student.status)}
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Programme</span>
                            <span className="text-gray-700 font-medium text-right truncate ml-3">{student.programme}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Intake Year</span>
                            <span className="text-gray-700 font-medium">{student.intakeYear}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="text-gray-700 font-medium">{formatDate(student.createdAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Results count */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                Showing {filtered.length} of {students.length} student{students.length !== 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
