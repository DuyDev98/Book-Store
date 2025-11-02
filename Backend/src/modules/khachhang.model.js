export const SQL_GET_ALL_KHACHHANG = `SELECT * FROM KHACHHANG`;
export const SQL_GET_KH_BY_ID = `SELECT * FROM KHACHHANG WHERE MaKH=@id`;
export const SQL_INSERT_KH = `
  INSERT INTO KHACHHANG (TenKH, Email, DiaChi, DienThoai)
  VALUES (@TenKH,@Email,@DiaChi,@DienThoai);
  SELECT SCOPE_IDENTITY() AS MaKH;
`;
