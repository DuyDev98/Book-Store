import express from "express";
import * as ctrl from "../controller/khachhang.controller.js";
import KHController from "../controller/khachhangrg.controller.js";

const r = express.Router();

r.get("/", ctrl.list);
r.post("/", ctrl.createKH);
r.post("/register", KHController.registerKH);
r.get("/", KHController.getAllKH);

export default r;
