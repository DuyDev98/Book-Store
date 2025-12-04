import express from "express";
import multer from "multer";
import * as sachController from "../controller/sach.controller.js"; // Chú ý: controller không có s

// 1. Import Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 2. CẤU HÌNH CLOUDINARY (Lấy từ .env)
cloudinary.config({
    cloud_name: 'dleqaxjuv', // Tên cloud của bạn
    api_key: process.env.API_KEY,       // Sửa thành API_KEY cho khớp file .env
    api_secret: process.env.API_SECRET  // Sửa thành API_SECRET cho khớp file .env
});

// 3. Cấu hình Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bookstore_anh_bia',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

// --- ĐỊNH NGHĨA ROUTE ---

router.get("/", sachController.getAll);
router.get("/:id", sachController.getById);

// QUAN TRỌNG: Thêm upload.single('AnhBia') vào đây
router.post("/", upload.single('AnhBia'), sachController.create);
router.put("/:id", upload.single('AnhBia'), sachController.update);

router.delete("/:id", sachController.remove);
router.put("/:id/nhap-hang", sachController.nhapHang);

export default router;