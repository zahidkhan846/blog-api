exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        id: 1,
        title: "First Post",
        content: "This is my First post!",
      },
      {
        id: 2,
        title: "Second Post",
        content: "This is my Second post!",
      },
      {
        id: 3,
        title: "Third Post",
        content: "This is my Third post!",
      },
    ],
  });
};

exports.addPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  //create into database

  res.status(201).json({
    message: "Post created successfully",
    post: {
      id: Math.random() * 10000,
      title: title,
      content: content,
    },
  });
};
