-- AlterTable
ALTER TABLE `pages` ADD COLUMN `scheduledUpdateAt` DATETIME(3) NULL,
    ADD COLUMN `scheduledUpdateData` JSON NULL,
    MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `projects` MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED') NOT NULL DEFAULT 'PUBLISHED';

-- CreateIndex
CREATE INDEX `pages_scheduledUpdateAt_idx` ON `pages`(`scheduledUpdateAt`);
