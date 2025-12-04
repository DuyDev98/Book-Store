import express from "express";
import UserController from "../controller/User.Controller.js";
import authAdminMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/admin/signup", authAdminMiddleware, UserController.createAdmin);
export default router;
