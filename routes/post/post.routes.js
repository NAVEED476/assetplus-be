const express = require("express");
const postRoutes = express.Router();
const posts = require("../../models/Post");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

postRoutes.get("/", async (req, res) => {
  try {
    const getPosts = await posts.find();
    res.status(200).send(getPosts);
  } catch (error) {
    res.status(500).send(error);
  }
});

postRoutes.post("/create", upload.single('image'), async (req, res) => {
  const { title, content, author, image } = req.body;

  try {
    if (!title.trim() || !content.trim() || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ifExist = await posts.findOne({ title: title });
    if (ifExist) {
      return res.status(409).json({ message: "Post title is already present" });
    }

    const newPost = new posts({
      title,
      content,
      author,
      image: req.file ? req.file.path : null 
    });

    const createNewPost = await newPost.save();
    console.log(createNewPost);
    res.status(201).json(createNewPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

postRoutes.put("/update/:id", upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const updateData = {
    title,
    content,
    author
  };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    if (!title.trim() || !content.trim() || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedPost = await posts.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


postRoutes.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await posts.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = postRoutes;
