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
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- THÊM MỚI ---
export const create = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { TenSach } = req.body;
    if (!TenSach) return res.status(400).json({ message: "Thiếu tên sách" });

    // Lấy link ảnh từ Cloudinary (nếu có)
    const imgUrl = req.file ? req.file.path : null;

    // Gộp dữ liệu
    const bookData = { ...req.body, AnhBia: imgUrl };

    await sachService.create(bookData);
    res.status(201).json({ message: "Thêm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

// --- CẬP NHẬT ---
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    let bookData = { ...req.body };
    
    // Nếu có ảnh mới -> Lấy link mới
    if (req.file) {
        bookData.AnhBia = req.file.path;
    }

    await sachService.update(id, bookData);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await sachService.remove(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const nhapHang = async (req, res) => {
  try {
    const id = req.params.id;
    const { soLuong } = req.body;
    await sachService.importStock(id, soLuong);
    res.status(200).json({ message: "Nhập hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};