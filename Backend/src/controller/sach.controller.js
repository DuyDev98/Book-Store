// File: src/controller/sach.controller.js
import * as sachService from "../services/sach.services.js";

// 1. Lấy danh sách (Giữ nguyên cấu trúc cho Admin)
export const getAll = async (req, res) => {
  try {
    const data = await sachService.getAll();
    res.status(200).json({ data }); 
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// 2. Lấy chi tiết (QUAN TRỌNG: Đã sửa để trả về object trực tiếp)
export const getById = async (req, res) => {
  try {
    const data = await sachService.getById(req.params.id);
    
    if (!data) {
        return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    // Trả về data trực tiếp (Không bọc trong { data })
    res.status(200).json(data); 
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ... Các hàm create, update, remove, nhapHang giữ nguyên như cũ ...
export const create = async (req, res) => {
  try {
    const imgUrl = req.file ? req.file.path : null;
    const bookData = { ...req.body, AnhBia: imgUrl };
    await sachService.create(bookData);
    res.status(201).json({ message: "Thêm thành công" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    let bookData = { ...req.body };
    if (req.file) bookData.AnhBia = req.file.path;
    await sachService.update(req.params.id, bookData);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    await sachService.remove(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const nhapHang = async (req, res) => {
  try {
    await sachService.importStock(req.params.id, req.body.soLuong);
    res.status(200).json({ message: "Nhập hàng thành công" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
//API trả về số liệu thống kê sách sắp hết hàng


// SỬA: Trả về cả số lượng đếm VÀ danh sách chi tiết
export const getLowStockStats = async (req, res) => {
  try {
    const countResult = await sachService.getLowStockCount();
    const listResult = await sachService.getLowStockList(); // Gọi hàm vừa thêm ở service
    
    res.status(200).json({ 
      count: countResult.SoLuong,
      items: listResult // Trả về mảng sách
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const getDashboardCharts = async (req, res) => {
    try {
        const [revenue, topSelling] = await Promise.all([
            sachService.getRevenueStats(),
            sachService.getTopSellingStats()
        ]);

        res.status(200).json({
            revenue,      // Dữ liệu biểu đồ cột
            topSelling    // Dữ liệu biểu đồ tròn
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};