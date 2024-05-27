const postRoutes  = require("express").Router();
const Post = require("../../models/Post");


postRoutes.get("/", async (req, res) => {
    try {
      const { title } = req.query;
      let query = {};
  
      if (title) {
        query.title = { $regex: title, $options: "i" };
      }
  
      const posts = await Post.find(query);
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  module.exports = postRoutes;