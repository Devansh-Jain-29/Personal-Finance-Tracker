const {
  addIncome,
  fetchIncomeById,
  updateIncomeById,
  deleteIncomeById,
  fetchIncomeByUserId,
  fetchIncomeByCategory,
} = require("../controllers/income");
const {
  addExpense,
  deleteExpenseById,
  fetchExpenseById,
  updateExpenseById,
  fetchExpenseByUserId,
  fetchExpenseByCategory,
} = require("../controllers/expense");
const {
  addUser,
  fetchUser,
  loginUser,
  transaction,
} = require("../controllers/user");
const {
  addCategory,
  deleteCategoryById,
  fetchCategoryById,
  fetchCategoryByName,
  fetchCategoryByType,
  updateCategoryById,
} = require("../controllers/category");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

//User
router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/users", fetchUser);
router.post("/entries", transaction);

router.post("/auth", authMiddleware);

//Income
router.post("/add-income", addIncome);
router.post("/incomes", fetchIncomeByUserId);
router.post("/income-category", fetchIncomeByCategory);
router.get("/:id", fetchIncomeById);
router.put("/income/:id", updateIncomeById);
router.delete("/income/:id", deleteIncomeById);

//Expense
router.post("/add-expense", addExpense);
router.post("/expenses", fetchExpenseByUserId);
router.post("/expense-category", fetchExpenseByCategory);
router.get("/:id", fetchExpenseById);
router.put("/expense/:id", updateExpenseById);
router.delete("/expense/:id", deleteExpenseById);

//Category
router.post("/add-category", addCategory);
router.post("/category-name", fetchCategoryByName);
router.post("/category-type", fetchCategoryByType);
router.get("/:id", fetchCategoryById);
router.put("/category/:id", updateCategoryById);
router.delete("/category/:id", deleteCategoryById);

module.exports = router;
