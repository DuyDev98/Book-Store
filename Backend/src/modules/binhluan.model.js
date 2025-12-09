export const SQL_ADD_COMMENT = `
    INSERT INTO binhluan (MaKH, MaSach, NoiDung) VALUES (?, ?, ?)
`;

export const SQL_GET_COMMENTS_BY_BOOK = `
    SELECT bl.*, kh.HoTen 
    FROM binhluan bl
    JOIN khachhang kh ON bl.MaKH = kh.MaKH
    WHERE bl.MaSach = ?
    ORDER BY bl.NgayBinhLuan DESC
`;