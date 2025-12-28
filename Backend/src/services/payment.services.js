import { getPool } from "../config/db.js";
import {
  getCartItems,
  getStock,
  createHoaDon,
  addChiTietHoaDon,
  giamSoLuongKho,
  clearCart,
} from "../modules/payment.module.js";

export const thanhToanService = async (MaKH) => {
  const pool = await getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Lấy giỏ hàng
    const [cartItems] = await getCartItems(MaKH);
    if (cartItems.length === 0) throw new Error("Giỏ hàng trống!");

    // Check tồn kho
    for (let item of cartItems) {
      const [kho] = await getStock(item.MaSach);
      if (!kho.length || kho[0].SoLuong < item.SoLuong) {
        throw new Error(`Sản phẩm ${item.MaSach} không đủ hàng`);
      }
    }

    // Tính tổng tiền (Đã sửa để tính Sale)
    let tongTien = cartItems.reduce((sum, item) => {
      const giaGoc = Number(item.GiaBan);
      const phanTram = Number(item.PhanTramGiamGia || 0);
      let giaThucTe = giaGoc;
      
      if (phanTram > 0) {
        giaThucTe = giaGoc * (1 - phanTram / 100);
      }
      
      return sum + (item.SoLuong * giaThucTe);
    }, 0);

    // Tạo hóa đơn
    const MaHoaDon = await createHoaDon(conn, MaKH, tongTien);

    // Insert chi tiết + trừ kho
    for (let item of cartItems) {
      await addChiTietHoaDon(conn, MaHoaDon, item);
      await giamSoLuongKho(conn, item);
    }

    // Xoá giỏ hàng
    await clearCart(conn, MaKH);

    await conn.commit();

    return { MaHoaDon, tongTien };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
