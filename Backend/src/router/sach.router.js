import express from "express";
import multer from "multer";
import * as sachController from "../controller/sach.controller.js"; // Chú ý: controller không có s

// 1. Import Cloudinary
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// CẤU HÌNH CLOUDINARY (Điền trực tiếp để đảm bảo chạy 100%)
cloudinary.config({
  cloud_name: 'df6ldpzpg',
  api_key: '588462826351327',
  api_secret: 'tx7DQe-mmCQZzhUZL4B8elws_K4'
});

// 3. Cấu hình Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookstore_anh_bia",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// --- ĐỊNH NGHĨA ROUTE ---

router.get("/", sachController.getAll);
router.get("/:id", sachController.getById);

// QUAN TRỌNG: Thêm upload.single('AnhBia') vào đây
router.post("/", upload.single("AnhBia"), sachController.create);
router.put("/:id", upload.single("AnhBia"), sachController.update);
router.get("/related/:id", sachController.getRelated);
router.delete("/:id", sachController.remove);
router.put("/:id/nhap-hang", sachController.nhapHang);
router.get("/thong-ke/sap-het-hang", sachController.getLowStockStats);
router.get("/thong-ke/bieu-do", sachController.getDashboardCharts);

export default router;
