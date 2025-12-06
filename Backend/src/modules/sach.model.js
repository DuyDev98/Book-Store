// File: src/models/sach.model.js
const TABLE_NAME = 'sach';

// 1. Lấy tất cả sách (Cho trang chủ & Admin)
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

// 2. Lấy chi tiết 1 sách (QUAN TRỌNG: Đã thêm JOIN để lấy tên TG, NXB)
export const SQL_GET_BY_ID = `
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
  WHERE s.MaSach = ?
`;

// 3. Các câu lệnh khác (Giữ nguyên)
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