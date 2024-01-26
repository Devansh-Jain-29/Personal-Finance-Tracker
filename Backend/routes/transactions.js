const { addIncome } = require("../controllers/income");

const router = require("express").Router();

// router.get("/", (req, res) => {
//   res.send("hello world");
// });

router.post("/add-income", addIncome);

module.exports = router;
