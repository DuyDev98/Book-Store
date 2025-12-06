/* ==========================================================================
   1. CẤU HÌNH & HÀM TIỆN ÍCH
   ========================================================================== */

// ⚠️ QUAN TRỌNG: Đảm bảo Port 3000 khớp với port Backend đang chạy
const API_BASE_URL = "http://localhost:5001/api"; 

// Lấy ID khách hàng (Tạm thời mặc định là 1 nếu chưa làm Đăng nhập)
const CURRENT_USER_ID = localStorage.getItem("MaKH") || 1;

/**
 * Định dạng tiền tệ VNĐ
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/* ==========================================================================
   2. GLOBAL LOGIC (HEADER, FOOTER)
   ========================================================================== */

async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  let prefix = el.getAttribute("data-prefix") || "";
  if (!prefix) {
    const depth = window.location.pathname.split("/").length;
    if (depth > 3) prefix = "../../";
  }

  try {
    const res = await fetch(`${prefix}components/${file}`);
    if (!res.ok) throw new Error(`Lỗi tải ${file}`);
    const html = await res.text();
    el.innerHTML = html;

    // Fix đường dẫn ảnh/link trong component
    el.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith(prefix)) {
         if (src.startsWith("images/") || src.startsWith("public/") || src.startsWith("logo/")) {
             img.src = prefix + src;
         }
      }
    });

    el.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith(prefix)) {
            if (href.startsWith("pages/") || href.startsWith("index.html")) {
                a.href = prefix + href;
            }
        }
    });

    // Fix nút Logo về trang chủ
    el.querySelectorAll("button[onclick*='index.html']").forEach((btn) => {
        btn.setAttribute("onclick", `window.location.href='${prefix}index.html'`);
    });
  } catch (err) {
    console.error(err);
  }
}

function highlightActiveCategory() {
    const currentPageFile = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".sidebar a");
    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.split("/").pop() === currentPageFile) {
            link.classList.remove("text-dark");
            link.classList.add("active", "text-danger", "fw-bold");
            const parentSubmenu = link.closest(".submenu");
            if (parentSubmenu) parentSubmenu.style.display = "block";
        }
    });
}

/* ==========================================================================
   3. LOGIC HIỂN THỊ SÁCH (TRANG CHỦ / DANH MỤC)
   ========================================================================== */

const CATEGORY_MAP = {
  "hot-sale": -1,
  "ngoai-thuong": 1, "marketing-ban-hang": 2, "tai-chinh-tien-te": 3, "quan-tri-lanh-dao": 4,
  "khoa-hoc-xa-hoi": 5, "am-nhac-my-thuat": 6, "truyen-tranh": 7, "phe-binh-van-hoc": 8,
  "phong-su-ky-su": 9, "tho-ca": 10, "tieu-thuyet": 11, "bi-quyet-lam-dep": 12,
  "gia-dinh-hanh-phuc": 13, "nha-o-vat-nuoi": 14, "hoc-lam-nguoi": 15, "danh-nhan": 16,
  "tam-ly": 17, "sgk": 18, "giao-trinh": 19, "ngoai-ngu": 20, "tu-dien": 21,
  "tin-hoc": 22, "thieu-nhi": 23
};

async function loadBooksForPage() {
  const container = document.getElementById("product-list-container");
  if (!container) return;

  const bookListSection = container.closest("[data-api-category]");
  if (!bookListSection) return;

  const categorySlug = bookListSection.getAttribute("data-api-category");
  const targetId = CATEGORY_MAP[categorySlug];

  container.innerHTML = '<p class="text-center w-100 text-muted">Đang tải sách...</p>';

  try {
    const res = await fetch(`${API_BASE_URL}/sach`);
    const data = await res.json();
    // Xử lý dữ liệu trả về (Mảng hoặc {data: Mảng})
    const allBooks = Array.isArray(data) ? data : data.data || [];

    let filteredBooks = allBooks;
    if (targetId !== undefined && targetId !== -1) {
      filteredBooks = allBooks.filter((book) => book.MaLoaiSach == targetId);
    }

    renderBooks(container, filteredBooks);
  } catch (err) {
    console.error("Lỗi tải sách:", err);
    container.innerHTML = `<p class="text-center text-danger">Lỗi kết nối Server Backend! (Hãy chạy npm start)</p>`;
  }
}

function renderBooks(container, books) {
  container.innerHTML = "";
  if (!books || books.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-5"><h4>Chưa có sách nào</h4></div>`;
    return;
  }

  // Tự động xác định link chi tiết
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const detailBaseUrl = isInPagesFolder ? "detail-book.html" : "pages/detail-book.html";

  let html = "";
  books.forEach((b) => {
    let imgUrl = (b.AnhBia && b.AnhBia !== "null") ? b.AnhBia : "https://placehold.co/200x300?text=No+Img";
    const detailLink = `${detailBaseUrl}?id=${b.MaSach}`;
    const price = b.GiaBan ? parseInt(b.GiaBan).toLocaleString("vi-VN") : 0;

    html += `
        <div class="col-6 col-md-3 mb-4">
            <div class="card h-100 border-0 shadow-sm product-card">
                <div class="position-relative overflow-hidden text-center p-3">
                    <a href="${detailLink}">
                        <img src="${imgUrl}" class="card-img-top" style="height: 220px; object-fit: contain;" onerror="this.src='https://placehold.co/200x300?text=Error'">
                    </a>
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate" title="${b.TenSach}">
                        <a href="${detailLink}" class="text-decoration-none text-dark fw-bold">${b.TenSach}</a>
                    </h6>
                    <p class="card-text text-danger fw-bold mb-1">${price} đ</p>
                    <small class="text-muted mb-3 d-block text-truncate">${b.TenTG || "Đang cập nhật"}</small>
                    <div class="mt-auto">
                        <button class="btn btn-outline-danger w-100 btn-sm" onclick="addToCart(${b.MaSach}, 1)">
                            <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
  });
  container.innerHTML = html;
}

/* ==========================================================================
   4. LOGIC CHI TIẾT SÁCH (detail-book.html)
   ========================================================================== */

async function loadBookDetail() {
  if (!document.getElementById("book-title")) return;

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (!bookId) {
    document.getElementById("book-title").innerText = "Không tìm thấy sản phẩm!";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/sach/${bookId}`);
    if (!res.ok) throw new Error("Lỗi API");
    const book = await res.json();
    renderBookToHTML(book);
  } catch (error) {
    console.error(error);
    document.getElementById("book-title").innerText = "Lỗi kết nối hoặc không tìm thấy sách!";
  }
}

function renderBookToHTML(book) {
  // 1. Thông tin cơ bản
  document.title = book.TenSach;
  if(document.getElementById("breadcrumb-title")) document.getElementById("breadcrumb-title").innerText = book.TenSach;
  if(document.getElementById("book-title")) document.getElementById("book-title").innerText = book.TenSach;
  if(document.getElementById("book-sku")) document.getElementById("book-sku").innerText = book.MaSach;
  
  if(document.getElementById("book-author")) document.getElementById("book-author").innerText = book.TenTG || "Đang cập nhật";
  if(document.getElementById("book-publisher")) document.getElementById("book-publisher").innerText = book.TenNXB || "Đang cập nhật";
  
  // 2. Mô tả & Giá
  if(document.getElementById("book-description")) {
      const desc = book.MoTa ? book.MoTa.replace(/\n/g, "<br>") : "<em>Chưa có mô tả.</em>";
      document.getElementById("book-description").innerHTML = desc;
  }
  if(document.getElementById("price-final")) document.getElementById("price-final").innerText = formatCurrency(book.GiaBan);
  
  // 3. Ảnh
  const mainImg = document.getElementById("main-image");
  if (mainImg) {
    mainImg.src = (book.AnhBia && book.AnhBia !== 'null') ? book.AnhBia : "https://placehold.co/400x600?text=No+Img";
  }

  // 4. Thông số chi tiết (Điền vào bảng Thông số chính)
  const specsEl = document.getElementById("specs-list");
  if (specsEl) {
      specsEl.innerHTML = `
        <li class="mb-2 pb-1 border-bottom">
            <span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Danh mục:</span>
            <span>${book.TenDanhMuc || "---"}</span>
        </li>
        <li class="mb-2 pb-1 border-bottom">
            <span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Loại sách:</span>
            <span>${book.TenLoaiSach || "---"}</span>
        </li>
        <li class="mb-2 pb-1 border-bottom">
            <span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Năm xuất bản:</span>
            <span>${book.NamXuatBan || "---"}</span>
        </li>
        <li class="mb-2 pb-1 border-bottom">
            <span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Lần tái bản:</span>
            <span>${book.LanTaiBan || "1"}</span>
        </li>
        <li class="mb-2 pb-1 border-bottom">
            <span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Tồn kho:</span>
            <span class="${book.SoLuongTon > 0 ? 'text-success' : 'text-danger'} fw-bold">
                ${book.SoLuongTon > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
        </li>
      `;
  }

  // 5. Cập nhật nút Thêm vào giỏ
  const addToCartBtn = document.querySelector("button[onclick*='addToCart']");
  if(addToCartBtn) {
      addToCartBtn.onclick = () => {
          const qtyInput = document.getElementById("quantity-input");
          const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
          addToCart(book.MaSach, quantity);
      };
  }
}

function updateQuantity(change) {
  const input = document.getElementById("quantity-input");
  if (!input) return;
  let newValue = parseInt(input.value) + change;
  if (newValue >= 1) input.value = newValue;
}

/* ==========================================================================
   5. LOGIC GIỎ HÀNG (Cart Actions)
   ========================================================================== */

async function addToCart(bookId, quantity = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MaKH: CURRENT_USER_ID, MaSach: bookId, SoLuong: quantity })
    });
    const data = await res.json();

    if (res.ok && data.status === "OK") {
      alert(`✅ Đã thêm ${quantity} sản phẩm vào giỏ!`);
    } else {
      alert("❌ Lỗi: " + (data.message || "Không thể thêm"));
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối đến Server Backend!");
  }
}

async function loadCartPage() {
    const cartBody = document.getElementById("cart-body");
    const totalEl = document.getElementById("cart-total-price");
    const countEl = document.getElementById("cart-count-item");
    if (!cartBody) return; 

    try {
        const res = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}`);
        const data = await res.json();

        if (data.status !== "OK" || !data.data || data.data.length === 0) {
             renderEmptyCart(cartBody, countEl, totalEl);
             return;
        }

        const items = data.data;
        const tongTien = data.tongTien || 0;

        if(countEl) countEl.innerText = items.length;
        if(totalEl) totalEl.innerText = formatCurrency(tongTien);

        let html = "";
        items.forEach(item => {
            const imgUrl = (item.AnhBia && item.AnhBia !== 'null') ? item.AnhBia : "https://placehold.co/100x100?text=No+Img";
            const thanhTien = item.GiaBan * item.SoLuong;

            html += `
                <tr class="border-bottom">
                    <td class="text-start ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${imgUrl}" style="width: 60px; height: 80px; object-fit: cover;" class="rounded me-3 border">
                            <div>
                                <h6 class="mb-0 text-truncate" style="max-width: 200px;">${item.TenSach}</h6>
                            </div>
                        </div>
                    </td>
                    <td class="fw-bold text-muted">${formatCurrency(item.GiaBan)}</td>
                    <td>
                        <div class="input-group input-group-sm mx-auto" style="width: 100px;">
                            <button class="btn btn-outline-secondary" onclick="changeCartQuantity(${item.MaSach}, ${item.SoLuong - 1})">-</button>
                            <input type="text" class="form-control text-center bg-white" value="${item.SoLuong}" readonly>
                            <button class="btn btn-outline-secondary" onclick="changeCartQuantity(${item.MaSach}, ${item.SoLuong + 1})">+</button>
                        </div>
                    </td>
                    <td class="fw-bold text-danger">${formatCurrency(thanhTien)}</td>
                    <td>
                        <button class="btn btn-link text-danger p-0" onclick="removeCartItem(${item.MaSach})">
                            <i class="bi bi-trash3-fill fs-5"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        cartBody.innerHTML = html;

    } catch (err) {
        cartBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Lỗi kết nối Server!</td></tr>`;
    }
}

function renderEmptyCart(container, countEl, totalEl) {
    if(countEl) countEl.innerText = "0";
    if(totalEl) totalEl.innerText = "0 ₫";
    container.innerHTML = `<tr><td colspan="5" class="text-center py-5"><p class="text-muted">Giỏ hàng trống</p></td></tr>`;
}

async function changeCartQuantity(maSach, newQty) {
    if (newQty < 1) {
        if(confirm("Xóa sản phẩm này?")) removeCartItem(maSach);
        return;
    }
    try {
        await fetch(`${API_BASE_URL}/cart/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH: CURRENT_USER_ID, MaSach: maSach, SoLuong: newQty })
        });
        loadCartPage();
    } catch (err) { alert("Lỗi cập nhật!"); }
}

async function removeCartItem(maSach) {
    if(!confirm("Chắc chắn xóa?")) return;
    try {
        await fetch(`${API_BASE_URL}/cart/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH: CURRENT_USER_ID, MaSach: maSach })
        });
        loadCartPage();
    } catch (err) { alert("Lỗi xóa!"); }
}

/* ==========================================================================
   6. KHỞI TẠO (CHẠY KHI LOAD TRANG)
   ========================================================================== */

window.addEventListener("DOMContentLoaded", () => {
  // 1. Load Components
  document.querySelectorAll("[data-component-file]").forEach((el) => {
    loadComponent(el.id, el.getAttribute("data-component-file"));
  });

  // 2. Highlight Sidebar
  setTimeout(highlightActiveCategory, 300);

  // 3. Load dữ liệu theo từng trang
  if (document.getElementById("product-list-container")) loadBooksForPage();
  if (document.getElementById("book-title")) loadBookDetail();
  if (document.getElementById("cart-body")) loadCartPage();
});