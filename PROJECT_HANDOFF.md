# St. Kizito's Technical Institute - Madera (SKTM) — Project Handoff

> **Last Updated**: 2026-08-29
> **Deployment**: https://stkizito-madera-website.vercel.app/
> **Repository**: https://github.com/manjoezzy/stkizito-madera-website.git

---

## 1. PROJECT OVERVIEW

**What**: Production school website for St. Kizito's Technical Institute - Madera, Soroti City, Eastern Uganda. A government-aided TVET (Technical and Vocational Education and Training) institution established in 1947.

**Tech Stack**:
- **Framework**: Next.js 16.1 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI) + Framer Motion
- **State**: Zustand 5 (client-side SPA with hash-based routing)
- **Database**: Prisma 6 + SQLite (`db/custom.db`)
- **Auth**: Custom JWT via `jose` library (NOT next-auth)
- **Deployment**: Vercel (auto-deploy on push to `main`)
- **Output Mode**: `standalone` (for Docker/bare-metal)

**Architecture Pattern**: Single-page application inside Next.js. Only `/api/*` routes use Next.js file-based routing. All pages are client components switched via Zustand `currentPage` state + `window.location.hash`.

---

## 2. CURRENT STATUS — WHAT'S DONE

### Fully Working Features
- **Public pages**: Home, About, Programs, Admissions, Events, News, Gallery, Contact, Graduation, Alumni, Alumni Registration, Online Learning, Student Login, Student Portal, Track Application
- **Admin dashboard** (monolithic ~3800 lines): News/Events CRUD, Gallery management, Messages (inbox with reply via Gmail), Admissions management, Alumni management, Graduation management, Website Settings, Audit Logs
- **TVET Application Form**: Multi-step form with document uploads (national ID, transcript, passport photo, recommendation letter, medical certificate, other certificates)
- **Application tracking**: By application number
- **Student portal**: Login with student number + application reference
- **Alumni system**: Public self-registration, admin export (Excel/PDF), grouped by graduation year
- **Contact messages**: With status tracking (unread/read/replied), Gmail reply integration, bulk actions
- **Secure admin portal**: Hidden route `/staff-portal-8x7q` behind a portal key gate (`PortalKeyGate.tsx`), timing-safe key verification
- **Password reset**: Secure flow with JWT tokens and expiry
- **Responsive design**: Mobile-friendly with hamburger menu
- **SEO/meta**: Proper meta tags
- **Image uploads**: Via `/api/upload` (base64), stored in `public/uploads/`
- **Admission letter generation**: PDF via PDFKit
- **SchoolPay payment integration**: Lib exists (`src/lib/schoolpay.ts`)

---

## 3. PENDING / BROKEN ITEMS

### 3.1 Hero Section — PARTIALLY DONE (latest commit: `b036b61`)

**What was requested**: Makerere University-style hero — show default school hero first, then rotate through featured news/events. Each event slide should have a **full-bleed background photo** with **dark overlay** and **text at the bottom** with a "Read More" button.

**Current state**: Code is written and pushed (`b036b61`). The implementation:
- Default slide shows first (6 seconds), then rotates through event slides every 5 seconds
- Event slides use full-bleed `background-image` with dark gradient overlay
- Text at bottom: category badges, title, description, gold "Read More" button
- Navigation dots at bottom
- Events without `bannerUrl` use gallery photos as fallback
- All slides dark (nav text stays white/visible)

**Known issues**:
- Only 1 of 7 events has a `bannerUrl` in the database ("Presidential Launch of New Administration")
- The other 6 events use gallery photos as fallback backgrounds — this works but the photos may not match the event content
- User previously reported "nothing has changed" and "website crashed" — these may have been caching issues or the previous broken implementation
- **Needs visual verification** on a real browser after hard refresh

**Key files**:
- `src/components/HomePage.tsx` — lines ~173-550 (hero state, rotation logic, JSX)
- `src/components/HeroNewsTicker.tsx` — still exists, exports `HeroEventItem` type (no longer used for rendering, only for typing)

**Database state for events**:
```
7 events total, only 1 has bannerUrl:
- Reporting & Orientation 2025 (no banner)
- Skills Exhibition 2025 (no banner)
- End of Term Assessments (no banner)
- Community Outreach Day (no banner)
- Presidential Launch of New Administration (/uploads/gallery/presidential-launch-1.jpg) ← HAS BANNER
- Student Practical Examinations (no banner)
- Inter-Departmental Games and Sports Day (no banner)
```

**Gallery photos available** (21 items, used as fallback backgrounds):
- Static: campus.png, graduation.png, gallery-openday.png, gallery-outreach.png, gallery-sports.png, about-workshop.png, gallery-graduation2.png, gallery-community.png
- Uploaded: electrical-workshop.jpg, admin-building.jpg, institute-bus.jpg, presidential-launch-1/2/3/4.jpg, electrical-practical-exams.jpeg, plumbing-practical.jpeg, games-sports.jpeg, madera-campus-4.jpg

### 3.2 Environment Variables — MISSING

Only `DATABASE_URL` is set in `.env`. The following are needed for full functionality:

| Variable | Purpose | Status |
|----------|---------|--------|
| `DATABASE_URL` | SQLite path | ✅ Set |
| `JWT_SECRET` | JWT token signing | ⚠️ Uses fallback in auth.ts |
| `GMAIL_ADDRESS` | Reply-from email | ❌ Not set |
| `GMAIL_APP_PASSWORD` | Gmail SMTP password | ❌ Not set |
| `SCHOOLPAY_API_URL` | Payment API | ❌ Not set |
| `SCHOOLPAY_API_KEY` | Payment auth | ❌ Not set |
| `SCHOOLPAY_VENDOR_ID` | Payment vendor | ❌ Not set |

**Impact**: Email replies from admin dashboard won't work without Gmail credentials. Payments won't work without SchoolPay keys.

### 3.3 Known Technical Debt

- **`next.config.ts`**: Has `experimental.outputFileTracingIncludes` which should be moved to top-level `outputFileTracingIncludes` (causes build warning)
- **`middleware.ts`**: Uses deprecated `middleware` convention — Next.js 16 recommends `proxy.ts` instead
- **TypeScript**: `ignoreBuildErrors: true` in next.config.ts — there are ~15 pre-existing TS errors in admin routes and example files
- **`next-auth`**: Installed in package.json but NOT used — custom JWT auth is used instead
- **AdminDashboard.tsx**: Monolithic ~3800-line component — hard to maintain, should be split into route-based pages
- **Prisma + Turbopack**: Local dev has Prisma initialization issues with Turbopack — production builds on Vercel work fine

---

## 4. FILE STRUCTURE (KEY FILES)

```
src/
├── app/
│   ├── page.tsx                    # Main SPA entry — maps pages to components
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   └── api/
│       ├── route.ts                # Health check
│       ├── admin/route.ts          # POST: admin login
│       ├── admin/reset-password/route.ts
│       ├── admin/reset-password/confirm/route.ts
│       ├── auth/session/route.ts   # GET: session restore
│       ├── admissions/route.ts     # GET/POST: applications
│       ├── admissions/tvet/route.ts
│       ├── admissions/generate-letter/route.ts
│       ├── admissions/download-form/route.ts
│       ├── admissions/send-letter/route.ts
│       ├── alumni/register/route.ts
│       ├── alumni/route.ts
│       ├── alumni/export/route.ts
│       ├── contact/route.ts        # GET/POST/PATCH: messages
│       ├── events/route.ts         # GET/POST: events & news
│       ├── gallery/route.ts        # GET/POST: gallery photos
│       ├── graduation/route.ts
│       ├── payments/route.ts
│       ├── portal-verify/route.ts  # Portal key verification
│       ├── settings/route.ts
│       └── settings/bulk/route.ts
├── components/
│   ├── Navigation.tsx              # Two-bar nav (primary h-14/16 + secondary h-10/11)
│   ├── HomePage.tsx                # Landing page with hero, stats, programs, etc.
│   ├── HeroNewsTicker.tsx          # (LEGACY) Exports HeroEventItem type only
│   ├── AboutPage.tsx
│   ├── ProgramsPage.tsx
│   ├── AdmissionsPage.tsx
│   ├── AdmissionsEnrolledPage.tsx
│   ├── TvetApplicationForm.tsx     # Multi-step TVET application
│   ├── TrackApplicationPage.tsx
│   ├── StudentLoginPage.tsx
│   ├── StudentPortalPage.tsx
│   ├── OnlineLearningPage.tsx
│   ├── EventsPage.tsx
│   ├── NewsPage.tsx
│   ├── GalleryPage.tsx
│   ├── GraduationPage.tsx
│   ├── AlumniPage.tsx
│   ├── AlumniRegisterPage.tsx
│   ├── AdminLoginPage.tsx
│   ├── AdminDashboard.tsx          # ~3800 lines, all admin functions
│   ├── PortalKeyGate.tsx           # Secret portal key gate
│   ├── admin/
│   │   ├── AdminGraduationSection.tsx
│   │   ├── AdminWebsiteSettings.tsx
│   │   └── AdminAlumniSection.tsx
│   └── ui/                         # 44 shadcn/ui components
├── store/
│   └── useAppStore.ts              # Zustand store — all app state, page routing
├── lib/
│   ├── auth.ts                     # JWT creation/verification (jose)
│   ├── db.ts                       # Prisma client singleton
│   ├── email.ts                    # Nodemailer Gmail setup
│   ├── audit.ts                    # Audit logging
│   ├── schoolpay.ts                # SchoolPay integration
│   ├── admission-letter.ts         # PDFKit letter generation
│   └── utils.ts                    # cn() helper, etc.
├── middleware.ts                    # API auth middleware (JWT)
├── prisma/
│   ├── schema.prisma               # 12 models
│   └── (migrations)
db/
│   └── custom.db                   # SQLite database (gitignored)
public/
├── images/                         # 18 static images
└── uploads/
    └── gallery/                    # 9 uploaded photos
```

---

## 5. PRISMA SCHEMA — ALL MODELS

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Admin** | Admin users | id, email (unique), password, name, role, disabled, lastLogin |
| **AdmissionApplication** | Student applications | personal info, contact, academic, program choice, payment status, SchoolPay refs |
| **Student** | Enrolled students | studentNumber, applicationId (FK) |
| **Payment** | Payment transactions | SchoolPay integration, refs, amounts, status |
| **Event** | Events & news | title, category, description, eventDate, eventTime, location, bannerUrl, published, attachments |
| **ContactMessage** | Contact form | name, email, phone, subject, message, status (unread/read/replied/replied-sent), replyText, repliedAt |
| **GalleryItem** | Gallery photos | imageUrl, category (outreach/sports/graduation/campus/openday/general), caption |
| **AdmissionDocument** | Uploaded docs | type (national_id/transcript/passport_photo/etc.), dataUrl |
| **SiteSetting** | Key-value settings | key, value (e.g., tvet_form_url) |
| **Alumni** | Alumni records | name, email, graduationYear, programme, occupation, employer, district, biography |
| **GraduationItem** | Graduation media | imageUrl/videoUrl, ceremonyYear, category |
| **AuditLog** | Audit trail | userId, action, resource, details, ipAddress, userAgent |

---

## 6. PAGE ROUTING (Zustand SPA)

All navigation is client-side via `useAppStore().setCurrentPage(page)`. URL hash (`#page-name`) is used for direct links and back-button support.

```
Public pages (show Navigation):  home, about, programs, admissions, track-application,
  student-portal, student-login, online-learning, events, news, gallery,
  contact, alumni, graduation, enrolled-students, tvet-form

Full-width pages (no Navigation):  portal-key, staff-portal-8x7q, admin-login,
  admin-dashboard, alumni-register

Admin access: staff-portal-8x7q → PortalKeyGate → AdminLoginPage → AdminDashboard
  (portal key required via sessionStorage.sktim_portal_verified)
```

---

## 7. NAVIGATION BAR DETAILS

Two fixed bars at the top:
- **Primary**: `h-14 lg:h-16` (56/64px) — Logo, main nav links, mobile hamburger
- **Secondary**: `h-10 lg:h-11` (40/44px) — "About Us", "Portals" dropdown, "Apply Now" button

**Total nav height**: 96px mobile / 108px desktop

**Transparent mode**: When `currentPage === 'home'` AND not scrolled, nav is transparent with white text. **All hero content must start below `top-[100px] lg:top-[112px]`** and have dark backgrounds to keep nav text visible.

---

## 8. ADMIN PORTAL ACCESS

The admin portal is intentionally hidden for security:
1. Navigate to `#staff-portal-8x7q`
2. Enter the portal key (defined in `PortalKeyGate.tsx`)
3. Key verification is timing-safe (prevents timing attacks)
4. On success, `sessionStorage.sktim_portal_verified = 'true'` is set
5. Redirected to admin login page
6. After login, lands on admin dashboard

---

## 9. API AUTHENTICATION

**Middleware** (`src/middleware.ts`) intercepts all `/api/*` routes:
- **Public GET**: events, gallery, graduation, alumni, settings, auth/session
- **Public POST**: contact, admissions/tvet, admin (login), admin/reset-password*, alumni/register
- **Admin-only**: Everything else (requires valid JWT cookie `sktim_session` with role `super-admin` or `admissions-staff`)
- **Admin query override**: Public GET routes become admin-only when `?admin=true` is passed

---

## 10. HOW TO RUN LOCALLY

```bash
# Install dependencies
npm install  # or bun install

# Database is SQLite — no separate server needed
# The db/custom.db file contains all data

# Start dev server
npm run dev
# Opens at http://localhost:3000

# Note: Turbopack (default in Next.js 16) has issues with Prisma locally
# The production build works fine on Vercel
```

---

## 11. DEPLOYMENT

- **Platform**: Vercel
- **Auto-deploy**: On push to `main` branch
- **Build**: `next build` (standalone output)
- **Database**: SQLite file is bundled via `outputFileTracingIncludes` for `./db/**`
- **Environment**: Set `DATABASE_URL` and other env vars in Vercel dashboard

---

## 12. RECENT GIT HISTORY (CONTEXT)

```
b036b61  fix: Makerere-style hero with full-bleed event slides + gallery photo fallbacks  ← LATEST
b9c66c8  (auto-commit agent ID)
0313ec7  revert: restore original hero with rotating gallery photos + news ticker
16ea37a  fix: Makerere-style event slides with full-bleed photos + dark overlay
e42c31e  fix: redesign event slides with photos + fix nav offset + fix Read More
acaadcd  fix: hero crash (missing Calendar/Tag imports) + text underlay behind navbar
dde493e  feat: hero section redesign + TVET form z-index fix
234ef8c  feat: secure admin portal, fix password reset, hero news ticker, mobile fix
```

**Hero section history**: Multiple attempts were made to implement the Makerere-style hero. Each had issues (crashes, text under navbar, invisible nav text, no visual change). The latest (`b036b61`) is the most complete but needs visual verification.

---

## 13. WHAT THE USER WANTS NEXT

Based on conversation history, the user's remaining priorities are:

1. **Verify hero section** — Confirm the Makerere-style rotation works visually on the deployed site
2. **Add banner images to events** — Upload photos for the 6 events that lack `bannerUrl` so hero slides show relevant images
3. **Visual polish** — Any remaining UI/UX refinements
4. **Email credentials** — Set up Gmail SMTP for admin reply functionality
5. **Payment integration** — Configure SchoolPay if needed

---

## 14. IMPORTANT NOTES FOR NEXT SESSION

- The project uses a **SPA pattern inside Next.js** — don't try to use Next.js file-based routing for pages
- All page components are in `src/components/` and mapped in `src/app/page.tsx`
- The admin portal is **hidden** at route `staff-portal-8x7q` — this is intentional, not a bug
- Navigation has **two bars** totaling 96/108px — hero content must account for this
- When `currentPage === 'home'` and not scrolled, the nav is **transparent with white text** — hero backgrounds MUST be dark
- The database is SQLite — Prisma works in production but has Turbopack issues locally
- `AdminDashboard.tsx` is ~3800 lines — be careful when editing, always read the full context
- The `HeroNewsTicker.tsx` component still exists but is only used for its `HeroEventItem` type export
- Gallery images use native `<img>` tags (not Next.js `<Image>`) because some are base64 data URLs
- `line-clamp-*` Tailwind utilities are available (Tailwind CSS v4 built-in)
