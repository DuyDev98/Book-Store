// controller/tacgia.controller.js
import * as tacgiaService from '../services/tacgia.services.js';

// Lấy tất cả tác giả
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await tacgiaService.getAuthors();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách tác giả' });
  }
};

// Lấy tác giả theo ID
export const getAuthorById = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await tacgiaService.getAuthorById(id);
    if (!author) {
      return res.status(404).json({ message: 'Tác giả không tìm thấy' });
    }
    res.json(author);
  } catch (err) {
    console.error('Lỗi khi lấy tác giả theo ID:', err);
    res.status(500).json({ message: 'Lỗi khi lấy tác giả theo ID', error: err.message });
  }
};

// Thêm tác giả mới
export const addAuthor = async (req, res) => {
  try {
    const { TenTacGia, NamSinh, NamMat } = req.body;

    if (!TenTacGia) {
      return res.status(400).json({ message: 'Tên tác giả không được để trống' });
    }

    await tacgiaService.addAuthor(TenTacGia, NamSinh, NamMat);
    res.status(201).json({ success: true, message: 'Thêm tác giả thành công' });
  } catch (err) {
    console.error('Error adding author:', err);
    res.status(500).json({
      success: false,
      message: 'Không thể thêm tác giả',
      error: err.message
    });
  }
};

// Cập nhật tác giả theo ID
export const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { TenTacGia, NamSinh, NamMat } = req.body;

  try {
    const result = await tacgiaService.updateAuthor(id, TenTacGia, NamSinh, NamMat);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả để cập nhật' });
    }

    res.json({ message: 'Cập nhật tác giả thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Không thể cập nhật tác giả', error: err.message });
  }
};

// Xóa tác giả theo ID
export const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await tacgiaService.deleteAuthor(id);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả để xóa' });
    }

    res.json({ message: 'Tác giả đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Không thể xóa tác giả', error: err.message });
  }
};
