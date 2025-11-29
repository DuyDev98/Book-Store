/* =============================================
    1. HÀM TỰ ĐỘNG LOAD COMPONENT (FIXED: Sử dụng data-prefix)
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