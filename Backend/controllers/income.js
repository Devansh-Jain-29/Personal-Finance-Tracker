const IncomeSchema = require("../models/IncomeModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../middlewares/generateToken");

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

  console.log(income);
});

//fetch all income by id
exports.fetchAllIncomeById = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const income = await IncomeSchema.findById(id);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
