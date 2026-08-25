'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  BookOpen,
  GraduationCap,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Check,
  Plus,
  X,
  Briefcase,
  Trophy,
  HeartPulse,
  MapPin,
  Phone,
  Mail,
  Search,
  ArrowLeft,
  Building2,
  PenLine,
  BadgeCheck,
  Award,
  Camera,
  Upload,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { useAppStore } from '@/store/useAppStore';

/* ──────────────── constants ──────────────── */

const PRIMARY = '#1a3a6b';
const PRIMARY_LIGHT = '#2756a0';
const GOLD = '#f5c518';

const STEPS = [
  { id: 1, label: 'Particulars of Applicant', icon: User, shortLabel: 'Section A' },
  { id: 2, label: 'PLE & O-Level Results', icon: BookOpen, shortLabel: 'Section B' },
  { id: 3, label: 'UJTC & Other Qualifications', icon: GraduationCap, shortLabel: 'Section B' },
  { id: 4, label: 'Work Record & Choices', icon: Briefcase, shortLabel: 'Section C' },
  { id: 5, label: 'Review & Declaration', icon: FileText, shortLabel: 'Section D' },
];

const UGANDA_DISTRICTS = [
  'Abim','Adjumani','Agago','Alebtong','Amolatar','Amudat','Amuria','Amuru','Apac','Arua',
  'Budaka','Bududa','Buhweju','Buikwe','Bukedea','Bukomansimbi','Bukwo','Bulambuli','Bundibugyo','Bunyangabu',
  'Bushenyi','Busia','Butaleja','Butambala','Buvuma','Buyende','Dokolo','Gomba','Gulu','Hoima',
  'Ibanda','Iganga','Isingiro','Jinja','Kaabong','Kabale','Kaberamaido','Kabwohe','Kaliro','Kalungu',
  'Kampala','Kamuli','Kamwenge','Kanungu','Kapchorwa','Kasese','Katakwi','Kayunga','Kibaale','Kiboga',
  'Kibuku','Kiruhura','Kisoro','Kitgum','Koboko','Kole','Kotido','Kumi','Kween','Kyankwanzi',
  'Kyegegwa','Kyotera','Lamwo','Lira','Luuka','Luweero','Lwengo','Lyantonde','Manafwa','Maracha',
  'Masaka','Masindi','Mayuge','Mbale','Mbarara','Mitooma','Mityana','Moroto','Moyo','Mpigi',
  'Mubende','Mukono','Nakapiripirit','Nakasongola','Nakaseke','Nakasongola','Namayingo','Namutumba','Napak','Nebbi',
  'Ngora','Ntoroko','Nwoya','Otuke','Oyam','Pader','Pakwach','Pallisa','Rakai','Rubirizi',
  'Rukiga','Rukungiri','Sembabule','Serere','Sheema','Sironko','Soroti','Syanya','Tororo','Wakiso',
  'Yumbe','Zombo','Soroti City','Lira City','Fort Portal City','Gulu City','Masaka City','Mbale City','Jinja City','Mbarara City'
];

const RELIGIONS = [
  'Roman Catholic','Anglican (Church of Uganda)','Orthodox','Seventh Day Adventist',
  'Pentecostal/Born Again','Muslim','Baptist','Methodist','Presbyterian','Jehovah Witness',
  'Other Christian','Other','None',
];

const NATIONALITIES = [
  'Ugandan','Kenyan','Tanzanian','Rwandan','South Sudanese','Congolese (DRC)',
  'Burundian','Ethiopian','Eritrean','Somali','Sudanese','Other',
];

const PLE_DIVISIONS = ['Division 1','Division 2','Division 3','Division 4','U'];

const UCE_GRADES = ['D1','D2','C3','C4','C5','C6','P7','P8','F9','U'];

const UJTC_GRADES = ['Distinction','Credit','Pass','Fail'];

const OTHER_GRADES = ['First Class','Upper Second','Lower Second','Pass','Fail','Distinction','Credit','Merit'];

/* ──────────────── types ──────────────── */

interface SubjectGrade { subject: string; grade: string; }

interface WorkRecord { organization: string; postHeld: string; period: string; }

interface InstitutionChoice {
  institution: string;
  courseI: string;
  courseII: string;
}

interface OtherQual {
  institution: string;
  courseName: string;
  yearSitting: string;
  regNumber: string;
  classGrade: string;
  subjects: SubjectGrade[];
}

interface TvetFormData {
  // Section A: Particulars
  surname: string;
  otherNames: string;
  nationality: string;
  dob: string;
  sex: string;
  homeDistrict: string;
  county: string;
  subCounty: string;
  religion: string;
  email: string;
  parish: string;
  village: string;
  telephone: string;
  parentGuardianName: string;
  parentTelephone: string;
  parentTelephone2: string;
  parentNIN: string;

  // Section B: PLE
  pleSchoolName: string;
  pleYearSitting: string;
  pleIndexNumber: string;
  pleTotalAggregates: string;
  pleDivision: string;
  pleSubjects: SubjectGrade[];

  // Section B: O-Level
  olevelSchoolName: string;
  olevelYearSitting: string;
  olevelIndexNumber: string;
  olevelSubjects: SubjectGrade[];

  // Section B: UJTC/UCPC
  ujtcInstitution: string;
  ujtcYearSitting: string;
  ujtcCourseName: string;
  ujtcIndexNumber: string;
  ujtcGrade: string;
  ujtcSubjects: SubjectGrade[];

  // Section B: Other Qualifications
  otherQuals: OtherQual[];

  // Section C: Work Record
  workRecords: WorkRecord[];
  sportsGames: string;
  chronicDisease: string;

  // Section C: Institution Choices
  institutionChoices: InstitutionChoice[];
  reasonForCourse: string;

  // Section D: Declaration
  declarationName: string;
  declarationDate: string;

  // Passport photo
  passportPhoto: File | null;
  passportPhotoPreview: string;
}

const INITIAL_FORM: TvetFormData = {
  surname: '', otherNames: '', nationality: 'Ugandan', dob: '', sex: '',
  homeDistrict: '', county: '', subCounty: '', religion: '', email: '',
  parish: '', village: '', telephone: '',
  parentGuardianName: '', parentTelephone: '', parentTelephone2: '', parentNIN: '',
  pleSchoolName: '', pleYearSitting: '', pleIndexNumber: '', pleTotalAggregates: '', pleDivision: '',
  pleSubjects: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }],
  olevelSchoolName: '', olevelYearSitting: '', olevelIndexNumber: '',
  olevelSubjects: Array.from({ length: 10 }, () => ({ subject: '', grade: '' })),
  ujtcInstitution: '', ujtcYearSitting: '', ujtcCourseName: '', ujtcIndexNumber: '', ujtcGrade: '',
  ujtcSubjects: Array.from({ length: 6 }, () => ({ subject: '', grade: '' })),
  otherQuals: [],
  workRecords: [{ organization: '', postHeld: '', period: '' }],
  sportsGames: '', chronicDisease: '',
  institutionChoices: [
    { institution: '', courseI: '', courseII: '' },
    { institution: '', courseI: '', courseII: '' },
  ],
  reasonForCourse: '',
  declarationName: '', declarationDate: new Date().toISOString().split('T')[0],
  passportPhoto: null,
  passportPhotoPreview: '',
};

/* ──────────────── component ──────────────── */

export default function TvetApplicationForm() {
  const { addToast, setCurrentPage } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<TvetFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ referenceNumber: string; schoolpayCode: string; programme: string } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const [documents, setDocuments] = useState<{type: string; file: File; preview: string}[]>([]);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [pendingDocType, setPendingDocType] = useState('national_id');

  /* ──────── passport photo handling ──────── */

  const handlePhotoSelect = useCallback((file: File | null) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Invalid file type. Please upload a JPEG, PNG, or WebP image only.', 'error');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      addToast('File too large. Maximum size is 1.5MB.', 'error');
      return;
    }
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, passportPhoto: file, passportPhotoPreview: preview }));
    if (errors.passportPhoto) setErrors((prev) => { const n = { ...prev }; delete n.passportPhoto; return n; });
  }, [addToast, errors]);

  const removePhoto = useCallback(() => {
    if (form.passportPhotoPreview) URL.revokeObjectURL(form.passportPhotoPreview);
    setForm((prev) => ({ ...prev, passportPhoto: null, passportPhotoPreview: '' }));
    if (photoInputRef.current) photoInputRef.current.value = '';
  }, [form.passportPhotoPreview]);

  const handlePhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    handlePhotoSelect(file);
  }, [handlePhotoSelect]);

  const handlePhotoDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoDragOver(true);
  }, []);

  const handlePhotoDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoDragOver(false);
  }, []);

  const DOC_TYPES = [
    { value: 'national_id', label: 'National ID' },
    { value: 'academic_transcript', label: 'Academic Transcript / Certificate' },
    { value: 'passport_photo', label: 'Passport Photo (additional)' },
    { value: 'other', label: 'Other Document' },
  ];

  const addDocument = (type: string, file: File) => {
    const allowedTypes = ['image/jpeg','image/png','image/webp','application/pdf'];
    if (!allowedTypes.includes(file.type)) { addToast('Invalid file type. Use PDF, JPEG, PNG, or WebP.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { addToast('File too large. Maximum 2MB.', 'error'); return; }
    const preview = URL.createObjectURL(file);
    setDocuments((prev) => [...prev, { type, file, preview }]);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingDocType) { addDocument(pendingDocType, file); }
    if (e.target) e.target.value = '';
  };

  const updateField = <K extends keyof TvetFormData>(field: K, value: TvetFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateSubject = (section: 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects', idx: number, key: 'subject' | 'grade', value: string) => {
    setForm((prev) => {
      const arr = [...prev[section]];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, [section]: arr };
    });
  };

  const addSubjectRow = (section: 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects') => {
    setForm((prev) => ({ ...prev, [section]: [...prev[section], { subject: '', grade: '' }] }));
  };

  const removeSubjectRow = (section: 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects', idx: number) => {
    setForm((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== idx) }));
  };

  const updateOtherQual = (idx: number, key: keyof OtherQual, value: string) => {
    setForm((prev) => {
      const arr = [...prev.otherQuals];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, otherQuals: arr };
    });
  };

  const updateOtherQualSubject = (qualIdx: number, subIdx: number, key: 'subject' | 'grade', value: string) => {
    setForm((prev) => {
      const arr = [...prev.otherQuals];
      const subs = [...arr[qualIdx].subjects];
      subs[subIdx] = { ...subs[subIdx], [key]: value };
      arr[qualIdx] = { ...arr[qualIdx], subjects: subs };
      return { ...prev, otherQuals: arr };
    });
  };

  const addOtherQual = () => {
    setForm((prev) => ({
      ...prev,
      otherQuals: [...prev.otherQuals, {
        institution: '', courseName: '', yearSitting: '', regNumber: '', classGrade: '',
        subjects: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' },
                   { subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }],
      }],
    }));
  };

  const removeOtherQual = (idx: number) => {
    setForm((prev) => ({ ...prev, otherQuals: prev.otherQuals.filter((_, i) => i !== idx) }));
  };

  const updateWorkRecord = (idx: number, key: keyof WorkRecord, value: string) => {
    setForm((prev) => {
      const arr = [...prev.workRecords];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, workRecords: arr };
    });
  };

  const addWorkRecord = () => {
    setForm((prev) => ({ ...prev, workRecords: [...prev.workRecords, { organization: '', postHeld: '', period: '' }] }));
  };

  const removeWorkRecord = (idx: number) => {
    setForm((prev) => ({ ...prev, workRecords: prev.workRecords.filter((_, i) => i !== idx) }));
  };

  const updateInstChoice = (idx: number, key: keyof InstitutionChoice, value: string) => {
    setForm((prev) => {
      const arr = [...prev.institutionChoices];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, institutionChoices: arr };
    });
  };

  /* ──────── validation ──────── */

  const validateStep = (step: number): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.passportPhoto) e.passportPhoto = 'Passport photo is required';
      if (!form.surname.trim()) e.surname = 'Surname is required';
      if (!form.otherNames.trim()) e.otherNames = 'Other names are required';
      if (!form.dob) e.dob = 'Date of birth is required';
      if (!form.sex) e.sex = 'Sex is required';
      if (!form.homeDistrict) e.homeDistrict = 'Home district is required';
      if (!form.county) e.county = 'County is required';
      if (!form.subCounty) e.subCounty = 'Sub-county is required';
      if (!form.religion) e.religion = 'Religious affiliation is required';
      if (!form.email.trim()) e.email = 'Email is required';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
      if (!form.telephone.trim()) e.telephone = 'Telephone contact is required';
      if (!form.parentGuardianName.trim()) e.parentGuardianName = 'Parent/Guardian name is required';
      if (!form.parentTelephone.trim()) e.parentTelephone = 'Parent telephone is required';
    }
    if (step === 2) {
      if (!form.pleSchoolName.trim()) e.pleSchoolName = 'School name is required';
      if (!form.pleYearSitting) e.pleYearSitting = 'Year is required';
      if (!form.olevelSchoolName.trim()) e.olevelSchoolName = 'School name is required';
      if (!form.olevelYearSitting) e.olevelYearSitting = 'Year is required';
    }
    if (step === 4) {
      if (!form.institutionChoices[0].courseI.trim()) e['choice1courseI'] = 'First choice course is required';
      if (!form.reasonForCourse.trim()) e.reasonForCourse = 'Reason for choosing course is required';
    }
    if (step === 5) {
      if (!form.declarationName.trim()) e.declarationName = 'Declaration name is required';
      if (!form.declarationDate) e.declarationDate = 'Date is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    } else {
      addToast('Please fill in all required fields', 'error');
    }
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  /* ──────── submit ──────── */

  const handleSubmit = async () => {
    if (!validateStep(5)) { addToast('Please fill in the declaration', 'error'); return; }
    setSubmitting(true);
    try {
      // 1. Upload passport photo first
      let passportPhotoUrl: string | undefined;
      if (form.passportPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('file', form.passportPhoto);
        photoFormData.append('type', 'admission');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          passportPhotoUrl = uploadData.url;
        } else {
          addToast('Failed to upload passport photo. Please try again.', 'error');
          setSubmitting(false);
          return;
        }
      }

      // 2. Convert documents to base64 data URLs
      const docsBase64: { type: string; fileName: string; dataUrl: string }[] = [];
      for (const doc of documents) {
        const buffer = await doc.file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const base64 = btoa(binary);
        docsBase64.push({ type: doc.type, fileName: doc.file.name, dataUrl: `data:${doc.file.type};base64,${base64}` });
      }

      // 3. Submit application with form data + photo URL + documents
      const programme = form.institutionChoices[0].courseI || 'TVET Programme';
      const res = await fetch('/api/admissions/tvet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, passportPhotoUrl, documents: docsBase64 }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setSubmitted(true);
        addToast('TVET Application submitted successfully!', 'success');
      } else {
        addToast(data.message || 'Submission failed. Please try again.', 'error');
      }
    } catch {
      addToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ──────── helpers ──────── */

  const SectionTitle = ({ code, title }: { code: string; title: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <Badge className="text-xs font-bold px-2.5 py-0.5" style={{ background: GOLD, color: PRIMARY }}>{code}</Badge>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-red-500 mt-1">{errors[field]}</p> : null;

  const RequiredMark = () => <span className="text-red-500 ml-0.5">*</span>;

  const SubjectGradeTable = ({
    subjects, gradeOptions, section, maxRows = 20,
  }: {
    subjects: SubjectGrade[];
    gradeOptions: string[];
    section: 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects' | 'otherQualSubjects';
    maxRows?: number;
    qualIdx?: number;
  }) => {
    const handleAdd = () => {
      if (section === 'otherQualSubjects' && qualIdx !== undefined) {
        updateOtherQualSubject(qualIdx, subjects.length, 'subject', '');
      } else {
        addSubjectRow(section as 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects');
      }
    };
    const handleRemove = (idx: number) => {
      if (section === 'otherQualSubjects' && qualIdx !== undefined) {
        setForm((prev) => {
          const arr = [...prev.otherQuals];
          arr[qualIdx] = { ...arr[qualIdx], subjects: arr[qualIdx].subjects.filter((_, i) => i !== idx) };
          return { ...prev, otherQuals: arr };
        });
      } else {
        removeSubjectRow(section as 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects', idx);
      }
    };
    const handleUpdate = (idx: number, key: 'subject' | 'grade', value: string) => {
      if (section === 'otherQualSubjects' && qualIdx !== undefined) {
        updateOtherQualSubject(qualIdx, idx, key, value);
      } else {
        updateSubject(section as 'pleSubjects' | 'olevelSubjects' | 'ujtcSubjects', idx, key, value);
      }
    };

    return (
      <div className="mt-3">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow style={{ background: `${PRIMARY}10` }}>
                <TableHead className="w-10 text-center text-xs font-bold" style={{ color: PRIMARY }}>#</TableHead>
                <TableHead className="text-xs font-bold" style={{ color: PRIMARY }}>Subject</TableHead>
                <TableHead className="w-40 text-xs font-bold" style={{ color: PRIMARY }}>Grade / Score</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center text-xs text-gray-400 font-medium">{i + 1}</TableCell>
                  <TableCell>
                    <Input className="h-8 text-sm" placeholder="Subject name" value={row.subject} onChange={(e) => handleUpdate(i, 'subject', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Select value={row.grade} onValueChange={(v) => handleUpdate(i, 'grade', v)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Grade" /></SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {subjects.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemove(i)}>
                        <X size={14} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {subjects.length < maxRows && (
          <Button type="button" variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1" onClick={handleAdd}>
            <Plus size={12} /> Add Subject
          </Button>
        )}
      </div>
    );
  };

  /* ──────── step renderers ──────── */

  const renderStep1 = () => (
    <div className="space-y-6">
      <SectionTitle code="SECTION A" title="Particulars of Applicant" />

      {/* Passport Photo Upload */}
      <div className="flex flex-col items-center mb-2">
        <Label className="text-sm font-medium text-gray-700 mb-3">
          Attach Passport Photo <span className="text-red-500 font-bold">(Required)</span>
        </Label>
        <div
          className={`relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all ${
            photoDragOver
              ? 'border-blue-400 bg-blue-50 scale-105'
              : form.passportPhotoPreview
              ? 'border-emerald-300 bg-emerald-50'
              : errors.passportPhoto
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
          onClick={() => !form.passportPhotoPreview && photoInputRef.current?.click()}
          onDrop={handlePhotoDrop}
          onDragOver={handlePhotoDragOver}
          onDragLeave={handlePhotoDragLeave}
        >
          {form.passportPhotoPreview ? (
            <>
              <img
                src={form.passportPhotoPreview}
                alt="Passport photo preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera size={28} className={errors.passportPhoto ? 'text-red-400' : 'text-gray-400'} />
              <span className="text-[10px] text-gray-400 text-center leading-tight px-1">
                Click or drag<br />to upload
              </span>
            </div>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">JPEG, PNG, or WebP. Max 1.5MB</p>
        {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
      </div>

      {/* Header with logo info */}
      <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: `${PRIMARY}20`, background: `${PRIMARY}04` }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>Republic of Uganda</p>
        <p className="text-sm font-bold mt-1" style={{ color: PRIMARY }}>Ministry of Education and Sports</p>
        <p className="text-xs text-gray-500">TVET Online Application Form</p>
      </div>

      {/* Names */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><User size={14} /> Names</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Surname <RequiredMark /></Label>
            <Input className="mt-1" placeholder="e.g. Okello" value={form.surname} onChange={(e) => updateField('surname', e.target.value)} />
            <FieldError field="surname" />
          </div>
          <div>
            <Label className="text-sm">Other Names <RequiredMark /></Label>
            <Input className="mt-1" placeholder="e.g. John Peter" value={form.otherNames} onChange={(e) => updateField('otherNames', e.target.value)} />
            <FieldError field="otherNames" />
          </div>
        </div>
      </div>

      {/* Nationality, DOB, Sex */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm">Nationality <RequiredMark /></Label>
          <Select value={form.nationality} onValueChange={(v) => updateField('nationality', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Date of Birth <RequiredMark /></Label>
          <Input type="date" className="mt-1" value={form.dob} onChange={(e) => updateField('dob', e.target.value)} />
          <FieldError field="dob" />
        </div>
        <div>
          <Label className="text-sm">Sex <RequiredMark /></Label>
          <Select value={form.sex} onValueChange={(v) => updateField('sex', v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select sex" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <FieldError field="sex" />
        </div>
      </div>

      {/* Home District, County, Sub-county */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><MapPin size={14} /> Home District / County / Sub-county</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm">Home District <RequiredMark /></Label>
            <Select value={form.homeDistrict} onValueChange={(v) => updateField('homeDistrict', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select district" /></SelectTrigger>
              <SelectContent className="max-h-64">
                {UGANDA_DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError field="homeDistrict" />
          </div>
          <div>
            <Label className="text-sm">County <RequiredMark /></Label>
            <Input className="mt-1" placeholder="e.g. Soroti" value={form.county} onChange={(e) => updateField('county', e.target.value)} />
            <FieldError field="county" />
          </div>
          <div>
            <Label className="text-sm">Sub-county <RequiredMark /></Label>
            <Input className="mt-1" placeholder="e.g. Madera" value={form.subCounty} onChange={(e) => updateField('subCounty', e.target.value)} />
            <FieldError field="subCounty" />
          </div>
        </div>
      </div>

      {/* Religion, Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Religious Affiliation <RequiredMark /></Label>
          <Select value={form.religion} onValueChange={(v) => updateField('religion', v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select religion" /></SelectTrigger>
            <SelectContent>
              {RELIGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <FieldError field="religion" />
        </div>
        <div>
          <Label className="text-sm">Email Address <RequiredMark /></Label>
          <div className="relative mt-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <FieldError field="email" />
        </div>
      </div>

      {/* Physical Address: Parish, Village, Telephone */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><MapPin size={14} /> Physical Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm">Parish</Label>
            <Input className="mt-1" placeholder="e.g. Madera Parish" value={form.parish} onChange={(e) => updateField('parish', e.target.value)} />
          </div>
          <div>
            <Label className="text-sm">Village</Label>
            <Input className="mt-1" placeholder="e.g. Kamdini" value={form.village} onChange={(e) => updateField('village', e.target.value)} />
          </div>
          <div>
            <Label className="text-sm">Telephone Contact <RequiredMark /></Label>
            <div className="relative mt-1">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input className="pl-9" placeholder="e.g. 0771234567" value={form.telephone} onChange={(e) => updateField('telephone', e.target.value)} />
            </div>
            <FieldError field="telephone" />
          </div>
        </div>
      </div>

      {/* Parent/Guardian */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><User size={14} /> Parent / Guardian Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Name of Parent/Guardian <RequiredMark /></Label>
            <Input className="mt-1" placeholder="Full name" value={form.parentGuardianName} onChange={(e) => updateField('parentGuardianName', e.target.value)} />
            <FieldError field="parentGuardianName" />
          </div>
          <div>
            <Label className="text-sm">Telephone Contacts <RequiredMark /></Label>
            <div className="flex gap-2 mt-1">
              <Input className="flex-1" placeholder="Primary contact" value={form.parentTelephone} onChange={(e) => updateField('parentTelephone', e.target.value)} />
              <Input className="flex-1" placeholder="Alt. contact" value={form.parentTelephone2} onChange={(e) => updateField('parentTelephone2', e.target.value)} />
            </div>
            <FieldError field="parentTelephone" />
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-sm">Parent/Guardian NIN</Label>
          <Input className="mt-1" placeholder="National Identification Number" value={form.parentNIN} onChange={(e) => updateField('parentNIN', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <SectionTitle code="SECTION B" title="Educational Background" />

      {/* PLE Results */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
            <BookOpen size={15} /> (a) Primary Leaving Examination (PLE) Results
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Name of School <RequiredMark /></Label>
              <Input className="mt-1" placeholder="School name" value={form.pleSchoolName} onChange={(e) => updateField('pleSchoolName', e.target.value)} />
              <FieldError field="pleSchoolName" />
            </div>
            <div>
              <Label className="text-sm">Year of Sitting <RequiredMark /></Label>
              <Select value={form.pleYearSitting} onValueChange={(v) => updateField('pleYearSitting', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError field="pleYearSitting" />
            </div>
            <div>
              <Label className="text-sm">Index Number</Label>
              <Input className="mt-1" placeholder="PLE index number" value={form.pleIndexNumber} onChange={(e) => updateField('pleIndexNumber', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Total Aggregates</Label>
              <Input className="mt-1" placeholder="e.g. 12" value={form.pleTotalAggregates} onChange={(e) => updateField('pleTotalAggregates', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Division</Label>
              <Select value={form.pleDivision} onValueChange={(v) => updateField('pleDivision', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select division" /></SelectTrigger>
                <SelectContent>
                  {PLE_DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">PLE Subjects & Grades (4 subjects)</Label>
            <SubjectGradeTable subjects={form.pleSubjects} gradeOptions={['1','2','3','4','5','6','7','8','9','U']} section="pleSubjects" maxRows={8} />
          </div>
        </CardContent>
      </Card>

      {/* O-Level UCE Results */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
            <GraduationCap size={15} /> (b) O-Level (U.C.E.) Results
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Name of School <RequiredMark /></Label>
              <Input className="mt-1" placeholder="School name" value={form.olevelSchoolName} onChange={(e) => updateField('olevelSchoolName', e.target.value)} />
              <FieldError field="olevelSchoolName" />
            </div>
            <div>
              <Label className="text-sm">Year of Sitting <RequiredMark /></Label>
              <Select value={form.olevelYearSitting} onValueChange={(v) => updateField('olevelYearSitting', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError field="olevelYearSitting" />
            </div>
            <div>
              <Label className="text-sm">Index Number</Label>
              <Input className="mt-1" placeholder="UCE index number" value={form.olevelIndexNumber} onChange={(e) => updateField('olevelIndexNumber', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">O-Level Subjects & Grades (up to 10 subjects)</Label>
            <SubjectGradeTable subjects={form.olevelSubjects} gradeOptions={UCE_GRADES} section="olevelSubjects" maxRows={14} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <SectionTitle code="SECTION B (cont.)" title="UJTC/UCPC & Other Qualifications" />

      {/* UJTC/UCPC Results */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
            <GraduationCap size={15} /> (c) UJTC / UCPC Results
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <p className="text-xs text-gray-400">Leave blank if not applicable</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Name of Institution</Label>
              <Input className="mt-1" placeholder="Institution name" value={form.ujtcInstitution} onChange={(e) => updateField('ujtcInstitution', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Year of Sitting</Label>
              <Select value={form.ujtcYearSitting} onValueChange={(v) => updateField('ujtcYearSitting', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Course Name</Label>
              <Input className="mt-1" placeholder="Course name" value={form.ujtcCourseName} onChange={(e) => updateField('ujtcCourseName', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Index Number</Label>
              <Input className="mt-1" placeholder="Index number" value={form.ujtcIndexNumber} onChange={(e) => updateField('ujtcIndexNumber', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Overall Grade</Label>
              <Select value={form.ujtcGrade} onValueChange={(v) => updateField('ujtcGrade', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Grade" /></SelectTrigger>
                <SelectContent>
                  {UJTC_GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">UJTC/UCPC Subjects & Grades</Label>
            <SubjectGradeTable subjects={form.ujtcSubjects} gradeOptions={['Distinction','Credit','Pass','Fail','1','2','3','4','5','6','7','8','9','U']} section="ujtcSubjects" maxRows={10} />
          </div>
        </CardContent>
      </Card>

      {/* Other Qualifications */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
              <Award size={15} /> (d) Any Other Qualification(s)
            </CardTitle>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addOtherQual}>
              <Plus size={12} /> Add Qualification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-xs text-gray-400 mb-4">Leave blank if not applicable. Add up to 2 additional qualifications.</p>
          {form.otherQuals.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <Award size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No additional qualifications added</p>
              <Button type="button" variant="ghost" size="sm" className="mt-2 text-xs gap-1" onClick={addOtherQual}>
                <Plus size={12} /> Add Qualification
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {form.otherQuals.map((qual, qi) => (
                <div key={qi} className="relative border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">Qualification {qi + 1}</Badge>
                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => removeOtherQual(qi)}>
                      <X size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs">Name of Institution</Label>
                      <Input className="mt-1 h-8 text-sm" placeholder="Institution" value={qual.institution} onChange={(e) => updateOtherQual(qi, 'institution', e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Course Name</Label>
                      <Input className="mt-1 h-8 text-sm" placeholder="Course" value={qual.courseName} onChange={(e) => updateOtherQual(qi, 'courseName', e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Year Sitting</Label>
                      <Input className="mt-1 h-8 text-sm" placeholder="Year" value={qual.yearSitting} onChange={(e) => updateOtherQual(qi, 'yearSitting', e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Registration Number</Label>
                      <Input className="mt-1 h-8 text-sm" placeholder="Reg. No." value={qual.regNumber} onChange={(e) => updateOtherQual(qi, 'regNumber', e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Class/Grade</Label>
                      <Select value={qual.classGrade} onValueChange={(v) => updateOtherQual(qi, 'classGrade', v)}>
                        <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue placeholder="Grade" /></SelectTrigger>
                        <SelectContent>
                          {OTHER_GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Subjects & Grades</Label>
                    <SubjectGradeTable subjects={qual.subjects} gradeOptions={['Distinction','Credit','Pass','Fail','1','2','3','4','D1','D2','C3','C4','C5','C6','P7','P8','F9']} section="otherQualSubjects" maxRows={10} qualIdx={qi} />
                  </div>
                </div>
              ))}
              {form.otherQuals.length < 2 && (
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={addOtherQual}>
                  <Plus size={12} /> Add Another Qualification
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <SectionTitle code="SECTION C" title="Work Record, Sports & Course Choices" />

      {/* Work Record */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
            <Briefcase size={15} /> Relevant Work Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-xs text-gray-400 mb-4">If applicable, list relevant work experience (up to 3 entries)</p>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ background: `${PRIMARY}10` }}>
                  <TableHead className="text-xs font-bold" style={{ color: PRIMARY }}>Organization / Employer</TableHead>
                  <TableHead className="text-xs font-bold" style={{ color: PRIMARY }}>Post Held</TableHead>
                  <TableHead className="text-xs font-bold" style={{ color: PRIMARY }}>Period (From – To)</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.workRecords.map((wr, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Input className="h-8 text-sm" placeholder="Organization" value={wr.organization} onChange={(e) => updateWorkRecord(i, 'organization', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input className="h-8 text-sm" placeholder="Post" value={wr.postHeld} onChange={(e) => updateWorkRecord(i, 'postHeld', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input className="h-8 text-sm" placeholder="e.g. 2022 – 2023" value={wr.period} onChange={(e) => updateWorkRecord(i, 'period', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      {form.workRecords.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => removeWorkRecord(i)}>
                          <X size={14} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {form.workRecords.length < 3 && (
            <Button type="button" variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1" onClick={addWorkRecord}>
              <Plus size={12} /> Add Work Record
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sports & Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
            <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
              <Trophy size={15} /> Sports and Games
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Textarea className="text-sm min-h-[80px]" placeholder="List any sports and games you have participated in, positions held, and achievements..." value={form.sportsGames} onChange={(e) => updateField('sportsGames', e.target.value)} />
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-3" style={{ background: `${PRIMARY}06` }}>
            <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
              <HeartPulse size={15} /> Chronic Disease / Disability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Textarea className="text-sm min-h-[80px]" placeholder="State any chronic disease or disability if applicable (write 'None' if not applicable)..." value={form.chronicDisease} onChange={(e) => updateField('chronicDisease', e.target.value)} />
          </CardContent>
        </Card>
      </div>

      {/* Institution Choices */}
      <Card className="border-2" style={{ borderColor: `${PRIMARY}30` }}>
        <CardHeader className="pb-3" style={{ background: `${PRIMARY}08` }}>
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: PRIMARY }}>
            <Building2 size={15} /> Choices of TVET Institutions & Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {form.institutionChoices.map((choice, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="font-bold" style={{ background: i === 0 ? GOLD : '#e5e7eb', color: i === 0 ? PRIMARY : '#374151' }}>
                  Choice {i + 1} {i === 0 ? '(First)' : '(Second)'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Name of TVET Institution</Label>
                  <Input className="mt-1" placeholder="e.g. St. Kizito's Technical Institute - Madera" value={choice.institution} onChange={(e) => updateInstChoice(i, 'institution', e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm">Course Choice (i) <RequiredMark /></Label>
                  <Input className="mt-1" placeholder="e.g. Building Construction" value={choice.courseI} onChange={(e) => updateInstChoice(i, 'courseI', e.target.value)} />
                  {i === 0 && <FieldError field="choice1courseI" />}
                </div>
                <div>
                  <Label className="text-sm">Course Choice (ii)</Label>
                  <Input className="mt-1" placeholder="e.g. Electrical Installation" value={choice.courseII} onChange={(e) => updateInstChoice(i, 'courseII', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <div>
            <Label className="text-sm font-medium text-gray-700">Brief Reason for Choosing Course <RequiredMark /></Label>
            <Textarea className="mt-1 text-sm min-h-[80px]" placeholder="Explain briefly why you are choosing this course..." value={form.reasonForCourse} onChange={(e) => updateField('reasonForCourse', e.target.value)} />
            <FieldError field="reasonForCourse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Submitted state */}
      {submitted && result ? (
        <div className="text-center py-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: '#dcfce7' }}>
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
            <p className="text-gray-500 mb-8">Your TVET application has been received. Save the details below.</p>

            <div className="max-w-md mx-auto space-y-4 mb-8">
              <div className="rounded-xl border-2 p-6 text-left" style={{ borderColor: `${PRIMARY}30`, background: `${PRIMARY}04` }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Reference Number</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: PRIMARY }}>{result.referenceNumber}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">SchoolPay Payment Code</p>
                    <p className="text-xl font-bold font-mono mt-1" style={{ color: PRIMARY }}>{result.schoolpayCode}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Programme</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{result.programme}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
                <p className="text-xs font-bold text-amber-800 mb-1">Next Steps</p>
                <p className="text-xs text-amber-700">
                  1. Pay the application fee using the SchoolPay code above (via *210# or schoolpay.co.ug).<br />
                  2. Use the reference number to track your application status.<br />
                  3. The admissions office will contact you regarding the next steps.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => setCurrentPage('track-application')}
                className="gap-2"
                style={{ background: PRIMARY }}
              >
                <Search size={16} />
                Track Application
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage('admissions')}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Back to Admissions
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Review all sections */}
          <SectionTitle code="REVIEW" title="Review Your Application" />

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableBody>
                <TableRow style={{ background: `${PRIMARY}06` }}>
                  <TableCell className="font-bold text-sm" style={{ color: PRIMARY }} colSpan={2}>Section A: Particulars of Applicant</TableCell>
                </TableRow>
                <TableRow><TableCell className="text-xs text-gray-500 w-40">Full Name</TableCell><TableCell className="text-sm">{form.surname} {form.otherNames}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Nationality / Sex</TableCell><TableCell className="text-sm">{form.nationality} / {form.sex}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Date of Birth</TableCell><TableCell className="text-sm">{form.dob}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">District / County / Sub-county</TableCell><TableCell className="text-sm">{form.homeDistrict} / {form.county} / {form.subCounty}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Religion</TableCell><TableCell className="text-sm">{form.religion}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Email / Telephone</TableCell><TableCell className="text-sm">{form.email} / {form.telephone}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Physical Address</TableCell><TableCell className="text-sm">{form.parish}, {form.village}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">Parent/Guardian</TableCell><TableCell className="text-sm">{form.parentGuardianName} ({form.parentTelephone})</TableCell></TableRow>

                <TableRow style={{ background: `${PRIMARY}06` }}>
                  <TableCell className="font-bold text-sm" style={{ color: PRIMARY }} colSpan={2}>Section B: Educational Background</TableCell>
                </TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">PLE School / Year</TableCell><TableCell className="text-sm">{form.pleSchoolName} ({form.pleYearSitting})</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">PLE Aggregates / Division</TableCell><TableCell className="text-sm">{form.pleTotalAggregates || 'N/A'} / {form.pleDivision || 'N/A'}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">O-Level School / Year</TableCell><TableCell className="text-sm">{form.olevelSchoolName} ({form.olevelYearSitting})</TableCell></TableRow>
                {form.ujtcInstitution && (
                  <TableRow><TableCell className="text-xs text-gray-500">UJTC/UCPC</TableCell><TableCell className="text-sm">{form.ujtcInstitution} - {form.ujtcCourseName} ({form.ujtcYearSitting})</TableCell></TableRow>
                )}
                {form.otherQuals.length > 0 && (
                  <TableRow><TableCell className="text-xs text-gray-500">Other Qualification(s)</TableCell><TableCell className="text-sm">{form.otherQuals.map((q) => `${q.courseName} (${q.institution})`).join(', ')}</TableCell></TableRow>
                )}

                <TableRow style={{ background: `${PRIMARY}06` }}>
                  <TableCell className="font-bold text-sm" style={{ color: PRIMARY }} colSpan={2}>Section C: Work Record & Choices</TableCell>
                </TableRow>
                {form.workRecords.some((w) => w.organization) && (
                  <TableRow><TableCell className="text-xs text-gray-500">Work Experience</TableCell><TableCell className="text-sm">{form.workRecords.filter((w) => w.organization).map((w) => `${w.postHeld} at ${w.organization}`).join('; ')}</TableCell></TableRow>
                )}
                <TableRow><TableCell className="text-xs text-gray-500">1st Choice Course</TableCell><TableCell className="text-sm font-semibold" style={{ color: PRIMARY }}>{form.institutionChoices[0].courseI || 'Not selected'}</TableCell></TableRow>
                <TableRow><TableCell className="text-xs text-gray-500">1st Choice Institution</TableCell><TableCell className="text-sm">{form.institutionChoices[0].institution || 'Not selected'}</TableCell></TableRow>
                {form.institutionChoices[1].courseI && (
                  <TableRow><TableCell className="text-xs text-gray-500">2nd Choice Course</TableCell><TableCell className="text-sm">{form.institutionChoices[1].courseI} at {form.institutionChoices[1].institution}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Supporting Documents */}
          <SectionTitle code="ATTACHMENTS" title="Supporting Documents" />
          <Card className="border-2" style={{ borderColor: `${PRIMARY}30` }}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500 mb-4">Attach supporting documents (National ID, academic transcripts, certificates). PDF, JPEG, PNG, or WebP up to 2MB each.</p>
              <div className="space-y-3 mb-4">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Paperclip size={16} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{doc.file.name}</p>
                      <p className="text-xs text-gray-400">{DOC_TYPES.find(d => d.value === doc.type)?.label || doc.type}</p>
                    </div>
                    <button type="button" onClick={() => removeDocument(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No documents attached yet.</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="h-9 text-sm rounded-md border border-gray-200 px-3 bg-white"
                  value={pendingDocType}
                  onChange={(e) => setPendingDocType(e.target.value)}
                >
                  {DOC_TYPES.map((dt) => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
                </select>
                <label className="flex-1 cursor-pointer">
                  <input ref={docInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleDocSelect} />
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#1a3a6b] hover:bg-[#1a3a6b]/5 transition-colors">
                    <Upload size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Click to select file</span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Declaration */}
          <SectionTitle code="SECTION D" title="Declaration" />
          <Card className="border-2" style={{ borderColor: `${PRIMARY}30` }}>
            <CardContent className="pt-6">
              <div className="rounded-lg bg-gray-50 p-4 mb-6 text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold mb-2" style={{ color: PRIMARY }}>Applicant's Declaration:</p>
                <p>
                  I hereby declare that all the information given in this application form is correct and complete to the best of my knowledge and belief.
                  I understand that any false or misleading information may lead to disqualification or cancellation of my admission.
                  I agree to abide by the rules and regulations of the institution to which I am admitted.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm">Full Name (as declared above) <RequiredMark /></Label>
                  <Input className="mt-1" placeholder="Your full name" value={form.declarationName} onChange={(e) => updateField('declarationName', e.target.value)} />
                  <FieldError field="declarationName" />
                </div>
                <div>
                  <Label className="text-sm">Date <RequiredMark /></Label>
                  <Input type="date" className="mt-1" value={form.declarationDate} onChange={(e) => updateField('declarationDate', e.target.value)} />
                  <FieldError field="declarationDate" />
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: `${PRIMARY}04`, border: `1px dashed ${PRIMARY}30` }}>
                  <PenLine size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Signature</p>
                    <p className="text-xs text-gray-400">Your electronic submission constitutes your signature and agreement to the above declaration.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  /* ──────── main render ──────── */

  return (
    <div className="min-h-screen bg-white">
      {/* Top spacer for fixed nav */}
      <div className="h-24" />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <button
          onClick={() => setCurrentPage('admissions')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Admissions
        </button>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})` }}>
            <BadgeCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">TVET Online Application Form</h1>
            <p className="text-sm text-gray-500">Ministry of Education & Sports – Formal Admission</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* ──── LEFT SIDEBAR: Step Indicator ──── */}
            <aside
              className="lg:w-64 shrink-0 p-6 lg:p-8 lg:border-r border-b lg:border-b-0 border-gray-100"
              style={{ background: `linear-gradient(180deg, ${PRIMARY}08, white)` }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
                Application Steps
              </h3>
              <nav className="space-y-1">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const active = currentStep === step.id;
                  const completed = currentStep > step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (step.id < currentStep) setCurrentStep(step.id);
                      }}
                      disabled={step.id > currentStep}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                        active ? 'text-white shadow-md' : completed ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400'
                      }`}
                      style={active ? { background: PRIMARY } : undefined}
                    >
                      <div
                        className={`size-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                          active ? 'border-white bg-white/20' : completed ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {completed && !active ? (
                          <Check className="size-4 text-green-500" />
                        ) : (
                          <Icon className={`size-3.5 ${active ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-60">{step.shortLabel}</span>
                        <span className="text-sm font-medium leading-tight block truncate">{step.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile step indicator */}
              <div className="lg:hidden mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  {STEPS.map((step) => (
                    <div key={step.id} className="flex-1 flex justify-center">
                      <div
                        className={`size-3 rounded-full transition-colors ${
                          currentStep === step.id ? 'ring-2 ring-offset-2' : currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={currentStep === step.id ? { background: GOLD, ringColor: GOLD } : undefined}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">Step {currentStep} of 5</p>
              </div>
            </aside>

            {/* ──── RIGHT CONTENT AREA ──── */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 min-h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {!submitted && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={currentStep === 1 || submitting}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {STEPS.map((step) => (
                      <div
                        key={step.id}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          step.id === currentStep ? 'w-8' : step.id < currentStep ? 'w-4 bg-green-400' : 'w-4 bg-gray-200'
                        }`}
                        style={step.id === currentStep ? { background: GOLD } : undefined}
                      />
                    ))}
                  </div>

                  {currentStep < 5 ? (
                    <Button
                      onClick={goNext}
                      disabled={submitting}
                      className="cursor-pointer"
                      style={{ background: PRIMARY }}
                    >
                      Next
                      <ChevronRight className="size-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="cursor-pointer"
                      style={{ background: PRIMARY }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="size-4 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
