import User from "../modules/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; // 1. Import dotenv

dotenv.config(); // 2. Kích hoạt dotenv để đọc file .env

const createUser = ({ Username, PassWord }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra user tồn tại
      const existingUser = await User.findOne(Username);
      if (existingUser) {
        return resolve({
          status: "ERR",
          message: "Tài khoản đã tồn tại",
        });
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(PassWord, 10);

      // Tạo user
      const newUser = await User.create({
        Username,
        PassWord: hashedPassword,
      });

      resolve({
        status: "OK",
        message: "Tạo tài khoản thành công",
        data: newUser,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const createAdmin = ({ Username, PassWord }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check tồn tại
      const existingAdmin = await User.findOne(Username);
      if (existingAdmin) {
        return resolve({
          status: "ERR",
          message: "Tài khoản đã tồn tại",
        });
      }

      // Hash pass
      const hashedPassword = await bcrypt.hash(PassWord, 10);

      // Tạo admin (VaiTro ép = Admin)
      const newAdmin = await User.create({
        Username,
        PassWord: hashedPassword,
        VaiTro: "Admin",
      });

      resolve({
        status: "OK",
        message: "Tạo Admin thành công",
        data: newAdmin,
      });
    } catch (err) {
      reject(err);
    }
  });
};
// --- ĐÂY LÀ HÀM BẠN CẦN HOÀN CHỈNH ---
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Username, PassWord } = userLogin;

      const user = await User.findOne(Username);
      if (!user) {
        return resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại",
        });
      }

      const isMatch = await bcrypt.compare(PassWord, user.PassWord);
      if (!isMatch) {
        return resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác",
        });
      }

      // 3. SỬ DỤNG SECRET KEY TỪ FILE .ENV
      // Thay vì viết 'ma_bi_mat_cua_ban', ta dùng process.env.TEN_BIEN
      const access_token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.VaiTro === "Admin",
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
        access_token: access_token,
        data: {
          Username: user.Username,
          VaiTro: user.VaiTro,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default { createUser, loginUser, createAdmin };
