import { getPool } from '../config/db.js';  // Kết nối đến database qua getPool

//sách theo id
export const getCategoryById = async (MaLoaiSach) => {
  const pool = await getPool();
  const query = 'SELECT * FROM loaisach WHERE MaLoaiSach = ?';
  const [rows] = await pool.query(query, [MaLoaiSach]);  // Thực thi câu lệnh SQL với tham số
  return rows[0];  // Trả về loại sách đầu tiên (nếu có)
}
// Lấy tất cả loại sách
export const getAllCategories = async () => {
  const pool = await getPool();  // Kết nối tới DB
  const [rows] = await pool.query('SELECT * FROM loaisach');  // Lấy dữ liệu
  return rows;  // Trả về kết quả dạng mảng các loại sách
};

// Thêm loại sách
export const addCategory = async (TenLoaiSach) => {
  const pool = await getPool();
  const query = 'INSERT INTO loaisach (TenLoaiSach) VALUES (?)';
  const [result] = await pool.query(query, [TenLoaiSach]);  // Thực thi câu lệnh SQL
  return result;  // Trả về kết quả sau khi thêm
};

// Cập nhật loại sách
export const updateCategory = async (MaLoaiSach, TenLoaiSach) => {
  const pool = await getPool();
  const query = 'UPDATE loaisach SET TenLoaiSach = ? WHERE MaLoaiSach = ?';
  const [result] = await pool.query(query, [TenLoaiSach, MaLoaiSach]);  
    console.log('Update result:', result);
  return result;  // Trả về kết quả sau khi cập nhật
};

// Xóa loại sách
export const deleteCategory = async (MaLoaiSach) => {
  const pool = await getPool();
  const query = 'DELETE FROM loaisach WHERE MaLoaiSach = ?';
  const [result] = await pool.query(query, [MaLoaiSach]);  // Xóa loại sách
  return result;  // Trả về kết quả xóa
};
