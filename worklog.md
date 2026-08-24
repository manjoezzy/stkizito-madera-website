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
