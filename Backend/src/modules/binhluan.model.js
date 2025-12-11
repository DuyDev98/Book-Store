import { getPool } from "../config/db.js";

// --- SỬA LẠI: ĐỂ DB TỰ ĐIỀN TRẠNG THÁI (TRÁNH LỖI) ---
// Ta bỏ cột TrangThai trong câu lệnh này đi, Database sẽ tự điền 'pending'
export const SQL_ADD_COMMENT = "INSERT INTO binhluan (MaKH, MaSach, NoiDung, NgayBinhLuan) VALUES (?, ?, ?, NOW())";

// Lấy danh sách (Chỉ lấy đã duyệt)
export const SQL_GET_COMMENTS_BY_BOOK = `
    SELECT bl.*, kh.HoTen, kh.Username 
    FROM binhluan bl 
    JOIN khachhang kh ON bl.MaKH = kh.MaKH 
    WHERE bl.MaSach = ? AND bl.TrangThai = 'approved' 
    ORDER BY bl.NgayBinhLuan DESC
`;

// Lấy danh sách Admin (Lấy hết)
export const SQL_ADMIN_GET_ALL = `
    SELECT bl.*, kh.HoTen, kh.Email, s.TenSach 
    FROM binhluan bl
    JOIN khachhang kh ON bl.MaKH = kh.MaKH
    JOIN sach s ON bl.MaSach = s.MaSach
    ORDER BY bl.NgayBinhLuan DESC
`;

// Admin duyệt/ẩn/xóa
export const SQL_ADMIN_UPDATE_STATUS = "UPDATE binhluan SET TrangThai = ? WHERE MaBL = ?";
export const SQL_ADMIN_DELETE = "DELETE FROM binhluan WHERE MaBL = ?";