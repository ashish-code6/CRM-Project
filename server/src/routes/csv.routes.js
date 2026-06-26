import express from "express";
import { upload } from "../config/multer.js";
import { uploadCSV } from "../controllers/csv.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCSV
);

export default router;