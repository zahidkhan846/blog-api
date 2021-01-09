const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCade = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPwd) => {
      const user = new User({
        email: email,
        password: hashedPwd,
        userName: userName,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User Created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let currentUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 401;
        throw error;
      }
      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: currentUser.email,
          userId: currentUser._id.toString(),
        },
        "jwtsecretkey",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: currentUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

exports.getUserInfo = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({
        user: user,
        message: "User fetch successfull!",
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};
