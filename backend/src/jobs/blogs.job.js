import cron from "node-cron";
import { 
  deleteOldViewLogs, 
  deleteExpiredPreviewTokens, 
  publishScheduledBlogs 
} from "../modules/blogs/blogs.repository.js";
import { logger } from "../config/logger.js";
import { systemStateStore } from "../shared/core/systemStateStore.js";

export const initBlogJobs = () => {
  
  cron.schedule("* * * * *", async () => {
    const currentState = systemStateStore.get();
    if (!currentState || currentState.state !== "ACTIVE") {
      return; 
    }

    try {
      const result = await publishScheduledBlogs();
      if (result.count > 0) {
        logger.info(`Blog Publisher Job: Automatically activated ${result.count} scheduled blogs.`);
      }
    } catch (err) {
      logger.error("Blog Publisher Job Failed", err);
    }
  });

  cron.schedule("0 3 * * *", async () => {
    const currentState = systemStateStore.get();
    if (!currentState || currentState.state !== "ACTIVE") {
      return;
    }

    logger.info("Blog Housekeeping: Starting daily data pruning cycle...");
    try {
      const slidingRetentionThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 
      
      const logPruneResult = await deleteOldViewLogs(slidingRetentionThreshold);
      const tokenPruneResult = await deleteExpiredPreviewTokens();

      logger.info(`Blog Housekeeping: Dropped ${logPruneResult.count} old footprint view tracking logs.`);
      logger.info(`Blog Housekeeping: Cleared ${tokenPruneResult.count} expired authorization preview records.`);
    } catch (error) {
      logger.error("Blog Housekeeping: Automated records retention pruning faulted:", error);
    }
  });
};