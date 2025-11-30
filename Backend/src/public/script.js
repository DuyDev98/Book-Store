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



  // 4. Tìm và gọi API cho trang này
  const productList = document.querySelector("[data-api-category]");
  if (productList) {
    const category = productList.getAttribute("data-api-category");
    if (category) {
      fetchBooks(category); // Tự động gọi hàm fetchBooks
    }
  }
});


// Hàm tải danh sách loại sách và hiển thị trong bảng
const loadCategories = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/loaisach');
        const categories = await response.json();
        const tableBody = document.getElementById('categoryTableBody');
        tableBody.innerHTML = '';  // Xóa bảng trước khi thêm dữ liệu mới

        if (categories.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center">Không có loại sách nào</td></tr>`;
        } else {
            categories.forEach((category, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${category.TenLoaiSach}</td>
                        <td>
                            <button class="btn btn-warning" onclick="editCategory(${category.MaLoaiSach})">Sửa</button>
                            <button class="btn btn-danger" onclick="deleteCategory(${category.MaLoaiSach})">Xóa</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (err) {
        console.error('Lỗi khi tải danh sách loại sách:', err);
        alert('Không thể lấy danh sách loại sách');
    }
};


// Hàm edit (Sửa thông tin loại sách)
async function editCategory(id) {
    try {
        // Gửi yêu cầu lấy thông tin loại sách theo ID
        const response = await fetch(`http://localhost:5001/api/loaisach/${id}`);
        if (!response.ok) {
            alert('Không lấy được dữ liệu loại sách để sửa');
            return;
        }

        const category = await response.json();

        // Điền thông tin loại sách vào form trong modal
        document.getElementById('categoryId').value = category.MaLoaiSach;  // ID loại sách ẩn
        document.getElementById('categoryName').value = category.TenLoaiSach;  // Tên loại sách

        // Đổi tiêu đề modal và nút "Lưu lại" thành "Cập nhật"
        document.getElementById('categoryModalLabel').textContent = 'Sửa Loại sách';
        document.getElementById('saveCategoryButton').textContent = 'Cập nhật';

        // Mở modal
        const modalElement = document.getElementById('categoryModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();  // Hiển thị modal
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu loại sách:', err);
        alert('Không thể lấy thông tin loại sách để sửa');
    }
}



// Hàm cập nhật thông tin loại sách trong bảng (khi sửa thành công)
function updateCategoryInTable(id, categoryName) {
    const rows = document.querySelectorAll('#categoryTableBody tr');

    rows.forEach(row => {
        const categoryId = row.getAttribute('data-id'); // Lấy id loại sách từ thuộc tính data-id trong bảng
        
        if (categoryId === id.toString()) {
            // Cập nhật tên loại sách trong bảng
            const categoryCell = row.querySelector('.category-name');
            categoryCell.textContent = categoryName;
        }
    });
}


// Hàm lưu loại sách (Thêm/Sửa)
document.getElementById('saveCategoryButton').addEventListener('click', async function () {
    const name = document.getElementById('categoryName').value.trim();
    const id = document.getElementById('categoryId').value.trim();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:5001/api/loaisach/${id}` : 'http://localhost:5001/api/loaisach';

    if (!name) {
        alert('Tên loại sách không được để trống');
        return;
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TenLoaiSach: name }),
        });
        const result = await response.json();

        await loadCategories();
        document.getElementById('categoryForm').reset();
        new bootstrap.Modal(document.getElementById('categoryModal')).hide();
        alert(id ? 'Cập nhật loại sách thành công!' : 'Thêm loại sách thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu loại sách:', error);
        alert('Có lỗi xảy ra: ' + error.message);
    }
});

// Hàm xóa loại sách
async function deleteCategory(id) {
    if (!confirm('Bạn có chắc muốn xóa loại sách này không?')) return;

    try {
        const response = await fetch(`http://localhost:5001/api/loaisach/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            alert('Không thể xóa loại sách');
            return;
        }
        const result = await response.json();
        alert(result.message || 'Xóa loại sách thành công');
        await loadCategories();
    } catch (err) {
        console.error('Lỗi khi xóa loại sách:', err);
        alert('Có lỗi xảy ra khi xóa loại sách');
    }
}

// Gọi hàm loadCategories khi trang tải xong
document.addEventListener('DOMContentLoaded', loadCategories);
