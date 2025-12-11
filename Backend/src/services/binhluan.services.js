import { getPool } from "../config/db.js";
import { SQL_ADD_COMMENT, SQL_GET_COMMENTS_BY_BOOK } from "../modules/binhluan.model.js";

// Thêm bình luận
export const addComment = async (MaKH, MaSach, NoiDung) => {
    try {
        const pool = await getPool();
        const [result] = await pool.query(SQL_ADD_COMMENT, [MaKH, MaSach, NoiDung]);
        return result;
    } catch (err) {
        throw new Error("Lỗi khi thêm bình luận: " + err.message);
    }
};

// Lấy danh sách bình luận
export const getCommentsByBook = async (MaSach) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query(SQL_GET_COMMENTS_BY_BOOK, [MaSach]);
        return rows;
    } catch (err) {
        throw new Error("Lỗi lấy danh sách bình luận: " + err.message);
    }
};