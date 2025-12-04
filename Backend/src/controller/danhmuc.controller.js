import * as danhmucService from "../services/danhmuc.services.js";

// Lấy tất cả
export const getAll = async (req, res) => {
  try {
    const data = await danhmucService.getAllDanhMuc();
    // Trả về cấu trúc chuẩn
    res.status(200).json({ 
        status: "OK",
        data: data 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Lấy theo ID
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await danhmucService.getDanhMucById(id);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Thêm mới
export const create = async (req, res) => {
  try {
    console.log("Body nhận được:", req.body); // Quan trọng: Xem log này ở Terminal

    // Lấy đúng tên biến Frontend gửi lên
    const { TenDanhMuc, ParentID } = req.body;
    
    if (!TenDanhMuc) {
      return res.status(400).json({ message: "Vui lòng nhập tên danh mục" });
    }

    await danhmucService.addDanhMuc(TenDanhMuc, ParentID);
    
    res.status(201).json({ message: "Thêm danh mục thành công" });
  } catch (err) {
    console.error("Lỗi Controller Create:", err);
    res.status(500).json({ message: "Lỗi thêm danh mục: " + err.message });
  }
};

// Cập nhật
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { TenDanhMuc, ParentID } = req.body;
    
    await danhmucService.updateDanhMuc(id, TenDanhMuc, ParentID);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật: " + err.message });
  }
};

// Xóa
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await danhmucService.deleteDanhMuc(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa danh mục: " + err.message });
  }
};