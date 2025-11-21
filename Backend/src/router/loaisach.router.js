// routers/loaisach.router.js
import express from 'express';
import * as loaisachController from '../controller/loaisach.controller.js';

const router = express.Router();

// API: Lấy tất cả loại sách
router.get("/", loaisachController.getCategories);

// API: Thêm loại sách
router.post("/", loaisachController.addCategory);

// API: Sửa loại sách
router.put("/", loaisachController.updateCategory);

// API: Xóa loại sách
router.delete("/:MaLoaiSach", loaisachController.deleteCategory);

export default router;
