import { CartService } from "../services/cart.services.js";
import { CartDetailService } from "../services/cartDetail.services.js";

export const CartController = {
  // 1. Tạo giỏ hàng (Giữ nguyên logic cũ)
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

  // 2. Lấy giỏ hàng & Chi tiết (Giữ nguyên logic cũ)
  async get(req, res) {
    try {
      const { MaKH } = req.params;
      const cart = await CartService.getCartByCustomer(MaKH);
      if (!cart) {
          return res.status(200).json({ status: "OK", data: [], total: 0 });
      }
      const items = await CartDetailService.getItems(cart.MaGioHang);
      // Tính tổng tiền
      const tongTien = items.reduce((sum, item) => sum + item.ThanhTien, 0);
      res.status(200).json({ status: "OK", info: cart, data: items, tongTien });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  // 3. THÊM MỚI: Thêm vào giỏ (Hàm này đang thiếu nên gây lỗi)
  async addToCart(req, res) {
    try {
        const { MaKH, MaSach, SoLuong } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!MaKH || !MaSach) {
           return res.status(400).json({ message: "Thiếu MaKH hoặc MaSach" });
        }

        // Tìm hoặc tạo giỏ hàng
        let cart = await CartService.getCartByCustomer(MaKH);
        let MaGioHang;
        
        if (cart) {
             MaGioHang = cart.MaGioHang;
        } else {
             MaGioHang = await CartService.createCart(MaKH);
        }
        
        // Thêm vào chi tiết
        await CartDetailService.addItem(MaGioHang, MaSach, SoLuong || 1);
        res.status(200).json({ status: "OK", message: "Đã thêm vào giỏ hàng!" });
    } catch (err) {
        console.error("Lỗi addToCart:", err);
        res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  // 4. MỚI: Cập nhật số lượng (Sửa)
  async updateItem(req, res) {
    try {
        const { MaKH, MaSach, SoLuong } = req.body;
        const cart = await CartService.getCartByCustomer(MaKH);
        if (!cart) return res.status(404).json({ message: "Chưa có giỏ hàng" });

        if (SoLuong <= 0) {
            // Nếu số lượng <= 0 thì xóa luôn
            await CartDetailService.removeItem(cart.MaGioHang, MaSach);
        } else {
            await CartDetailService.updateItem(cart.MaGioHang, MaSach, SoLuong);
        }
        res.status(200).json({ status: "OK", message: "Đã cập nhật số lượng" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  // 5. MỚI: Xóa sản phẩm khỏi giỏ (Xóa)
  async removeItem(req, res) {
    try {
        const { MaKH, MaSach } = req.body;
        const cart = await CartService.getCartByCustomer(MaKH);
        if (!cart) return res.status(404).json({ message: "Chưa có giỏ hàng" });

        await CartDetailService.removeItem(cart.MaGioHang, MaSach);
        res.status(200).json({ status: "OK", message: "Đã xóa sản phẩm" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
  }
};