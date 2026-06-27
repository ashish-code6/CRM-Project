import express from "express";
import {
  createInvoice,
  deleteInvoice,
  downloadInvoicePdf,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "../controllers/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), createInvoice);
router.get("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), getInvoices);
router.get("/:id/pdf", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), downloadInvoicePdf);
router.get("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), getInvoiceById);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), updateInvoice);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteInvoice);

export default router;
