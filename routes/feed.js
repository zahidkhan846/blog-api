const express = require("express");
const { body } = require("express-validator");
const { getPosts, addPost, getSinglePost } = require("../controllers/feed");

const route = express.Router();

route.get("/post/:postId", getSinglePost);

route.get("/posts", getPosts);

route.post(
  "/add-post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  addPost
);

module.exports = route;
