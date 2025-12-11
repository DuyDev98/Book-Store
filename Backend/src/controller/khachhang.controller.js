import KhachHangServices from "../services/khachhang.services.js";

// Lấy tất cả khách hàng
export const getAll = async (req, res) => {
  try {
    const data = await KhachHangServices.getAllKH();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy khách hàng theo ID
export const getById = async (req, res) => {
  try {
    const id = +req.params.id;
    const data = await KhachHangServices.getKHById(id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo khách hàng mới
export const create = async (req, res) => {
  try {
    const { Username, HoTen, DiaChi, SDienThoai, Email } = req.body;

    if (!Username || !HoTen || !DiaChi || !SDienThoai || !Email) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Nhập đầy đủ thông tin khách hàng" });
    }

    const data = await KhachHangServices.createKH({
      Username,
      HoTen,
      DiaChi,
      SDienThoai,
      Email,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin khách hàng
// Cập nhật thông tin khách hàng
export const update = async (req, res) => {
  try {
    const id = req.params.id; // [QUAN TRỌNG] Bỏ dấu + đi để nhận cả chữ (Username)
    const data = await KhachHangServices.updateKH(id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xoá khách hàng
export const remove = async (req, res) => {
  try {
    const id = +req.params.id;
    const data = await KhachHangServices.deleteKH(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EXPORT ĐÚNG CHUẨN
export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
