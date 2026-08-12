import express from "express";

import {
  getAdminDashboard,
  getReceptionistDashboard,
  getEmployeeDashboard,
} from "../controllers/dashboard.controller.js";


import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/admin",
  roleMiddleware("admin"),
  getAdminDashboard
);

router.get(
  "/receptionist",
  roleMiddleware("receptionist"),
  getReceptionistDashboard
);

router.get(
  "/employee",
  roleMiddleware("employee"),
  getEmployeeDashboard
);

export default router;