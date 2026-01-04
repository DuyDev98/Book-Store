// File: src/controller/sach.controller.js
import * as sachService from "../services/sach.services.js";

export const getAll = async (req, res) => {
  try {
    const data = await sachService.getAll();
    res.status(200).json({ data }); 
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await sachService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.status(200).json(data); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { TenSach } = req.body;
    if (!TenSach) return res.status(400).json({ message: "Thiếu tên sách" });

    const imgUrl = req.file ? req.file.path : null;
    const bookData = { ...req.body, AnhBia: imgUrl };

    await sachService.create(bookData);
    res.status(201).json({ message: "Thêm thành công" });
  } catch (err) {
    console.error("Lỗi Create Sach:", err); // Log lỗi ra console để debug
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // 1. Lấy thông tin sách cũ để giữ lại Ảnh Bìa nếu không upload ảnh mới
    const oldBook = await sachService.getById(id);
    if (!oldBook) return res.status(404).json({ message: "Không tìm thấy sách" });

    let bookData = { ...req.body };
    
    // Nếu có file mới -> dùng file mới. Nếu không -> dùng lại ảnh cũ
    if (req.file) {
        bookData.AnhBia = req.file.path;
    } else {
        bookData.AnhBia = oldBook.AnhBia;
    }

    await sachService.update(id, bookData);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi Update Sach:", err);
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await sachService.remove(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Trong file src/controller/sach.controller.js

export const nhapHang = async (req, res) => {
  try {
    // 1. Kiểm tra xem có nhận được số lượng không
    const soLuong = req.body.soLuong;
    
    // Nếu không có số lượng hoặc không phải số -> Báo lỗi ngay
    if (soLuong === undefined || soLuong === null || isNaN(soLuong)) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ! Vui lòng kiểm tra lại số lượng." 
      });
    }

    // 2. Gọi service cập nhật
    await sachService.importStock(req.params.id, parseInt(soLuong));
    
    res.status(200).json({ message: "Nhập hàng thành công" });
  } catch (err) { 
    console.error("Lỗi nhập hàng:", err); // Log lỗi ra terminal để dễ sửa
    res.status(500).json({ message: err.message }); 
  }
};
export const getLowStockStats = async (req, res) => {
  try {
    const countResult = await sachService.getLowStockCount();
    const listResult = await sachService.getLowStockList();
    res.status(200).json({ 
      count: countResult.SoLuong,
      items: listResult 
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
        res.status(200).json({ revenue, topSelling });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ... (các hàm khác)

// HÀM NÀY PHẢI CÓ VÀ PHẢI CÓ CHỮ 'export'
export const getRelated = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gọi service lấy sách
    // Lưu ý: Kiểm tra xem database dùng cột 'MaLoai' hay 'MaLoaiSach'
    // Bước 1: Lấy sách hiện tại
    const currentBook = await sachService.getById(id);
    if (!currentBook) return res.status(404).json({ message: "Not found" });

    // Bước 2: Lấy sách cùng loại
    const relatedBooks = await sachService.getRelatedBooks(currentBook.MaLoaiSach, id); // Hoặc currentBook.MaLoai
    
    res.status(200).json(relatedBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};