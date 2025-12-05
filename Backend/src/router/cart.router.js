import express from "express";
import { CartController } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/create", CartController.create);
router.post("/add", CartController.addToCart);     // Hàm này phải có trong Controller
router.post("/update", CartController.updateItem); // Hàm này phải có trong Controller
router.post("/remove", CartController.removeItem); // Hàm này phải có trong Controller
router.get("/:MaKH", CartController.get);

export default router;