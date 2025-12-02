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
export const getAuthorById = async (MaTG) => {
  try {
    const author = await tacgiaModel.getAuthorById(MaTG);
    return author;
  } catch (err) {
    throw new Error('Không thể lấy tác giả theo ID: ' + err.message);
  }
};

// Thêm tác giả
export const addAuthor = async (TenTG, NamSinh, QueQuan, NamMat) => {
  try {
    const result = await tacgiaModel.addAuthor(TenTG, NamSinh, QueQuan, NamMat);
    return result;
  } catch (err) {
    console.error('Error in addAuthor service:', err);
    throw new Error('Không thể thêm tác giả');
  }
};

// Cập nhật tác giả
export const updateAuthor = async (MaTG, TenTG, NamSinh, QueQuan, NamMat) => {
  try {
    const result = await tacgiaModel.updateAuthor(MaTG, TenTG, NamSinh, QueQuan, NamMat);
    return result;
  } catch (err) {
    throw new Error('Không thể sửa tác giả: ' + err.message);
  }
};

// Xóa tác giả
export const deleteAuthor = async (MaTG) => {
  try {
    const result = await tacgiaModel.deleteAuthor(MaTG);
    return result;
  } catch (err) {
    throw new Error('Không thể xóa tác giả: ' + err.message);
  }
};
