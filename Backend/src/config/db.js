// ✅ Kết nối MySQL dùng Promise (hỗ trợ async/await)
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// ⚙️ Cấu hình database
const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "haduybg81",
  database: process.env.DB_NAME || "bookstore",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// ⚙️ Biến kết nối (pool)
let pool;

// ✅ Hàm khởi tạo kết nối MySQL (Singleton pattern)
export const getPool = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(config);
      console.log("✅ MySQL connected successfully!");
    }

    const conn = await pool.getConnection();
    console.log("✅ Database connection verified");
    conn.release();

    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    throw err;
  }
};
