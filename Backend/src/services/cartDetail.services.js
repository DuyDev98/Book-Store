import { getPool } from "../config/db.js";
import {
  SQL_INSERT_DETAIL,
  SQL_DELETE_DETAIL,
  SQL_UPDATE_DETAIL,
  SQL_SELECT_DETAIL_BY_CART,
} from "../modules/cartDetail.model.js";

export const CartDetailService = {
  async addItem(MaGioHang, MaSach, SoLuong) {
    const pool = await getPool();
    await pool.query(SQL_INSERT_DETAIL, [MaGioHang, MaSach, SoLuong]);
  },

  async removeItem(MaGioHang, MaSach) {
    const pool = await getPool();
    await pool.query(SQL_DELETE_DETAIL, [MaGioHang, MaSach]);
  },

  async updateItem(MaGioHang, MaSach, SoLuong) {
    const pool = await getPool();
    await pool.query(SQL_UPDATE_DETAIL, [SoLuong, MaGioHang, MaSach]);
  },

  async getItems(MaGioHang) {
    const pool = await getPool();
    const [rows] = await pool.query(SQL_SELECT_DETAIL_BY_CART, [MaGioHang]);
    return rows;
  },
};
