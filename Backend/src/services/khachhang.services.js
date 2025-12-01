import KhachHang from "../modules/khachhang.model.js";
const createKH = (khData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exists = await KhachHang.exists(khData);
      if (exists) {
        return resolve({ status: "ERR", message: "Khách hàng đã tồn tại" });
      }

      const created = await KhachHang.create(khData);
      resolve({
        status: "OK",
        message: "Thêm khách hàng thành công",
        data: created,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllKH = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await KhachHang.getAllKH();
      resolve({ status: "OK", data });
    } catch (e) {
      reject(e);
    }
  });
};

export default { createKH, getAllKH };
