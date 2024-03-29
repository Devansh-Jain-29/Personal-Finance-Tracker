const IncomeSchema = require("../models/IncomeModel");
const CategorySchema = require("../models/CategoryModel");

const expressAsyncHandler = require("express-async-handler");

//add income
exports.addIncome = expressAsyncHandler(async (req, res) => {
  const { title, amount, category, description, date, user } = req.body;

  try {
    const income = await IncomeSchema.create({
      title,
      amount,
      category,
      description,
      date,
      user,
    });
    //validations
    if (!title || !category || !description || !date || !user) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all income by id
exports.fetchIncomeById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const income = await IncomeSchema.findById(id).populate("user");
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all income by userid
exports.fetchIncomeByUserId = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const incomes = await IncomeSchema.find({ user: userId })
      .sort({ date: -1 })
      .populate("user")
      .populate("category");
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch by category
exports.fetchIncomeByCategory = expressAsyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  try {
    const category = await CategorySchema.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const incomes = await IncomeSchema.find({
      category: category?._id,
    })
      .sort({ date: -1 })
      .populate("user")
      .populate("category");
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Update Income
exports.updateIncomeById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { title, amount, category, description, date } = req.body;

  try {
    const income = await IncomeSchema.findByIdAndUpdate(
      id,
      {
        title,
        amount,
        category,
        description,
        date,
      },
      { new: true }
    );
    //validations
    if (!title || !category || !description || !date || !user) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete Income
exports.deleteIncomeById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;

  try {
    const income = await IncomeSchema.findByIdAndDelete(id);
    res.status(200).json("Income Record Deleted Successfully.");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
