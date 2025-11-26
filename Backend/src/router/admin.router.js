import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Lấy __dirname cho ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đảm bảo đường dẫn chính xác tới thư mục admin
const adminPath = path.join(__dirname, "../public/categories/admin");

// Hàm gửi file HTML
const sendPage = (res, fileName) => {
  res.sendFile(path.join(adminPath, fileName), (err) => {
    if (err) {
      console.error("Lỗi gửi tệp: ", err);
      res.status(500).send("Không thể tải trang.");
    }
  });
};

// Các route cho trang admin
router.get("/dashboard", (req, res) => sendPage(res, "dashboard.html"));
router.get("/quan-li-sach", (req, res) => sendPage(res, "quan_li_sach.html"));
router.get("/quan-li-loai-sach", (req, res) => sendPage(res, "quan_li_loai_sach.html"));
router.get("/quan-li-nxb", (req, res) => sendPage(res, "quan_li_nxb.html"));
router.get("/quan-li-don-hang", (req, res) => sendPage(res, "quan_li_don_hang.html"));
router.get("/quan-li-binh-luan", (req, res) => sendPage(res, "quan_li_binh_luan.html"));
router.get("/quan-li-phan-hoi", (req, res) => sendPage(res, "quan_li_phan_hoi.html"));

export default router;
