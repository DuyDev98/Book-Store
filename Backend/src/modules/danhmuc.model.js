// Lưu ý: Đảm bảo bảng trong CSDL của bạn có cột 'ParentID' (hoặc MaDMCha).
// Nếu chưa có, hãy chạy SQL: ALTER TABLE danhmuc ADD COLUMN ParentID INT DEFAULT NULL;

export const SQL_GET_ALL_DANHMUC = `
  SELECT * FROM danhmuc
`;

export const SQL_GET_DANHMUC_BY_ID = `
  SELECT * FROM danhmuc WHERE MaDanhMuc = ?
`;

export const SQL_CREATE_DANHMUC = `
  INSERT INTO danhmuc (TenDanhMuc, ParentID) VALUES (?, ?)
`;

export const SQL_UPDATE_DANHMUC = `
  UPDATE danhmuc SET TenDanhMuc = ?, ParentID = ? WHERE MaDanhMuc = ?
`;

export const SQL_DELETE_DANHMUC = `
  DELETE FROM danhmuc WHERE MaDanhMuc = ?
`;