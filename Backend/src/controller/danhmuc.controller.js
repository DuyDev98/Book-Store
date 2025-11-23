import * as danhmucService from "../services/danhmuc.services.js";

export const getAll = async (req, res) => {
  try {
    const data = await danhmucService.getAllDanhMuc();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
