// services/tacgia.services.js
import * as tacgiaModel from '../modules/tacgia.model.js';

// Lấy danh sách tác giả
export const getAuthors = async () => {
  try {
    const authors = await tacgiaModel.getAllAuthors();
    return authors;
  } catch (err) {
    throw new Error('Không thể lấy danh sách tác giả: ' + err.message);
  }
};

// Lấy tác giả theo ID
export const getAuthorById = async (MaTacGia) => {
  try {
    const author = await tacgiaModel.getAuthorById(MaTacGia);
    return author;
  } catch (err) {
    throw new Error('Không thể lấy tác giả theo ID: ' + err.message);
  }
};

// Thêm tác giả
export const addAuthor = async (TenTacGia, NamSinh, NamMat) => {
  try {
    const result = await tacgiaModel.addAuthor(TenTacGia, NamSinh, NamMat);
    return result;
  } catch (err) {
    console.error('Error in addAuthor service:', err);
    throw new Error('Không thể thêm tác giả');
  }
};

// Cập nhật tác giả
export const updateAuthor = async (MaTacGia, TenTacGia, NamSinh, NamMat) => {
  try {
    const result = await tacgiaModel.updateAuthor(MaTacGia, TenTacGia, NamSinh, NamMat);
    return result;
  } catch (err) {
    throw new Error('Không thể sửa tác giả: ' + err.message);
  }
};

// Xóa tác giả
export const deleteAuthor = async (MaTacGia) => {
  try {
    const result = await tacgiaModel.deleteAuthor(MaTacGia);
    return result;
  } catch (err) {
    throw new Error('Không thể xóa tác giả: ' + err.message);
  }
};
