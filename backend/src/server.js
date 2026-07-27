import { prisma } from "./config/db.js";
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { systemStateStore } from "./shared/core/systemStateStore.js";

// all jobs
import { cleanupExpiredTokens } from "./jobs/cleanupExpiredTokens.job.js";
import { initPreviewCleanupJob } from "./jobs/cleanupPreviewTokens.job.js";
import { initBlogJobs } from "./jobs/blogs.job.js";

const server = http.createServer(app);

// Timeouts
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.timeout = 30000;

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    logger.info("Connecting to database...");
    await prisma.$connect();
    logger.info("Database connected successfully.");
    logger.info("Initializing System State Engine...");
    await systemStateStore.initialize();
    logger.info("Starting background jobs...");
    cleanupExpiredTokens();
    initPreviewCleanupJob();
    initBlogJobs();
    logger.info("Background jobs initialized.");

    server.listen(PORT, () => {
      logger.info(
        `Server started in ${env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error("Failed to start server.", error);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  logger.warn(`${signal} received. Starting graceful shutdown...`);

  const shutdownTimeout = setTimeout(() => {
    logger.error("Graceful shutdown timed out. Force exiting.");
    process.exit(1);
  }, 10000);

  server.close(async (err) => {
    if (err) {
      logger.error("Failed to close HTTP server.", err);
      clearTimeout(shutdownTimeout);
      process.exit(1);
    }

    try {
      logger.info("Disconnecting database...");
      await prisma.$disconnect();

      clearTimeout(shutdownTimeout);

      logger.info("Shutdown completed successfully.");
      process.exit(0);
    } catch (error) {
      logger.error("Failed to disconnect database.", error);

      clearTimeout(shutdownTimeout);
      process.exit(1);
    }
  });
};

// shutdown signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Fatal runtime errors
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception.", error);
  process.exit(1);
});

// Promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error(
    {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    },
    "Unhandled promise rejection."
  );
});