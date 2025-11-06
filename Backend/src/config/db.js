import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',  // Default user for MySQL
  password: process.env.DB_PASS || 'haduybg81',  // Your password here
  database: process.env.DB_NAME || 'bookstore',  // Your DB name
  port: process.env.DB_PORT || 3306,  // Default MySQL port is 3306
};

let pool;

export const getPool = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(config); // Use mysql2 createPool method
      console.log("✅ MySQL connected");
    }
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
};

export { mysql };
