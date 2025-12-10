import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Lấy token sau chữ Bearer
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: "ERR", message: "Bạn chưa đăng nhập (Thiếu Token)" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access_token", (err, decoded) => {
    if (err) return res.status(403).json({ status: "ERR", message: "Token hết hạn hoặc không hợp lệ" });

    // Lưu thông tin user (có MaKH) vào request
    req.user = decoded; 
    req.userRole = decoded.isAdmin ? "ADMIN" : "USER";
    next();
  });
};

export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) next();
    else res.status(403).json({ status: "ERR", message: "Không có quyền Admin" });
};