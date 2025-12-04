(function checkAdminAccess() {
  // 1. Lấy thông tin user từ LocalStorage (được lưu lúc đăng nhập)
  const userStr = localStorage.getItem("user");

  // 2. Kiểm tra xem đã đăng nhập chưa
  if (!userStr) {
    alert("⚠️ Vui lòng đăng nhập tài khoản Quản trị!");
    window.location.href = "/login.html"; // Đường dẫn về trang login
    return; // Dừng chạy code
  }

  const user = JSON.parse(userStr);

  // 3. Kiểm tra quyền (Role)
  // Lưu ý: Key 'role' hay 'VaiTro' phải khớp với lúc bạn lưu ở login.html
  if (user.role !== "Admin") {
    alert("⛔ Bạn không có quyền truy cập trang này!");
    window.location.href = "/index.html"; // Đá về trang chủ
    return;
  }

  // Nếu chạy đến đây nghĩa là hợp lệ -> Hiển thị trang
  console.log("✅ Admin access granted: " + user.username);
})();
