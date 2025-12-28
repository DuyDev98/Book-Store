import OrderModel from "../modules/Order.model.js";
import { getPool } from "../config/db.js";
// Lấy danh sách và format ngày tháng cho đẹp
// ... import

export const getAllOrders = async () => {
  const orders = await OrderModel.getAll();

  return orders.map((order) => ({
    ...order,
    // --- SỬA Ở ĐÂY: ---
    // Không format NgayDat thành chuỗi "dd/mm/yyyy" nữa.
    // Hãy để nguyên object Date hoặc chuỗi ISO từ Database để Frontend tính toán biểu đồ.
    NgayDat: order.NgayDat, 
    // ------------------
    
    TongTienFormatted: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(order.TongTien),
  }));
};

// ... các hàm khác giữ nguyên
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
export const createClientOrder = async (orderData) => {
  const pool = await getPool();
  const connection = await pool.getConnection(); // Lấy 1 kết nối riêng

  try {
    await connection.beginTransaction(); // Bắt đầu giao dịch

    const {
      MaKH,
      TenNguoiNhan,
      SDT,
      DiaChiGiaoHang,
      GhiChu,
      PhuongThucThanhToan,
    } = orderData;

    // Bước 1: Kiểm tra giỏ hàng
    const cartItems = await OrderModel.getCartItemsForCheckout(
      connection,
      MaKH
    );
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Giỏ hàng trống, không thể thanh toán!");
    }

    // Bước 2: Tính tổng tiền (Server tự tính từ DB)
    const tongTien = cartItems.reduce(
      (total, item) => total + Number(item.GiaBan) * item.SoLuong,
      0
    );

    // Bước 3: Format ghi chú (Gộp thông tin người nhận)
    const fullGhiChu = `${GhiChu || ""}`;

    // Bước 4: Tạo đơn hàng
    const newOrderId = await OrderModel.insertOrder(connection, {
      MaKH,
      TongTien: tongTien,
      PhiVanChuyen: 0,
      DiaChiGiaoHang,
      GhiChuGiaoHang: fullGhiChu,
      TrangThai: "ChoDuyet", // Hoặc 'Chờ xác nhận'
    });

    // Bước 5: Tạo chi tiết đơn hàng
    const detailValues = cartItems.map((item) => [
      newOrderId,
      item.MaSach,
      item.SoLuong,
      item.GiaBan,
    ]);
    await OrderModel.insertOrderDetails(connection, detailValues);

    // Bước 6: Xóa giỏ hàng
    await OrderModel.clearCartAfterCheckout(connection, MaKH);

    await connection.commit(); // Thành công -> Lưu DB

    return {
      success: true,
      message: "Đặt hàng thành công",
      orderId: newOrderId,
      total: tongTien,
    };
  } catch (error) {
    await connection.rollback(); // Lỗi -> Hoàn tác
    throw error;
  } finally {
    connection.release(); // Trả kết nối về hồ
  }
};

export const getTopSellingBooks = async () => {
  return await OrderModel.getTopSelling();
};
