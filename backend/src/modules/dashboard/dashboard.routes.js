import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { dashboardChartQuerySchema } from "./dashboard.validation.js";
import * as controller from "./dashboard.controller.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.get("/metrics", controller.getDashboardStatsController);

router.get(
  "/chart", 
  validate(dashboardChartQuerySchema, "query"), 
  controller.getDashboardChartController
);

router.get("/activity", controller.getDashboardActivityController);
router.get("/export-leads", controller.exportLeadsController);

export default router;