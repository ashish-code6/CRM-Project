import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendTestEmail } from "../controllers/email.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/test", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), sendTestEmail);

export default router;
