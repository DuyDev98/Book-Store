import { getPool } from "../config/db.js";

const User = {
  // Tạo user mới
  async create({ Username, Password, VaiTro = "User" }) {
    const pool = await getPool();

    const query = `
      INSERT INTO User (Username, Password, VaiTro)
      VALUES (?, ?, ?)
    `;

    await pool.query(query, [Username, Password, VaiTro]);

    return { Username, VaiTro };
  },

  // ✅ Tìm user theo Username (thay cho findOne của Mongo)
  async findOne({ Username }) {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM User WHERE Username = ?", [
      Username,
    ]);

    return rows.length > 0 ? rows[0] : null;
  },
};

export default User;
