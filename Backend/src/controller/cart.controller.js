import { CartService } from "../services/cart.services.js";
import { CartDetailService } from "../services/cartDetail.services.js";

export const CartController = {
  // Thêm vào giỏ
  async addToCart(req, res) {
    try {
      // Lấy MaKH từ Token (Middleware đã giải mã)
      const MaKH = req.user.MaKH;
      const { MaSach, SoLuong } = req.body;

      if (!MaKH)
        return res
          .status(401)
          .json({ message: "Lỗi Token: Không tìm thấy mã khách hàng" });
      if (!MaSach) return res.status(400).json({ message: "Thiếu mã sách" });

      // Logic thêm giỏ hàng
      let cart = await CartService.getCartByCustomer(MaKH);
      let MaGioHang = cart
        ? cart.MaGioHang
        : await CartService.createCart(MaKH);

      await CartDetailService.addItem(MaGioHang, MaSach, SoLuong || 1);

      res.status(200).json({ status: "OK", message: "Đã thêm vào giỏ hàng!" });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  // Cập nhật
  async updateItem(req, res) {
    try {
      const MaKH = req.user.MaKH;
      const { MaSach, SoLuong } = req.body;
      const cart = await CartService.getCartByCustomer(MaKH);

      if (cart) {
        if (SoLuong <= 0)
          await CartDetailService.removeItem(cart.MaGioHang, MaSach);
        else
          await CartDetailService.updateItem(cart.MaGioHang, MaSach, SoLuong);
      }
      res.status(200).json({ status: "OK", message: "Đã cập nhật" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Xóa
  async removeItem(req, res) {
    try {
      const MaKH = req.user.MaKH;
      const { MaSach } = req.body;
      const cart = await CartService.getCartByCustomer(MaKH);
      if (cart) await CartDetailService.removeItem(cart.MaGioHang, MaSach);
      res.status(200).json({ status: "OK", message: "Đã xóa" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Lấy giỏ hàng
  async get(req, res) {
    try {
      const MaKH = req.user.MaKH;
      const cart = await CartService.getCartByCustomer(MaKH);
      if (!cart)
        return res.status(200).json({ status: "OK", data: [], total: 0 });

      const items = await CartDetailService.getItems(cart.MaGioHang);
      const tongTien = items.reduce((sum, item) => sum + item.ThanhTien, 0);
      res.status(200).json({ status: "OK", info: cart, data: items, tongTien });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    /* ... giữ nguyên hoặc bỏ qua ... */
  },
};
