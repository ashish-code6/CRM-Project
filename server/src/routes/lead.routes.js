import express from "express";
import {
  assignLead,
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/lead.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// router.post("/", authMiddleware, createLead);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createLead
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER", "SALES"),
  getLeads
);
router.get("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER", "SALES"), getLeadById);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER", "SALES"), updateLead);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteLead
);
// router.patch("/:leadId/assign", authMiddleware, assignLead);
router.patch(
  "/:leadId/assign",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  assignLead
);

export default router;
