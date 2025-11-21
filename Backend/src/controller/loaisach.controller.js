// controllers/loaisach.controller.js
import * as loaisachService from '../services/loaisach.services.js';  // Import service

// Lấy danh sách loại sách
export const getCategories = async (req, res) => {
  try {
    const categories = await loaisachService.getCategories();
    res.json(categories);  // Trả về dữ liệu danh sách loại sách
  } catch (err) {
    res.status(500).json({ message: err.message });  // Xử lý lỗi
  }
};

// Thêm loại sách
export const addCategory = async (req, res) => {
  try {
    const { TenLoaiSach } = req.body;
    const result = await loaisachService.addCategory(TenLoaiSach);  // Gọi service thêm loại sách
    res.status(201).json({ message: 'Loại sách đã được thêm!', data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });  // Xử lý lỗi
  }
};

// Sửa loại sách
export const updateCategory = async (req, res) => {
  try {
    const { MaLoaiSach, TenLoaiSach } = req.body;
    const result = await loaisachService.updateCategory(MaLoaiSach, TenLoaiSach);  // Gọi service sửa loại sách
    res.json({ message: 'Loại sách đã được cập nhật!', data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa loại sách
export const deleteCategory = async (req, res) => {
  try {
    const { MaLoaiSach } = req.params;
    const result = await loaisachService.deleteCategory(MaLoaiSach);  // Gọi service xóa loại sách
    res.json({ message: 'Loại sách đã được xóa!', data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
