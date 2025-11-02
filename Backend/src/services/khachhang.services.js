import { getPool, sql } from "../config/db.js";
import * as model from "../modules/khachhang.model.js";

export const getAllKH = async () => {
  const pool = await getPool();
  const res = await pool.request().query(model.SQL_GET_ALL_KHACHHANG);
  return res.recordset;
};

export const createKH = async (payload) => {
  const pool = await getPool();
  const req = pool.request();
  req.input('TenKH', sql.NVarChar(255), payload.TenKH);
  req.input('Email', sql.NVarChar(255), payload.Email);
  req.input('DiaChi', sql.NVarChar(500), payload.DiaChi);
  req.input('DienThoai', sql.NVarChar(50), payload.DienThoai);
  const r = await req.query(model.SQL_INSERT_KH);
  return r.recordset[0];
};
