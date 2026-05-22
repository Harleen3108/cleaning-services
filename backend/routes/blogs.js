const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getBlogs)
  .post(protect, authorize('admin'), upload.single('image'), createBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('admin'), upload.single('image'), updateBlog)
  .delete(protect, authorize('admin'), deleteBlog);

module.exports = router;
