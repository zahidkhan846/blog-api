const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCade = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Successfully fetched all posts",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed incorrect format. (minimum input size should be 5)"
    );
    error.statusCade = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    author: "Zahid Khan",
    imageUrl: "images/img1.jpg",
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};
