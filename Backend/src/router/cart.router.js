import express from "express";
import { CartController } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/create", CartController.create);
router.get("/:MaKH", CartController.get);

export default router;
