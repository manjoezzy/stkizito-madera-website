'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImagePlus,
  Video,
  Search,
  Plus,
  Trash2,
  Pencil,
  Play,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Film,
  Upload,
  X,
  Loader2,
  GraduationCap,
  CalendarDays,
  Camera,
  CircleAlert,
  FileVideo,
  GripVertical,
  CheckCircle2,
  XCircle,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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

// ===================== TYPES =====================

interface GraduationItem {
  id: string;
  title: string;
  description: string | null;
  itemType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  ceremonyYear: string;
  ceremonyName: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GraduationApiResponse {
  data: GraduationItem[];
  total: number;
  page: number;
  totalPages: number;
}

interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface FormData {
  title: string;
  description: string;
  itemType: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  ceremonyYear: string;
  ceremonyName: string;
  sortOrder: number;
}

// ===================== CONSTANTS =====================

const PRIMARY_BLUE = '#1a3a6b';
const GOLD_ACCENT = '#f5c518';
const ITEMS_PER_PAGE = 12;

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  itemType: 'photo',
  mediaUrl: '',
  thumbnailUrl: '',
  ceremonyYear: new Date().getFullYear().toString(),
  ceremonyName: '',
  sortOrder: 0,
};

// ===================== ANIMATION VARIANTS =====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const fadeInVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

// ===================== COMPONENT =====================

export default function AdminGraduationSection() {
  // ---- Data State ----
  const [items, setItems] = useState<GraduationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---- Filter State ----
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // ---- Pagination State ----
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Dialog State ----
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GraduationItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...EMPTY_FORM });

  // ---- Upload State ----
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Action State ----
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);

  // ===================== DATA FETCHING =====================

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (filterType !== 'all') params.set('type', filterType);
      if (filterYear !== 'all') params.set('year', filterYear);

      const res = await fetch(`/api/graduation?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch graduation items');

      const json: GraduationApiResponse = await res.json();
      let filtered = json.data;

      // Client-side search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.ceremonyName && item.ceremonyName.toLowerCase().includes(q))
        );
      }

      setItems(filtered);
      setTotal(json.total);
      setTotalPages(json.totalPages);

      // Extract unique years from data
      const years = new Set<string>();
      json.data.forEach((item) => years.add(item.ceremonyYear));
      setAvailableYears(
        Array.from(years).sort((a, b) => b.localeCompare(a))
      );
    } catch (err) {
      console.error('Error fetching graduation items:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterType, filterYear, searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ===================== COMPUTED STATS =====================

  const stats = React.useMemo(() => {
    const photoCount = items.filter((i) => i.itemType === 'photo').length;
    const videoCount = items.filter((i) => i.itemType === 'video').length;
    const publishedCount = items.filter((i) => i.isPublished).length;
    return { total: items.length, photoCount, videoCount, publishedCount };
  }, [items]);

  // ===================== HANDLERS =====================

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ ...EMPTY_FORM, ceremonyYear: new Date().getFullYear().toString() });
    setUploadPreview(null);
    setUploadFileName('');
    setDialogOpen(true);
  };

  const openEditDialog = (item: GraduationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      itemType: item.itemType as 'photo' | 'video',
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || '',
      ceremonyYear: item.ceremonyYear,
      ceremonyName: item.ceremonyName || '',
      sortOrder: item.sortOrder,
    });
    setUploadPreview(item.itemType === 'photo' ? item.mediaUrl : (item.thumbnailUrl || null));
    setUploadFileName('');
    setDialogOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    // Validate file
    const isImage = file.type.startsWith('image/');
    const isVideo = ['video/mp4', 'video/webm', 'video/ogg'].includes(file.type);

    if (!isImage && !isVideo) {
      alert('Unsupported file type. Please upload an image (JPG, PNG, WebP, GIF) or video (MP4, WebM, OGG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'graduation');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');

      const data: UploadResponse = await res.json();
      setFormData((prev) => ({
        ...prev,
        mediaUrl: data.url,
        itemType: isVideo ? 'video' : prev.itemType,
      }));
      setUploadFileName(data.fileName);

      // Generate preview
      if (isImage) {
        setUploadPreview(data.url);
      } else {
        const videoEl = document.createElement('video');
        videoEl.src = data.url;
        videoEl.currentTime = 1;
        videoEl.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoEl.videoWidth || 640;
          canvas.height = videoEl.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            setUploadPreview(canvas.toDataURL('image/jpeg', 0.7));
          }
        }, { once: true });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }
    if (!formData.mediaUrl.trim()) {
      alert('Please upload a media file.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // Update
        const res = await fetch('/api/graduation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        // Create
        const res = await fetch('/api/graduation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GraduationItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(item.id);
    try {
      const res = await fetch('/api/graduation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (item: GraduationItem) => {
    setTogglingPublish(item.id);
    try {
      const res = await fetch('/api/graduation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      fetchItems();
    } catch (err) {
      console.error('Toggle publish error:', err);
      alert('Failed to update publish status.');
    } finally {
      setTogglingPublish(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterYear('all');
    setFilterType('all');
    setCurrentPage(1);
  };

  // ===================== RENDER HELPERS =====================

  const renderMediaCard = (item: GraduationItem) => {
    const isVideo = item.itemType === 'video';
    const imageSrc = isVideo ? item.thumbnailUrl : item.mediaUrl;

    return (
      <motion.div key={item.id} variants={cardVariants} layout>
        <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-200">
          {/* Media Preview */}
          <div className="relative aspect-video bg-muted/50 overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {isVideo ? (
                  <Film className="w-12 h-12 text-muted-foreground/40" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                )}
              </div>
            )}

            {/* Play icon overlay for videos */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:bg-black/70 transition-colors"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/50 text-white border-0"
              >
                {isVideo ? 'Video' : 'Photo'}
              </Badge>
            </div>

            {/* Published indicator */}
            <div className="absolute top-2 right-2">
              {item.isPublished ? (
                <Badge
                  className="text-[10px] font-semibold bg-green-600 text-white border-0"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold backdrop-blur-md bg-black/50 text-white border-0"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Draft
                </Badge>
              )}
            </div>

            {/* Hover actions overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <button
                  onClick={() => openEditDialog(item)}
                  className="p-1.5 rounded-md bg-white/90 hover:bg-white text-gray-800 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="p-1.5 rounded-md bg-red-500/90 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <CardContent className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                {item.title}
              </h3>
              <Badge
                className="shrink-0 text-[10px] font-bold px-1.5 py-0"
                style={{
                  backgroundColor: PRIMARY_BLUE,
                  color: 'white',
                }}
              >
                {item.ceremonyYear}
              </Badge>
            </div>

            {item.ceremonyName && (
              <p className="text-xs text-muted-foreground truncate">
                {item.ceremonyName}
              </p>
            )}

            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Actions row */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {isVideo ? (
                  <FileVideo className="w-3 h-3" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
                <span className="capitalize">{item.itemType}</span>
                {item.sortOrder > 0 && (
                  <span className="text-muted-foreground/60">· Order: {item.sortOrder}</span>
                )}
              </div>

              <button
                onClick={() => handleTogglePublish(item)}
                disabled={togglingPublish === item.id}
                className="flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-50"
                style={{
                  color: item.isPublished ? '#16a34a' : '#9ca3af',
                }}
              >
                {togglingPublish === item.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : item.isPublished ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                {item.isPublished ? 'Published' : 'Draft'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ===================== MAIN RENDER =====================

  return (
    <section className="space-y-6">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${PRIMARY_BLUE}15` }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: PRIMARY_BLUE }} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: PRIMARY_BLUE }}>
              Graduation Gallery
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-[46px]">
            Manage graduation photos and videos displayed on the public graduation page
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="shrink-0 text-white font-semibold shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: PRIMARY_BLUE }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#244a8a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BLUE)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </motion.div>

      {/* ===== FILTER BAR ===== */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or ceremony name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>

        {/* Year Filter */}
        <Select
          value={filterYear}
          onValueChange={(val) => {
            setFilterYear(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filterType}
          onValueChange={(val) => {
            setFilterType(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px] h-10">
            <LayoutGrid className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="photo">Photos</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset filters button (shown when any filter is active) */}
        {(searchQuery || filterYear !== 'all' || filterType !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </motion.div>

      {/* ===== STATS ROW ===== */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${PRIMARY_BLUE}15` }}
            >
              <ImagePlus className="w-4.5 h-4.5" style={{ color: PRIMARY_BLUE }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="text-lg font-bold" style={{ color: PRIMARY_BLUE }}>{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#dbeafe' }}
            >
              <Camera className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Photos</p>
              <p className="text-lg font-bold text-blue-600">{stats.photoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <Video className="w-4.5 h-4.5" style={{ color: '#d97706' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Videos</p>
              <p className="text-lg font-bold" style={{ color: '#d97706' }}>{stats.videoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#dcfce7' }}
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Published</p>
              <p className="text-lg font-bold text-green-600">{stats.publishedCount}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== GRID / LOADING / EMPTY STATE ===== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${PRIMARY_BLUE}10` }}
              >
                <GraduationCap className="w-8 h-8" style={{ color: `${PRIMARY_BLUE}60` }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No graduation items found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchQuery || filterYear !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your filters or search query to find what you\'re looking for.'
                    : 'Get started by adding your first graduation photo or video to the gallery.'}
                </p>
              </div>
              {searchQuery || filterYear !== 'all' || filterType !== 'all' ? (
                <Button variant="outline" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={openAddDialog}
                  className="text-white font-semibold"
                  style={{ backgroundColor: PRIMARY_BLUE }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#244a8a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BLUE)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Media
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {items.map(renderMediaCard)}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ===== PAGINATION ===== */}
      {!loading && totalPages > 1 && (
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between pt-2"
        >
          <p className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span>{' '}
            · <span className="font-semibold text-foreground">{total}</span> total items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-9"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-9"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ===== ADD/EDIT DIALOG ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${PRIMARY_BLUE}15` }}
              >
                {editingItem ? (
                  <Pencil className="w-4 h-4" style={{ color: PRIMARY_BLUE }} />
                ) : (
                  <Plus className="w-4 h-4" style={{ color: PRIMARY_BLUE }} />
                )}
              </div>
              <span style={{ color: PRIMARY_BLUE }}>
                {editingItem ? 'Edit Media' : 'Add New Media'}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="grad-title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="grad-title"
                placeholder="e.g., Graduation Ceremony 2024"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="grad-desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="grad-desc"
                placeholder="Brief description of this media item..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Type & Year Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Media Type</Label>
                <Select
                  value={formData.itemType}
                  onValueChange={(val: 'photo' | 'video') =>
                    setFormData((prev) => ({ ...prev, itemType: val }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">
                      <span className="flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5" />
                        Photo
                      </span>
                    </SelectItem>
                    <SelectItem value="video">
                      <span className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5" />
                        Video
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grad-year" className="text-sm font-medium">
                  Ceremony Year
                </Label>
                <Input
                  id="grad-year"
                  type="number"
                  min={2000}
                  max={2100}
                  placeholder="2024"
                  value={formData.ceremonyYear}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ceremonyYear: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Ceremony Name */}
            <div className="space-y-1.5">
              <Label htmlFor="grad-ceremony" className="text-sm font-medium">
                Ceremony Name
              </Label>
              <Input
                id="grad-ceremony"
                placeholder="e.g., 10th Annual Graduation Ceremony"
                value={formData.ceremonyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ceremonyName: e.target.value }))
                }
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <Label htmlFor="grad-order" className="text-sm font-medium">
                Sort Order
              </Label>
              <Input
                id="grad-order"
                type="number"
                min={0}
                placeholder="0"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first. Default is 0.
              </p>
            </div>

            {/* File Upload Area */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Media File <span className="text-red-500">*</span>
              </Label>

              {/* Upload drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                style={{ borderColor: formData.mediaUrl ? '#22c55e' : undefined }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={
                    formData.itemType === 'video'
                      ? 'video/mp4,video/webm,video/ogg'
                      : 'image/*'
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = '';
                  }}
                />

                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: PRIMARY_BLUE }} />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : formData.mediaUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <p className="text-sm font-medium text-green-700">
                      {uploadFileName || 'File uploaded successfully'}
                    </p>
                    <p className="text-xs text-muted-foreground">Click to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Drag & drop or <span className="underline" style={{ color: PRIMARY_BLUE }}>click to upload</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.itemType === 'video' ? (
                          <span className="flex items-center justify-center gap-1">
                            <CircleAlert className="w-3 h-3" />
                            MP4, WebM, or OGG — up to 10MB
                          </span>
                        ) : (
                          'JPG, PNG, WebP, or GIF — up to 10MB'
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <AnimatePresence>
                {uploadPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="relative rounded-lg overflow-hidden border bg-muted/30 mt-2">
                      {formData.itemType === 'video' ? (
                        <div className="relative aspect-video">
                          <img
                            src={uploadPreview}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full max-h-48 object-contain"
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadPreview(null);
                          setFormData((prev) => ({ ...prev, mediaUrl: '' }));
                          setUploadFileName('');
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video note */}
              {formData.itemType === 'video' && (
                <div
                  className="flex items-start gap-2 p-2.5 rounded-md text-xs"
                  style={{ backgroundColor: `${GOLD_ACCENT}15`, color: '#92400e' }}
                >
                  <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Video uploads support <strong>MP4</strong>, <strong>WebM</strong>, and <strong>OGG</strong> formats
                    with a maximum size of <strong>10MB</strong>. A thumbnail will be automatically generated.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dialog Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.title.trim() || !formData.mediaUrl.trim()}
              className="h-10 text-white font-semibold min-w-[100px]"
              style={{ backgroundColor: PRIMARY_BLUE }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#244a8a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BLUE)}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingItem ? (
                'Update Media'
              ) : (
                'Add Media'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
