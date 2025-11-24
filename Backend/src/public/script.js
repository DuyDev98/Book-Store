/* =============================================
   1. HÀM TỰ ĐỘNG LOAD COMPONENT (Header / Sidebar / Footer)
============================================= */
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const depth = window.location.pathname.split("/").length;
  let prefix = "";
  if (depth > 3) prefix = "../../"; // ví dụ: pages/kinh-te/ngoai-thuong.html

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
      } else if (src.startsWith("logo/")) {
        img.src = prefix + "logo/logo.png";
      }
    });

    /* ✅ Sửa đường dẫn LINK TĨNH của Frontend */
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

    /* ✅ Sửa nút logo về trang chủ (onclick) */
    el.querySelectorAll("button[onclick*='index.html']").forEach((btn) => {
      btn.setAttribute("onclick", `window.location.href='${prefix}index.html'`);
    });
  } catch (err) {
    console.error(`⚠️ Lỗi load component:`, err);
  }
}

// =============================================
// 2. HÀM TÔ ĐỎ LINK SIDEBAR (Đã sửa để chạy mọi trang)
// =============================================
function highlightActiveCategory() {
  // Lấy tên file trang hiện tại (vd: truyen-tranh.html)
  const currentPageFile = window.location.pathname.split("/").pop();

  // Tìm tất cả các link bên trong khối có class 'sidebar'
  // (Lưu ý: HTML sidebar phải có class="sidebar")
  const links = document.querySelectorAll(".sidebar a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    // Lấy tên file cuối cùng của link để so sánh
    const linkFile = href.split("/").pop();

    // Nếu trùng tên file
    if (linkFile === currentPageFile) {
      // Xóa màu đen mặc định
      link.classList.remove("text-dark");
      
      // Thêm class active (để xử lý logic mở rộng menu nếu cần)
      link.classList.add("active");
      
      // Thêm màu đỏ và in đậm (Bootstrap classes)
      link.classList.add("text-danger", "fw-bold");
      
      // Nếu link nằm trong submenu, mở submenu cha ra (tùy chọn)
      const parentSubmenu = link.closest(".submenu");
      if(parentSubmenu) {
          parentSubmenu.style.display = "block";
      }
    }
  });
}
/* =============================================
   5. HÀM CHẠY KHI TRANG TẢI XONG (CHẠY TẤT CẢ)
   *** HÀM QUAN TRỌNG NHẤT ***
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

  // 3. Tô đỏ link sidebar (chạy sau 200ms để component tải xong)
  setTimeout(highlightActiveCategory, 200);

  // 4. Tìm và gọi API cho trang này
  const productList = document.querySelector("[data-api-category]");
  if (productList) {
    const category = productList.getAttribute("data-api-category");
    if (category) {
      fetchBooks(category); // Tự động gọi hàm fetchBooks
    }
  }
});
