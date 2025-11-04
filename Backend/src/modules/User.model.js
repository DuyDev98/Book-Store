import { getPool, sql } from "../config/db.js";

const User = {
  // Thêm user mới
  async create({ Username, PassWord, VaiTro = "User" }) {
    const pool = await getPool();

    const query = `
      INSERT INTO [USER] (Username, PassWord, VaiTro)
      VALUES (@Username, @PassWord, @VaiTro)
    `;

    const request = pool.request();
    request.input("Username", sql.NVarChar, Username);
    request.input("PassWord", sql.NVarChar, PassWord);
    request.input("VaiTro", sql.NVarChar, VaiTro);

    await request.query(query);
    return { Username, VaiTro };
  },
};

export default User;
