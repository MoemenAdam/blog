import express from 'express';
import {
  createTag,
  deleteTag,
  getAllTags,
  getTag,
  updateTag,
} from '../controllers/tagController.js';

const router = express.Router();

router.route('/').get(getAllTags).post(createTag);

router.route('/:id').get(getTag).patch(updateTag).delete(deleteTag);

export default router;
