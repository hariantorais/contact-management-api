const express = require("express");
const userController = require("../controllers/user-controller");
const contactController = require("../controllers/contact-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = new express.Router();

// USER
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);
router.get("/users/current", authMiddleware, userController.get);

// CONTACT
router.post("/contacts", authMiddleware, contactController.create);
router.get("/contacts", authMiddleware, contactController.list);
router.put("/contacts/:id", authMiddleware, contactController.update);
router.delete("/contacts/:id", authMiddleware, contactController.remove);
router.get("/contacts/search", authMiddleware, contactController.search);

module.exports = router;
