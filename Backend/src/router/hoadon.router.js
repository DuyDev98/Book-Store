import express from "express";
import * as ctrl from "../controllers/hoadon.controller.js";
const r = express.Router();

r.post("/", ctrl.createHD);

export default r;
