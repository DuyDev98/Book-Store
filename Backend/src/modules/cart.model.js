export const SQL_CREATE_CART = `
  INSERT INTO giohang (MaKH) VALUES (?)
`;

export const SQL_GET_CART_BY_CUSTOMER = `
  SELECT * FROM giohang WHERE MaKH = ?
`;
