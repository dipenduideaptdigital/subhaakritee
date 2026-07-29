import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanGarbageData() {
  console.log("Starting safe database cleanup...");
  
  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Delete tokens that have already expired
    const deletedRefresh = await prisma.refreshToken.deleteMany({ 
        where: { expiresAt: { lt: now } } 
    });
    console.log(`✓ Deleted ${deletedRefresh.count} expired refresh tokens.`);

    const deletedPreview = await prisma.pagePreviewToken.deleteMany({ 
        where: { expiresAt: { lt: now } } 
    });
    console.log(`✓ Deleted ${deletedPreview.count} expired page preview tokens.`);

    // Delete old CMS setting revisions (older than 30 days)
    const deletedSettingRevs = await prisma.settingRevision.deleteMany({ 
        where: { createdAt: { lt: thirtyDaysAgo } } 
    });
    console.log(`✓ Deleted ${deletedSettingRevs.count} old setting revisions.`);

    // Delete old page and blog revisions (older than 30 days)
    const deletedPageRevs = await prisma.pageRevision.deleteMany({ 
        where: { createdAt: { lt: thirtyDaysAgo } } 
    });
    console.log(`✓ Deleted ${deletedPageRevs.count} old page revisions.`);

    const deletedBlogRevs = await prisma.blogRevision.deleteMany({ 
        where: { createdAt: { lt: thirtyDaysAgo } } 
    });
    console.log(`✓ Deleted ${deletedBlogRevs.count} old blog revisions.`);

    // Delete old view logs (older than 30 days)
    const deletedViewLogs = await prisma.blogViewLog.deleteMany({ 
        where: { createdAt: { lt: thirtyDaysAgo } } 
    });
    console.log(`✓ Deleted ${deletedViewLogs.count} old blog view logs.`);

    console.log("Cleanup finished! Your active data and images are 100% safe.");

  } catch (error) {
    console.error("An error occurred during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanGarbageData();