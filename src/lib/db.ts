import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs'
import path from 'path'

// ─── Database path resolution ─────────────────────────
// On Vercel serverless, the local DATABASE_URL won't work.
// We detect Vercel and fall back to /tmp with auto-schema creation.

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || '';

  // If we're on Vercel/serverless and the URL points to a local dev path
  if (
    process.env.NODE_ENV === 'production' &&
    (envUrl.includes('/home/') || envUrl.includes('/Users/') || !envUrl)
  ) {
    // Use /tmp on Vercel (only writable directory in serverless)
    const dbDir = '/tmp';
    const dbPath = path.join(dbDir, 'sktim.db');

    // Ensure the directory exists
    if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

    // If a seed database was bundled during build, copy it to /tmp
    const bundledDb = path.join(process.cwd(), 'db', 'custom.db');
    if (!existsSync(dbPath) && existsSync(bundledDb)) {
      try { copyFileSync(bundledDb, dbPath); } catch { /* ignore */ }
    }

    return `file:${dbPath}`;
  }

  return envUrl;
}

// Override DATABASE_URL before Prisma reads it
const resolvedUrl = resolveDatabaseUrl();
if (resolvedUrl !== (process.env.DATABASE_URL || '')) {
  process.env.DATABASE_URL = resolvedUrl;
}

// ─── Prisma Client singleton ────────────────────────────
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  initialized: boolean
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// ─── Auto-migrate on Vercel cold start ──────────────────
// On Vercel, /tmp is empty on each cold start.
// We try a simple query; if it fails, tables don't exist yet.
// We create them using raw SQL from the schema.
if (
  process.env.NODE_ENV === 'production' &&
  !globalForPrisma.initialized &&
  resolvedUrl.includes('/tmp/')
) {
  globalForPrisma.initialized = true;

  // Simple schema creation via raw SQL for all tables
  const SCHEMA_SQL = `
    CREATE TABLE IF NOT EXISTS "Admin" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'admin',
      "disabled" BOOLEAN NOT NULL DEFAULT 0,
      "lastLogin" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");

    CREATE TABLE IF NOT EXISTS "AdmissionApplication" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "referenceNumber" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "fullName" TEXT NOT NULL,
      "dob" TEXT,
      "gender" TEXT,
      "nationality" TEXT,
      "religion" TEXT,
      "nin" TEXT,
      "phone" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "district" TEXT,
      "address" TEXT,
      "nextOfKin" TEXT,
      "nextOfKinPhone" TEXT,
      "lastSchool" TEXT,
      "yearCompleted" TEXT,
      "qualification" TEXT,
      "institutionLevel" TEXT,
      "grades" TEXT,
      "programme" TEXT,
      "intakeYear" TEXT,
      "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
      "paymentRef" TEXT,
      "paymentAmount" REAL,
      "paymentMethod" TEXT,
      "paidAt" DATETIME,
      "schoolpayCode" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "AdmissionApplication_referenceNumber_key" ON "AdmissionApplication"("referenceNumber");

    CREATE TABLE IF NOT EXISTS "Student" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentNumber" TEXT NOT NULL,
      "applicationId" TEXT,
      "fullName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "password" TEXT,
      "programme" TEXT NOT NULL,
      "intakeYear" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'active',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Student_studentNumber_key" ON "Student"("studentNumber");
    CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");
    CREATE UNIQUE INDEX IF NOT EXISTS "Student_applicationId_key" ON "Student"("applicationId");

    CREATE TABLE IF NOT EXISTS "Payment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "transactionRef" TEXT NOT NULL,
      "applicationRef" TEXT,
      "studentNumber" TEXT,
      "fullName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "amount" REAL NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'UGX',
      "status" TEXT NOT NULL DEFAULT 'pending',
      "paymentMethod" TEXT NOT NULL DEFAULT 'schoolpay',
      "schoolpayTxRef" TEXT,
      "schoolpayStatus" TEXT,
      "metadata" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Payment_transactionRef_key" ON "Payment"("transactionRef");

    CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "category" TEXT NOT NULL DEFAULT 'general',
      "eventDate" TEXT,
      "eventTime" TEXT,
      "location" TEXT,
      "isBanner" BOOLEAN NOT NULL DEFAULT 0,
      "bannerUrl" TEXT,
      "attachmentUrl" TEXT,
      "attachmentName" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT,
      "subject" TEXT,
      "message" TEXT NOT NULL,
      "isRead" BOOLEAN NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "GalleryItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "imageUrl" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'general',
      "eventDate" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "AdmissionDocument" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "applicationId" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "fileUrl" TEXT NOT NULL,
      "fileSize" INTEGER NOT NULL,
      "documentType" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "SiteSetting" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key");

    CREATE TABLE IF NOT EXISTS "Alumni" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT,
      "graduationYear" TEXT,
      "programme" TEXT,
      "occupation" TEXT,
      "employer" TEXT,
      "district" TEXT,
      "biography" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "GraduationItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "itemType" TEXT NOT NULL DEFAULT 'photo',
      "mediaUrl" TEXT NOT NULL,
      "thumbnailUrl" TEXT,
      "ceremonyYear" TEXT NOT NULL,
      "ceremonyName" TEXT,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "isPublished" BOOLEAN NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "userRole" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "resource" TEXT,
      "resourceId" TEXT,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "result" TEXT NOT NULL DEFAULT 'success',
      "metadata" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
    CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
  `;

  // Check if tables exist, create if not
  db.$queryRawUnsafe('SELECT name FROM sqlite_master WHERE type=\'table\' LIMIT 1')
    .then(() => {
      // Tables exist
      console.log('[DB] Database tables found in /tmp.');
    })
    .catch(async () => {
      // No tables — create the schema
      console.log('[DB] No tables found. Creating schema in /tmp/sktim.db...');
      try {
        const statements = SCHEMA_SQL
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const sql of statements) {
          await db.$executeRawUnsafe(sql);
        }
        console.log('[DB] Schema created successfully in /tmp/sktim.db');
      } catch (err) {
        console.error('[DB] Schema creation failed:', err);
      }
    });
}
