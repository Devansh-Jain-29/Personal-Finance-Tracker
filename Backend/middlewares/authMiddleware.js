const expressAsyncHandler = require("express-async-handler");
const UserSchema = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const authMiddleware = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    if (token) {
      const decodedUser = jwt.verify(token, process.env.JWT_KEY);
      const user = await UserSchema.findById(decodedUser?.id);
      res.json({
        auth: true,
        data: user,
      });
    }
  } catch (error) {
    throw new Error("Not Authorised Token Expiry");
  }
});

module.exports = authMiddleware;
