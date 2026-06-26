import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendTestEmail } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/test", authMiddleware, sendTestEmail);

export default router;