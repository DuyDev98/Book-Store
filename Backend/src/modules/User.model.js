import { getPool } from "../config/db.js";

const User = {
  async create({ Username, PassWord, VaiTro = "User" }) {
    const pool = await getPool();



    const query = `INSERT INTO user (Username, PassWord, VaiTro) VALUES (?, ?, ?)`;
    await pool.query(query, [Username, PassWord, VaiTro]);
    return { Username, VaiTro };
  },

  async findOne(Username) {
    const pool = await getPool();

    const query = `SELECT * FROM user WHERE Username = ? LIMIT 1`;
    const [rows] = await pool.query(query, [Username]);
    return rows[0] || null;
  },
};

export default User;
