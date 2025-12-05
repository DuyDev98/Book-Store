import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.headers.token ? req.headers.token.split(" ")[1] : null;

  if (!token) {
    req.userRole = "GUEST"; // khách vãng lai
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.userRole = "GUEST";
      return next();
    }

    req.user = decoded;
    req.userRole = decoded.isAdmin ? "ADMIN" : "USER";

    next();
  });
};
export const requireUser = (req, res, next) => {
  if (req.userRole === "USER" || req.userRole === "ADMIN") return next();

  return res.status(403).json({
    status: "ERR",
    message: "Bạn cần đăng nhập!",
  });
};
export const requireAdmin = (req, res, next) => {
  if (req.userRole === "ADMIN") return next();

  return res.status(403).json({
    status: "ERR",
    message: "Bạn không có quyền Admin!",
  });
};
