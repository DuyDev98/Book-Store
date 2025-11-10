// src/modules/cart.model.js

// =============================================
// 🧺 BẢNG GIỎ HÀNG (GIOHANG)
// =============================================
export const SQL_CREATE_GIOHANG = `
  CREATE TABLE IF NOT EXISTS giohang (
    MaGioHang INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );
`;

// =============================================
// 📚 BẢNG CHI TIẾT GIỎ HÀNG (CHITIETGIOHANG)
// =============================================
export const SQL_CREATE_CHITIET_GIOHANG = `
  CREATE TABLE IF NOT EXISTS chitietgiohang (
    MaGioHang INT NOT NULL,
    MaSach INT NOT NULL,
    SoLuong INT DEFAULT 1,
    PRIMARY KEY (MaGioHang, MaSach),
    FOREIGN KEY (MaGioHang) REFERENCES giohang(MaGioHang)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (MaSach) REFERENCES sach(MaSach)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );
`;

// =============================================
// 🧾 TRUY VẤN THAO TÁC
// =============================================

// ➕ Thêm giỏ hàng mới
export const SQL_INSERT_GIOHANG = `
  INSERT INTO giohang (MaKH) VALUES (?);
`;

// ➕ Thêm sách vào giỏ hàng
export const SQL_INSERT_CHITIET_GIOHANG = `
  INSERT INTO chitietgiohang (MaGioHang, MaSach, SoLuong)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE SoLuong = SoLuong + VALUES(SoLuong);
`;

// 🗑️ Xóa 1 sách khỏi giỏ
export const SQL_DELETE_CHITIET_GIOHANG = `
  DELETE FROM chitietgiohang
  WHERE MaGioHang = ? AND MaSach = ?;
`;

// 📦 Lấy toàn bộ sách trong giỏ hàng
export const SQL_SELECT_GIOHANG = `
  SELECT gh.MaGioHang, gh.MaKH, gh.NgayTao,
         s.MaSach, s.TenSach, s.GiaBan, ctg.SoLuong,
         (s.GiaBan * ctg.SoLuong) AS ThanhTien
  FROM giohang gh
  JOIN chitietgiohang ctg ON gh.MaGioHang = ctg.MaGioHang
  JOIN sach s ON s.MaSach = ctg.MaSach
  WHERE gh.MaGioHang = ?;
`;

// =============================================
// 🏷️ TÊN BẢNG DÙNG CHUNG
// =============================================
export const CartModel = {
  tableGioHang: "giohang",
  tableChiTiet: "chitietgiohang",
};
