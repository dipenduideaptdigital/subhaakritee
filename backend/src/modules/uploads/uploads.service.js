import crypto from "crypto";
import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../config/logger.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../shared/services/cloudinary.service.js";
import { processImageBuffer } from "../../shared/utils/imageProcessor.js";

export const saveUploadedFile = async (file, userId) => {
  if (!file || !file.buffer) {
    throw new AppError("No file buffer provided", StatusCodes.BAD_REQUEST);
  }

  const fileHash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const existingMedia = await prisma.media.findUnique({
    where: { fileHash }
  });

  if (existingMedia) {
    if (existingMedia.deletedAt) {
      await prisma.media.update({
        where: { id: existingMedia.id },
        data: { deletedAt: null }
      });
    }
    return existingMedia;
  }

  const processed = await processImageBuffer(file.buffer, file.originalname);
  
  let mainUpload;

  try {
    mainUpload = await uploadBufferToCloudinary(processed.mainBuffer, "main");

    const parts = mainUpload.secure_url.split('/upload/');
    const dynamicThumbUrl = `${parts[0]}/upload/c_fill,w_300,h_300,q_auto,f_auto/${parts[1]}`;

    // Save to Database
    const media = await prisma.media.create({
      data: {
        fileHash,
        filename: mainUpload.public_id,
        originalName: file.originalname,
        mimeType: processed.mimeType,
        size: processed.finalSize,
        url: mainUpload.secure_url,
        thumbnailUrl: dynamicThumbUrl,
        uploadedById: userId,
      },
    });

    return media;
  } catch (error) {
    if (mainUpload?.public_id) await deleteFromCloudinary(mainUpload.public_id);
    throw new AppError("Failed to save file metadata to Cloudinary or Database", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const saveMultipleFiles = async (files, userId) => {
  if (!files || files.length === 0) {
    throw new AppError("No files provided", StatusCodes.BAD_REQUEST);
  }

  const savedMedia = [];
  for (const file of files) {
    try {
      const media = await saveUploadedFile(file, userId);
      savedMedia.push(media);
    } catch (error) {
      logger.error(`Failed to process file ${file.originalname}`, error);
    }
  }
  return savedMedia;
};

export const getMediaList = async (query) => {
  const { page = 1, limit = 20, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { deletedAt: null };

  if (search && search.trim() !== "") {
    where.originalName = { 
      contains: search.trim() 
    };
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { name: true, email: true } }
      }
    }),
    prisma.media.count({ where })
  ]);

  return {
    media,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

export const getMediaById = async (id) => {
  const media = await prisma.media.findUnique({
    where: { id, deletedAt: null },
    include: { uploadedBy: { select: { name: true, email: true } } }
  });

  if (!media) throw new AppError("Media not found", StatusCodes.NOT_FOUND);
  return media;
};

export const deleteMediaItem = async (id) => {
  const media = await getMediaById(id);

  try {
    if (media.filename) {
      await deleteFromCloudinary(media.filename);
    }
  } catch (error) {
    logger.error(`Failed to delete media ${id} from Cloudinary. Proceeding to delete from DB.`, error);
  }
  
  await prisma.media.delete({ where: { id } });
  
  return { message: "Media deleted successfully" };
};