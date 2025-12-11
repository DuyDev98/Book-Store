/* ==========================================================================
   1. CẤU HÌNH & TIỆN ÍCH CHUNG
   ========================================================================== */
const API_BASE_URL = "/api";

// Lấy thông tin User
const CURRENT_USER_ID = localStorage.getItem("MaKH");
let CURRENT_USER_INFO = null;
try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") CURRENT_USER_INFO = JSON.parse(userStr);
} catch (e) { }

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Hàm lấy Header chứa Token
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token || ""
    };
}

// Hàm kiểm tra lỗi Token hết hạn
function checkAuthError(res) {
    if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        if (typeof window.logoutUser === 'function') window.logoutUser();
        return true;
    }
    return false;
}

/* ==========================================================================
   2. CÁC HÀM XỬ LÝ SÁCH & GIAO DIỆN
   ========================================================================== */
function getRootPrefix() {
    const path = window.location.pathname;
    const slashCount = (path.match(/\//g) || []).length;
    if (slashCount <= 1) return "";
    if (slashCount === 2) return "../";
    return "../../";
}

// Hàm cập nhật số lượng ở trang chi tiết (+/-)
function updateQuantity(change) {
    const input = document.getElementById("quantity-input");
    if (input) {
        let newVal = parseInt(input.value) + change;
        if (newVal >= 1) input.value = newVal;
    }
}

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    const root = getRootPrefix();

    try {
        const res = await fetch(root + "components/" + file);
        if (!res.ok) throw new Error();
        el.innerHTML = await res.text();

        // Fix ảnh
        el.querySelectorAll("img").forEach(img => {
            const src = img.getAttribute("src");
            if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("../")) {
                img.src = root + (src.startsWith("/") ? src.substring(1) : src);
            }
        });

        // Fix link
        el.querySelectorAll("a").forEach(a => {
            let href = a.getAttribute("href");
            if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript")) return;
            if (href === "index.html" || href === "/index.html") a.href = root + "index.html";
            else if (href.startsWith("pages/")) a.href = root + href;
        });

        // LOGIC HEADER: HIỂN THỊ TÊN VÀ NÚT ĐĂNG XUẤT RÕ RÀNG
        if (file.includes("header")) {
            const tr = el.querySelector(".top-right");
            if (tr) {
                if (CURRENT_USER_INFO) {
                    tr.innerHTML = `
                    <div class="d-flex align-items-center">
                       <a href="${root}pages/profile.html" class="text-white fw-bold me-2 text-decoration-none" title="Xem thông tin tài khoản">
                         <i class="bi bi-person-circle"></i> Xin chào, ${CURRENT_USER_INFO.username}
                       </a>
                        <span class="text-white mx-2">|</span>
                        <a href="#" onclick="logoutUser()" class="text-white text-decoration-none fw-bold" style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px;">
                            Đăng xuất <i class="bi bi-box-arrow-right"></i>
                        </a>
                    </div>
                `;
                } else {
                    const loginBtn = tr.querySelector(".login-btn-login");
                    const registerBtn = tr.querySelector(".login-btn-register");
                    if (loginBtn) loginBtn.onclick = () => window.location.href = root + "components/login.html";
                    if (registerBtn) registerBtn.onclick = () => window.location.href = root + "components/register.html";
                }
            }
            updateCartBadge();
            const sBtn = el.querySelector("#search-btn"), sInp = el.querySelector("#search-input");
            if (sBtn && sInp) {
                const doS = () => { if (sInp.value.trim()) window.location.href = root + `pages/search.html?q=${encodeURIComponent(sInp.value.trim())}`; };
                sBtn.onclick = doS; sInp.onkeypress = e => { if (e.key === "Enter") doS(); };
            }
        }
    } catch (e) { }
}

function renderBooks(container, books) {
    container.innerHTML = "";
    if (!books || !books.length) {
        container.innerHTML = `<p class="text-center py-5 text-muted w-100">Không tìm thấy sách.</p>`;
        return;
    }

    const root = getRootPrefix();
    const detailUrl = root + "pages/detail-book.html";

    // Kiểm tra xem container này là Slider hay là Lưới (Grid)
    const isSlider = container.classList.contains("book-slider-container");

    let html = "";
    books.forEach(b => {
        let img = (b.AnhBia && b.AnhBia !== 'null') ? b.AnhBia : "https://placehold.co/200x300";
        if (!img.startsWith("http")) img = root + img;

        // Nếu là Slider thì dùng class css riêng, nếu Grid thì dùng col bootstrap
        const wrapperClass = isSlider ? "book-slider-item" : "col-6 col-md-3 mb-4";

        html += `
        <div class="${wrapperClass}">
            <div class="card h-100 shadow-sm border-0">
                <div class="p-3 text-center position-relative">
                    ${b.GiaGoc > b.GiaBan ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : ''}
                    <a href="${detailUrl}?id=${b.MaSach}">
                        <img src="${img}" class="card-img-top" style="height:200px; object-fit:contain;">
                    </a>
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="text-truncate mb-2">
                        <a href="${detailUrl}?id=${b.MaSach}" class="text-dark fw-bold text-decoration-none" title="${b.TenSach}">${b.TenSach}</a>
                    </h6>
                    <div class="mt-auto">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <span class="text-danger fw-bold">${formatCurrency(b.GiaBan)}</span>
                            ${b.GiaGoc ? `<small class="text-decoration-line-through text-muted" style="font-size:12px">${formatCurrency(b.GiaGoc)}</small>` : ''}
                        </div>
                        <button class="btn btn-outline-danger w-100 btn-sm" onclick="addToCart(${b.MaSach})">
                            <i class="bi bi-cart-plus"></i> Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

/* ==========================================================================
   3. GIỎ HÀNG
   ========================================================================== */
async function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge || !localStorage.getItem("token")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}`, { headers: getAuthHeaders() });
        if (!checkAuthError(res)) {
            const d = await res.json();
            badge.style.display = (d.status === "OK" && d.data.length > 0) ? "block" : "none";
        }
    } catch (e) { }
}

window.addToCart = async function (id, qty = 1) {
    const userId = localStorage.getItem("MaKH");
    if (!userId || userId === "undefined" || userId === "null") {
        if (confirm("Bạn cần đăng nhập để mua hàng. Đến trang đăng nhập ngay?")) {
            window.location.href = getRootPrefix() + "components/login.html";
        }
        return;
    }
    if (!id) {
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get("id");
    }
    const qtyInput = document.getElementById("quantity-input");
    if (qtyInput) qty = parseInt(qtyInput.value) || 1;
    if (!id) { alert("Lỗi: Không tìm thấy mã sách!"); return; }

    try {
        const res = await fetch(`${API_BASE_URL}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH: userId, MaSach: id, SoLuong: qty })
        });
        const data = await res.json();
        if (res.ok && data.status === "OK") {
            alert("✅ Đã thêm vào giỏ!");
            if (typeof updateCartBadge === 'function') updateCartBadge();
        } else {
            alert("❌ Lỗi từ Server: " + (data.message || "Không thể thêm"));
        }
    } catch (err) { console.error(err); alert("Lỗi kết nối Server!"); }
}

async function loadCartPage() {
    const tbody = document.getElementById("cart-body");
    if (!tbody) return;
    if (!localStorage.getItem("token")) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5">Vui lòng đăng nhập</td></tr>`;
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}`, { headers: getAuthHeaders() });
        if (checkAuthError(res)) return;

        const d = await res.json();
        if (d.status !== "OK" || !d.data.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5">Giỏ hàng trống</td></tr>`;
            if (document.getElementById("cart-total-price")) document.getElementById("cart-total-price").innerText = "0 đ";
            return;
        }

        const root = getRootPrefix();
        let html = "";
        d.data.forEach(i => {
            let img = (i.AnhBia && i.AnhBia !== 'null') ? i.AnhBia : "https://placehold.co/100";
            if (!img.startsWith("http")) img = root + img;
            html += `<tr class="border-bottom"><td class="ps-4 text-start"><div class="d-flex align-items-center"><img src="${img}" style="width:60px;height:80px;object-fit:cover" class="me-3 border"><h6>${i.TenSach}</h6></div></td><td>${formatCurrency(i.GiaBan)}</td><td><div class="input-group input-group-sm m-auto" style="width:100px"><button class="btn btn-outline-secondary" onclick="changeQty(${i.MaSach}, ${i.SoLuong - 1})">-</button><input class="form-control text-center bg-white" value="${i.SoLuong}" readonly><button class="btn btn-outline-secondary" onclick="changeQty(${i.MaSach}, ${i.SoLuong + 1})">+</button></div></td><td class="text-danger fw-bold">${formatCurrency(i.ThanhTien)}</td><td><button class="btn text-danger" onclick="removeItem(${i.MaSach})"><i class="bi bi-trash3-fill"></i></button></td></tr>`;
        });
        tbody.innerHTML = html;
        if (document.getElementById("cart-total-price")) document.getElementById("cart-total-price").innerText = formatCurrency(d.tongTien || 0);
        if (document.getElementById("cart-count-item")) document.getElementById("cart-count-item").innerText = d.data.length;
    } catch (e) { }
}

window.changeQty = async function (id, q) {
    if (q < 1) { if (confirm("Xóa?")) removeItem(id); return; }
    await fetch(`${API_BASE_URL}/cart/update`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ MaSach: id, SoLuong: q }) });
    loadCartPage();
}
window.removeItem = async function (id) {
    if (!confirm("Xóa?")) return;
    await fetch(`${API_BASE_URL}/cart/remove`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ MaSach: id }) });
    loadCartPage(); updateCartBadge();
}

/* ==========================================================================
   4. LOAD SÁCH THEO DANH MỤC
   ========================================================================== */
const CATEGORY_MAP = {
    "hot-sale": -1, "ngoai-thuong": 1, "marketing-ban-hang": 2, "tai-chinh-tien-te": 3,
    "quan-tri-lanh-dao": 4, "khoa-hoc-xa-hoi": 5, "am-nhac-my-thuat": 6, "truyen-tranh": 7,
    "phe-binh-van-hoc": 8, "phong-su-ky-su": 9, "tho-ca": 10, "tieu-thuyet": 11,
    "bi-quyet-lam-dep": 12, "gia-dinh-hanh-phuc": 13, "tt-doi-song": 13, "nha-o-vat-nuoi": 14,
    "hoc-lam-nguoi": 15, "danh-nhan": 16, "tam-ly-ky-nang-song": 17, "pt-ban-than": 17,
    "sach-giao-khoa": 18, "giao-trinh-dai-hoc": 19, "sgk-giao-trinh": 19,
    "sach-ngoai-ngu": 20, "tu-dien": 21, "tin-hoc": 22, "thieu-nhi": 23
};

async function loadBooksForPage() {
    const c = document.getElementById("product-list") || document.getElementById("product-list-container");
    if (!c) return;
    const slug = c.closest("[data-api-category]")?.getAttribute("data-api-category");
    if (!slug) return;

    try {
        const res = await fetch(`${API_BASE_URL}/sach`);
        const data = await res.json();
        const all = Array.isArray(data) ? data : (data.data || []);
        let list = all;

        if (slug === "search") {
            const k = (new URLSearchParams(window.location.search).get("q") || "").toLowerCase();
            const keywordEl = document.getElementById("search-keyword");
            if (keywordEl) keywordEl.innerText = `"${k}"`;
            list = k ? all.filter(b => b.TenSach.toLowerCase().includes(k)) : [];
        } else if (CATEGORY_MAP[slug] && CATEGORY_MAP[slug] !== -1) {
            list = all.filter(b => b.MaLoaiSach == CATEGORY_MAP[slug]);
        }
        renderBooks(c, list);
    } catch (e) { }
}
// Hàm xử lý khi bấm nút mũi tên
function scrollSlider(id, amount) {
    const container = document.getElementById(id);
    if (container) {
        container.scrollLeft += amount;
    }
}
/* ==========================================================================
   5. ✅ HÀM LOAD CHI TIẾT SÁCH - HIỂN THỊ ĐẦY ĐỦ
   ========================================================================== */
async function loadBookDetail() {
    if (!document.getElementById("book-title")) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return alert("Không tìm thấy mã sách!");

    const root = getRootPrefix();

    try {
        const res = await fetch(`${API_BASE_URL}/sach/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sách");

        const book = await res.json();
        console.log("📚 Chi tiết sách:", book);

        // ========== 1. HIỂN THỊ ẢNH BÌA ==========
        const imgEl = document.getElementById("main-image");
        if (imgEl) {
            let imgPath = (book.AnhBia && book.AnhBia !== 'null') ? book.AnhBia : "https://placehold.co/400x600?text=No+Image";
            if (!imgPath.startsWith("http")) imgPath = root + imgPath;
            imgEl.src = imgPath;
        }

        // ========== 2. TÊN SÁCH & GIÁ ==========
        document.title = book.TenSach || "Chi tiết sách";

        const titleEl = document.getElementById("book-title");
        if (titleEl) titleEl.innerText = book.TenSach || "---";

        const breadcrumbEl = document.getElementById("breadcrumb-title");
        if (breadcrumbEl) breadcrumbEl.innerText = book.TenSach || "Sách";

        const priceEl = document.getElementById("price-final");
        if (priceEl) priceEl.innerText = formatCurrency(book.GiaBan || 0);

        // ========== 3. MÃ SÁCH ==========
        const skuEl = document.getElementById("book-sku");
        if (skuEl) skuEl.innerText = book.MaSach || "---";

        // ========== 4. TÁC GIẢ ==========
        const authorEl = document.getElementById("book-author");
        if (authorEl) authorEl.innerText = book.TenTG || "Đang cập nhật";

        // ========== 5. NHÀ XUẤT BẢN ==========
        const publisherEl = document.getElementById("book-publisher");
        if (publisherEl) publisherEl.innerText = book.TenNXB || "Đang cập nhật";

        // ========== 6. GIỚI THIỆU NỘI DUNG (MÔ TẢ) ==========
        const descEl = document.getElementById("book-description");
        if (descEl) {
            descEl.innerHTML = book.MoTa ? book.MoTa.replace(/\n/g, "<br>") : "Đang cập nhật nội dung...";
        }

        // ========== 7. THÔNG TIN CHI TIẾT (BẢNG) ==========
        const specsEl = document.getElementById("book-specs");
        if (specsEl) {
            specsEl.innerHTML = `
                <table class="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td class="text-muted bg-light" style="width: 35%"><strong>Mã sách</strong></td>
                            <td>${book.MaSach || "---"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Tác giả</strong></td>
                            <td>${book.TenTG || "Đang cập nhật"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Nhà xuất bản</strong></td>
                            <td>${book.TenNXB || "Đang cập nhật"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Năm xuất bản</strong></td>
                            <td>${book.NamXuatBan || "---"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Lần tái bản</strong></td>
                            <td>${book.LanTaiBan || "1"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Loại sách</strong></td>
                            <td>${book.TenLoaiSach || "---"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Danh mục</strong></td>
                            <td>${book.TenDanhMuc || "---"}</td>
                        </tr>
                        <tr>
                            <td class="text-muted bg-light"><strong>Số lượng tồn</strong></td>
                            <td><span class="badge bg-success">${book.SoLuongTon || 0} cuốn</span></td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        // ========== 8. GÁN SỰ KIỆN CHO NÚT THÊM GIỎ HÀNG ==========
        const addToCartBtn = document.querySelector("button[onclick*='addToCart']");
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const qtyInput = document.getElementById("quantity-input");
                const qty = qtyInput ? parseInt(qtyInput.value) : 1;
                addToCart(book.MaSach, qty);
            };
        }

    } catch (e) {
        console.error("❌ Lỗi load chi tiết sách:", e);
        alert("Không thể tải thông tin sách!");
    }
}

/* ==========================================================================
   6. CHỨC NĂNG ĐĂNG XUẤT
   ========================================================================== */
window.logoutUser = function () {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.clear();
        window.location.href = getRootPrefix() + "index.html";
    }
};

/* ==========================================================================
   7. KHỞI CHẠY
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    // Load components (header, footer)
    document.querySelectorAll("[data-component-file]").forEach(el =>
        loadComponent(el.id, el.getAttribute("data-component-file"))
    );

    // Highlight active menu
    setTimeout(() => {
        const fn = window.location.pathname.split("/").pop();
        document.querySelectorAll(".sidebar a").forEach(l => {
            if (l.getAttribute("href")?.includes(fn)) {
                l.classList.remove("text-dark");
                l.classList.add("active", "text-danger", "fw-bold");
                l.closest(".submenu")?.setAttribute("style", "display:block");
            }
        });
    }, 300);

    // Load data dựa trên trang
    loadBooksForPage();
    loadBookDetail();
    loadCartPage();
});
