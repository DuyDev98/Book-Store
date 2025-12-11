import KhachHang from "../modules/khachhang.model.js";

const createKH = (khData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exists = await KhachHang.exists(khData);
      if (exists) {
        return resolve({ status: "ERR", message: "Khách hàng đã tồn tại" });
      }
      const created = await KhachHang.create(khData);
      resolve({ status: "OK", message: "Thêm khách hàng thành công", data: created });
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

// --- [MỚI THÊM] Hàm xử lý lấy ID ---
const getKHById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await KhachHang.getById(id);
      if (!data) {
        resolve({ status: "ERR", message: "Khách hàng không tồn tại" });
      } else {
        resolve({ status: "OK", data });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// --- [MỚI THÊM] Hàm cập nhật thông minh ---
const updateKH = (idOrUsername, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result;
      // Kiểm tra: Nếu là số thì update theo ID, chữ thì theo Username
      if (!isNaN(idOrUsername)) {
         result = await KhachHang.updateById(idOrUsername, updateData);
      } else {
         result = await KhachHang.updateByUsername(idOrUsername, updateData);
      }
      
      resolve({ status: "OK", message: "Cập nhật thành công", data: result });
    } catch (e) {
      reject(e);
    }
  });
};
// Nhớ export đủ 3 hàm
export default { createKH, getAllKH, getKHById, updateKH };