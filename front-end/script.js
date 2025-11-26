
/* --------------------------------------------
    TỰ ĐỘNG THÊM FAVICON CHO MỌI TRANG
--------------------------------------------- */
(function() {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";

  // Xác định favicon path tùy theo vị trí file
  let depth = window.location.pathname.split("/").length;
  if (depth > 3) {
    link.href = "../../images/logo.png";
  } else {
    link.href = "images/logo.png";
  }

  document.head.appendChild(link);
})();


/* --------------------------------------------
    HÀM TỰ ĐỘNG LOAD COMPONENT HTML
--------------------------------------------- */
/* =============================================
   HÀM TỰ ĐỘNG LOAD COMPONENT (Header / Sidebar / Footer)
============================================= */
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  // Xác định độ sâu thư mục
  const depth = window.location.pathname.split("/").length;
  let prefix = "";
  if (depth > 3) prefix = "../../"; // ví dụ: categories/kinh-te/ngoai-thuong.html

  const path = `${prefix}components/${file}`;

  try {
    const res = await fetch(path);
    if (!res.ok) {
      console.error(`❌ Không thể tải ${file} từ ${path}`);
      return;
    }

    const html = await res.text();
    el.innerHTML = html;

    /* ✅ Sửa tất cả ảnh trong component */
    el.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src || src.startsWith("http")) return;

      if (src.startsWith("images/")) {
        img.src = prefix + src; // ví dụ: ../../images/giohang.png
      } else if (src.startsWith("public/")) {
        img.src = prefix + src; // ví dụ: ../../public/logo.png
      }
    });

    /* ✅ Sửa lại các link nội bộ (href, onclick) */
    el.querySelectorAll("a, button").forEach((a) => {
      const href = a.getAttribute("href");
      const onclick = a.getAttribute("onclick");
      if (href && href.startsWith("index.html")) a.href = prefix + href;
      if (onclick && onclick.includes("index.html"))
        a.setAttribute(
          "onclick",
          onclick.replace("index.html", prefix + "index.html")
        );
    });

    console.log(`✅ Loaded ${file} từ ${path}`);
  } catch (err) {
    console.error("⚠️ Lỗi load component:", err);
  }
}

/* =============================================
   LOAD COMPONENT SAU KHI TRANG SẴN SÀNG
============================================= */
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("sidebar", "sidebar.html");
  loadComponent("footer", "footer.html");

  // 🌍 Favicon tự động nhận cấp thư mục (nằm trong /public)
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";

  const depth = window.location.pathname.split("/").length;
  let prefix = "";
  if (depth > 3) prefix = "../../";

  // Ép tải lại favicon tránh cache cũ
  link.href = prefix + "public/logo.png?v=" + Date.now();
  document.head.appendChild(link);
});
