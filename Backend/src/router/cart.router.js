// router/cart.router.js
import express from "express";
import { createCart, addToCart, getCart } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/", createCart);       // Tạo giỏ hàng
router.post("/add", addToCart);     // Thêm sách vào giỏ
router.get("/:id", getCart);        // Lấy giỏ hàng theo ID

export default router;
