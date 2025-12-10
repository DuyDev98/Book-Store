import { getPool } from "../config/db.js";
// Import các câu lệnh SQL từ Model
import { 
  SQL_GET_USER_BY_USERNAME, 
  SQL_ADD_USER, 
  SQL_ADD_CUSTOMER 
} from "../modules/User.model.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const UserServices = {
  // --- ĐĂNG KÝ ---
  createUser: async ({ Username, PassWord, VaiTro = "User" }) => {
    const pool = await getPool();

    // 1. Kiểm tra tài khoản tồn tại (Dùng SQL)
    const [existingUsers] = await pool.query(SQL_GET_USER_BY_USERNAME, [Username]);
    if (existingUsers.length > 0) {
      return { status: "ERR", message: "Tài khoản đã tồn tại" };
    }

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(PassWord, 10);

    // 3. Thêm User (Dùng SQL)
    await pool.query(SQL_ADD_USER, [Username, hashedPassword, VaiTro]);

    // 4. Thêm Khách Hàng (Để có MaKH)
    let newMaKH = null;
    if (VaiTro === "User") {
        const [result] = await pool.query(SQL_ADD_CUSTOMER, [Username, Username]);
        newMaKH = result.insertId;
    }

    return { 
        status: "OK", 
        message: "Tạo tài khoản thành công", 
        data: { Username, VaiTro, MaKH: newMaKH } 
    };
  },

  // --- ĐĂNG NHẬP ---
  loginUser: async ({ Username, PassWord }) => {
    const pool = await getPool();

    // 1. Tìm user (Dùng SQL)
    const [rows] = await pool.query(SQL_GET_USER_BY_USERNAME, [Username]);
    const user = rows[0];

    if (!user) {
      return { status: "ERR", message: "Tài khoản không tồn tại" };
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(PassWord, user.PassWord);
    if (!isMatch) {
      return { status: "ERR", message: "Mật khẩu không chính xác" };
    }

    // 3. Tạo Token (Bắt buộc có MaKH)
    const access_token = jwt.sign(
      { 
        id: user.Username, 
        isAdmin: user.VaiTro === "Admin", 
        MaKH: user.MaKH 
      },
      process.env.ACCESS_TOKEN_SECRET || "access_token",
      { expiresIn: "1d" }
    );

    return {
      status: "OK",
      message: "Đăng nhập thành công",
      access_token,
      data: {
        Username: user.Username,
        VaiTro: user.VaiTro,
        MaKH: user.MaKH,
        HoTen: user.HoTen
      },
    };
  },

  // --- TẠO ADMIN ---
  createAdmin: async ({ Username, PassWord }) => {
    return await UserServices.createUser({ Username, PassWord, VaiTro: "Admin" });
  }
};

export default UserServices;