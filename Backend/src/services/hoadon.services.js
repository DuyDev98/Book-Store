import { getPool, sql } from "../config/db.js";
import * as model from "../modules/hoadon.model.js";

export const createHoaDon = async (maKH, tongTien, items=[]) => {
  const pool = await getPool();
  const r = await pool.request()
    .input('MaKH', sql.Int, maKH)
    .input('TongTien', sql.Decimal(12,2), tongTien)
    .input('TrangThai', sql.NVarChar(50), 'ChuaThanhToan')
    .query(model.SQL_CREATE_HOADON);

  const maHoaDon = r.recordset[0].MaHoaDon;

  for(const it of items) {
    await pool.request()
      .input('MaHoaDon', sql.Int, maHoaDon)
      .input('MaSach', sql.Int, it.MaSach)
      .input('SoLuong', sql.Int, it.SoLuong)
      .input('DonGia', sql.Decimal(12,2), it.DonGia)
      .query(model.SQL_INSERT_CHITIET);
  }

  return { MaHoaDon: maHoaDon };
};
