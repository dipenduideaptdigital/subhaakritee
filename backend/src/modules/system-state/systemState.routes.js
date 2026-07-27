import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { updateSystemStateSchema } from "./systemState.validation.js";
import * as controller from "./systemState.controller.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN"));

router.get("/", controller.getSystemStateController);

router.put(
  "/", 
  validate(updateSystemStateSchema, "body"), 
  controller.updateSystemStateController
);

export default router;