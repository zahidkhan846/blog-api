const express = require("express");
const { signup, login } = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");

const route = express.Router();

route.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exists.");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
    body("userName").trim().not().isEmpty(),
  ],
  signup
);

route.post("/login", login);

module.exports = route;
