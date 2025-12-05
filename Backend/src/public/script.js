/* ==========================================================================
   1. GLOBAL LOGIC - DÙNG CHUNG CHO MỌI TRANG (HEADER, FOOTER, SIDEBAR)
   ========================================================================== */

/**
 * Tải file HTML component (Header, Footer, Sidebar) vào thẻ <div> chỉ định.
 * @param {string} id - ID của thẻ div (ví dụ: 'header')
 * @param {string} file - Tên file component (ví dụ: 'header.html')
 */
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  // Lấy prefix (ví dụ: ../ hoặc ../../)
  let prefix = el.getAttribute("data-prefix") || "";

  if (!prefix) {
    // Logic tính toán prefix dựa trên độ sâu URL
    const depth = window.location.pathname.split("/").length;
    if (depth > 3) prefix = "../../";
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

    /* ✅ Fix đường dẫn ẢNH TĨNH */
    el.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      // Bỏ qua nếu là HTTP/HTTPS hoặc đã có prefix
      if (!src || src.startsWith("http") || src.startsWith(prefix)) return;

      if (src.startsWith("images/") || src.startsWith("public/")) {
        img.src = prefix + src;
      } else if (img.classList.contains("main-logo")) {
        img.src = prefix + "logo/logo.png";
      } else if (src.startsWith("logo/")) {
        img.src = prefix + src;
      }
    });

    /* ✅ Fix đường dẫn LINK TĨNH */
    el.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");
      // Bỏ qua nếu là #, HTTP/HTTPS hoặc đã có prefix
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith(prefix)
      )
        return;

      if (href.startsWith("pages/") || href.startsWith("categories/")) {
        const correctedHref = href.replace("categories/", "pages/");
        a.href = prefix + correctedHref;
      } else if (href.startsWith("index.html")) {
        a.href = prefix + href;
      }
    });

    /* ✅ Fix nút logo về trang chủ (onclick) */
    el.querySelectorAll("button[onclick*='index.html']").forEach((btn) => {
      btn.setAttribute("onclick", `window.location.href='${prefix}index.html'`);
    });
  } catch (err) {
    console.error(`⚠️ Lỗi load component:`, err);
  }
}

/**
 * Tô đỏ link trên sidebar tương ứng với trang hiện tại.
 */
function highlightActiveCategory() {
  const currentPageFile = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFile = href.split("/").pop();

    if (linkFile === currentPageFile) {
      link.classList.remove("text-dark");
      link.classList.add("active", "text-danger", "fw-bold");
      const parentSubmenu = link.closest(".submenu");
      if (parentSubmenu) {
        parentSubmenu.style.display = "block";
      }
    }
  });
}

/* ==========================================================================
   2. LOGIC TẢI SÁCH CHO TRANG CHỦ VÀ TRANG DANH MỤC
   ========================================================================== */

/**
 * Ánh xạ slug (tên thư mục) thành MaLoaiSach (ID trong DB).
 * - Sử dụng ID ảo -1 cho 'hot-sale' (hoặc trang chủ) để biểu thị KHÔNG LỌC (Lấy tất cả).
 */
const CATEGORY_MAP = {
  "hot-sale": -1,

  // Kinh tế
  "ngoai-thuong": 1,
  "marketing-ban-hang": 2,
  "tai-chinh-tien-te": 3,
  "quan-tri-lanh-dao": 4,

  // Xã hội & Nhân văn
  "khoa-hoc-xa-hoi": 5,
  "am-nhac-my-thuat": 6,
  "truyen-tranh": 7,
  "phe-binh-van-hoc": 8,
  "phong-su-ky-su": 9,
  "tho-ca": 10,
  "tho-ca-nuoc-ngoai": 10,
  "tieu-thuyet": 11,
  "bi-quyet-lam-dep": 12,
  "gia-dinh-hanh-phuc": 13,
  "nha-o-vat-nuoi": 14,
  "hoc-lam-nguoi": 15,
  "danh-nhan": 16,
  "tam-ly": 17,

  // Giáo dục
  sgk: 18,
  "giao-trinh": 19,
  "ngoai-ngu": 20,
  "tu-dien": 21,
  "tin-hoc": 22,
  "thieu-nhi": 23,
};

/**
 * Lấy dữ liệu sách từ API và hiển thị lên trang (index.html hoặc category pages).
 */
async function loadBooksForPage() {
  const container = document.getElementById("product-list-container");
  if (!container) return;

  // Lấy slug từ HTML (div bao ngoài product-list-container)
  const bookListSection = container.closest("[data-api-category]");
  if (!bookListSection) return;

  const categorySlug = bookListSection.getAttribute("data-api-category");
  const targetId = CATEGORY_MAP[categorySlug];

  if (targetId === undefined) {
    container.innerHTML = `<p class="text-center text-danger">Lỗi: Chưa cấu hình ID cho mục "${categorySlug}" trong script.js</p>`;
    return;
  }

  container.innerHTML =
    '<p class="text-center w-100 text-muted">Đang tải sách...</p>';

  try {
    // Fetch API (Sử dụng URL tương đối /api/sach)
    const res = await fetch("/api/sach");
    if (!res.ok) throw new Error("Không kết nối được API /api/sach");

    const data = await res.json();
    // Xử lý cả hai trường hợp: API trả về mảng trực tiếp hoặc { data: mảng }
    const allBooks = Array.isArray(data) ? data : data.data || [];

    let filteredBooks = allBooks;

    // Lọc sách nếu targetId khác ID ảo (-1)
    if (targetId !== -1) {
      filteredBooks = allBooks.filter((book) => book.MaLoaiSach == targetId);
    }

    renderBooks(container, filteredBooks);
  } catch (err) {
    console.error("Lỗi tải sách:", err);
    container.innerHTML = `<div class="col-12 text-center text-danger py-5">
            <p>Lỗi tải sách: ${err.message}</p>
            <small>Hãy chắc chắn Server Backend đang chạy (npm start)</small>
        </div>`;
  }
}

/**
 * Hiển thị danh sách sách dưới dạng HTML.
 * @param {HTMLElement} container - Thẻ div chứa danh sách sách.
 * @param {Array} books - Mảng dữ liệu sách.
 */
function renderBooks(container, books) {
  // Xóa nội dung cũ và kiểm tra sách
  container.innerHTML = "";
  if (books.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-5">
            <h4>Chưa có sách nào trong mục này</h4>
            <p>Vui lòng vào trang Admin thêm sách.</p>
        </div>`;
    return;
  }

  let html = "";
  books.forEach((b) => {
    let imgUrl = "https://placehold.co/200x300?text=No+Img";
    const linkAnhDB = b.AnhBia || b.anhBia || b.anhbia;

    if (linkAnhDB && linkAnhDB !== "null" && linkAnhDB.trim() !== "") {
      imgUrl = linkAnhDB;
    }

    // Giá bán và Giá gốc (giả định có cột GiaGoc trong DB)
    const price = b.GiaBan ? parseInt(b.GiaBan).toLocaleString("vi-VN") : 0;
    const originalPriceValue = b.GiaGoc ? parseInt(b.GiaGoc) : 0;

    const discount =
      originalPriceValue > b.GiaBan
        ? Math.round(
            ((originalPriceValue - b.GiaBan) / originalPriceValue) * 100
          )
        : null;

    const originalPriceHtml = discount
      ? `<s class="text-muted small ms-2">${originalPriceValue.toLocaleString(
          "vi-VN"
        )} đ</s>`
      : "";

    const discountBadgeHtml = discount
      ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-${discount}%</span>`
      : "";

    // Tạo thẻ sản phẩm
    html += `
            <div class="col-6 col-md-3">
                <div class="card h-100 border-0 shadow-sm product-card">
                    <div class="position-relative overflow-hidden text-center p-3">
                        <img src="${imgUrl}" class="card-img-top" alt="${
      b.TenSach
    }" 
                             style="height: 220px; object-fit: contain;"
                             onerror="this.src='https://placehold.co/200x300?text=Error'">
                        ${discountBadgeHtml}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-truncate" title="${
                          b.TenSach
                        }">
                            <a href="pages/detail-book.html?id=${
                              b.MaSach
                            }" class="text-decoration-none text-dark fw-bold">${
      b.TenSach
    }</a>
                        </h6>
                        <p class="card-text text-danger fw-bold mb-1">${price} đ ${originalPriceHtml}</p>
                        <small class="text-muted mb-3 d-block text-truncate">${
                          b.TenTG || "Đang cập nhật"
                        }</small>
                        <div class="mt-auto">
                            <button class="btn btn-outline-danger w-100 btn-sm" onclick="addToCart(${
                              b.MaSach
                            })">
                                <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });
  container.innerHTML = html;
}

/**
 * Hàm demo thêm vào giỏ hàng.
 * @param {number} bookId - Mã sách
 */
function addToCart(bookId) {
  alert(`Đã thêm sách ID: ${bookId} vào giỏ hàng!`);
}

/* ==========================================================================
   3. LOGIC CHO TRANG CHI TIẾT SÁCH (Dùng MOCK DATA để demo)
   ========================================================================== */

// --- DỮ LIỆU GIẢ 7 CUỐN SÁCH (Giữ nguyên MOCK DB) ---
const MOCK_DB = {
  1: {
    id: 1,
    title: "Những Giấc Mơ Ở Hiệu Sách Morisaki",
    sku: "BC001",
    author: "Yagisawa Satoshi",
    publisher: "NXB Hội Nhà Văn",
    price: 82000,
    originalPrice: 95000,
    description:
      "<p>Một cuốn sách chữa lành tâm hồn nhẹ nhàng. Câu chuyện về Takako, một cô gái trẻ mất phương hướng...</p>",
    mainImage: "images/sach_banchay1.png",
    specs: { "Năm XB": "2023", "Kích thước": "13x19 cm", "Số trang": "200" },
  },
  2: {
    id: 2,
    title: "Bộ Ba Phép Thuật - Tập 1",
    sku: "BC002",
    author: "Nhiều Tác Giả",
    publisher: "NXB Kim Đồng",
    price: 95000,
    originalPrice: 110000,
    description: "<p>Cuốn sách mở ra một thế giới phép thuật kỳ diệu...</p>",
    mainImage: "images/sach_banchay2.png",
    specs: { "Năm XB": "2024", "Kích thước": "14x20 cm", "Số trang": "350" },
  },
  3: {
    id: 3,
    title: "Harry Potter và Hòn Đá Phù Thủy",
    sku: "BC003",
    author: "J.K. Rowling",
    publisher: "NXB Trẻ",
    price: 110000,
    originalPrice: 128000,
    description:
      "<p>Khởi đầu của huyền thoại. Cậu bé Harry Potter khám phá ra thân thế thực sự...</p>",
    mainImage: "images/sach_banchay3.png",
    specs: { "Năm XB": "2022", "Kích thước": "14x20 cm", "Số trang": "380" },
  },
  4: {
    id: 4,
    title: "Mẹ Tôi - Câu Chuyện Về Tình Mẫu Tử",
    sku: "BC004",
    author: "Edmondo De Amicis",
    publisher: "NXB Văn Học",
    price: 120000,
    originalPrice: 135000,
    description:
      "<p>Một tác phẩm kinh điển lấy đi nước mắt của hàng triệu độc giả...</p>",
    mainImage: "images/sach_banchay4.png",
    specs: { "Năm XB": "2022", "Kích thước": "13x20 cm", "Số trang": "250" },
  },
  5: {
    id: 5,
    title: "Nhật Ký Của Bố",
    sku: "BC005",
    author: "Nhiều Tác Giả",
    publisher: "NXB Trẻ",
    price: 89000,
    originalPrice: 99000,
    description:
      "<p>Góc nhìn hài hước nhưng cũng đầy sâu sắc của một người đàn ông lần đầu làm bố...</p>",
    mainImage: "images/sach_banchay5.png",
    specs: { "Năm XB": "2023", "Kích thước": "13x19 cm", "Số trang": "180" },
  },
  6: {
    id: 6,
    title: "Nghĩ Giàu & Làm Giàu",
    sku: "BC006",
    author: "Napoleon Hill",
    publisher: "NXB Tổng Hợp",
    price: 102000,
    originalPrice: 118000,
    description: "<p>Cuốn sách gối đầu giường của mọi doanh nhân...</p>",
    mainImage: "images/sach_banchay6.png",
    specs: { "Năm XB": "2021", "Kích thước": "15x23 cm", "Số trang": "400" },
  },
  7: {
    id: 7,
    title: "Đừng Lựa Chọn An Nhàn Khi Còn Trẻ",
    sku: "BC007",
    author: "Gia Cát",
    publisher: "NXB Phụ Nữ",
    price: 98000,
    originalPrice: 115000,
    description:
      "<p>Cuốn sách là lời thức tỉnh mạnh mẽ dành cho những người trẻ...</p>",
    mainImage: "images/sach_banchay7.png",
    specs: { "Năm XB": "2023", "Kích thước": "13x20 cm", "Số trang": "320" },
  },
};

/**
 * Tải chi tiết sách (chỉ chạy ở trang detail-book.html).
 */
async function loadBookDetail() {
  if (!document.getElementById("book-title")) return;

  const urlParams = new URLSearchParams(window.location.search);
  let bookId = urlParams.get("id");
  if (!bookId) bookId = "1";

  try {
    // Giả lập API delay
    await new Promise((r) => setTimeout(r, 200));
    const data = MOCK_DB[bookId];

    if (data) {
      renderBookToHTML(data);
    } else {
      document.getElementById("book-title").innerText =
        "Không tìm thấy sản phẩm!";
    }
  } catch (error) {
    console.error("Lỗi tải chi tiết sách (MOCK):", error);
  }
}

/**
 * Hiển thị dữ liệu MOCK sách lên giao diện trang chi tiết.
 * @param {object} book - Dữ liệu sách MOCK.
 */
function renderBookToHTML(book) {
  document.title = "Sách: " + book.title;
  document.getElementById("breadcrumb-title").innerText = book.title;
  document.getElementById("book-title").innerText = book.title;
  document.getElementById("book-sku").innerText = book.sku;
  document.getElementById("book-author").innerText = book.author;
  document.getElementById("book-publisher").innerText = book.publisher;
  document.getElementById("book-description").innerHTML = book.description;

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  document.getElementById("price-final").innerText = formatter.format(
    book.price
  );

  // Giá gốc
  if (book.originalPrice > book.price) {
    document.getElementById("price-original").innerText = formatter.format(
      book.originalPrice
    );
    const percent = Math.round(
      ((book.originalPrice - book.price) / book.originalPrice) * 100
    );
    const badge = document.getElementById("discount-badge");
    if (badge) {
      badge.innerText = `-${percent}%`;
      badge.classList.remove("d-none");
    }
  }

  // Thông số kỹ thuật
  const specsContainer = document.getElementById("specs-list");
  if (specsContainer) {
    specsContainer.innerHTML = "";
    for (const [key, value] of Object.entries(book.specs)) {
      let item = `
                <li class="mb-2">
                    <span class="fw-bold text-dark me-2" style="display:inline-block; width:120px;">${key}:</span>
                    <span class="text-secondary">${value}</span>
                </li>`;
      specsContainer.innerHTML += item;
    }
  }

  // Ảnh chính
  const mainImg = document.getElementById("main-image");
  if (mainImg)
    mainImg.src =
      mainImg.closest("[data-prefix]").getAttribute("data-prefix") +
      book.mainImage;
}

/**
 * Hàm tăng giảm số lượng sản phẩm.
 * @param {number} change - Giá trị thay đổi (1 hoặc -1)
 */
function updateQuantity(change) {
  const input = document.getElementById("quantity-input");
  if (!input) return;
  let currentValue = parseInt(input.value);
  let newValue = currentValue + change;

  if (newValue >= 1) {
    input.value = newValue;
  }
}

/* ==========================================================================
   4. MAIN EVENT LISTENER - TỰ ĐỘNG CHẠY KHI TRANG TẢI XONG
   ========================================================================== */

window.addEventListener("DOMContentLoaded", () => {
  // 1. Tải tất cả component (Header, Footer, Sidebar)
  const components = document.querySelectorAll("[data-component-file]");
  components.forEach((el) => {
    const file = el.getAttribute("data-component-file");
    const id = el.id;
    if (file && id) {
      loadComponent(id, file);
    }
  });

  // 2. Tô đỏ link sidebar (Cần delay để component tải xong)
  setTimeout(highlightActiveCategory, 200);

  // 3. Tải danh sách sách (Nếu đang ở trang index/category)
  const productListContainer = document.getElementById(
    "product-list-container"
  );
  if (productListContainer) {
    loadBooksForPage();
  }

  // 4. Tải chi tiết sách (Nếu đang ở trang detail)
  loadBookDetail();
});
 /**
 * Thêm sách vào giỏ hàng (Gọi API Backend)
 * @param {number} bookId - Mã sách
 */
async function addToCart(bookId) {
  // Lấy ID khách hàng (Tạm thời để cứng là 1, sau này bạn lấy từ localStorage khi làm Đăng nhập)
  const MaKH = localStorage.getItem("MaKH") || 1; 
  const SoLuong = 1;

  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        MaKH: MaKH,
        MaSach: bookId,
        SoLuong: SoLuong
      })
    });

    const data = await res.json();

    if (res.ok && data.status === "OK") {
      alert("✅ " + data.message);
      
      // Nếu bạn muốn cập nhật số lượng trên icon giỏ hàng ngay lập tức, 
      // bạn có thể gọi lại hàm lấy số lượng giỏ hàng ở đây (nếu có).
    } else {
      alert("❌ Lỗi: " + (data.message || "Không thể thêm vào giỏ"));
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    alert("Lỗi kết nối đến Server!");
  }
}
/* ==========================================================================
   LOGIC TRANG GIỎ HÀNG (Dành cho cart.html)
   ========================================================================== */

// Hàm định dạng tiền tệ (VD: 100000 -> 100.000 đ)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm chính để tải dữ liệu giỏ hàng
async function loadCartPage() {
    const cartBody = document.getElementById("cart-body");
    const totalEl = document.getElementById("cart-total-price");
    const countEl = document.getElementById("cart-count-item");
    
    // Nếu không tìm thấy thẻ cart-body (nghĩa là không ở trang giỏ hàng) thì dừng lại
    if (!cartBody) return;

    // ⚠️ QUAN TRỌNG: Lấy ID khách hàng. 
    // Nếu bạn chưa làm đăng nhập, hãy đảm bảo số này khớp với MaKH bạn đã tạo trong Database (VD: 1)
    const MaKH = localStorage.getItem("MaKH") || 1;

    try {
        // Gọi API lấy giỏ hàng
        const res = await fetch(`/api/cart/${MaKH}`);
        const data = await res.json();

        // 1. Kiểm tra lỗi từ Server
        if (data.status !== "OK") {
            // Nếu lỗi là do chưa có giỏ hàng (mới tạo user), coi như giỏ trống
            if (data.data && data.data.length === 0) {
                 renderEmptyCart(cartBody, countEl, totalEl);
                 return;
            }
            console.error("Lỗi tải giỏ:", data.message);
            return;
        }

        const items = data.data || [];
        const tongTien = data.tongTien || 0;

        // 2. Cập nhật số lượng tổng và tổng tiền
        if(countEl) countEl.innerText = items.length;
        if(totalEl) totalEl.innerText = formatCurrency(tongTien);

        // 3. Nếu giỏ hàng trống
        if (items.length === 0) {
            renderEmptyCart(cartBody, countEl, totalEl);
            return;
        }

        // 4. Render danh sách sản phẩm
        let html = "";
        items.forEach(item => {
            // Xử lý ảnh: Nếu null hoặc lỗi thì dùng ảnh giả
            const imgUrl = (item.AnhBia && item.AnhBia !== 'null') ? item.AnhBia : "https://placehold.co/100x100?text=No+Img";
            
            // Tính thành tiền của từng món
            const thanhTienItem = item.GiaBan * item.SoLuong;

            html += `
                <tr class="border-bottom">
                    <td class="text-start ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${imgUrl}" alt="${item.TenSach}" 
                                 style="width: 70px; height: 90px; object-fit: cover;" 
                                 class="rounded shadow-sm me-3 border">
                            <div class="text-start">
                                <h6 class="mb-1 text-truncate" style="max-width: 200px;" title="${item.TenSach}">${item.TenSach}</h6>
                                <small class="text-muted">Mã: ${item.MaSach}</small>
                            </div>
                        </div>
                    </td>

                    <td class="fw-bold text-secondary">${formatCurrency(item.GiaBan)}</td>

                    <td>
                        <div class="input-group input-group-sm mx-auto" style="width: 110px;">
                            <button class="btn btn-outline-secondary" type="button" 
                                    onclick="changeCartQuantity(${item.MaSach}, ${item.SoLuong - 1})">
                                <i class="bi bi-dash"></i>
                            </button>
                            
                            <input type="text" class="form-control text-center bg-white fw-bold" 
                                   value="${item.SoLuong}" readonly>
                            
                            <button class="btn btn-outline-secondary" type="button" 
                                    onclick="changeCartQuantity(${item.MaSach}, ${item.SoLuong + 1})">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </td>

                    <td class="fw-bold text-danger">${formatCurrency(thanhTienItem)}</td>

                    <td>
                        <button class="btn btn-link text-danger p-0 opacity-75 hover-opacity-100" 
                                onclick="removeCartItem(${item.MaSach})" title="Xóa sản phẩm">
                            <i class="bi bi-trash3-fill fs-5"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        cartBody.innerHTML = html;

    } catch (err) {
        console.error(err);
        cartBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Không thể kết nối đến Server!</td></tr>`;
    }
}

// Hàm hiển thị khi giỏ hàng trống
function renderEmptyCart(container, countEl, totalEl) {
    if(countEl) countEl.innerText = "0";
    if(totalEl) totalEl.innerText = "0 ₫";
    container.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
                <p class="text-muted">Giỏ hàng của bạn đang trống</p>
                <a href="../index.html" class="btn btn-outline-warning btn-sm mt-2">Mua sắm ngay</a>
            </td>
        </tr>
    `;
}

/**
 * Hàm thay đổi số lượng (Gọi API Update)
 */
async function changeCartQuantity(maSach, newQty) {
    const MaKH = localStorage.getItem("MaKH") || 1;
    
    if (newQty < 1) {
        // Nếu giảm xuống dưới 1 thì hỏi xóa
        if(confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            removeCartItem(maSach);
        }
        return;
    }

    try {
        const res = await fetch("/api/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH, MaSach: maSach, SoLuong: newQty })
        });
        
        if (res.ok) {
            loadCartPage(); // Tải lại giao diện sau khi update thành công
        } else {
            alert("Lỗi cập nhật số lượng!");
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối!");
    }
}

/**
 * Hàm xóa sản phẩm (Gọi API Remove)
 */
async function removeCartItem(maSach) {
    if(!confirm("Chắc chắn xóa sản phẩm này?")) return;

    const MaKH = localStorage.getItem("MaKH") || 1;
    try {
        const res = await fetch("/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ MaKH, MaSach: maSach })
        });

        if (res.ok) {
            loadCartPage(); // Tải lại giao diện
        } else {
            alert("Không thể xóa sản phẩm!");
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối!");
    }
}

// Tự động chạy khi trang load xong
window.addEventListener("DOMContentLoaded", () => {
    loadCartPage();
});