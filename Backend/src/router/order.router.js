import express from "express";
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  createOrder,
} from "../controller/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);

router.get("/:id", getOrderDetails);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/cancel", cancelOrder);

router.post("/create", createOrder);

export default router;
