import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ĐÚNG VỚI CẤU TRÚC CỦA BẠN
const adminPath = path.join(__dirname, "../public/categories/admin");

// Hàm gửi file HTML
const sendPage = (res, fileName) => {
    res.sendFile(path.join(adminPath, fileName));
};

// Dashboard
router.get("/dashboard", (req, res) => sendPage(res, "dashboard.html"));

// Quản lý sách
router.get("/sach", (req, res) => sendPage(res, "quan_li_sach.html"));

// Quản lý loại sách
router.get("/loai-sach", (req, res) => sendPage(res, "quan_li_loai_sach.html"));

// Quản lý NXB
router.get("/nxb", (req, res) => sendPage(res, "quan_li_nxb.html"));

// Quản lý đơn hàng
router.get("/don-hang", (req, res) => sendPage(res, "quan_li_don_hang.html"));

// Quản lý hội viên
router.get("/hoi-vien", (req, res) => sendPage(res, "quan_li_binh_luan.html"));

// Quản lý bình luận
router.get("/binh-luan", (req, res) => sendPage(res, "quan_li_binh_luan.html"));

// Quản lý phản hồi
router.get("/phan-hoi", (req, res) => sendPage(res, "quan_li_phan_hoi.html"));

export default router;
