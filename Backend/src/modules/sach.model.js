export const SQL_GET_ALL_SACH = `
  SELECT MaSach, TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan,
         MaTG, MaNXB, MaLinhVuc, MaLoaiSach
  FROM SACH
`;

export const SQL_GET_SACH_BY_ID = `
  SELECT MaSach, TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan,
         MaTG, MaNXB, MaLinhVuc, MaLoaiSach
  FROM SACH WHERE MaSach = @id
`;

export const SQL_INSERT_SACH = `
  INSERT INTO SACH (TenSach, AnhBia, LanTaiBan, GiaBan, NamXuatBan, MaTG, MaNXB, MaLinhVuc, MaLoaiSach)
  VALUES (@TenSach, @AnhBia, @LanTaiBan, @GiaBan, @NamXuatBan, @MaTG, @MaNXB, @MaLinhVuc, @MaLoaiSach);
  SELECT SCOPE_IDENTITY() AS MaSach;
`;

export const SQL_UPDATE_SACH = `
  UPDATE SACH
  SET TenSach=@TenSach, AnhBia=@AnhBia, LanTaiBan=@LanTaiBan,
      GiaBan=@GiaBan, NamXuatBan=@NamXuatBan,
      MaTG=@MaTG, MaNXB=@MaNXB, MaLinhVuc=@MaLinhVuc, MaLoaiSach=@MaLoaiSach
  WHERE MaSach=@MaSach;
`;

export const SQL_DELETE_SACH = `DELETE FROM SACH WHERE MaSach=@id`;
