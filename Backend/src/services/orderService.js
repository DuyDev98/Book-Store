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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

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

    // --- SỬA ĐOẠN TÍNH TỔNG TIỀN NÀY ---
    // Bước 2: Tính tổng tiền (Server tự tính từ DB có áp dụng Sale)
    const tongTien = cartItems.reduce((total, item) => {
      const giaGoc = Number(item.GiaBan);
      const phanTram = Number(item.PhanTramGiamGia || 0);
      let giaThucTe = giaGoc;

      if (phanTram > 0) {
        giaThucTe = giaGoc * (1 - phanTram / 100);
      }
      
      return total + (giaThucTe * item.SoLuong);
    }, 0);
    // -------------------------------------

    // Bước 3: Format ghi chú
    const fullGhiChu = `${GhiChu || ""}`;

    // Bước 4: Tạo đơn hàng
    const newOrderId = await OrderModel.insertOrder(connection, {
      MaKH,
      TongTien: tongTien,
      PhiVanChuyen: 0,
      DiaChiGiaoHang,
      GhiChuGiaoHang: fullGhiChu,
      TrangThai: "ChoDuyet",
    });

    // --- SỬA ĐOẠN INSERT CHI TIẾT NÀY ---
    // Bước 5: Tạo chi tiết đơn hàng (Lưu giá thực tế đã giảm vào DB)
    const detailValues = cartItems.map((item) => {
       const giaGoc = Number(item.GiaBan);
       const phanTram = Number(item.PhanTramGiamGia || 0);
       let giaThucTe = giaGoc;

       if (phanTram > 0) {
         giaThucTe = giaGoc * (1 - phanTram / 100);
       }
       
       return [
        newOrderId,
        item.MaSach,
        item.SoLuong,
        giaThucTe, // Lưu giá bán thực tế (Sale) thay vì giá gốc
      ];
    });
    
    await OrderModel.insertOrderDetails(connection, detailValues);
    // -------------------------------------

    // Bước 6: Xóa giỏ hàng
    await OrderModel.clearCartAfterCheckout(connection, MaKH);

    await connection.commit();

    return {
      success: true,
      message: "Đặt hàng thành công",
      orderId: newOrderId,
      total: tongTien,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getTopSellingBooks = async () => {
  return await OrderModel.getTopSelling();
};
