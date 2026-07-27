import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function recoverImages() {
  try {
    const result = await prisma.media.updateMany({
      where: {
        deletedAt: { not: null }
      },
      data: {
        deletedAt: null 
      }
    });
    console.log(`Successfully recovered ${result.count} images!`);
  } catch (error) {
    console.error("Failed to recover images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

recoverImages();