// src/services/cart.services.js
import { getPool } from "../config/db.js";
import {
  SQL_INSERT_GIOHANG,
  SQL_INSERT_CHITIET_GIOHANG,
  SQL_DELETE_CHITIET_GIOHANG,
  SQL_SELECT_GIOHANG,
} from "../modules/cart.model.js";

// 🧺 Tạo giỏ hàng mới
export async function createCart(maKH) {
  const pool = await getPool();
  const [result] = await pool.query(SQL_INSERT_GIOHANG, [maKH]);
  return result.insertId;
}

// ➕ Thêm sách vào giỏ
export async function addToCart(maGioHang, maSach, soLuong) {
  const pool = await getPool();
  await pool.query(SQL_INSERT_CHITIET_GIOHANG, [maGioHang, maSach, soLuong]);
  return true;
}

// 🗑️ Xóa 1 sách khỏi giỏ hàng
export async function removeFromCart(maGioHang, maSach) {
  const pool = await getPool();
  await pool.query(SQL_DELETE_CHITIET_GIOHANG, [maGioHang, maSach]);
  return true;
}

// 📦 Lấy danh sách sách trong giỏ hàng
export async function getCartItems(maGioHang) {
  const pool = await getPool();
  const [rows] = await pool.query(SQL_SELECT_GIOHANG, [maGioHang]);
  return rows;
}
 