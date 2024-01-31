const ExpenseSchema = require("../models/ExpenseModel");
const expressAsyncHandler = require("express-async-handler");

//add expense
exports.addExpense = expressAsyncHandler(async (req, res) => {
  const { title, amount, category, description, date, user } = req.body;

  try {
    const expense = await ExpenseSchema.create({
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
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all expense by id
exports.fetchExpenseById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const expense = await ExpenseSchema.findById(id).populate("user");
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch all expense by userid
exports.fetchExpenseByUserId = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const expense = await ExpenseSchema.find({ user: userId })
      .sort({ date: -1 })
      .populate("user")
      .populate("category");

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//fetch by category
exports.fetchExpenseByCategory = expressAsyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  try {
    const expense = await ExpenseSchema.find({
      category: { name: categoryName },
    })
      .sort({ date: -1 })
      .populate("user")
      .populate("category");
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Update Expense
exports.updateExpenseById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { title, amount, category, description, date } = req.body;

  try {
    const expense = await ExpenseSchema.findByIdAndUpdate(
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
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete Expense
exports.deleteExpenseById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;

  try {
    await ExpenseSchema.findByIdAndDelete(id);
    res.status(200).json("Expense Record Deleted Successfully.");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
