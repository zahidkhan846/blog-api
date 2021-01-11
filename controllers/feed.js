const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed incorrect format. (minimum input size should be 5)"
    );
    error.statusCade = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error(
      "Validation failed incorrect format. (No image found!)"
    );
    error.statusCade = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let author;

  const post = new Post({
    title: title,
    content: content,
    author: req.userId,
    imageUrl: imageUrl,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      author = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully",
        post: post,
        author: {
          _id: author._id,
          userName: author.userName,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

exports.updateExistingPost = (req, res, next) => {
  const postId = req.params.postId;
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
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error(
      "Validation failed incorrect format. (No image found!)"
    );
    error.statusCade = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCade = 404;
        throw error;
      }
      if (post.author.toString() !== req.userId) {
        const error = new Error("Could not find User.");
        error.statusCade = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post successfully updated!",
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

exports.deleteSinglePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCade = 404;
        throw error;
      }
      //CHECK USEWR IS AUTHENTICATED//

      if (post.author.toString() !== req.userId) {
        const err = new Error("Unauthenticated User");
        err.statusCode = 403;
        throw err;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post Deleted Successfully!" });
    })
    .catch((err) => {
      if (!err.statusCade) {
        err.statusCade = 500;
      }
      next(err);
    });
};

////HELPER FUNCTION BELOW////HELPER FUNCTION BELOW////HELPER FUNCTION BELOW////HELPER FUNCTION BELOW////

const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

//PAGINATION LOGIC

// exports.getPosts = (req, res, next) => {
//   const currentPage = req.params.currentPage || 1;
//   const itemsPerPage = 1;
//   let totalItems;
//   Post.find()
//     .countDocuments()
//     .then((postCount) => {
//       totalItems = postCount;
//       return Post.find()
//         .skip((currentPage - 1) * 1)
//         .limit(itemsPerPage);
//     })
//     .then((posts) => {
//       res.status(200).json({
//         message: "Successfully fetched all posts",
//         posts: posts,
//         totalItems: totalItems,
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCade) {
//         err.statusCade = 500;
//       }
//       next(err);
//     });
// };

////HELPER FUNCTION ABOVE////HELPER FUNCTION ABOVE////HELPER FUNCTION ABOVE////HELPER FUNCTION ABOVE////
