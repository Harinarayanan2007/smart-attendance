import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import { DepartmentController } from "../controllers/department.controller.js";

const departmentRoutes = new Hono();

const controller = new DepartmentController();

// All department routes require authentication
departmentRoutes.use("*", authMiddleware);

// Create Department (Admin only)
departmentRoutes.post(
  "/",
  authorize(["ADMIN"]),
  (c) => controller.create(c),
);

// Get All Departments
departmentRoutes.get(
  "/",
  (c) => controller.findAll(c),
);

// Get Department By ID
departmentRoutes.get(
  "/:id",
  (c) => controller.findById(c),
);

// Update Department (Admin only)
departmentRoutes.patch(
  "/:id",
  authorize(["ADMIN"]),
  (c) => controller.update(c),
);

// Activate / Deactivate Department (Admin only)
departmentRoutes.patch(
  "/:id/status",
  authorize(["ADMIN"]),
  (c) => controller.updateStatus(c),
);

export default departmentRoutes;
