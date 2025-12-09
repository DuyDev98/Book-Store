import express from "express";
import { BinhLuanController } from "../controller/binhluan.controller.js";

const router = express.Router();

router.post("/add", BinhLuanController.add);       // API thêm bình luận
router.get("/:MaSach", BinhLuanController.getByBook); // API lấy bình luận

export default router;