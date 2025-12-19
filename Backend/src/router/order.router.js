import express from "express";
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  createOrder,
  getTopSelling, // <-- Đừng quên import hàm này
} from "../controller/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);

// --- QUAN TRỌNG: Phải đặt dòng này LÊN TRÊN dòng /:id ---
router.get("/best-sellers", getTopSelling);
// --------------------------------------------------------

// Dòng này phải nằm dưới cùng các route GET cụ thể
router.get("/:id", getOrderDetails);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/cancel", cancelOrder);

router.post("/create", createOrder);

export default router;
