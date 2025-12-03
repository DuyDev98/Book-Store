import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath from url module
import dotenv from "dotenv";
import cors from "cors";
// Load environment variables from .env file
dotenv.config();

// Define __filename and __dirname for ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies

app.use(cors()); 
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve the home page (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin routes
import adminRouter from "./router/admin.router.js";
// Serve admin static files (allow direct requests to .html files)
app.use(
  "/admin",
  express.static(path.join(__dirname, "public", "categories", "admin"))
);

// Mount admin router for friendly routes (e.g. /admin/dashboard)
app.use("/admin", adminRouter);

app.use(express.json());
// Other API routes
import NXBRoute from "./router/nhaxuatban.router.js";
import danhmucRouter from "./router/danhmuc.router.js";
import sachRouter from "./router/sach.router.js";
import cartRouter from "./router/cart.router.js";
import cartDetailRouter from "./router/cartDetail.router.js";
import khRouter from "./router/khachhang.router.js";
import loaisachRouter from "./router/loaisach.router.js";
import userRouter from "./router/UserRouter.js";
import tacgiaRouter from "./router/tacgia.router.js";


// Use API routes
app.use("/api/user", userRouter);
app.use("/api/nxb", NXBRoute);
app.use("/api/danhmuc", danhmucRouter);
app.use("/api/sach", sachRouter);
app.use("/api/cart", cartRouter);
app.use("/api/cart-detail", cartDetailRouter);
app.use("/api/khachhang", khRouter);
app.use("/api/loaisach", loaisachRouter);
app.use("/api/user",userRouter); 
app.use("/api/tacgia", tacgiaRouter);

// Fallback route for unknown URLs
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
 