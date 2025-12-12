/* ==========================================================================
   COMMENT.JS - XỬ LÝ BÌNH LUẬN (FINAL FIX)
   ========================================================================== */

const API_CMT_URL = "/api"; 

// Lấy thông tin user an toàn
function getCurrentUserCmt() {
    let userId = localStorage.getItem("MaKH");
    let userInfo = null;
    try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined") {
            userInfo = JSON.parse(userStr);
            if (!userId && userInfo && userInfo.MaKH) {
                userId = userInfo.MaKH;
            }
        }
    } catch (e) { }
    return { userId, userInfo };
}

function getAuthHeadersCmt() {
    const token = localStorage.getItem("token");
    return { "Content-Type": "application/json", "Authorization": token || "" };
}

// Kiểm tra quyền
function checkCommentAuth() {
    const userForm = document.getElementById("user-comment-form");
    const guestAlert = document.getElementById("guest-login-alert");
    if (!userForm || !guestAlert) return;

    const { userId } = getCurrentUserCmt();
    if (userId && userId !== "null") {
        userForm.style.display = "block";
        guestAlert.style.display = "none";
    } else {
        userForm.style.display = "none";
        guestAlert.style.display = "block";
    }
}

// Gửi bình luận
window.submitComment = async function() {
    const textarea = document.getElementById("comment-content");
    const content = textarea?.value.trim();
    if (!content) return alert("Vui lòng nhập nội dung!");

    const bookId = new URLSearchParams(window.location.search).get("id");
    const { userId } = getCurrentUserCmt();

    if (!userId) return alert("Vui lòng đăng nhập lại!");

    // Hiệu ứng nút bấm
    const btnSubmit = document.querySelector("#user-comment-form button");
    const oldText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Đang gửi...";
    btnSubmit.disabled = true;

    try {
        const res = await fetch(`${API_CMT_URL}/binhluan/add`, {
            method: "POST",
            headers: getAuthHeadersCmt(),
            body: JSON.stringify({ MaKH: userId, MaSach: bookId, NoiDung: content })
        });

        const data = await res.json();
        
        if (res.ok && data.status === "OK") {
            alert("✅ Đã gửi bình luận! (Chờ Admin duyệt mới hiện nhé)");
            textarea.value = ""; 
        } else {
            alert("❌ Lỗi: " + (data.message || "Không thể gửi"));
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server!");
    } finally {
        // [QUAN TRỌNG] Reset nút bấm dù thành công hay thất bại
        btnSubmit.innerHTML = oldText;
        btnSubmit.disabled = false;
    }
}

// Tải danh sách
async function loadComments(bookId) {
    const commentList = document.getElementById("comment-list");
    if (!commentList) return;
    if (!bookId) bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) return;

    try {
        const res = await fetch(`${API_CMT_URL}/binhluan/${bookId}`);
        const data = await res.json();

        if (data.status === "OK" && data.data && data.data.length > 0) {
            let html = "";
            data.data.forEach(comment => {
                const date = new Date(comment.NgayBinhLuan).toLocaleDateString('vi-VN');
                const name = comment.HoTen || comment.Username || "Người dùng";
                html += `
                    <div class="d-flex align-items-start gap-3 border-bottom pb-3 mb-3">
                        <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                            ${name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="fw-bold">${name} <small class="text-muted fw-normal ms-2">${date}</small></div>
                            <p class="mb-0 text-secondary">${comment.NoiDung}</p>
                        </div>
                    </div>`;
            });
            commentList.innerHTML = html;
        } else {
            commentList.innerHTML = `<p class="text-center text-muted mt-3">Chưa có bình luận nào.</p>`;
        }
    } catch (err) {}
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (document.getElementById("comment-section")) {
            checkCommentAuth();
            loadComments();
        }
    }, 500);
});