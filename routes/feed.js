const express = require("express");
const { getPosts, addPost } = require("../controllers/feed");

const route = express.Router();

route.get("/posts", getPosts);

route.post("/add-post", addPost);

module.exports = route;
