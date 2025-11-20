import { getPool } from "../config/db.js";

export const getAllDanhMuc = async () => {
  const pool = await getPool();
  const [rows] = await pool.query("SELECT * FROM danhmuc");
  return rows;
};
