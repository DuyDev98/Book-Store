import * as sachService from "../services/sach.services.js";

export const getAll = async (req, res) => {
  try {
    const data = await sachService.getAllSach();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = +req.params.id;
    const item = await sachService.getSachById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const result = await sachService.createSach(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const payload = { ...req.body, MaSach: +req.params.id };
    await sachService.updateSach(payload);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await sachService.deleteSach(+req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
