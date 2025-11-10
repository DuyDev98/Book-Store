export const SQL_GET_ALL_SACH = `
  SELECT MaSach, TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan,
         MaTG, MaNXB, MaLinhVuc, MaLoaiSach
  FROM SACH
`;

export const SQL_GET_SACH_BY_ID = `
  SELECT MaSach, TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan,
         MaTG, MaNXB, MaLinhVuc, MaLoaiSach
  FROM SACH WHERE MaSach = ?
`;

export const SQL_INSERT_SACH = `
  INSERT INTO SACH (TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan, MaTG, MaNXB, MaLinhVuc, MaLoaiSach)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const SQL_UPDATE_SACH = `
  UPDATE SACH
  SET TenSach=?, AnhBia=?, LanTaiBan=?, GiaBan=?, NamXuatBan=?,
      MaTG=?, MaNXB=?, MaLinhVuc=?, MaLoaiSach=?
  WHERE MaSach=?
`;

export const SQL_DELETE_SACH = `DELETE FROM SACH WHERE MaSach=?`;
