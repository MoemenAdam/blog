import PostModel from '../models/postModel.js';
import TagModel from '../models/tagModel.js';
import CategoryModel from '../models/categoryModel.js';

export const getAllDocs = async (req, res) => {
  const posts = await PostModel.countDocuments();
  const tags = await TagModel.countDocuments();
  const categories = await CategoryModel.countDocuments();

  res.status(200).json({
    posts,
    tags,
    categories,
  });
};
