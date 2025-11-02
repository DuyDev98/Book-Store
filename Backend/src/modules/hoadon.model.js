export const SQL_CREATE_HOADON = `
  INSERT INTO HOADON (MaKH, NgayLap, TongTien, TrangThai)
  VALUES (@MaKH, GETDATE(), @TongTien, @TrangThai);
  SELECT SCOPE_IDENTITY() AS MaHoaDon;
`;
export const SQL_GET_HOADON_BY_ID = `SELECT * FROM HOADON WHERE MaHoaDon=@id`;
export const SQL_INSERT_CHITIET = `
  INSERT INTO CHITIETHOADON (MaHoaDon, MaSach, SoLuong, DonGia)
  VALUES (@MaHoaDon,@MaSach,@SoLuong,@DonGia);
`;
