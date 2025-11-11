import { CartService } from "../services/cart.services.js";

export const CartController = {
  async create(req, res) {
    try {
      const { MaKH } = req.body;
      if (!MaKH) return res.status(400).json({ message: "Thiếu MaKH!" });

      const MaGioHang = await CartService.createCart(MaKH);
      res.status(200).json({ status: "OK", MaGioHang });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  async get(req, res) {
    try {
      const { MaKH } = req.params;
      const data = await CartService.getCartByCustomer(MaKH);
      res.status(200).json({ status: "OK", data });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },
};
