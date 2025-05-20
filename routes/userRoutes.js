const express = require("express");

const userController = require("../controllers/userController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", isAuth, userController.getAllUsers);
router.get("/:userId", isAuth, userController.getUser);
router.put("/update/:userId", isAuth, userController.updateUser);
router.delete("/delete/:userId", isAuth, userController.deleteUser);

module.exports = router;
