import { getPool } from "../config/db.js";

const Order = {
  getAll: async () => {
    const pool = await getPool();
    const sql = `
      SELECT d.MaDH, k.HoTen, d.NgayDat, d.TongTien, d.TrangThai 
      FROM donhang d
      JOIN khachhang k ON d.MaKH = k.MaKH
      ORDER BY d.NgayDat DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  getById: async (id) => {
    const pool = await getPool();
    const sqlOrder = `
      SELECT d.*, k.HoTen, k.Email, k.SDienThoai 
      FROM donhang d
      JOIN khachhang k ON d.MaKH = k.MaKH
      WHERE d.MaDH = ?
    `;
    const sqlItems = `
      SELECT c.SoLuong, c.DonGia, s.TenSach
      FROM chitietdonhang c
      JOIN sach s ON c.MaSach = s.MaSach
      WHERE c.MaDH = ?
    `;

    const [orderRows] = await pool.query(sqlOrder, [id]);
    const [itemRows] = await pool.query(sqlItems, [id]);

    if (orderRows.length === 0) return null;

    return {
      info: orderRows[0],
      items: itemRows,
    };
  },

  updateStatus: async (id, newStatus) => {
    const pool = await getPool();
    const sql = "UPDATE donhang SET TrangThai = ? WHERE MaDH = ?";
    const [result] = await pool.query(sql, [newStatus, id]);
    return result.affectedRows > 0;
  },

  cancelOrder: async (id) => {
    const pool = await getPool();
    const sql = "UPDATE donhang SET TrangThai = 'Đã hủy' WHERE MaDH = ?";
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  },

  // 1. Lấy dữ liệu sách từ bảng chi tiết giỏ hàng
getCartItemsForCheckout: async (connection, maKH) => {
    // THÊM s.PhanTramGiamGia VÀO CÂU SELECT
    const sql = `
      SELECT c.MaSach, c.SoLuong, s.GiaBan, s.PhanTramGiamGia 
      FROM giohang g
      JOIN chitietgiohang c ON g.MaGioHang = c.MaGioHang
      JOIN sach s ON c.MaSach = s.MaSach
      WHERE g.MaKH = ?
    `;
    const [rows] = await connection.query(sql, [maKH]);
    return rows;
  },

  // 2. Insert header đơn hàng
  insertOrder: async (connection, data) => {
    const sql = `
      INSERT INTO donhang 
      (MaKH, TongTien, PhiVanChuyen, DiaChiGiaoHang, GhiChuGiaoHang, TrangThai, NgayDat)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await connection.query(sql, [
      data.MaKH,
      data.TongTien,
      data.PhiVanChuyen,
      data.DiaChiGiaoHang,
      data.GhiChuGiaoHang,
      data.TrangThai,
    ]);
    return result.insertId;
  },

  // 3. Insert chi tiết đơn hàng (Bulk Insert)
  insertOrderDetails: async (connection, values) => {
    const sql = `INSERT INTO chitietdonhang (MaDH, MaSach, SoLuong, DonGia) VALUES ?`;
    await connection.query(sql, [values]);
  },

  // 4. Xóa sạch giỏ hàng sau khi mua
  // ... (Phần code bên trên của hàm clearCartAfterCheckout giữ nguyên)
  clearCartAfterCheckout: async (connection, maKH) => {
    const sql = `
      DELETE c FROM chitietgiohang c 
      JOIN giohang g ON c.MaGioHang = g.MaGioHang 
      WHERE g.MaKH = ?
    `;
    await connection.query(sql, [maKH]);
  }, // <--- QUAN TRỌNG: Phải có dấu phẩy ở đây để ngăn cách với hàm mới

  // --- DÁN ĐOẠN NÀY VÀO TRƯỚC KHI ĐÓNG OBJECT ---
  getTopSelling: async () => {
    const pool = await getPool();
    const sql = `
      SELECT s.TenSach, SUM(c.SoLuong) as TongSoLuong
      FROM chitietdonhang c
      JOIN sach s ON c.MaSach = s.MaSach
      JOIN donhang d ON c.MaDH = d.MaDH
      WHERE d.TrangThai = 'Đã giao' 
      GROUP BY s.MaSach, s.TenSach
      ORDER BY TongSoLuong DESC
      LIMIT 5
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },
  // ----------------------------------------------
}; 

export default Order;
