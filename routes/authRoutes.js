const express = require("express");

const authController = require("../controllers/authController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/verify", isAuth, authController.verifyToken);

module.exports = router;
