import express from "express";
import * as ctrl from "../controllers/khachhang.controller.js";
const r = express.Router();

r.get("/", ctrl.list);
r.post("/", ctrl.createKH);

export default r;
