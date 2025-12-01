import express from "express";
import { thanhToan } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", thanhToan);

export default router;
