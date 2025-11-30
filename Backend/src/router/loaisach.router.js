import express from "express";
import * as loaisachController from "../controller/loaisach.controller.js";  // Import controller của loại sách

const router = express.Router();

// Lấy tất cả loại sách
router.get("/", loaisachController.getAllCategories);

// Lấy loại sách theo ID
router.get("/:id", loaisachController.getCategoryById);

// Thêm loại sách mới
router.post("/", loaisachController.addCategory);

// Cập nhật loại sách theo ID
router.put("/:id", loaisachController.updateCategory);

// Xóa loại sách theo ID
router.delete("/:id", loaisachController.deleteCategory);

export default router;
