const Category = require("../models/Category");

exports.createCategory = async (req, res, next) => {
  const title = req.body.title;
  try {
    if (!title) {
      return res.status(400).json({ message: "Введите имя категории." });
    }
    const category = new Category({
      title: title,
    });
    const result = await category.save();
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res, next) => {};

exports.deleteCategory = async (req, res, next) => {};
