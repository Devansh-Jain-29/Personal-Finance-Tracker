const expressAsyncHandler = require("express-async-handler");
const UserSchema = require("../models/UserModel");
const IncomeSchema = require("../models/IncomeModel");
const ExpenseSchema = require("../models/ExpenseModel");
const generateToken = require("../middlewares/generateToken");

//addUsers
exports.addUser = expressAsyncHandler(async (req, res) => {
  const { email, firstname, lastname, password } = req?.body;

  //check if user exists
  const userExists = await UserSchema.findOne({ email: req.body.email });
  if (userExists) throw new Error("User already exists");

  try {
    const user = await UserSchema.create({
      email,
      firstname,
      lastname,
      password,
    });
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});

//fetchUsers
exports.fetchUser = expressAsyncHandler(async (req, res) => {
  try {
    const user = await UserSchema.find({});
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});

//login
exports.loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  const userFound = await UserSchema.findOne({ email });

  if (userFound && (await userFound?.isPasswordMatch(password))) {
    res.json({
      _id: userFound?._id,
      firstname: userFound?.firstname,
      lastname: userFound?.lastname,
      email: userFound?.email,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

exports.transaction = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, page, limit } = req?.body;

    if (page && limit) {
      // Pagination logic
      const skip = (page - 1) * limit;
      // Fetch income entries for the user with pagination
      const incomeEntries = await IncomeSchema.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category");

      // Fetch expense entries for the user with pagination
      const expenseEntries = await ExpenseSchema.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category");

      // Combine income and expense entries
      const entries = [...incomeEntries, ...expenseEntries];

      // Sort combined entries by date and timestamp in descending order
      entries.sort((a, b) => b.date.getTime() - a.date.getTime());

      res.json(entries);
    } else {
      // Fetch all income entries for the user without pagination
      const incomeEntries = await IncomeSchema.find({ user: userId }).populate(
        "category"
      );

      // Fetch all expense entries for the user without pagination
      const expenseEntries = await ExpenseSchema.find({
        user: userId,
      }).populate("category");

      // Combine income and expense entries
      const entries = [...incomeEntries, ...expenseEntries];

      // Sort combined entries by date and timestamp in descending order
      entries.sort((a, b) => b.date.getTime() - a.date.getTime());

      res.json(entries);
    }
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
