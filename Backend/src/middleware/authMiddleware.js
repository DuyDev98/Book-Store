import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Kích hoạt dotenv để đọc được biến môi trường từ file .env
dotenv.config();

const authAdminMiddleware = (req, res, next) => {
  // 1. Lấy token từ header gửi lên
  // Client thường gửi dạng: { token: "Bearer <mã_token_dài_ngoằng>" }
  const token = req.headers.token ? req.headers.token.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      status: "ERR",
      message: "Bạn chưa đăng nhập (Không có Token)!",
    });
  }

  // 2. Giải mã token để xem ai đang gọi
  // Thay 'ma_bi_mat_cua_ban' bằng process.env.ACCESS_TOKEN_SECRET cho an toàn
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, userDecoded) {
      if (err) {
        return res.status(403).json({
          status: "ERR",
          message: "Token không hợp lệ hoặc đã hết hạn!",
        });
      }

      // userDecoded lúc này sẽ chứa { id: '...', isAdmin: true/false }
      // (Do bên User.Services.js ta đã quy định payload như vậy)

      // 3. Kiểm tra xem có phải Admin không?
      if (userDecoded.isAdmin) {
        // ✅ OK, user là Admin -> Cho phép đi tiếp vào Controller
        next();
      } else {
        // ⛔ User hợp lệ nhưng KHÔNG PHẢI Admin
        return res.status(403).json({
          status: "ERR",
          message: "⛔ Bạn không có quyền truy cập (Admin only)!",
        });
      }
    }
  );
};

export default authAdminMiddleware;
