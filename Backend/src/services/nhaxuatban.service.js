// services/nhaxuatban.service.js
import NXBModel from "../modules/nhaxuatban.model.js";

export default class NXBService {
  static async getAll() {
    return await NXBModel.getAll();
  }

  static async create(data) {
    return await NXBModel.create(data);
  }

  static async update(id, data) {
    return await NXBModel.update(id, data);
  }

  static async delete(id) {
    return await NXBModel.delete(id);
  }
}
