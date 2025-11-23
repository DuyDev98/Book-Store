import UserServices from "../services/UserServices.js";

const createUser = async (req, res) => {
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

const createAdmin = async (req, res) => {
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
const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { Username, PassWord } = req.body;
    if (!Username || !PassWord) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required",
      });
    } else {
      const response = await UserServices.loginUser(req.body);
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export default { createUser, loginUser, createAdmin };
