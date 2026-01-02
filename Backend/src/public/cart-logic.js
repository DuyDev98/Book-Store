/* ==========================================================================
   LOGIC GIỎ HÀNG (ADD, REMOVE, UPDATE) - ĐÃ BẢO MẬT VỚI TOKEN
   ========================================================================== */

// Hàm lấy Header chứa Token (Dùng chung cho các request giỏ hàng)
function getCartHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token || "",
  };
}

// Hàm kiểm tra lỗi Token hết hạn (401/403)
function checkCartAuth(res) {
  if (res.status === 401 || res.status === 403) {
    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
    localStorage.clear();
    window.location.href = "../components/login.html"; // Quay về login
    return false;
  }
  return true;
}

// 1. THÊM VÀO GIỎ
/* ==========================================================================
   FIX LỖI: KIỂM TRA TOKEN THAY VÌ MaKH
   ========================================================================== */
async function addToCart(id, qty = 1) {
  // 1. Kiểm tra Token (Chắc chắn hơn MaKH)
  const token = localStorage.getItem("token");

  if (!token) {
    if (confirm("Bạn cần đăng nhập để mua hàng. Đăng nhập ngay?")) {
      window.location.href = "../components/login.html";
    }
    return;
  }

  // 2. Lấy ID sách (Nếu gọi từ trang chi tiết)
  if (!id) {
    id = new URLSearchParams(window.location.search).get("id");
    const qtyInput = document.getElementById("quantity-input");
    if (qtyInput) qty = parseInt(qtyInput.value) || 1;
  }

  if (!id) return alert("Lỗi: Không tìm thấy mã sách!");

  // 3. Gửi API (Kèm Token trong Header)
  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Gửi token để Backend tự lấy MaKH
      },
      body: JSON.stringify({
        MaSach: id,
        SoLuong: qty,
      }),
    });

    const data = await res.json();

    if (res.ok && data.status === "OK") {
      alert("✅ Đã thêm vào giỏ hàng!");
      if (typeof updateCartBadge === "function") updateCartBadge();
    } else if (res.status === 401 || res.status === 403) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "../components/login.html";
    } else {
      alert("Lỗi: " + (data.message || "Không thể thêm vào giỏ"));
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối Server!");
  }
}

// 2. TẢI TRANG GIỎ HÀNG
// 2. TẢI TRANG GIỎ HÀNG
// 2. TẢI TRANG GIỎ HÀNG (ĐÃ SỬA GIÁ KHUYẾN MÃI)
async function loadCartPage() {
  const tbody = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total-price");
  const countEl = document.getElementById("cart-count-item");

  if (!tbody) return;

  if (!localStorage.getItem("token")) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5">Vui lòng đăng nhập để xem giỏ hàng</td></tr>`;
    return;
  }

  try {
    const maKH = localStorage.getItem("MaKH");
    const res = await fetch(`${API_BASE_URL}/cart/${maKH}`, {
      headers: getCartHeaders(),
    });

    if (!checkCartAuth(res)) return;

    const data = await res.json();

    if (data.status !== "OK" || !data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5"><p class="text-muted">Giỏ hàng của bạn đang trống</p></td></tr>`;
      if (totalEl) totalEl.innerText = "0 đ";
      if (countEl) countEl.innerText = "0";
      return;
    }

    // --- CẬP NHẬT TÍNH TOÁN LẠI TỔNG TIỀN ---
    let grandTotal = 0; // Biến tính tổng tiền mới
    let html = "";

    data.data.forEach((item) => {
      // 1. Tính giá thực tế (Nếu có giảm giá thì tính lại)
      let realPrice = item.GiaBan;
      if (item.PhanTramGiamGia > 0) {
        realPrice = item.GiaBan * (1 - item.PhanTramGiamGia / 100);
      }

      // 2. Tính thành tiền của dòng này
      const lineTotal = realPrice * item.SoLuong;
      grandTotal += lineTotal; // Cộng dồn vào tổng giỏ hàng

      // 3. Xử lý ảnh
      let img =
        item.AnhBia && item.AnhBia !== "null"
          ? item.AnhBia
          : "https://placehold.co/100x100?text=No+Img";
      if (!img.startsWith("http")) {
        const depth = window.location.pathname.split("/").length;
        const prefix = depth > 3 ? "../../" : "../";
        img = prefix + img;
      }

      // 4. Hiển thị giá (Có gạch ngang nếu giảm giá)
      let priceDisplay = `<span class="fw-bold text-secondary">${formatCurrency(
        realPrice
      )}</span>`;
      let badge = "";

      if (item.PhanTramGiamGia > 0) {
        // Nếu có giảm giá: Hiện giá gốc gạch ngang + Giá mới màu đỏ
        priceDisplay = `
                    <div><small class="text-decoration-line-through text-muted" style="font-size: 11px;">${formatCurrency(
                      item.GiaBan
                    )}</small></div>
                    <span class="fw-bold text-danger">${formatCurrency(
                      realPrice
                    )}</span>
                `;
        badge = `<span class="badge bg-danger ms-2" style="font-size: 0.6rem;">-${item.PhanTramGiamGia}%</span>`;
      }

      html += `
                <tr class="border-bottom">
                    <td class="text-start ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${img}" style="width: 60px; height: 80px; object-fit: cover;" class="rounded me-3 border">
                            <div>
                                <h6 class="mb-0 text-truncate" style="max-width: 200px;">
                                    ${item.TenSach} 
                                    ${badge}
                                </h6>
                            </div>
                        </div>
                    </td>
                    <td>${priceDisplay}</td>
                    <td>
                        <div class="input-group input-group-sm mx-auto" style="width: 100px;">
                            <button class="btn btn-outline-secondary" onclick="changeCartQuantity(${
                              item.MaSach
                            }, ${item.SoLuong - 1})">-</button>
                            <input type="text" class="form-control text-center bg-white" value="${
                              item.SoLuong
                            }" readonly>
                            <button class="btn btn-outline-secondary" onclick="changeCartQuantity(${
                              item.MaSach
                            }, ${item.SoLuong + 1})">+</button>
                        </div>
                    </td>
                    <td class="fw-bold text-danger">${formatCurrency(
                      lineTotal
                    )}</td>
                    <td>
                        <button class="btn btn-link text-danger p-0" onclick="removeCartItem(${
                          item.MaSach
                        })">
                            <i class="bi bi-trash3-fill fs-5"></i>
                        </button>
                    </td>
                </tr>
            `;
    });

    tbody.innerHTML = html;

    // Cập nhật các con số tổng
    if (countEl) countEl.innerText = data.data.length;
    if (totalEl) totalEl.innerText = formatCurrency(grandTotal);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Lỗi tải dữ liệu!</td></tr>`;
  }
}

// 3. THAY ĐỔI SỐ LƯỢNG
async function changeCartQuantity(maSach, newQty) {
  if (newQty < 1) {
    if (confirm("Bạn muốn xóa sản phẩm này khỏi giỏ?")) {
      removeCartItem(maSach);
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/cart/update`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify({ MaSach: maSach, SoLuong: newQty }),
    });

    if (!checkCartAuth(res)) return; // ✅ SỬA TÊN HÀM
    loadCartPage(); // Tải lại bảng
    if (typeof updateCartBadge === "function") updateCartBadge();
  } catch (err) {
    console.error(err);
    alert("Lỗi cập nhật!");
  }
}

// 4. XÓA SẢN PHẨM
async function removeCartItem(maSach) {
  if (!confirm("Chắc chắn xóa sản phẩm này?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify({ MaSach: maSach }),
    });

    if (!checkCartAuth(res)) return; // ✅ SỬA TÊN HÀM
    loadCartPage();
    if (typeof updateCartBadge === "function") updateCartBadge();
  } catch (err) {
    console.error(err);
    alert("Lỗi xóa sản phẩm!");
  }
}

// 5. CẬP NHẬT BADGE (GỌI TỪ HEADER)
async function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge || !localStorage.getItem("token")) return;

  try {
    const maKH = localStorage.getItem("MaKH");
    const res = await fetch(`${API_BASE_URL}/cart/${maKH}`, {
      headers: getCartHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "OK" && data.data && data.data.length > 0) {
        badge.style.display = "block";
      } else {
        badge.style.display = "none";
      }
    }
  } catch (e) {
    console.error(e);
  }
}
// Thêm hàm này vào cuối file cart-logic.js hoặc sau hàm addToCart
async function buyNow() {
  // 1. Kiểm tra Token đăng nhập (tương tự addToCart)
  const token = localStorage.getItem("token");

  if (!token) {
    if (confirm("Bạn cần đăng nhập để mua hàng. Đăng nhập ngay?")) {
      window.location.href = "../components/login.html";
    }
    return;
  }

  // 2. Lấy ID sách từ URL và số lượng từ input
  const id = new URLSearchParams(window.location.search).get("id");
  const qtyInput = document.getElementById("quantity-input");
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  if (!id) return alert("Lỗi: Không tìm thấy mã sách!");

  // 3. Gửi API thêm vào giỏ hàng
  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        MaSach: id,
        SoLuong: qty,
      }),
    });

    const data = await res.json();

    if (res.ok && data.status === "OK") {
      // Thay vì alert thành công, ta chuyển hướng thẳng đến trang thanh toán
      window.location.href = "checkout.html";
    } else if (res.status === 401 || res.status === 403) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "../components/login.html";
    } else {
      alert("Lỗi: " + (data.message || "Không thể xử lý yêu cầu"));
    }
  } catch (err) {
    console.error("Lỗi Buy Now:", err);
    alert("Lỗi kết nối Server!");
  }
}
// Tự động chạy khi ở trang giỏ hàng
if (document.getElementById("cart-body")) {
  loadCartPage();
}
