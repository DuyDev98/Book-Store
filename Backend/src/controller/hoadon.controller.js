import * as khService from "../services/khachhang.service.js";

export const list = async (req, res) => {
  try { res.json(await khService.getAllKH()); }
  catch(e){ res.status(500).json({message:e.message}); }
};

export const createKH = async (req, res) => {
  try { const r = await khService.createKH(req.body); res.status(201).json(r); }
  catch(e){ res.status(500).json({message:e.message}); }
};
