import { getPool } from "../config/db.js";
import * as Model from "../modules/binhluan.model.js";

// --- [USER SERVICES] ---

// 1. Thêm bình luận
export const addComment = async (MaKH, MaSach, NoiDung) => {
    try {
        const pool = await getPool();
        // Model.SQL_ADD_COMMENT có 3 dấu ? (MaKH, MaSach, NoiDung)
        const [result] = await pool.query(Model.SQL_ADD_COMMENT, [MaKH, MaSach, NoiDung]);
        return result;
    } catch (err) {
        throw new Error("Lỗi service thêm bình luận: " + err.message);
    }
};

// 2. Lấy bình luận theo sách
export const getCommentsByBook = async (MaSach) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query(Model.SQL_GET_COMMENTS_BY_BOOK, [MaSach]);
        return rows;
    } catch (err) {
        throw new Error("Lỗi service lấy bình luận: " + err.message);
    }
};

// --- [ADMIN SERVICES] ---

// 3. Lấy danh sách quản lý
export const getAllCommentsAdmin = async () => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query(Model.SQL_ADMIN_GET_ALL);
        return rows;
    } catch (err) {
        throw new Error("Lỗi lấy danh sách Admin: " + err.message);
    }
};

// 4. Cập nhật trạng thái (Duyệt/Ẩn)
export const updateStatus = async (id, status) => {
    try {
        const pool = await getPool();
        // [status, id] phải khớp thứ tự ? trong SQL: SET TrangThai = ? WHERE MaBL = ?
        await pool.query(Model.SQL_ADMIN_UPDATE_STATUS, [status, id]);
        return true;
    } catch (err) {
        throw new Error("Lỗi cập nhật trạng thái: " + err.message);
    }
};

// 5. Xóa bình luận
export const deleteComment = async (id) => {
    try {
        const pool = await getPool();
        await pool.query(Model.SQL_ADMIN_DELETE, [id]);
        return true;
    } catch (err) {
        throw new Error("Lỗi xóa bình luận: " + err.message);
    }
};