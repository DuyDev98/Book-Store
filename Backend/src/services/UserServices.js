import User from "../modules/User.model.js";

const createUser = (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingUser = await User.findOne(userData.Username);
      if (existingUser) {
        return resolve({ status: "ERR", message: "Tài khoản đã tồn tại" });
      }

      const createdUser = await User.create(userData);
      resolve({
        status: "OK",
        message: "Tạo người dùng thành công",
        data: createdUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Username, PassWord } = userLogin; // Đúng tên trường
      const user = await User.findOne(Username); // Truyền đúng kiểu chuỗi
      if (!user) {
        return resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại",
        });
      }
      if (user.PassWord !== PassWord) {
        return resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác",
        });
      }
      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
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

export default { createUser, loginUser };
