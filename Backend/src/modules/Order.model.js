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
};

export default Order;
