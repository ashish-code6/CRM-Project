import express from "express";
import { createUser, deleteUser, getUsers, loginUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), getUsers);
router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), createUser);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteUser);

export default router;
