export const SQL_GET_ALL_KHACHHANG = `SELECT * FROM KHACHHANG`;
export const SQL_GET_KH_BY_ID = `SELECT * FROM KHACHHANG WHERE MaKH=@id`;
export const SQL_INSERT_KH = `
  INSERT INTO KHACHHANG (TenKH, Email, DiaChi, DienThoai)
  VALUES (@TenKH,@Email,@DiaChi,@DienThoai);
  SELECT SCOPE_IDENTITY() AS MaKH;
`;
import { getPool } from "../config/db.js";

const KhachHang = {
  async create({ Username, HoTen, DiaChi, SDienThoai, Email }) {
    const pool = await getPool();

    const query = `
      INSERT INTO khachhang (Username, HoTen, DiaChi, SDienThoai, Email)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(query, [Username, HoTen, DiaChi, SDienThoai, Email]);

    return { Username, HoTen, Email };
  },
  async exists({ Username, Email }) {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang WHERE Username = ? OR Email = ?`;
    const [rows] = await pool.query(query, [Username, Email]);
    return rows.length > 0;
  },
  async getAllKH() {
    const pool = await getPool();
    const query = `SELECT * FROM khachhang`;
    const [rows] = await pool.query(query);
    return rows;
  },
};
export default KhachHang;
