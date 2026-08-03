import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/authorize.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";

const authRoutes = new Hono();
const authController = new AuthController();

authRoutes.post("/login", (c) => authController.login(c));
authRoutes.post(
  "/refresh",
  (c) => authController.refresh(c),
);
authRoutes.get(
  "/me",
  authMiddleware,
  (c) => authController.me(c),
);
authRoutes.get(
  "/admin",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => authController.admin(c),
);

export default authRoutes;
