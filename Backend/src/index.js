import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

// Load env
dotenv.config();

// Convert __dirname for ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routers
import danhmucRouter from "./router/danhmuc.router.js";
import sachRouter from "./router/sach.router.js";
import cartRouter from "./router/cart.router.js";
import UserRouter from "./router/UserRouter.js";
import cartDetailRouter from "./router/cartDetail.router.js";
import khRouter from "./router/khachhang.router.js";
import loaisachRouter from "./router/loaisach.router.js";
import adminRouter from "./router/admin.router.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ==============================
//           API ROUTES
// ==============================
app.use("/api/danhmuc", danhmucRouter);
app.use("/api/sach", sachRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", UserRouter);
app.use("/api/cart-detail", cartDetailRouter);
app.use("/api/khachhang", khRouter);
app.use("/api/loaisach", loaisachRouter);

// ==============================
//          ADMIN ROUTES
// ==============================
app.use("/admin", adminRouter);

// ==============================
//      FRONTEND DEFAULT PAGE
// ==============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==============================
//       CATCH-ALL FALLBACK
//  (đặt cuối để KHÔNG nuốt admin)
// ==============================
// Fallback cho frontend (KHÔNG dùng "*" nữa)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ==============================
//          START SERVER
// ==============================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
