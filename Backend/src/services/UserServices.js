import User from "../modules/User.model.js";

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdUser = await User.create(newUser);
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Không thể tạo người dùng (Lỗi validation hoặc DB)",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Username, Password } = userLogin;
      const user = await User.findOne({ Username });
      if (!user) {
        return resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại",
        });
      }
      if (user.Password !== Password) {
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
