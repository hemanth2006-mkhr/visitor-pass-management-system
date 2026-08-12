import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  activateUser,
  deactivateUser,
  resetPassword,
  deleteUser,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.post("/users", createUser);

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.put("/users/:id", updateUser);

router.patch("/users/:id/activate", activateUser);

router.patch("/users/:id/deactivate", deactivateUser);

router.patch("/users/:id/reset-password", resetPassword);

router.delete("/users/:id", deleteUser);

export default router; 