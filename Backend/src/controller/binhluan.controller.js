import * as service from "../services/binhluan.services.js";

// --- [USER CONTROLLER] ---
export const add = async (req, res) => {
    try {
        const { MaKH, MaSach, NoiDung } = req.body;
        if (!MaKH || !MaSach || !NoiDung) {
            return res.status(400).json({ status: "ERR", message: "Thiếu thông tin" });
        }
        await service.addComment(MaKH, MaSach, NoiDung);
        res.status(200).json({ status: "OK", message: "Thêm thành công" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const getByBook = async (req, res) => {
    try {
        const data = await service.getCommentsByBook(req.params.MaSach);
        res.status(200).json({ status: "OK", data });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

// --- [ADMIN CONTROLLER] ---
export const adminGetAll = async (req, res) => {
    try {
        // Lấy tham số từ thanh địa chỉ (URL Queries)
        // Ví dụ: /admin/all?q=abc&status=pending&book=1
        const { q, status, book } = req.query;
        
        const data = await service.getAllCommentsAdmin(q, status, book);
        res.status(200).json({ status: "OK", data });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const adminUpdateStatus = async (req, res) => {
    try {
        await service.updateStatus(req.params.id, req.body.status);
        res.status(200).json({ status: "OK", message: "Đã cập nhật" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const adminDelete = async (req, res) => {
    try {
        await service.deleteComment(req.params.id);
        res.status(200).json({ status: "OK", message: "Đã xóa" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};