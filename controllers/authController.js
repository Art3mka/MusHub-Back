const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created.",
      userId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User with this E-Mail could not be found.");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is not correct.");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token: token, userId: user._id.toString(), username: user.name });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
