const express = require("express");
const router = express.Router();
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require("../Controllers/blogController");
const { blogImgResize, uploadPhoto } = require("../Middlewares/uploadImages");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");

router.post('/', authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.put('/update-blog/:id', authMiddleware, isAdmin, updateBlog);
router.get('/get-blog/:id', authMiddleware, isAdmin, getBlog);
router.get('/get-all-blog', authMiddleware, isAdmin, getAllBlogs);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlog);


module.exports = router;