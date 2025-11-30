// models/nhaxuatban.model.js
import { getPool } from "../config/db.js";

export default class NXBModel {
  static async getAll() {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM nhaxuatban");
    return rows;
  }

  static async create({ TenNXB, NamThanhLap, DiaChi }) {
    const pool = await getPool();
    const [result] = await pool.query(
      "INSERT INTO nhaxuatban (TenNXB, NamThanhLap, DiaChi) VALUES (?, ?, ?)",
      [TenNXB, NamThanhLap, DiaChi]
    );
    return result;
  }

  static async update(MaNXB, { TenNXB, NamThanhLap, DiaChi }) {
    const pool = await getPool();
    const [result] = await pool.query(
      "UPDATE nhaxuatban SET TenNXB=?, NamThanhLap=?, DiaChi=? WHERE MaNXB=?",
      [TenNXB, NamThanhLap, DiaChi, MaNXB]
    );
    return result;
  }

  static async delete(MaNXB) {
    const pool = await getPool();
    const [result] = await pool.query("DELETE FROM nhaxuatban WHERE MaNXB=?", [
      MaNXB,
    ]);
    return result;
  }
}
