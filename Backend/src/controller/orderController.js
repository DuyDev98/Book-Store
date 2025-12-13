import * as orderService from "../services/orderService.js"; // Import Service thay vì Model

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(id);
    res.status(200).json(order);
  } catch (error) {
    // Nếu lỗi là "Đơn hàng không tồn tại" (từ Service), trả về 404
    if (error.message === "Đơn hàng không tồn tại") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await orderService.updateOrderStatus(id, status);

    res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Lỗi logic (validation) trả về 400
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await orderService.cancelOrder(id);

    res.status(200).json({ message: "Đã hủy đơn hàng thành công!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const createOrder = async (req, res) => {
  try {
    const {
      MaKH,
      TenNguoiNhan,
      SDT,
      DiaChiGiaoHang,
      GhiChu,
      PhuongThucThanhToan,
    } = req.body;

    // Validate dữ liệu
    if (!MaKH || !TenNguoiNhan || !SDT || !DiaChiGiaoHang) {
      return res.status(400).json({
        status: "ERROR",
        message: "Vui lòng nhập đầy đủ thông tin giao hàng!",
      });
    }

    // Gọi Service
    const result = await orderService.createClientOrder({
      MaKH,
      TenNguoiNhan,
      SDT,
      DiaChiGiaoHang,
      GhiChu,
      PhuongThucThanhToan,
    });

    // Trả về kết quả
    res.status(200).json({
      status: "OK",
      message: "Đặt hàng thành công!",
      data: result,
    });
  } catch (error) {
    // Nếu lỗi logic (ví dụ giỏ hàng trống)
    if (error.message === "Giỏ hàng trống, không thể thanh toán!") {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
    res
      .status(500)
      .json({ status: "ERROR", message: error.message || "Lỗi server" });
  }
};

export const getTopSelling = async (req, res) => {
  try {
    const data = await orderService.getTopSellingBooks();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
