const express = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  addPost,
  getSinglePost,
  updateExistingPost,
  deleteSinglePost,
} = require("../controllers/feed");

const isAuthenticated = require("../middleware/authentication");

const route = express.Router();

route.post(
  "/add-post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuthenticated,
  addPost
);

route.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuthenticated,
  updateExistingPost
);

route.get("/posts", getPosts);

route.get("/post/:postId", getSinglePost);

route.delete("/post/:postId", isAuthenticated, deleteSinglePost);

module.exports = route;
