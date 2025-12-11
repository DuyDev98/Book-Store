import express from "express";
import * as binhLuanController from "../controller/binhluan.controller.js";

const router = express.Router();

// POST: /api/binhluan/add
router.post("/add", binhLuanController.add);

// GET: /api/binhluan/:MaSach
router.get("/:MaSach", binhLuanController.getByBook);

export default router;