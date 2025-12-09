import { getPool } from "../config/db.js";
import { SQL_ADD_COMMENT, SQL_GET_COMMENTS_BY_BOOK } from "../modules/binhluan.model.js";

export const BinhLuanController = {
  // Thêm bình luận
  async add(req, res) {
    try {
      const { MaKH, MaSach, NoiDung } = req.body;
      if (!MaKH || !MaSach || !NoiDung) 
        return res.status(400).json({ message: "Thiếu thông tin!" });

      const pool = await getPool();
      await pool.query(SQL_ADD_COMMENT, [MaKH, MaSach, NoiDung]);
      
      res.status(200).json({ status: "OK", message: "Đã gửi bình luận" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Lấy danh sách bình luận theo sách
  async getByBook(req, res) {
    try {
      const { MaSach } = req.params;
      const pool = await getPool();
      const [rows] = await pool.query(SQL_GET_COMMENTS_BY_BOOK, [MaSach]);
      
      res.status(200).json({ status: "OK", data: rows });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};