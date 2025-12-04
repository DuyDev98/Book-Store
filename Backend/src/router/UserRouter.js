import express from "express";
import UserController from "../controller/User.Controller.js";
import { authMiddleware, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guest + User + Admin (public)
router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);

// Chỉ Admin mới có quyền tạo admin
router.post(
  "/admin/signup",
  authMiddleware,
  requireAdmin,
  UserController.createAdmin
);

export default router;
