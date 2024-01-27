const { addIncome, fetchAllIncomeById } = require("../controllers/income");
const { addUser, fetchUser, loginUser } = require("../controllers/user");

const router = require("express").Router();

//User
router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/users", fetchUser);

//Income
router.post("/add-income", addIncome);
router.get("/:id", fetchAllIncomeById);

//Expense
module.exports = router;
