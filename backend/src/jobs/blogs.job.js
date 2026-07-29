import cron from "node-cron";
import { publishScheduledBlogs } from "../modules/blogs/blogs.repository.js";
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
};