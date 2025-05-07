const express = require("express");

const userController = require("../controllers/userController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/:userId", isAuth, userController.getUser);

module.exports = router;
