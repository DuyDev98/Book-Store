import express from "express";
import cors from "cors";
import sachRouter from "./router/sach.router.js";
import khRouter from "./router/khachhang.router.js";
import hdRouter from "./router/hoadon.router.js";
import UserRouter from "./router/UserRouter.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/user", UserRouter);
app.use("/api/sach", sachRouter);
app.use("/api/khachhang", khRouter);
app.use("/api/hoadon", hdRouter);

app.get("/", (req, res) => res.json({ ok: true, msg: "Bookstore API" }));

export default app;
