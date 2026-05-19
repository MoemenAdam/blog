import express from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  viewPost,
} from '../controllers/postController.js';

const router = express.Router();

router.route('/').get(getAllPosts).post(createPost);

router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);
router.route('/:id/view').get(viewPost);

export default router;
