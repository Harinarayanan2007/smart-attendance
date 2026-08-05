import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import { BatchController } from "../controllers/batch.controller.js";

const batchRoutes = new Hono();

const controller = new BatchController();

batchRoutes.use("*", authMiddleware);

batchRoutes.post("/", authorize(["ADMIN"]), (c) => controller.create(c));
batchRoutes.get("/", authorize(["ADMIN"]), (c) => controller.findAll(c));
batchRoutes.get("/options", authorize(["ADMIN"]), (c) => controller.getOptions(c));
batchRoutes.get("/:id", authorize(["ADMIN"]), (c) => controller.findById(c));
batchRoutes.patch("/:id", authorize(["ADMIN"]), (c) => controller.update(c));
batchRoutes.patch("/:id/status", authorize(["ADMIN"]), (c) => controller.updateStatus(c));
batchRoutes.delete("/:id", authorize(["ADMIN"]), (c) => controller.delete(c));

export default batchRoutes;
