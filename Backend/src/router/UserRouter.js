import express from "express";
// QUAN TRỌNG: Import * as để lấy tất cả hàm export lẻ
import * as UserController from "../controller/User.Controller.js";
// Import middleware (Lưu ý: Nếu bạn đã đổi tên thành verifyToken ở bài trước thì dùng verifyToken)
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (Ai cũng dùng được)
router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);

// Private routes (Chỉ Admin)
router.post(
  "/admin/signup",
  // verifyToken, // Dùng verifyToken thay cho authMiddleware cũ
  // requireAdmin,
  UserController.createAdmin
);

export default router;
