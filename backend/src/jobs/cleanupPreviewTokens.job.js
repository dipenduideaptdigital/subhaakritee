import cron from "node-cron";
import { deleteExpiredTokens } from "../modules/pages-preview/pages-preview.repository.js";
import { logger } from "../config/logger.js";
import { systemStateStore } from "../shared/core/systemStateStore.js";

export const initPreviewCleanupJob = () => {
  cron.schedule("0 3 * * *", async () => {
    
    if (systemStateStore.get().state !== "ACTIVE") {
      logger.info("Preview Cleanup Job skipped: System is in Maintenance Mode.");
      return;
    }

    try {
      const result = await deleteExpiredTokens();
      logger.info(`Cleanup Job: Removed ${result.count} expired preview tokens.`);
    } catch (err) {
      logger.error("Cleanup Job Failed", err);
    }
  });
};