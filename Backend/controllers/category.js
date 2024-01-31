const CategorySchema = require("../models/CategoryModel");
const expressAsyncHandler = require("express-async-handler");

//add category
exports.addCategory = expressAsyncHandler(async (req, res) => {
  const { name, color, type } = req.body;

  try {
    const category = await CategorySchema.create({
      name,
      color,
      type,
    });
    //validations
    if (!name || !color || !type) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all category by id
exports.fetchCategoryById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const category = await CategorySchema.findById(id).populate("user");
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all category by name
exports.fetchCategoryByName = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const category = await CategorySchema.find({ name }).sort({
      createdAt: -1,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all category by type
exports.fetchCategoryByType = expressAsyncHandler(async (req, res) => {
  const { type } = req.body;
  try {
    const category = await CategorySchema.find({ type }).sort({
      createdAt: -1,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Update Category
exports.updateCategoryById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { name, color, type } = req.body;

  try {
    const category = await CategorySchema.findByIdAndUpdate(
      id,
      {
        name,
        color,
        type,
      },
      { new: true }
    );
    //validations
    if (!name || !color || !type) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete Category
exports.deleteCategoryById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;

  try {
    await CategorySchema.findByIdAndDelete(id);
    res.status(200).json("Category Record Deleted Successfully.");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
