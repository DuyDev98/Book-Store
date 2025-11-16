import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '123456',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'BOOKSTORE',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

export const getPool = async () => {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(config).connect();
      console.log("✅ SQL Server connected");
    }
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
};

export { sql };
