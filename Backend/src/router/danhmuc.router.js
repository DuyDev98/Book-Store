import express from "express";
import * as danhmucController from "../controller/danhmuc.controller.js";
const router = express.Router();

router.get("/", danhmucController.getAll);

export default router;
