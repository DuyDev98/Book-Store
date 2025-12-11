import * as service from "../services/binhluan.services.js";

// --- [USER CONTROLLER] ---

export const add = async (req, res) => {
    try {
        const { MaKH, MaSach, NoiDung } = req.body;
        
        if (!MaKH || !MaSach || !NoiDung) {
            return res.status(400).json({ status: "ERR", message: "Thiếu thông tin gửi bình luận" });
        }

        await service.addComment(MaKH, MaSach, NoiDung);
        res.status(200).json({ status: "OK", message: "Thêm bình luận thành công" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const getByBook = async (req, res) => {
    try {
        const { MaSach } = req.params;
        const data = await service.getCommentsByBook(MaSach);
        res.status(200).json({ status: "OK", data });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

// --- [ADMIN CONTROLLER] ---

export const adminGetAll = async (req, res) => {
    try {
        const data = await service.getAllCommentsAdmin();
        res.status(200).json({ status: "OK", data });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const adminUpdateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        await service.updateStatus(id, status);
        res.status(200).json({ status: "OK", message: "Đã cập nhật trạng thái" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

export const adminDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteComment(id);
        res.status(200).json({ status: "OK", message: "Đã xóa bình luận" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};