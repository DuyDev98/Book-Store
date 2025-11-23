import KhachHangServices from "../services/khachhangrg.js";
const registerKH = async (req, res) => {
  try {
    console.log("Khách hàng data:", req.body);
    const { Username, HoTen, DiaChi, SDienThoai, Email } = req.body;

    if (!Username || !HoTen || !DiaChi || !SDienThoai || !Email) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Nhập đầy đủ thông tin khách hàng" });
    }

    const response = await KhachHangServices.createKH({
      Username,
      HoTen,
      DiaChi,
      SDienThoai,
      Email,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllKH = async (req, res) => {
  try {
    const response = await KhachHangServices.getAllKH();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export default { registerKH, getAllKH };
