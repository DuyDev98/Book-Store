/* =============================================
    1. HÀM TỰ ĐỘNG LOAD COMPONENT (FIXED: Sử dụng data-prefix & Sửa lỗi Logo)
============================================= */
async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    // 🌟🌟 FIX: Ưu tiên sử dụng prefix được cung cấp trong HTML (data-prefix="../") 🌟🌟
    let prefix = el.getAttribute('data-prefix') || "";

    // Nếu data-prefix KHÔNG TỒN TẠI (trên các trang khác), sử dụng logic cũ
    if (!prefix) {
        // Logic tính toán cũ của bạn
        const depth = window.location.pathname.split("/").length;
        if (depth > 3) prefix = "../../"; // ví dụ: pages/kinh-te/ngoai-thuong.html
    }
    
    const path = `${prefix}components/${file}`;
    
    try {
        const res = await fetch(path);
        if (!res.ok) {
            console.error(`❌ Không thể tải ${file} từ ${path}`);
            return;
        }

        const html = await res.text();
        el.innerHTML = html;

        /* ✅ Sửa đường dẫn ẢNH TĨNH của Frontend */
        el.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (!src || src.startsWith("http")) return;
            if (src.startsWith(prefix)) return;

            if (src.startsWith("images/") || src.startsWith("public/")) {
                img.src = prefix + src;
            } 
            // 🌟 CẬP NHẬT: CHỈ SỬA THẺ LOGO CHÍNH CÓ CLASS 'main-logo'
            else if (img.classList.contains('main-logo')) { 
                img.src = prefix + "logo/logo.png";
            }
            // Sửa đường dẫn tương đối cho các ảnh khác trong thư mục 'logo/'
            else if (src.startsWith("logo/")) {
                 img.src = prefix + src; 
            }
        });

        /* ✅ Sửa đường dẫn LINK TĨNH của Frontend (Giữ nguyên) */
        el.querySelectorAll("a").forEach((a) => {
            const href = a.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("http")) return;
            if (href.startsWith(prefix)) return;

            if (href.startsWith("pages/") || href.startsWith("categories/")) {
                const correctedHref = href.replace("categories/", "pages/");
                a.href = prefix + correctedHref;
            } else if (href.startsWith("index.html")) {
                a.href = prefix + href;
            }
        });

        /* ✅ Sửa nút logo về trang chủ (onclick) (Giữ nguyên) */
        el.querySelectorAll("button[onclick*='index.html']").forEach((btn) => {
            btn.setAttribute("onclick", `window.location.href='${prefix}index.html'`);
        });
    } catch (err) {
        console.error(`⚠️ Lỗi load component:`, err);
    }
}

// =============================================
// 2. HÀM TÔ ĐỎ LINK SIDEBAR (Giữ nguyên)
// =============================================
function highlightActiveCategory() {
    // Logic của bạn
    const currentPageFile = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".sidebar a");

    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const linkFile = href.split("/").pop();

        if (linkFile === currentPageFile) {
            link.classList.remove("text-dark");
            link.classList.add("active");
            link.classList.add("text-danger", "fw-bold");
            const parentSubmenu = link.closest(".submenu");
            if(parentSubmenu) {
                parentSubmenu.style.display = "block";
            }
        }
    });
}

/* =============================================
    3. HÀM CHẠY KHI TRANG TẢI XONG (Giữ nguyên)
============================================= */
window.addEventListener("DOMContentLoaded", () => {
    // 1. Tải Favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    const depth = window.location.pathname.split("/").length;
    let prefix = "";
    if (depth > 3) prefix = "../../";
    link.href = prefix + "public/logo.png?v=" + Date.now();
    document.head.appendChild(link);

    // 2. Tải tất cả component (Header, Footer, Sidebar)
    const components = document.querySelectorAll("[data-component-file]");
    components.forEach((el) => {
        const file = el.getAttribute("data-component-file");
        const id = el.id;
        if (file && id) {
            loadComponent(id, file); 
        }
    });

    // 3. Tô đỏ link sidebar
    setTimeout(highlightActiveCategory, 200);

    // 4. Tìm và gọi API cho trang này
    const productList = document.querySelector("[data-api-category]");
    if (productList) {
        const category = productList.getAttribute("data-api-category");
        if (category) {
            // fetchBooks(category); 
        }
    }
});


// Chạy hàm này khi trang web load xong
document.addEventListener('DOMContentLoaded', function() {
    loadBookDetail();
});

// --- PHẦN 1: MOCK DATA (Dữ liệu giả để test frontend) ---
// Sau này có API thì xóa phần này đi
/* ==========================================================================
   PHẦN 1: GLOBAL LOGIC - DÙNG CHUNG CHO MỌI TRANG (HEADER, FOOTER)
   ========================================================================== */

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    let prefix = el.getAttribute('data-prefix') || "";
    if (!prefix) {
        const depth = window.location.pathname.split("/").length;
        if (depth > 3) prefix = "../../"; 
    }
    
    const path = `${prefix}components/${file}`;
    
    try {
        const res = await fetch(path);
        if (!res.ok) return;

        const html = await res.text();
        el.innerHTML = html;

        // Fix đường dẫn ảnh tĩnh
        el.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (!src || src.startsWith("http") || src.startsWith(prefix)) return;

            if (src.startsWith("images/") || src.startsWith("public/")) {
                img.src = prefix + src;
            } else if (img.classList.contains('main-logo')) { 
                img.src = prefix + "logo/logo.png";
            } else if (src.startsWith("logo/")) {
                 img.src = prefix + src; 
            }
        });

        // Fix đường dẫn link tĩnh
        el.querySelectorAll("a").forEach((a) => {
            const href = a.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith(prefix)) return;

            if (href.startsWith("pages/") || href.startsWith("categories/")) {
                a.href = prefix + href.replace("categories/", "pages/");
            } else if (href.startsWith("index.html")) {
                a.href = prefix + href;
            }
        });
    } catch (err) {
        console.error(`⚠️ Lỗi load component:`, err);
    }
}

/* ==========================================================================
   PHẦN 2: LOGIC RIÊNG CHO TRANG CHI TIẾT SÁCH (BOOK DETAIL)
   ========================================================================== */

// --- DỮ LIỆU GIẢ 7 CUỐN SÁCH ---
const MOCK_DB = {
    "1": {
        id: 1, title: "Những Giấc Mơ Ở Hiệu Sách Morisaki", sku: "BC001", author: "Yagisawa Satoshi", publisher: "NXB Hội Nhà Văn",
        price: 82000, originalPrice: 95000,
        description: "<p>Một cuốn sách chữa lành tâm hồn nhẹ nhàng. Câu chuyện về Takako, một cô gái trẻ mất phương hướng...</p>",
        mainImage: "../images/sach_banchay1.png",
        specs: { "Năm XB": "2023", "Kích thước": "13x19 cm", "Số trang": "200" }
    },
    "2": {
        id: 2, title: "Bộ Ba Phép Thuật - Tập 1", sku: "BC002", author: "Nhiều Tác Giả", publisher: "NXB Kim Đồng",
        price: 95000, originalPrice: 110000,
        description: "<p>Cuốn sách mở ra một thế giới phép thuật kỳ diệu...</p>",
        mainImage: "../images/sach_banchay2.png",
        specs: { "Năm XB": "2024", "Kích thước": "14x20 cm", "Số trang": "350" }
    },
    "3": {
        id: 3, title: "Harry Potter và Hòn Đá Phù Thủy", sku: "BC003", author: "J.K. Rowling", publisher: "NXB Trẻ",
        price: 110000, originalPrice: 128000,
        description: "<p>Khởi đầu của huyền thoại. Cậu bé Harry Potter khám phá ra thân thế thực sự...</p>",
        mainImage: "../images/sach_banchay3.png",
        specs: { "Năm XB": "2022", "Kích thước": "14x20 cm", "Số trang": "380" }
    },
    "4": {
        id: 4, title: "Mẹ Tôi - Câu Chuyện Về Tình Mẫu Tử", sku: "BC004", author: "Edmondo De Amicis", publisher: "NXB Văn Học",
        price: 120000, originalPrice: 135000,
        description: "<p>Một tác phẩm kinh điển lấy đi nước mắt của hàng triệu độc giả...</p>",
        mainImage: "../images/sach_banchay4.png",
        specs: { "Năm XB": "2022", "Kích thước": "13x20 cm", "Số trang": "250" }
    },
    "5": {
        id: 5, title: "Nhật Ký Của Bố", sku: "BC005", author: "Nhiều Tác Giả", publisher: "NXB Trẻ",
        price: 89000, originalPrice: 99000,
        description: "<p>Góc nhìn hài hước nhưng cũng đầy sâu sắc của một người đàn ông lần đầu làm bố...</p>",
        mainImage: "../images/sach_banchay5.png",
        specs: { "Năm XB": "2023", "Kích thước": "13x19 cm", "Số trang": "180" }
    },
    "6": {
        id: 6, title: "Nghĩ Giàu & Làm Giàu", sku: "BC006", author: "Napoleon Hill", publisher: "NXB Tổng Hợp",
        price: 102000, originalPrice: 118000,
        description: "<p>Cuốn sách gối đầu giường của mọi doanh nhân...</p>",
        mainImage: "../images/sach_banchay6.png",
        specs: { "Năm XB": "2021", "Kích thước": "15x23 cm", "Số trang": "400" }
    },
    "7": {
        id: 7, title: "Đừng Lựa Chọn An Nhàn Khi Còn Trẻ", sku: "BC007", author: "Gia Cát", publisher: "NXB Phụ Nữ",
        price: 98000, originalPrice: 115000,
        description: "<p>Cuốn sách là lời thức tỉnh mạnh mẽ dành cho những người trẻ...</p>",
        mainImage: "../images/sach_banchay7.png",
        specs: { "Năm XB": "2023", "Kích thước": "13x20 cm", "Số trang": "320" }
    }
};

// --- HÀM LOAD SÁCH ---
async function loadBookDetail() {
    if (!document.getElementById('book-title')) return; // Chỉ chạy ở trang chi tiết

    const urlParams = new URLSearchParams(window.location.search);
    let bookId = urlParams.get('id');
    if (!bookId) bookId = "1"; // Mặc định ID 1

    try {
        // Giả lập API delay
        await new Promise(r => setTimeout(r, 200)); 
        const data = MOCK_DB[bookId]; 

        if (data) {
            renderBookToHTML(data);
        } else {
            document.getElementById('book-title').innerText = "Không tìm thấy sản phẩm!";
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// --- HÀM RENDER HTML (QUAN TRỌNG: CHỈ XỬ LÝ 1 ẢNH) ---
function renderBookToHTML(book) {
    document.title = "Sách: " + book.title;
    document.getElementById('breadcrumb-title').innerText = book.title;
    document.getElementById('book-title').innerText = book.title;
    document.getElementById('book-sku').innerText = book.sku;
    document.getElementById('book-author').innerText = book.author;
    document.getElementById('book-publisher').innerText = book.publisher;
    document.getElementById('book-description').innerHTML = book.description;

    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    document.getElementById('price-final').innerText = formatter.format(book.price);
    
    if (book.originalPrice > book.price) {
        document.getElementById('price-original').innerText = formatter.format(book.originalPrice);
        const percent = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
        const badge = document.getElementById('discount-badge');
        if (badge) {
            badge.innerText = `-${percent}%`;
            badge.classList.remove('d-none');
        }
    }

    const tableBody = document.getElementById('specs-table');
    if (tableBody) {
        tableBody.innerHTML = "";
        for (const [key, value] of Object.entries(book.specs)) {
            tableBody.innerHTML += `<tr><td class="fw-bold text-secondary">${key}</td><td>${value}</td></tr>`;
        }
    }

    // XỬ LÝ ẢNH: CHỈ CẦN DÒNG NÀY LÀ ĐỦ
    const mainImg = document.getElementById('main-image');
    if (mainImg) mainImg.src = book.mainImage;
}

// --- TIỆN ÍCH ---
function updateQuantity(change) {
    const input = document.getElementById('quantity-input');
    if (!input) return;
    let val = parseInt(input.value) + change;
    if (val >= 1) input.value = val;
}

function addToCart() {
    alert("Đã thêm vào giỏ hàng!");
}

/* ==========================================================================
   MAIN EVENT LISTENER
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    // 1. Load Components
    const components = document.querySelectorAll("[data-component-file]");
    components.forEach((el) => {
        const file = el.getAttribute("data-component-file");
        const id = el.id;
        if (file && id) loadComponent(id, file); 
    });

    // 2. Load Book Detail (Nếu đang ở trang detail)
    loadBookDetail();
});

// --- PHẦN 2: LOGIC CHÍNH ---

async function loadBookDetail() {
    // 1. Lấy ID từ URL (Ví dụ: detail-book.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    let bookId = urlParams.get('id');

    // Mặc định ID = 1 nếu không có trên URL (để test cho dễ)
    if (!bookId) bookId = "1"; 

    console.log("Đang tải sách ID:", bookId);

    try {
        // --- NẾU DÙNG API THẬT (BỎ COMMENT DÒNG DƯỚI) ---
        // const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
        // const data = await response.json();
        
        // --- NẾU DÙNG MOCK DATA (TEST) ---
        // Giả lập độ trễ mạng 0.5s
        await new Promise(r => setTimeout(r, 500)); 
        const data = MOCK_DB[bookId]; 

        if (data) {
            renderBookToHTML(data);
        } else {
            document.getElementById('book-title').innerText = "Không tìm thấy sản phẩm!";
            document.querySelector('.btn-warning-custom').disabled = true;
        }

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu.");
    }
}

// Hàm hiển thị dữ liệu lên giao diện (ĐÃ SỬA: Bỏ Gallery & Sửa Thông số)
function renderBookToHTML(book) {
    // 1. Thông tin cơ bản (Giữ nguyên)
    document.title = "Sách: " + book.title;
    document.getElementById('breadcrumb-title').innerText = book.title;
    document.getElementById('book-title').innerText = book.title;
    document.getElementById('book-sku').innerText = book.sku;
    document.getElementById('book-author').innerText = book.author;
    document.getElementById('book-publisher').innerText = book.publisher;
    document.getElementById('book-description').innerHTML = book.description;

    // 2. Giá tiền (Giữ nguyên)
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    document.getElementById('price-final').innerText = formatter.format(book.price);
    
    if (book.originalPrice > book.price) {
        document.getElementById('price-original').innerText = formatter.format(book.originalPrice);
        const percent = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
        const badge = document.getElementById('discount-badge');
        if (badge) {
            badge.innerText = `-${percent}%`;
            badge.classList.remove('d-none');
        }
    }

    // 3. Render thông số kỹ thuật (SỬA MỚI: Dùng List <li> thay vì Table <tr>)
    const specsContainer = document.getElementById('specs-list');
    if (specsContainer) {
        specsContainer.innerHTML = "";
        for (const [key, value] of Object.entries(book.specs)) {
            // Tạo thẻ li: <li class="mb-2"><strong>Tên:</strong> Giá trị</li>
            let item = `
                <li class="mb-2">
                    <span class="fw-bold text-dark me-2" style="display:inline-block; width:120px;">${key}:</span>
                    <span class="text-secondary">${value}</span>
                </li>`;
            specsContainer.innerHTML += item;
        }
    }

    // 4. Xử lý Ảnh (SỬA MỚI: Chỉ set 1 ảnh to, bỏ thumbnail)
    const mainImg = document.getElementById('main-image');
    if (mainImg) {
        mainImg.src = book.mainImage;
    }
}

// --- PHẦN 3: CÁC HÀM TIỆN ÍCH ---

// Hàm tăng giảm số lượng
function updateQuantity(change) {
    const input = document.getElementById('quantity-input');
    let currentValue = parseInt(input.value);
    let newValue = currentValue + change;

    if (newValue >= 1) {
        input.value = newValue;
    }
}

// Hàm thêm vào giỏ (Demo)
function addToCart() {
    const quantity = document.getElementById('quantity-input').value;
    const title = document.getElementById('book-title').innerText;
    alert(`Đã thêm ${quantity} cuốn "${title}" vào giỏ hàng!`);
}

/* ==========================================================================
   PHẦN 5: LOGIC TRANG THANH TOÁN (CHECKOUT)
   ========================================================================== */

function loadCheckoutPage() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (!checkoutItemsContainer) return; // Nếu không phải trang checkout thì thoát

    let totalMoney = 0;
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

    checkoutItemsContainer.innerHTML = ""; 

    // Kiểm tra Mock Data (Trong thực tế là LocalStorage)
    if (typeof MOCK_CART === 'undefined' || MOCK_CART.length === 0) {
        checkoutItemsContainer.innerHTML = "<p class='small text-center text-muted'>Chưa có sản phẩm nào.</p>";
    } else {
        MOCK_CART.forEach(item => {
            const lineTotal = item.price * item.quantity;
            totalMoney += lineTotal;

            const html = `
                <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src="${item.image}" class="rounded border me-2" width="50" height="65" style="object-fit:cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 small text-truncate fw-bold" style="width: 180px;">${item.title}</h6>
                        <small class="text-muted">SL: ${item.quantity}</small>
                    </div>
                    <span class="small fw-bold text-dark">${formatter.format(lineTotal)}</span>
                </div>
            `;
            checkoutItemsContainer.innerHTML += html;
        });
    }

    if (subtotalEl) subtotalEl.innerText = formatter.format(totalMoney);
    if (totalEl) totalEl.innerText = formatter.format(totalMoney);
}

// --- HÀM XỬ LÝ NÚT ĐẶT HÀNG (QUAN TRỌNG) ---
function processCheckout() {
    // 1. Kiểm tra điền form
    const inputs = document.querySelectorAll('#checkout-form input[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid'); // Hiện viền đỏ cảnh báo
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    // 2. Lấy phương thức thanh toán
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
    const btn = document.querySelector('button[onclick="processCheckout()"]');

    // --- TRƯỜNG HỢP 1: VNPAY ---
    if (paymentMethod === 'paymentVNPAY') {
        btn.innerText = "Đang chuyển VNPAY...";
        btn.disabled = true;
        
        // Chuyển hướng sang trang Sandbox của VNPAY (Test)
        setTimeout(() => {
            window.location.href = "https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder"; 
        }, 1000);
        return; 
    }

    // --- TRƯỜNG HỢP 2: COD (Thanh toán khi nhận hàng) ---
    btn.innerText = "Đang xử lý...";
    btn.disabled = true;

    setTimeout(() => {
        alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sách.");
        // Chuyển về trang chủ
        window.location.href = "../index.html"; 
    }, 1500);
}

// --- ĐỪNG QUÊN GỌI HÀM NÀY KHI TRANG LOAD ---
window.addEventListener("DOMContentLoaded", () => {
    // ... code cũ ...
    loadBookDetail();   
    loadCheckoutPage(); // <--- Thêm dòng này để chạy trang thanh toán
});