// controllers/nhaxuatban.controller.js
import NXBService from "../services/nhaxuatban.service.js";

export default class NXBController {
  static async getAll(req, res) {
    const data = await NXBService.getAll();
    res.json(data);
  }

  static async create(req, res) {
    const { TenNXB, NamThanhLap, DiaChi } = req.body;
    await NXBService.create({ TenNXB, NamThanhLap, DiaChi });
    res.json({ message: "Tạo NXB thành công" });
  }

  static async update(req, res) {
    const id = req.params.id;
    const { TenNXB, NamThanhLap, DiaChi } = req.body;
    await NXBService.update(id, { TenNXB, NamThanhLap, DiaChi });
    res.json({ message: "Cập nhật thành công" });
  }

  static async delete(req, res) {
    const id = req.params.id;
    await NXBService.delete(id);
    res.json({ message: "Xóa thành công" });
  }
}
