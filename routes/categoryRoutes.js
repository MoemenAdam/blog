import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getAllCategories).post(createCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
