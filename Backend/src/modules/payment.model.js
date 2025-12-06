import { getPool } from "../config/db.js";

export const getCartItems = async (MaKH) => {
  const pool = await getPool();
  return pool.query(
    `SELECT c.MaSach, c.SoLuong, s.GiaBan 
     FROM chitietgiohang c 
     JOIN sach s ON c.MaSach = s.MaSach
     JOIN giohang g ON g.MaGioHang = c.MaGioHang
     WHERE g.MaKH = ?`,
    [MaKH]
  );
};

export const getStock = async (MaSach) => {
  const pool = await getPool();
  return pool.query("SELECT SoLuong FROM kho WHERE MaSach = ?", [MaSach]);
};

export const createHoaDon = async (conn, MaKH, TongTien) => {
  const [rs] = await conn.query(
    "INSERT INTO hoadon (MaKH, TongTien, TrangThai) VALUES (?, ?, ?)",
    [MaKH, TongTien, "Đang xử lý"]
  );
  return rs.insertId;
};

export const addChiTietHoaDon = async (conn, MaHoaDon, item) => {
  return conn.query(
    `INSERT INTO chitiethoadon (MaHoaDon, MaSach, SoLuong, DonGia)
     VALUES (?, ?, ?, ?)`,
    [MaHoaDon, item.MaSach, item.SoLuong, item.GiaBan]
  );
};

export const giamSoLuongKho = async (conn, item) => {
  return conn.query("UPDATE kho SET SoLuong = SoLuong - ? WHERE MaSach = ?", [
    item.SoLuong,
    item.MaSach,
  ]);
};

export const clearCart = async (conn, MaKH) => {
  return conn.query(
    `DELETE c 
     FROM chitietgiohang c 
     JOIN giohang g ON c.MaGioHang = g.MaGioHang 
     WHERE g.MaKH = ?`,
    [MaKH]
  );
};
