import express from "express";
import UserController from "../controller/UserController.js";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/admin/signup", UserController.createAdmin);
export default router;
