import UserServices from "../services/UserServices.js";

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { Username, PassWord, VaiTro } = req.body;
    if (!Username || !PassWord || !VaiTro) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required",
      });
    } else {
      const response = await UserServices.createUser(req.body);
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export default createUser;
