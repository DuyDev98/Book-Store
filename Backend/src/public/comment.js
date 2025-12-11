/* ==========================================================================
   COMMENT.JS - XỬ LÝ BÌNH LUẬN (ĐÃ FIX)
   ========================================================================== */

const API_CMT_URL = "/api"; // Đổi tên biến tránh trùng lặp

// Lấy thông tin user từ localStorage (Hàm này đã được nâng cấp)
function getCurrentUserCmt() {
    // 1. Thử lấy ID từ key riêng
    let userId = localStorage.getItem("MaKH");
    let userInfo = null;
    
    try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined") {
            userInfo = JSON.parse(userStr);
            
            // 2. [QUAN TRỌNG] Nếu không thấy key riêng, thử tìm trong object user
            if (!userId && userInfo && userInfo.MaKH) {
                userId = userInfo.MaKH;
                // Tiện tay lưu lại luôn để lần sau dễ tìm
                localStorage.setItem("MaKH", userId);
            }
        }
    } catch (e) {
        console.error("Lỗi parse user info:", e);
    }
    
    return { userId, userInfo };
}

// Hàm lấy Header chứa Token
function getAuthHeadersCmt() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token || ""
    };
}

// Kiểm tra và hiển thị form bình luận hoặc yêu cầu đăng nhập
function checkCommentAuth() {
    const userForm = document.getElementById("user-comment-form");
    const guestAlert = document.getElementById("guest-login-alert");
    
    if (!userForm || !guestAlert) return;

    const { userId } = getCurrentUserCmt();

    // Kiểm tra kỹ hơn: userId phải tồn tại và khác chuỗi "null"/"undefined"
    if (userId && userId !== "null" && userId !== "undefined") {
        // User đã đăng nhập -> hiện form bình luận
        userForm.style.display = "block";
        guestAlert.style.display = "none";
        
        // Hiển thị avatar người dùng hiện tại (cho đẹp)
        const { userInfo } = getCurrentUserCmt();
        const avatarBox = userForm.querySelector(".rounded-circle");
        if(avatarBox && userInfo && userInfo.username) {
            avatarBox.innerHTML = userInfo.username.charAt(0).toUpperCase();
        }
    } else {
        // Khách vãng lai -> hiện thông báo yêu cầu đăng nhập
        userForm.style.display = "none";
        guestAlert.style.display = "block";
    }
}

// Gửi bình luận
window.submitComment = async function() {
    const textarea = document.getElementById("comment-content");
    const content = textarea?.value.trim();
    
    if (!content) {
        alert("Vui lòng nhập nội dung bình luận!");
        return;
    }

    const bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) {
        alert("Không tìm thấy mã sách!");
        return;
    }

    const { userId } = getCurrentUserCmt();
    
    // Debug: Kiểm tra xem ID có lấy được không
    console.log("Submit Comment - UserID:", userId, "BookID:", bookId);

    if (!userId) {
        alert("Phiên đăng nhập không hợp lệ hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại!");
        return;
    }

    // Hiệu ứng loading cho nút gửi
    const btnSubmit = document.querySelector("#user-comment-form button");
    const oldText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Đang gửi...";
    btnSubmit.disabled = true;

    try {
        const res = await fetch(`${API_CMT_URL}/binhluan/add`, {
            method: "POST",
            headers: getAuthHeadersCmt(),
            body: JSON.stringify({
                MaKH: userId,
                MaSach: bookId,
                NoiDung: content
            })
        });

        const data = await res.json();
        
        if (res.ok && data.status === "OK") {
            // Tạo hiệu ứng thêm comment giả ngay lập tức (không cần load lại từ server)
            // (Hoặc đơn giản là load lại danh sách)
            alert("✅ Đã gửi bình luận!");
            textarea.value = ""; 
            loadComments(bookId); 
        } else {
            alert("❌ Lỗi: " + (data.message || "Không thể gửi bình luận"));
        }
    } catch (err) {
        console.error("Lỗi gửi bình luận:", err);
        alert("Lỗi kết nối server!");
    } finally {
        btnSubmit.innerHTML = oldText;
        btnSubmit.disabled = false;
    }
}

// Tải danh sách bình luận
async function loadComments(bookId) {
    const commentList = document.getElementById("comment-list");
    if (!commentList) return;

    if (!bookId) {
        bookId = new URLSearchParams(window.location.search).get("id");
    }
    if (!bookId) return;

    try {
        const res = await fetch(`${API_CMT_URL}/binhluan/${bookId}`);
        const data = await res.json();

        if (data.status === "OK" && data.data && data.data.length > 0) {
            let html = "";
            data.data.forEach(comment => {
                const date = new Date(comment.NgayBinhLuan);
                // Format ngày giờ đẹp hơn
                const dateStr = date.toLocaleDateString('vi-VN');
                const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                
                // Xử lý tên và avatar
                const displayName = comment.HoTen || comment.Username || "Người dùng";
                const firstChar = displayName.charAt(0).toUpperCase();

                html += `
                    <div class="d-flex align-items-start gap-3 border-bottom pb-3 mb-3 animate__animated animate__fadeIn">
                        <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px; flex-shrink: 0;">
                            ${firstChar}
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold text-dark">${displayName}</span>
                                <small class="text-muted" style="font-size: 0.8rem">${dateStr} lúc ${timeStr}</small>
                            </div>
                            <div class="bg-light p-2 rounded">
                                <p class="text-secondary mb-0 lh-base text-break">${comment.NoiDung}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            commentList.innerHTML = html;
        } else {
            commentList.innerHTML = `
                <div class="text-center py-4 bg-light rounded">
                    <i class="bi bi-chat-quote text-muted fs-1"></i>
                    <p class="text-muted mt-2 mb-0">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            `;
        }
    } catch (err) {
        console.error("Lỗi tải bình luận:", err);
        commentList.innerHTML = `<p class="text-center text-danger small">Không thể tải bình luận lúc này.</p>`;
    }
}

// Khởi chạy
window.addEventListener("DOMContentLoaded", () => {
    // Đợi một chút để script.js load xong user info (nếu có)
    setTimeout(() => {
        if (document.getElementById("comment-section")) {
            checkCommentAuth();
            const bookId = new URLSearchParams(window.location.search).get("id");
            if (bookId) loadComments(bookId);
        }
    }, 500);
});