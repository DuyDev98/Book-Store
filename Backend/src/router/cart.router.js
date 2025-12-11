import express from "express";
import { CartController } from "../controller/cart.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Bắt buộc đăng nhập cho mọi thao tác giỏ hàng
router.post("/add", verifyToken, CartController.addToCart);
router.post("/update", verifyToken, CartController.updateItem);
router.post("/remove", verifyToken, CartController.removeItem);
router.get("/:MaKH", verifyToken, CartController.get); // Frontend vẫn gọi link cũ nên giữ :MaKH nhưng Controller sẽ dùng Token

export default router;