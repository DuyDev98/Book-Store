import { getPool } from "../config/db.js"; // MySQL pool kết nối
import * as model from "../modules/sach.model.js"; // Các câu truy vấn SQL

// Lấy tất cả sách
export const getAllSach = async () => {
  const pool = await getPool();
  const [rows] = await pool.promise().query(model.SQL_GET_ALL_SACH);
  return rows;
};

// Lấy sách theo ID
export const getSachById = async (id) => {
  const pool = await getPool();
  const [rows] = await pool.promise().query(model.SQL_GET_SACH_BY_ID, [id]);
  return rows[0];
};

// Thêm sách
export const createSach = async (payload) => {
  const pool = await getPool();
  const [result] = await pool.promise().query(model.SQL_INSERT_SACH, [
    payload.TenSach, payload.AnhBia, payload.LanTaiBan,
    payload.GiaBan, payload.NamXuatBan, payload.MaTG,
    payload.MaNXB, payload.MaLinhVuc, payload.MaLoaiSach
  ]);
  return result.insertId;
};

// Cập nhật sách
export const updateSach = async (payload) => {
  const pool = await getPool();
  await pool.promise().query(model.SQL_UPDATE_SACH, [
    payload.TenSach, payload.AnhBia, payload.LanTaiBan,
    payload.GiaBan, payload.NamXuatBan, payload.MaTG,
    payload.MaNXB, payload.MaLinhVuc, payload.MaLoaiSach,
    payload.MaSach
  ]);
  return { success: true };
};

// Xóa sách
export const deleteSach = async (id) => {
  const pool = await getPool();
  await pool.promise().query(model.SQL_DELETE_SACH, [id]);
  return { success: true };
};
