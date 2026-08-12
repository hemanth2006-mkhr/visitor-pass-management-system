import express from "express";

import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware("admin"), getEmployees);

router.get("/:id", roleMiddleware("admin"), getEmployee);

router.post("/", roleMiddleware("admin"), createEmployee);

router.put("/:id", roleMiddleware("admin"), updateEmployee);

router.delete("/:id", roleMiddleware("admin"), deleteEmployee);

export default router;