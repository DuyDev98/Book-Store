// File: src/services/sach.services.js
import { getPool } from "../config/db.js";
import * as sachModel from "../modules/sach.model.js"; 

// Hàm bổ trợ tính giá Sale
const calculateSalePrice = (giaBan, phanTram) => {
  const price = parseFloat(giaBan) || 0;
  const percent = parseInt(phanTram) || 0;
  return percent > 0 ? price * (1 - percent / 100) : null;
};

export const getAll = async () => {
  const pool = await getPool();
  const [rows] = await pool.query(sachModel.SQL_GET_ALL);
  return rows; 
};

export const getById = async (id) => {
  const pool = await getPool();
  const [rows] = await pool.query(sachModel.SQL_GET_BY_ID, [id]);
  return rows[0];
};

export const create = async (data) => {
  const pool = await getPool();
  const giaSale = calculateSalePrice(data.GiaBan, data.PhanTramGiamGia);
  
  const params = [
    data.TenSach,
    data.AnhBia || null,
    data.GiaBan || 0,
    data.SoLuongTon || 0,
    data.NamXuatBan || null,
    data.LanTaiBan || null,
    data.MoTa || '',
    data.MaTG || null,
    data.MaNXB || null,
    data.MaLoaiSach || null,
    data.MaDanhMuc || null,
    data.PhanTramGiamGia || 0,
    giaSale
  ];
  const [result] = await pool.query(sachModel.SQL_CREATE, params);
  return result;
};

export const update = async (id, data) => {
  const pool = await getPool();
  const giaSale = calculateSalePrice(data.GiaBan, data.PhanTramGiamGia);

  const params = [
    data.TenSach,
    data.AnhBia || null,
    data.GiaBan,
    data.SoLuongTon,
    data.NamXuatBan,
    data.LanTaiBan,
    data.MoTa,
    data.MaTG,
    data.MaNXB,
    data.MaLoaiSach,
    data.MaDanhMuc,
    data.PhanTramGiamGia || 0,
    giaSale,
    id
  ];
  const [result] = await pool.query(sachModel.SQL_UPDATE, params);
  return result;
};

export const remove = async (id) => {
  const pool = await getPool();
  const [result] = await pool.query(sachModel.SQL_DELETE, [id]);
  return result;
};

export const importStock = async (id, soLuongNhap) => {
  const pool = await getPool();
  const [result] = await pool.query(sachModel.SQL_IMPORT_STOCK, [soLuongNhap, id]);
  return result;
};

export const getLowStockCount = async () => {
  const pool = await getPool();
  const [rows] = await pool.query(sachModel.SQL_COUNT_LOW_STOCK);
  return rows[0]; 
};

export const getLowStockList = async () => {
  const pool = await getPool();
  const [rows] = await pool.query(sachModel.SQL_GET_LOW_STOCK_ITEMS); 
  return rows; 
};

export const getRevenueStats = async () => {
    const pool = await getPool();
    const [rows] = await pool.query(sachModel.SQL_STATS_REVENUE_7DAYS);
    return rows;
};

export const getTopSellingStats = async () => {
    const pool = await getPool();
    const [rows] = await pool.query(sachModel.SQL_STATS_TOP_SELLING);
    return rows;
};
// ... (các phần trên giữ nguyên)

// SỬA LẠI HÀM NÀY:
export const getRelatedBooks = async (maLoaiSach, currentId) => {
  // 1. Phải lấy connection từ getPool()
  const pool = await getPool(); 
  
  // 2. Sửa câu Query: dùng đúng tên cột MaLoaiSach
  const query = `
    SELECT * FROM Sach 
    WHERE MaLoaiSach = ? AND MaSach != ? 
    LIMIT 4
  `;
  
  try {
      // 3. Dùng pool.query (thay vì db.execute bị lỗi)
      const [rows] = await pool.query(query, [maLoaiSach, currentId]);
      return rows;
  } catch (error) {
      console.error("Lỗi SQL Related Books:", error); // Log ra để dễ debug
      throw error;
  }
};