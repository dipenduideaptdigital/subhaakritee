import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import { findMediaById } from "../blogs/blogs.repository.js"; 
import isEqual from "lodash/isEqual.js";
import * as repo from "./pages.repository.js";

const MAX_HIERARCHY_DEPTH = 20;

const ensureUniqueSiblingSlug = async (parentId, baseSlug, excludeId = null) => {
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await repo.checkSiblingSlugExists(parentId, uniqueSlug, excludeId)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

const buildFullPath = async (parentId, slug) => {
  if (!parentId) return `/${slug}`;
  
  const parent = await repo.findPageById(parentId);
  if (!parent) throw new AppError("Parent page not found", StatusCodes.NOT_FOUND);
  
  const combined = `${parent.fullPath}/${slug}`;
  return combined.replace(/\/\//g, '/');
};

const cascadeFullPathUpdate = async (parentId, newParentFullPath, actorId) => {
  const children = await repo.findActiveChildrenByParentId(parentId);
  
  for (const child of children) {
    const newFullPath = `${newParentFullPath}/${child.slug}`.replace(/\/\//g, '/');
    
    if (child.publishedAt && newFullPath !== child.fullPath) {
      await repo.createPagePathHistory(child.id, child.fullPath).catch(() => {});
    }
    
    await repo.updatePageWithRevision(child.id, { fullPath: newFullPath, updatedById: actorId }, null, actorId);
    await cascadeFullPathUpdate(child.id, newFullPath, actorId);
  }
};

const validateFeaturedImageAssetMimeType = async (mediaId) => {
  if (!mediaId) return;
  const mediaNodeRecord = await findMediaById(mediaId);
  if (!mediaNodeRecord) {
    throw new AppError("The mapped featured image asset identifier is unavailable or has been removed from media caches.", StatusCodes.BAD_REQUEST);
  }
  if (!mediaNodeRecord.mimeType.startsWith("image/")) {
    throw new AppError("Security layout restriction: Asset format validation failure. Pages featured image assignment explicitly blocks non-image mime types files streams.", StatusCodes.BAD_REQUEST);
  }
};

const validateHierarchy = async (pageId, newParentId) => {
  if (!newParentId) return; 

  if (pageId === newParentId) {
    throw new AppError("A page cannot be its own parent.", StatusCodes.CONFLICT);
  }

  let currentParentId = newParentId;
  let depth = 0;
  const visited = new Set([pageId]);

  while (currentParentId) { 
    if (visited.has(currentParentId)) {
      throw new AppError("Circular dependency detected. You cannot nest a page inside its own descendant.", StatusCodes.CONFLICT);
    }
    
    if (depth >= MAX_HIERARCHY_DEPTH) {
      throw new AppError(`Maximum hierarchy depth of ${MAX_HIERARCHY_DEPTH} reached.`, StatusCodes.BAD_REQUEST);
    }

    visited.add(currentParentId);
    const parentPage = await repo.findPageById(currentParentId);
    currentParentId = parentPage?.parentId || null;
    depth++;
  }
};

const buildFullSnapshot = (page) => ({
  title: page.title,
  slug: page.slug,
  fullPath: page.fullPath,
  excerpt: page.excerpt,
  content: page.content,
  status: page.status,
  template: page.template,
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  metaKeywords: page.metaKeywords,
  featuredImageId: page.featuredImageId,
  parentId: page.parentId,
  menuOrder: page.menuOrder,
  showInMenu: page.showInMenu,
  includeInSitemap: page.includeInSitemap,
  noIndex: page.noIndex,
  noFollow: page.noFollow,
  canonicalUrl: page.canonicalUrl,
  ogTitle: page.ogTitle,
  ogDescription: page.ogDescription,
  ogImageId: page.ogImageId,
});

export const createNewPage = async (payload, authorId) => {
  await validateFeaturedImageAssetMimeType(payload.featuredImageId);
  
  if (payload.parentId) {
    const parentExists = await repo.findPageById(payload.parentId);
    if (!parentExists) throw new AppError("Parent page not found", StatusCodes.NOT_FOUND);
  }

  const baseSlug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.title);
  const finalSlug = await ensureUniqueSiblingSlug(payload.parentId, baseSlug);
  const finalFullPath = await buildFullPath(payload.parentId, finalSlug);

  if (await repo.checkFullPathExists(finalFullPath)) {
    throw new AppError(`The URL path ${finalFullPath} is already in use.`, StatusCodes.CONFLICT);
  }

  const publishedAt = payload.status === "PUBLISHED" ? new Date() : null;

  const pageData = {
    ...payload,
    slug: finalSlug,
    fullPath: finalFullPath,
    authorId,
    updatedById: authorId,
    publishedAt,
    scheduledUpdateAt: payload.scheduledUpdateAt ? new Date(payload.scheduledUpdateAt) : null,
  };

  try {
    const page = await repo.createPageWithRevision(pageData, authorId);
    return serializePage(page, "admin");
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('fullPath')) {
      throw new AppError("The URL path was just taken by another process. Please try again.", StatusCodes.CONFLICT);
    }
    throw error;
  }
};

export const updateExistingPage = async (id, payload, actorId) => {
  const existingPage = await repo.findPageById(id);
  if (!existingPage) throw new AppError("Page not found", StatusCodes.NOT_FOUND);

  if (payload.featuredImageId !== undefined) {
    await validateFeaturedImageAssetMimeType(payload.featuredImageId);
  }

  if (payload.parentId !== undefined) {
    await validateHierarchy(id, payload.parentId);
  }

  // ==== INTERCEPT SCHEDULED UPDATES FOR LIVE PAGES ====
  if (existingPage.status === "PUBLISHED" && payload.scheduledUpdateAt) {
    const futureData = { ...payload };
    delete futureData.scheduledUpdateAt;
    
    const updateData = {
      scheduledUpdateAt: new Date(payload.scheduledUpdateAt),
      scheduledUpdateData: futureData,
      updatedById: actorId
    };
    
    const updatedPage = await repo.updatePageWithRevision(id, updateData, null, actorId);
    return serializePage(updatedPage, "admin");
  }

  const updateData = { updatedById: actorId };
  const allowedFields = [
    "title", "excerpt", "content", "status", "template", 
    "metaTitle", "metaDescription", "metaKeywords", "featuredImageId",
    "parentId", "menuOrder", "showInMenu", "includeInSitemap", "noIndex",
    "noFollow", "canonicalUrl", "ogTitle", "ogDescription", "ogImageId",
    "scheduledUpdateAt"
  ];
  
  allowedFields.forEach(field => {
    if (payload[field] !== undefined) updateData[field] = payload[field];
  });

  if (payload.scheduledUpdateData === null || payload.scheduledUpdateAt === null) {
    updateData.scheduledUpdateData = null;
    updateData.scheduledUpdateAt = null;
  }

  const parentIdChanged = payload.parentId !== undefined && payload.parentId !== existingPage.parentId;
  const slugExplicitlyChanged = payload.slug !== undefined && payload.slug !== existingPage.slug;
  const titleChanged = payload.title !== undefined && payload.title !== existingPage.title && !existingPage.publishedAt;

  if (slugExplicitlyChanged || parentIdChanged || titleChanged) {
    const slugSource = payload.slug !== undefined ? payload.slug : (payload.title || existingPage.title);
    const targetParentId = payload.parentId !== undefined ? payload.parentId : existingPage.parentId;

    updateData.slug = await ensureUniqueSiblingSlug(targetParentId, generateSlug(slugSource), id);
    updateData.fullPath = await buildFullPath(targetParentId, updateData.slug);

    if (await repo.checkFullPathExists(updateData.fullPath, id)) {
      throw new AppError(`The URL path ${updateData.fullPath} is already in use.`, StatusCodes.CONFLICT);
    }
    
    if (existingPage.publishedAt && updateData.fullPath !== existingPage.fullPath) {
      await repo.createPagePathHistory(id, existingPage.fullPath).catch(() => {});
    }
  }

  if (payload.status === "PUBLISHED" && existingPage.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  } else if (existingPage.status === "PUBLISHED") {
    updateData.publishedAt = existingPage.publishedAt; 
  }

  const stateToCompare = { ...existingPage, ...updateData };
  const existingSnapshot = buildFullSnapshot(existingPage);
  const proposedSnapshot = buildFullSnapshot(stateToCompare);
  
  const newSnapshot = !isEqual(existingSnapshot, proposedSnapshot) ? proposedSnapshot : null;

  const updatedPage = await repo.updatePageWithRevision(id, updateData, newSnapshot, actorId);

  if (updateData.fullPath && updateData.fullPath !== existingPage.fullPath) {
    await cascadeFullPathUpdate(id, updateData.fullPath, actorId);
  }

  return serializePage(updatedPage, "admin");
};

export const duplicatePageDeep = async (originalId, actorId, newParentId = undefined, isRootCall = true) => {
  const original = await repo.findPageById(originalId);
  if (!original) throw new AppError("Original page not found", StatusCodes.NOT_FOUND);

  const targetParentId = newParentId !== undefined ? newParentId : original.parentId;
  const clonedTitle = isRootCall ? `${original.title} (Copy)` : original.title;
  
  const baseSlug = generateSlug(clonedTitle);
  const finalSlug = await ensureUniqueSiblingSlug(targetParentId, baseSlug);
  const finalFullPath = await buildFullPath(targetParentId, finalSlug);

  const pageData = {
    title: clonedTitle,
    slug: finalSlug,
    fullPath: finalFullPath,
    excerpt: original.excerpt,
    content: structuredClone(original.content),
    status: "DRAFT",
    template: original.template,
    metaTitle: original.metaTitle,
    metaDescription: original.metaDescription,
    metaKeywords: original.metaKeywords,
    featuredImageId: original.featuredImageId,
    parentId: targetParentId,
    menuOrder: original.menuOrder,
    showInMenu: original.showInMenu,
    includeInSitemap: original.includeInSitemap,
    noIndex: original.noIndex,
    noFollow: original.noFollow,
    canonicalUrl: original.canonicalUrl,
    ogTitle: original.ogTitle,
    ogDescription: original.ogDescription,
    ogImageId: original.ogImageId,
    authorId: actorId,
    updatedById: actorId,
    publishedAt: null,
  };

  const newPage = await repo.createPageWithRevision(pageData, actorId);

  const children = await repo.findActiveChildrenByParentId(originalId);
  if (children.length > 0) {
    await Promise.all(
      children.map(child => duplicatePageDeep(child.id, actorId, newPage.id, false))
    );
  }

  return isRootCall ? serializePage(newPage, "admin") : newPage;
};

export const duplicatePage = async (originalId, actorId) => {
  return await duplicatePageDeep(originalId, actorId);
};

export const deletePage = async (id, actorId) => {
  const page = await repo.findPageById(id);
  if (!page) throw new AppError("Page not found", StatusCodes.NOT_FOUND);

  const hasChildren = await repo.hasActiveChildren(id);
  if (hasChildren) {
    throw new AppError(
      "Cannot delete this page because it has active child pages. Please delete or reassign the children first.", 
      StatusCodes.CONFLICT
    );
  }

  return await repo.softDeletePage(page, actorId); 
};

export const getPagesList = async (query) => {
  const { page, limit, ...filters } = query;
  const skip = (page - 1) * limit;
  const { pages, total } = await repo.findPagesList({ skip, take: limit, ...filters });
  
  return {
    data: pages.map(p => serializePage(p, "admin")),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const getAdminPageTree = async () => {
  return await repo.buildPageTree(false, false); 
};

export const getPublicMenuTree = async () => {
  return await repo.buildPageTree(true, true); 
};

export const getPublicPageByPath = async (fullPath) => {
  const formattedPath = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
  const page = await repo.findPageByFullPath(formattedPath);
  
  if (!page || page.status !== "PUBLISHED") {
    throw new AppError("Page not found", StatusCodes.NOT_FOUND);
  }

  const breadcrumbs = await repo.getPageBreadcrumbs(page.id);
  return { 
    ...serializePage(page, "public"), 
    breadcrumbs 
  };
};

export const getPageRevisionsList = async (pageId) => {
  const existingPage = await repo.findPageById(pageId);
  if (!existingPage) throw new AppError("Target component engine context invalid", StatusCodes.NOT_FOUND);
  return await repo.findPageRevisionHistory(pageId);
};

export const getSinglePageRevision = async (pageId, revisionId) => {
  const revision = await repo.findPageRevisionById(pageId, revisionId);
  if (!revision) throw new AppError("Targeted archival system revision log mismatch", StatusCodes.NOT_FOUND);
  return revision;
};

export const restorePageToRevision = async (pageId, revisionId, actorId) => {
  const existingPage = await repo.findPageById(pageId);
  if (!existingPage) throw new AppError("Living system data engine targeted contextual reference missing", StatusCodes.NOT_FOUND);

  const historicRevision = await repo.findPageRevisionById(pageId, revisionId);
  if (!historicRevision) throw new AppError("Requested processing change checkpoint parameters validation failed", StatusCodes.NOT_FOUND);

  const snapshotToRestore = historicRevision.snapshot;

  if (snapshotToRestore.fullPath !== existingPage.fullPath) {
    const isPathTaken = await repo.checkFullPathExists(snapshotToRestore.fullPath, pageId);
    if (isPathTaken) {
      throw new AppError(
        `Restoration aborted: The architectural path structure '${snapshotToRestore.fullPath}' was claimed by another active process.`, 
        StatusCodes.CONFLICT
      );
    }
  }

  const restoredPage = await repo.restorePageContentSnapshot(pageId, snapshotToRestore, actorId);

  if (snapshotToRestore.fullPath !== existingPage.fullPath) {
    await cascadeFullPathUpdate(pageId, snapshotToRestore.fullPath, actorId);
  }

  return serializePage(restoredPage, "admin");
};