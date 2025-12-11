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
// --- 1. CHỨC NĂNG BẢO VỆ (Đuổi người lạ ra) ---
(function() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    // Nếu không có token -> Về trang login
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "../../components/login.html";
        return;
    }

    // Nếu không phải Admin -> Về trang chủ
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== "Admin") {
            alert("Bạn không có quyền truy cập trang này!");
            window.location.href = "../../index.html";
            return;
        }
    }
})();

// --- 2. CHỨC NĂNG ĐĂNG XUẤT (Dùng chung cho cả trang Admin) ---
function adminLogout() {
    if(confirm("Bạn muốn đăng xuất khỏi trang quản trị?")) {
        // Xóa sạch Token và thông tin User
        localStorage.clear(); 
        // Đá về trang đăng nhập
        window.location.href = "../../components/login.html";
    }
}