'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Trash2, Pencil, Eye, EyeOff, Users, CheckCircle2,
  BookOpen, Loader2, GraduationCap, MapPin, Phone, Mail, Building2,
  Briefcase, X, Download, FileSpreadsheet, FileText, ChevronDown,
  ChevronUp, Filter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

// ===================== TYPES =====================

interface Alumni {
  id: string; fullName: string; email: string | null; phone: string | null;
  graduationYear: string | null; programme: string | null; occupation: string | null;
  employer: string | null; district: string | null; biography: string | null;
  isPublished: boolean; createdAt: string; updatedAt: string;
}

interface YearGroup {
  year: string;
  count: number;
  alumni: Alumni[];
}

interface AlumniFormData {
  fullName: string; email: string; phone: string; graduationYear: string;
  programme: string; occupation: string; employer: string; district: string;
  biography: string; isPublished: boolean;
}

// ===================== CONSTANTS =====================

const PROGRAMMES = [
  'Electrical Installation', 'Plumbing', 'Carpentry & Joinery',
  'Bricklaying & Concrete Practice', 'Motor Vehicle Mechanics',
  'Welding & Fabrication', 'Fashion & Design', 'Cosmetology', 'Other',
] as const;

const BLUE = '#1a3a6b';
const GOLD = '#f5c518';
const BLUE_HOVER = '#142d54';
const BLUE_LIGHT = 'rgba(26, 58, 107, 0.08)';
const GOLD_LIGHT = 'rgba(245, 197, 24, 0.12)';

const EMPTY_FORM: AlumniFormData = {
  fullName: '', email: '', phone: '', graduationYear: '', programme: '',
  occupation: '', employer: '', district: '', biography: '', isPublished: true,
};

// ===================== COMPONENT =====================

export default function AdminAlumniSection() {
  // Data state
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  // View state
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AlumniFormData>({ ...EMPTY_FORM });

  // ---------- Fetch all alumni ----------
  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all records (for grouping + export)
      const params = new URLSearchParams();
      params.set('limit', '9999');
      if (search.trim()) params.set('q', search.trim());
      if (programmeFilter !== 'all') params.set('programme', programmeFilter);
      if (publishedFilter === 'published') params.set('isPublished', 'true');
      if (publishedFilter === 'draft') params.set('isPublished', 'false');

      const res = await fetch(`/api/alumni?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setAllAlumni(json.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, programmeFilter, publishedFilter]);

  useEffect(() => { fetchAlumni(); }, [fetchAlumni]);

  // ---------- Derived data ----------
  const filtered = allAlumni.filter((a) => {
    if (yearFilter !== 'all' && a.graduationYear !== yearFilter) return false;
    return true;
  });

  // Get available years
  const availableYears = Array.from(
    new Set(allAlumni.map((a) => a.graduationYear).filter(Boolean) as string[])
  ).sort((a, b) => b.localeCompare(a));

  const availableProgrammes = Array.from(
    new Set(allAlumni.map((a) => a.programme).filter(Boolean) as string[])
  ).sort();

  // Group by year
  const yearGroups: YearGroup[] = (() => {
    const map = new Map<string, Alumni[]>();
    for (const a of filtered) {
      const yr = a.graduationYear || 'Unknown Year';
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(a);
    }
    return Array.from(map.entries())
      .map(([year, alumni]) => ({ year, count: alumni.length, alumni }))
      .sort((a, b) => {
        if (a.year === 'Unknown Year') return 1;
        if (b.year === 'Unknown Year') return -1;
        return b.year.localeCompare(a.year);
      });
  })();

  // Stats
  const total = allAlumni.length;
  const publishedCount = allAlumni.filter((a) => a.isPublished).length;
  const topProgrammes = Object.entries(
    allAlumni.reduce<Record<string, number>>((acc, a) => {
      const p = a.programme || 'Unspecified';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {})
  ).sort(([, a], [, b]) => b - a).slice(0, 3);

  // ---------- Dialog helpers ----------
  const openAdd = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); setDialogOpen(true); };
  const openEdit = (a: Alumni) => {
    setEditingId(a.id);
    setForm({
      fullName: a.fullName, email: a.email || '', phone: a.phone || '',
      graduationYear: a.graduationYear || '', programme: a.programme || '',
      occupation: a.occupation || '', employer: a.employer || '',
      district: a.district || '', biography: a.biography || '', isPublished: a.isPublished,
    });
    setDialogOpen(true);
  };

  const updateForm = (key: keyof AlumniFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ---------- CRUD ----------
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
      if (editingId) payload.id = editingId;

      const res = await fetch('/api/alumni', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      setDialogOpen(false);
      fetchAlumni();
    } catch (err) { console.error('Save error:', err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (a: Alumni) => {
    if (!window.confirm(`Delete "${a.fullName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/alumni', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id }),
      });
      if (!res.ok) throw new Error();
      fetchAlumni();
    } catch (err) { console.error('Delete error:', err); }
  };

  const handleTogglePublish = async (a: Alumni) => {
    try {
      const res = await fetch('/api/alumni', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, isPublished: !a.isPublished }),
      });
      if (!res.ok) throw new Error();
      fetchAlumni();
    } catch (err) { console.error('Toggle error:', err); }
  };

  // ---------- Export ----------
  const handleExport = async (format: 'xlsx' | 'pdf') => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ format });
      if (yearFilter !== 'all') params.set('year', yearFilter);
      if (programmeFilter !== 'all') params.set('programme', programmeFilter);

      const res = await fetch(`/api/alumni/export?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Export failed.');
        return;
      }

      const contentDisposition = res.headers.get('content-disposition') || '';
      const match = contentDisposition.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : `SKTIM_Alumni.${format === 'xlsx' ? 'xlsx' : 'pdf'}`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Toggle year group expand/collapse
  const toggleYear = (year: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year); else next.add(year);
      return next;
    });
  };

  // ---------- Render helpers ----------
  const blueBtn = { backgroundColor: BLUE };
  const blueHover = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.backgroundColor = BLUE_HOVER; };
  const blueLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.backgroundColor = BLUE; };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const statusBadge = (a: Alumni) => (
    <button onClick={() => handleTogglePublish(a)} className="cursor-pointer" title={a.isPublished ? 'Unpublish' : 'Publish'}>
      <Badge
        className="cursor-pointer transition-colors"
        style={a.isPublished
          ? { backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }
          : { backgroundColor: 'rgba(156,163,175,0.1)', color: '#6b7280', border: '1px solid rgba(156,163,175,0.2)' }
        }
      >
        {a.isPublished ? <Eye className="size-3 mr-1" /> : <EyeOff className="size-3 mr-1" />}
        {a.isPublished ? 'Published' : 'Draft'}
      </Badge>
    </button>
  );

  // ===================== RENDER =====================
  return (
    <div className="w-full space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: BLUE }}>Alumni Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage alumni records. Grouped by class year of completion.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Export Buttons */}
          <Button
            variant="outline" size="sm" className="gap-1.5 text-xs font-medium"
            onClick={() => handleExport('xlsx')} disabled={exporting || total === 0}
          >
            <FileSpreadsheet className="size-3.5" />
            {exporting ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button
            variant="outline" size="sm" className="gap-1.5 text-xs font-medium"
            onClick={() => handleExport('pdf')} disabled={exporting || total === 0}
          >
            <FileText className="size-3.5" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button
            onClick={openAdd} className="text-white font-medium gap-2"
            style={blueBtn} onMouseEnter={blueHover} onMouseLeave={blueLeave}
          >
            <Plus className="size-4" /> Add Alumni
          </Button>
        </div>
      </div>

      {/* ---------- STATS ROW ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex items-center justify-center size-11 rounded-lg shrink-0" style={{ backgroundColor: BLUE_LIGHT }}>
              <Users className="size-5" style={{ color: BLUE }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alumni</p>
              <p className="text-2xl font-bold" style={{ color: BLUE }}>{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex items-center justify-center size-11 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(34,197,94,0.08)' }}>
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex items-center justify-center size-11 rounded-lg shrink-0" style={{ backgroundColor: GOLD_LIGHT }}>
              <GraduationCap className="size-5" style={{ color: '#b8960f' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Class Years</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {availableYears.length > 0
                  ? availableYears.slice(0, 4).map((y) => (
                    <span key={y} className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: GOLD_LIGHT, color: '#b8960f' }}>
                      {y}
                    </span>
                  ))
                  : <span className="text-xs text-muted-foreground">No data yet</span>}
                {availableYears.length > 4 && <span className="text-xs text-muted-foreground">+{availableYears.length - 4} more</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- FILTER BAR ---------- */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search name, email, phone, programme, occupation..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full" />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <GraduationCap className="size-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Class Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y}>Class of {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programmes</SelectItem>
                {availableProgrammes.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-full sm:w-[130px]">
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

      {/* ---------- MAIN CONTENT ---------- */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin" style={{ color: BLUE }} />
              <span className="ml-2 text-muted-foreground">Loading alumni...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="flex items-center justify-center size-16 rounded-full mb-4" style={{ backgroundColor: BLUE_LIGHT }}>
                <GraduationCap className="size-8" style={{ color: BLUE, opacity: 0.5 }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: BLUE }}>No Alumni Found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {search || yearFilter !== 'all' || programmeFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding the first alumni member.'}
              </p>
              {!search && yearFilter === 'all' && programmeFilter === 'all' && (
                <Button onClick={openAdd} className="mt-4 text-white gap-2 font-medium" style={blueBtn} onMouseEnter={blueHover} onMouseLeave={blueLeave}>
                  <Plus className="size-4" /> Add First Alumni
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Grouped View */}
              {yearGroups.map((group) => {
                const isExpanded = expandedYears.has(group.year) || yearGroups.length === 1 || yearFilter !== 'all';
                return (
                  <div key={group.year} className="border-b last:border-0">
                    {/* Year Group Header */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                      onClick={() => toggleYear(group.year)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-9 rounded-lg" style={{ backgroundColor: BLUE_LIGHT }}>
                          <GraduationCap className="size-4" style={{ color: BLUE }} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold" style={{ color: BLUE }}>
                            Class of {group.year}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {group.count} {group.count === 1 ? 'alumnus' : 'alumni'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-medium" style={{ backgroundColor: GOLD_LIGHT, color: '#b8960f' }}>
                          {group.count}
                        </Badge>
                        {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {/* Group Members (Desktop) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          {/* Desktop Table */}
                          <div className="hidden md:block">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-transparent" style={{ borderBottom: `1px solid ${BLUE_LIGHT}` }}>
                                  <TableHead className="text-xs font-semibold pl-4" style={{ color: BLUE }}>Name</TableHead>
                                  <TableHead className="text-xs font-semibold" style={{ color: BLUE }}>Programme</TableHead>
                                  <TableHead className="text-xs font-semibold" style={{ color: BLUE }}>Occupation</TableHead>
                                  <TableHead className="text-xs font-semibold" style={{ color: BLUE }}>Contact</TableHead>
                                  <TableHead className="text-xs font-semibold" style={{ color: BLUE }}>District</TableHead>
                                  <TableHead className="text-xs font-semibold" style={{ color: BLUE }}>Status</TableHead>
                                  <TableHead className="text-xs font-semibold text-right pr-4" style={{ color: BLUE }}>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {group.alumni.map((a) => (
                                  <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium py-2.5 pl-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center size-7 rounded-full text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: BLUE }}>
                                          {initials(a.fullName)}
                                        </div>
                                        <span className="truncate text-sm">{a.fullName}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2.5"><span className="text-xs">{a.programme || '—'}</span></TableCell>
                                    <TableCell className="py-2.5"><span className="text-xs">{a.occupation || '—'}</span></TableCell>
                                    <TableCell className="py-2.5">
                                      <div className="flex flex-col gap-0.5">
                                        {a.email && <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">{a.email}</span>}
                                        {a.phone && <span className="text-[11px] text-muted-foreground">{a.phone}</span>}
                                        {!a.email && !a.phone && <span className="text-xs text-muted-foreground">—</span>}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                      {a.district ? (
                                        <span className="text-xs flex items-center gap-1"><MapPin className="size-3 text-muted-foreground" />{a.district}</span>
                                      ) : <span className="text-xs text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="py-2.5">{statusBadge(a)}</TableCell>
                                    <TableCell className="py-2.5 text-right pr-4">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="size-7 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEdit(a)} title="Edit"><Pencil className="size-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="size-7 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(a)} title="Delete"><Trash2 className="size-3.5" /></Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Cards */}
                          <div className="md:hidden divide-y">
                            {group.alumni.map((a) => (
                              <div key={a.id} className="p-4 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="flex items-center justify-center size-9 rounded-full text-white text-xs font-bold shrink-0" style={{ backgroundColor: BLUE }}>
                                      {initials(a.fullName)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-sm truncate">{a.fullName}</p>
                                      {a.programme && (
                                        <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}>{a.programme}</span>
                                      )}
                                    </div>
                                  </div>
                                  {statusBadge(a)}
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                                  {a.occupation && <div className="flex items-center gap-1 truncate"><Briefcase className="size-3 shrink-0" />{a.occupation}</div>}
                                  {a.employer && <div className="flex items-center gap-1 truncate"><Building2 className="size-3 shrink-0" />{a.employer}</div>}
                                  {a.phone && <div className="flex items-center gap-1 truncate"><Phone className="size-3 shrink-0" />{a.phone}</div>}
                                  {a.district && <div className="flex items-center gap-1 truncate"><MapPin className="size-3 shrink-0" />{a.district}</div>}
                                  {a.email && <div className="flex items-center gap-1 truncate col-span-2"><Mail className="size-3 shrink-0" />{a.email}</div>}
                                </div>
                                <div className="flex items-center justify-end gap-1 pt-1">
                                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] hover:bg-blue-50 hover:text-blue-700" onClick={() => openEdit(a)}><Pencil className="size-3" />Edit</Button>
                                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(a)}><Trash2 className="size-3" />Delete</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Summary footer */}
              <div className="px-4 py-3 bg-muted/30 text-xs text-muted-foreground">
                Showing {filtered.length} of {total} alumni
                {yearFilter !== 'all' && ` (Class of ${yearFilter})`}
                {programmeFilter !== 'all' && ` (${programmeFilter})`}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------- ADD / EDIT DIALOG ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ color: BLUE }}>{editingId ? 'Edit Alumni' : 'Add New Alumni'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. John Mukasa" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input type="email" placeholder="name@example.com" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <Input placeholder="0771234567" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Graduation Year</Label>
                <Input placeholder="e.g. 2020" value={form.graduationYear} onChange={(e) => updateForm('graduationYear', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Programme</Label>
                <Select value={form.programme} onValueChange={(v) => updateForm('programme', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select programme" /></SelectTrigger>
                  <SelectContent>{PROGRAMMES.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Occupation</Label>
                <Input placeholder="e.g. Electrician" value={form.occupation} onChange={(e) => updateForm('occupation', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Employer</Label>
                <Input placeholder="e.g. Umeme Ltd" value={form.employer} onChange={(e) => updateForm('employer', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">District</Label>
              <Input placeholder="e.g. Soroti" value={form.district} onChange={(e) => updateForm('district', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Biography</Label>
              <Textarea placeholder="Brief biography or achievements..." value={form.biography} onChange={(e) => updateForm('biography', e.target.value)} rows={3} className="resize-none" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Published</Label>
                <p className="text-xs text-muted-foreground">{form.isPublished ? 'Visible on the public page' : 'Hidden from public page'}</p>
              </div>
              <Switch checked={form.isPublished} onCheckedChange={(c) => updateForm('isPublished', c)} />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving} className="gap-2"><X className="size-4" />Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.fullName.trim()} className="text-white font-medium gap-2" style={{ backgroundColor: BLUE, opacity: !form.fullName.trim() ? 0.5 : 1 }} onMouseEnter={(e) => { if (form.fullName.trim()) e.currentTarget.style.backgroundColor = BLUE_HOVER; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BLUE; }}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
