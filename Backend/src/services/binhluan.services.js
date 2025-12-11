import { getPool } from "../config/db.js";
import * as Model from "../modules/binhluan.model.js";

// --- [USER SERVICES] ---
export const addComment = async (MaKH, MaSach, NoiDung) => {
    const pool = await getPool();
    const [result] = await pool.query(Model.SQL_ADD_COMMENT, [MaKH, MaSach, NoiDung]);
    return result;
};

export const getCommentsByBook = async (MaSach) => {
    const pool = await getPool();
    const [rows] = await pool.query(Model.SQL_GET_COMMENTS_BY_BOOK, [MaSach]);
    return rows;
};

// --- [ADMIN SERVICES] ---
export const getAllCommentsAdmin = async (keyword, status, bookId) => {
    try {
        const pool = await getPool();
        
        // Chuẩn bị tham số
        const search = `%${keyword || ''}%`; // Tìm gần đúng (Ví dụ: %hay%)
        const filterStatus = status || null; // Nếu rỗng thì là null
        const filterBook = bookId || null;   // Nếu rỗng thì là null

        // Truyền vào 7 dấu chấm hỏi (?) trong SQL theo đúng thứ tự:
        // 1,2,3: search (NoiDung, HoTen, Username)
        // 4,5: status (Check null, Giá trị)
        // 6,7: book (Check null, Giá trị)
        const [rows] = await pool.query(Model.SQL_ADMIN_GET_ALL, [
            search, search, search,     
            filterStatus, filterStatus, 
            filterBook, filterBook      
        ]);
        return rows;
    } catch (err) {
        throw new Error("Lỗi lấy danh sách Admin: " + err.message);
    }
};

export const updateStatus = async (id, status) => {
    const pool = await getPool();
    await pool.query(Model.SQL_ADMIN_UPDATE_STATUS, [status, id]);
    return true;
};

export const deleteComment = async (id) => {
    const pool = await getPool();
    await pool.query(Model.SQL_ADMIN_DELETE, [id]);
    return true;
};