// services/loaisach.services.js
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

// Thêm loại sách
export const addCategory = async (TenLoaiSach) => {
  try {
    const result = await loaisachModel.addCategory(TenLoaiSach);  // Sử dụng hàm từ model
    return result;
  } catch (err) {
    throw new Error("Không thể thêm loại sách: " + err.message);
  }
};

// Sửa loại sách
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
