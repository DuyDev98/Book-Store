import { getPool } from "../config/db.js";

const KhachHang = {
  // Hàm tạo mới
  async create({ Username, HoTen, DiaChi, SDienThoai, Email }) {
    const pool = await getPool();
    const query = `INSERT INTO khachhang (Username, HoTen, DiaChi, SDienThoai, Email) VALUES (?, ?, ?, ?, ?)`;
    await pool.query(query, [Username, HoTen, DiaChi, SDienThoai, Email]);
    return { Username, HoTen, Email };
  }, // <--- CÓ DẤU PHẨY Ở ĐÂY

  // Hàm kiểm tra tồn tại
  async exists({ Username, Email }) {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang WHERE Username = ? OR Email = ?`;
    const [rows] = await pool.query(query, [Username, Email]);
    return rows.length > 0;
  }, // <--- CÓ DẤU PHẨY Ở ĐÂY

  // Hàm lấy tất cả
  async getAllKH() {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang`;
    const [rows] = await pool.query(query);
    return rows;
  }, // <--- CÓ DẤU PHẨY Ở ĐÂY

  // --- Hàm lấy theo ID ---
  async getById(id) {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang WHERE MaKH = ?`; 
    const [rows] = await pool.query(query, [id]);
    return rows[0]; 
  }, // <--- BẠN ĐANG THIẾU DẤU PHẨY NÀY NÊN BỊ LỖI

  // --- Hàm tìm theo Username ---
  async getByUsername(username) {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang WHERE Username = ?`; 
    const [rows] = await pool.query(query, [username]);
    return rows[0]; 
  }, // <--- THÊM DẤU PHẨY

  // --- Update theo ID (Số) ---
  async updateById(id, { HoTen, DiaChi, SDienThoai, Email }) {
    const pool = await getPool();
    const query = `
      UPDATE khachhang 
      SET HoTen = ?, DiaChi = ?, SDienThoai = ?, Email = ?
      WHERE MaKH = ?
    `;
    await pool.query(query, [HoTen, DiaChi, SDienThoai, Email, id]);
    return { MaKH: id, HoTen, DiaChi, SDienThoai, Email };
  }, // <--- THÊM DẤU PHẨY

  // --- Update theo Username (Chữ) ---
  async updateByUsername(username, { HoTen, DiaChi, SDienThoai, Email }) {
    const pool = await getPool();
    const query = `
      UPDATE khachhang 
      SET HoTen = ?, DiaChi = ?, SDienThoai = ?, Email = ?
      WHERE Username = ?
    `;
    await pool.query(query, [HoTen, DiaChi, SDienThoai, Email, username]);
    return { Username: username, HoTen, DiaChi, SDienThoai, Email };
  }
};

export default KhachHang;