import { getPool } from "../config/db.js";

// SỬA: Kiểm tra kỹ tên thư mục chứa model (thường là models)
import * as danhmucModel from "../modules/danhmuc.model.js"; 

export const getAllDanhMuc = async () => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(danhmucModel.SQL_GET_ALL_DANHMUC);
    return rows;
  } catch (err) {
    throw new Error("Lỗi service get all: " + err.message);
  }
};

export const getDanhMucById = async (MaDanhMuc) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(danhmucModel.SQL_GET_DANHMUC_BY_ID, [MaDanhMuc]);
    return rows[0] || null;
  } catch (err) {
    throw new Error("Lỗi service get by id: " + err.message);
  }
};

export const addDanhMuc = async (TenDanhMuc) => {
  try {
    const pool = await getPool();
   
    // Log để kiểm tra server nhận được gì
    console.log("Service Add - Ten:", TenDanhMuc, "Parent:");

    const [result] = await pool.query(danhmucModel.SQL_CREATE_DANHMUC, [TenDanhMuc]);
    return result;
  } catch (err) {
    console.error("DB Error:", err);
    throw new Error("Không thể thêm danh mục: " + err.message);
  }
};

export const updateDanhMuc = async (MaDanhMuc, TenDanhMuc) => {
  try {
    const pool = await getPool();
    
    const [result] = await pool.query(danhmucModel.SQL_UPDATE_DANHMUC, [
      TenDanhMuc,
      MaDanhMuc,
    ]);
    return result;
  } catch (err) {
    throw new Error("Không thể cập nhật danh mục: " + err.message);
  }
};

export const deleteDanhMuc = async (MaDanhMuc) => {
  try {
    const pool = await getPool();
    const [result] = await pool.query(danhmucModel.SQL_DELETE_DANHMUC, [MaDanhMuc]);
    return result;
  } catch (err) {
    throw new Error("Không thể xóa danh mục: " + err.message);
  }
};