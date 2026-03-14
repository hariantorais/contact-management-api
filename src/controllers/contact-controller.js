const contactService = require("../services/contact-service");

const create = async (req, res, next) => {
  try {
    const user = req.user; // ambil dari authMiddleware
    const result = await contactService.create(user, req.body);
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await contactService.list(user);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.id;
    const result = await contactService.update(user, contactId, req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.id;
    await contactService.remove(user, contactId);
    res
      .status(200)
      .json({ status: "success", message: "Kontak berhasil dihapus" });
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await contactService.search(user, req.query);
    res.status(200).json({
      status: "success",
      ...result, // mengirim data dan paging
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  update,
  remove,
  search,
};
