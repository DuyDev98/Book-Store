export const SQL_INSERT_DETAIL = `
  INSERT INTO chitietgiohang (MaGioHang, MaSach, SoLuong)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE SoLuong = SoLuong + VALUES(SoLuong)
`;

export const SQL_DELETE_DETAIL = `
  DELETE FROM chitietgiohang WHERE MaGioHang = ? AND MaSach = ?
`;

export const SQL_UPDATE_DETAIL = `
  UPDATE chitietgiohang SET SoLuong = ? WHERE MaGioHang = ? AND MaSach = ?
`;

export const SQL_SELECT_DETAIL_BY_CART = `
  SELECT s.MaSach, s.TenSach, s.GiaBan, s.AnhBia, c.SoLuong,
         (s.GiaBan * c.SoLuong) AS ThanhTien
  FROM chitietgiohang c
  JOIN sach s ON c.MaSach = s.MaSach
  WHERE c.MaGioHang = ?
`;
