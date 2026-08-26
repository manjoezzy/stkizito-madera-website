const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    await p.$executeRawUnsafe("ALTER TABLE ContactMessage ADD COLUMN updatedAt DATETIME");
    console.log('updatedAt added');
  } catch(e) {
    console.error('updatedAt:', e.message);
  }
  // Backfill: set updatedAt = createdAt where null
  await p.$executeRawUnsafe("UPDATE ContactMessage SET updatedAt = createdAt WHERE updatedAt IS NULL");
  console.log('backfill done');
  await p.$disconnect();
})();
