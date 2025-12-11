import OrderModel from "../modules/Order.model.js";

// Lấy danh sách và format ngày tháng cho đẹp
export const getAllOrders = async () => {
  const orders = await OrderModel.getAll();

  return orders.map((order) => ({
    ...order,
    NgayDat: new Date(order.NgayDat).toLocaleDateString("vi-VN"),
    TongTienFormatted: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(order.TongTien),
  }));
};

// Lấy chi tiết
export const getOrderDetails = async (id) => {
  const orderData = await OrderModel.getById(id);

  if (!orderData) {
    throw new Error("Đơn hàng không tồn tại"); // Ném lỗi để Controller bắt
  }

  // Có thể thêm logic tính toán lại tổng tiền nếu cần thiết ở đây
  return orderData;
};

// Cập nhật trạng thái
export const updateOrderStatus = async (id, status) => {
  // Logic validation: Chỉ cho phép các trạng thái hợp lệ
  const validStatuses = [
    "Chờ xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  const success = await OrderModel.updateStatus(id, status);
  if (!success) {
    throw new Error("Không tìm thấy đơn hàng để cập nhật");
  }
  return true;
};

// Hủy đơn
export const cancelOrder = async (id) => {
  // Logic kiểm tra: Nếu đơn hàng đã "Đang giao" hoặc "Đã giao" thì không cho hủy (Ví dụ)
  const orderData = await OrderModel.getById(id);
  if (
    orderData &&
    (orderData.info.TrangThai === "Đang giao" ||
      orderData.info.TrangThai === "Đã giao")
  ) {
    throw new Error("Không thể hủy đơn hàng đã đi giao");
  }

  const success = await OrderModel.cancelOrder(id);
  if (!success) {
    throw new Error("Hủy đơn thất bại");
  }
  return true;
};
