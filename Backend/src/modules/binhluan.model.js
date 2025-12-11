import { getPool } from "../config/db.js";

// --- [USER] ---
// Thêm bình luận (Mặc định 'pending' để chờ duyệt)
export const SQL_ADD_COMMENT = "INSERT INTO binhluan (MaKH, MaSach, NoiDung, NgayBinhLuan, TrangThai) VALUES (?, ?, ?, NOW(), 'pending')";

// Lấy bình luận hiển thị ra web (Chỉ lấy 'approved')
export const SQL_GET_COMMENTS_BY_BOOK = `
    SELECT bl.*, kh.HoTen, kh.Username 
    FROM binhluan bl 
    JOIN khachhang kh ON bl.MaKH = kh.MaKH 
    WHERE bl.MaSach = ? AND bl.TrangThai = 'approved' 
    ORDER BY bl.NgayBinhLuan DESC
`;

// --- [ADMIN] ---
// Lấy danh sách có điều kiện LỌC (WHERE ...)
// Logic: Nếu tham số là NULL thì bỏ qua điều kiện đó
export const SQL_ADMIN_GET_ALL = `
    SELECT bl.*, kh.HoTen, kh.Email, s.TenSach 
    FROM binhluan bl
    JOIN khachhang kh ON bl.MaKH = kh.MaKH
    JOIN sach s ON bl.MaSach = s.MaSach
    WHERE 
        (bl.NoiDung LIKE ? OR kh.HoTen LIKE ? OR kh.Username LIKE ?) 
        AND (? IS NULL OR bl.TrangThai = ?)
        AND (? IS NULL OR bl.MaSach = ?)
    ORDER BY bl.NgayBinhLuan DESC
`;

// Cập nhật trạng thái (Duyệt/Ẩn)
export const SQL_ADMIN_UPDATE_STATUS = "UPDATE binhluan SET TrangThai = ? WHERE MaBL = ?";

// Xóa bình luận
export const SQL_ADMIN_DELETE = "DELETE FROM binhluan WHERE MaBL = ?";