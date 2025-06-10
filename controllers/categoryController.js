const Category = require("../models/Category");

exports.createCategory = async (req, res, next) => {
  const title = req.body.title;
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Недостаточно прав для данного действия" });
    }
    if (!title) {
      return res.status(400).json({ message: "Введите имя категории." });
    }
    const category = new Category({
      title: title,
    });
    const newCategory = await category.save();
    res.status(200).json({ newCategory });
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

exports.updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { title } = req.body;
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Недостаточно прав для данного действия" });
  }
  try {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: "Категория не найдена" });
    }
    res.status(200).json({ updatedCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Недостаточно прав для данного действия" });
  }
  try {
    const result = await Category.findByIdAndDelete(categoryId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
