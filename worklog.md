# Work Log

---
Task ID: 1
Agent: Super Z (main)
Task: Fix admin login 500 error + Fix login card centering + Alumni registration feature

Work Log:
- Analyzed screenshot showing "Server error. Please try again." on login
- Verified getSessionCookieName() exists in auth.ts, bcrypt-ts works locally, DB has admin record
- Tested locally: login returns proper 401/400 (not 500) — issue is Vercel-specific
- Added granular try/catch in login flow (DB lookup, bcrypt, JWT) with debug prefixes
- Added request.json() parsing in its own try/catch block
- Fixed login card positioning: replaced `fixed inset-0` with `min-h-screen w-full flex items-center justify-center`
- Created /api/alumni/register (public POST endpoint) for alumni self-registration
- Created /api/alumni/export (admin GET endpoint) with xlsx and pdfkit for Excel/PDF export
- Created AlumniRegisterPage.tsx — full registration form with validation and success screen
- Updated useAppStore.ts — added 'alumni-register' page type
- Updated page.tsx — added AlumniRegisterPage import, component mapping, and page config
- Updated AlumniPage.tsx — CTA now navigates to 'alumni-register' instead of 'contact'
- Updated middleware.ts — whitelisted /api/alumni/register (public) and /api/alumni/export (admin)
- Rewrote AdminAlumniSection.tsx — grouped by graduation year, collapsible year sections, export buttons (Excel + PDF), year filter, search
- Installed xlsx and pdfkit packages
- Restored /api/upload/route.ts that was accidentally deleted by git add -A
- All changes built and pushed to GitHub for Vercel auto-deploy

Stage Summary:
- Login: Added comprehensive debug error handling. User should now see specific error (e.g. "DB lookup: ..." or "Password check: ...") which will reveal the Vercel root cause
- Login card: Fixed centering by replacing `fixed` with `min-h-screen` flex
- Alumni registration: Full public form at /alumni-register with name, email, phone, graduation year, programme, occupation, employer, district, biography
- Admin alumni: Grouped by class year with collapsible sections, Excel/PDF export buttons, year filter dropdown
- API: /api/alumni/register (public POST), /api/alumni/export?format=xlsx|pdf (admin GET with year/programme filters)

---
Task ID: 2
Agent: Super Z (main)
Task: Fix 5 bugs: alumni registration Prisma error, gallery images not visible, TVET form upload state, download HTML->PDF, form delete buttons

Work Log:
- Fixed alumni registration 500: Changed `db.alumni.findUnique({ where: { email } })` to `db.alumni.findFirst({ where: { email } })` because email field is not @unique in schema
- Fixed gallery images not showing: Replaced Next.js `<Image>` with native `<img>` in GalleryPage.tsx (Next.js Image cannot render base64 data URLs returned by upload API)
- Fixed TVET form upload not updating UI: Added `currentTvetFormUrl` state, fetched `tvet_form_url` in useEffect, set state after successful upload, added "Current TVET form uploaded" status message
- Added delete function for both TVET and non-formal forms: `deleteFormSetting()` clears the setting value and updates UI state. Both form sections now show a red "Remove" button when a form is uploaded
- Fixed download filled form: Replaced HTML blob download with `downloadFormAsPdf()` that opens a print dialog (Save as PDF). Both download buttons (view dialog + expanded row) updated. Fallback to HTML if popup is blocked

Stage Summary:
- Alumni registration now works (findUnique -> findFirst)
- Gallery images now visible on public website (native img tag for data URLs)
- TVET form upload now shows status + updates properly
- Both forms have delete/remove buttons
- Download filled form opens print dialog for PDF save instead of downloading .html file
