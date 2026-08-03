import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import { AcademicYearController } from "../controllers/academic-year.controller.js";

const academicYearRoutes = new Hono();

const controller = new AcademicYearController();

academicYearRoutes.use("*", authMiddleware);

academicYearRoutes.post("/", authorize(["ADMIN"]), (c) => controller.create(c));
academicYearRoutes.get("/", authorize(["ADMIN"]), (c) => controller.findAll(c));
academicYearRoutes.get("/:id", authorize(["ADMIN"]), (c) => controller.findById(c));
academicYearRoutes.patch("/:id", authorize(["ADMIN"]), (c) => controller.update(c));
academicYearRoutes.patch("/:id/status", authorize(["ADMIN"]), (c) => controller.updateStatus(c));

export default academicYearRoutes;
