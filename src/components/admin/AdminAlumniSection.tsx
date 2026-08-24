'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  BookOpen,
  Loader2,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Building2,
  Briefcase,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ===================== TYPES =====================

interface Alumni {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  graduationYear: string | null;
  programme: string | null;
  occupation: string | null;
  employer: string | null;
  district: string | null;
  biography: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AlumniApiResponse {
  data: Alumni[];
  total: number;
  page: number;
  totalPages: number;
}

interface AlumniFormData {
  fullName: string;
  email: string;
  phone: string;
  graduationYear: string;
  programme: string;
  occupation: string;
  employer: string;
  district: string;
  biography: string;
  isPublished: boolean;
}

// ===================== CONSTANTS =====================

const PROGRAMMES = [
  'Electrical Installation',
  'Plumbing',
  'Carpentry & Joinery',
  'Bricklaying & Concrete Practice',
  'Motor Vehicle Mechanics',
  'Welding & Fabrication',
  'Fashion & Design',
  'Cosmetology',
  'Other',
] as const;

const BLUE = '#1a3a6b';
const GOLD = '#f5c518';
const BLUE_HOVER = '#142d54';
const BLUE_LIGHT = 'rgba(26, 58, 107, 0.08)';
const GOLD_LIGHT = 'rgba(245, 197, 24, 0.12)';

const EMPTY_FORM: AlumniFormData = {
  fullName: '',
  email: '',
  phone: '',
  graduationYear: '',
  programme: '',
  occupation: '',
  employer: '',
  district: '',
  biography: '',
  isPublished: true,
};

// ===================== HELPERS =====================

function computeProgrammeSummary(alumni: Alumni[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of alumni) {
    const p = a.programme || 'Unspecified';
    counts[p] = (counts[p] || 0) + 1;
  }
  return counts;
}

// ===================== COMPONENT =====================

export default function AdminAlumniSection() {
  // Data state
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filter / pagination state
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AlumniFormData>({ ...EMPTY_FORM });

  // Available programmes for filter (derived from data)
  const [availableProgrammes, setAvailableProgrammes] = useState<string[]>([]);

  // ---------- Fetch ----------
  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (programmeFilter !== 'all') params.set('programme', programmeFilter);
      if (publishedFilter === 'published') params.set('isPublished', 'true');
      if (publishedFilter === 'draft') params.set('isPublished', 'false');

      const res = await fetch(`/api/alumni?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch alumni');
      const json: AlumniApiResponse = await res.json();
      setAlumni(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);

      // Collect unique programmes from all data for filter
      const progs = Array.from(new Set(json.data.map((a) => a.programme).filter(Boolean) as string[])).sort();
      setAvailableProgrammes(progs);
    } catch (err) {
      console.error('Failed to fetch alumni:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page, programmeFilter, publishedFilter]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // ---------- Reset to page 1 on filter change ----------
  useEffect(() => {
    setPage(1);
  }, [search, programmeFilter, publishedFilter]);

  // ---------- Stats ----------
  const publishedCount = alumni.filter((a) => a.isPublished).length;
  const programmeSummary = computeProgrammeSummary(alumni);
  const topProgrammes = Object.entries(programmeSummary)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // ---------- Dialog helpers ----------
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setDialogOpen(true);
  };

  const openEdit = (a: Alumni) => {
    setEditingId(a.id);
    setForm({
      fullName: a.fullName,
      email: a.email || '',
      phone: a.phone || '',
      graduationYear: a.graduationYear || '',
      programme: a.programme || '',
      occupation: a.occupation || '',
      employer: a.employer || '',
      district: a.district || '',
      biography: a.biography || '',
      isPublished: a.isPublished,
    });
    setDialogOpen(true);
  };

  // ---------- Save (create / update) ----------
  const handleSave = async () => {
    if (!form.fullName.trim()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: form.fullName.trim(),
        ...(form.email ? { email: form.email.trim() } : {}),
        ...(form.phone ? { phone: form.phone.trim() } : {}),
        ...(form.graduationYear ? { graduationYear: form.graduationYear.trim() } : {}),
        ...(form.programme ? { programme: form.programme } : {}),
        ...(form.occupation ? { occupation: form.occupation.trim() } : {}),
        ...(form.employer ? { employer: form.employer.trim() } : {}),
        ...(form.district ? { district: form.district.trim() } : {}),
        ...(form.biography ? { biography: form.biography.trim() } : {}),
        isPublished: form.isPublished,
      };

      if (editingId) {
        payload.id = editingId;
      }

      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/alumni', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save alumni');
      setDialogOpen(false);
      fetchAlumni();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (a: Alumni) => {
    if (!window.confirm(`Are you sure you want to delete "${a.fullName}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch('/api/alumni', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id }),
      });
      if (!res.ok) throw new Error('Failed to delete alumni');
      fetchAlumni();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ---------- Publish toggle ----------
  const handleTogglePublish = async (a: Alumni) => {
    try {
      const res = await fetch('/api/alumni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, isPublished: !a.isPublished }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchAlumni();
    } catch (err) {
      console.error('Toggle publish error:', err);
    }
  };

  // ---------- Form field updater ----------
  const updateForm = (key: keyof AlumniFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ===================== RENDER =====================
  return (
    <div className="w-full space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: BLUE }}>
            Alumni Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered alumni members that appear on the public alumni page.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="text-white font-medium gap-2 shrink-0"
          style={{ backgroundColor: BLUE, hover: { backgroundColor: BLUE_HOVER } }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLUE_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLUE)}
        >
          <Plus className="size-4" />
          Add Alumni
        </Button>
      </div>

      {/* ---------- STATS ROW ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className="flex items-center justify-center size-11 rounded-lg shrink-0"
              style={{ backgroundColor: BLUE_LIGHT }}
            >
              <Users className="size-5" style={{ color: BLUE }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alumni</p>
              <p className="text-2xl font-bold" style={{ color: BLUE }}>
                {total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className="flex items-center justify-center size-11 rounded-lg shrink-0"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)' }}
            >
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {publishedCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className="flex items-center justify-center size-11 rounded-lg shrink-0"
              style={{ backgroundColor: GOLD_LIGHT }}
            >
              <BookOpen className="size-5" style={{ color: '#b8960f' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">By Programme</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {topProgrammes.length > 0 ? (
                  topProgrammes.map(([prog, count]) => (
                    <span
                      key={prog}
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: GOLD_LIGHT, color: '#b8960f' }}
                    >
                      {prog.length > 16 ? prog.slice(0, 16) + '…' : prog}: {count}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No data yet</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- FILTER BAR ---------- */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone, programme, occupation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            {/* Programme Filter */}
            <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programmes</SelectItem>
                {availableProgrammes.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Published Filter */}
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ---------- MAIN TABLE / CARD LIST ---------- */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin" style={{ color: BLUE }} />
              <span className="ml-2 text-muted-foreground">Loading alumni...</span>
            </div>
          ) : alumni.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div
                className="flex items-center justify-center size-16 rounded-full mb-4"
                style={{ backgroundColor: BLUE_LIGHT }}
              >
                <GraduationCap className="size-8" style={{ color: BLUE, opacity: 0.5 }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: BLUE }}>
                No Alumni Found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {search || programmeFilter !== 'all' || publishedFilter !== 'all'
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Get started by adding the first alumni member to the directory.'}
              </p>
              {!search && programmeFilter === 'all' && publishedFilter === 'all' && (
                <Button
                  onClick={openAdd}
                  className="mt-4 text-white gap-2 font-medium"
                  style={{ backgroundColor: BLUE }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLUE_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLUE)}
                >
                  <Plus className="size-4" />
                  Add First Alumni
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      className="hover:bg-transparent"
                      style={{ borderBottom: `2px solid ${BLUE_LIGHT}` }}
                    >
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Name
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Programme
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Year
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Occupation
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        District
                      </TableHead>
                      <TableHead className="font-semibold" style={{ color: BLUE }}>
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-right" style={{ color: BLUE }}>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {alumni.map((a) => (
                        <motion.tr
                          key={a.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium py-3">
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <div
                                className="flex items-center justify-center size-8 rounded-full text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: BLUE }}
                              >
                                {a.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </div>
                              <span className="truncate">{a.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            {a.programme ? (
                              <span className="text-sm">{a.programme}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            {a.graduationYear ? (
                              <span className="text-sm">{a.graduationYear}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            {a.occupation ? (
                              <span className="text-sm">{a.occupation}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col gap-0.5 min-w-[150px]">
                              {a.email && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                  <Mail className="size-3 shrink-0" /> {a.email}
                                </span>
                              )}
                              {a.phone && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="size-3 shrink-0" /> {a.phone}
                                </span>
                              )}
                              {!a.email && !a.phone && (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            {a.district ? (
                              <span className="text-sm flex items-center gap-1">
                                <MapPin className="size-3 text-muted-foreground" />
                                {a.district}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <button
                              onClick={() => handleTogglePublish(a)}
                              className="cursor-pointer"
                              title={a.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              <Badge
                                className="cursor-pointer transition-colors"
                                style={
                                  a.isPublished
                                    ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.2)' }
                                    : { backgroundColor: 'rgba(156, 163, 175, 0.1)', color: '#6b7280', border: '1px solid rgba(156, 163, 175, 0.2)' }
                                }
                              >
                                {a.isPublished ? (
                                  <Eye className="size-3 mr-1" />
                                ) : (
                                  <EyeOff className="size-3 mr-1" />
                                )}
                                {a.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                            </button>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => openEdit(a)}
                                title="Edit"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDelete(a)}
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y">
                <AnimatePresence mode="popLayout">
                  {alumni.map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="flex items-center justify-center size-10 rounded-full text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: BLUE }}
                          >
                            {a.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{a.fullName}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {a.programme && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}>
                                  {a.programme}
                                </span>
                              )}
                              {a.graduationYear && (
                                <span className="text-xs text-muted-foreground">Class of {a.graduationYear}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleTogglePublish(a)} className="cursor-pointer">
                            <Badge
                              className="cursor-pointer text-[10px] px-1.5 py-0"
                              style={
                                a.isPublished
                                  ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.2)' }
                                  : { backgroundColor: 'rgba(156, 163, 175, 0.1)', color: '#6b7280', border: '1px solid rgba(156, 163, 175, 0.2)' }
                              }
                            >
                              {a.isPublished ? <Eye className="size-2.5 mr-0.5" /> : <EyeOff className="size-2.5 mr-0.5" />}
                              {a.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {a.occupation && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Briefcase className="size-3.5 shrink-0" />
                            <span className="truncate">{a.occupation}</span>
                          </div>
                        )}
                        {a.employer && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="size-3.5 shrink-0" />
                            <span className="truncate">{a.employer}</span>
                          </div>
                        )}
                        {a.district && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            <span className="truncate">{a.district}</span>
                          </div>
                        )}
                        {a.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="size-3.5 shrink-0" />
                            <span className="truncate">{a.phone}</span>
                          </div>
                        )}
                        {a.email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                            <Mail className="size-3.5 shrink-0" />
                            <span className="truncate">{a.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => openEdit(a)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(a)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ---------- PAGINATION ---------- */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>

                    {/* Page number buttons */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          // Show first, last, and pages around current
                          if (p === 1 || p === totalPages) return true;
                          if (Math.abs(p - page) <= 1) return true;
                          return false;
                        })
                        .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) {
                            acc.push('ellipsis');
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === 'ellipsis' ? (
                            <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground">
                              …
                            </span>
                          ) : (
                            <Button
                              key={item}
                              variant={page === item ? 'default' : 'outline'}
                              size="icon"
                              className="size-8"
                              style={
                                page === item
                                  ? { backgroundColor: BLUE, borderColor: BLUE, hover: { backgroundColor: BLUE_HOVER } }
                                  : {}
                              }
                              onMouseEnter={(e) => {
                                if (page === item) e.currentTarget.style.backgroundColor = BLUE_HOVER;
                              }}
                              onMouseLeave={(e) => {
                                if (page === item) e.currentTarget.style.backgroundColor = BLUE;
                              }}
                              onClick={() => setPage(item)}
                            >
                              {item}
                            </Button>
                          )
                        )}
                    </div>

                    {/* Mobile page indicator */}
                    <span className="sm:hidden text-sm text-muted-foreground">
                      Page {page} / {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------- ADD / EDIT DIALOG ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ color: BLUE }}>
              {editingId ? 'Edit Alumni' : 'Add New Alumni'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Full Name (required) */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. John Mukasa"
                value={form.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="e.g. 0771234567"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Graduation Year & Programme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-sm font-medium">
                  Graduation Year
                </Label>
                <Input
                  id="graduationYear"
                  placeholder="e.g. 2020"
                  value={form.graduationYear}
                  onChange={(e) => updateForm('graduationYear', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Programme</Label>
                <Select value={form.programme} onValueChange={(v) => updateForm('programme', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select programme" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMMES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Occupation & Employer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-sm font-medium">
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  placeholder="e.g. Electrician"
                  value={form.occupation}
                  onChange={(e) => updateForm('occupation', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer" className="text-sm font-medium">
                  Employer
                </Label>
                <Input
                  id="employer"
                  placeholder="e.g. Uganda Electricity Co."
                  value={form.employer}
                  onChange={(e) => updateForm('employer', e.target.value)}
                />
              </div>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-medium">
                District
              </Label>
              <Input
                id="district"
                placeholder="e.g. Kampala"
                value={form.district}
                onChange={(e) => updateForm('district', e.target.value)}
              />
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <Label htmlFor="biography" className="text-sm font-medium">
                Biography
              </Label>
              <Textarea
                id="biography"
                placeholder="Brief biography or achievements..."
                value={form.biography}
                onChange={(e) => updateForm('biography', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Published</Label>
                <p className="text-xs text-muted-foreground">
                  {form.isPublished
                    ? 'Visible on the public alumni page'
                    : 'Hidden from the public alumni page'}
                </p>
              </div>
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) => updateForm('isPublished', checked)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
                className="gap-2"
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.fullName.trim()}
                className="text-white font-medium gap-2"
                style={{
                  backgroundColor: BLUE,
                  opacity: !form.fullName.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (form.fullName.trim()) e.currentTarget.style.backgroundColor = BLUE_HOVER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BLUE;
                }}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}