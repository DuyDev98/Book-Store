export const SQL_GET_ALL_SACH = `
  SELECT 
    s.MaSach, s.TenSach, s.AnhBia, s.LanTaiBan, s.GiaBan, s.NamXuatBan,
    s.MaTG, s.MaNXB, s.MaLoaiSach, s.MaDanhMuc,
    d.TenDanhMuc
  FROM sach s
  LEFT JOIN danhmuc d ON s.MaDanhMuc = d.MaDanhMuc;
`;

export const SQL_GET_SACH_BY_ID = `
  SELECT 
    s.MaSach, s.TenSach, s.AnhBia, s.LanTaiBan, s.GiaBan, s.NamXuatBan,
    s.MaTG, s.MaNXB, s.MaLoaiSach, s.MaDanhMuc,
    d.TenDanhMuc
  FROM sach s
  LEFT JOIN danhmuc d ON s.MaDanhMuc = d.MaDanhMuc
  WHERE s.MaSach = ?;
`;

export const SQL_INSERT_SACH = `
  INSERT INTO sach 
  (TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan, MaTG, MaNXB, MaLoaiSach, MaDanhMuc)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const SQL_UPDATE_SACH = `
  UPDATE sach
  SET TenSach=?, AnhBia=?, LanTaiBan=?, GiaBan=?, NamXuatBan=?, 
      MaTG=?, MaNXB=?, MaLoaiSach=?, MaDanhMuc=?
  WHERE MaSach=?;
`;

export const SQL_DELETE_SACH = `
  DELETE FROM sach WHERE MaSach=?;
`;
