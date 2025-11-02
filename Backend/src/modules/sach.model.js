export const SACH_FIELDS = [
  "MaSach","TenSach","MaLoaiSach","MaNXB","MaTG",
  "GiaBia","SoLuong","MoTa","HinhAnh","NgayCapNhat"
];

export const SQL_GET_ALL_SACH = `SELECT * FROM SACH`;
export const SQL_GET_SACH_BY_ID = `SELECT * FROM SACH WHERE MaSach = @id`;
export const SQL_INSERT_SACH = `
  INSERT INTO SACH (TenSach, MaLoaiSach, MaNXB, MaTG, GiaBia, SoLuong, MoTa, HinhAnh)
  VALUES (@TenSach,@MaLoaiSach,@MaNXB,@MaTG,@GiaBia,@SoLuong,@MoTa,@HinhAnh);
  SELECT SCOPE_IDENTITY() AS MaSach;
`;
export const SQL_UPDATE_SACH = `
  UPDATE SACH SET TenSach=@TenSach, MaLoaiSach=@MaLoaiSach, MaNXB=@MaNXB,
    MaTG=@MaTG, GiaBia=@GiaBia, SoLuong=@SoLuong, MoTa=@MoTa, HinhAnh=@HinhAnh
  WHERE MaSach=@MaSach;
`;
export const SQL_DELETE_SACH = `DELETE FROM SACH WHERE MaSach=@id`;


