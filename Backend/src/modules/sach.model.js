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

//  Đếm số lượng sách sắp hết hàng (Ví dụ: Tồn kho < 10)
export const SQL_COUNT_LOW_STOCK = `
  SELECT COUNT(*) AS SoLuong 
  FROM ${TABLE_NAME} 
  WHERE SoLuongTon < 10
`;

//  Lấy danh sách chi tiết các sách sắp hết (Để hiển thị nếu cần)
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


// 1. Thống kê doanh thu 7 ngày qua (Group by Ngày)
export const SQL_STATS_REVENUE_7DAYS = `
    SELECT 
        FORMAT(NgayDat, 'dd/MM') as Ngay, 
        SUM(TongTien) as DoanhThu
    FROM DonHang
    WHERE NgayDat >= DATEADD(DAY, -7, GETDATE()) 
    AND TrangThai != N'Đã hủy'
    GROUP BY FORMAT(NgayDat, 'dd/MM')
    ORDER BY Ngay ASC
`;

// 2. Top 5 sách bán chạy nhất (Tính theo số lượng bán)
export const SQL_STATS_TOP_SELLING = `
    SELECT TOP 5 s.TenSach, SUM(ct.SoLuong) as DaBan
    FROM ChiTietDonHang ct
    JOIN Sach s ON ct.MaSach = s.MaSach
    JOIN DonHang dh ON ct.MaDH = dh.MaDH
    WHERE dh.TrangThai != N'Đã hủy'
    GROUP BY s.TenSach
    ORDER BY DaBan DESC
`;