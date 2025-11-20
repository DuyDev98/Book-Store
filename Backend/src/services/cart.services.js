import { getPool } from "../config/db.js";
import { SQL_CREATE_CART, SQL_GET_CART_BY_CUSTOMER } from "../modules/cart.model.js";

export const CartService = {
  async createCart(MaKH) {
    const pool = await getPool();
    const [result] = await pool.query(SQL_CREATE_CART, [MaKH]);
    return result.insertId;
  },

  async getCartByCustomer(MaKH) {
    const pool = await getPool();
    const [rows] = await pool.query(SQL_GET_CART_BY_CUSTOMER, [MaKH]);
    return rows[0];
  },
};
