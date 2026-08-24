---
Task ID: 1
Agent: Main Agent
Task: Update forms, anthem, admission letter, TVET form, admin applications grouping, admin login fix

Work Log:
- Read uploaded files (Institute Anthem.docx, Application Form Non Formal.docx, TVET-application-form-2026.pdf)
- Fixed admin login underlay: set showNav:false for admin-login page in page.tsx
- Updated anthem in AboutPage.tsx with the actual 3-verse anthem from the uploaded docx
- Created comprehensive TVET online form (TvetApplicationForm.tsx) matching the Ministry PDF structure
- Created TVET API endpoint (api/admissions/tvet/route.ts)
- Created admission letter generation API (api/admissions/generate-letter/route.ts) + shared utility (lib/admission-letter.ts)
- Created email dispatch API (api/admissions/send-letter/route.ts)
- Added Send Admission Letter button in admin dashboard (auto-triggers on approval)
- Removed admission letter download from applicant-facing AdmissionsPage step 5
- Redesigned admin ApplicationsSection with tabbed grouping (All/Pending/Approved/Enrolled/Rejected)
- Added tvet-form page type to store and page.tsx
- Build passes with zero errors

Stage Summary:
- Admin login no longer shows navigation underneath
- Anthem updated with actual text from uploaded document
- TVET form created with 5 steps matching PDF structure (1319 lines)
- Admission letter generation and email dispatch APIs created
- Letter only generated/sent from admin portal, removed from applicant flow
- Admin applications now grouped by status tabs with counts
---
Task ID: 2
Agent: Main Agent
Task: Hero fix, tracking fix, TVET passport photo, admin download forms, news page, password reset

Work Log:
- Fixed hero section: increased image opacity from 0.25 to 0.55, reduced overlay gradient
- Added text shadow to hero heading for readability
- Made application tracking more robust (case-insensitive SKT- prefix, better error handling)
- Updated tracking search placeholder to include email option
- Subagent: Added passport photo upload to TVET form (circular camera icon, drag-drop, 1.5MB limit)
- Subagent: Added 'Download Filled Form' button in admin applicant view and expanded view
- Subagent: Added TVET download/online fill quick action buttons in admin ApplicationsSection
- Subagent: Created NewsPage component with featured events, news grid, gallery section
- Subagent: Added 'news' to Page type, page.tsx, and Navigation
- Subagent: Created password reset API (request + confirm endpoints)
- Subagent: Added forgot password flow to AdminLoginPage with animated transitions

Stage Summary:
- Hero images now clearly visible with reduced dark overlay
- Application tracking works with reference, phone, or email
- TVET form supports passport photo upload with preview
- Admin can download filled application forms as HTML
- News page accessible from navigation with event photos and read more
- Password reset flow available on admin login
- Build passes with zero errors
