import * as binhLuanService from "../services/binhluan.services.js";

// Hàm thêm bình luận
export const add = async (req, res) => {
    try {
        const { MaKH, MaSach, NoiDung } = req.body;

        if (!MaKH || !MaSach || !NoiDung) {
            return res.status(400).json({ status: "ERR", message: "Thiếu thông tin!" });
        }

        await binhLuanService.addComment(MaKH, MaSach, NoiDung);
        
        res.status(200).json({ status: "OK", message: "Đã gửi bình luận" });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};

// Hàm lấy bình luận
export const getByBook = async (req, res) => {
    try {
        const { MaSach } = req.params;
        const data = await binhLuanService.getCommentsByBook(MaSach);
        
        res.status(200).json({ status: "OK", data });
    } catch (err) {
        res.status(500).json({ status: "ERR", message: err.message });
    }
};