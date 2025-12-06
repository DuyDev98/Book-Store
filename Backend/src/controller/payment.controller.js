import { thanhToanService } from "../services/paymentService.js";

export const thanhToan = async (req, res) => {
  try {
    const { MaKH } = req.body;

    const result = await thanhToanService(MaKH);

    res.json({
      status: "OK",
      message: "Thanh toán thành công",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "ERR",
      message: err.message,
    });
  }
};
