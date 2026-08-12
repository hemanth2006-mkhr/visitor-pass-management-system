import express from "express";

import {
  getVisitorReports,
} from "../controllers/report.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/visitors",
  roleMiddleware("admin", "receptionist"),
  getVisitorReports
);

export default router;