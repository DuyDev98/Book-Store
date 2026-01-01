// File: src/models/sach.model.js
const TABLE_NAME = 'sach';

// 1. Lấy tất cả sách (s.* tự động lấy thêm PhanTramGiamGia và GiaSale)
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

// 2. Lấy chi tiết 1 sách
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

// 3. Thêm sách mới (Đã thêm PhanTramGiamGia, GiaSale - Tổng 13 tham số)
export const SQL_CREATE = `
  INSERT INTO ${TABLE_NAME} 
  (TenSach, AnhBia, GiaBan, SoLuongTon, NamXuatBan, LanTaiBan, MoTa, MaTG, MaNXB, MaLoaiSach, MaDanhMuc, PhanTramGiamGia, GiaSale) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 4. Cập nhật sách (Đã thêm PhanTramGiamGia, GiaSale - Tổng 14 tham số tính cả ID)
export const SQL_UPDATE = `
  UPDATE ${TABLE_NAME} 
  SET TenSach=?, AnhBia=?, GiaBan=?, SoLuongTon=?, NamXuatBan=?, LanTaiBan=?, MoTa=?, MaTG=?, MaNXB=?, MaLoaiSach=?, MaDanhMuc=?, PhanTramGiamGia=?, GiaSale=? 
  WHERE MaSach = ?
`;

export const SQL_DELETE = `DELETE FROM ${TABLE_NAME} WHERE MaSach = ?`;

export const SQL_COUNT_LOW_STOCK = `
  SELECT COUNT(*) AS SoLuong 
  FROM ${TABLE_NAME} 
  WHERE SoLuongTon < 10
`;

export const SQL_GET_LOW_STOCK_ITEMS = `
  SELECT * FROM ${TABLE_NAME} 
  WHERE SoLuongTon < 10 
  ORDER BY SoLuongTon ASC
`;

export const SQL_IMPORT_STOCK = `
  UPDATE ${TABLE_NAME} 
  SET SoLuongTon = IFNULL(SoLuongTon, 0) + ? 
  WHERE MaSach = ?
`;

export const SQL_STATS_REVENUE_7DAYS = `
    SELECT 
        DATE_FORMAT(NgayDat, '%d/%m') as Ngay, 
        SUM(TongTien) as DoanhThu
    FROM donhang
    WHERE NgayDat >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
    AND TrangThai = 'Đã giao'
    GROUP BY DATE_FORMAT(NgayDat, '%d/%m')
    ORDER BY NgayDat ASC
`;

export const SQL_STATS_TOP_SELLING = `
    SELECT s.TenSach, SUM(ct.SoLuong) as TongSoLuong
    FROM chitietdonhang ct
    JOIN sach s ON ct.MaSach = s.MaSach
    JOIN donhang dh ON ct.MaDH = dh.MaDH
    WHERE dh.TrangThai = 'Đã giao'
    GROUP BY s.TenSach
    ORDER BY TongSoLuong DESC
    LIMIT 5
`;