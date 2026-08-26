-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdmissionApplication" (
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
    "programme" TEXT,
    "intakeYear" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentRef" TEXT,
    "paymentAmount" REAL,
    "paymentMethod" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "grades" TEXT,
    "institutionLevel" TEXT,
    "schoolpayCode" TEXT
);

-- CreateTable
CREATE TABLE "AdmissionDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("applicationId") REFERENCES "AdmissionApplication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alumni" (
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
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
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

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'unread',
    "replyText" TEXT,
    "repliedAt" DATETIME,
    "repliedBy" TEXT,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "eventDate" TEXT,
    "eventTime" TEXT,
    "location" TEXT,
    "isBanner" BOOLEAN NOT NULL DEFAULT false,
    "bannerUrl" TEXT,
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "eventDate" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GraduationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "itemType" TEXT NOT NULL DEFAULT 'photo',
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "ceremonyYear" TEXT NOT NULL,
    "ceremonyName" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
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

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentNumber" TEXT NOT NULL,
    "applicationId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "intakeYear" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "password" TEXT,
    FOREIGN KEY ("applicationId") REFERENCES "AdmissionApplication" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionApplication_referenceNumber_key" ON "AdmissionApplication"("referenceNumber" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionRef_key" ON "Payment"("transactionRef" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Student_applicationId_key" ON "Student"("applicationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber" ASC);

