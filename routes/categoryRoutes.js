const express = require("express");

const categoryController = require("../controllers/categoryController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/create", categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

module.exports = router;
