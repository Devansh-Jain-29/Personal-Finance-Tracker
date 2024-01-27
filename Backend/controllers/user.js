const expressAsyncHandler = require("express-async-handler");
const UserSchema = require("../models/UserModel");
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
