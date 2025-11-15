import { getPool } from "../config/db.js";
import * as model from "../modules/sach.model.js";

// --- Lấy toàn bộ sách ---
export const getAllSach = async () => {
  const pool = await getPool();
  const [rows] = await pool.query(model.SQL_GET_ALL_SACH);
  return rows;
};

// --- Lấy sách theo ID ---
export const getSachById = async (id) => {
  const pool = await getPool();
  const [rows] = await pool.query(model.SQL_GET_SACH_BY_ID, [id]);
  return rows[0];
};

// --- Thêm sách ---
export const createSach = async (payload) => {
  const pool = await getPool();
  const [result] = await pool.query(model.SQL_INSERT_SACH, [
    payload.TenSach,
    payload.AnhBia,
    payload.LanTaiBan,
    payload.GiaBan,
    payload.NamXuatBan,
    payload.MaTG,
    payload.MaNXB,
    payload.MaLoaiSach,
    payload.MaDanhMuc,
  ]);
  return { insertedId: result.insertId };
};

// --- Cập nhật sách ---
export const updateSach = async (payload) => {
  const pool = await getPool();
  await pool.query(model.SQL_UPDATE_SACH, [
    payload.TenSach,
    payload.AnhBia,
    payload.LanTaiBan,
    payload.GiaBan,
    payload.NamXuatBan,
    payload.MaTG,
    payload.MaNXB,
    payload.MaLoaiSach,
    payload.MaDanhMuc,
    payload.MaSach,
  ]);
  return { success: true };
};

// --- Xoá sách ---
export const deleteSach = async (id) => {
  const pool = await getPool();
  await pool.query(model.SQL_DELETE_SACH, [id]);
  return { success: true };
};
export const getSachByDanhMuc = async (maLoaiSach) => {
  const pool = await getPool();
  const [rows] = await pool.query(model.SQL_GET_SACH_BY_DANHMUC, [maLoaiSach]);
  return rows;
};

