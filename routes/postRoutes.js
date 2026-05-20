import express from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  viewPost,
} from '../controllers/postController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/').get(getAllPosts).post(upload.single('image'), createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(upload.single('image'), updatePost)
  .delete(deletePost);
router.route('/:id/view').get(viewPost);

export default router;
