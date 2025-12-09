
const API_BASE_URL = "http://localhost:5001/api"; 

// Lấy ID khách hàng (Mặc định là 1 để test)
const CURRENT_USER_ID = localStorage.getItem("MaKH") || 1;

/** Hàm định dạng tiền tệ (100000 -> 100.000 ₫) */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/* ==========================================================================
   2. GLOBAL LOGIC (HEADER, FOOTER, SIDEBAR)
   ========================================================================== */

/**
 * Hàm tính toán đường dẫn quay về thư mục gốc (public)
 * Ví dụ: Đang ở /pages/kinh-te/sach.html -> Trả về "../../"
 */
function getRootPrefix() {
    const path = window.location.pathname;
    const slashCount = (path.match(/\//g) || []).length;

    // Nếu ở root (localhost:5001/index.html) -> Không cần lùi
    if (slashCount <= 1) return "";
    // Nếu ở cấp 1 (pages/cart.html) -> Lùi 1 cấp
    if (slashCount === 2) return "../";
    // Nếu ở cấp 2 (pages/kinh-te/sach.html) -> Lùi 2 cấp
    if (slashCount >= 3) return "../../";
    
    return ""; 
}

async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  // Tự động tính đường dẫn gốc
  const root = getRootPrefix();
  
  // File component nằm trong folder components/ (Ví dụ: ../components/header.html)
  const componentPath = root + "components/" + file;

  try {
    const res = await fetch(componentPath);
    if (!res.ok) throw new Error(`Không tải được ${file}`);
    const html = await res.text();
    el.innerHTML = html;

    // --- 1. SỬA ĐƯỜNG DẪN ẢNH (Logo, Banner...) ---
    el.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      // Nếu link ảnh là tương đối (không có http, không bắt đầu bằng ../)
      if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("../")) {
         // Xóa dấu / ở đầu nếu có (ví dụ /images/a.jpg -> images/a.jpg)
         const cleanSrc = src.startsWith("/") ? src.substring(1) : src;
         img.src = root + cleanSrc; // Thêm prefix (../images/a.jpg)
      }
    });

    // --- 2. SỬA ĐƯỜNG DẪN LINK MENU ---
    el.querySelectorAll("a").forEach((a) => {
        let href = a.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript")) return;

        // Link trang chủ
        if (href === "index.html" || href === "/index.html") {
            a.href = root + "index.html";
        }
        // Link vào các trang con (pages/...)
        else if (href.startsWith("pages/")) {
            a.href = root + href;
        }
    });

    // --- 3. FIX NÚT LOGIN / REGISTER (Nằm trong folder components) ---
    const btnLogin = el.querySelector(".login-btn-login");
    if (btnLogin) {
        btnLogin.onclick = () => window.location.href = root + "components/login.html";
    }

    const btnRegister = el.querySelector(".login-btn-register");
    if (btnRegister) {
        btnRegister.onclick = () => window.location.href = root + "components/register.html";
    }

    // --- 4. FIX NÚT LOGO ---
    const logoLink = el.querySelector(".btn-logo");
    if (logoLink) logoLink.href = root + "index.html";

    // --- 5. KÍCH HOẠT TÌM KIẾM (Chỉ chạy khi load Header) ---
    const searchBtn = el.querySelector("#search-btn");
    const searchInput = el.querySelector("#search-input");
    
    if (searchBtn && searchInput) {
        const doSearch = () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                // Chuyển sang trang search.html (nằm trong pages/)
                window.location.href = root + `pages/search.html?q=${encodeURIComponent(keyword)}`;
            }
        };
        searchBtn.onclick = doSearch;
        searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") doSearch(); });
    }

    // --- 6. CẬP NHẬT BADGE GIỎ HÀNG (Nếu là header) ---
    if (file.includes("header")) {
        // Đảm bảo hàm updateCartBadge đã được khai báo trong script.js
        if (typeof updateCartBadge === "function") updateCartBadge();
        checkLoginAndDisplay();
    }

  } catch (err) {
    console.error(`Lỗi load component ${file}:`, err);
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
            // Mở rộng menu cha nếu có
            const parentSubmenu = link.closest(".submenu");
            if (parentSubmenu) parentSubmenu.style.display = "block";
        }
    });
}

/* ==========================================================================
   3. LOGIC HIỂN THỊ SÁCH (QUAN TRỌNG NHẤT)
   ========================================================================== */

/**
 * BẢNG ÁNH XẠ: "Tên trong HTML" <===> "ID trong Database"
 * (Dựa trên ảnh Database loaisach bạn cung cấp)
 */
const CATEGORY_MAP = {
  // --- Nhóm Kinh Tế ---
  "ngoai-thuong": 1,          
  "marketing-ban-hang": 2,    
  "tai-chinh-tien-te": 3,     
  "quan-tri-lanh-dao": 4,     

  // --- Nhóm Văn Hóa - Xã Hội ---
  "khoa-hoc-xa-hoi": 5,       
  "am-nhac-my-thuat": 6,      
  "truyen-tranh": 7,          
  "phe-binh-van-hoc": 8,      
  "phong-su-ky-su": 9,        
  "tho-ca": 10,               
  "tieu-thuyet": 11,          

  // --- Nhóm Đời Sống ---
  "bi-quyet-lam-dep": 12,     
  "gia-dinh-hanh-phuc": 13,   
  "tt-doi-song": 13,         // (Map thêm cho file gia-dinh.html)
  "nha-o-vat-nuoi": 14,       
  "hoc-lam-nguoi": 15,  
  "pt-ban-than": 17,         // (Mặc định tag pt-ban-than sẽ lấy sách Tâm Lý)
  "danh-nhan": 16,            
  "tam-ly-ky-nang-song": 17,  

  // --- Nhóm Giáo Dục ---
  "sach-giao-khoa": 18,       
  "giao-trinh-dai-hoc": 19,   
  "sgk-giao-trinh": 19,      // (Map thêm cho file giao-trinh.html)
  "sach-ngoai-ngu": 20,       
  "tu-dien": 21,
  "tin-hoc": 22,
  "thieu-nhi": 23,

  // --- Khác ---
  "hot-sale": -1 // Trang sale
};

async function loadBooksForPage() {
  const container = document.getElementById("product-list-container") || document.getElementById("product-list");
  if (!container) return;

  // Tìm xem trang này đang muốn hiển thị loại sách nào
  const bookListSection = container.closest("[data-api-category]") || container;
  if (!bookListSection) return;

  const categorySlug = bookListSection.getAttribute("data-api-category");
  const targetId = CATEGORY_MAP[categorySlug];

  console.log(`Đang tải sách cho danh mục: ${categorySlug} (ID: ${targetId})`);

  container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-danger" role="status"></div><p class="mt-2 text-muted">Đang tải sách...</p></div>';

  try {
    const res = await fetch(`${API_BASE_URL}/sach`);
    if (!res.ok) throw new Error("Không kết nối được Backend");
    
    const data = await res.json();
    const allBooks = Array.isArray(data) ? data : data.data || [];

    // Lọc sách theo ID danh mục
    let filteredBooks = allBooks;
    if (targetId !== undefined && targetId !== -1) {
      filteredBooks = allBooks.filter((book) => book.MaLoaiSach == targetId);
    }

    renderBooks(container, filteredBooks);
  } catch (err) {
    console.error("Lỗi tải sách:", err);
    container.innerHTML = `<div class="col-12 text-center text-danger py-5">
        <h4>⚠️ Lỗi kết nối Server!</h4>
       
    </div>`;
  }
}

// Hàm hiển thị danh sách ra HTML
function renderBooks(container, books) {
  container.innerHTML = "";
  if (!books || books.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-5"><h4>Chưa có sách nào trong mục này</h4></div>`;
    return;
  }

  // Tự động xác định đường dẫn tới trang chi tiết
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const detailBaseUrl = isInPagesFolder ? "detail-book.html" : "pages/detail-book.html";

  let html = "";
  books.forEach((b) => {
    // Xử lý ảnh
    let imgUrl = (b.AnhBia && b.AnhBia !== "null") ? b.AnhBia : "https://placehold.co/200x300?text=No+Img";
    const detailLink = `${detailBaseUrl}?id=${b.MaSach}`;
    const price = b.GiaBan ? parseInt(b.GiaBan).toLocaleString("vi-VN") : 0;

    html += `
        <div class="col-6 col-md-3 mb-4">
            <div class="card h-100 border-0 shadow-sm product-card">
                <div class="position-relative overflow-hidden text-center p-3">
                    <a href="${detailLink}">
                        <img src="${imgUrl}" class="card-img-top" alt="${b.TenSach}" 
                             style="height: 220px; object-fit: contain;"
                             onerror="this.src='https://placehold.co/200x300?text=Error'">
                    </a>
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate" title="${b.TenSach}">
                        <a href="${detailLink}" class="text-decoration-none text-dark fw-bold">${b.TenSach}</a>
                    </h6>
                    <p class="card-text text-danger fw-bold mb-1">${price} đ</p>
                    <small class="text-muted mb-3 d-block text-truncate">${b.TenTG || "Tác giả đang cập nhật"}</small>
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
  // Header Info
  document.title = book.TenSach;
  if(document.getElementById("breadcrumb-title")) document.getElementById("breadcrumb-title").innerText = book.TenSach;
  if(document.getElementById("book-title")) document.getElementById("book-title").innerText = book.TenSach;
  if(document.getElementById("book-sku")) document.getElementById("book-sku").innerText = book.MaSach;
  
  if(document.getElementById("book-author")) document.getElementById("book-author").innerText = book.TenTG || "Đang cập nhật";
  if(document.getElementById("book-publisher")) document.getElementById("book-publisher").innerText = book.TenNXB || "Đang cập nhật";
  
  // Mô tả & Giá
  if(document.getElementById("book-description")) {
      const desc = book.MoTa ? book.MoTa.replace(/\n/g, "<br>") : "<em>Chưa có mô tả.</em>";
      document.getElementById("book-description").innerHTML = desc;
  }
  if(document.getElementById("price-final")) document.getElementById("price-final").innerText = formatCurrency(book.GiaBan);
  
  // Ảnh
  const mainImg = document.getElementById("main-image");
  if (mainImg) {
    mainImg.src = (book.AnhBia && book.AnhBia !== 'null') ? book.AnhBia : "https://placehold.co/400x600?text=No+Img";
  }

  // Điền bảng thông số
  const specsEl = document.getElementById("specs-list");
  if (specsEl) {
      specsEl.innerHTML = `
        <li class="mb-2 pb-1 border-bottom"><span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Danh mục:</span><span>${book.TenDanhMuc || "---"}</span></li>
        <li class="mb-2 pb-1 border-bottom"><span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Loại sách:</span><span>${book.TenLoaiSach || "---"}</span></li>
        <li class="mb-2 pb-1 border-bottom"><span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Năm xuất bản:</span><span>${book.NamXuatBan || "---"}</span></li>
        <li class="mb-2 pb-1 border-bottom"><span class="fw-bold text-secondary" style="width: 140px; display: inline-block;">Tồn kho:</span><span class="${book.SoLuongTon > 0 ? 'text-success' : 'text-danger'} fw-bold">${book.SoLuongTon > 0 ? "Còn hàng" : "Hết hàng"}</span></li>
      `;
  }

  // Nút thêm giỏ hàng
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
   5. LOGIC GIỎ HÀNG
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
    alert("Lỗi kết nối Server Backend!");
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
        if(countEl) countEl.innerText = items.length;
        if(totalEl) totalEl.innerText = formatCurrency(data.tongTien || 0);

        let html = "";
        items.forEach(item => {
            const imgUrl = (item.AnhBia && item.AnhBia !== 'null') ? item.AnhBia : "https://placehold.co/100x100?text=No+Img";
            const thanhTien = item.GiaBan * item.SoLuong;
            html += `
                <tr class="border-bottom">
                    <td class="text-start ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${imgUrl}" style="width: 60px; height: 80px; object-fit: cover;" class="rounded me-3 border">
                            <h6 class="mb-0 text-truncate" style="max-width: 200px;">${item.TenSach}</h6>
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
                    <td><button class="btn btn-link text-danger p-0" onclick="removeCartItem(${item.MaSach})"><i class="bi bi-trash3-fill fs-5"></i></button></td>
                </tr>`;
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
    if (newQty < 1) { if(confirm("Xóa sản phẩm này?")) removeCartItem(maSach); return; }
    try {
        await fetch(`${API_BASE_URL}/cart/update`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ MaKH: CURRENT_USER_ID, MaSach: maSach, SoLuong: newQty }) });
        loadCartPage();
    } catch (err) { alert("Lỗi cập nhật!"); }
}

async function removeCartItem(maSach) {
    if(!confirm("Chắc chắn xóa?")) return;
    try {
        await fetch(`${API_BASE_URL}/cart/remove`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ MaKH: CURRENT_USER_ID, MaSach: maSach }) });
        loadCartPage();
    } catch (err) { alert("Lỗi xóa!"); }
}

async function updateCartBadge() {
    // 1. Tìm thẻ có id="cart-badge" (đã thêm trong header.html)
    const badge = document.getElementById("cart-badge");
    
    // Nếu chưa load xong header hoặc không tìm thấy thì dừng
    if (!badge) return;

    try {
        // 2. Gọi API kiểm tra giỏ hàng
        const res = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}`);
        if (!res.ok) return;
        
        const data = await res.json();
        
        // 3. Logic: Nếu có hàng -> Hiện (block), Không có -> Ẩn (none)
        if (data.status === "OK" && data.data && data.data.length > 0) {
            badge.style.display = "block"; 
        } else {
            badge.style.display = "none";
        }
    } catch (err) {
        console.error("Lỗi badge:", err);
    }
}
/* ==========================================================================
   LOGIC BÌNH LUẬN
   ========================================================================== */

// 1. Kiểm tra quyền (Chạy khi load trang)
function checkCommentPermission() {
    const userId = localStorage.getItem("MaKH"); // Lấy ID khách từ bộ nhớ
    const form = document.getElementById("user-comment-form");
    const alert = document.getElementById("guest-login-alert");

    if (userId) {
        // Đã đăng nhập -> Hiện form
        if(form) form.style.display = "block";
        if(alert) alert.style.display = "none";
    } else {
        // Chưa đăng nhập -> Hiện cảnh báo
        if(form) form.style.display = "none";
        if(alert) alert.style.display = "block";
    }
}

// 2. Gửi bình luận
async function submitComment() {
    const userId = localStorage.getItem("MaKH");
    const content = document.getElementById("comment-content").value;
    const bookId = new URLSearchParams(window.location.search).get("id");

    if (!content.trim()) return alert("Vui lòng nhập nội dung!");

    try {
        const res = await fetch(`${API_BASE_URL}/binhluan/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH: userId, MaSach: bookId, NoiDung: content })
        });
        const data = await res.json();
        
        if (data.status === "OK") {
            alert("Đã gửi bình luận!");
            document.getElementById("comment-content").value = ""; // Xóa ô nhập
            loadComments(bookId); // Tải lại danh sách
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (e) { alert("Lỗi kết nối!"); }
}

// 3. Tải danh sách bình luận
async function loadComments(bookId) {
    const listEl = document.getElementById("comment-list");
    try {
        const res = await fetch(`${API_BASE_URL}/binhluan/${bookId}`);
        const data = await res.json();
        
        if (data.status === "OK" && data.data.length > 0) {
            let html = "";
            data.data.forEach(c => {
                html += `
                    <div class="border-bottom pb-3 mb-3">
                        <span class="fw-bold">${c.HoTen || "Khách hàng"}</span>
                        <span class="text-muted small ms-2">${new Date(c.NgayBinhLuan).toLocaleDateString()}</span>
                        <p class="mb-0 mt-1">${c.NoiDung}</p>
                    </div>`;
            });
            listEl.innerHTML = html;
        } else {
            listEl.innerHTML = "<p class='text-center text-muted'>Chưa có bình luận nào.</p>";
        }
    } catch (e) { console.error(e); }
}
/* ==========================================================================
   7. LOGIC ĐĂNG NHẬP / ĐĂNG XUẤT (Dán vào cuối file script.js)
   ========================================================================== */

function checkLoginAndDisplay() {
    // 1. Lấy thông tin user từ LocalStorage
    const userStr = localStorage.getItem("user");
    const authContainer = document.getElementById("header-auth");

    // Nếu không tìm thấy header (do chưa load xong) hoặc chưa đăng nhập thì thôi
    if (!authContainer) return;
    
    if (!userStr) {
        // Nếu chưa đăng nhập: Hiện lại nút Đăng ký / Đăng nhập (đề phòng bị ẩn)
        authContainer.innerHTML = `
            <button class="btn-topbar me-3" onclick="window.location.href='../components/register.html'">
                <h6>ĐĂNG KÝ</h6>
            </button>
            <button class="btn-topbar" onclick="window.location.href='../components/login.html'">
                <h6>ĐĂNG NHẬP</h6>
            </button>
        `;
        return;
    }

    // 2. Parse dữ liệu user
    const user = JSON.parse(userStr);
    const displayName = user.username || "Khách hàng"; 

    // 3. Thay đổi giao diện thành Menu Dropdown
    authContainer.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-link text-white text-decoration-none dropdown-toggle fw-bold p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle me-1"></i> Xin chào, ${displayName}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
                ${user.role === 'Admin' ? '<li><a class="dropdown-item" href="/admin/dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Trang quản trị</a></li>' : ''}
                <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Hồ sơ cá nhân</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-receipt me-2"></i>Đơn hàng của tôi</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger fw-bold" href="#" onclick="logoutUser()">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </a></li>
            </ul>
        </div>
    `;
}

// --- HÀM XỬ LÝ ĐĂNG XUẤT ---
function logoutUser() {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        // 1. Xóa toàn bộ dữ liệu trong LocalStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("MaKH");
        
        // 2. Tải lại trang để giao diện quay về mặc định
        window.location.href = "index.html"; 
    }
}
/* ==========================================================================
   6. KHỞI CHẠY
   ========================================================================== */

window.addEventListener("DOMContentLoaded", () => {
  // Load Components (Header, Footer)
  document.querySelectorAll("[data-component-file]").forEach((el) => {
    loadComponent(el.id, el.getAttribute("data-component-file"));
  });

  // Sidebar highlight
  setTimeout(highlightActiveCategory, 300);

  // Load Logic theo trang
  if (document.getElementById("product-list") || document.getElementById("product-list-container")) {
      loadBooksForPage();
  }
  if (document.getElementById("book-title")) loadBookDetail();
  if (document.getElementById("cart-body")) loadCartPage();
});