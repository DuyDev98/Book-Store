async function loadBooks() {
  try {
    const response = await fetch('/api/sach'); // Gọi tới backend
    const books = await response.json();

    const list = document.getElementById('book-list');
    list.innerHTML = books.map(b => `
      <div class="col">
        <div class="card h-100 book-card position-relative">
          <div class="badge-corner"><span class="badge bg-danger">Mới</span></div>
        <img src="/images/${b.AnhBia || 'default.png'}" class="card-img-top" alt="${b.TenSach}">
          <div class="card-body">
            <h6 class="card-title">${b.TenSach}</h6>
            <p class="price mb-0">
              <span class="sale">${Number(b.GiaBan).toLocaleString()}đ</span><br>
              <small class="text-muted">${b.NamXuatBan}</small>
            </p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('❌ Lỗi khi tải sách:', err);
    document.getElementById('book-list').innerHTML =
      `<p class="text-danger">Không thể tải danh sách sách.</p>`;
  }
}

window.addEventListener('DOMContentLoaded', loadBooks);
