import cron from "node-cron";
import { prisma } from "../config/db.js";
import { logger } from "../config/logger.js";
import { systemStateStore } from "../shared/core/systemStateStore.js";

export const initSystemHousekeeping = () => {
  // Runs every day at 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    const currentState = systemStateStore.get();
    if (!currentState || currentState.state !== "ACTIVE") {
      logger.info("Housekeeping Job skipped: System is in Maintenance Mode.");
      return;
    }

    logger.info("Starting Daily System Housekeeping & Garbage Collection...");

    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Clean Refresh Tokens
      const tokenResult = await prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: now } },
            { revokedAt: { not: null, lt: thirtyDaysAgo } },
          ],
        },
      });

      //  Clean Preview Tokens (Pages & Blogs)
      const pagePreviewResult = await prisma.pagePreviewToken.deleteMany({
        where: { expiresAt: { lt: now } }
      });
      const blogPreviewResult = await prisma.blogPreviewToken.deleteMany({
        where: { expiresAt: { lt: now } }
      });

      //  Clean Heavy JSON Revisions (Older than 30 days)
      const pageRevResult = await prisma.pageRevision.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } }
      });
      const blogRevResult = await prisma.blogRevision.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } }
      });
      const settingRevResult = await prisma.settingRevision.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } }
      });

      //  Clean Analytics Logs (Older than 7 days)
      const viewLogResult = await prisma.blogViewLog.deleteMany({
        where: { createdAt: { lt: sevenDaysAgo } }
      });

      logger.info(`Housekeeping complete: 
        - ${tokenResult.count} refresh tokens cleared
        - ${pagePreviewResult.count + blogPreviewResult.count} preview tokens cleared
        - ${pageRevResult.count + blogRevResult.count + settingRevResult.count} heavy revisions archived
        - ${viewLogResult.count} footprint logs dropped.`);

    } catch (error) {
      logger.error("Daily Housekeeping Job encountered a critical failure:", error);
    }
  });
};