import express from "express";
import * as danhmucController from "../controller/danhmuc.controller.js";

const router = express.Router();

// Định nghĩa các route
router.get("/", danhmucController.getAll);           // Lấy hết
router.get("/:id", danhmucController.getById);       // Lấy 1 cái
router.post("/", danhmucController.create);          // Thêm mới
router.put("/:id", danhmucController.update);        // Sửa
router.delete("/:id", danhmucController.remove);     // Xóa

export default router;