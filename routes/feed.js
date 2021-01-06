const express = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  addPost,
  getSinglePost,
  updateExistingPost,
  deleteSinglePost,
} = require("../controllers/feed");

const route = express.Router();

route.post(
  "/add-post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  addPost
);

route.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updateExistingPost
);

route.get("/posts", getPosts);

route.get("/post/:postId", getSinglePost);

route.delete("/post/:postId", deleteSinglePost);

module.exports = route;
