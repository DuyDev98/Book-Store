import * as loaisachModel from '../modules/loaisach.model.js';  // Import các hàm từ model

// Lấy danh sách loại sách
export const getCategories = async () => {
  try {
    const categories = await loaisachModel.getAllCategories();  // Sử dụng hàm từ model
    return categories;
  } catch (err) {
    throw new Error("Không thể lấy danh sách loại sách: " + err.message);
  }
};
// Lấy loại sách theo ID
export const getCategoryById = async (MaLoaiSach) => {
    try {
        const categories = await loaisachModel.getAllCategories();  // Lấy tất cả loại sách
        const category = categories.find(cat => cat.MaLoaiSach == MaLoaiSach);  // Tìm loại sách theo ID
        return category;
    } catch (err) {
        throw new Error("Không thể lấy loại sách theo ID: " + err.message);
    }
};

// Thêm loại sách
export const addCategory = async (TenLoaiSach) => {
  try {
    const result = await loaisachModel.addCategory(TenLoaiSach);  // Gọi hàm model để thêm loại sách
    return result;
  } catch (err) {
    console.error('Error in addCategory service:', err);
    throw new Error('Không thể thêm loại sách');
  }
};

// Cập nhật loại sách
export const updateCategory = async (MaLoaiSach, TenLoaiSach) => {
  try {
    const result = await loaisachModel.updateCategory(MaLoaiSach, TenLoaiSach);  // Sử dụng hàm từ model
    return result;
  } catch (err) {
    throw new Error("Không thể sửa loại sách: " + err.message);
  }
};

// Xóa loại sách
export const deleteCategory = async (MaLoaiSach) => {
  try {
    const result = await loaisachModel.deleteCategory(MaLoaiSach);  // Sử dụng hàm từ model
    return result;
  } catch (err) {
    throw new Error("Không thể xóa loại sách: " + err.message);
  }
};
