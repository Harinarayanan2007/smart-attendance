import { Hono } from "hono";

import { authMiddleware } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/authorize.middleware.js";

import { UserController } from "../controller/user.controller.js";

const userRoutes = new Hono();

const userController = new UserController();

// Create User
userRoutes.post(
    "/",
    authMiddleware,
    authorize(["ADMIN"]),
    (c) => userController.create(c),
);

// Get All Users
userRoutes.get(
    "/",
    authMiddleware,
    authorize(["ADMIN", "HOD"]),
    (c) => userController.getAll(c),
);

// Get User By ID
userRoutes.get(
    "/:id",
    authMiddleware,
    authorize(["ADMIN", "HOD"]),
    (c) => userController.getById(c),
);

userRoutes.patch(
  "/:id/role",
  authMiddleware,
  authorize(["ADMIN"]),
  (c) => userController.updateRole(c),
);

userRoutes.patch(
    "/:id/status",
    authMiddleware,
    authorize(["ADMIN"]),
    (c) => userController.updateStatus(c),
);
export default userRoutes;
