import express from "express";
import { upload } from "../config/multer.js";
import { uploadCSV } from "../controllers/csv.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  upload.single("file"),
  uploadCSV
);

export default router;
