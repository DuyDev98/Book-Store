import { getPool, sql } from "../config/db.js";
import * as model from "../modules/sach.model.js";

export const getAllSach = async () => {
  const pool = await getPool();
  const result = await pool.request().query(model.SQL_GET_ALL_SACH);
  return result.recordset;
};

export const getSachById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(model.SQL_GET_SACH_BY_ID);
  return result.recordset[0];
};

export const createSach = async (payload) => {
  const pool = await getPool();
  const req = pool.request();
  req.input('TenSach', sql.NVarChar(255), payload.TenSach);
  req.input('MaLoaiSach', sql.Int, payload.MaLoaiSach);
  req.input('MaNXB', sql.Int, payload.MaNXB);
  req.input('MaTG', sql.Int, payload.MaTG);
  req.input('GiaBia', sql.Decimal(12,2), payload.GiaBia || 0);
  req.input('SoLuong', sql.Int, payload.SoLuong || 0);
  req.input('MoTa', sql.NVarChar(sql.MAX), payload.MoTa || null);
  req.input('HinhAnh', sql.NVarChar(500), payload.HinhAnh || null);

  const result = await req.query(model.SQL_INSERT_SACH);
  return result.recordset[0];
};

export const updateSach = async (payload) => {
  const pool = await getPool();
  const req = pool.request();
  req.input('MaSach', sql.Int, payload.MaSach);
  req.input('TenSach', sql.NVarChar(255), payload.TenSach);
  req.input('MaLoaiSach', sql.Int, payload.MaLoaiSach);
  req.input('MaNXB', sql.Int, payload.MaNXB);
  req.input('MaTG', sql.Int, payload.MaTG);
  req.input('GiaBia', sql.Decimal(12,2), payload.GiaBia || 0);
  req.input('SoLuong', sql.Int, payload.SoLuong || 0);
  req.input('MoTa', sql.NVarChar(sql.MAX), payload.MoTa || null);
  req.input('HinhAnh', sql.NVarChar(500), payload.HinhAnh || null);

  await req.query(model.SQL_UPDATE_SACH);
  return { success: true };
};

export const deleteSach = async (id) => {
  const pool = await getPool();
  await pool.request().input('id', sql.Int, id).query(model.SQL_DELETE_SACH);
  return { success: true };
};
export const getAllBooks = async () => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT s.MaSach, s.TenSach, s.GiaBia, s.MoTa, s.HinhAnh, 
           tg.TenTG, ls.TenLoai, nxb.TenNXB
    FROM SACH s
    LEFT JOIN TACGIA tg ON s.MaTG = tg.MaTG
    LEFT JOIN LOAISACH ls ON s.MaLoaiSach = ls.MaLoaiSach
    LEFT JOIN NXB nxb ON s.MaNXB = nxb.MaNXB
  `);
  return result.recordset;
};
