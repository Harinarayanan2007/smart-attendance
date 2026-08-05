import { Hono } from "hono";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = new Hono();
const dashboardController = new DashboardController();

// Use authentication middleware for all dashboard routes
router.use("*", authMiddleware);

router.get("/summary", (c) => dashboardController.getSummary(c));

export default router;
