// controller/cart.controller.js
import * as cartService from "../services/cart.services.js";

export const createCart = async (req, res) => {
  try {
    const { MaKH } = req.body;
    if (!MaKH) return res.status(400).json({ message: "Thiếu mã khách hàng" });

    const maGioHang = await cartService.createCart(MaKH);
    res.json({ message: "Tạo giỏ hàng thành công", MaGioHang: maGioHang });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo giỏ hàng: " + error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { MaGioHang, MaSach, SoLuong } = req.body;
    await cartService.addToCart(MaGioHang, MaSach, SoLuong);
    res.json({ message: "Đã thêm sách vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm vào giỏ hàng: " + error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await cartService.getCartItems(id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy giỏ hàng: " + error.message });
  }
};
