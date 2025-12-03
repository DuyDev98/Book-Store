// File: src/models/sach.model.js
const TABLE_NAME = 'sach';

// SỬA: Đổi 'nxb' thành 'nhaxuatban' cho đúng với Database của bạn
export const SQL_GET_ALL = `
  SELECT s.*, 
         tg.TenTG, 
         nxb.TenNXB, 
         ls.TenLoaiSach, 
         dm.TenDanhMuc 
  FROM ${TABLE_NAME} s
  LEFT JOIN tacgia tg ON s.MaTG = tg.MaTG
  LEFT JOIN nhaxuatban nxb ON s.MaNXB = nxb.MaNXB  
  LEFT JOIN loaisach ls ON s.MaLoaiSach = ls.MaLoaiSach
  LEFT JOIN danhmuc dm ON s.MaDanhMuc = dm.MaDanhMuc
`;

// Các câu lệnh dưới giữ nguyên
export const SQL_GET_BY_ID = `SELECT * FROM ${TABLE_NAME} WHERE MaSach = ?`;

export const SQL_CREATE = `
  INSERT INTO ${TABLE_NAME} 
  (TenSach, AnhBia, GiaBan, SoLuongTon, NamXuatBan, LanTaiBan, MoTa, MaTG, MaNXB, MaLoaiSach, MaDanhMuc) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const SQL_UPDATE = `
  UPDATE ${TABLE_NAME} 
  SET TenSach=?, AnhBia=?, GiaBan=?, SoLuongTon=?, NamXuatBan=?, LanTaiBan=?, MoTa=?, MaTG=?, MaNXB=?, MaLoaiSach=?, MaDanhMuc=? 
  WHERE MaSach = ?
`;

export const SQL_DELETE = `DELETE FROM ${TABLE_NAME} WHERE MaSach = ?`;

export const SQL_IMPORT_STOCK = `
  UPDATE ${TABLE_NAME} 
  SET SoLuongTon = IFNULL(SoLuongTon, 0) + ? 
  WHERE MaSach = ?
`;