const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/authController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isLength({ min: 5 }).withMessage("Имя должно быть длиннее 5-ти символов."),
    body("email").isEmail().withMessage("Введите правильный E-Mail."),
    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Пароль должен содержать только латинские символы.")
      .isStrongPassword({ minLength: 5, minSymbols: 0 })
      .withMessage("Пароль должен быть длиннее 5-ти символов и содержать минимум 1 заглавную букву и 1 число."),
  ],
  authController.register
);

router.post("/login", authController.login);

router.get("/verify", isAuth, authController.verifyToken);

module.exports = router;
