import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/authorize.middleware.js";
import { UserController } from "../controller/user.controller.js";

const userRoutes = new Hono();
const userController = new UserController();

// Must be before /:id to avoid matching 'statistics' as an ID
userRoutes.get(
  "/statistics",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.getStatistics(c),
);

userRoutes.get(
  "/options",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.getOptions(c),
);

userRoutes.post(
  "/",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.create(c),
);

userRoutes.get(
  "/",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.getAll(c),
);

userRoutes.get(
  "/:id",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.getById(c),
);

userRoutes.patch(
  "/:id",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.update(c),
);

userRoutes.patch(
  "/:id/status",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.updateStatus(c),
);

userRoutes.patch(
  "/:id/password",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.updatePassword(c),
);

userRoutes.patch(
  "/:id/admission-id",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.updateAdmissionId(c),
);

userRoutes.patch(
  "/:id/reset-password",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.resetPassword(c),
);

userRoutes.delete(
  "/:id",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.deleteUser(c),
);

export default userRoutes;
