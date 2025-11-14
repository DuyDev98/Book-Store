import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import khRouter from "./router/khachhang.router.js";
import bodyParser from "body-parser";


// Routers

import danhmucRouter from "./router/danhmuc.router.js";
import sachRouter from "./router/sach.router.js";
import UserRouter from "./router/UserRouter.js";
import cartRouter from "./router/cart.router.js";
import cartDetailRouter from "./router/cartDetail.router.js";

// Database
import { getPool } from "./config/db.js";

// --- Cấu hình môi trường ---
dotenv.config();

// --- Khởi tạo app ---
const app = express();

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// --- Thiết lập đường dẫn tuyệt đối ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Public folder (chứa file tĩnh frontend) ---
app.use(express.static(path.join(__dirname, "public")));

// --- API routes ---
app.use("/api/danhmuc", danhmucRouter);
app.use("/api/sach", sachRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", UserRouter);
app.use("/api/cart-detail", cartDetailRouter);
app.use("/api/khachhang", khRouter);

// --- Route mặc định (trang chủ) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Catch-all route (cho các route frontend như /about, /product/1, ...) ---
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Khởi động server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  try {
    await getPool();
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Lỗi kết nối Database:", error);
  }
});
