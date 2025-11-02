import express from "express";
import * as ctrl from "../controller/sach.controller.js";
const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;

