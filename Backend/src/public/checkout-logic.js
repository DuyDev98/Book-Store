/* ==========================================================================
   LOGIC THANH TOÁN (CHECKOUT)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  loadCustomerInfo();
  loadCheckoutCart();
});

// 1. Kiểm tra đăng nhập
function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập để thanh toán!");
    window.location.href = "../components/login.html";
  }
}

// 2. Lấy thông tin khách hàng từ Profile điền vào Form
async function loadCustomerInfo() {
  const userId = localStorage.getItem("MaKH");
  if (!userId) return;

  try {
    // Lưu ý: Đảm bảo API_BASE_URL trong script.js đúng port backend
    // Nếu API Khách hàng khác đường dẫn, hãy sửa lại url bên dưới
    const res = await fetch(`${API_BASE_URL}/khachhang/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.data || data; // Tùy cấu trúc trả về của Backend

      // Điền tự động vào form
      if (document.getElementById("checkout-name"))
        document.getElementById("checkout-name").value = user.HoTen || "";

      if (document.getElementById("checkout-phone"))
        document.getElementById("checkout-phone").value = user.SDienThoai || "";

      if (document.getElementById("checkout-email"))
        document.getElementById("checkout-email").value = user.Email || "";

      if (document.getElementById("checkout-address"))
        document.getElementById("checkout-address").value = user.DiaChi || "";
    }
  } catch (err) {
    console.error("Lỗi tải thông tin khách hàng:", err);
  }
}

// 3. Lấy sản phẩm từ Giỏ hàng hiển thị sang bên phải
let currentCartTotal = 0; // Biến lưu tổng tiền để gửi đi

async function loadCheckoutCart() {
  const userId = localStorage.getItem("MaKH");
  const container = document.getElementById("checkout-items");
  const subTotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  try {
    const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();

    if (data.status !== "OK" || !data.data || data.data.length === 0) {
      container.innerHTML = `<p class="text-center text-danger">Giỏ hàng trống!</p>`;
      window.location.href = "cart.html"; // Quay về giỏ nếu rỗng
      return;
    }

    let html = "";
    currentCartTotal = data.tongTien || 0;

    data.data.forEach((item) => {
      // Xử lý ảnh (Copy logic từ script.js)
      let img =
        item.AnhBia && item.AnhBia !== "null"
          ? item.AnhBia
          : "https://placehold.co/100";
      if (!img.startsWith("http")) img = "../" + img.replace(/^\//, ""); // Chỉnh đường dẫn ảnh tương đối

      html += `
            <div class="d-flex align-items-center mb-3">
                <div class="position-relative me-3">
                    <img src="${img}" style="width: 60px; height: 80px; object-fit: cover" class="rounded border">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                        ${item.SoLuong}
                    </span>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 text-truncate" style="max-width: 180px;">${
                      item.TenSach
                    }</h6>
                    <small class="text-muted">${formatCurrency(
                      item.GiaBan
                    )}</small>
                </div>
                <div class="text-end fw-bold text-dark">
                    ${formatCurrency(item.ThanhTien)}
                </div>
            </div>`;
    });

    container.innerHTML = html;
    if (subTotalEl) subTotalEl.innerText = formatCurrency(currentCartTotal);
    if (totalEl) totalEl.innerText = formatCurrency(currentCartTotal);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-danger">Lỗi tải đơn hàng</p>`;
  }
}

// 4. Xử lý nút ĐẶT HÀNG
/* ==========================================================================
   CẤU HÌNH TÀI KHOẢN NHẬN TIỀN (SỬ DỤNG VIETQR)
   ========================================================================== */
const BANK_ID = "MB"; // Ví dụ: MB, VCB, ACB, TPB...
const ACCOUNT_NO = "0846201105"; // Số tài khoản của bạn
const ACCOUNT_NAME = "TRAN DINH KHANH DUY"; // Tên chủ tài khoản (Tuỳ chọn hiển thị)

// Biến lưu dữ liệu đơn hàng tạm thời trước khi gửi lên server
let pendingOrderData = null;

// 4. Xử lý nút ĐẶT HÀNG
window.processCheckout = async function () {
  const name = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const address = document.getElementById("checkout-address").value.trim();
  const note = document.getElementById("checkout-note").value.trim();

  // Lấy phương thức thanh toán
  const paymentMethodEl = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  if (!paymentMethodEl) {
    alert("Vui lòng chọn phương thức thanh toán!");
    return;
  }
  const paymentMethod = paymentMethodEl.id; // paymentCOD hoặc paymentVNPAY

  if (!name || !phone || !address) {
    alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
    return;
  }

  // Chuẩn bị dữ liệu đơn hàng
  pendingOrderData = {
    MaKH: localStorage.getItem("MaKH"),
    TenNguoiNhan: name,
    SDT: phone,
    DiaChiGiaoHang: address,
    GhiChu: note,
    PhuongThucThanhToan: paymentMethod === "paymentVNPAY" ? "VNPAY" : "COD",
    TongTien: currentCartTotal, // Biến toàn cục từ hàm loadCheckoutCart
  };

  // LOGIC RẼ NHÁNH
  if (paymentMethod === "paymentVNPAY") {
    // ==> NẾU LÀ VNPAY: HIỆN QR
    showQRPayment(pendingOrderData.TongTien, pendingOrderData.SDT);
  } else {
    // ==> NẾU LÀ COD: GỬI ĐƠN LUÔN
    if (confirm("Xác nhận đặt hàng thanh toán khi nhận hàng (COD)?")) {
      submitOrder(pendingOrderData);
    }
  }
};

/// 5. Hàm hiển thị QR Code (Phiên bản Fix lỗi CSS Bootstrap)
function showQRPayment(amount, phone) {
  const modalEl = document.getElementById("paymentModal");
  const qrImg = document.getElementById("payment-qr-img");
  const qrLoader = document.getElementById("qr-loader");
  const contentEl = document.getElementById("qr-content");
  const amountEl = document.getElementById("qr-amount");

  if (!amount || amount <= 0) {
    alert("Lỗi: Số tiền không hợp lệ!");
    return;
  }

  const addInfo = `THANHTOAN ${phone}`;
  const qrSource = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    addInfo
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  contentEl.innerText = addInfo;
  amountEl.innerText = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

  // --- RESET GIAO DIỆN ---
  qrImg.style.display = "none";
  qrImg.src = "";

  // Bật Loading: Thêm lại class d-flex để nó căn giữa
  qrLoader.classList.remove("d-none");
  qrLoader.classList.add("d-flex");

  // --- HÀM XỬ LÝ KHI TẢI XONG ---
  const onImageLoaded = () => {
    // QUAN TRỌNG: Xóa class d-flex thì mới ẩn được cái vòng xoay
    qrLoader.classList.remove("d-flex");
    qrLoader.classList.add("d-none");

    qrImg.style.display = "block";
  };

  qrImg.onload = onImageLoaded;

  qrImg.onerror = () => {
    qrLoader.classList.remove("d-flex");
    qrLoader.classList.add("d-none");
    alert("Không tải được mã QR. Kiểm tra lại STK ngân hàng!");
  };

  qrImg.src = qrSource;

  // Kiểm tra cache (nếu ảnh có sẵn thì hiện luôn)
  if (qrImg.complete && qrImg.naturalWidth !== 0) {
    onImageLoaded();
  }

  // Dự phòng: Ép tắt sau 3s (dùng remove class)
  setTimeout(() => {
    if (qrLoader.classList.contains("d-flex")) {
      console.log("Force hide loader");
      qrLoader.classList.remove("d-flex");
      qrLoader.classList.add("d-none");
      qrImg.style.display = "block";
    }
  }, 3000);

  new bootstrap.Modal(modalEl).show();
}
// 6. Hàm xác nhận "Đã thanh toán xong" từ Modal
window.confirmPaymentSuccess = function () {
  // Ẩn modal
  const modalEl = document.getElementById("paymentModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  // Gửi đơn hàng lên Server
  // Lưu ý: Ở dự án thật, bạn nên gọi API kiểm tra biến động số dư ngân hàng ở đây.
  // Với dự án này, ta tin tưởng người dùng đã bấm nút là đã chuyển.
  alert("Hệ thống đang ghi nhận thanh toán...");
  submitOrder(pendingOrderData);
};

// 7. Hàm gửi đơn hàng lên API (Tách ra để dùng chung)
async function submitOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    const result = await res.json();

    if (res.ok && (result.status === "OK" || result.success)) {
      alert("🎉 Đặt hàng thành công! Cảm ơn bạn.");
      window.location.href = "../index.html";
    } else {
      alert("❌ Đặt hàng thất bại: " + (result.message || "Lỗi server"));
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối khi đặt hàng!");
  }
}
