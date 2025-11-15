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
 