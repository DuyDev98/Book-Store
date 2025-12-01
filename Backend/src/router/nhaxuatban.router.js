// routes/nhaxuatban.route.js
import express from "express";
import NXBController from "../controller/nhaxuatban.controller.js";

const router = express.Router();

router.get("/", NXBController.getAll);
router.post("/", NXBController.create);
router.put("/:id", NXBController.update);
router.delete("/:id", NXBController.delete);

export default router;
