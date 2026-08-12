import express from "express";

import {
  registerVisitor,
  getVisitors,
  getVisitor,
  getPendingRequests,
  approveVisitor,
  rejectVisitor,
  checkInVisitor,
  checkOutVisitor,
  cancelVisitor,
} from "../controllers/visitor.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleMiddleware("receptionist"), registerVisitor);

router.get(
  "/requests/pending",
  roleMiddleware("employee"),
  getPendingRequests
);

router.get(
  "/",
  roleMiddleware("admin", "receptionist"),
  getVisitors
);

router.get(
  "/:id",
  roleMiddleware("admin", "receptionist", "employee"),
  getVisitor
);

router.patch(
  "/:id/approve",
  roleMiddleware("employee"),
  approveVisitor
);

router.patch(
  "/:id/reject",
  roleMiddleware("employee"),
  rejectVisitor
);

router.patch(
  "/:id/check-in",
  roleMiddleware("receptionist"),
  checkInVisitor
);

router.patch(
  "/:id/check-out",
  roleMiddleware("receptionist"),
  checkOutVisitor
);

router.patch(
  "/:id/cancel",
  roleMiddleware("receptionist"),
  cancelVisitor
);


export default router;