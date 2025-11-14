import { getPool } from "../config/db.js";
import * as model from "../modules/khachhang.model.js";

export const getAllKH = async () => {
  const pool = await getPool();
  const [rows] = await pool.query("SELECT * FROM khachhang"); // hoặc model.SQL_GET_ALL_KHACHHANG
  return rows;
};

export const createKH = async (payload) => {
  const pool = await getPool();
  const [result] = await pool.query(
    "INSERT INTO khachhang (Username, HoTen, DiaChi, SDienThoai, Email) VALUES (?, ?, ?, ?, ?)",
    [
      payload.Username,
      payload.HoTen,
      payload.DiaChi,
      payload.SDienThoai,
      payload.Email,
    ]
  );
  return { id: result.insertId, ...payload };
};
