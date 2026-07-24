import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import usersAdminRoutes from "../modules/users/users.admin.routes.js";
import uploadsRoutes from "../modules/uploads/uploads.routes.js";
import cmsRoutes from "../modules/cms/cms.routes.js";
import pagesAdminRoutes from "../modules/pages/pages.admin.routes.js";
import pagesPublicRoutes from "../modules/pages/pages.public.routes.js";
import contactPublicRoutes from "../modules/contacts/contacts.public.routes.js";
import contactAdminRoutes from "../modules/contacts/contacts.admin.routes.js";
import contactFormsAdminRoutes from "../modules/contactForms/contactForms.admin.routes.js";
import previewAdminRoutes from "../modules/pages-preview/pages-preview.admin.routes.js";
import previewPublicRoutes from "../modules/pages-preview/pages-preview.public.routes.js";
import blogsAdminRoutes from "../modules/blogs/blogs.admin.routes.js";
import blogsPublicRoutes from "../modules/blogs/blogs.public.routes.js";
import seoRoutes from "../modules/seo/seo.routes.js";
import roleRoutes from "../modules/roles/roles.routes.js";
import projectAdminRoutes from "../modules/projects/projects.admin.routes.js";
import projectPublicRoutes from "../modules/projects/projects.public.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import systemStateRoutes from "../modules/system-state/systemState.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin/users", usersAdminRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/cms", cmsRoutes);
router.use("/pages", pagesPublicRoutes);
router.use("/admin/pages", pagesAdminRoutes);
router.use("/contacts", contactPublicRoutes);
router.use("/admin/contacts", contactAdminRoutes);
router.use("/admin/contact-forms", contactFormsAdminRoutes);
router.use("/admin/pages", previewAdminRoutes);
router.use("/preview", previewPublicRoutes);
router.use("/blogs", blogsPublicRoutes);
router.use("/admin/blogs", blogsAdminRoutes);
router.use("/", seoRoutes);
router.use("/admin/roles", roleRoutes);
router.use("/admin/projects", projectAdminRoutes);
router.use("/projects", projectPublicRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/system-state", systemStateRoutes);
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;