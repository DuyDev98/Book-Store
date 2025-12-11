import UserServices from "../services/User.Services.js";

// --- ĐĂNG KÝ ---
export const createUser = async (req, res) => {
  try {
    const { Username, PassWord } = req.body;

    if (!Username || !PassWord) {
      return res.status(200).json({
        status: "ERR",
        message: "Nhập đầy đủ thông tin",
      });
    }

    const response = await UserServices.createUser({
      Username,
      PassWord,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// --- ĐĂNG NHẬP ---
export const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { Username, PassWord } = req.body;
    if (!Username || !PassWord) {
      return res.status(200).json({
        status: "ERR",
        message: "Nhập đầy đủ thông tin",
      });
    }

    const response = await UserServices.loginUser({ Username, PassWord });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// --- TẠO ADMIN ---
export const createAdmin = async (req, res) => {
  try {
    const { Username, PassWord } = req.body;

    if (!Username || !PassWord) {
      return res.status(200).json({
        status: "ERR",
        message: "Nhập đầy đủ thông tin",
      });
    }

    const response = await UserServices.createAdmin({
      Username,
      PassWord,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};