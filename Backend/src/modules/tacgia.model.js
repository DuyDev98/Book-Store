// modules/tacgia.model.js
import { getPool } from '../config/db.js';  // Kết nối đến database qua getPool

// Lấy tác giả theo ID
export const getAuthorById = async (MaTG) => {
  const pool = await getPool();
  const query = 'SELECT * FROM tacgia WHERE MaTG = ?';
  const [rows] = await pool.query(query, [MaTG]);
  return rows[0];
};

// Lấy tất cả tác giả
export const getAllAuthors = async () => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM tacgia');
  return rows;
};

// Thêm tác giả
export const addAuthor = async (TenTG, NamSinh, QueQuan, NamMat) => {
  const pool = await getPool();
  const query = 'INSERT INTO tacgia (TenTG, NamSinh, QueQuan, NamMat) VALUES (?, ?, ?, ?)';
  const [result] = await pool.query(query, [TenTG, NamSinh || null, QueQuan || null, NamMat || null]);
  return result;
};

// Cập nhật tác giả
export const updateAuthor = async (MaTG, TenTG, NamSinh, QueQuan, NamMat) => {
  const pool = await getPool();
  const query = `
    UPDATE tacgia
    SET TenTG = ?, NamSinh = ?, QueQuan = ?, NamMat = ?
    WHERE MaTG = ?
  `;
  const [result] = await pool.query(query, [TenTG, NamSinh || null, QueQuan || null, NamMat || null, MaTG]);
  return result;
};

// Xóa tác giả
export const deleteAuthor = async (MaTG) => {
  const pool = await getPool();
  const query = 'DELETE FROM tacgia WHERE MaTG = ?';
  const [result] = await pool.query(query, [MaTG]);
  return result;
};
