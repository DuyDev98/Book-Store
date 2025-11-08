import { getPool } from "../config/db.js";

const User = {
  // Thêm user mới
  async create({ Username, PassWord, VaiTro = "User" }) {
    const pool = await getPool();

    const query = `
      INSERT INTO User (Username, PassWord, VaiTro)
      VALUES (?, ?, ?)
    `;

    await pool.query(query, [Username, PassWord, VaiTro]);

    return { Username, VaiTro };
  },
};

export default User;
