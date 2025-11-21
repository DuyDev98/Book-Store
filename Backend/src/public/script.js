document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("book-list");
  if (!listEl) return;

  try {
    // 🔥 API đúng theo backend: /api/sach/category/:id
    const res = await fetch("http://localhost:5001/api/sach/category/6");

    if (!res.ok) throw new Error("API trả về lỗi!");

    const data = await res.json();

    // Dữ liệu trả về dạng { status, data }
    const books = data.data || [];

    if (books.length === 0) {
      listEl.innerHTML = "<p class='text-danger'>Không có sách trong danh mục này.</p>";
      return;
    }

    listEl.innerHTML = books
      .map((book) => {
        const imgSrc = "../../images-kinh-te/" + (book.AnhBia || "no-image.png");
        const price = Number(book.GiaBan || 0).toLocaleString("vi-VN") + "đ";

        return `
          <div class="col-6 col-sm-4 col-md-3">
            <div class="book-card bg-white shadow-sm rounded h-100">
              <img src="${imgSrc}" class="img-fluid rounded-top" />
              <div class="p-3">
                <p class="small fw-semibold text-truncate mb-1">${book.TenSach}</p>
                <b>${price}</b>
              </div>
              <button class="btn-add-cart" data-id="${book.MaSach}">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Lỗi load sách:", err);
    listEl.innerHTML = "<p class='text-danger'>Không tải được sách.</p>";
  }
});

// Frontend - script.js

// Hàm để gọi API và hiển thị loại sách
const loadCategories = async () => {
  try {
    const res = await fetch('/api/loaisach');  // Gọi API lấy danh sách loại sách
    const categories = await res.json();  // Nhận dữ liệu JSON từ API

    const tableBody = document.getElementById('categoryTableBody');
    tableBody.innerHTML = '';  // Xóa các dòng cũ

    categories.forEach((category, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${category.TenLoaiSach}</td>
        <td>${category.soLuongSach || 0}</td>
        <td>
          <button onclick="editCategory(${category.MaLoaiSach})">Sửa</button>
          <button onclick="deleteCategory(${category.MaLoaiSach})">Xóa</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Lỗi khi load loại sách:', err);
    alert('Có lỗi xảy ra khi tải danh sách loại sách.');
  }
};

// Gọi hàm loadCategories khi trang tải
document.addEventListener('DOMContentLoaded', loadCategories);

// Thêm loại sách
document.getElementById('saveCategoryButton').addEventListener('click', async () => {
  const categoryName = document.getElementById('categoryName').value;  // Lấy tên loại sách từ input

  try {
    const res = await fetch('/api/loaisach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TenLoaiSach: categoryName })  // Gửi tên loại sách
    });

    if (res.ok) {
      alert('Loại sách đã được thêm!');
      loadCategories();  // Tải lại danh sách loại sách
    } else {
      alert('Có lỗi xảy ra khi thêm loại sách!');
    }
  } catch (err) {
    console.error('Lỗi khi thêm loại sách:', err);
  }
});

// Xóa loại sách
const deleteCategory = async (MaLoaiSach) => {
  try {
    const res = await fetch(`/api/loaisach/${MaLoaiSach}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Loại sách đã được xóa!');
      loadCategories();  // Tải lại danh sách loại sách
    } else {
      alert('Có lỗi xảy ra khi xóa loại sách!');
    }
  } catch (err) {
    console.error('Lỗi khi xóa loại sách:', err);
  }
};

// Sửa loại sách
const editCategory = (MaLoaiSach) => {
  // Chức năng chỉnh sửa sẽ sử dụng một modal để thay đổi tên loại sách
  alert('Chỉnh sửa loại sách ' + MaLoaiSach);
};

