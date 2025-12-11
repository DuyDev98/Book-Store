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
