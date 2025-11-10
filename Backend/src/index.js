import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sachRouter from "./router/sach.router.js"; // route sách
import { getPool } from "./config/db.js"; // kết nối SQL
import bodyParser from "body-parser";
import UserRouter from "./router/UserRouter.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Lấy đường dẫn tuyệt đối để dùng cho static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "./public")));

// API backend
app.use("/api/user", UserRouter);
app.use("/api/sach", sachRouter);

// Catch-all cho frontend (nếu người dùng reload trang)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  4;
});
// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  try {
    await getPool(); // Kiểm tra kết nối MySQL
    console.log(`✅ Server chạy tại http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Kết nối DB thất bại:", error);
  }
});
