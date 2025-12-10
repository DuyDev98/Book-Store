import { getPool } from "../config/db.js";

// File này chỉ chứa các câu lệnh SQL, KHÔNG chứa logic

// 1. Tìm thông tin User (Kèm MaKH từ bảng khachhang)
export const SQL_GET_USER_BY_USERNAME = `
  SELECT u.*, k.MaKH, k.HoTen 
  FROM user u
  LEFT JOIN khachhang k ON u.Username = k.Username
  WHERE u.Username = ? 
  LIMIT 1
`;

// 2. Thêm tài khoản vào bảng User
export const SQL_ADD_USER = `
  INSERT INTO user (Username, PassWord, VaiTro) 
  VALUES (?, ?, ?)
`;

// 3. Thêm thông tin vào bảng Khách Hàng (Quan trọng: Để sinh ra MaKH)
export const SQL_ADD_CUSTOMER = `
  INSERT INTO khachhang (Username, HoTen) 
  VALUES (?, ?)
`;