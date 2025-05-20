const express = require("express");

const categoryController = require("../controllers/categoryController");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/create", isAuth, categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.put("/update/:categoryId", isAuth, categoryController.updateCategory);

router.delete("/delete/:categoryId", isAuth, categoryController.deleteCategory);

module.exports = router;
