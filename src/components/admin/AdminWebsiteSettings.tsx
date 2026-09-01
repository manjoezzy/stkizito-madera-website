'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  Megaphone,
  BookOpen,
  Palette,
  Shield,
  Camera,
  Link2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  Tag,
  Type,
  Image,
  ToggleLeft,
  Search,
  Layers,
  Star,
  ExternalLink,
  Briefcase,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ===================== TYPES =====================

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'phone' | 'number' | 'switch';
  placeholder?: string;
  description?: string;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor?: string;
  fields: FieldConfig[];
}

interface FieldSaveState {
  [key: string]: 'idle' | 'saving' | 'saved' | 'error';
}

// ===================== SETTINGS CONFIGURATION =====================

const SETTINGS_SECTIONS: SectionConfig[] = [
  {
    id: 'identity',
    title: 'School Identity',
    description: 'Core institution information displayed across the website',
    icon: Building2,
    fields: [
      { key: 'site_name', label: 'Institution Name', type: 'text', placeholder: 'St. Kizito\'s Technical Institute - Madera', defaultValue: "St. Kizito's Technical Institute - Madera" },
      { key: 'site_short_name', label: 'Short Name / Acronym', type: 'text', placeholder: 'SKTIM', defaultValue: 'SKTIM' },
      { key: 'site_motto', label: 'School Motto', type: 'text', placeholder: 'Education for Service', defaultValue: 'Education for Service' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'Empowering Youth Through Practical Skills', description: 'Brief tagline shown below the school name in the header.' },
      { key: 'site_logo_url', label: 'Logo URL', type: 'url', placeholder: '/images/institute-logo.jpg', description: 'Path or URL to the school logo image.' },
      { key: 'site_favicon_url', label: 'Favicon URL', type: 'url', placeholder: '/favicon.ico' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Contact details shown on the website footer and contact page',
    icon: Phone,
    fields: [
      { key: 'contact_phone', label: 'Primary Phone', type: 'phone', placeholder: '+256 414 123 456', defaultValue: '+256 414 123 456' },
      { key: 'contact_phone_2', label: 'Secondary Phone', type: 'phone', placeholder: '+256 772 123 456' },
      { key: 'contact_email', label: 'Email Address', type: 'email', placeholder: 'info@sktim.ac.ug', defaultValue: 'info@sktim.ac.ug' },
      { key: 'contact_address', label: 'Physical Address', type: 'text', placeholder: 'Madera, Soroti City', defaultValue: 'Madera, Soroti City, Uganda' },
      { key: 'contact_pobox', label: 'P.O. Box', type: 'text', placeholder: 'P.O. Box 123, Soroti' },
      { key: 'contact_district', label: 'District / Region', type: 'text', placeholder: 'Soroti District', defaultValue: 'Soroti District' },
      { key: 'contact_map_embed', label: 'Google Maps Embed URL', type: 'url', placeholder: 'https://www.google.com/maps/embed?...', description: 'Full embed URL for the location map on the contact page.' },
      { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'phone', placeholder: '+256772123456', description: 'WhatsApp number for the chat widget (include country code).' },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Social media profile links displayed in the footer and contact section',
    icon: Link2,
    fields: [
      { key: 'social_facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/sktimadera' },
      { key: 'social_twitter', label: 'X (Twitter)', type: 'url', placeholder: 'https://x.com/sktimadera' },
      { key: 'social_instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/sktimadera' },
      { key: 'social_youtube', label: 'YouTube', type: 'url', placeholder: 'https://youtube.com/@sktimadera' },
      { key: 'social_linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/company/sktimadera' },
      { key: 'social_tiktok', label: 'TikTok', type: 'url', placeholder: 'https://tiktok.com/@sktimadera' },
    ],
  },
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main banner content displayed on the homepage',
    icon: Camera,
    fields: [
      { key: 'hero_headline', label: 'Headline', type: 'text', placeholder: 'Building Skills, Shaping Futures', defaultValue: 'Building Skills, Shaping Futures', maxLength: 80 },
      { key: 'hero_subheadline', label: 'Sub-headline', type: 'text', placeholder: 'Empowering youth through quality technical and vocational education in Soroti, Uganda.', maxLength: 160 },
      { key: 'hero_cta_text', label: 'Primary CTA Text', type: 'text', placeholder: 'Apply Now', defaultValue: 'Apply Now', maxLength: 30 },
      { key: 'hero_cta_link', label: 'Primary CTA Link', type: 'url', placeholder: '#admissions', defaultValue: '#admissions' },
      { key: 'hero_cta2_text', label: 'Secondary CTA Text', type: 'text', placeholder: 'Explore Programs', maxLength: 30 },
      { key: 'hero_cta2_link', label: 'Secondary CTA Link', type: 'url', placeholder: '#programs' },
      { key: 'hero_bg_image', label: 'Background Image URL', type: 'url', placeholder: '/images/hero-bg.png', description: 'Large background image for the hero banner.' },
      { key: 'hero_show', label: 'Show Hero Section', type: 'switch', defaultValue: 'true', description: 'Toggle to show or hide the hero banner on the homepage.' },
    ],
  },
  {
    id: 'about',
    title: 'About Content',
    description: 'Information displayed on the About page',
    icon: BookOpen,
    fields: [
      { key: 'about_mission', label: 'Mission Statement', type: 'textarea', placeholder: 'To provide quality technical and vocational education...', rows: 3, description: 'The institution\'s mission statement.' },
      { key: 'about_vision', label: 'Vision Statement', type: 'textarea', placeholder: 'To be a centre of excellence in technical education...', rows: 3, description: 'The institution\'s vision statement.' },
      { key: 'about_brief', label: 'Brief Description', type: 'textarea', placeholder: 'St. Kizito\'s Technical Institute - Madera is a leading...', rows: 5, description: 'A short paragraph about the institution shown on the homepage and about page.' },
      { key: 'about_history', label: 'History', type: 'textarea', placeholder: 'Founded in 1970, the institute has served...', rows: 6, description: 'Detailed history of the institution.' },
      { key: 'about_core_values', label: 'Core Values', type: 'textarea', placeholder: 'Excellence, Integrity, Innovation, Service, Teamwork', rows: 2, description: 'Comma-separated list of core values.' },
      { key: 'about_principal_message', label: 'Principal\'s Welcome Message', type: 'textarea', placeholder: 'Welcome to St. Kizito\'s Technical Institute...', rows: 6, description: 'Message from the principal displayed on the about page.' },
      { key: 'about_principal_name', label: 'Principal\'s Name', type: 'text', placeholder: 'Br. John Mary Ocura' },
      { key: 'about_principal_title', label: 'Principal\'s Title', type: 'text', placeholder: 'Principal', defaultValue: 'Principal' },
      { key: 'about_principal_photo', label: 'Principal\'s Photo URL', type: 'url', placeholder: '/images/principal.jpg' },
    ],
  },
  {
    id: 'admissions',
    title: 'Admissions',
    description: 'Admissions-related content and configuration',
    icon: GraduationCap,
    fields: [
      { key: 'admissions_intake_year', label: 'Current Intake Year', type: 'text', placeholder: '2025/2026', defaultValue: '2025/2026' },
      { key: 'admissions_open_date', label: 'Application Open Date', type: 'text', placeholder: '2025-01-15', description: 'Date when applications open (YYYY-MM-DD).' },
      { key: 'admissions_deadline', label: 'Application Deadline', type: 'text', placeholder: '2025-08-30', description: 'Application closing date (YYYY-MM-DD).' },
      { key: 'admissions_fee', label: 'Application Fee (UGX)', type: 'number', placeholder: '50000', defaultValue: '50000', description: 'Non-refundable application fee paid via SchoolPay.' },
      { key: 'admissions_instructions', label: 'Application Instructions', type: 'textarea', placeholder: 'Step 1: Fill the online form...', rows: 5, description: 'Step-by-step instructions shown to applicants.' },
      { key: 'admissions_requirements', label: 'Entry Requirements', type: 'textarea', placeholder: 'UCE certificate, UACE certificate...', rows: 4, description: 'General entry requirements listed on the admissions page.' },
      { key: 'admissions_status_text', label: 'Status Banner Text', type: 'text', placeholder: 'Applications are now open for 2025/2026!', description: 'Custom banner text shown on the admissions page.' },
    ],
  },
  {
    id: 'programs',
    title: 'Programmes',
    description: 'Programme page configuration and descriptions',
    icon: Briefcase,
    fields: [
      { key: 'programs_intro', label: 'Programmes Introduction', type: 'textarea', placeholder: 'We offer a range of certificate and diploma programmes...', rows: 4, description: 'Introduction paragraph for the programmes page.' },
      { key: 'programs_exam_body', label: 'Examination Body', type: 'text', placeholder: 'UBTEB', defaultValue: 'UBTEB', description: 'Name of the examination body (e.g., UBTEB, DIT).' },
      { key: 'programs_cert_duration', label: 'Certificate Duration', type: 'text', placeholder: '2 years', defaultValue: '2 years' },
      { key: 'programs_diploma_duration', label: 'Diploma Duration', type: 'text', placeholder: '3 years', defaultValue: '3 years' },
    ],
  },
  {
    id: 'seo',
    title: 'SEO & Meta',
    description: 'Search engine optimization and social sharing settings',
    icon: Search,
    fields: [
      { key: 'seo_title', label: 'Page Title', type: 'text', placeholder: 'St. Kizito\'s Technical Institute - Madera', maxLength: 70, description: 'Browser tab title. Keep under 70 characters for best SEO.' },
      { key: 'seo_description', label: 'Meta Description', type: 'textarea', placeholder: 'Official website of St. Kizito\'s Technical Institute - Madera, Soroti, Uganda. Apply for certificate and diploma programmes in technical and vocational education.', rows: 3, maxLength: 160, description: 'Search engine result snippet. Keep under 160 characters.' },
      { key: 'seo_keywords', label: 'Keywords', type: 'textarea', placeholder: 'technical institute, vocational education, Soroti, Uganda, TVET, UBTEB', rows: 2, description: 'Comma-separated keywords for SEO (less important for modern search engines).' },
      { key: 'seo_og_image', label: 'Open Graph Image', type: 'url', placeholder: '/images/og-image.png', description: 'Image shown when the site is shared on social media (1200x630px recommended).' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Footer content displayed at the bottom of every page',
    icon: Layers,
    fields: [
      { key: 'footer_copyright', label: 'Copyright Text', type: 'text', placeholder: '© 2025 St. Kizito\'s Technical Institute - Madera. All rights reserved.', defaultValue: '© 2025 St. Kizito\'s Technical Institute - Madera. All rights reserved.' },
      { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Empowering Youth Through Practical Skills' },
      { key: 'footer_extra_link_1_text', label: 'Extra Link 1 — Text', type: 'text', placeholder: 'Ministry of Education' },
      { key: 'footer_extra_link_1_url', label: 'Extra Link 1 — URL', type: 'url', placeholder: 'https://www.education.go.ug' },
      { key: 'footer_extra_link_2_text', label: 'Extra Link 2 — Text', type: 'text', placeholder: 'UBTEB' },
      { key: 'footer_extra_link_2_url', label: 'Extra Link 2 — URL', type: 'url', placeholder: 'https://www.ubteb.go.ug' },
      { key: 'footer_extra_link_3_text', label: 'Extra Link 3 — Text', type: 'text', placeholder: 'DIT Uganda' },
      { key: 'footer_extra_link_3_url', label: 'Extra Link 3 — URL', type: 'url', placeholder: 'https://www.dit.go.ug' },
    ],
  },
  {
    id: 'features',
    title: 'Feature Toggles',
    description: 'Enable or disable website sections and functionality',
    icon: ToggleLeft,
    accentColor: '#f5c518',
    fields: [
      { key: 'feature_gallery', label: 'Photo Gallery', type: 'switch', defaultValue: 'true', description: 'Show the photo gallery page and link in navigation.' },
      { key: 'feature_events', label: 'Events Page', type: 'switch', defaultValue: 'true', description: 'Show the events page and upcoming events.' },
      { key: 'feature_alumni', label: 'Alumni Page', type: 'switch', defaultValue: 'true', description: 'Show the alumni directory page.' },
      { key: 'feature_graduation', label: 'Graduation Page', type: 'switch', defaultValue: 'true', description: 'Show the graduation photos page.' },
      { key: 'feature_online_learning', label: 'Online Learning', type: 'switch', defaultValue: 'false', description: 'Enable the online learning portal link.' },
      { key: 'feature_student_portal', label: 'Student Portal', type: 'switch', defaultValue: 'true', description: 'Enable the student self-service portal.' },
      { key: 'feature_admissions', label: 'Online Admissions', type: 'switch', defaultValue: 'true', description: 'Enable online application submissions.' },
      { key: 'feature_maintenance', label: 'Maintenance Mode', type: 'switch', defaultValue: 'false', description: '⚠️ Show a maintenance page to visitors. Admin access remains available.' },
      { key: 'feature_contact_form', label: 'Contact Form', type: 'switch', defaultValue: 'true', description: 'Allow visitors to submit messages via the contact form.' },
      { key: 'feature_whatsapp_widget', label: 'WhatsApp Chat Widget', type: 'switch', defaultValue: 'false', description: 'Show a floating WhatsApp chat button on the website.' },
    ],
  },
];

// ===================== HELPERS =====================

/** Collect all setting keys from all sections */
function getAllKeys(): string[] {
  return SETTINGS_SECTIONS.flatMap((s) => s.fields.map((f) => f.key));
}

// ===================== SUB-COMPONENTS =====================

/** Small per-field save indicator */
function FieldIndicator({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  return (
    <AnimatePresence mode="wait">
      {state !== 'idle' && (
        <motion.span
          key={state}
          initial={{ opacity: 0, scale: 0.7, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 4 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-1 text-xs font-medium shrink-0"
        >
          {state === 'saving' && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[#1a3a6b]" />
              <span className="text-[#1a3a6b]">Saving…</span>
            </>
          )}
          {state === 'saved' && (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">Saved</span>
            </>
          )}
          {state === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-red-500">Failed</span>
            </>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/** Loading skeleton for a section */
function SectionSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Collapsible section card */
function SettingsSectionCard({
  section,
  values,
  saveStates,
  onValueChange,
  onSaveField,
}: {
  section: SectionConfig;
  values: Record<string, string>;
  saveStates: FieldSaveState;
  onValueChange: (key: string, value: string) => void;
  onSaveField: (key: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${section.accentColor || '#1a3a6b'}14` }}
              >
                <Icon
                  className="w-4.5 h-4.5"
                  style={{ color: section.accentColor || '#1a3a6b' }}
                />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">
                  {section.title}
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </motion.div>
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <Separator className="mb-4" />
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {section.fields.map((field) => (
                    <FieldRow
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? field.defaultValue ?? ''}
                      saveState={saveStates[field.key] ?? 'idle'}
                      onChange={(v) => onValueChange(field.key, v)}
                      onBlur={() => {
                        if (field.type !== 'switch') onSaveField(field.key);
                      }}
                      onToggle={() => onSaveField(field.key)}
                      spanFull={field.type === 'textarea' && (field.rows ?? 3) >= 5}
                    />
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

/** Individual field row */
function FieldRow({
  field,
  value,
  saveState,
  onChange,
  onBlur,
  onToggle,
  spanFull,
}: {
  field: FieldConfig;
  value: string;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onChange: (value: string) => void;
  onBlur: () => void;
  onToggle: () => void;
  spanFull?: boolean;
}) {
  const isSwitch = field.type === 'switch';
  const isChecked = value === 'true';

  return (
    <div className={`${spanFull ? 'md:col-span-2' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-slate-700 truncate"
          >
            {field.label}
          </Label>
          {field.maxLength && (
            <span className="text-[10px] text-slate-300 font-mono shrink-0">
              {value.length}/{field.maxLength}
            </span>
          )}
        </div>
        {!isSwitch && <FieldIndicator state={saveState} />}
      </div>

      {field.description && (
        <p className="text-xs text-slate-400 mb-2 leading-relaxed">{field.description}</p>
      )}

      {isSwitch ? (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-sm text-slate-600">{field.description || field.label}</span>
          <div className="flex items-center gap-2">
            <FieldIndicator state={saveState} />
            <Switch
              id={field.key}
              checked={isChecked}
              onCheckedChange={() => {
                onChange(isChecked ? 'false' : 'true');
                onToggle();
              }}
              className="data-[state=checked]:bg-[#1a3a6b]"
            />
          </div>
        </div>
      ) : field.type === 'textarea' ? (
        <Textarea
          id={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, field.maxLength ?? 9999))}
          onBlur={onBlur}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          className="resize-y min-h-[80px] text-sm border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
        />
      ) : (
        <Input
          id={field.key}
          type={field.type === 'url' || field.type === 'email' || field.type === 'phone' || field.type === 'number' ? 'text' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, field.maxLength ?? 200))}
          onBlur={onBlur}
          placeholder={field.placeholder}
          inputMode={field.type === 'number' ? 'numeric' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : undefined}
          className="text-sm border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
        />
      )}
    </div>
  );
}

// ===================== MAIN COMPONENT =====================

export default function AdminWebsiteSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saveStates, setSaveStates] = useState<FieldSaveState>({});
  const [loading, setLoading] = useState(true);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [globalSaved, setGlobalSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const allKeysRef = useRef<string[]>(getAllKeys());

  // ── Load all settings on mount ──
  useEffect(() => {
    const keys = allKeysRef.current;
    fetch(`/api/settings/bulk?keys=${keys.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        const fetched: Record<string, string> = data.settings || {};
        // Merge with defaults
        const merged: Record<string, string> = {};
        for (const section of SETTINGS_SECTIONS) {
          for (const field of section.fields) {
            merged[field.key] =
              fetched[field.key] !== null && fetched[field.key] !== undefined
                ? fetched[field.key]
                : field.defaultValue || '';
          }
        }
        setValues(merged);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to defaults
        const defaults: Record<string, string> = {};
        for (const section of SETTINGS_SECTIONS) {
          for (const field of section.fields) {
            defaults[field.key] = field.defaultValue || '';
          }
        }
        setValues(defaults);
        setLoading(false);
      });
  }, []);

  // ── Cleanup debounce timers on unmount ──
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  // ── Save a single setting (PUT /api/settings) ──
  const saveField = useCallback(
    async (key: string) => {
      // Clear any existing debounce timer for this key
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }

      // Debounce: wait 800ms before saving (in case user is still typing)
      debounceTimers.current[key] = setTimeout(async () => {
        setSaveStates((prev) => ({ ...prev, [key]: 'saving' }));
        try {
          const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value: values[key] }),
          });
          if (res.ok) {
            setSaveStates((prev) => ({ ...prev, [key]: 'saved' }));
            // Reset to idle after 3 seconds
            setTimeout(() => {
              setSaveStates((prev) => ({ ...prev, [key]: 'idle' }));
            }, 3000);
          } else {
            setSaveStates((prev) => ({ ...prev, [key]: 'error' }));
            setTimeout(() => {
              setSaveStates((prev) => ({ ...prev, [key]: 'idle' }));
            }, 5000);
          }
        } catch {
          setSaveStates((prev) => ({ ...prev, [key]: 'error' }));
          setTimeout(() => {
            setSaveStates((prev) => ({ ...prev, [key]: 'idle' }));
          }, 5000);
        }
      }, 800);
    },
    [values]
  );

  // ── Save all settings at once (PUT /api/settings/bulk) ──
  const saveAll = useCallback(async () => {
    setGlobalSaving(true);
    setGlobalSaved(false);
    try {
      const res = await fetch('/api/settings/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      });
      if (res.ok) {
        setGlobalSaved(true);
        // Mark all fields as saved
        const allSaved: FieldSaveState = {};
        for (const key of allKeysRef.current) {
          allSaved[key] = 'saved';
        }
        setSaveStates(allSaved);
        setTimeout(() => {
          setGlobalSaved(false);
          setSaveStates({});
        }, 3000);
      }
    } catch {
      // silently fail
    } finally {
      setGlobalSaving(false);
    }
  }, [values]);

  // ── Handle value change ──
  const handleValueChange = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Reset save state to idle when user starts editing
    setSaveStates((prev) => ({ ...prev, [key]: 'idle' }));
  }, []);

  // ── Filter sections by search ──
  const filteredSections = searchQuery.trim()
    ? SETTINGS_SECTIONS.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.fields.some(
            (f) =>
              f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (values[f.key] ?? '').toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : SETTINGS_SECTIONS;

  // ── Count filled settings ──
  const filledCount = Object.values(values).filter((v) => v.trim() !== '').length;
  const totalCount = allKeysRef.current.length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center">
              <Globe className="w-4.5 h-4.5 text-[#1a3a6b]" />
            </div>
            Website Content Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage all website content, SEO, contact details, and feature toggles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-xs font-normal text-slate-500 border-slate-200"
          >
            <Sparkles className="w-3 h-3 mr-1 text-[#f5c518]" />
            {filledCount}/{totalCount} configured
          </Badge>
          <Button
            onClick={saveAll}
            disabled={globalSaving || loading}
            style={{ backgroundColor: '#f5c518', color: '#1a3a6b' }}
            className="shrink-0 disabled:opacity-50 hover:opacity-90 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            {globalSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving All…
              </>
            ) : globalSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                All Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* ── Search & Section Nav ── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings…"
            className="pl-9 text-sm border-slate-200 focus:border-[#1a3a6b] focus:ring-[#1a3a6b]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="text-xs">Clear</span>
            </button>
          )}
        </div>

        {/* Section quick-nav chips */}
        <div className="flex flex-wrap gap-2">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(isActive ? null : section.id)
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#1a3a6b] text-white border-[#1a3a6b] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {section.title}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Auto-save notice ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f5c518]/10 border border-[#f5c518]/20"
      >
        <Info className="w-4 h-4 text-[#f5c518] shrink-0" />
        <p className="text-xs text-amber-800/80">
          Text fields auto-save on blur (with debounce). Switches save immediately. You can also use{' '}
          <span className="font-semibold">Save All</span> to persist everything at once.
        </p>
      </motion.div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="space-y-4">
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      )}

      {/* ── Settings Sections ── */}
      {!loading && (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSections
              .filter((section) => !activeSection || section.id === activeSection)
              .map((section) => (
                <SettingsSectionCard
                  key={section.id}
                  section={section}
                  values={values}
                  saveStates={saveStates}
                  onValueChange={handleValueChange}
                  onSaveField={saveField}
                />
              ))}
          </AnimatePresence>

          {filteredSections.filter(
            (section) => !activeSection || section.id === activeSection
          ).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No settings match &quot;{searchQuery}&quot;</p>
              <Button
                variant="link"
                size="sm"
                className="text-[#1a3a6b] mt-2"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* ── Bottom Action Bar ── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky bottom-4 z-10"
        >
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">
                {filledCount} of {totalCount} fields configured
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs text-slate-400">
                Last auto-save: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 text-slate-600 hover:border-[#1a3a6b] hover:text-[#1a3a6b]"
                onClick={() => {
                  // Reset to defaults
                  const defaults: Record<string, string> = {};
                  for (const section of SETTINGS_SECTIONS) {
                    for (const field of section.fields) {
                      defaults[field.key] = field.defaultValue || '';
                    }
                  }
                  setValues(defaults);
                }}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset to Defaults
              </Button>
              <Button
                size="sm"
                onClick={saveAll}
                disabled={globalSaving}
                className="bg-[#1a3a6b] hover:bg-[#2756a0] text-white text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {globalSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
