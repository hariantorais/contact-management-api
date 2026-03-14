const userService = require("../services/user-service");

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    // req.user di dapat dari authmiddleware
    const currentUser = req.user;

    res.status(200).json({
      status: "success",
      data: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login, get };
