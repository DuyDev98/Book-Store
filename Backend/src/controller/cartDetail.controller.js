import { CartDetailService } from "../services/cartDetail.services.js";

export const CartDetailController = {
  async add(req, res) {
    try {
      const { MaGioHang, MaSach, SoLuong } = req.body;
      if (!MaGioHang || !MaSach || !SoLuong)
        return res.status(400).json({ message: "Thiếu dữ liệu!" });

      await CartDetailService.addItem(MaGioHang, MaSach, SoLuong);
      res.status(200).json({ status: "OK", message: "Đã thêm sản phẩm vào giỏ!" });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { MaGioHang, MaSach, SoLuong } = req.body;
      await CartDetailService.updateItem(MaGioHang, MaSach, SoLuong);
      res.status(200).json({ status: "OK", message: "Đã cập nhật số lượng!" });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { MaGioHang, MaSach } = req.body;
      await CartDetailService.removeItem(MaGioHang, MaSach);
      res.status(200).json({ status: "OK", message: "Đã xóa sản phẩm!" });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },

  async get(req, res) {
    try {
      const { MaGioHang } = req.params;
      const data = await CartDetailService.getItems(MaGioHang);

      const tongTien = data.reduce((sum, item) => sum + item.ThanhTien, 0);
      res.status(200).json({ status: "OK", tongTien, data });
    } catch (err) {
      res.status(500).json({ status: "ERR", message: err.message });
    }
  },
};
