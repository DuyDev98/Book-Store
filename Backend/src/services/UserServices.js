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
export default { createUser };
