import express from "express";
import { CartDetailController } from "../controller/cartDetail.controller.js";

const router = express.Router();

router.post("/add", CartDetailController.add);
router.post("/update", CartDetailController.update);
router.post("/remove", CartDetailController.remove);
router.get("/:MaGioHang", CartDetailController.get);

export default router;
