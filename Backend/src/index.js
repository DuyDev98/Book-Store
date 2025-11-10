import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import danhmucRouter from "./router/danhmuc.router.js";
import sachRouter from "./router/sach.router.js";
import { getPool } from "./config/db.js";
import cartRouter from "./router/cart.router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use("/api/danhmuc", danhmucRouter);
app.use("/api/sach", sachRouter);

// --- Serve frontend static (public folder) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Trỏ đến thư mục public trong src
app.use(express.static(path.join(__dirname, "public")));

// --- Route mặc định: gửi index.html ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/cart", cartRouter);

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
