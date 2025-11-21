import * as sachService from "../services/sach.services.js";

export const getAll = async (req, res) => {
  try {
    const data = await sachService.getAllSach();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = +req.params.id;
    const item = await sachService.getSachById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controller/sach.controller.js
export const create = async (req, res) => {
  try {
    const { TenSach, AnhBia, GiaBan, MaTG, MaNXB, MaLoaiSach, MaDanhMuc, MoTa } = req.body;
    const result = await sachService.createSach({
      TenSach, 
      AnhBia, 
      GiaBan, 
      MaTG, 
      MaNXB, 
      MaLoaiSach, 
      MaDanhMuc, 
      MoTa
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const payload = { ...req.body, MaSach: +req.params.id };
    await sachService.updateSach(payload);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await sachService.deleteSach(+req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getBooksByCategory = async (req, res) => {
  const maLoaiSach = req.params.id;

  try {
    const data = await sachService.getSachByDanhMuc(maLoaiSach);

    res.json({
      success: true,
      data: data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm controller để tạo loại sách mới
export const createCategory = async (req, res) => {
  try {
    const { TenLoaiSach } = req.body;  // Lấy tên loại sách từ dữ liệu gửi lên
    const result = await sachService.createCategory(TenLoaiSach);  // Gọi service để thêm loại sách
    res.status(201).json({ message: 'Loại sách đã được thêm!', data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
