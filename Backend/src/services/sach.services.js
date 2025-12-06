import { getPool } from "../config/db.js";
// LƯU Ý: Kiểm tra lại tên thư mục là 'models' hay 'modules' trong máy bạn
import * as sachModel from "../modules/sach.model.js"; 

export const getAll = async () => {
  const pool = await getPool();
  // QUAN TRỌNG: Dùng [rows] để bóc tách dữ liệu ra khỏi mảng [rows, fields]
  const [rows] = await pool.query(sachModel.SQL_GET_ALL);
  return rows; 
};

export const getById = async (id) => {
  const pool = await getPool();
  const [rows] = await pool.query(sachModel.SQL_GET_BY_ID, [id]);
  return rows[0];
};

export const create = async (data) => {
  const pool = await getPool();
  const params = [
    data.TenSach,
    data.AnhBia || null,
    data.GiaBan || 0,
    data.SoLuongTon || 0,
    data.NamXuatBan || null,
    data.LanTaiBan || null,
    data.MoTa || '',
    data.MaTG || null,
    data.MaNXB || null,
    data.MaLoaiSach || null,
    data.MaDanhMuc || null
  ];
  const [result] = await pool.query(sachModel.SQL_CREATE, params);
  return result;
};

export const update = async (id, data) => {
  const pool = await getPool();
  const params = [
    data.TenSach,
    data.AnhBia || null,
    data.GiaBan,
    data.SoLuongTon,
    data.NamXuatBan,
    data.LanTaiBan,
    data.MoTa,
    data.MaTG,
    data.MaNXB,
    data.MaLoaiSach,
    data.MaDanhMuc,
    id
  ];
  const [result] = await pool.query(sachModel.SQL_UPDATE, params);
  return result;
};

export const remove = async (id) => {
  const pool = await getPool();
  const [result] = await pool.query(sachModel.SQL_DELETE, [id]);
  return result;
};

export const importStock = async (id, soLuongNhap) => {
  const pool = await getPool();
  const [result] = await pool.query(sachModel.SQL_IMPORT_STOCK, [soLuongNhap, id]);
  return result;
};