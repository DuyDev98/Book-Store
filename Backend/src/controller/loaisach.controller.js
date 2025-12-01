import * as loaisachService from '../services/loaisach.services.js';  // Import các hàm từ service

// Lấy tất cả loại sách
export const getAllCategories = async (req, res) => {
  try {
    const categories = await loaisachService.getCategories();  // Gọi service để lấy danh sách loại sách
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách loại sách" });
  }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await loaisachService.getCategoryById(id);  // Gọi service để lấy loại sách theo ID
        if (!category) {
            return res.status(404).json({ message: "Loại sách không tìm thấy" });
        }
        res.json(category);
    } catch (err) {
        console.error('Lỗi khi gọi API:', err);
        res.status(500).json({ message: "Lỗi khi lấy loại sách theo ID", error: err.message });
    }
};


// Thêm loại sách mới
export const addCategory = async (req, res) => {
  try {
    const { TenLoaiSach } = req.body;  // Lấy TenLoaiSach từ body
    if (!TenLoaiSach) {
      return res.status(400).json({ message: 'Tên loại sách không được để trống' });
    }

    // Gọi service để thêm loại sách
    const result = await loaisachService.addCategory(TenLoaiSach);
    res.status(201).json({ success: true, message: 'Thêm loại sách thành công' });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ success: false, message: 'Không thể thêm loại sách', error: err.message });
  }
};

// Cập nhật loại sách theo ID
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { TenLoaiSach } = req.body;
  try {
    const updatedCategory = await loaisachService.updateCategory(id, TenLoaiSach);  // Cập nhật loại sách
    if (!updatedCategory) {
      return res.status(404).json({ message: "Không tìm thấy loại sách để cập nhật" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "Không thể cập nhật loại sách" });
  }
};

// Xóa loại sách theo ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await loaisachService.deleteCategory(id);  // Gọi service để xóa loại sách
    if (!deletedCategory) {
      return res.status(404).json({ message: "Không tìm thấy loại sách để xóa" });
    }
    res.json({ message: "Loại sách đã được xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa loại sách" });
  }
};
