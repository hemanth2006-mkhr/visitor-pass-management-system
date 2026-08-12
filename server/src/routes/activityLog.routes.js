import express from "express";

import {
  getActivityLogs,
} from "../controllers/activityLog.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware("admin"),
  getActivityLogs
);

export default router;