// model/loaisach.model.js
import { getPool } from '../config/db.js';  // Kết nối đến database qua getPool

// Lấy tất cả loại sách
export const getAllCategories = async () => {
  const pool = await getPool();  // Kết nối tới DB
  const [rows] = await pool.promise().query('SELECT * FROM LOAISACH');
  return rows;  // Trả về kết quả dạng mảng các loại sách
};

// Thêm loại sách
export const addCategory = async (TenLoaiSach) => {
  const pool = await getPool();
  const query = 'INSERT INTO LOAISACH (TenLoaiSach) VALUES (?)';
  const [result] = await pool.promise().query(query, [TenLoaiSach]);
  return result;  // Trả về thông tin kết quả INSERT
};

// Sửa loại sách
export const updateCategory = async (MaLoaiSach, TenLoaiSach) => {
  const pool = await getPool();
  const query = 'UPDATE LOAISACH SET TenLoaiSach = ? WHERE MaLoaiSach = ?';
  const [result] = await pool.promise().query(query, [TenLoaiSach, MaLoaiSach]);
  return result;  // Trả về kết quả sau khi sửa
};

// Xóa loại sách
export const deleteCategory = async (MaLoaiSach) => {
  const pool = await getPool();
  const query = 'DELETE FROM LOAISACH WHERE MaLoaiSach = ?';
  const [result] = await pool.promise().query(query, [MaLoaiSach]);
  return result;  // Trả về kết quả xóa
};
