import cron from "node-cron";
import { prisma } from "../config/db.js";
import { logger } from "../config/logger.js";
import { systemStateStore } from "../shared/core/systemStateStore.js";

export const initPageJobs = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const currentState = systemStateStore.get();
    if (!currentState || currentState.state !== "ACTIVE") return;

    try {
      const now = new Date();

      // Publish completely new pages that were scheduled
      const scheduledPages = await prisma.page.findMany({
        where: { 
           status: "SCHEDULED", 
           scheduledUpdateAt: { lte: now }
        }
      });

      for (const page of scheduledPages) {
        await prisma.page.update({
          where: { id: page.id },
          data: { 
            status: "PUBLISHED",
            publishedAt: now,
            scheduledUpdateAt: null 
          }
        });
      }

      if (scheduledPages.length > 0) {
        logger.info(`Page Publisher: Automatically published ${scheduledPages.length} new scheduled pages.`);
      }

      //  Apply scheduled updates to existing live pages
      const pendingUpdates = await prisma.page.findMany({
        where: { 
           status: "PUBLISHED", 
           scheduledUpdateAt: { lte: now }
        }
      });

      for (const page of pendingUpdates) {
        if (page.scheduledUpdateData) {
          const newData = page.scheduledUpdateData;
          
          await prisma.page.update({
            where: { id: page.id },
            data: {
              title: newData.title !== undefined ? newData.title : page.title,
              slug: newData.slug !== undefined ? newData.slug : page.slug,
              fullPath: newData.fullPath !== undefined ? newData.fullPath : page.fullPath,
              excerpt: newData.excerpt !== undefined ? newData.excerpt : page.excerpt,
              content: newData.content !== undefined ? newData.content : page.content,
              template: newData.template !== undefined ? newData.template : page.template,
              
              metaTitle: newData.metaTitle !== undefined ? newData.metaTitle : page.metaTitle,
              metaDescription: newData.metaDescription !== undefined ? newData.metaDescription : page.metaDescription,
              metaKeywords: newData.metaKeywords !== undefined ? newData.metaKeywords : page.metaKeywords,
              
              featuredImageId: newData.featuredImageId !== undefined ? newData.featuredImageId : page.featuredImageId,
              parentId: newData.parentId !== undefined ? newData.parentId : page.parentId,
              menuOrder: newData.menuOrder !== undefined ? newData.menuOrder : page.menuOrder,
              showInMenu: newData.showInMenu !== undefined ? newData.showInMenu : page.showInMenu,
              
              scheduledUpdateData: null,
              scheduledUpdateAt: null,
              updatedAt: new Date()
            }
          });

          await prisma.pageRevision.create({
            data: {
              pageId: page.id,
              snapshot: newData,
              actorId: page.updatedById || null
            }
          });
        } else {
          await prisma.page.update({
            where: { id: page.id },
            data: { scheduledUpdateAt: null }
          });
        }
      }

      if (pendingUpdates.length > 0) {
        logger.info(`Page Publisher: Applied scheduled updates to ${pendingUpdates.length} existing live pages.`);
      }

    } catch (err) {
      logger.error("Page Publisher Job Failed", err);
    }
  });
};