import express from "express";
import * as controller from "../controller/binhluan.controller.js";
// import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js"; // Nếu bạn có bảo mật

const router = express.Router();

// Public
router.post("/add", controller.add);
router.get("/:MaSach", controller.getByBook);

// --- [ADMIN ROUTES] ---
// Thêm verifyToken, requireAdmin vào giữa nếu muốn bảo mật
router.get("/admin/all", controller.adminGetAll); 
router.put("/admin/status/:id", controller.adminUpdateStatus);
router.delete("/admin/delete/:id", controller.adminDelete);

export default router;