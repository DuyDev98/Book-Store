// modules/tacgia.model.js
import { getPool } from '../config/db.js';  // Kết nối đến database qua getPool

// Lấy tác giả theo ID
export const getAuthorById = async (MaTacGia) => {
  const pool = await getPool();
  const query = 'SELECT * FROM tacgia WHERE MaTacGia = ?';
  const [rows] = await pool.query(query, [MaTacGia]);
  return rows[0];
};

// Lấy tất cả tác giả
export const getAllAuthors = async () => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM tacgia');
  return rows;
};

// Thêm tác giả
export const addAuthor = async (TenTacGia, NamSinh, NamMat) => {
  const pool = await getPool();
  const query = 'INSERT INTO tacgia (TenTacGia, NamSinh, NamMat) VALUES (?, ?, ?)';
  const [result] = await pool.query(query, [TenTacGia, NamSinh || null, NamMat || null]);
  return result;
};

// Cập nhật tác giả
export const updateAuthor = async (MaTacGia, TenTacGia, NamSinh, NamMat) => {
  const pool = await getPool();
  const query = `
    UPDATE tacgia
    SET TenTacGia = ?, NamSinh = ?, NamMat = ?
    WHERE MaTacGia = ?
  `;
  const [result] = await pool.query(query, [TenTacGia, NamSinh || null, NamMat || null, MaTacGia]);
  return result;
};

// Xóa tác giả
export const deleteAuthor = async (MaTacGia) => {
  const pool = await getPool();
  const query = 'DELETE FROM tacgia WHERE MaTacGia = ?';
  const [result] = await pool.query(query, [MaTacGia]);
  return result;
};
