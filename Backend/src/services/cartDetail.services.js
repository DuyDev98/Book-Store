import { getPool } from "../config/db.js";
import {
  SQL_INSERT_DETAIL,
  SQL_DELETE_DETAIL,
  SQL_UPDATE_DETAIL,
  // SQL_SELECT_DETAIL_BY_CART, // Không dùng cái cũ này nữa
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

  // --- HÀM NÀY ĐÃ ĐƯỢC SỬA ---
  async getItems(MaGioHang) {
    const pool = await getPool();
    
    // Viết lại câu truy vấn trực tiếp để lấy thêm PhanTramGiamGia
    const query = `
      SELECT 
        ct.MaGioHang, 
        ct.MaSach, 
        ct.SoLuong, 
        s.TenSach, 
        s.GiaBan, 
        s.AnhBia, 
        s.PhanTramGiamGia,  -- <-- CỘT QUAN TRỌNG VỪA THÊM
        (s.GiaBan * ct.SoLuong) AS ThanhTien
      FROM ChiTietGioHang ct
      JOIN Sach s ON ct.MaSach = s.MaSach
      WHERE ct.MaGioHang = ?
    `;

    const [rows] = await pool.query(query, [MaGioHang]);
    return rows;
  },
};