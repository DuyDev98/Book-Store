import express from "express";
import UserController from "../controller/UserController.js";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);

export default router;
