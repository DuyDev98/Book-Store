// File: js/admin-guard.js

/* =============================================================
   PHẦN 1: BẢO VỆ TRANG & ĐĂNG XUẤT (Giữ nguyên logic cũ)
   ============================================================= */
(function() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    // 1. Kiểm tra đăng nhập
    if (!token) {
        // Tránh loop vô tận nếu đang ở trang login
        if (!window.location.href.includes("login.html")) {
            window.location.href = "../../components/login.html";
        }
        return;
    }

    // 2. Kiểm tra quyền Admin
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role !== "Admin" && !window.location.href.includes("index.html")) {
                alert("Bạn không có quyền truy cập trang quản trị!");
                window.location.href = "../../index.html";
                return;
            }
        } catch (e) {
            localStorage.clear();
            window.location.href = "../../components/login.html";
        }
    }
})();

function adminLogout() {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.clear();
        window.location.href = "../../components/login.html";
    }
}

/* =============================================================
   PHẦN 2: TỰ ĐỘNG BIẾN HÌNH ALERT -> TOASTIFY (MỚI)
   ============================================================= */
(function setupToastify() {
    // 1. Tự động chèn CSS Toastify vào <head>
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
    document.head.appendChild(link);

    // 2. Tự động chèn JS Toastify vào <head>
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/toastify-js";
    script.onload = () => {
        // Sau khi thư viện tải xong, ta sẽ GHI ĐÈ hàm alert mặc định
        overrideNativeAlert();
    };
    document.head.appendChild(script);
})();

function overrideNativeAlert() {
    // Lưu lại alert gốc (phòng khi cần dùng để debug)
    const originalAlert = window.alert;

    // Định nghĩa lại hàm alert của trình duyệt
    window.alert = function(message) {
        // Kiểm tra xem tin nhắn là "Lỗi" hay "Thành công" để chọn màu
        const msgStr = String(message).toLowerCase();
        const isError = msgStr.includes("lỗi") || msgStr.includes("error") || msgStr.includes("thất bại") || msgStr.includes("cảnh báo");

        // Màu sắc: Đỏ cho lỗi, Xanh Gradient cho thành công
        const bgColors = isError 
            ? "linear-gradient(to right, #ff5f6d, #ffc371)" // Đỏ cam
            : "linear-gradient(to right, #00b09b, #96c93d)"; // Xanh lá

        // Gọi Toastify thay vì hiện popup
        Toastify({
            text: message,
            duration: 3000,       // Tự tắt sau 3 giây
            close: true,          // Hiện nút đóng
            gravity: "top",       // Hiện ở trên cùng
            position: "right",    // Hiện bên phải
            stopOnFocus: true,    // Di chuột vào thì không tắt
            style: {
                background: bgColors,
                borderRadius: "8px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16)"
            },
            onClick: function(){} // Callback khi click
        }).showToast();
        
        // Console log ra để dev vẫn đọc được
        console.log(`[System Alert]: ${message}`);
    };
}