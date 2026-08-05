import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import { ProgramController } from "../controllers/program.controller.js";

const programRoutes = new Hono();

const controller = new ProgramController();

programRoutes.use("*", authMiddleware);

programRoutes.post("/", authorize(["ADMIN"]), (c) => controller.create(c));

programRoutes.get("/", authorize(["ADMIN"]), (c) => controller.findAll(c));

programRoutes.get("/options", authorize(["ADMIN"]), (c) => controller.getOptions(c));

programRoutes.get("/statistics", authorize(["ADMIN"]), (c) => controller.getStatistics(c));

programRoutes.get("/:id", authorize(["ADMIN"]), (c) => controller.findById(c));

programRoutes.patch("/:id", authorize(["ADMIN"]), (c) => controller.update(c));

programRoutes.patch("/:id/status", authorize(["ADMIN"]), (c) => controller.updateStatus(c));

programRoutes.delete("/:id", authorize(["ADMIN"]), (c) => controller.delete(c));

export default programRoutes;
